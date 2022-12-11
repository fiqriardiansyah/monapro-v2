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
import { FDataContractSpNopes } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

type Props = {
    onSubmit: (data: FDataContractSpNopes, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataContractSpNopes>> = yup.object().shape({
    justification_id: yup.string(),
    no_contract: yup.string(),
    about_manage: yup.string(),
    date: yup.string().required("Tanggal wajib diisi"),
    value: yup.string(),
    doc: yup.string(),
});

const AddContract = ({ onSubmit, loading, children }: Props) => {
    const { base64, processFile, isProcessLoad } = useBase64File();

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        reset,
    } = useForm<FDataContractSpNopes>({
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
        processFile(null);
        reset();
        form.setFieldsValue({
            justification_id: "",
            no_contract: "",
            about_manage: "",
            date: "",
            value: "",
            doc: "",
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
        const parseData: FDataContractSpNopes = {
            ...data,
            date: data.date ? moment(data.date).format(FORMAT_DATE) : "",
            doc: base64,
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
            <Modal width={800} confirmLoading={loading} title="Tambah Kontrak" open={isModalOpen} onCancel={closeModal} footer={null}>
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
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 24 }}
                                    name="no_contract"
                                    label="Nomor Kontrak"
                                    placeholder="Nomor Kontrak"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 24 }}
                                    name="about_manage"
                                    label="Perihal"
                                    placeholder="Perihal Data Manage"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="date" label="Tanggal" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputNumber control={control} labelCol={{ xs: 12 }} name="value" label="Nilai" placeholder="Nilai" />
                            </Col>
                            <Col span={12}>
                                <InputFile
                                    handleChange={onFileChangeHandler}
                                    label="file document"
                                    types={["pdf", "jpg", "jpeg", "png"]}
                                    multiple={false}
                                    name="doc_justification"
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

export default AddContract;
