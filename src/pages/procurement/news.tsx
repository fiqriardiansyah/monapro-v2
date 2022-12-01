import { Alert, Button, message, Progress } from "antd";
import Header from "components/common/header";
import { StateContext } from "context/state";
import AddNews from "modules/procurement/news/add";
import EditNews from "modules/procurement/news/edit";
import { FDataNews, TDataNews } from "modules/procurement/news/models";
import NewsTable from "modules/procurement/news/table";
import React, { useContext, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import newsService from "services/api-endpoints/procurement/news";
import { AWS_PATH, KEY_UPLOAD_FILE } from "utils/constant";

// [FINISH]

const NewsPage = <T extends TDataNews>() => {
    const { notificationInstance } = useContext(StateContext);

    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([newsService.getAll, page], async () => {
        const req = await newsService.GetAll({ page });
        return req.data.data;
    });

    const createMutation = useMutation(
        async (data: FDataNews) => {
            await newsService.Create(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.file_bap && !data.file_bapp && !data.file_bar) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}create-news`,
                        duration: percentCompleted >= 100 ? 1 : 0,
                        message: "Uploading Files",
                        description: <Progress percent={percentCompleted} status="active" />,
                        placement: "bottomRight",
                    });
                },
            });
        },
        {
            onSuccess: () => {
                message.success("Berita acara dibuat!");
                getList.refetch();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const editMutation = useMutation(
        async (data: FDataNews) => {
            await newsService.Edit(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.file_bap && !data.file_bapp && !data.file_bar) return;
                    if (data.file_bap?.includes(AWS_PATH) && data.file_bapp?.includes(AWS_PATH) && data.file_bar?.includes(AWS_PATH)) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}create-news`,
                        duration: percentCompleted >= 100 ? 1 : 0,
                        message: "Uploading Files",
                        description: <Progress percent={percentCompleted} status="active" />,
                        placement: "bottomRight",
                    });
                },
            });
        },
        {
            onSuccess: () => {
                message.success("Berita acara diedit!");
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
    const addHandler = async (data: FDataNews, callback: () => void) => {
        await createMutation.mutateAsync(data);
        callback();
    };
    const editHandler = async (data: FDataNews, callback: () => void) => {
        await editMutation.mutateAsync(data);
        callback();
    };

    const errors = [getList, createMutation, editMutation];

    return (
        <div className="min-h-screen px-10">
            <EditNews loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditNews>
            <Header
                title="Berita Acara"
                action={
                    <AddNews loading={createMutation.isLoading} onSubmit={addHandler}>
                        {(data) => (
                            <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                Tambah Berita Acara
                            </Button>
                        )}
                    </AddNews>
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <NewsTable onClickEdit={onClickEdit} fetcher={getList} />
        </div>
    );
};

export default NewsPage;
