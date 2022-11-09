import { Alert } from "antd";
import Header from "components/common/header";
import { BasePaginationResponse, ContractSpNopes } from "models";
import EditContractSpNopes from "modules/procurement/contract-sp-nopes/edit";
import { TDataContractSpNopes } from "modules/procurement/contract-sp-nopes/models";
import ContractSpNopesTable from "modules/procurement/contract-sp-nopes/table";
import React, { useRef } from "react";
import { useMutation, useQuery } from "react-query";

const ContractPage = <T extends TDataContractSpNopes>() => {
    const editTriggerRef = useRef<HTMLButtonElement | null>(null);
    // const detailTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([""], async () => {
        return {} as BasePaginationResponse<T>;
    });

    const deleteMutation = useMutation(async ({ id, callback }: { id: string; callback: () => void }) => {});

    const createMutation = useMutation(async ({ data, callback }: { data: ContractSpNopes; callback: () => void }) => {});

    const editMutation = useMutation(async ({ data, callback }: { data: ContractSpNopes; callback: () => void }) => {});

    // crud handler
    const onClickDelete = (data: T, callback: () => void) => {
        deleteMutation.mutate({
            id: data.id as any,
            callback,
        });
    };
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
    // const addHandler = (data: ContractSpNopes, callback: () => void) => {
    //     createMutation.mutate({
    //         data,
    //         callback: () => {
    //             callback();
    //         },
    //     });
    // };
    const editHandler = (data: ContractSpNopes, callback: () => void) => {
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
            <Header title="ContractSpNopes" />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <ContractSpNopesTable
                onClickEdit={onClickEdit}
                // onClickDetail={onClickDetail}
                onClickDelete={onClickDelete}
                fetcher={getList}
            />
        </div>
    );
};

export default ContractPage;
