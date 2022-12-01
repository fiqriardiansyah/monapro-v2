import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, notification, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { AgendaData, SelectOption } from "models";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import InputFile from "components/form/inputs/input-file";
import { useMutation, useQuery } from "react-query";
import { DECISION, FOLLOW_UP, FORMAT_DATE } from "utils/constant";
import agendaService from "services/api-endpoints/agenda";
import agendaDataService from "services/api-endpoints/agenda/agenda-data";
import moment from "moment";
import useBase64File from "hooks/useBase64File";
import ButtonDeleteFile from "components/common/button-delete-file";
import { FDataAgenda } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: FDataAgenda & { id: string }, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataAgenda>> = yup.object().shape({
    date: yup.string().required("Tanggal wajib diisi"),
    endorse: yup.number(),
    letter_no: yup.string(),
    letter_date: yup.string().required("Tangal Surat wajib diisi"),
    sender: yup.string().required("Pengirim wajib diisi"),
    about: yup.string().required("Perihal wajib diisi"),
    subunit_id: yup.string().required("Sub unit wajib diisi"),
    follow_up: yup.string().required("Tindak lanjut wajib diisi"),
    decision: yup.string().required("Keputusan wajib diisi"),
    event_date: yup.string(),
    estimation_paydate: yup.string(),
    document: yup.string(),
    _: yup.string(),
});

const EditAgendaData = ({ onSubmit, loading, children }: Props) => {
    const { base64, processFile, isProcessLoad } = useBase64File();

    const [prevData, setPrevData] = useState<AgendaData | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
        getValues,
        watch,
    } = useForm<FDataAgenda>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const docWatch = watch("document");

    const subUnitQuery = useQuery(
        [agendaService.getSubUnit],
        async () => {
            const req = await agendaService.GetSubUnit();
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
                notification.error({ message: agendaService.getSubUnit, description: error?.message });
            },
        }
    );

    const detailMutation = useMutation(
        async (id: string) => {
            const req = await agendaDataService.Detail<AgendaData>({ id });
            return req.data.data;
        },
        {
            onSuccess: (data) => {
                form.setFieldsValue({
                    date: data.date ? moment(data?.date) : moment(),
                    endorse: data?.endorse || 0,
                    letter_no: data?.letter_no || "",
                    letter_date: data?.letter_date ? moment(data?.letter_date) : moment(),
                    sender: data?.sender || "",
                    about: data?.about || "",
                    subunit_id: data?.subunit_id || "",
                    follow_up: data?.follow_up || "",
                    decision: data?.decision || "",
                    event_date: data?.event_date ? moment(data?.event_date) : moment(),
                    estimation_paydate: data?.estimation_paydate ? moment(data?.estimation_paydate) : moment(),
                    document: data?.document || "",
                });
                setValue("date", data?.date ? (moment(data?.date) as any) : moment());
                setValue("endorse", data?.endorse || 0);
                setValue("letter_no", data?.letter_no || "");
                setValue("letter_date", data?.letter_date ? (moment(data?.letter_date) as any) : moment());
                setValue("sender", data?.sender || "");
                setValue("about", data?.about || "");
                setValue("subunit_id", data?.subunit_id || "");
                setValue("follow_up", data?.follow_up || "");
                setValue("decision", data?.decision || "");
                setValue("event_date", data?.event_date ? (moment(data?.event_date) as any) : moment());
                setValue("estimation_paydate", data?.estimation_paydate ? (moment(data?.estimation_paydate) as any) : moment());
                setValue("document", data?.document || "");
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
            const dataParse = JSON.parse(data) as AgendaData;
            setPrevData(dataParse);
            setIsModalOpen(true);
            detailMutation.mutate(dataParse?.id as any);
        }
    };

    const onSubmitHandler = handleSubmit((data) => {
        const parseData: FDataAgenda = {
            ...data,
            date: data.date ? moment(data.date).format(FORMAT_DATE) : "",
            letter_date: data.letter_date ? moment(data.letter_date).format(FORMAT_DATE) : "",
            event_date: data.event_date ? moment(data.event_date).format(FORMAT_DATE) : "",
            estimation_paydate: data.estimation_paydate ? moment(data.estimation_paydate).format(FORMAT_DATE) : "",
            document: base64 || getValues()?.document || null,
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
            document: "",
        });
        setValue("document", "");
    };

    return (
        <>
            <Modal
                width={800}
                confirmLoading={loading}
                title={`${detailMutation.isLoading ? "Mengambil data..." : "Edit Data Agenda"}`}
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
                                <ControlledInputText control={control} labelCol={{ xs: 12 }} name="about" label="Perihal" placeholder="Perihal" />
                            </Col>
                            <Col span={12}>
                                <ControlledSelectInput
                                    showSearch
                                    name="subunit_id"
                                    label="Sub Unit"
                                    placeholder="Sub Unit"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={false}
                                    options={subUnitQuery.data || []}
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
                                    options={FOLLOW_UP}
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
                                    options={DECISION}
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="event_date" label="Pelaksanaan acara" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="estimation_paydate" label="Perkiraan bayar" />
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
                                        name="document"
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

export default EditAgendaData;
