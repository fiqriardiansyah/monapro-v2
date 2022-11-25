import { Alert, Button, message } from "antd";
import Header from "components/common/header";
import { AgendaFinance, IsPaid } from "models";
import AddAgendaFinance from "modules/agenda/finance/add";
import EditAgendaFinance from "modules/agenda/finance/edit";
import { FDataAgendaFinance } from "modules/agenda/finance/models";
import AgendaFinanceTable from "modules/agenda/finance/table";
import React, { useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import agendaFinanceService from "services/api-endpoints/agenda/agenda-finance";

const AgendaFinancePage = <T extends AgendaFinance>() => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([agendaFinanceService.getAll, page], async () => {
        const req = await agendaFinanceService.GetAll({ page });
        return req.data.data;
    });

    const createMutation = useMutation(
        async (data: FDataAgendaFinance) => {
            // await agendaDispositionService.Create(data as any);
            console.log(data);
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success("Agenda Finance dibuat!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const editMutation = useMutation(
        async (data: FDataAgendaFinance) => {
            // await agendaDispositionService.Edit(data as any);
            console.log(data);
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success("Agenda Finance diedit!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const setPaidMutation = useMutation(
        async (data: IsPaid) => {
            await agendaFinanceService.SetPaid(data);
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success("Bayar dikunci!");
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
    const onClickPaidHandler = async (data: any, callback: () => void) => {
        await setPaidMutation.mutateAsync({ id: data.id, isPaid: 1 });
        callback();
    };
    const addHandler = async (data: FDataAgendaFinance, callback: () => void) => {
        await createMutation.mutateAsync(data);
        callback();
    };
    const editHandler = async (data: FDataAgendaFinance, callback: () => void) => {
        await editMutation.mutateAsync(data);
        callback();
    };

    const errors = [getList, createMutation, editMutation];

    return (
        <div className="min-h-screen px-10">
            <EditAgendaFinance loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditAgendaFinance>
            <Header
                title="Finance Agenda"
                action={
                    <AddAgendaFinance loading={createMutation.isLoading} onSubmit={addHandler}>
                        {(data) => (
                            <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                Tambah Agenda Finance
                            </Button>
                        )}
                    </AddAgendaFinance>
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <AgendaFinanceTable onClickEdit={onClickEdit} fetcher={getList} onClickPaid={onClickPaidHandler} />
        </div>
    );
};

export default AgendaFinancePage;
