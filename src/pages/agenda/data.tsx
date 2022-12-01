import { Alert, Button, message, Progress } from "antd";
import Header from "components/common/header";
import { StateContext } from "context/state";
import { AgendaData, AgendaDataLockBudgetData } from "models";
import AddAgendaData from "modules/agenda/data/add";
import EditAgendaData from "modules/agenda/data/edit";
import { FDataAgenda, TDataAgenda } from "modules/agenda/data/models";
import AgendaDataTable from "modules/agenda/data/table";
import React, { useContext, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import agendaDataService from "services/api-endpoints/agenda/agenda-data";
import Utils from "utils";
import { AWS_PATH, KEY_UPLOAD_FILE } from "utils/constant";

// [FINISH]

const AgendaDataPage = <T extends TDataAgenda>() => {
    const { notificationInstance } = useContext(StateContext);

    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([agendaDataService.getAll, page], async () => {
        const res = await agendaDataService.GetAll<AgendaData>({ page });
        return Utils.toBaseTable<AgendaData, T>(res.data.data);
    });

    const lockBudgetMutation = useMutation(
        async (data: AgendaDataLockBudgetData) => {
            await agendaDataService.LockBudget(data);
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success("Budget Locked!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const createMutation = useMutation(
        async ({ data }: { data: FDataAgenda }) => {
            await agendaDataService.Create(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.document) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}create-agenda`,
                        duration: percentCompleted >= 100 ? 1 : 0,
                        message: "Uploading File",
                        description: <Progress percent={percentCompleted} status="active" />,
                        placement: "bottomRight",
                    });
                },
            });
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success("Agenda Data dibuat!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const editMutation = useMutation(
        async ({ data }: { data: FDataAgenda }) => {
            await agendaDataService.Edit(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.document) return;
                    if (data.document.includes(AWS_PATH)) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}edit-agenda`,
                        duration: percentCompleted >= 100 ? 1 : 0,
                        message: "Uploading File",
                        description: <Progress percent={percentCompleted} status="active" />,
                        placement: "bottomRight",
                    });
                },
            });
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success("Agenda Data diedit!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    // crud handler
    const onClickEdit = (data: T) => {
        if (editTriggerRef.current) {
            editTriggerRef.current.dataset.data = JSON.stringify(data);
            editTriggerRef.current.click();
        }
    };
    const onClickLockBudget = async (data: T, callback: () => void) => {
        await lockBudgetMutation.mutateAsync({ id: data.id, lock_budget: 1 });
        callback();
    };
    const addHandler = async (data: FDataAgenda, callback: () => void) => {
        await createMutation.mutateAsync({ data });
        callback();
    };
    const editHandler = async (data: FDataAgenda, callback: () => void) => {
        await editMutation.mutateAsync({ data });
        callback();
    };

    const errors = [getList, createMutation, editMutation];

    return (
        <div className="min-h-screen px-10">
            <EditAgendaData loading={editMutation.isLoading} onSubmit={editHandler}>
                {(data) => (
                    <button
                        type="button"
                        ref={editTriggerRef}
                        onClick={() => data.openModalWithData(editTriggerRef.current?.dataset.data)}
                        className="hidden"
                    >
                        edit
                    </button>
                )}
            </EditAgendaData>
            <Header
                title="Data Agenda"
                action={
                    <AddAgendaData loading={createMutation.isLoading} onSubmit={addHandler}>
                        {(data) => (
                            <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                Tambah Agenda
                            </Button>
                        )}
                    </AddAgendaData>
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <AgendaDataTable onClickLockBudget={onClickLockBudget} onClickEdit={onClickEdit} fetcher={getList} />
        </div>
    );
};

export default AgendaDataPage;
