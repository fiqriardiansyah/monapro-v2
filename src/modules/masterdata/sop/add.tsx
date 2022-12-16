/* eslint-disable no-shadow */
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { LoadType } from "models";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import { COMMON_FILE_EXTENSIONS, MONTH_SHORT, QUARTAL_MONTH, QUARTAL_MONTH_SHORT } from "utils/constant";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import moment from "moment";
import InputFile from "components/form/inputs/input-file";
import useBase64File from "hooks/useBase64File";
import { FDataSop } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

type Props = {
    onSubmit: (data: FDataSop, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataSop>> = yup.object().shape({
    name: yup.string().required("Nama Peraturan wajib diisi"),
    document: yup.string(),
    _: yup.string(),
});

const AddSop = ({ onSubmit, loading, children }: Props) => {
    const { base64, processFile, isProcessLoad } = useBase64File();

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        reset,
    } = useForm<FDataSop>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const resetForm = () => {
        reset();
        form.setFieldsValue({
            name: "",
            document: "",
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
        onSubmit(data, () => {
            closeModal();
        });
    });

    const childrenData: ChildrenProps = {
        isModalOpen,
        openModal,
        closeModal,
    };

    const onFileChangeHandler = (file: any) => {
        processFile(file);
    };

    return (
        <>
            <Modal confirmLoading={loading} title="Tambah Peraturan" open={isModalOpen} onCancel={closeModal} footer={null}>
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
                        <ControlledInputText
                            control={control}
                            labelCol={{ xs: 12 }}
                            name="name"
                            label="Nama Peraturan"
                            placeholder="Nama Peraturan"
                        />
                        <InputFile
                            handleChange={onFileChangeHandler}
                            label="Dokumen"
                            types={COMMON_FILE_EXTENSIONS}
                            multiple={false}
                            name="document"
                        />

                        <div className="w-full mt-4">
                            <Space>
                                <Button type="primary" htmlType="submit" loading={loading} disabled={!isValid}>
                                    Simpan
                                </Button>
                                <Button type="primary" danger onClick={closeModal}>
                                    Batalkan
                                </Button>
                            </Space>
                        </div>
                    </Space>
                </Form>
            </Modal>
            {children(childrenData)}
        </>
    );
};

export default AddSop;
