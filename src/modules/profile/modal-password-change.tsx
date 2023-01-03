import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, message, Modal, Row, Space } from "antd";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import authService from "services/api-endpoints/auth";
import { UserContext } from "context/user";
import { useMutation } from "react-query";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import { FEditUser } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

type Props = {
    children: (data: ChildrenProps) => void;
};

export type PasswordChange = {
    password_old: string;
    password_new: string;
};

const schema: yup.SchemaOf<Partial<PasswordChange>> = yup.object().shape({
    password_new: yup.string().required("Password baru wajib diisi"),
    password_old: yup.string().required("Password lama wajib diisi"),
});

const ModalPasswordChange = ({ children }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [form] = Form.useForm();
    const {
        handleSubmit,
        control,
        formState: { isValid },
        reset,
        setValue,
    } = useForm<PasswordChange>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const resetForm = () => {
        reset();
        form.setFieldsValue({
            password_new: "",
            password_old: "",
        });
        setValue("password_new", "");
        setValue("password_old", "");
    };

    const updatePassword = useMutation(
        async (data: PasswordChange) => {
            try {
                return await authService.ChangePassword(data);
            } catch (e: any) {
                throw new Error(e?.message || DEFAULT_ERROR_MESSAGE);
            }
        },
        {
            onSuccess: () => {
                message.success("Password updated");
                resetForm();
                setIsModalOpen(false);
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const closeModal = () => {
        if (updatePassword.isLoading) return;
        setIsModalOpen(false);
        resetForm();
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const onSubmitHandler = handleSubmit((data) => {
        updatePassword.mutate(data);
    });

    const childrenData: ChildrenProps = {
        isModalOpen,
        openModal,
        closeModal,
    };

    return (
        <>
            <Modal confirmLoading={updatePassword.isLoading} title="Password" open={isModalOpen} onCancel={closeModal} footer={null}>
                <Form
                    form={form}
                    labelCol={{ span: 3 }}
                    labelAlign="left"
                    disabled={updatePassword.isLoading}
                    colon={false}
                    style={{ width: "100%" }}
                    onFinish={onSubmitHandler}
                    layout="vertical"
                >
                    <Space direction="vertical" className="w-full">
                        <ControlledInputText
                            control={control}
                            labelCol={{ xs: 24 }}
                            type="password"
                            name="password_old"
                            label="Password Lama"
                            placeholder="Password Lama"
                        />
                        <ControlledInputText
                            control={control}
                            labelCol={{ xs: 24 }}
                            type="password"
                            name="password_new"
                            label="Password Baru"
                            placeholder="Password Baru"
                        />

                        <Row justify="start" className="mt-10">
                            <Space>
                                <Button type="primary" htmlType="submit" loading={updatePassword.isLoading} disabled={!isValid}>
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

export default ModalPasswordChange;
