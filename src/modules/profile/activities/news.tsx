import { message, Progress } from "antd";
import { StateContext } from "context/state";
import EditNews from "modules/procurement/news/edit";
import { FDataNews } from "modules/procurement/news/models";
import React, { useContext, useRef } from "react";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import myActivityService from "services/api-endpoints/my-activity";
import newsService from "services/api-endpoints/procurement/news";
import { AWS_PATH, KEY_UPLOAD_FILE } from "utils/constant";
import NewsTable from "../news-table";

const NewsActivity = () => {
    const { notificationInstance } = useContext(StateContext);

    const [searchParams] = useSearchParams();

    const pageNews = searchParams.get("page_news") || 1;

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    const myNews = useQuery([myActivityService.getMyNews, pageNews], async () => {
        return (await myActivityService.GetMyNews({ page: pageNews })).data.data;
    });

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
                myNews.refetch();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const onClickEdit = (data: FDataNews) => {
        if (editTriggerRef.current) {
            editTriggerRef.current.dataset.data = JSON.stringify(data);
            editTriggerRef.current.click();
        }
    };

    const editHandler = async (data: FDataNews, callback: () => void) => {
        await editMutation.mutateAsync(data);
        callback();
    };

    return (
        <>
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
            <div className="flex items-center justify-between">
                <h1 className="capitalize text-base font-semibold !text-gray-400 m-0 mb-5 mt-4">Berita Acara</h1>
            </div>
            <NewsTable fetcher={myNews} onClickEdit={onClickEdit} />
        </>
    );
};

export default NewsActivity;
