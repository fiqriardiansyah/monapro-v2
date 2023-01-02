/* eslint-disable react/no-array-index-key */
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Input, Modal, Row, Space, Upload } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { LoadType } from "models";
import { useMutation } from "react-query";
import loadTypeService from "services/api-endpoints/masterdata/load-type";
import { MONTH_SHORT, QUARTAL_MONTH, QUARTAL_MONTH_SHORT } from "utils/constant";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import moment from "moment";
import { FDataLoadType, FDataLoadTypeId } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    openModalWithData: (data: string | undefined) => void;
};

type Props = {
    onSubmit: (data: FDataLoadTypeId, callback: () => void) => void;
    loading: boolean;
    children: (data: ChildrenProps) => void;
};

const schema: yup.SchemaOf<Partial<Omit<FDataLoadType, "budget_id">>> = yup.object().shape({
    load_name: yup.string().required("Jenis beban wajib diisi"),
    year: yup.string(),
    jan: yup.string(),
    feb: yup.string(),
    mar: yup.string(),
    apr: yup.string(),
    may: yup.string(),
    jun: yup.string(),
    jul: yup.string(),
    agu: yup.string(),
    sep: yup.string(),
    oct: yup.string(),
    nov: yup.string(),
    des: yup.string(),
    _: yup.string(),
});

const EditLoadType = ({ onSubmit, loading, children }: Props) => {
    const [prevData, setPrevData] = useState<LoadType | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
        reset,
    } = useForm<FDataLoadType>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const resetForm = () => {
        setPrevData(null);
        reset();
        form.setFieldsValue({
            load_name: "",
            year: "",
            jan: "",
            feb: "",
            mar: "",
            apr: "",
            may: "",
            jun: "",
            jul: "",
            agu: "",
            sep: "",
            oct: "",
            nov: "",
            des: "",
        });
    };

    const detailMutation = useMutation(
        async (id: string) => {
            const res = await loadTypeService.Detail<LoadType>({ id });
            return res.data.data;
        },
        {
            onSuccess: (data) => {
                form.setFieldsValue({
                    load_name: data?.load_name || "",
                    year: data?.year ? (moment(data?.year) as any) : moment(),
                    jan: data?.jan || "",
                    feb: data?.feb || "",
                    mar: data?.mar || "",
                    apr: data?.apr || "",
                    may: data?.may || "",
                    jun: data?.jun || "",
                    jul: data?.jul || "",
                    agu: data?.agu || "",
                    sep: data?.sep || "",
                    oct: data?.oct || "",
                    nov: data?.nov || "",
                    des: data?.des || "",
                });
                setValue("load_name", data?.load_name || "");
                setValue("year", data?.year ? (moment(data?.year) as any) : moment());
                setValue("jan", data?.jan || "");
                setValue("feb", data?.feb || "");
                setValue("mar", data?.mar || "");
                setValue("apr", data?.apr || "");
                setValue("may", data?.may || "");
                setValue("jun", data?.jun || "");
                setValue("jul", data?.jul || "");
                setValue("agu", data?.agu || "");
                setValue("sep", data?.sep || "");
                setValue("oct", data?.oct || "");
                setValue("nov", data?.nov || "");
                setValue("des", data?.des || "");
            },
        }
    );

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
            const dataParse = JSON.parse(data) as LoadType;
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
                year: moment(data.year).format("yyyy"),
                budget_id: detailMutation.data?.budget_id as any,
            },
            () => {
                closeModal();
            }
        );
    });

    const childrenData: ChildrenProps = {
        isModalOpen,
        openModal,
        closeModal,
        openModalWithData,
    };

    return (
        <>
            <Modal
                width={900}
                confirmLoading={loading}
                title={`${detailMutation.isLoading ? "Mengambil data..." : "Edit jenis beban"}`}
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
                        <div className="w-full flex gap-4">
                            <ControlledInputText
                                control={control}
                                labelCol={{ xs: 12 }}
                                name="load_name"
                                label="Nama Beban"
                                placeholder="Nama Beban"
                            />
                            <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="year" picker="year" label="Tahun Anggaran" />
                        </div>
                        {QUARTAL_MONTH_SHORT?.map((el) => (
                            <div className="w-full flex gap-4 items-center">
                                <p className="capitalize w-[300px] ">quartal: {el.quartal}</p>
                                {el.month?.map((month) => (
                                    <ControlledInputText
                                        control={control}
                                        labelCol={{ xs: 12 }}
                                        type="number"
                                        name={month.toLowerCase() as any}
                                        label={month}
                                        placeholder={month}
                                    />
                                ))}
                            </div>
                        ))}

                        <div className="w-full flex items-center justify-between">
                            <Space>
                                <Button type="primary" htmlType="submit" loading={loading} disabled={!isValid}>
                                    Simpan
                                </Button>
                                <Button type="primary" danger onClick={closeModal}>
                                    Batalkan
                                </Button>
                            </Space>
                        </div>
                    </Space>
                </Form>
            </Modal>
            {children(childrenData)}
        </>
    );
};

export default EditLoadType;
