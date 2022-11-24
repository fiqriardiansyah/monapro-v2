import { Alert, Button, message } from "antd";
import Header from "components/common/header";
import { AgendaData, AgendaDataLockBudgetData, BasePaginationResponse, SelectOption } from "models";
import AddAgendaData from "modules/agenda/data/add";
import EditAgendaData from "modules/agenda/data/edit";
import { FDataAgenda, TDataAgenda } from "modules/agenda/data/models";
import AgendaDataTable from "modules/agenda/data/table";
import React, { useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import agendaService from "services/api-endpoints/agenda";
import agendaDataService from "services/api-endpoints/agenda/agenda-data";
import Utils from "utils";

const AgendaDataPage = <T extends TDataAgenda>() => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([agendaDataService.getAll], async () => {
        const res = await agendaDataService.GetAll<AgendaData>({ page });
        return Utils.toBaseTable<AgendaData, T>(res.data.data);
    });

    const lockBudgetMutation = useMutation(
        async (data: AgendaDataLockBudgetData) => {
            await agendaDataService.LockBudget(data);
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

    const createMutation = useMutation(
        async ({ data }: { data: FDataAgenda }) => {
            console.log(data);
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success("Agenda Data dibuat!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const editMutation = useMutation(
        async ({ data }: { data: FDataAgenda }) => {
            console.log(data);
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success("Agenda Data diedit!");
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
    const onClickLockBudget = async (data: T, callback: () => void) => {
        await lockBudgetMutation.mutateAsync({ id: data.id, lock_budget: 1 });
        callback();
    };
    const addHandler = async (data: FDataAgenda, callback: () => void) => {
        await createMutation.mutateAsync({ data });
        callback();
    };
    const editHandler = async (data: FDataAgenda, callback: () => void) => {
        await editMutation.mutateAsync({ data });
        callback();
    };

    const errors = [getList, createMutation, editMutation];

    return (
        <div className="min-h-screen px-10">
            <EditAgendaData loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditAgendaData>
            <Header
                title="Agenda Data"
                action={
                    <AddAgendaData loading={createMutation.isLoading} onSubmit={addHandler}>
                        {(data) => (
                            <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                Tambah Agenda
                            </Button>
                        )}
                    </AddAgendaData>
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <AgendaDataTable onClickLockBudget={onClickLockBudget} onClickEdit={onClickEdit} fetcher={getList} />
        </div>
    );
};

export default AgendaDataPage;
