import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, notification, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { AgendaData, SelectOption } from "models";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import InputFile from "components/form/inputs/input-file";
import { useMutation, useQuery } from "react-query";
import { COMMON_FILE_EXTENSIONS, DECISION, FOLLOW_UP, FORMAT_DATE, FORMAT_DATE_IND, STATUS_AGENDA } from "utils/constant";
import agendaService from "services/api-endpoints/agenda";
import agendaDataService from "services/api-endpoints/agenda/agenda-data";
import moment from "moment";
import useBase64File from "hooks/useBase64File";
import ButtonDeleteFile from "components/common/button-delete-file";
import { FDataAgenda } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: FDataAgenda & { id: string }, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataAgenda>> = yup.object().shape({
    date: yup.string(),
    endorse: yup.string(),
    no_agenda_directors: yup.string(),
    no_agenda_ccir: yup.string(),
    letter_no: yup.string(),
    letter_date: yup.string(),
    sender: yup.string(),
    about: yup.string(),
    subunit_id: yup.string(),
    decision: yup.string(),
    event_date: yup.string(),
    estimation_paydate: yup.string(),
    document: yup.string(),
    status: yup.number(),
    _: yup.string(),
});

const EditAgendaData = ({ onSubmit, loading, children }: Props) => {
    const { base64, processFile, isProcessLoad } = useBase64File();

    const [prevData, setPrevData] = useState<AgendaData | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { handleSubmit, control, setValue, getValues, watch, reset } = useForm<FDataAgenda>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const docWatch = watch("document");

    const subUnitQuery = useQuery(
        [agendaService.getSubUnit],
        async () => {
            const req = await agendaService.GetSubUnit();
            const subunit = req.data.data?.map(
                (el) =>
                    ({
                        label: el.subunit_name,
                        value: el.subunit_id,
                    } as SelectOption)
            );
            return subunit;
        },
        {
            onError: (error: any) => {
                notification.error({ message: agendaService.getSubUnit, description: error?.message });
            },
        }
    );

    const detailMutation = useMutation(
        async (id: string) => {
            const req = await agendaDataService.Detail<AgendaData>({ id });
            return req.data.data;
        },
        {
            onSuccess: (data) => {
                form.setFieldsValue({
                    date: data.date ? moment(data?.date) : moment(),
                    endorse: data?.endorse || "",
                    letter_no: data?.letter_no || "",
                    letter_date: data?.letter_date ? moment(data?.letter_date) : moment(),
                    sender: data?.sender || "",
                    about: data?.about || "",
                    subunit_id: data?.subunit_id || "",
                    decision: data?.decision || "",
                    event_date: data?.event_date ? moment(data?.event_date) : moment(),
                    document: data?.document || "",
                    status: data?.status,
                    no_agenda_ccir: data?.no_agenda_ccir,
                    no_agenda_directors: data?.no_agenda_directors,
                });
                setValue("date", data?.date ? (moment(data?.date) as any) : moment());
                setValue("endorse", data?.endorse || "");
                setValue("letter_no", data?.letter_no || "");
                setValue("letter_date", data?.letter_date ? (moment(data?.letter_date) as any) : moment());
                setValue("sender", data?.sender || "");
                setValue("about", data?.about || "");
                setValue("subunit_id", data?.subunit_id || "");
                setValue("decision", data?.decision || "");
                setValue("event_date", data?.event_date ? (moment(data?.event_date) as any) : moment());
                setValue("document", data?.document || "");
                setValue("status", data?.status);
                setValue("no_agenda_ccir", data?.no_agenda_ccir);
                setValue("no_agenda_directors", data?.no_agenda_directors);
            },
        }
    );

    const resetForm = () => {
        processFile(null);
        reset();
        setPrevData(null);
        form.setFieldsValue({
            no_agenda_directors: "",
            no_agenda_ccir: "",
            date: "",
            endorse: "",
            letter_no: "",
            letter_date: "",
            sender: "",
            about: "",
            subunit_id: "",
            decision: "",
            event_date: "",
            document: "",
            status: "",
        });
    };

    const closeModal = () => {
        if (loading) return;
        setIsModalOpen(false);
        resetForm();
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const openModalWithData = (data: string | undefined) => {
        if (data) {
            const dataParse = JSON.parse(data) as AgendaData;
            setPrevData(dataParse);
            setIsModalOpen(true);
            detailMutation.mutate(dataParse?.id as any);
        }
    };

    const onSubmitHandler = handleSubmit((data) => {
        const parseData: FDataAgenda = {
            ...data,
            date: data.date ? moment(data.date).format(FORMAT_DATE) : "",
            letter_date: data.letter_date ? moment(data.letter_date).format(FORMAT_DATE) : "",
            event_date: data.event_date ? moment(data.event_date).format(FORMAT_DATE) : "",
            document: base64 || getValues()?.document || null,
        };
        onSubmit(
            {
                ...parseData,
                id: prevData?.id as any,
            },
            () => {
                closeModal();
                processFile(null);
            }
        );
    });

    const childrenData: ChildrenProps = {
        isModalOpen,
        openModal,
        closeModal,
        openModalWithData,
    };

    const onFileChangeHandler = (fl: any) => {
        processFile(fl);
    };

    const onClickFileDeleteHandler = () => {
        form.setFieldsValue({
            document: "",
        });
        setValue("document", "");
    };

    return (
        <>
            <Modal
                width={800}
                confirmLoading={loading}
                title={`${detailMutation.isLoading ? "Mengambil data..." : "Edit Data Agenda"}`}
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
            >
                <Form
                    form={form}
                    labelCol={{ span: 3 }}
                    labelAlign="left"
                    disabled={loading || detailMutation.isLoading || isProcessLoad}
                    colon={false}
                    style={{ width: "100%" }}
                    onFinish={onSubmitHandler}
                    layout="vertical"
                >
                    <Space direction="vertical" className="w-full">
                        <Row gutter={10}>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    name="no_agenda_directors"
                                    label="No. Agenda Direksi"
                                    placeholder="No. Agenda Direksi"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    name="no_agenda_ccir"
                                    label="No. Agenda CCIR"
                                    placeholder="No. Agenda CCIR"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="date" label="Tanggal" format={FORMAT_DATE_IND} />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    name="endorse"
                                    label="Inisiator"
                                    placeholder="Inisiator"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="letter_no" label="No Surat" placeholder="Nomor" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    name="letter_date"
                                    label="Tanggal Surat"
                                    format={FORMAT_DATE_IND}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="sender" label="Pengirim" placeholder="Pengirim" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="about" label="Perihal" placeholder="Perihal" />
                            </Col>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="subunit_id"
                                    label="Sub Unit"
                                    placeholder="Sub Unit"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={false}
                                    options={subUnitQuery.data || []}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="decision"
                                    label="Keputusan"
                                    placeholder="Keputusan"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={false}
                                    options={DECISION}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="status"
                                    label="Status"
                                    placeholder="Status"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={false}
                                    options={STATUS_AGENDA}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    name="event_date"
                                    label="Pelaksanaan acara"
                                    format={FORMAT_DATE_IND}
                                />
                            </Col>
                            <Col span={12}>
                                {docWatch ? (
                                    <div className="w-full">
                                        <p className="m-0 capitalize mb-2">file document</p>
                                        <ButtonDeleteFile url={docWatch} name="Document" label="File Document" onClick={onClickFileDeleteHandler} />
                                    </div>
                                ) : (
                                    <InputFile
                                        handleChange={onFileChangeHandler}
                                        label="file document"
                                        types={COMMON_FILE_EXTENSIONS}
                                        multiple={false}
                                        name="document"
                                    />
                                )}
                            </Col>
                        </Row>

                        <Row justify="start" className="mt-10">
                            <Space>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Simpan
                                </Button>
                                <Button type="primary" danger onClick={closeModal}>
                                    Batalkan
                                </Button>
                            </Space>
                        </Row>
                    </Space>
                </Form>
            </Modal>
            {children(childrenData)}
        </>
    );
};

export default EditAgendaData;
