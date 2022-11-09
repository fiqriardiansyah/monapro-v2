import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { Justification } from "models";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import InputFile from "components/form/inputs/input-file";
import { useMutation } from "react-query";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: Justification, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Omit<Justification, "id">> = yup.object().shape({
    date: yup.string().required("Tanggal wajib diisi"),
    document: yup.string(),
    regarding: yup.string().required("Perihal wajib diisi"),
    sub_unit: yup.string().required("Sub unit wajib diisi"),
    agenda_no: yup.string().required("No agenda wajib diisi"),
    code_and_budget: yup.string().required("Kode dan anggaran wajib diisi"),
    creator: yup.string().required("Creator wajib diisi"),
    justification_value: yup.string().required("Nilai justifikasi wajib diisi"),
    last_approval: yup.string().required("Approval terakhir wajib diisi"),
    no: yup.string().required("No justifikasi wajib diisi"),
    notes: yup.string().required("Catatan wajib diisi"),
});

const EditJustification = ({ onSubmit, loading, children }: Props) => {
    const [prevData, setPrevData] = useState<Justification | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
    } = useForm<Justification>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const detailMutation = useMutation(async (id: string) => {}, {
        onSuccess: (data: any) => {
            // form.setFieldsValue({
            //     load_name: data?.load_name || "",
            // });
            // setValue("load_name", data?.load_name || "");
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
            const dataParse = JSON.parse(data) as Justification;
            setPrevData(dataParse);
            setIsModalOpen(true);
            detailMutation.mutate(dataParse?.id as any);
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

    const onFileChangeHandler = (file: any) => {
        console.log(file);
    };

    return (
        <>
            <Modal
                confirmLoading={loading}
                title={`${detailMutation.isLoading ? "Mengambil data" : "Edit Justifikasi"}`}
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
            >
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
                        <Row gutter={10}>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 24 }}
                                    name="no"
                                    label="No Justifikasi"
                                    placeholder="No Justifikasi"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="date" label="Tanggal justifikasi" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 24 }} name="agenda_no" label="No agenda" placeholder="Nomor" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="regarding" label="Perihal" placeholder="Perihal" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputNumber
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    name="justification_value"
                                    label="Nilai justifikasi"
                                    placeholder="Nilai justifikasi"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="creator" label="Creator" placeholder="Creator" />
                            </Col>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="sub_unit"
                                    label="Sub Unit"
                                    placeholder="Sub Unit"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={false}
                                    options={[]}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="last_approval"
                                    label="Approval terakhir"
                                    placeholder="Approval terakhir"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={false}
                                    options={[]}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="code_and_budget"
                                    label="Kode & Anggaran"
                                    placeholder="Kode & Anggaran"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={false}
                                    options={[]}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="notes" label="Catatan" placeholder="Catatan" />
                            </Col>
                            <Col span={12}>
                                <InputFile
                                    handleChange={onFileChangeHandler}
                                    label="file document"
                                    types={["pdf", "jpg", "jpeg", "png"]}
                                    multiple={false}
                                    name="document"
                                />
                            </Col>
                        </Row>

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

export default EditJustification;
