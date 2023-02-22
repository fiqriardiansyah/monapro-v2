import { message, Progress } from "antd";
import { StateContext } from "context/state";
import { ContractSpNopes } from "models";
import EditContractSpNopes from "modules/procurement/contract-sp-nopes/edit";
import { FDataContractSpNopes } from "modules/procurement/contract-sp-nopes/models";
import React, { useContext, useRef } from "react";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import myActivityService from "services/api-endpoints/my-activity";
import contractService from "services/api-endpoints/procurement/contract";
import { AWS_PATH, KEY_UPLOAD_FILE } from "utils/constant";
import ContractSpNopesTable from "../contract-table";

const ContractActivity = () => {
    const { notificationInstance } = useContext(StateContext);

    const [searchParams] = useSearchParams();

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    const pageContract = searchParams.get("page_contract") || 1;
    const myContract = useQuery([myActivityService.getMyContract, pageContract], async () => {
        return (await myActivityService.GetMyContract({ page: pageContract })).data.data;
    });

    const editMutation = useMutation(
        async (data: FDataContractSpNopes) => {
            await contractService.Edit(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.doc) return;
                    if (data.doc?.includes(AWS_PATH)) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}create-contract`,
                        duration: percentCompleted >= 100 ? 1 : 0,
                        message: "Uploading File",
                        description: <Progress percent={percentCompleted} status="active" />,
                        placement: "bottomRight",
                    });
                },
            });
        },
        {
            onSuccess: () => {
                myContract.refetch();
                message.success("Kontrak diedit!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const onClickEdit = (data: ContractSpNopes) => {
        if (editTriggerRef.current) {
            editTriggerRef.current.dataset.data = JSON.stringify(data);
            editTriggerRef.current.click();
        }
    };

    const editHandler = async (data: FDataContractSpNopes, callback: () => void) => {
        await editMutation.mutateAsync(data);
        callback();
    };

    return (
        <>
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
            <div className="flex items-center justify-between">
                <h1 className="capitalize text-base font-semibold !text-gray-400 m-0 mb-5 mt-4">Kontrak/SPK/NOPES</h1>
            </div>
            <ContractSpNopesTable fetcher={myContract} onClickEdit={onClickEdit} />
        </>
    );
};

export default ContractActivity;
