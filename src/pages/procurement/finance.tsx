import { Alert, Button, message, Progress } from "antd";
import Header from "components/common/header";
import { StateContext } from "context/state";
import { IsPaid } from "models";
import AddFinance from "modules/procurement/finance/add";
import EditFinance from "modules/procurement/finance/edit";
import { FDataFinance, TDataFinance } from "modules/procurement/finance/models";
import FinanceTable from "modules/procurement/finance/table";
import React, { useContext, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import financeService from "services/api-endpoints/procurement/finance";
import { AWS_PATH, KEY_UPLOAD_FILE } from "utils/constant";

// [FINISH]

const FinancePage = <T extends TDataFinance>() => {
    const { notificationInstance } = useContext(StateContext);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([query ? financeService.search : financeService.getAll, page, query], async () => {
        if (query) {
            const req = await financeService.Search({ page: page as any, query: query as any });
            return req.data.data;
        }
        const req = await financeService.GetAll({ page });
        return req.data.data;
    });

    const createMutation = useMutation(
        async (data: FDataFinance) => {
            await financeService.Create(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.invoice_file && !data.attachment_file) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}create-finance`,
                        duration: percentCompleted >= 100 ? 1 : 0,
                        message: "Uploading Files",
                        description: <Progress percent={percentCompleted} status="active" />,
                        placement: "bottomRight",
                    });
                },
            });
        },
        {
            onSuccess: () => {
                message.success("Finance dibuat!");
                getList.refetch();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const editMutation = useMutation(
        async (data: FDataFinance) => {
            await financeService.Edit(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.invoice_file && !data.attachment_file) return;
                    if (data.invoice_file.includes(AWS_PATH) && data.attachment_file.includes(AWS_PATH)) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}create-finance`,
                        duration: percentCompleted >= 100 ? 1 : 0,
                        message: "Uploading Files",
                        description: <Progress percent={percentCompleted} status="active" />,
                        placement: "bottomRight",
                    });
                },
            });
        },
        {
            onSuccess: () => {
                message.success("Finance diedit!");
                getList.refetch();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const setPaidMutation = useMutation(
        async (data: IsPaid) => {
            await financeService.SetPaid(data);
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
    const onClickPaidHandler = async (data: TDataFinance, callback: () => void) => {
        await setPaidMutation.mutateAsync({ id: data.id, is_paid: 1 });
        callback();
    };
    const onClickEdit = (data: T) => {
        if (editTriggerRef.current) {
            editTriggerRef.current.dataset.data = JSON.stringify(data);
            editTriggerRef.current.click();
        }
    };
    const addHandler = async (data: FDataFinance, callback: () => void) => {
        await createMutation.mutateAsync(data);
        callback();
    };
    const editHandler = async (data: FDataFinance, callback: () => void) => {
        await editMutation.mutateAsync(data);
        callback();
    };

    const onSearchHandler = (qr: string) => {
        setSearchParams({ page: "1", query: qr });
    };

    const errors = [getList, createMutation, editMutation];

    return (
        <div className="min-h-screen px-10">
            <EditFinance loading={editMutation.isLoading} onSubmit={editHandler}>
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
            </EditFinance>
            <Header
                onSubmitSearch={onSearchHandler}
                title="Finance"
                action={
                    <AddFinance loading={createMutation.isLoading} onSubmit={addHandler}>
                        {(data) => (
                            <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                Tambah Finance
                            </Button>
                        )}
                    </AddFinance>
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <FinanceTable onClickPaid={onClickPaidHandler} onClickEdit={onClickEdit} fetcher={getList} />
        </div>
    );
};

export default FinancePage;
