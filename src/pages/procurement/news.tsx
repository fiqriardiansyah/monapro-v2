import { Alert } from "antd";
import Header from "components/common/header";
import { BasePaginationResponse, News } from "models";
import EditNews from "modules/procurement/news/edit";
import { TDataNews } from "modules/procurement/news/models";
import NewsTable from "modules/procurement/news/table";
import React, { useRef } from "react";
import { useMutation, useQuery } from "react-query";

const NewsPage = <T extends TDataNews>() => {
    const editTriggerRef = useRef<HTMLButtonElement | null>(null);
    // const detailTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([""], async () => {
        return {} as BasePaginationResponse<T>;
    });

    const deleteMutation = useMutation(async ({ id, callback }: { id: string; callback: () => void }) => {});

    const createMutation = useMutation(async ({ data, callback }: { data: News; callback: () => void }) => {});

    const editMutation = useMutation(async ({ data, callback }: { data: News; callback: () => void }) => {});

    // crud handler
    // const onClickDelete = (data: T, callback: () => void) => {
    //     deleteMutation.mutate({
    //         id: data.id as any,
    //         callback,
    //     });
    // };
    // const onClickDetail = (data: T) => {
    //     if (detailTriggerRef.current) {
    //         detailTriggerRef.current.dataset.data = JSON.stringify(data);
    //         detailTriggerRef.current.click();
    //     }
    // };
    const onClickEdit = (data: T) => {
        if (editTriggerRef.current) {
            editTriggerRef.current.dataset.data = JSON.stringify(data);
            editTriggerRef.current.click();
        }
    };
    // const addHandler = (data: News, callback: () => void) => {
    //     createMutation.mutate({
    //         data,
    //         callback: () => {
    //             callback();
    //         },
    //     });
    // };
    const editHandler = (data: News, callback: () => void) => {
        editMutation.mutate({
            data,
            callback: () => {
                callback();
            },
        });
    };

    const errors = [getList, deleteMutation, createMutation, editMutation];

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
            <Header title="News" />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <NewsTable
                onClickEdit={onClickEdit}
                // onClickDetail={onClickDetail}
                //  onClickDelete={onClickDelete}
                fetcher={getList}
            />
        </div>
    );
};

export default NewsPage;
