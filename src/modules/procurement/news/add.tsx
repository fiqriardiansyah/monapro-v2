import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, notification, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { SelectOption } from "models";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import InputFile from "components/form/inputs/input-file";
import procurementService from "services/api-endpoints/procurement";
import { useQuery } from "react-query";
import useBase64File from "hooks/useBase64File";
import { FDataNews } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

type Props = {
    onSubmit: (data: FDataNews, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataNews>> = yup.object().shape({
    justification_id: yup.string(),
    no_bar: yup.string(),
    no_bap: yup.string(),
    no_bapp: yup.string(),
    file_bap: yup.string(),
    file_bapp: yup.string(),
    file_bar: yup.string(),
});

const AddNews = ({ onSubmit, loading, children }: Props) => {
    const { base64: base64BAP, processFile: processFileBAP, isProcessLoad: isProcessLoadBAP } = useBase64File();
    const { base64: base64BAR, processFile: processFileBAR, isProcessLoad: isProcessLoadBAR } = useBase64File();
    const { base64: base64BAPP, processFile: processFileBAPP, isProcessLoad: isProcessLoadBAPP } = useBase64File();

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
    } = useForm<FDataNews>({
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

    const closeModal = () => {
        if (loading) return;
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const onSubmitHandler = handleSubmit((data) => {
        const parseData: FDataNews = {
            ...data,
            file_bap: base64BAP,
            file_bapp: base64BAPP,
            file_bar: base64BAR,
        };
        onSubmit(parseData, () => {
            closeModal();
            processFileBAP(null);
            processFileBAPP(null);
            processFileBAR(null);
        });
    });

    const childrenData: ChildrenProps = {
        isModalOpen,
        openModal,
        closeModal,
    };

    const onFileBAPChangeHandler = (file: any) => {
        processFileBAP(file);
    };
    const onFileBAPPChangeHandler = (file: any) => {
        processFileBAPP(file);
    };
    const onFileBARChangeHandler = (file: any) => {
        processFileBAR(file);
    };

    return (
        <>
            <Modal width={800} confirmLoading={loading} title="Tambah Berita Acara" open={isModalOpen} onCancel={closeModal} footer={null}>
                <Form
                    form={form}
                    labelCol={{ span: 3 }}
                    labelAlign="left"
                    disabled={loading || isProcessLoadBAP || isProcessLoadBAPP || isProcessLoadBAR}
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
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="no_bap" label="No BAP" placeholder="No BAP" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="no_bar" label="No BAR" placeholder="No BAR" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="no_bapp" label="No BAPP" placeholder="No BAPP" />
                            </Col>
                            <Col span={12}>
                                <InputFile
                                    handleChange={onFileBAPChangeHandler}
                                    label="bap document"
                                    types={["pdf", "jpg", "jpeg", "png"]}
                                    multiple={false}
                                    name="file_bap"
                                />
                            </Col>
                            <Col span={12}>
                                <InputFile
                                    handleChange={onFileBARChangeHandler}
                                    label="bar document"
                                    types={["pdf", "jpg", "jpeg", "png"]}
                                    multiple={false}
                                    name="file_bar"
                                />
                            </Col>
                            <Col span={12}>
                                <InputFile
                                    handleChange={onFileBAPPChangeHandler}
                                    label="bapp document"
                                    types={["pdf", "jpg", "jpeg", "png"]}
                                    multiple={false}
                                    name="file_bapp"
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

export default AddNews;
