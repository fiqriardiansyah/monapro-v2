import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { AgendaData, SelectOption, SubUnitProcurement } from "models";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import InputFile from "components/form/inputs/input-file";
import { DECISION, FOLLOW_UP } from "utils/constant";
import { useQuery } from "react-query";
import agendaService from "services/api-endpoints/agenda";
import { OptionProps } from "antd/lib/select";
import { FDataAgenda } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

type Props = {
    onSubmit: (data: FDataAgenda, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataAgenda>> = yup.object().shape({
    date: yup.string().required("Tanggal wajib diisi"),
    endorse: yup.number(),
    letter_no: yup.string(),
    letter_date: yup.string().required("Tangal Surat wajib diisi"),
    sender: yup.string().required("Pengirim wajib diisi"),
    about: yup.string().required("Perihal wajib diisi"),
    subunit_id: yup.string().required("Sub unit wajib diisi"),
    follow_up: yup.string().required("Tindak lanjut wajib diisi"),
    decision: yup.string().required("Keputusan wajib diisi"),
    event_date: yup.string(),
    estimation_paydate: yup.string(),
    document: yup.string(),
    _: yup.string(),
});

const AddAgendaData = ({ onSubmit, loading, children }: Props) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
    } = useForm<FDataAgenda>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const subUnitQuery = useQuery([agendaService.getSubUnit], async () => {
        const req = await agendaService.GetSubUnit();
        return req.data.data.map(
            (el) =>
                ({
                    label: el.subunit_name,
                    value: el.subunit_id,
                } as SelectOption)
        );
    });

    const closeModal = () => {
        if (loading) return;
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const onSubmitHandler = handleSubmit((data) => {
        onSubmit(data, closeModal);
    });

    const childrenData: ChildrenProps = {
        isModalOpen,
        openModal,
        closeModal,
    };

    const onFileChangeHandler = (file: any) => {
        console.log(file);
    };

    return (
        <>
            <Modal confirmLoading={loading} title="Tambah Agenda Data" open={isModalOpen} onCancel={closeModal} footer={null}>
                <Form
                    form={form}
                    labelCol={{ span: 3 }}
                    labelAlign="left"
                    disabled={loading}
                    colon={false}
                    style={{ width: "100%" }}
                    onFinish={onSubmitHandler}
                    layout="vertical"
                >
                    <Space direction="vertical" className="w-full">
                        <Row gutter={10}>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="date" label="Tanggal" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputNumber control={control} labelCol={{ xs: 12 }} name="endorse" label="Endorse" placeholder="Endorse" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="letter_no" label="No Surat" placeholder="Nomor" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="letter_date" label="Tanggal Surat" />
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
                                    loading={subUnitQuery.isLoading}
                                    options={subUnitQuery.data || []}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="follow_up"
                                    label="Tindak Lanjut"
                                    placeholder="Tindak Lanjut"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={false}
                                    options={FOLLOW_UP}
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
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="event_date" label="Pelaksanaan acara" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="estimation_paydate" label="Perkiraan bayar" />
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

                        <Row justify="start">
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

export default AddAgendaData;
