import { Alert, Button, message } from "antd";
import Header from "components/common/header";
import { BasePaginationResponse, ContractSpNopes } from "models";
import AddContract from "modules/procurement/contract-sp-nopes/add";
import EditContractSpNopes from "modules/procurement/contract-sp-nopes/edit";
import { FDataContractSpNopes, TDataContractSpNopes } from "modules/procurement/contract-sp-nopes/models";
import ContractSpNopesTable from "modules/procurement/contract-sp-nopes/table";
import React, { useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import contractService from "services/api-endpoints/procurement/contract";

const ContractPage = <T extends TDataContractSpNopes>() => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([contractService.getAll], async () => {
        const req = await contractService.GetAll({ page });
        return req.data.data;
    });

    const createMutation = useMutation(
        async (data: FDataContractSpNopes) => {
            console.log(data);
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success("Kontrak dibuat!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const editMutation = useMutation(
        async (data: FDataContractSpNopes) => {
            console.log(data);
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success("Kontrak diedit!");
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
    const addHandler = async (data: FDataContractSpNopes, callback: () => void) => {
        await createMutation.mutateAsync(data);
        callback();
    };
    const editHandler = async (data: FDataContractSpNopes, callback: () => void) => {
        await editMutation.mutateAsync(data);
        callback();
    };

    const errors = [getList, createMutation, editMutation];

    return (
        <div className="min-h-screen px-10">
            <EditContractSpNopes loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditContractSpNopes>
            <Header
                title="Kontrak/SP/NOPES"
                action={
                    <AddContract loading={createMutation.isLoading} onSubmit={addHandler}>
                        {(data) => (
                            <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                Tambah Kontrak
                            </Button>
                        )}
                    </AddContract>
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <ContractSpNopesTable onClickEdit={onClickEdit} fetcher={getList} />
        </div>
    );
};

export default ContractPage;
