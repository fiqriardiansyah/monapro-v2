import { Alert, Button } from "antd";
import Header from "components/common/header";
import { BasePaginationResponse, SubUnitData } from "models";
import AddSubUnit from "modules/masterdata/sub-unit/add";
import DetailSubUnit from "modules/masterdata/sub-unit/detail";
import EditSubUnit from "modules/masterdata/sub-unit/edit";
import { TDataSubUnit } from "modules/masterdata/sub-unit/models";
import SubUnitTable from "modules/masterdata/sub-unit/table";
import React, { useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";

const SubUnitPage = <T extends TDataSubUnit>() => {
    const editTriggerRef = useRef<HTMLButtonElement | null>(null);
    const detailTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([""], async () => {
        return {} as BasePaginationResponse<T>;
    });

    const deleteMutation = useMutation(async ({ id, callback }: { id: string; callback: () => void }) => {});

    const createMutation = useMutation(async ({ data, callback }: { data: SubUnitData; callback: () => void }) => {});

    const editMutation = useMutation(async ({ data, callback }: { data: SubUnitData; callback: () => void }) => {});

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
    const addHandler = (data: SubUnitData, callback: () => void) => {
        createMutation.mutate({
            data,
            callback: () => {
                callback();
            },
        });
    };
    const editHandler = (data: SubUnitData, callback: () => void) => {
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
            <EditSubUnit loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditSubUnit>
            <DetailSubUnit>
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
            </DetailSubUnit>
            <Header
                title="Sub Unit"
                action={
                    <AddSubUnit loading={createMutation.isLoading} onSubmit={addHandler}>
                        {(data) => (
                            <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                Tambah role
                            </Button>
                        )}
                    </AddSubUnit>
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <SubUnitTable onClickEdit={onClickEdit} onClickDetail={onClickDetail} onClickDelete={onClickDelete} fetcher={getList} />
        </div>
    );
};

export default SubUnitPage;
