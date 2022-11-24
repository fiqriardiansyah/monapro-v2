import { Alert, Button, message } from "antd";
import Header from "components/common/header";
import { BasePaginationResponse, Negotiation } from "models";
import AddNegotiation from "modules/procurement/negotiation/add";
import EditNegotiation from "modules/procurement/negotiation/edit";
import { FDataNegotiation, TDataNegotiation } from "modules/procurement/negotiation/models";
import NegotiationTable from "modules/procurement/negotiation/table";
import React, { useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import negotiationService from "services/api-endpoints/procurement/negotiation";

const NegotiationPage = <T extends TDataNegotiation>() => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([negotiationService.getAll], async () => {
        const req = await negotiationService.GetAll({ page });
        return req.data.data;
    });

    const createMutation = useMutation(
        async (data: FDataNegotiation) => {
            console.log(data);
        },
        {
            onSuccess: () => {
                message.success("Negosiasi dibuat!");
                getList.refetch();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const editMutation = useMutation(
        async (data: FDataNegotiation) => {
            console.log(data);
        },
        {
            onSuccess: () => {
                message.success("Negosiasi diedit!");
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
    const addHandler = async (data: FDataNegotiation, callback: () => void) => {
        await createMutation.mutateAsync(data);
        callback();
    };
    const editHandler = async (data: FDataNegotiation, callback: () => void) => {
        await editMutation.mutateAsync(data);
        callback();
    };

    const errors = [getList, createMutation, editMutation];

    return (
        <div className="min-h-screen px-10">
            <EditNegotiation loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditNegotiation>
            <Header
                title="Negosiasi"
                action={
                    <AddNegotiation loading={createMutation.isLoading} onSubmit={addHandler}>
                        {(data) => (
                            <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                Tambah Negosiasi
                            </Button>
                        )}
                    </AddNegotiation>
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <NegotiationTable onClickEdit={onClickEdit} fetcher={getList} />
        </div>
    );
};

export default NegotiationPage;
