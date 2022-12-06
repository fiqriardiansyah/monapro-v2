import { Alert, Button, message, Progress } from "antd";
import Header from "components/common/header";
import { StateContext } from "context/state";
import { AgendaDataLockBudgetData, BasePaginationResponse, Justification } from "models";
import AddJustification from "modules/procurement/justification/add";
import EditJustification from "modules/procurement/justification/edit";
import { FDataJustification, TDataJustification } from "modules/procurement/justification/models";
import JustificationTable from "modules/procurement/justification/table";
import React, { useContext, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import justificationService from "services/api-endpoints/procurement/justification";
import Utils from "utils";
import { AWS_PATH, KEY_UPLOAD_FILE } from "utils/constant";

const JustificationPage = <T extends TDataJustification>() => {
    const { notificationInstance } = useContext(StateContext);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([query ? justificationService.search : justificationService.getAll, page, query], async () => {
        if (query) {
            const res = await justificationService.Search<Justification>({ page: page as any, query: query as any });
            return Utils.toBaseTable<Justification, T>(res.data.data);
        }
        const res = await justificationService.GetAll<Justification>({ page });
        return Utils.toBaseTable<Justification, T>(res.data.data);
    });

    const createMutation = useMutation(
        async (data: FDataJustification) => {
            await justificationService.Create(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.doc_justification) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}create-justification`,
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
                message.success("Justifikasi dibuat!");
                getList.refetch();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const editMutation = useMutation(
        async (data: FDataJustification) => {
            await justificationService.Edit(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.doc_justification) return;
                    if (data.doc_justification.includes(AWS_PATH)) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}create-justification`,
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
                message.success("Justifikasi diedit!");
                getList.refetch();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const lockBudgetMutation = useMutation(
        async (data: AgendaDataLockBudgetData) => {
            await justificationService.LockBudget(data);
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success("Budget Lock Update!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    // crud handler
    const onClickLockBudget = async (data: T, callback: () => void) => {
        await lockBudgetMutation.mutateAsync({ id: data.id, lock_budget: data.lock_budget === 1 ? 0 : 1 });
        callback();
    };
    const onClickEdit = (data: T) => {
        if (editTriggerRef.current) {
            editTriggerRef.current.dataset.data = JSON.stringify(data);
            editTriggerRef.current.click();
        }
    };
    const addHandler = async (data: FDataJustification, callback: () => void) => {
        await createMutation.mutateAsync(data);
        callback();
    };
    const editHandler = async (data: FDataJustification, callback: () => void) => {
        await editMutation.mutateAsync(data);
        callback();
    };

    const onSearchHandler = (qr: string) => {
        setSearchParams({ page: "1", query: qr });
    };

    const errors = [getList, createMutation, editMutation];

    return (
        <div className="min-h-screen px-10">
            <EditJustification loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditJustification>
            <Header
                title="Justifikasi"
                onSubmitSearch={onSearchHandler}
                action={
                    <AddJustification loading={createMutation.isLoading} onSubmit={addHandler}>
                        {(data) => (
                            <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                Tambah Justifikasi
                            </Button>
                        )}
                    </AddJustification>
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <JustificationTable onClickLockBudget={onClickLockBudget} onClickEdit={onClickEdit} fetcher={getList} />
        </div>
    );
};

export default JustificationPage;
