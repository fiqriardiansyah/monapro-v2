import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, notification, Row, Space } from "antd";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { SelectOption } from "models";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import InputFile from "components/form/inputs/input-file";
import procurementService from "services/api-endpoints/procurement";
import { useQuery } from "react-query";
import moment from "moment";
import { FORMAT_DATE, QUARTAL } from "utils/constant";
import useBase64File from "hooks/useBase64File";
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

const schema: yup.SchemaOf<FDataJustification> = yup.object().shape({
    justification_date: yup.string().required("Tanggal wajib diisi"),
    agenda_data_id: yup.number(),
    value: yup.string().required("Nilai justifikasi wajib diisi"),
    about_justification: yup.string().required("Perihal wajib diisi"),
    approval_position_id: yup.string().required("Approval posisi wajib diisi"),
    load_type_id: yup.string().required("Jenis beban wajib diisi"),
    sub_load_id: yup.string(),
    subunit_id: yup.string().required("Sub unit wajib diisi"),
    quartal_id: yup.number().required("Quartal wajib diisi"),
    note: yup.string().required("Catatan wajib diisi"),
    event_date: yup.string().required("Pelaksanaan acara wajib diisi"),
    estimation_paydate: yup.string().required("Perkiraan pembayaran wajib diisi"),
    doc_justification: yup.string(),
});

const AddJustification = ({ onSubmit, loading, children }: Props) => {
    const { base64, processFile, isProcessLoad } = useBase64File();

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        watch,
        setValue,
    } = useForm<FDataJustification>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const loadTypeId = watch("load_type_id");

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

    const approvalQuery = useQuery(
        [procurementService.getApprovalPosition],
        async () => {
            const req = await procurementService.GetApprovalPosition();
            const approval = req.data.data?.map(
                (el) =>
                    ({
                        label: el.position,
                        value: el.approval_position_id,
                    } as SelectOption)
            );
            return approval;
        },
        {
            onError: (error: any) => {
                notification.error({ message: procurementService.getApprovalPosition, description: error?.message });
            },
        }
    );

    const agendaDataQuery = useQuery(
        [procurementService.getNoAgenda],
        async () => {
            const req = await procurementService.GetNoAgenda();
            const agenda = req.data.data?.map(
                (el) =>
                    ({
                        label: el.no_agenda_secretariat,
                        value: el.agenda_data_id,
                    } as SelectOption)
            );
            return agenda;
        },
        {
            onError: (error: any) => {
                notification.error({ message: procurementService.getSubUnit, description: error?.message });
            },
        }
    );

    const isHaveSubLoad = useMemo(() => {
        form.setFieldsValue({
            sub_load_id: "",
        });
        setValue("sub_load_id", "");
        return loadTypeQuery.data?.find((el) => el.load_type_id === loadTypeId)?.sub_load === 1;
    }, [loadTypeId]);

    const subLoadQuery = useQuery(
        [procurementService.getSubLoad],
        async () => {
            const req = await procurementService.GetSubLoad({ load_type_id: loadTypeId as any });
            const subLoad = req.data.data?.map(
                (el) =>
                    ({
                        label: el.sub_load_name,
                        value: el.sub_load_id,
                    } as SelectOption)
            );
            return subLoad;
        },
        {
            enabled: isHaveSubLoad,
            onError: (error: any) => {
                notification.error({ message: procurementService.getSubUnit, description: error?.message });
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

    const onSubmitHandler = handleSubmit((data) => {
        const parseData: FDataJustification = {
            ...data,
            justification_date: data.justification_date ? moment(data.justification_date).format(FORMAT_DATE) : "",
            event_date: data.event_date ? moment(data.event_date).format(FORMAT_DATE) : "",
            estimation_paydate: data.estimation_paydate ? moment(data.estimation_paydate).format(FORMAT_DATE) : "",
            sub_load_id: data.sub_load_id || null,
            agenda_data_id: data.agenda_data_id || null,
            doc_justification: base64,
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

    return (
        <>
            <Modal width={800} confirmLoading={loading} title="Tambah Justifikasi" open={isModalOpen} onCancel={closeModal} footer={null}>
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
                                    options={
                                        loadTypeQuery.data?.map((el) => ({
                                            label: el.load_name,
                                            value: el.load_type_id,
                                        })) || []
                                    }
                                />
                            </Col>
                            {isHaveSubLoad && (
                                <Col span={12}>
                                    <ControlledSelectInput
                                        showSearch
                                        name="sub_load_id"
                                        label="Sub Beban"
                                        placeholder="Sub Beban"
                                        optionFilterProp="children"
                                        control={control}
                                        loading={subLoadQuery.isLoading}
                                        options={subLoadQuery.data || []}
                                    />
                                </Col>
                            )}
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
                                <ControlledSelectInput
                                    showSearch
                                    name="agenda_data_id"
                                    label="No Agenda"
                                    placeholder="No Agenda"
                                    optionFilterProp="children"
                                    control={control}
                                    loading={agendaDataQuery.isLoading}
                                    options={agendaDataQuery.data || []}
                                />
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

export default AddJustification;
