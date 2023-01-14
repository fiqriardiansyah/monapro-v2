/* eslint-disable no-shadow */
/* eslint-disable no-self-compare */
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, notification, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { SelectOption } from "models";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import InputFile from "components/form/inputs/input-file";
import procurementService from "services/api-endpoints/procurement";
import { useQuery } from "react-query";
import moment, { Moment } from "moment";
import {
    COMMON_FILE_EXTENSIONS,
    FORMAT_DATE,
    QUARTAL,
    SPONSORSHIP_VALUES,
    QUARTAL_MONTH_SHORT_EN,
    FORMAT_DATE_IND,
    SPONSORSHIP_TYPE,
    MAXIMAL_NON_JUSTIFICATION,
} from "utils/constant";
import useBase64File from "hooks/useBase64File";
import Utils from "utils";
import { FDataJustification } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

type Props = {
    onSubmit: (data: FDataJustification, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataJustification>> = yup.object().shape({
    justification_date: yup.string().required("Tanggal wajib diisi"),
    agenda_data_id: yup.string().required("Agenda wajib diisi"),
    value: yup.string().required("Nilai wajib diisi"),
    about_justification: yup.string(),
    approval_position: yup.string().required("Approval posisi wajib diisi"), // wajib
    load_type_id: yup.string().required("Jenis beban wajib diisi"), // wajib
    subunit_id: yup.string().required("Sub unit wajib diisi"), // wajib
    quartal_id: yup.number().required("Quartal wajib diisi"),
    note: yup.string(),
    event_date: yup.string().required("Tanggal wajib diisi"),
    estimation_paydate: yup.string().required("Tanggal wajib diisi"),
    doc_justification: yup.string(),
    type: yup.number().required(""),
});

const AddNonJustification = ({ onSubmit, loading, children }: Props) => {
    const { base64, processFile, isProcessLoad } = useBase64File();

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        watch,
        reset,
        setValue,
        setError,
    } = useForm<FDataJustification>({
        mode: "onChange",
        resolver: yupResolver(schema),
        defaultValues: {
            type: SPONSORSHIP_TYPE,
        },
    });

    const agenda = watch("agenda_data_id");
    const value = watch("value");
    const estimationPaydate = watch("estimation_paydate");

    const subUnitQuery = useQuery(
        [procurementService.getSubUnit],
        async () => {
            const req = await procurementService.GetSubUnit();
            const subunit = req.data.data?.map(
                (el) =>
                    ({
                        label: el.subunit_name,
                        value: el.subunit_id,
                    } as SelectOption)
            );
            return subunit;
        },
        {
            onError: (error: any) => {
                notification.error({ message: procurementService.getSubUnit, description: error?.message });
            },
        }
    );

    const loadTypeQuery = useQuery(
        [procurementService.getLoadType],
        async () => {
            const req = await procurementService.GetLoadType();
            return req.data.data;
        },
        {
            onError: (error: any) => {
                notification.error({ message: procurementService.getLoadType, description: error?.message });
            },
        }
    );

    const agendaDataQuery = useQuery(
        [procurementService.getNoAgenda],
        async () => {
            const req = await procurementService.GetNoAgenda();
            return req.data.data;
        },
        {
            onError: (error: any) => {
                notification.error({ message: procurementService.getSubUnit, description: error?.message });
            },
        }
    );

    const resetForm = () => {
        processFile(null);
        reset();
        form.setFieldsValue({
            justification_date: "",
            agenda_data_id: "",
            value: "",
            about_justification: "",
            approval_position_id: "",
            load_type_id: "",
            subunit_id: "",
            quartal_id: "",
            note: "",
            event_date: "",
            estimation_paydate: "",
            doc_justification: "",
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

    const onSubmitHandler = handleSubmit(async (data) => {
        await form.validateFields();

        const value = Utils.convertToIntFormat(data.value as any) || 0;
        if (value > MAXIMAL_NON_JUSTIFICATION) {
            setError("value", {
                message: "Maximal nilai 20.000.0000",
                type: "max",
            });
            return;
        }

        const parseData: FDataJustification = {
            ...data,
            value,
            justification_date: data.justification_date ? moment(data.justification_date).format(FORMAT_DATE) : "",
            event_date: data.event_date ? moment(data.event_date).format(FORMAT_DATE) : "",
            estimation_paydate: data.estimation_paydate ? moment(data.estimation_paydate).format(FORMAT_DATE) : "",
            agenda_data_id: data.agenda_data_id || null,
            doc_justification: base64,
            type: SPONSORSHIP_TYPE,
        };
        onSubmit(parseData, () => {
            closeModal();
            processFile(null);
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

    useEffect(() => {
        const findValue = SPONSORSHIP_VALUES.sort((a, b) => b.value - a.value).find(
            (el) => el.value < Number(Utils.convertToIntFormat((value as any) || "0") || 0)
        );
        form.setFieldsValue({
            approval_position: findValue?.label,
        });
        setValue("approval_position", findValue?.label || "");
    }, [value]);

    useEffect(() => {
        if (agenda === undefined || agenda === null) return;
        const about = agendaDataQuery.data?.find((el) => el.agenda_data_id === Number(agenda))?.about;
        form.setFieldsValue({
            about_justification: about || "",
        });
        setValue("about_justification", about || "");
    }, [agenda]);

    useEffect(() => {
        if (!estimationPaydate) return;
        const month = moment(estimationPaydate).format("MMM").toLocaleLowerCase();
        const idQuartal = QUARTAL_MONTH_SHORT_EN.find((el) => el.month.includes(month))?.quartal;
        form.setFieldValue("quartal_id", idQuartal);
        setValue("quartal_id", idQuartal!);
    }, [estimationPaydate]);

    return (
        <>
            <Modal width={800} confirmLoading={loading} title="Tambah Non Justifikasi" open={isModalOpen} onCancel={closeModal} footer={null}>
                <Form
                    form={form}
                    labelCol={{ span: 3 }}
                    labelAlign="left"
                    disabled={loading || isProcessLoad}
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
                                    name="agenda_data_id"
                                    label="No Agenda"
                                    placeholder="No Agenda"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={agendaDataQuery.isLoading}
                                    options={
                                        agendaDataQuery.data?.map(
                                            (el) =>
                                                ({
                                                    label: el.no_agenda_secretariat,
                                                    value: el.agenda_data_id,
                                                } as SelectOption)
                                        ) || []
                                    }
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate
                                    format={FORMAT_DATE_IND}
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    name="justification_date"
                                    label="Tanggal justifikasi"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 24 }}
                                    type="number"
                                    name="value"
                                    label="Nilai justifikasi"
                                    placeholder="Nilai justifikasi"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    disabled
                                    name="about_justification"
                                    label="Perihal"
                                    placeholder="Perihal"
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
                                    options={
                                        loadTypeQuery.data?.map((el) => ({
                                            label: el.load_name,
                                            value: el.load_type_id,
                                        })) || []
                                    }
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
                                <ControlledInputDate
                                    control={control}
                                    picker="month"
                                    format="MMM yyyy"
                                    labelCol={{ xs: 12 }}
                                    name="estimation_paydate"
                                    label="Bulan penagihan"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledSelectInput
                                    disabled
                                    name="quartal_id"
                                    label="Quartal penagihan"
                                    placeholder="Quartal"
                                    optionFilterProp="children"
                                    control={control}
                                    // loading={approvalQuery.isLoading}
                                    options={QUARTAL}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="note" label="Catatan" placeholder="Catatan" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    disabled
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    name="approval_position"
                                    label="Approval posisi"
                                    placeholder="Approval posisi"
                                />
                            </Col>
                            <Col span={12}>
                                <InputFile
                                    handleChange={onFileChangeHandler}
                                    label="file document"
                                    types={COMMON_FILE_EXTENSIONS}
                                    multiple={false}
                                    name="doc_justification"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate
                                    format={FORMAT_DATE_IND}
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    name="event_date"
                                    label="Pelaksanaan acara"
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

export default AddNonJustification;
