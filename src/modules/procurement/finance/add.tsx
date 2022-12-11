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
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import InputFile from "components/form/inputs/input-file";
import procurementService from "services/api-endpoints/procurement";
import { useQuery } from "react-query";
import moment from "moment";
import { FORMAT_DATE } from "utils/constant";
import useBase64File from "hooks/useBase64File";
import { FDataFinance } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

type Props = {
    onSubmit: (data: FDataFinance, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataFinance>> = yup.object().shape({
    justification_id: yup.string().required("Justifikasi wajib diisi"),
    invoice_file: yup.string(),
    tel21_date: yup.string().required("Tanggal TEL21 wajib diisi"),
    spb_date: yup.string().required("Tanggal SPB wajib diisi"),
    payment_date: yup.string().required("Tanggal pembayaran wajib diisi"),
    value_payment: yup.string(),
    note: yup.string(),
    attachment_file: yup.string(),
});

const AddFinance = ({ onSubmit, loading, children }: Props) => {
    const { base64: base64Attach, processFile: processFileAttach, isProcessLoad: isProcessLoadAttach } = useBase64File();
    const { base64: base64Invoice, processFile: processFileInvoice, isProcessLoad: isProcessLoadInvoice } = useBase64File();

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        reset,
    } = useForm<FDataFinance>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const justificationQuery = useQuery(
        [procurementService.getJustification],
        async () => {
            const req = await procurementService.GetJustification();
            const subunit = req.data.data?.map(
                (el) =>
                    ({
                        label: el.no_justification,
                        value: el.justification_id,
                    } as SelectOption)
            );
            return subunit;
        },
        {
            onError: (error: any) => {
                notification.error({ message: procurementService.getJustification, description: error?.message });
            },
        }
    );

    const resetForm = () => {
        processFileAttach(null);
        processFileInvoice(null);
        reset();
        form.setFieldsValue({
            justification_id: "",
            invoice_file: "",
            tel21_date: "",
            spb_date: "",
            payment_date: "",
            value_payment: "",
            note: "",
            attachment_file: "",
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

    const onSubmitHandler = handleSubmit((data) => {
        const parseData: FDataFinance = {
            ...data,
            tel21_date: data.tel21_date ? moment(data.tel21_date).format(FORMAT_DATE) : "",
            spb_date: data.spb_date ? moment(data.spb_date).format(FORMAT_DATE) : "",
            payment_date: data.payment_date ? moment(data.payment_date).format(FORMAT_DATE) : "",
            attachment_file: base64Attach,
            invoice_file: base64Invoice,
        };
        onSubmit(parseData, () => {
            closeModal();
            processFileAttach(null);
            processFileInvoice(null);
        });
    });

    const childrenData: ChildrenProps = {
        isModalOpen,
        openModal,
        closeModal,
    };

    const onFileAttachChangeHandler = (file: any) => {
        processFileAttach(file);
    };

    const onFileInvoiceChangeHandler = (file: any) => {
        processFileInvoice(file);
    };

    return (
        <>
            <Modal width={800} confirmLoading={loading} title="Tambah Finance" open={isModalOpen} onCancel={closeModal} footer={null}>
                <Form
                    form={form}
                    labelCol={{ span: 3 }}
                    labelAlign="left"
                    disabled={loading || isProcessLoadAttach || isProcessLoadInvoice}
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
                                    name="justification_id"
                                    label="Justifikasi"
                                    placeholder="Justifikasi"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={justificationQuery.isLoading}
                                    options={justificationQuery.data || []}
                                />
                            </Col>
                            <Col span={12}>
                                <InputFile
                                    handleChange={onFileInvoiceChangeHandler}
                                    label="File invoice"
                                    types={["pdf", "jpg", "jpeg", "png"]}
                                    multiple={false}
                                    name="invoice_file"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 24 }} name="tel21_date" label="Tanggal TEL21/SPB" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 24 }} name="spb_date" label="Tanggal SPB finance" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 24 }} name="payment_date" label="Tanggal Pembayaran" />
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
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="note" label="Catatan" placeholder="Catatan" />
                            </Col>
                            <Col span={12}>
                                <InputFile
                                    handleChange={onFileAttachChangeHandler}
                                    label="File"
                                    types={["pdf", "jpg", "jpeg", "png"]}
                                    multiple={false}
                                    name="attachment_file"
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

export default AddFinance;
