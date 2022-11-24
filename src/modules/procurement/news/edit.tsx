import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { News, SelectOption } from "models";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import InputFile from "components/form/inputs/input-file";
import { useMutation, useQuery } from "react-query";
import procurementService from "services/api-endpoints/procurement";
import newsService from "services/api-endpoints/procurement/news";
import { FDataNews } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: FDataNews & { id: string }, callback: () => void) => void;
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

const EditNews = ({ onSubmit, loading, children }: Props) => {
    const [prevData, setPrevData] = useState<News | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
    } = useForm<FDataNews>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const justificationQuery = useQuery([procurementService.getJustification], async () => {
        const req = await procurementService.GetJustification();
        const subunit = req.data.data?.map(
            (el) =>
                ({
                    label: el.no_justification,
                    value: el.justification_id,
                } as SelectOption)
        );
        return subunit;
    });

    const detailMutation = useMutation(
        async (id: string) => {
            const req = await newsService.Detail({ id });
            return req.data.data;
        },
        {
            onSuccess: (data) => {
                form.setFieldsValue({
                    justification_id: data?.no_justification || "",
                    no_bap: data?.no_bap || "",
                    no_bar: data?.no_bar || "",
                    no_bapp: data?.no_bapp || "",
                    file_bap: data?.file_bap || "",
                    file_bar: data?.file_bar || "",
                    file_bapp: data?.file_bapp || "",
                });
                setValue("justification_id", data?.no_justification || ""); // [IMPORTANT] JUSTIFICATION_ID
                setValue("no_bap", data?.no_bap || "");
                setValue("no_bar", data?.no_bar || "");
                setValue("no_bapp", data?.no_bapp || "");
                setValue("file_bap", data?.file_bap || "");
                setValue("file_bar", data?.file_bar || "");
                setValue("file_bapp", data?.file_bapp || "");
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
            const dataParse = JSON.parse(data) as News;
            setPrevData(dataParse);
            setIsModalOpen(true);
            detailMutation.mutate(dataParse?.id as any);
        }
    };

    const onSubmitHandler = handleSubmit((data) => {
        onSubmit(
            {
                ...data,
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
                confirmLoading={loading}
                title={`${detailMutation.isLoading ? "Mengambil data..." : "Edit Berita Acara"}`}
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
            >
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
                                    handleChange={onFileChangeHandler}
                                    label="bap document"
                                    types={["pdf", "jpg", "jpeg", "png"]}
                                    multiple={false}
                                    name="file_bap"
                                />
                            </Col>
                            <Col span={12}>
                                <InputFile
                                    handleChange={onFileChangeHandler}
                                    label="bar document"
                                    types={["pdf", "jpg", "jpeg", "png"]}
                                    multiple={false}
                                    name="file_bar"
                                />
                            </Col>
                            <Col span={12}>
                                <InputFile
                                    handleChange={onFileChangeHandler}
                                    label="bapp document"
                                    types={["pdf", "jpg", "jpeg", "png"]}
                                    multiple={false}
                                    name="file_bapp"
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

export default EditNews;
