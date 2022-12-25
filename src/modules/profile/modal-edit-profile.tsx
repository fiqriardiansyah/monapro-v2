import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Image, Modal, notification, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import InputFile from "components/form/inputs/input-file";
import useBase64File from "hooks/useBase64File";
import profileService from "services/api-endpoints/profile";
import { useQuery } from "react-query";
import { FEditUser } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

type Props = {
    onSubmit: (data: FEditUser, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FEditUser>> = yup.object().shape({
    full_name: yup.string(),
    profile_image: yup.string().nullable(),
});

const ModalEditProfile = ({ onSubmit, loading, children }: Props) => {
    const { base64, processFile, isProcessLoad } = useBase64File();

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        reset,
        setValue,
        getValues,
    } = useForm<FEditUser>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const getProfile = useQuery(
        [profileService.getProfile],
        async () => {
            const res = await profileService.GetProfile();
            return res.data.data;
        },
        {
            onSuccess: (data) => {
                form.setFieldsValue({
                    full_name: data.full_name,
                    profile_image: data.profile_image,
                });
                setValue("full_name", data.full_name);
                setValue("profile_image", data.profile_image as any);
            },
        }
    );

    const resetForm = () => {
        reset();
        processFile(null);
        form.setFieldsValue({
            full_name: "",
            profile_image: "",
        });
    };

    const closeModal = () => {
        if (loading) return;
        setIsModalOpen(false);
        resetForm();
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const onSubmitHandler = handleSubmit((data) => {
        const parseData = {
            ...data,
            profile_image: base64 || getValues()?.profile_image || null,
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

    const onFileChange = (file: any) => {
        processFile(file);
    };

    return (
        <>
            <Modal confirmLoading={loading} title="Profile" open={isModalOpen} onCancel={closeModal} footer={null}>
                <Form
                    form={form}
                    labelCol={{ span: 3 }}
                    labelAlign="left"
                    disabled={loading || getProfile.isLoading || isProcessLoad}
                    colon={false}
                    style={{ width: "100%" }}
                    onFinish={onSubmitHandler}
                    layout="vertical"
                >
                    <Space direction="vertical" className="w-full">
                        <div className="flex flex-col gap-5">
                            {base64 && <img src={base64} alt="profile" className="w-32 h-32 rounded-full object-cover" />}
                            <InputFile
                                handleChange={onFileChange}
                                label=""
                                types={["png", "jpeg", "jpg", "webp"]}
                                multiple={false}
                                name="profile_image"
                            />
                            <ControlledInputText control={control} labelCol={{ xs: 24 }} name="full_name" label="" placeholder="Nama" />
                        </div>

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

export default ModalEditProfile;
