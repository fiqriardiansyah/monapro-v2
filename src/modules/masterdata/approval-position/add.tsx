import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { ApprovalPosition } from "models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

type Props = {
    onSubmit: (data: ApprovalPosition, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Omit<ApprovalPosition, "id">> = yup.object().shape({
    name: yup.string().required("Nama wajib diisi"),
    position: yup.string().required("Jabatan wajib diisi"),
});

const AddApprovalPosition = ({ onSubmit, loading, children }: Props) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        reset,
    } = useForm<ApprovalPosition>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const closeModal = () => {
        if (loading) return;
        setIsModalOpen(false);
        reset();
    };

    const openModal = () => {
        setIsModalOpen(true);
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
    };

    return (
        <>
            <Modal confirmLoading={loading} title="Tambah posisi jabatan" open={isModalOpen} onCancel={closeModal} footer={null}>
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
                        <ControlledInputText control={control} labelCol={{ xs: 12 }} name="name" label="Nama" placeholder="Nama" />
                        <ControlledInputText control={control} labelCol={{ xs: 12 }} name="position" label="Jabatan" placeholder="Jabatan" />

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

export default AddApprovalPosition;
