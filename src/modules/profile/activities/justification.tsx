import { message, Progress, Tabs, TabsProps } from "antd";
import { StateContext } from "context/state";
import { AgendaDataLockBudgetData } from "models";
import EditJustification from "modules/procurement/justification/edit";
import { FDataJustification, TDataJustification } from "modules/procurement/justification/models";
import React, { useContext, useRef } from "react";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import myActivityService from "services/api-endpoints/my-activity";
import justificationService, { DeleteJustification } from "services/api-endpoints/procurement/justification";
import { AWS_PATH, KEY_UPLOAD_FILE, NON_JUSTIFICATION_TYPE, PROCUREMENT_TYPE, SPONSORSHIP_TYPE } from "utils/constant";
import JustificationTable from "../justification-table";

const JustificationActivity = () => {
    const { notificationInstance } = useContext(StateContext);

    const [searchParams, setSearchParams] = useSearchParams();
    const pageJustification = searchParams.get("page_justification") || 1;
    const typeJustification = (searchParams.get("type_justification") as any) || 1;

    const myJustification = useQuery([myActivityService.getMyJustification, pageJustification, typeJustification], async () => {
        return (await myActivityService.GetMyJustification({ page: pageJustification, type: typeJustification })).data.data;
    });

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    const lockBudgetMutation = useMutation(
        async (data: AgendaDataLockBudgetData) => {
            await justificationService.LockBudget(data);
        },
        {
            onSuccess: () => {
                myJustification.refetch();
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
                myJustification.refetch();
                message.success("Justifikasi dihapus!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const editMutation = useMutation(
        async (data: FDataJustification) => {
            await justificationService.Edit(data as any, {
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
                message.success("Justifikasi diedit!");
                myJustification.refetch();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const onClickDeleteHandler = async (data: TDataJustification, callback: () => void) => {
        await deleteMutation.mutateAsync({ id: data.id });
        callback();
    };
    const onClickLockBudget = async (data: TDataJustification, callback: () => void) => {
        await lockBudgetMutation.mutateAsync({ id: data.id, lock_budget: data.lock_budget === 1 ? 0 : 1 });
        callback();
    };
    const onClickEdit = (data: TDataJustification) => {
        if (editTriggerRef.current) {
            editTriggerRef.current.dataset.data = JSON.stringify(data);
            editTriggerRef.current.click();
        }
    };
    const editHandler = async (data: FDataJustification, callback: () => void) => {
        await editMutation.mutateAsync(data);
        callback();
    };

    const onChange = (index: any) => {
        searchParams.set("type_justification", index);
        searchParams.set("page_justification", "1");
        setSearchParams(searchParams);
    };

    const items: TabsProps["items"] = [
        {
            key: SPONSORSHIP_TYPE.toString(),
            label: `Sponsorship`,
        },
        {
            key: PROCUREMENT_TYPE.toString(),
            label: `Procurement`,
        },
        {
            key: NON_JUSTIFICATION_TYPE.toString(),
            label: `Non Justifikasi`,
        },
    ];

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="capitalize text-base font-semibold !text-gray-400 m-0 mb-5 mt-4">justifikasi</h1>
            </div>
            <EditJustification type={Number(typeJustification)} loading={editMutation.isLoading} onSubmit={editHandler}>
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
            <Tabs defaultActiveKey={typeJustification} items={items} onChange={onChange} />
            <JustificationTable
                type={typeJustification}
                fetcher={myJustification}
                onClickDeleteJustif={onClickDeleteHandler}
                onClickLockBudget={onClickLockBudget}
                onClickEdit={onClickEdit}
            />
        </>
    );
};

export default JustificationActivity;
