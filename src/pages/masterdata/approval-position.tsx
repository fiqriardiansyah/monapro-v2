import { Alert, Button, message } from "antd";
import { AiOutlinePlus } from "react-icons/ai";
import Header from "components/common/header";
import { ApprovalPosition, BasePaginationResponse, BaseTableData } from "models";
import AddApprovalPosition from "modules/masterdata/approval-position/add";
import { TDataApprovalPosition } from "modules/masterdata/approval-position/models";
import ApprovalPositionTable from "modules/masterdata/approval-position/table";
import React, { useRef } from "react";
import { useMutation, useQuery } from "react-query";
import EditApprovalPosition from "modules/masterdata/approval-position/edit";
import DetailApprovalPosition from "modules/masterdata/approval-position/detail";
import approvalPositionService from "services/api-endpoints/masterdata/approval-position";
import Utils from "utils";
import { useSearchParams } from "react-router-dom";

// [FINISH]

const ApprovalPositionPage = <T extends TDataApprovalPosition>() => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);
    const detailTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([approvalPositionService.getAll, page], async () => {
        const res = await approvalPositionService.GetAll<ApprovalPosition>({ page });
        return Utils.toBaseTable<ApprovalPosition, T>(res.data.data);
    });

    const deleteMutation = useMutation(
        async ({ id, callback }: { id: string; callback: () => void }) => {
            await approvalPositionService.Delete<ApprovalPosition>({ id });
            callback();
        },
        {
            onSuccess: (_, data) => {
                getList.refetch();
                message.success(`Approval position with id ${data.id} has been deleted`);
            },
            onError: (error: any, { callback }) => {
                message.error(error?.message);
                callback();
            },
        }
    );

    const createMutation = useMutation(
        async ({ data, callback }: { data: ApprovalPosition; callback: () => void }) => {
            await approvalPositionService.Create<ApprovalPosition>(data);
            callback();
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success(`Approval position has been created`);
            },
            onError: (error: any, { callback }) => {
                message.error(error?.message);
                callback();
            },
        }
    );

    const editMutation = useMutation(
        async ({ data, callback }: { data: ApprovalPosition; callback: () => void }) => {
            await approvalPositionService.Edit<ApprovalPosition>(data);
            callback();
        },
        {
            onSuccess: (_, data) => {
                getList.refetch();
                message.success(`Approval position with id ${data.data.id} has been edited`);
            },
            onError: (error: any, { callback }) => {
                message.error(error?.message);
                callback();
            },
        }
    );
    // crud handler
    const onClickDelete = (data: T, callback: () => void) => {
        deleteMutation.mutate({
            id: data.id as any,
            callback,
        });
    };
    const onClickDetail = (data: T) => {
        if (detailTriggerRef.current) {
            detailTriggerRef.current.dataset.data = JSON.stringify(data);
            detailTriggerRef.current.click();
        }
    };
    const onClickEdit = (data: T) => {
        if (editTriggerRef.current) {
            editTriggerRef.current.dataset.data = JSON.stringify(data);
            editTriggerRef.current.click();
        }
    };
    const addHandler = (data: ApprovalPosition, callback: () => void) => {
        createMutation.mutate({
            data,
            callback: () => {
                callback();
            },
        });
    };
    const editHandler = (data: ApprovalPosition, callback: () => void) => {
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
            <EditApprovalPosition loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditApprovalPosition>
            {/* <DetailApprovalPosition>
                {(data) => (
                    <button
                        type="button"
                        ref={detailTriggerRef}
                        onClick={() => data.openModalWithData(detailTriggerRef.current?.dataset.data)}
                        className="hidden"
                    >
                        detail
                    </button>
                )}
            </DetailApprovalPosition> */}
            <Header
                title="Approval Position"
                action={
                    <AddApprovalPosition loading={createMutation.isLoading} onSubmit={addHandler}>
                        {(data) => (
                            <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                Tambah posisi
                            </Button>
                        )}
                    </AddApprovalPosition>
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <ApprovalPositionTable onClickEdit={onClickEdit} onClickDetail={onClickDetail} onClickDelete={onClickDelete} fetcher={getList} />
        </div>
    );
};

export default ApprovalPositionPage;
