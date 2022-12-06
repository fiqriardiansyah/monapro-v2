import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { LoadType } from "models";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import { FDataLoadType } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

type Props = {
    onSubmit: (data: FDataLoadType, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<FDataLoadType> = yup.object().shape({
    load_name: yup.string().required("Jenis beban wajib diisi"),
    sub_load: yup.number(),
    sub_load_model: yup.array(),
});

const AddLoadType = ({ onSubmit, loading, children }: Props) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
    } = useForm<FDataLoadType>({
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
        onSubmit(
            {
                ...data,
                sub_load_model: data.sub_load_model?.map((el: any) => ({ sub_load_name: el } as any)) || [],
                sub_load: data.sub_load_model?.length ? 1 : null,
            },
            () => {
                closeModal();
            }
        );
    });

    const childrenData: ChildrenProps = {
        isModalOpen,
        openModal,
        closeModal,
    };

    return (
        <>
            <Modal confirmLoading={loading} title="Tambah jenis beban" open={isModalOpen} onCancel={closeModal} footer={null}>
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
                        <ControlledInputText control={control} labelCol={{ xs: 12 }} name="load_name" label="Nama Beban" placeholder="Nama Beban" />
                        <ControlledSelectInput
                            mode="tags"
                            name="sub_load_model"
                            label="Sub Beban"
                            placeholder="Sub Beban"
                            control={control}
                            options={[]}
                        />

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

export default AddLoadType;
