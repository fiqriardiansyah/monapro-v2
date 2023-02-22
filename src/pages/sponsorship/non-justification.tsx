import { Alert, Button, message, Progress } from "antd";
import Header from "components/common/header";
import { StateContext } from "context/state";
import { UserContext } from "context/user";
import useIsForbidden from "hooks/useIsForbidden";
import { AgendaDataLockBudgetData, Justification } from "models";
import AddNonJustification from "modules/procurement/justification/add-non";
import EditJustification from "modules/procurement/justification/edit";
import { FDataJustification, TDataJustification } from "modules/procurement/justification/models";
import NonJustificationTable from "modules/procurement/justification/non-table";
import React, { useContext, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import justificationService, { DeleteJustification } from "services/api-endpoints/procurement/justification";
import Utils from "utils";
import { AWS_PATH, KEY_UPLOAD_FILE, NON_JUSTIFICATION_TYPE } from "utils/constant";

const NonJustificationPage = <T extends TDataJustification>() => {
    const { notificationInstance } = useContext(StateContext);
    const { state } = useContext(UserContext);
    const isForbidden = useIsForbidden({ roleAccess: state.user?.role_access, access: "justification" });

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([query ? justificationService.searchNon : justificationService.getAllNon, page, query], async () => {
        if (query) {
            const res = await justificationService.SearchNon<Justification>({ page: page as any, query: query as any });
            return Utils.toBaseTable<Justification, T>(res.data.data);
        }
        const res = await justificationService.GetAllNon<Justification>({ page });
        return Utils.toBaseTable<Justification, T>(res.data.data);
    });

    const createMutation = useMutation(
        async (data: FDataJustification) => {
            await justificationService.CreateNon(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.doc_justification) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}create-justification`,
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
                message.success("Non Justifikasi dibuat!");
                getList.refetch();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const editMutation = useMutation(
        async (data: FDataJustification) => {
            await justificationService.EditNon(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.doc_justification) return;
                    if (data.doc_justification.includes(AWS_PATH)) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}create-justification`,
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
                message.success("Non Justifikasi diedit!");
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
                message.success("Budget Lock Update!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const deleteMutation = useMutation(
        async (data: DeleteJustification) => {
            await justificationService.DeleteJustification(data);
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success("Justifikasi dihapus!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    // crud handler
    const onClickDeleteHandler = async (data: T, callback: () => void) => {
        await deleteMutation.mutateAsync({ id: data.id });
        callback();
    };
    const onClickLockBudget = async (data: T, callback: () => void) => {
        await lockBudgetMutation.mutateAsync({ id: data.id, lock_budget: data.lock_budget === 1 ? 0 : 1 });
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

    const onSearchHandler = (qr: string) => {
        setSearchParams({ page: "1", query: qr });
    };

    const errors = [getList, createMutation, editMutation];

    return (
        <div className="min-h-screen px-10">
            <EditJustification type={NON_JUSTIFICATION_TYPE} loading={editMutation.isLoading} onSubmit={editHandler}>
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
                title="Non Justifikasi"
                onSubmitSearch={onSearchHandler}
                action={
                    !isForbidden && (
                        <AddNonJustification loading={createMutation.isLoading} onSubmit={addHandler}>
                            {(data) => (
                                <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                    Tambah Non Justifikasi
                                </Button>
                            )}
                        </AddNonJustification>
                    )
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <NonJustificationTable
                onClickDeleteJustif={onClickDeleteHandler}
                onClickLockBudget={onClickLockBudget}
                onClickEdit={onClickEdit}
                fetcher={getList}
            />
        </div>
    );
};

export default NonJustificationPage;
