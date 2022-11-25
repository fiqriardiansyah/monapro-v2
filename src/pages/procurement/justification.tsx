import { Alert, Button, message } from "antd";
import Header from "components/common/header";
import { AgendaDataLockBudgetData, BasePaginationResponse, Justification } from "models";
import AddJustification from "modules/procurement/justification/add";
import EditJustification from "modules/procurement/justification/edit";
import { FDataJustification, TDataJustification } from "modules/procurement/justification/models";
import JustificationTable from "modules/procurement/justification/table";
import React, { useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import justificationService from "services/api-endpoints/procurement/justification";
import Utils from "utils";

const JustificationPage = <T extends TDataJustification>() => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([justificationService.getAll], async () => {
        const res = await justificationService.GetAll<Justification>({ page });
        return Utils.toBaseTable<Justification, T>(res.data.data);
    });

    const createMutation = useMutation(
        async (data: FDataJustification) => {
            await justificationService.Create(data as any);
        },
        {
            onSuccess: () => {
                message.success("Justifikasi dibuat!");
                getList.refetch();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const editMutation = useMutation(
        async (data: FDataJustification) => {
            await justificationService.Edit(data as any);
        },
        {
            onSuccess: () => {
                message.success("Justifikasi diedit!");
                getList.refetch();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const lockBudgetMutation = useMutation(
        async (data: AgendaDataLockBudgetData) => {
            await justificationService.LockBudget(data);
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success("Budget Locked!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    // crud handler
    const onClickLockBudget = async (data: T, callback: () => void) => {
        await lockBudgetMutation.mutateAsync({ id: data.id, lock_budget: 1 });
        callback();
    };
    const onClickEdit = (data: T) => {
        if (editTriggerRef.current) {
            editTriggerRef.current.dataset.data = JSON.stringify(data);
            editTriggerRef.current.click();
        }
    };
    const addHandler = async (data: FDataJustification, callback: () => void) => {
        await createMutation.mutateAsync(data);
        callback();
    };
    const editHandler = async (data: FDataJustification, callback: () => void) => {
        await editMutation.mutateAsync(data);
        callback();
    };

    const errors = [getList, createMutation, editMutation];

    return (
        <div className="min-h-screen px-10">
            <EditJustification loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditJustification>
            <Header
                title="Justifikasi"
                action={
                    <AddJustification loading={createMutation.isLoading} onSubmit={addHandler}>
                        {(data) => (
                            <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                Tambah Justifikasi
                            </Button>
                        )}
                    </AddJustification>
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <JustificationTable onClickLockBudget={onClickLockBudget} onClickEdit={onClickEdit} fetcher={getList} />
        </div>
    );
};

export default JustificationPage;
