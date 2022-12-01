import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, notification, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { Negotiation, SelectOption } from "models";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import InputFile from "components/form/inputs/input-file";
import { useMutation, useQuery } from "react-query";
import procurementService from "services/api-endpoints/procurement";
import negotiationService from "services/api-endpoints/procurement/negotiation";
import moment from "moment";
import { FORMAT_DATE } from "utils/constant";
import useBase64File from "hooks/useBase64File";
import ButtonDeleteFile from "components/common/button-delete-file";
import { FDataNegotiation } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: FDataNegotiation & { id: string }, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataNegotiation>> = yup.object().shape({
    justification_id: yup.string(),
    doc_negotiation: yup.string(),
    negotiation_date: yup.string(),
    note: yup.string(),
});

const EditNegotiation = ({ onSubmit, loading, children }: Props) => {
    const { base64, processFile, isProcessLoad } = useBase64File();

    const [prevData, setPrevData] = useState<Negotiation | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
        getValues,
        watch,
    } = useForm<FDataNegotiation>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const docWatch = watch("doc_negotiation");

    const justificationQuery = useQuery(
        [procurementService.getJustification],
        async () => {
            const req = await procurementService.GetJustification();
            const subunit = req.data.data?.map(
                (el) =>
                    ({
                        label: el.no_justification,
                        value: el.justification_id,
                    } as SelectOption)
            );
            return subunit;
        },
        {
            onError: (error: any) => {
                notification.error({ message: procurementService.getJustification, description: error?.message });
            },
        }
    );

    const detailMutation = useMutation(
        async (id: string) => {
            const req = await negotiationService.Detail({ id });
            return req.data.data;
        },
        {
            onSuccess: (data) => {
                form.setFieldsValue({
                    justification_id: data?.justification_id || "",
                    negotiation_date: data?.negotiation_date ? (moment(data?.negotiation_date) as any) : moment(),
                    note: data?.note || "",
                    doc_negotiation: data?.doc_negotiation || "",
                });
                setValue("justification_id", data?.justification_id || "");
                setValue("negotiation_date", data?.negotiation_date ? (moment(data?.negotiation_date) as any) : moment());
                setValue("note", data?.note || "");
                setValue("doc_negotiation", data?.doc_negotiation || "");
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
            const dataParse = JSON.parse(data) as Negotiation;
            setPrevData(dataParse);
            setIsModalOpen(true);
            detailMutation.mutate(dataParse?.id as any);
        }
    };

    const onSubmitHandler = handleSubmit((data) => {
        const parseData: FDataNegotiation = {
            ...data,
            negotiation_date: data.negotiation_date ? moment(data.negotiation_date).format(FORMAT_DATE) : "",
            doc_negotiation: base64 || getValues()?.doc_negotiation || null,
        };
        onSubmit(
            {
                ...parseData,
                id: prevData?.id as any,
            },
            () => {
                closeModal();
                processFile(null);
            }
        );
    });

    const childrenData: ChildrenProps = {
        isModalOpen,
        openModal,
        closeModal,
        openModalWithData,
    };

    const onFileChangeHandler = (fl: any) => {
        processFile(fl);
    };

    const onClickFileDeleteHandler = () => {
        form.setFieldsValue({
            doc_negotiation: "",
        });
        setValue("doc_negotiation", "");
    };

    return (
        <>
            <Modal
                width={800}
                confirmLoading={loading}
                title={`${detailMutation.isLoading ? "Mengambil data..." : "Edit Negosiasi"}`}
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
                        <Row gutter={10}>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="justification_id"
                                    label="Justifikasi"
                                    placeholder="Justifikasi"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={justificationQuery.isLoading}
                                    options={justificationQuery.data || []}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="negotiation_date" label="Tanggal negosiasi" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 24 }} name="note" label="Catatan" placeholder="Catatan" />
                            </Col>
                            <Col span={12}>
                                {docWatch ? (
                                    <div className="w-full">
                                        <p className="m-0 capitalize mb-2">file document</p>
                                        <ButtonDeleteFile url={docWatch} name="Document" label="File Document" onClick={onClickFileDeleteHandler} />
                                    </div>
                                ) : (
                                    <InputFile
                                        handleChange={onFileChangeHandler}
                                        label="file document"
                                        types={["pdf", "jpg", "jpeg", "png"]}
                                        multiple={false}
                                        name="doc_justification"
                                    />
                                )}
                            </Col>
                        </Row>

                        <Row justify="start" className="mt-10">
                            <Space>
                                <Button type="primary" htmlType="submit" loading={loading}>
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

export default EditNegotiation;
