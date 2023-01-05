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
import { COMMON_FILE_EXTENSIONS, FORMAT_DATE, FORMAT_DATE_IND } from "utils/constant";
import useBase64File from "hooks/useBase64File";
import moment from "moment";
import Utils from "utils";
import { TDataCreateCashCarry } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

type Props = {
    onSubmit: (data: TDataCreateCashCarry, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<TDataCreateCashCarry>> = yup.object().shape({
    submission_date: yup.string().required("Tanggal wajib diisi"),
    submission_value: yup.string().required("Nilai wajib diisi"),
    load_type_id: yup.string().required("Jenis beban wajib diisi"),
    billing_month: yup.string().required("Bulan pembayaran wajib diisi"),
    about: yup.string(),
    file_document: yup.string(),
    _: yup.string(),
});

const AddCashCarry = ({ onSubmit, loading, children }: Props) => {
    const { base64: base64Attach, processFile: processFileAttach, isProcessLoad: isProcessLoadAttach } = useBase64File();

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        reset,
    } = useForm<TDataCreateCashCarry>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const loadTypeQuery = useQuery(
        [procurementService.getLoadType],
        async () => {
            const req = await procurementService.GetLoadType();
            return req.data.data;
        },
        {
            onError: (error: any) => {
                notification.error({ message: procurementService.getLoadType, description: error?.message });
            },
        }
    );

    const resetForm = () => {
        processFileAttach(null);
        reset();
        form.setFieldsValue({
            submission_date: "",
            submission_value: "",
            load_type_id: "",
            subunit_id: "",
            billing_month: "",
            about: "",
            file_document: "",
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
        const parseData: TDataCreateCashCarry = {
            ...data,
            submission_value: Utils.convertToIntFormat(data.submission_value)?.toString() || "0",
            submission_date: moment(data.submission_date).format("yyyy-MM-DD"),
            billing_month: moment(data.billing_month).format("yyyy-MM-DD"),
            file_document: base64Attach,
        };
        onSubmit(parseData, () => {
            closeModal();
            processFileAttach(null);
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

    return (
        <>
            <Modal width={800} confirmLoading={loading} title="Tambah Cash Carry" open={isModalOpen} onCancel={closeModal} footer={null}>
                <Form
                    form={form}
                    labelCol={{ span: 3 }}
                    labelAlign="left"
                    disabled={loading || isProcessLoadAttach}
                    colon={false}
                    style={{ width: "100%" }}
                    onFinish={onSubmitHandler}
                    layout="vertical"
                >
                    <Space direction="vertical" className="w-full">
                        <Row gutter={10}>
                            <Col span={12}>
                                <ControlledInputDate
                                    format={FORMAT_DATE_IND}
                                    control={control}
                                    labelCol={{ xs: 24 }}
                                    name="submission_date"
                                    label="Tanngal pengajuan"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 24 }}
                                    type="number"
                                    name="submission_value"
                                    label="Nilai pengajuan"
                                    placeholder="Nilai pengajuan"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="load_type_id"
                                    label="Jenis beban"
                                    placeholder="Jenis beban"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={loadTypeQuery.isLoading}
                                    options={
                                        loadTypeQuery.data?.map((el) => ({
                                            label: el.load_name,
                                            value: el.load_type_id,
                                        })) || []
                                    }
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate
                                    control={control}
                                    picker="month"
                                    format="MMM yyyy"
                                    labelCol={{ xs: 12 }}
                                    name="billing_month"
                                    label="Bulan penagihan"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="about" label="Perihal" placeholder="Perihal" />
                            </Col>
                            <Col span={12}>
                                <InputFile
                                    handleChange={onFileAttachChangeHandler}
                                    label="file document"
                                    types={COMMON_FILE_EXTENSIONS}
                                    multiple={false}
                                    name="file_document"
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

export default AddCashCarry;
