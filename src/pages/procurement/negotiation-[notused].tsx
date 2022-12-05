import { Alert, Button, message, Progress } from "antd";
import Header from "components/common/header";
import { StateContext } from "context/state";
import AddNegotiation from "modules/procurement/negotiation/add";
import EditNegotiation from "modules/procurement/negotiation/edit";
import { FDataNegotiation, TDataNegotiation } from "modules/procurement/negotiation/models";
import NegotiationTable from "modules/procurement/negotiation/table";
import React, { useContext, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import negotiationService from "services/api-endpoints/procurement/negotiation";
import { AWS_PATH, KEY_UPLOAD_FILE } from "utils/constant";

// [FINISH]

const NegotiationPage = <T extends TDataNegotiation>() => {
    const { notificationInstance } = useContext(StateContext);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([query ? negotiationService.search : negotiationService.getAll, page, query], async () => {
        if (query) {
            const req = await negotiationService.Search({ page: page as any, query: query as any });
            return req.data.data;
        }
        const req = await negotiationService.GetAll({ page });
        return req.data.data;
    });

    const createMutation = useMutation(
        async (data: FDataNegotiation) => {
            await negotiationService.Create(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.doc_negotiation) return;
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
        },
        {
            onSuccess: () => {
                message.success("Negosiasi dibuat!");
                getList.refetch();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const editMutation = useMutation(
        async (data: FDataNegotiation) => {
            await negotiationService.Edit(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.doc_negotiation) return;
                    if (data.doc_negotiation?.includes(AWS_PATH)) return;
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
        },
        {
            onSuccess: () => {
                message.success("Negosiasi diedit!");
                getList.refetch();
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
    const addHandler = async (data: FDataNegotiation, callback: () => void) => {
        await createMutation.mutateAsync(data);
        callback();
    };
    const editHandler = async (data: FDataNegotiation, callback: () => void) => {
        await editMutation.mutateAsync(data);
        callback();
    };

    const onSearchHandler = (qr: string) => {
        setSearchParams({ page: "1", query: qr });
    };

    const errors = [getList, createMutation, editMutation];

    return (
        <div className="min-h-screen px-10">
            <EditNegotiation loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditNegotiation>
            <Header
                onSubmitSearch={onSearchHandler}
                title="Negosiasi"
                action={
                    <AddNegotiation loading={createMutation.isLoading} onSubmit={addHandler}>
                        {(data) => (
                            <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                Tambah Negosiasi
                            </Button>
                        )}
                    </AddNegotiation>
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <NegotiationTable onClickEdit={onClickEdit} fetcher={getList} />
        </div>
    );
};

export default NegotiationPage;
