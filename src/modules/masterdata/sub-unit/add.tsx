import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { SubUnitData } from "models";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

type Props = {
    onSubmit: (data: SubUnitData, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Omit<SubUnitData, "id">> = yup.object().shape({
    pic_name: yup.string().required("Nama PIC wajib diisi"),
    unit_name: yup.string().required("Nama unit wajib diisi"),
    budget_q1: yup.string().required("Anggaran Q1 wajib diisi"),
    budget_q2: yup.string().required("Anggaran Q2 wajib diisi"),
    budget_q3: yup.string().required("Anggaran Q3 wajib diisi"),
    budget_q4: yup.string().required("Anggaran Q4 wajib diisi"),
});

const AddSubUnit = ({ onSubmit, loading, children }: Props) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
    } = useForm<SubUnitData>({
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
            <Modal confirmLoading={loading} title="Tambah Sub Unit" open={isModalOpen} onCancel={closeModal} footer={null}>
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
                        <ControlledInputText control={control} labelCol={{ xs: 12 }} name="pic_name" label="Nama PIC" placeholder="Nama PIC" />
                        <ControlledInputText control={control} labelCol={{ xs: 12 }} name="unit_name" label="Nama unit" placeholder="Nama unit" />
                        <div className="grid grid-cols-2 gap-5">
                            <ControlledInputNumber
                                control={control}
                                labelCol={{ xs: 12 }}
                                name="budget_q1"
                                label="Anggaran q1"
                                placeholder="Anggaran q1"
                            />
                            <ControlledInputNumber
                                control={control}
                                labelCol={{ xs: 12 }}
                                name="budget_q2"
                                label="Anggaran q2"
                                placeholder="Anggaran q2"
                            />
                            <ControlledInputNumber
                                control={control}
                                labelCol={{ xs: 12 }}
                                name="budget_q3"
                                label="Anggaran q3"
                                placeholder="Anggaran q3"
                            />
                            <ControlledInputNumber
                                control={control}
                                labelCol={{ xs: 12 }}
                                name="budget_q4"
                                label="Anggaran q4"
                                placeholder="Anggaran q4"
                            />
                        </div>

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

export default AddSubUnit;
