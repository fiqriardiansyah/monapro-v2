import { Alert, Button, message } from "antd";
import Header from "components/common/header";
import { UserContext } from "context/user";
import useIsForbidden from "hooks/useIsForbidden";
import AddSop from "modules/masterdata/sop/add";
import { FDataSop, FDataSopId, TDataSop } from "modules/masterdata/sop/models";
import SopTable from "modules/masterdata/sop/table";
import React, { useContext, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import loadTypeService from "services/api-endpoints/masterdata/load-type";
import Utils from "utils";

const SopPage = <T extends TDataSop>() => {
    const { state } = useContext(UserContext);
    const isForbidden = useIsForbidden({ roleAccess: state.user?.role_access, access: "master_data" });

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);
    const detailTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([query ? loadTypeService.search : loadTypeService.getAll, page, query], async () => {
        return {} as any;
        // if (query) {
        //     const res = await loadTypeService.Search<LoadType>({ page: page as any, query: query as any });
        //     return Utils.toBaseTable<LoadType, T>(res.data.data);
        // }
        // const res = await loadTypeService.GetAll<LoadType>({ page });
        // return Utils.toBaseTable<LoadType, T>(res.data.data);
    });

    const deleteMutation = useMutation(
        async ({ id, callback }: { id: string; callback: () => void }) => {
            // await loadTypeService.Delete<LoadType>({ id });
            callback();
        },
        {
            onSuccess: (_, data) => {
                getList.refetch();
                message.success(`SOP with id ${data.id} has been deleted`);
            },
            onError: (error: any, { callback }) => {
                message.error(error?.message);
                callback();
            },
        }
    );
    const createMutation = useMutation(
        async ({ data, callback }: { data: FDataSop; callback: () => void }) => {
            // await loadTypeService.Create<LoadType>(data);
            callback();
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success(`SOP has been created`);
            },
            onError: (error: any, { callback }) => {
                message.error(error?.message);
                callback();
            },
        }
    );
    const editMutation = useMutation(
        async ({ data, callback }: { data: FDataSopId; callback: () => void }) => {
            // await loadTypeService.Edit<LoadType>(data);
            callback();
        },
        {
            onSuccess: (_, data) => {
                getList.refetch();
                message.success(`SOP with id ${data.data.id} has been edited`);
            },
            onError: (error: any, { callback }) => {
                message.error(error?.message);
                callback();
            },
        }
    );

    // crud handler
    const onClickDelete = (data: FDataSopId, callback: () => void) => {
        deleteMutation.mutate({
            id: data.id as any,
            callback,
        });
    };
    const onClickEdit = (data: FDataSopId) => {
        if (editTriggerRef.current) {
            editTriggerRef.current.dataset.data = JSON.stringify(data);
            editTriggerRef.current.click();
        }
    };
    const addHandler = (data: FDataSop, callback: () => void) => {
        createMutation.mutate({
            data,
            callback: () => {
                callback();
            },
        });
    };
    const editHandler = (data: FDataSopId, callback: () => void) => {
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
            {/* <EditLoadType loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditLoadType> */}
            <Header
                onSubmitSearch={onSearchHandler}
                title="Peraturan Internal"
                action={
                    !isForbidden && (
                        <AddSop loading={createMutation.isLoading} onSubmit={addHandler}>
                            {(data) => (
                                <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                    Tambah
                                </Button>
                            )}
                        </AddSop>
                    )
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <SopTable onClickEdit={onClickEdit} onClickDelete={onClickDelete} fetcher={getList} />
        </div>
    );
};

export default SopPage;
