import { AgendaData } from "models";
import { TDataEditCashCarry } from "modules/procurement/cash-carry/models";
import React, { useContext, useRef } from "react";
import { useMutation, useQuery } from "react-query";
import EditCashCarry, { TDataEditId } from "modules/procurement/cash-carry/edit";
import { useSearchParams } from "react-router-dom";
import myActivityService from "services/api-endpoints/my-activity";
import cashCarryService from "services/api-endpoints/agenda/cash-carry";
import { AWS_PATH, KEY_UPLOAD_FILE } from "utils/constant";
import { message, Progress } from "antd";
import { StateContext } from "context/state";
import CashCarryTable from "../cash-carry-table";

const CashCarryActivity = () => {
    const { notificationInstance } = useContext(StateContext);

    const [searchParams] = useSearchParams();
    const pageCc = searchParams.get("page_cc") || 1;
    const myCashCarry = useQuery([myActivityService.getMyCashCarry, pageCc], async () => {
        return (await myActivityService.GetMyCashCarry({ page: pageCc })).data.data;
    });

    const editMutation = useMutation(
        async ({ data }: { data: TDataEditId }) => {
            await cashCarryService.Edit(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.file_document) return;
                    if (data.file_document.includes(AWS_PATH)) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}edit-agenda`,
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
                myCashCarry.refetch();
                message.success("Cash & Carry diedit!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    const onClickEdit = (data: TDataEditCashCarry) => {
        if (editTriggerRef.current) {
            editTriggerRef.current.dataset.data = JSON.stringify(data);
            editTriggerRef.current.click();
        }
    };

    const editHandler = async (data: TDataEditId, callback: () => void) => {
        await editMutation.mutateAsync({ data });
        callback();
    };

    return (
        <>
            <EditCashCarry loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditCashCarry>
            <div className="flex items-center justify-between">
                <h1 className="capitalize text-base font-semibold !text-gray-400 m-0 mb-5 mt-4">cash dan carry</h1>
            </div>
            <CashCarryTable fetcher={myCashCarry} onClickEdit={onClickEdit} />
        </>
    );
};

export default CashCarryActivity;
