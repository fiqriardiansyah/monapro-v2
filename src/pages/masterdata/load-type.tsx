import { Alert, Button } from "antd";
import Header from "components/common/header";
import { BasePaginationResponse, LoadType } from "models";
import AddLoadType from "modules/masterdata/load-type/add";
import DetailLoadType from "modules/masterdata/load-type/detail";
import EditLoadType from "modules/masterdata/load-type/edit";
import { TDataLoadType } from "modules/masterdata/load-type/models";
import LoadTypeTable from "modules/masterdata/load-type/table";
import React, { useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";

const LoadTypePage = <T extends TDataLoadType>() => {
    const editTriggerRef = useRef<HTMLButtonElement | null>(null);
    const detailTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([""], async () => {
        return {} as BasePaginationResponse<T>;
    });

    const deleteMutation = useMutation(async ({ id, callback }: { id: string; callback: () => void }) => {});

    const createMutation = useMutation(async ({ data, callback }: { data: LoadType; callback: () => void }) => {});

    const editMutation = useMutation(async ({ data, callback }: { data: LoadType; callback: () => void }) => {});

    // crud handler
    const onClickDelete = (data: T, callback: () => void) => {
        deleteMutation.mutate({
            id: data.id as any,
            callback,
        });
    };
    const onClickDetail = (data: T) => {
        if (detailTriggerRef.current) {
            detailTriggerRef.current.dataset.data = JSON.stringify(data);
            detailTriggerRef.current.click();
        }
    };
    const onClickEdit = (data: T) => {
        if (editTriggerRef.current) {
            editTriggerRef.current.dataset.data = JSON.stringify(data);
            editTriggerRef.current.click();
        }
    };
    const addHandler = (data: LoadType, callback: () => void) => {
        createMutation.mutate({
            data,
            callback: () => {
                callback();
            },
        });
    };
    const editHandler = (data: LoadType, callback: () => void) => {
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
            <EditLoadType loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditLoadType>
            <DetailLoadType>
                {(data) => (
                    <button
                        type="button"
                        ref={detailTriggerRef}
                        onClick={() => data.openModalWithData(detailTriggerRef.current?.dataset.data)}
                        className="hidden"
                    >
                        detail
                    </button>
                )}
            </DetailLoadType>
            <Header
                title="Load Type"
                action={
                    <AddLoadType loading={createMutation.isLoading} onSubmit={addHandler}>
                        {(data) => (
                            <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                Tambah beban
                            </Button>
                        )}
                    </AddLoadType>
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <LoadTypeTable onClickEdit={onClickEdit} onClickDetail={onClickDetail} onClickDelete={onClickDelete} fetcher={getList} />
        </div>
    );
};

export default LoadTypePage;
