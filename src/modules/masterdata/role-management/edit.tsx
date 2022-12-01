import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { Role } from "models";
import { useMutation } from "react-query";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: Role, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

// const schema: yup.SchemaOf<Omit<Role, "id">> = yup.object().shape({
//     role_id: yup.string().required("Role id wajib diisi"),
//     role_name: yup.string().required("Role name wajib diisi"),
//     email: yup.string().required("Email wajib diisi"),
//     full_name: yup.string().required("Name wajib diisi"),
// });

const EditRole = ({ onSubmit, loading, children }: Props) => {
    const [prevData, setPrevData] = useState<Role | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
    } = useForm<Role>({
        mode: "onChange",
        // resolver: yupResolver(schema),
    });

    const detailMutation = useMutation(async (id: string) => {}, {
        onSuccess: (data: any) => {
            form.setFieldsValue({
                full_name: data?.full_name || "",
                email: data?.email || "",
                role_id: data?.role_id || "",
                role_name: data?.role_name || "",
            });
            setValue("full_name", data?.full_name || "");
            setValue("email", data?.email || "");
            setValue("role_id", data?.role_id || "");
            setValue("role_name", data?.role_name || "");
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
            const dataParse = JSON.parse(data) as Role;
            setPrevData(dataParse);
            setIsModalOpen(true);
            // detailMutation.mutate(dataParse?.id as any);
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

    return (
        <>
            <Modal
                confirmLoading={loading}
                title={`${detailMutation.isLoading ? "Mengambil data" : "Edit role"}`}
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
                        <ControlledInputText control={control} labelCol={{ xs: 12 }} name="role_id" label="Role ID" placeholder="Role ID" />
                        <ControlledInputText control={control} labelCol={{ xs: 12 }} name="role_name" label="Role Name" placeholder="Role name" />
                        <ControlledInputText control={control} labelCol={{ xs: 12 }} name="email" label="Email" placeholder="Email" />
                        <ControlledInputText control={control} labelCol={{ xs: 12 }} name="full_name" label="Full Name" placeholder="Full name" />

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

export default EditRole;
