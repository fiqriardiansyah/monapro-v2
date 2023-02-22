import { message, Progress } from "antd";
import { StateContext } from "context/state";
import { AgendaData } from "models";
import EditAgendaData from "modules/agenda/data/edit";
import { FDataAgenda } from "modules/agenda/data/models";
import React, { useContext, useRef } from "react";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import agendaDataService from "services/api-endpoints/agenda/agenda-data";
import myActivityService from "services/api-endpoints/my-activity";
import { AWS_PATH, KEY_UPLOAD_FILE } from "utils/constant";
import AgendaDataTable from "../agenda-table";

const AgendaActivity = () => {
    const { notificationInstance } = useContext(StateContext);
    const [searchParams] = useSearchParams();
    const pageAgenda = searchParams.get("page_agenda") || 1;

    const myAgenda = useQuery([myActivityService.getMyAgenda, pageAgenda], async () => {
        return (await myActivityService.GetMyAgenda({ page: pageAgenda })).data.data;
    });

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

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
                myAgenda.refetch();
                message.success("Agenda Data diedit!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const onClickEdit = (data: AgendaData) => {
        if (editTriggerRef.current) {
            editTriggerRef.current.dataset.data = JSON.stringify(data);
            editTriggerRef.current.click();
        }
    };

    const editHandler = async (data: FDataAgenda, callback: () => void) => {
        await editMutation.mutateAsync({ data });
        callback();
    };

    return (
        <>
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
            <div className="flex items-center justify-between">
                <h1 className="capitalize text-base font-semibold !text-gray-400 m-0 mb-5 mt-4">agenda</h1>
            </div>
            <AgendaDataTable fetcher={myAgenda} onClickEdit={onClickEdit} />
        </>
    );
};

export default AgendaActivity;
