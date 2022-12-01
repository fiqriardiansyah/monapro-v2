import { Alert, Button, message } from "antd";
import Header from "components/common/header";
import { SubUnitData } from "models";
import AddSubUnit from "modules/masterdata/sub-unit/add";
import EditSubUnit from "modules/masterdata/sub-unit/edit";
import { TDataSubUnit } from "modules/masterdata/sub-unit/models";
import SubUnitTable from "modules/masterdata/sub-unit/table";
import React, { useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import subUnitService from "services/api-endpoints/masterdata/sub-unit";
import Utils from "utils";

// [FINISH]

const SubUnitPage = <T extends TDataSubUnit>() => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);
    const detailTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([query ? subUnitService.search : subUnitService.getAll, page, query], async () => {
        if (query) {
            const res = await subUnitService.Search<SubUnitData>({ page: page as any, query: query as any });
            return Utils.toBaseTable<SubUnitData, T>(res.data.data);
        }
        const res = await subUnitService.GetAll<SubUnitData>({ page });
        return Utils.toBaseTable<SubUnitData, T>(res.data.data);
    });

    const deleteMutation = useMutation(
        async ({ id, callback }: { id: string; callback: () => void }) => {
            await subUnitService.Delete<SubUnitData>({ id });
            callback();
        },
        {
            onSuccess: (_, data) => {
                getList.refetch();
                message.success(`Sub unit with id ${data.id} has been deleted`);
            },
            onError: (error: any, { callback }) => {
                message.error(error?.message);
                callback();
            },
        }
    );

    const createMutation = useMutation(
        async ({ data, callback }: { data: SubUnitData; callback: () => void }) => {
            await subUnitService.Create<SubUnitData>(data);
            callback();
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success(`Sub unit has been created`);
            },
            onError: (error: any, { callback }) => {
                message.error(error?.message);
                callback();
            },
        }
    );

    const editMutation = useMutation(
        async ({ data, callback }: { data: SubUnitData; callback: () => void }) => {
            await subUnitService.Edit<SubUnitData>(data);
            callback();
        },
        {
            onSuccess: (_, data) => {
                getList.refetch();
                message.success(`Sub unit with id ${data.data.id} has been edited`);
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

    const onSearchHandler = (qr: string) => {
        setSearchParams({ page: "1", query: qr });
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
            <Header
                onSubmitSearch={onSearchHandler}
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
            <SubUnitTable fetcher={getList} onClickEdit={onClickEdit} onClickDetail={onClickDetail} onClickDelete={onClickDelete} />
        </div>
    );
};

export default SubUnitPage;
