import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { ApprovalPosition } from "models";
import { useMutation } from "react-query";
import approvalPositionService from "services/api-endpoints/masterdata/approval-position";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
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

const EditApprovalPosition = ({ onSubmit, loading, children }: Props) => {
    const [prevData, setPrevData] = useState<ApprovalPosition | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
        reset,
    } = useForm<ApprovalPosition>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const detailMutation = useMutation(
        async (id: string) => {
            const res = await approvalPositionService.Detail<ApprovalPosition>({ id });
            return res.data.data;
        },
        {
            onSuccess: (data: any) => {
                form.setFieldsValue({
                    name: data?.name || "",
                    position: data?.position || 0,
                });
                setValue("name", data?.name || "");
                setValue("position", data?.position || "");
            },
        }
    );

    const resetForm = () => {
        reset();
        setPrevData(null);
    };

    const closeModal = () => {
        if (loading) return;
        setIsModalOpen(false);
        resetForm();
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const openModalWithData = (data: string | undefined) => {
        if (data) {
            const dataParse = JSON.parse(data) as ApprovalPosition;
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
                title={`${detailMutation.isLoading ? "Mengambil data" : "Edit posisi jabatan"}`}
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

export default EditApprovalPosition;
