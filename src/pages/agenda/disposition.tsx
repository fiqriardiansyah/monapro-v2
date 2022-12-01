import { Alert, Button, message, Progress } from "antd";
import Header from "components/common/header";
import { StateContext } from "context/state";
import { AgendaDisposition } from "models";
import AddAgendaDisposition from "modules/agenda/disposition/add";
import EditAgendaDisposition from "modules/agenda/disposition/edit";
import { FDataAgendaDisposition } from "modules/agenda/disposition/models";
import AgendaDispositionTable from "modules/agenda/disposition/table";
import React, { useContext, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import agendaDispositionService from "services/api-endpoints/agenda/agenda-disposition";
import { AWS_PATH, KEY_UPLOAD_FILE } from "utils/constant";

// [FINISH]

const AgendaDispositionPage = <T extends AgendaDisposition>() => {
    const { notificationInstance } = useContext(StateContext);

    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([agendaDispositionService.getAll, page], async () => {
        const req = await agendaDispositionService.GetAll({ page });
        return req.data.data;
    });

    const createMutation = useMutation(
        async (data: FDataAgendaDisposition) => {
            await agendaDispositionService.Create(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.disposition_doc) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}create-disposition`,
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
                message.success("Disposisi dibuat!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const editMutation = useMutation(
        async (data: FDataAgendaDisposition) => {
            await agendaDispositionService.Edit(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.disposition_doc) return;
                    if (data.disposition_doc.includes(AWS_PATH)) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}create-disposition`,
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
                message.success("Disposisi diedit!");
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
    const addHandler = async (data: FDataAgendaDisposition, callback: () => void) => {
        await createMutation.mutateAsync(data);
        callback();
    };
    const editHandler = async (data: FDataAgendaDisposition, callback: () => void) => {
        await editMutation.mutateAsync(data);
        callback();
    };

    const errors = [getList, createMutation, editMutation];

    return (
        <div className="min-h-screen px-10">
            <EditAgendaDisposition loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditAgendaDisposition>
            <Header
                title="Disposisi Agenda"
                action={
                    <AddAgendaDisposition loading={createMutation.isLoading} onSubmit={addHandler}>
                        {(data) => (
                            <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                Tambah Disposisi
                            </Button>
                        )}
                    </AddAgendaDisposition>
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <AgendaDispositionTable onClickEdit={onClickEdit} fetcher={getList} />
        </div>
    );
};

export default AgendaDispositionPage;
