import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, notification, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { AgendaDisposition, SelectOption } from "models";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import InputFile from "components/form/inputs/input-file";
import { useMutation, useQuery } from "react-query";
import agendaService from "services/api-endpoints/agenda";
import agendaDispositionService from "services/api-endpoints/agenda/agenda-disposition";
import moment from "moment";
import { FORMAT_DATE } from "utils/constant";
import { FDataAgendaDisposition } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: FDataAgendaDisposition & { id: string }, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataAgendaDisposition>> = yup.object().shape({
    agenda_data_id: yup.string(),
    disposition_doc: yup.string(),
    disposition_date: yup.string(),
    disposition_to: yup.string(),
    letter_no: yup.string(),
    note: yup.string(),
    _: yup.string(),
});

const EditAgendaDisposition = ({ onSubmit, loading, children }: Props) => {
    const [prevData, setPrevData] = useState<AgendaDisposition | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
    } = useForm<FDataAgendaDisposition>({
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

    const detailMutation = useMutation(
        async (id: string) => {
            const res = await agendaDispositionService.Detail({ id });
            return res.data.data;
        },
        {
            onSuccess: (data: any) => {
                form.setFieldsValue({
                    agenda_data_id: data?.agenda_data_id || "",
                    disposition_to: data?.disposition_to || "",
                    letter_no: data?.letter_no || "",
                    note: data?.note || "",
                    disposition_doc: data?.disposition_doc || "",
                    disposition_date: data?.disposition_date ? (moment(data?.disposition_date) as any) : moment(),
                });
                setValue("agenda_data_id", data?.agenda_data_id || "");
                setValue("disposition_to", data?.disposition_to || "");
                setValue("letter_no", data?.letter_no || "");
                setValue("note", data?.note || "");
                setValue("disposition_doc", data?.disposition_doc || "");
                setValue("disposition_date", data?.disposition_date ? (moment(data?.disposition_date) as any) : moment());
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
            const dataParse = JSON.parse(data) as AgendaDisposition;
            setPrevData(dataParse);
            setIsModalOpen(true);
            detailMutation.mutate(dataParse?.id as any);
        }
    };

    const onSubmitHandler = handleSubmit((data) => {
        const parseData: FDataAgendaDisposition = {
            ...data,
            disposition_date: data.disposition_date ? moment(data.disposition_date).format(FORMAT_DATE) : "",
            disposition_doc: null,
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

    const onFileChangeHandler = (file: any) => {
        console.log(file);
    };

    return (
        <>
            <Modal
                width={800}
                confirmLoading={loading}
                title={`${detailMutation.isLoading ? "Mengambil data..." : "Edit Agenda Disposition"}`}
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
                                    name="disposition_to"
                                    label="Disposisi kepada"
                                    placeholder="Disposisi kepada"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    name="letter_no"
                                    label="Nomor surat"
                                    placeholder="Nomor surat"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="disposition_date" label="Tanggal" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="note" label="Catatan" placeholder="Catatan" />
                            </Col>
                            <Col span={12}>
                                <InputFile
                                    handleChange={onFileChangeHandler}
                                    label="file document"
                                    types={["pdf", "jpg", "jpeg", "png"]}
                                    multiple={false}
                                    name="document"
                                />
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

export default EditAgendaDisposition;
