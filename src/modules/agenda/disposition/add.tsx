import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, notification, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { SelectOption } from "models";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import InputFile from "components/form/inputs/input-file";
import { FORMAT_DATE } from "utils/constant";
import { useQuery } from "react-query";
import agendaService from "services/api-endpoints/agenda";
import moment from "moment";
import useBase64File from "hooks/useBase64File";
import { FDataAgendaDisposition } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

type Props = {
    onSubmit: (data: FDataAgendaDisposition, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataAgendaDisposition>> = yup.object().shape({
    agenda_data_id: yup.string().required("Agenda Data wajib diisi"),
    disposition_doc: yup.string(),
    disposition_date: yup.string().required("Tanggal wajib diisi"),
    disposition_to: yup.string(),
    letter_no: yup.string(),
    note: yup.string(),
    _: yup.string(),
});

const AddAgendaDisposition = ({ onSubmit, loading, children }: Props) => {
    const { base64, processFile, isProcessLoad } = useBase64File();

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
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

    const closeModal = () => {
        if (loading) return;
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const onSubmitHandler = handleSubmit((data) => {
        const parseData: FDataAgendaDisposition = {
            ...data,
            disposition_date: data.disposition_date ? moment(data.disposition_date).format(FORMAT_DATE) : "",
            disposition_doc: base64,
        };
        onSubmit(parseData, () => {
            closeModal();
            processFile(null);
        });
    });

    const childrenData: ChildrenProps = {
        isModalOpen,
        openModal,
        closeModal,
    };

    const onFileChangeHandler = (file: any) => {
        processFile(file);
    };

    return (
        <>
            <Modal width={800} confirmLoading={loading} title="Tambah Agenda Disposisi" open={isModalOpen} onCancel={closeModal} footer={null}>
                <Form
                    form={form}
                    labelCol={{ span: 3 }}
                    labelAlign="left"
                    disabled={loading || isProcessLoad}
                    colon={false}
                    style={{ width: "100%" }}
                    onFinish={onSubmitHandler}
                    layout="vertical"
                >
                    <Space direction="vertical" className="w-full">
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
                        </Space>
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

export default AddAgendaDisposition;
