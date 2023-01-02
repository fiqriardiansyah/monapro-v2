import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, notification, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { ContractSpNopes, SelectOption } from "models";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import InputFile from "components/form/inputs/input-file";
import { useMutation, useQuery } from "react-query";
import procurementService from "services/api-endpoints/procurement";
import contractService from "services/api-endpoints/procurement/contract";
import moment from "moment";
import { COMMON_FILE_EXTENSIONS, FORMAT_DATE } from "utils/constant";
import useBase64File from "hooks/useBase64File";
import ButtonDeleteFile from "components/common/button-delete-file";
import { FDataContractSpNopes } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: FDataContractSpNopes & { id: string }, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataContractSpNopes>> = yup.object().shape({
    justification_id: yup.string(),
    no_contract: yup.string(),
    about_manage: yup.string(),
    date: yup.string().required("Tanggal wajib diisi"),
    value: yup.string(),
    doc: yup.string(),
});
const EditContractSpNopes = ({ onSubmit, loading, children }: Props) => {
    const { base64, processFile, isProcessLoad } = useBase64File();

    const [prevData, setPrevData] = useState<ContractSpNopes | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
        getValues,
        watch,
        reset,
    } = useForm<FDataContractSpNopes>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const docWatch = watch("doc");

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
            const req = await contractService.Detail({ id });
            return req.data.data;
        },
        {
            onSuccess: (data) => {
                form.setFieldsValue({
                    justification_id: data?.justification_id || "",
                    no_contract: data?.no_contract || "",
                    about_manage: data?.about_manage || "",
                    value: data?.value || "",
                    doc: data?.doc || "",
                    date: data?.date ? (moment(data?.date) as any) : moment(),
                });
                setValue("justification_id", data?.justification_id || "");
                setValue("no_contract", data?.no_contract || "");
                setValue("about_manage", data?.about_manage || "");
                setValue("date", data?.date ? (moment(data?.date) as any) : moment());
                setValue("value", data?.value || "");
                setValue("doc", data?.doc || "");
            },
        }
    );

    const resetForm = () => {
        processFile(null);
        reset();
        setPrevData(null);
        form.setFieldsValue({
            justification_id: "",
            no_contract: "",
            about_manage: "",
            date: "",
            value: "",
            doc: "",
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
            const dataParse = JSON.parse(data) as ContractSpNopes;
            setPrevData(dataParse);
            setIsModalOpen(true);
            detailMutation.mutate(dataParse?.id as any);
        }
    };

    const onSubmitHandler = handleSubmit((data) => {
        const parseData: FDataContractSpNopes = {
            ...data,
            date: data.date ? moment(data.date).format(FORMAT_DATE) : "",
            doc: base64 || getValues()?.doc || null,
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
            doc: "",
        });
        setValue("doc", "");
    };

    return (
        <>
            <Modal
                width={800}
                confirmLoading={loading}
                title={`${detailMutation.isLoading ? "Mengambil data..." : "Edit Kontrak"}`}
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
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 24 }}
                                    name="no_contract"
                                    label="Nomor Kontrak"
                                    placeholder="Nomor Kontrak"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 24 }}
                                    name="about_manage"
                                    label="Perihal"
                                    placeholder="Perihal Data Manage"
                                />
                            </Col>
                            <Col span={12}>
                                <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="date" label="Tanggal" />
                            </Col>
                            <Col span={12}>
                                <ControlledInputText
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    type="number"
                                    name="value"
                                    label="Nilai"
                                    placeholder="Nilai"
                                />
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
                                        types={COMMON_FILE_EXTENSIONS}
                                        multiple={false}
                                        name="doc_justification"
                                    />
                                )}
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

export default EditContractSpNopes;
