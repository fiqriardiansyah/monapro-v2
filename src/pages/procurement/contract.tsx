import { Alert, Button, message, Progress } from "antd";
import Header from "components/common/header";
import { StateContext } from "context/state";
import { UserContext } from "context/user";
import useIsForbidden from "hooks/useIsForbidden";
import AddContract from "modules/procurement/contract-sp-nopes/add";
import EditContractSpNopes from "modules/procurement/contract-sp-nopes/edit";
import { FDataContractSpNopes, TDataContractSpNopes } from "modules/procurement/contract-sp-nopes/models";
import ContractSpNopesTable from "modules/procurement/contract-sp-nopes/table";
import React, { useContext, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import contractService from "services/api-endpoints/procurement/contract";
import { AWS_PATH, KEY_UPLOAD_FILE } from "utils/constant";

// [FINISH]

const ContractPage = <T extends TDataContractSpNopes>() => {
    const { notificationInstance } = useContext(StateContext);
    const { state } = useContext(UserContext);
    const isForbidden = useIsForbidden({ roleAccess: state.user?.role_access, access: "justification" });

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([query ? contractService.search : contractService.getAll, page, query], async () => {
        if (query) {
            const req = await contractService.Search({ page: page as any, query: query as any });
            return req.data.data;
        }
        const req = await contractService.GetAll({ page });
        return req.data.data;
    });

    const createMutation = useMutation(
        async (data: FDataContractSpNopes) => {
            await contractService.Create(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.doc) return;
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

    const onSearchHandler = (qr: string) => {
        setSearchParams({ page: "1", query: qr });
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
                onSubmitSearch={onSearchHandler}
                title="Kontrak/SP/NOPES"
                // action={
                //     !isForbidden && (
                //         <AddContract loading={createMutation.isLoading} onSubmit={addHandler}>
                //             {(data) => (
                //                 <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                //                     Tambah Kontrak
                //                 </Button>
                //             )}
                //         </AddContract>
                //     )
                // }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <ContractSpNopesTable onClickEdit={onClickEdit} fetcher={getList} />
        </div>
    );
};

export default ContractPage;
