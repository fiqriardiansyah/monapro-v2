import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import justificationService from "services/api-endpoints/procurement/justification";
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { Justification, SelectOption } from "models";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import InputFile from "components/form/inputs/input-file";
import { useMutation, useQuery } from "react-query";
import moment from "moment";
import procurementService from "services/api-endpoints/procurement";
import { FDataJustification } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: FDataJustification & { id: string }, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<FDataJustification> = yup.object().shape({
    justification_date: yup.string().required("Tanggal wajib diisi"),
    no_agenda: yup.string().required("No agenda wajib diisi"),
    value: yup.string().required("Nilai justifikasi wajib diisi"),
    about_justification: yup.string().required("Perihal wajib diisi"),
    note: yup.string().required("Catatan wajib diisi"),
    event_date: yup.string().required("Pelaksanaan acara wajib diisi"),
    estimation_paydate: yup.string().required("Perkiraan pembayaran wajib diisi"),
    doc_justification: yup.string(),
    approval_position_id: yup.string().required("Approval posisi wajib diisi"),
    load_type_id: yup.string().required("Jenis beban wajib diisi"),
    subunit_id: yup.string().required("Sub unit wajib diisi"),
});

const EditJustification = ({ onSubmit, loading, children }: Props) => {
    const [prevData, setPrevData] = useState<Justification | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
    } = useForm<FDataJustification>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const subUnitQuery = useQuery([procurementService.getSubUnit], async () => {
        const req = await procurementService.GetSubUnit();
        const subunit = req.data.data?.map(
            (el) =>
                ({
                    label: el.subunit_name,
                    value: el.subunit_id,
                } as SelectOption)
        );
        return subunit;
    });

    const loadTypeQuery = useQuery([procurementService.getLoadType], async () => {
        const req = await procurementService.GetLoadType();
        const subunit = req.data.data?.map(
            (el) =>
                ({
                    label: el.load_name,
                    value: el.load_type_id,
                } as SelectOption)
        );
        return subunit;
    });

    const approvalQuery = useQuery([procurementService.getApprovalPosition], async () => {
        const req = await procurementService.GetApprovalPosition();
        const subunit = req.data.data?.map(
            (el) =>
                ({
                    label: el.position,
                    value: el.approval_position_id,
                } as SelectOption)
        );
        return subunit;
    });

    const detailMutation = useMutation(
        async (id: string) => {
            const req = await justificationService.Detail({ id });
            return req.data.data;
        },
        {
            onSuccess: (data: any) => {
                form.setFieldsValue({
                    justification_date: (moment(data?.justification_date) as any) || moment(),
                    no_agenda: data?.no_agenda || "",
                    value: data?.value || 0,
                    about_justification: data?.about_justification || "",
                    approval_position_id: data?.approval_position_id || "",
                    load_type_id: data?.load_type_id || "",
                    subunit_id: data?.subunit_id || "",
                    note: data?.note || "",
                    event_date: (moment(data?.event_date) as any) || moment(),
                    estimation_paydate: (moment(data?.estimation_paydate) as any) || moment(),
                    doc_justification: data?.doc_justification || "",
                });
                setValue("justification_date", (moment(data?.justification_date) as any) || moment());
                setValue("no_agenda", data?.no_agenda || "");
                setValue("value", data?.value || 0);
                setValue("about_justification", data?.about_justification || "");
                setValue("approval_position_id", data?.approval_position_id || "");
                setValue("load_type_id", data?.load_type_id || "");
                setValue("subunit_id", data?.subunit_id || "");
                setValue("note", data?.note || "");
                setValue("event_date", (moment(data?.event_date) as any) || moment());
                setValue("estimation_paydate", (moment(data?.estimation_paydate) as any) || moment());
                setValue("doc_justification", data?.doc_justification || "");
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
            const dataParse = JSON.parse(data) as Justification;
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
            closeModal
        );
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
                width={800}
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
                    disabled={loading || detailMutation.isLoading}
                    colon={false}
                    style={{ width: "100%" }}
                    onFinish={onSubmitHandler}
                    layout="vertical"
                >
                    <Space direction="vertical" className="w-full">
                        <Row gutter={10}>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="justification_date" label="Tanggal justifikasi" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 24 }} name="no_agenda" label="No agenda" placeholder="Nomor" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputNumber
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    name="value"
                                    label="Nilai justifikasi"
                                    placeholder="Nilai justifikasi"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    name="about_justification"
                                    label="Perihal"
                                    placeholder="Perihal"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="approval_position_id"
                                    label="Approval posisi"
                                    placeholder="Approval posisi"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={approvalQuery.isLoading}
                                    options={approvalQuery.data || []}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="load_type_id"
                                    label="Jenis beban"
                                    placeholder="Jenis beban"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={loadTypeQuery.isLoading}
                                    options={loadTypeQuery.data || []}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="subunit_id"
                                    label="Sub unit"
                                    placeholder="Sub unit"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={subUnitQuery.isLoading}
                                    options={subUnitQuery.data || []}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="event_date" label="Pelaksanaan acara" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="estimation_paydate" label="Perkiraan bayar" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="note" label="Catatan" placeholder="Catatan" />
                            </Col>
                            <Col span={12}>
                                <InputFile
                                    handleChange={onFileChangeHandler}
                                    label="file document"
                                    types={["pdf", "jpg", "jpeg", "png"]}
                                    multiple={false}
                                    name="doc_justification"
                                />
                            </Col>
                        </Row>

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

export default EditJustification;
