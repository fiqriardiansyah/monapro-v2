import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { Negotiation } from "models";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import InputFile from "components/form/inputs/input-file";
import { useMutation } from "react-query";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: Negotiation, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Omit<Negotiation, "id">> = yup.object().shape({
    date: yup.string().required("Tanggal wajib diisi"),
    justification_no: yup.string().required("No Justifikasi wajib diisi"),
    justification_regarding: yup.string().required("Perihal Justifikasi wajib diisi"),
    notes: yup.string().required("Catatan Justifikasi wajib diisi"),
    document: yup.string(),
});

const EditNegotiation = ({ onSubmit, loading, children }: Props) => {
    const [prevData, setPrevData] = useState<Negotiation | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
    } = useForm<Negotiation>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const detailMutation = useMutation(async (id: string) => {}, {
        onSuccess: (data: any) => {
            // form.setFieldsValue({
            //     load_name: data?.load_name || "",
            // });
            // setValue("load_name", data?.load_name || "");
        },
    });

    const closeModal = () => {
        if (loading) return;
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const openModalWithData = (data: string | undefined) => {
        if (data) {
            const dataParse = JSON.parse(data) as Negotiation;
            setPrevData(dataParse);
            setIsModalOpen(true);
            detailMutation.mutate(dataParse?.id as any);
        }
    };

    const onSubmitHandler = handleSubmit((data) => {
        onSubmit(data, () => {
            closeModal();
        });
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
                title={`${detailMutation.isLoading ? "Mengambil data" : "Edit Negosiasi"}`}
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
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 24 }}
                                    name="justification_no"
                                    label="No Justifikasi"
                                    placeholder="No Justifikasi"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 24 }}
                                    name="justification_regarding"
                                    label="Perihal justifikasi"
                                    placeholder="Perihal"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="date" label="Tanggal Negosiasi" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="notes" label="Catatan" placeholder="Catatan" />
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

export default EditNegotiation;
