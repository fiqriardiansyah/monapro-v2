/* eslint-disable import/extensions */
import { Alert, Button, message, Progress } from "antd";
import Header from "components/common/header";
import { StateContext } from "context/state";
import { UserContext } from "context/user";
import useIsForbidden from "hooks/useIsForbidden";
import { AgendaData } from "models";
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
import Print from "modules/agenda/data/print";

function loadFile(url: string, callback: any) {
    PizZipUtils.getBinaryContent(url, callback);
}

const AgendaDataPage = <T extends TDataAgenda>() => {
    const { notificationInstance } = useContext(StateContext);
    const { state } = useContext(UserContext);
    const isForbidden = useIsForbidden({ roleAccess: state.user?.role_access, access: "agenda" });

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([query ? agendaDataService.search : agendaDataService.getAll, page, query], async () => {
        if (query) {
            const res = await agendaDataService.Search<AgendaData>({ page: page as any, query: query as any });
            return Utils.toBaseTable<AgendaData, T>(res.data.data);
        }
        const res = await agendaDataService.GetAll<AgendaData>({ page });
        return Utils.toBaseTable<AgendaData, T>(res.data.data);
    });

    const createMutation = useMutation(
        async ({ data }: { data: FDataAgenda }) => {
            await agendaDataService.Create(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.document) return;
                    const percentCompleted = Math.round((eventUpload.loaded * 100) / eventUpload.total);
                    notificationInstance?.open({
                        key: `${KEY_UPLOAD_FILE}create-agenda`,
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
                message.success("Agenda Data dibuat!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const editMutation = useMutation(
        async ({ data }: { data: FDataAgenda }) => {
            await agendaDataService.Edit(data as any, {
                onUploadProgress: (eventUpload) => {
                    if (!data.document) return;
                    if (data.document.includes(AWS_PATH)) return;
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
                message.success("Agenda Data diedit!");
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

    const addHandler = async (data: FDataAgenda, callback: () => void) => {
        await createMutation.mutateAsync({ data });
        callback();
    };
    const editHandler = async (data: FDataAgenda, callback: () => void) => {
        await editMutation.mutateAsync({ data });
        callback();
    };

    const onSearchHandler = (qr: string) => {
        setSearchParams({ page: "1", query: qr });
    };

    const onClickPrint = async (data: T) => {
        // ! if you want to download word file instead
        // loadFile("https://panggilin-user.s3.ap-southeast-1.amazonaws.com/resources/telco/Template+Agenda.docx", (error: any, content: any) => {
        //     if (error) throw error;
        //     const zip = new PizZip(content);
        //     const doc = new Docxtemplater(zip, {
        //         paragraphLoop: true,
        //         linebreaks: true,
        //     });
        //     doc.render({
        //         agenda_no: data.no_agenda_secretariat,
        //         letter_no: data.letter_no,
        //         sender: data.sender,
        //         about: data.about,
        //         receive_date: data.date ? moment(data.date).format("DD-MM-yyyy") : "-",
        //         letter_date: data.letter_date ? moment(data.letter_date).format("DD-MM-yyyy") : "-",
        //     });
        //     const blob = doc.getZip().generate({
        //         type: "blob",
        //         mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        //     });
        //     saveAs(blob, `${data.no_agenda_secretariat}.docx`);
        // });
    };

    const errors = [getList, createMutation, editMutation];

    return (
        <>
            <div className="min-h-screen px-10">
                <EditAgendaData loading={editMutation.isLoading} onSubmit={editHandler}>
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
                </EditAgendaData>
                <Header
                    onSubmitSearch={onSearchHandler}
                    title="Data Agenda"
                    action={
                        !isForbidden && (
                            <AddAgendaData loading={createMutation.isLoading} onSubmit={addHandler}>
                                {(data) => (
                                    <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                        Tambah Agenda
                                    </Button>
                                )}
                            </AddAgendaData>
                        )
                    }
                />
                {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
                <AgendaDataTable onClickPrint={onClickPrint} onClickEdit={onClickEdit} fetcher={getList} />
            </div>
        </>
    );
};

export default AgendaDataPage;
