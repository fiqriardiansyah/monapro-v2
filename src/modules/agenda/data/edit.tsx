import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { AgendaData } from "models";
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
    onSubmit: (data: AgendaData, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Omit<AgendaData, "id">> = yup.object().shape({
    date: yup.string().required("Tanggal wajib diisi"),
    decision: yup.string().required("Keputusan wajib diisi"),
    document: yup.string(),
    endorse: yup.number().required("Endorse wajib diisi"),
    follow_up: yup.string().required("Tindak lanjut wajib diisi"),
    letter_date: yup.string().required("Tangal Surat wajib diisi"),
    letter_no: yup.string().required("Nomor Surat wajib diisi"),
    no_disposition: yup.string().required("Nomor Disposisi wajib diisi"),
    no_secretariat: yup.string().required("Nomor Sekretariat wajib diisi"),
    regarding: yup.string().required("Perihal wajib diisi"),
    sender: yup.string().required("Pengirim wajib diisi"),
    sub_unit: yup.string().required("Sub unit wajib diisi"),
    event_date: yup.string().required("Pelaksanaan acara wajib diisi"),
    payment_estimation_date: yup.string().required("Perkiraan pembayaran wajib diisi"),
});

const EditAgendaData = ({ onSubmit, loading, children }: Props) => {
    const [prevData, setPrevData] = useState<AgendaData | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
    } = useForm<AgendaData>({
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
            const dataParse = JSON.parse(data) as AgendaData;
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
                title={`${detailMutation.isLoading ? "Mengambil data" : "Edit Data Agenda"}`}
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
                                    name="no_secretariat"
                                    label="No agenda sekretariat"
                                    placeholder="Nomor"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 24 }}
                                    name="no_disposition"
                                    label="No agenda disposisi"
                                    placeholder="Nomor"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="date" label="Tanggal" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputNumber control={control} labelCol={{ xs: 12 }} name="endorse" label="Endorse" placeholder="Endorse" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="letter_no" label="No Surat" placeholder="Nomor" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="letter_date" label="Tanggal Surat" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="sender" label="Pengirim" placeholder="Pengirim" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="regarding" label="Perihal" placeholder="Perihal" />
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
                                    name="follow_up"
                                    label="Tindak Lanjut"
                                    placeholder="Tindak Lanjut"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={false}
                                    options={[]}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="decision"
                                    label="Keputusan"
                                    placeholder="Keputusan"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={false}
                                    options={[]}
                                />
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
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="event_date" label="Pelaksanaan acara" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="payment_estimation_date" label="Perkiraan bayar" />
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

export default EditAgendaData;
