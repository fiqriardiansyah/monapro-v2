import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Form, Modal, notification, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import { News, SelectOption } from "models";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import InputFile from "components/form/inputs/input-file";
import { useMutation, useQuery } from "react-query";
import procurementService from "services/api-endpoints/procurement";
import newsService from "services/api-endpoints/procurement/news";
import useBase64File from "hooks/useBase64File";
import ButtonDeleteFile from "components/common/button-delete-file";
import { COMMON_FILE_EXTENSIONS, FORMAT_DATE, FORMAT_DATE_IND } from "utils/constant";
import moment from "moment";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import { FDataNews } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: FDataNews & { id: string }, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<FDataNews>> = yup.object().shape({
    justification_id: yup.string(),
    date_news: yup.string().nullable(),
    file_bap: yup.string(),
    file_bapp: yup.string(),
    file_bar: yup.string(),
});

const EditNews = ({ onSubmit, loading, children }: Props) => {
    const { base64: base64BAP, processFile: processFileBAP, isProcessLoad: isProcessLoadBAP } = useBase64File();
    const { base64: base64BAR, processFile: processFileBAR, isProcessLoad: isProcessLoadBAR } = useBase64File();
    const { base64: base64BAPP, processFile: processFileBAPP, isProcessLoad: isProcessLoadBAPP } = useBase64File();

    const [prevData, setPrevData] = useState<News | null>(null);

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
    } = useForm<FDataNews>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const bapDocWatch = watch("file_bap");
    const bappDocWatch = watch("file_bapp");
    const barDocWatch = watch("file_bar");

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
            const req = await newsService.Detail({ id });
            return req.data.data;
        },
        {
            onSuccess: (data) => {
                form.setFieldsValue({
                    justification_id: data?.justification_id || "",
                    file_bap: data?.file_bap || "",
                    file_bar: data?.file_bar || "",
                    file_bapp: data?.file_bapp || "",
                    date_news: data?.date_news ? (moment(data?.date_news) as any) : moment(),
                });
                setValue("justification_id", data?.justification_id || "");
                setValue("file_bap", data?.file_bap || "");
                setValue("file_bar", data?.file_bar || "");
                setValue("file_bapp", data?.file_bapp || "");
                setValue("date_news", data?.date_news ? (moment(data?.date_news) as any) : moment());
            },
        }
    );

    const resetForm = () => {
        setPrevData(null);
        processFileBAP(null);
        processFileBAPP(null);
        processFileBAR(null);
        reset();
        form.setFieldsValue({
            justification_id: "",
            date_news: null,
            file_bap: "",
            file_bapp: "",
            file_bar: "",
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
            const dataParse = JSON.parse(data) as News;
            setPrevData(dataParse);
            setIsModalOpen(true);
            detailMutation.mutate(dataParse?.id as any);
        }
    };

    const onSubmitHandler = handleSubmit((data) => {
        const parseData: FDataNews = {
            ...data,
            date_news: data.date_news ? moment(data.date_news).format(FORMAT_DATE) : "",
            file_bap: base64BAP || getValues()?.file_bap || null,
            file_bapp: base64BAPP || getValues()?.file_bapp || null,
            file_bar: base64BAR || getValues()?.file_bar || null,
        };
        onSubmit(
            {
                ...parseData,
                id: prevData?.id as any,
            },
            () => {
                closeModal();
                processFileBAP(null);
                processFileBAPP(null);
                processFileBAR(null);
            }
        );
    });

    const childrenData: ChildrenProps = {
        isModalOpen,
        openModal,
        closeModal,
        openModalWithData,
    };

    const onFileBAPChangeHandler = (file: any) => {
        processFileBAP(file);
    };
    const onFileBAPPChangeHandler = (file: any) => {
        processFileBAPP(file);
    };
    const onFileBARChangeHandler = (file: any) => {
        processFileBAR(file);
    };

    const onClickFileBAPDeleteHandler = () => {
        form.setFieldsValue({
            file_bap: "",
        });
        setValue("file_bap", "");
    };
    const onClickFileBAPPDeleteHandler = () => {
        form.setFieldsValue({
            file_bapp: "",
        });
        setValue("file_bapp", "");
    };
    const onClickFileBARDeleteHandler = () => {
        form.setFieldsValue({
            file_bar: "",
        });
        setValue("file_bar", "");
    };

    return (
        <>
            <Modal
                width={800}
                confirmLoading={loading}
                title={`${detailMutation.isLoading ? "Mengambil data..." : "Edit Berita Acara"}`}
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
            >
                <Form
                    form={form}
                    labelCol={{ span: 3 }}
                    labelAlign="left"
                    disabled={loading || detailMutation.isLoading || isProcessLoadBAP || isProcessLoadBAPP || isProcessLoadBAR}
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
                                <ControlledInputDate
                                    format={FORMAT_DATE_IND}
                                    control={control}
                                    labelCol={{ xs: 12 }}
                                    name="date_news"
                                    label="Tanggal Berita Acara"
                                />
                            </Col>
                            <Col span={12}>
                                {bapDocWatch ? (
                                    <div className="w-full">
                                        <p className="m-0 capitalize mb-2">bap document</p>
                                        <ButtonDeleteFile
                                            url={bapDocWatch}
                                            name="Document"
                                            label="File Document"
                                            onClick={onClickFileBAPDeleteHandler}
                                        />
                                    </div>
                                ) : (
                                    <InputFile
                                        handleChange={onFileBAPChangeHandler}
                                        label="bap document"
                                        types={COMMON_FILE_EXTENSIONS}
                                        multiple={false}
                                        name="file_bap"
                                    />
                                )}
                            </Col>
                            <Col span={12}>
                                {barDocWatch ? (
                                    <div className="w-full">
                                        <p className="m-0 capitalize mb-2">bar document</p>
                                        <ButtonDeleteFile
                                            url={barDocWatch}
                                            name="Document"
                                            label="File Document"
                                            onClick={onClickFileBARDeleteHandler}
                                        />
                                    </div>
                                ) : (
                                    <InputFile
                                        handleChange={onFileBARChangeHandler}
                                        label="bar document"
                                        types={COMMON_FILE_EXTENSIONS}
                                        multiple={false}
                                        name="file_bar"
                                    />
                                )}
                            </Col>
                            <Col span={12}>
                                {bappDocWatch ? (
                                    <div className="w-full">
                                        <p className="m-0 capitalize mb-2">bapp document</p>
                                        <ButtonDeleteFile
                                            url={bappDocWatch}
                                            name="Document"
                                            label="File Document"
                                            onClick={onClickFileBAPPDeleteHandler}
                                        />
                                    </div>
                                ) : (
                                    <InputFile
                                        handleChange={onFileBAPPChangeHandler}
                                        label="bapp document"
                                        types={COMMON_FILE_EXTENSIONS}
                                        multiple={false}
                                        name="file_bapp"
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

export default EditNews;
