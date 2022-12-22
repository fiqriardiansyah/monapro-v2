import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, notification, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
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
import { COMMON_FILE_EXTENSIONS, FORMAT_DATE, PROCUREMENT_VALUES, QUARTAL, SPONSORSHIP_VALUES } from "utils/constant";
import useBase64File from "hooks/useBase64File";
import ButtonDeleteFile from "components/common/button-delete-file";
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

const schema: yup.SchemaOf<Partial<FDataJustification>> = yup.object().shape({
    justification_date: yup.string().required("Tanggal wajib diisi"),
    agenda_data_id: yup.string(),
    value: yup.string(),
    about_justification: yup.string(),
    approval_position: yup.string().required("Approval posisi wajib diisi"), // wajib
    load_type_id: yup.string().required("Jenis beban wajib diisi"), // wajib
    subunit_id: yup.string().required("Sub unit wajib diisi"), // wajib
    quartal_id: yup.number().required("Quartal wajib diisi"),
    note: yup.string(),
    event_date: yup.string().required("Tanggal wajib diisi"),
    estimation_paydate: yup.string().required("Tanggal wajib diisi"),
    doc_justification: yup.string(),
});

const SPONSORSHIP = 0;
const PROCUREMENT = 1;

const EditJustification = ({ onSubmit, loading, children }: Props) => {
    const { base64, processFile, isProcessLoad } = useBase64File();

    const [prevData, setPrevData] = useState<Justification | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { handleSubmit, control, setValue, getValues, watch, reset } = useForm<FDataJustification>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const docWatch = watch("doc_justification");
    const agenda = watch("agenda_data_id");
    const value = watch("value");

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
        return req.data.data;
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

    const detailMutation = useMutation(
        async (id: string) => {
            const req = await justificationService.Detail({ id });
            return req.data.data;
        },
        {
            onSuccess: (data: any) => {
                form.setFieldsValue({
                    justification_date: data?.justification_date ? (moment(data?.justification_date) as any) : moment(),
                    agenda_data_id: data?.agenda_data_id || "",
                    value: data?.value || 0,
                    about_justification: data?.about_justification || "",
                    approval_position_id: data?.approval_position_id || "",
                    load_type_id: data?.load_type_id || "",
                    subunit_id: data?.subunit_id || "",
                    note: data?.note || "",
                    event_date: data?.event_date ? (moment(data?.event_date) as any) : moment(),
                    estimation_paydate: data?.estimation_paydate ? (moment(data?.estimation_paydate) as any) : moment(),
                    doc_justification: data?.doc_justification || "",
                    quartal_id: data?.quartal_id || "",
                });
                setValue("justification_date", data?.justification_date ? (moment(data?.justification_date) as any) : moment());
                setValue("agenda_data_id", data?.agenda_data_id || "");
                setValue("value", data?.value || 0);
                setValue("about_justification", data?.about_justification || "");
                setValue("approval_position", data?.approval_position || "");
                setValue("load_type_id", data?.load_type_id || "");
                setValue("subunit_id", data?.subunit_id || "");
                setValue("note", data?.note || "");
                setValue("event_date", data?.event_date ? (moment(data?.event_date) as any) : moment());
                setValue("estimation_paydate", data?.estimation_paydate ? (moment(data?.estimation_paydate) as any) : moment());
                setValue("doc_justification", data?.doc_justification || "");
                setValue("quartal_id", data?.quartal_id || "");
            },
        }
    );

    const resetForm = () => {
        processFile(null);
        reset();
        setPrevData(null);
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

    const openModalWithData = (data: string | undefined) => {
        if (data) {
            const dataParse = JSON.parse(data) as Justification;
            setPrevData(dataParse);
            setIsModalOpen(true);
            detailMutation.mutate(dataParse?.id as any);
        }
    };

    const onSubmitHandler = handleSubmit((data) => {
        const parseData: FDataJustification = {
            ...data,
            justification_date: data.justification_date ? moment(data.justification_date).format(FORMAT_DATE) : "",
            event_date: data.event_date ? moment(data.event_date).format(FORMAT_DATE) : "",
            estimation_paydate: data.estimation_paydate ? moment(data.estimation_paydate).format(FORMAT_DATE) : "",
            doc_justification: base64 || getValues()?.doc_justification || null,
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
            doc_justification: "",
        });
        setValue("doc_justification", "");
    };

    useEffect(() => {
        const values = agenda ? SPONSORSHIP_VALUES : PROCUREMENT_VALUES;
        const findValue = values.sort((a, b) => b.value - a.value).find((el) => el.value < Number(value || 0));
        form.setFieldsValue({
            approval_position: findValue?.label,
        });
        setValue("approval_position", findValue?.label || "");
    }, [value, agenda]);

    useEffect(() => {
        if (agenda === undefined || agenda === null || !agenda) return;
        const about = agendaDataQuery.data?.find((el) => el.agenda_data_id === Number(agenda))?.about;
        form.setFieldsValue({
            about_justification: about || detailMutation.data?.about_justification,
        });
        setValue("about_justification", about || detailMutation.data?.about_justification || "");
    }, [agenda]);

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
                    disabled={loading || detailMutation.isLoading || isProcessLoad}
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
                            {agenda && (
                                <Col span={12}>
                                    <ControlledSelectInput
                                        disabled
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
                            )}
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
                                <ControlledSelectInput
                                    showSearch
                                    name="quartal_id"
                                    label="Quartal"
                                    placeholder="Quartal"
                                    optionFilterProp="children"
                                    control={control}
                                    // loading={approvalQuery.isLoading}
                                    options={QUARTAL}
                                />
                            </Col>

                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="estimation_paydate" label="Perkiraan bayar" />
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
                            {/* <Col span={12}>
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
                            </Col> */}
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
                                        types={COMMON_FILE_EXTENSIONS}
                                        multiple={false}
                                        name="doc_justification"
                                    />
                                )}
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="event_date" label="Pelaksanaan acara" />
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

export default EditJustification;
