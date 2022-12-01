import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, notification, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { Finance, SelectOption } from "models";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import InputFile from "components/form/inputs/input-file";
import { useMutation, useQuery } from "react-query";
import procurementService from "services/api-endpoints/procurement";
import financeService from "services/api-endpoints/procurement/finance";
import moment from "moment";
import { FORMAT_DATE } from "utils/constant";
import useBase64File from "hooks/useBase64File";
import ButtonDeleteFile from "components/common/button-delete-file";
import { FDataFinance } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: FDataFinance & { id: string }, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataFinance>> = yup.object().shape({
    justification_id: yup.string(),
    invoice_file: yup.string(),
    tel21_date: yup.string(),
    spb_date: yup.string(),
    payment_date: yup.string(),
    value_payment: yup.string(),
    note: yup.string(),
    attachment_file: yup.string(),
});

const EditFinance = ({ onSubmit, loading, children }: Props) => {
    const { base64: base64Attach, processFile: processFileAttach, isProcessLoad: isProcessLoadAttach } = useBase64File();
    const { base64: base64Invoice, processFile: processFileInvoice, isProcessLoad: isProcessLoadInvoice } = useBase64File();

    const [prevData, setPrevData] = useState<Finance | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
        getValues,
        watch,
    } = useForm<FDataFinance>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const invoiceFileWatch = watch("invoice_file");
    const attachFileWatch = watch("attachment_file");

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

    const detailMutation = useMutation(
        async (id: string) => {
            const req = await financeService.Detail({ id });
            return req.data.data;
        },
        {
            onSuccess: (data) => {
                form.setFieldsValue({
                    justification_id: data?.justification_id || "",
                    invoice_file: data?.invoice_file || "",
                    tel21_date: data?.tel21_date ? (moment(data?.tel21_date) as any) : moment(),
                    spb_date: data?.spb_date ? (moment(data?.spb_date) as any) : moment(),
                    payment_date: data?.payment_date ? (moment(data?.payment_date) as any) : moment(),
                    value_payment: data?.value_payment || "",
                    note: data?.note || "",
                    attachment_file: data?.attachment_file || "",
                });
                setValue("justification_id", data?.justification_id || "");
                setValue("invoice_file", data?.invoice_file || "");
                setValue("tel21_date", data?.tel21_date ? (moment(data?.tel21_date) as any) : moment());
                setValue("spb_date", data?.spb_date ? (moment(data?.spb_date) as any) : moment());
                setValue("payment_date", data?.payment_date ? (moment(data?.payment_date) as any) : moment());
                setValue("value_payment", data?.value_payment || "");
                setValue("note", data?.note || "");
                setValue("attachment_file", data?.attachment_file || "");
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
            const dataParse = JSON.parse(data) as Finance;
            setPrevData(dataParse);
            setIsModalOpen(true);
            detailMutation.mutate(dataParse?.id as any);
        }
    };

    const onSubmitHandler = handleSubmit((data) => {
        const parseData: FDataFinance = {
            ...data,
            tel21_date: data.tel21_date ? moment(data.tel21_date).format(FORMAT_DATE) : "",
            spb_date: data.spb_date ? moment(data.spb_date).format(FORMAT_DATE) : "",
            payment_date: data.payment_date ? moment(data.payment_date).format(FORMAT_DATE) : "",
            attachment_file: base64Attach || getValues()?.attachment_file || null,
            invoice_file: base64Invoice || getValues()?.invoice_file || null,
        };
        onSubmit(
            {
                ...parseData,
                id: prevData?.id as any,
            },
            () => {
                closeModal();
                processFileAttach(null);
                processFileInvoice(null);
            }
        );
    });

    const childrenData: ChildrenProps = {
        isModalOpen,
        openModal,
        closeModal,
        openModalWithData,
    };

    const onFileAttachChangeHandler = (file: any) => {
        processFileAttach(file);
    };

    const onFileInvoiceChangeHandler = (file: any) => {
        processFileInvoice(file);
    };

    const onClickFileAttachDeleteHandler = () => {
        form.setFieldsValue({
            attachment_file: "",
        });
        setValue("attachment_file", "");
    };

    const onClickFileInvoiceDeleteHandler = () => {
        form.setFieldsValue({
            invoice_file: "",
        });
        setValue("invoice_file", "");
    };

    return (
        <>
            <Modal
                width={800}
                confirmLoading={loading}
                title={`${detailMutation.isLoading ? "Mengambil data" : "Edit Finance"}`}
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
                                {invoiceFileWatch ? (
                                    <div className="w-full">
                                        <p className="m-0 capitalize mb-2">file document</p>
                                        <ButtonDeleteFile
                                            url={invoiceFileWatch}
                                            name="Document"
                                            label="File Document"
                                            onClick={onClickFileInvoiceDeleteHandler}
                                        />
                                    </div>
                                ) : (
                                    <InputFile
                                        handleChange={onFileInvoiceChangeHandler}
                                        label="File invoice"
                                        types={["pdf", "jpg", "jpeg", "png"]}
                                        multiple={false}
                                        name="invoice_file"
                                    />
                                )}
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
                                {attachFileWatch ? (
                                    <div className="w-full">
                                        <p className="m-0 capitalize mb-2">file document</p>
                                        <ButtonDeleteFile
                                            url={attachFileWatch}
                                            name="Document"
                                            label="File Document"
                                            onClick={onClickFileAttachDeleteHandler}
                                        />
                                    </div>
                                ) : (
                                    <InputFile
                                        handleChange={onFileAttachChangeHandler}
                                        label="File"
                                        types={["pdf", "jpg", "jpeg", "png"]}
                                        multiple={false}
                                        name="attachment_file"
                                    />
                                )}
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

export default EditFinance;
