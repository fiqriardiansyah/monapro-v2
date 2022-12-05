import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Modal, Row, Space, Upload } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { LoadType } from "models";
import { useMutation } from "react-query";
import loadTypeService from "services/api-endpoints/masterdata/load-type";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: LoadType, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Omit<LoadType, "id">> = yup.object().shape({
    load_name: yup.string().required("Jenis beban wajib diisi"),
    sub_load_name: yup.string().required("Sub Jenis beban wajib diisi"),
});

const EditLoadType = ({ onSubmit, loading, children }: Props) => {
    const [prevData, setPrevData] = useState<LoadType | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
    } = useForm<LoadType>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const detailMutation = useMutation(
        async (id: string) => {
            const res = await loadTypeService.Detail<LoadType>({ id });
            return res.data.data;
        },
        {
            onSuccess: (data: any) => {
                form.setFieldsValue({
                    load_name: data?.load_name || "",
                    sub_load_name: data?.sub_load_name || "",
                });
                setValue("load_name", data?.load_name || "");
                setValue("sub_load_name", data?.sub_load_name || ""); // [IMPORTANT] property not sure
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
            const dataParse = JSON.parse(data) as LoadType;
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
                title={`${detailMutation.isLoading ? "Mengambil data..." : "Edit jenis beban"}`}
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
                        <ControlledInputText control={control} labelCol={{ xs: 12 }} name="load_name" label="Nama Beban" placeholder="Nama Beban" />
                        <ControlledInputText
                            control={control}
                            labelCol={{ xs: 12 }}
                            name="sub_load_name"
                            label="Nama Sub Beban"
                            placeholder="Nama Sub Beban"
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

export default EditLoadType;
