import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import { ROLE } from "utils/constant";
import { FDataUser } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

type Props = {
    onSubmit: (data: FDataUser, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataUser>> = yup.object().shape({
    email: yup.string().required("Email wajib diisi").email("Not valid email"),
    password: yup.string().required("Password wajib diisi"),
    role_id: yup.number().required("Role wajib diisi"),
    full_name: yup.string().required("Nama wajib diisi"),
});

const AddUser = ({ onSubmit, loading, children }: Props) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
    } = useForm<FDataUser>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const closeModal = () => {
        if (loading) return;
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const onSubmitHandler = handleSubmit((data) => {
        const parseData: FDataUser = {
            ...data,
        };
        onSubmit(parseData, () => {
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
            <Modal confirmLoading={loading} title="Tambah User" open={isModalOpen} onCancel={closeModal} footer={null}>
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
                        <ControlledInputText control={control} labelCol={{ xs: 24 }} name="full_name" label="Nama" placeholder="Nama" />
                        <ControlledInputText control={control} labelCol={{ xs: 24 }} name="email" label="Email" placeholder="Email" />
                        <ControlledInputText
                            type="password"
                            control={control}
                            labelCol={{ xs: 24 }}
                            name="password"
                            label="Password"
                            placeholder="Password"
                        />
                        <ControlledSelectInput
                            showSearch
                            name="role_id"
                            label="Role"
                            placeholder="Role"
                            optionFilterProp="children"
                            control={control}
                            options={ROLE}
                        />

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

export default AddUser;
