/* eslint-disable import/extensions */
import { Alert, Button, message, Progress } from "antd";
import Header from "components/common/header";
import { StateContext } from "context/state";
import { UserContext } from "context/user";
import useIsForbidden from "hooks/useIsForbidden";
import { AgendaData, CashCarry } from "models";
import AddAgendaData from "modules/agenda/data/add";
import EditAgendaData from "modules/agenda/data/edit";
import { FDataAgenda, TDataAgenda } from "modules/agenda/data/models";
import AgendaDataTable from "modules/agenda/data/table";
import React, { useContext, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import agendaDataService from "services/api-endpoints/agenda/agenda-data";
import printService from "services/api-endpoints/print";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index";
import { saveAs } from "file-saver";

import Utils from "utils";
import { AWS_PATH, KEY_UPLOAD_FILE } from "utils/constant";
import moment from "moment";
import CashCarryTable from "modules/procurement/cash-carry/table";
import { TDataCashCarry, TDataCreateCashCarry } from "modules/procurement/cash-carry/models";
import cashCarryService from "services/api-endpoints/agenda/cash-carry";
import AddCashCarry from "modules/procurement/cash-carry/add";
import EditCashCarry, { TDataEditId } from "modules/procurement/cash-carry/edit";

const CashCarryPage = <T extends TDataCashCarry>() => {
    const { notificationInstance } = useContext(StateContext);
    const { state } = useContext(UserContext);
    const isForbidden = useIsForbidden({ roleAccess: state.user?.role_access, access: "agenda" });

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([cashCarryService.getAll, page, query], async () => {
        const res = await cashCarryService.GetAll<CashCarry>({ page });
        return Utils.toBaseTable<CashCarry, T>(res.data.data);
    });

    const createMutation = useMutation(
        async ({ data }: { data: TDataCreateCashCarry }) => {
            await cashCarryService.Create(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.file_document) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}cash-carry`,
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
                message.success("Cash & Carry dibuat!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

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
                getList.refetch();
                message.success("Cash & Carry diedit!");
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

    const addHandler = async (data: TDataCreateCashCarry, callback: () => void) => {
        await createMutation.mutateAsync({ data });
        callback();
    };
    const editHandler = async (data: TDataEditId, callback: () => void) => {
        await editMutation.mutateAsync({ data });
        callback();
    };

    const errors = [getList, createMutation, editMutation];

    return (
        <>
            <div className="min-h-screen px-10">
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
                <Header
                    search={false}
                    title="Cash & Carry"
                    action={
                        !isForbidden && (
                            <AddCashCarry loading={createMutation.isLoading} onSubmit={addHandler}>
                                {(data) => (
                                    <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                        Tambah Cash & Carry
                                    </Button>
                                )}
                            </AddCashCarry>
                        )
                    }
                />
                {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
                <CashCarryTable onClickEdit={onClickEdit} fetcher={getList} />
            </div>
        </>
    );
};

export default CashCarryPage;
