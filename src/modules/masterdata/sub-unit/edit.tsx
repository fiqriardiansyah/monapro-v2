import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { SubUnitData } from "models";
import { useMutation } from "react-query";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import subUnitService from "services/api-endpoints/masterdata/sub-unit";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: SubUnitData, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Omit<SubUnitData, "id">> = yup.object().shape({
    pic_name: yup.string().required("Nama PIC wajib diisi"),
    unit_name: yup.string().required("Nama unit wajib diisi"),
});

const EditSubUnit = ({ onSubmit, loading, children }: Props) => {
    const [prevData, setPrevData] = useState<SubUnitData | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
        reset,
    } = useForm<SubUnitData>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const detailMutation = useMutation(
        async (id: string) => {
            const res = await subUnitService.Detail<SubUnitData>({ id });
            return res.data.data;
        },
        {
            onSuccess: (data: any) => {
                form.setFieldsValue({
                    pic_name: data?.pic_name || "",
                    unit_name: data?.unit_name || "",
                });
                setValue("pic_name", data?.pic_name || "");
                setValue("unit_name", data?.unit_name || "");
            },
        }
    );

    const closeModal = () => {
        if (loading) return;
        setIsModalOpen(false);
        reset();
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const openModalWithData = (data: string | undefined) => {
        if (data) {
            const dataParse = JSON.parse(data) as SubUnitData;
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
            () => {
                closeModal();
            }
        );
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
                title={`${detailMutation.isLoading ? "Mengambil data..." : "Edit Sub Unit"}`}
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
                        <ControlledInputText control={control} labelCol={{ xs: 12 }} name="pic_name" label="Nama PIC" placeholder="Nama PIC" />
                        <ControlledInputText control={control} labelCol={{ xs: 12 }} name="unit_name" label="Nama unit" placeholder="Nama unit" />

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

export default EditSubUnit;
