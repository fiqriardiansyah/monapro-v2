import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, notification, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { AgendaFinance, SelectOption } from "models";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import { useMutation, useQuery } from "react-query";
import agendaService from "services/api-endpoints/agenda";
import moment from "moment";
import { FORMAT_DATE } from "utils/constant";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import agendaFinanceService from "services/api-endpoints/agenda/agenda-finance";
import { FDataAgendaFinance } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: FDataAgendaFinance & { id: string }, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataAgendaFinance>> = yup.object().shape({
    agenda_data_id: yup.string(),
    finnest_no: yup.string(),
    finnest_date: yup.string(),
    load_type_id: yup.string(),
    date: yup.string(),
    value_payment: yup.string(),
    spb_date: yup.string(),
    transfer_to: yup.string(),
    no_rekening: yup.string(),
    payment_date: yup.string(),
    note: yup.string(),
});

const EditAgendaFinance = ({ onSubmit, loading, children }: Props) => {
    const [prevData, setPrevData] = useState<AgendaFinance | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
    } = useForm<FDataAgendaFinance>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const getAgendaData = useQuery(
        [agendaService.getAgendaData],
        async () => {
            const req = await agendaService.GetAgendaData();
            return req.data.data.map(
                (el) =>
                    ({
                        label: el.no_agenda_secretariat,
                        value: el.agenda_data_id,
                    } as SelectOption)
            );
        },
        {
            onError: (error: any) => {
                notification.error({ message: agendaService.getAgendaData, description: error?.message });
            },
        }
    );

    const getLoadType = useQuery(
        [agendaService.getLoadType],
        async () => {
            const req = await agendaService.GetLoadType();
            return req.data.data.map(
                (el) =>
                    ({
                        label: el.load_name,
                        value: el.load_type_id,
                    } as SelectOption)
            );
        },
        {
            onError: (error: any) => {
                notification.error({ message: agendaService.getLoadType, description: error?.message });
            },
        }
    );

    const detailMutation = useMutation(
        async (id: string) => {
            const res = await agendaFinanceService.Detail({ id });
            return res.data.data;
        },
        {
            onSuccess: (data) => {
                form.setFieldsValue({
                    agenda_data_id: data?.agenda_data_id || "",
                    date: data?.date ? (moment(data?.date) as any) : moment(),
                    finnest_date: data?.finnest_date ? (moment(data?.finnest_date) as any) : moment(),
                    finnest_no: data?.finnest_no || "",
                    load_type_id: data?.load_type_id || "",
                    no_rekening: data?.no_rekening || "",
                    note: data?.note || "",
                    payment_date: data?.payment_date ? (moment(data?.payment_date) as any) : moment(),
                    spb_date: data?.spb_date ? (moment(data?.spb_date) as any) : moment(),
                    transfer_to: data?.transfer_to || "",
                    value_payment: data?.value_payment || "",
                });
                setValue("agenda_data_id", data?.agenda_data_id || "");
                setValue("date", data?.date ? (moment(data?.date) as any) : moment());
                setValue("finnest_date", data?.finnest_date ? (moment(data?.finnest_date) as any) : moment());
                setValue("finnest_no", data?.finnest_no || "");
                setValue("load_type_id", data?.load_type_id || "");
                setValue("no_rekening", data?.no_rekening || "");
                setValue("note", data?.note || "");
                setValue("payment_date", data?.payment_date ? (moment(data?.payment_date) as any) : moment());
                setValue("spb_date", data?.spb_date ? (moment(data?.spb_date) as any) : moment());
                setValue("transfer_to", data?.transfer_to || "");
                setValue("value_payment", data?.value_payment || "");
            },
        }
    );

    const closeModal = () => {
        if (loading) return;
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const openModalWithData = (data: string | undefined) => {
        if (data) {
            const dataParse = JSON.parse(data) as AgendaFinance;
            setPrevData(dataParse);
            setIsModalOpen(true);
            detailMutation.mutate(dataParse?.id as any);
        }
    };

    const onSubmitHandler = handleSubmit((data) => {
        const parseData: FDataAgendaFinance = {
            ...data,
            finnest_date: data.finnest_date ? moment(data.finnest_date).format(FORMAT_DATE) : "",
            date: data.date ? moment(data.date).format(FORMAT_DATE) : "",
            spb_date: data.spb_date ? moment(data.spb_date).format(FORMAT_DATE) : "",
            payment_date: data.payment_date ? moment(data.spb_date).format(FORMAT_DATE) : "",
        };
        onSubmit(
            {
                ...parseData,
                id: prevData?.id as any,
            },
            closeModal
        );
    });

    const childrenData: ChildrenProps = {
        isModalOpen,
        openModal,
        closeModal,
        openModalWithData,
    };

    return (
        <>
            <Modal
                width={800}
                confirmLoading={loading}
                title={`${detailMutation.isLoading ? "Mengambil data..." : "Edit Agenda Finance"}`}
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
            >
                <Form
                    form={form}
                    labelCol={{ span: 3 }}
                    labelAlign="left"
                    disabled={loading || detailMutation.isLoading}
                    colon={false}
                    style={{ width: "100%" }}
                    onFinish={onSubmitHandler}
                    layout="vertical"
                >
                    <Space direction="vertical" className="w-full">
                        <Row gutter={10}>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="agenda_data_id"
                                    label="Agenda data"
                                    placeholder="Agenda data"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={getAgendaData.isLoading}
                                    options={getAgendaData.data || []}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    name="finnest_no"
                                    label="Finnest kepada"
                                    placeholder="Finnest kepada"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="finnest_date" label="Tanggal Finnest" />
                            </Col>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="load_type_id"
                                    label="Jenis Beban"
                                    placeholder="Jenis Beban"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={getLoadType.isLoading}
                                    options={getLoadType.data || []}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="date" label="Tanggal" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputNumber
                                    control={control}
                                    labelCol={{ xs: 24 }}
                                    name="value_payment"
                                    label="Nilai Pembayaran"
                                    placeholder="Nilai Pembayaran"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="spb_date" label="Tanggal SPB" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 24 }}
                                    name="transfer_to"
                                    label="Transfer kepada"
                                    placeholder="Transfer kepada"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 24 }}
                                    name="no_rekening"
                                    label="Nomor Rekening"
                                    placeholder="Nomor Rekening"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="payment_date" label="Tanggal Pembayaran" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="note" label="Catatan" placeholder="Catatan" />
                            </Col>
                        </Row>

                        <Row justify="start" className="mt-10">
                            <Space>
                                <Button type="primary" htmlType="submit" loading={loading} disabled={!isValid}>
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

export default EditAgendaFinance;
