import { Alert, Button, message, Progress } from "antd";
import Header from "components/common/header";
import { StateContext } from "context/state";
import { UserContext } from "context/user";
import useIsForbidden from "hooks/useIsForbidden";
import { LoadType } from "models";
import AddRegulation from "modules/masterdata/regulation/add";
import EditRegulation from "modules/masterdata/regulation/edit";
import { FDataRegulation, TDataRegulation } from "modules/masterdata/regulation/models";
import RegulationTable from "modules/masterdata/regulation/table";
import React, { useContext, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import regulationService from "services/api-endpoints/masterdata/regulation";
import Utils from "utils";
import { AWS_PATH, KEY_UPLOAD_FILE } from "utils/constant";

// [FINISH]

const RegulationPage = <T extends TDataRegulation>() => {
    const { notificationInstance } = useContext(StateContext);

    const { state } = useContext(UserContext);
    const isForbidden = useIsForbidden({ roleAccess: state.user?.role_access, access: "master_data" });

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([query ? regulationService.search : regulationService.getAll, page, query], async () => {
        if (query) {
            const res = await regulationService.Search<LoadType>({ page: page as any, query: query as any });
            return Utils.toBaseTable<LoadType, T>(res.data.data);
        }
        const res = await regulationService.GetAll<LoadType>({ page });
        return Utils.toBaseTable<LoadType, T>(res.data.data);
    });

    const deleteMutation = useMutation(
        async ({ id, callback }: { id: string; callback: () => void }) => {
            await regulationService.Delete<LoadType>({ id });
            callback();
        },
        {
            onSuccess: (_, data) => {
                getList.refetch();
                message.success(`Regulation with id ${data.id} has been deleted`);
            },
            onError: (error: any, { callback }) => {
                message.error(error?.message);
                callback();
            },
        }
    );

    const createMutation = useMutation(
        async ({ data, callback }: { data: FDataRegulation; callback: () => void }) => {
            await regulationService.Create(data, {
                onUploadProgress: (eventUpload) => {
                    if (!data.document) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}create-negotiation`,
                        duration: percentCompleted >= 100 ? 1 : 0,
                        message: "Uploading File",
                        description: <Progress percent={percentCompleted} status="active" />,
                        placement: "bottomRight",
                    });
                },
            });
            callback();
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success(`Regulation has been created`);
            },
            onError: (error: any, { callback }) => {
                message.error(error?.message);
                callback();
            },
        }
    );

    const editMutation = useMutation(
        async ({ data, callback }: { data: TDataRegulation; callback: () => void }) => {
            await regulationService.Edit(data, {
                onUploadProgress: (eventUpload) => {
                    if (!data.document) return;
                    if (data.document?.includes(AWS_PATH)) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}create-negotiation`,
                        duration: percentCompleted >= 100 ? 1 : 0,
                        message: "Uploading File",
                        description: <Progress percent={percentCompleted} status="active" />,
                        placement: "bottomRight",
                    });
                },
            });
            callback();
        },
        {
            onSuccess: (_, data) => {
                getList.refetch();
                message.success(`Regulation with id ${data.data.id} has been edited`);
            },
            onError: (error: any, { callback }) => {
                message.error(error?.message);
                callback();
            },
        }
    );

    // crud handler
    const onClickDelete = (data: T, callback: () => void) => {
        deleteMutation.mutate({
            id: data.id as any,
            callback,
        });
    };
    const onClickEdit = (data: T) => {
        if (editTriggerRef.current) {
            editTriggerRef.current.dataset.data = JSON.stringify(data);
            editTriggerRef.current.click();
        }
    };
    const addHandler = (data: FDataRegulation, callback: () => void) => {
        createMutation.mutate({
            data,
            callback: () => {
                callback();
            },
        });
    };
    const editHandler = (data: TDataRegulation, callback: () => void) => {
        editMutation.mutate({
            data,
            callback: () => {
                callback();
            },
        });
    };

    const onSearchHandler = (qr: string) => {
        setSearchParams({ page: "1", query: qr });
    };

    const errors = [getList, deleteMutation, createMutation, editMutation];

    return (
        <div className="min-h-screen px-10">
            <EditRegulation loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditRegulation>
            <Header
                onSubmitSearch={onSearchHandler}
                title="Jenis Beban"
                action={
                    !isForbidden && (
                        <AddRegulation loading={createMutation.isLoading} onSubmit={addHandler}>
                            {(data) => (
                                <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                    Tambah Regulasi
                                </Button>
                            )}
                        </AddRegulation>
                    )
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <RegulationTable onClickDelete={onClickDelete} onClickEdit={onClickEdit} fetcher={getList} />
        </div>
    );
};

export default RegulationPage;
