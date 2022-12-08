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
import { QUARTAL_MONTH } from "utils/constant";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
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

const schema: yup.SchemaOf<Partial<FDataLoadType>> = yup.object().shape({
    load_name: yup.string().required("Jenis beban wajib diisi"),
    year: yup.string(),
    januari: yup.string(),
    februari: yup.string(),
    maret: yup.string(),
    april: yup.string(),
    mei: yup.string(),
    juni: yup.string(),
    juli: yup.string(),
    agustus: yup.string(),
    september: yup.string(),
    oktober: yup.string(),
    november: yup.string(),
    desember: yup.string(),
    _: yup.string(),
});

const EditLoadType = ({ onSubmit, loading, children }: Props) => {
    const [quartalVisible, setQuartalVisible] = useState(1);
    const [prevData, setPrevData] = useState<LoadType | null>(null);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
        setValue,
    } = useForm<FDataLoadType>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const detailMutation = useMutation(
        async (id: string) => {
            const res = await loadTypeService.Detail<LoadType>({ id });
            return res.data.data;
        },
        {
            onSuccess: (data) => {
                form.setFieldsValue({
                    load_name: data?.load_name || "",
                });
                setValue("load_name", data?.load_name || "");
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
            const dataParse = JSON.parse(data) as LoadType;
            setPrevData(dataParse);
            setIsModalOpen(true);
            detailMutation.mutate(dataParse?.id as any);
        }
    };

    const onSubmitHandler = handleSubmit((data) => {
        // onSubmit(
        //     {
        //         ...data,
        //         id: prevData?.id as any,
        //     },
        //     () => {
        //         closeModal();
        //     }
        // );
        const month = QUARTAL_MONTH.find((el) => el.quartal === quartalVisible);
    });

    const childrenData: ChildrenProps = {
        isModalOpen,
        openModal,
        closeModal,
        openModalWithData,
    };

    const addMoreQuartal = () => {
        setQuartalVisible((prev) => prev + 1);
    };

    const removeQuartal = () => {
        setQuartalVisible((prev) => prev - 1);
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
                        {QUARTAL_MONTH?.map((el) => {
                            if (quartalVisible >= el.quartal) {
                                return (
                                    <div className="w-full flex gap-4 items-center">
                                        <p className="capitalize w-[300px] ">quartal: {el.quartal}</p>
                                        {el.month?.map((month) => (
                                            <ControlledInputNumber
                                                control={control}
                                                labelCol={{ xs: 12 }}
                                                name={month.toLowerCase() as any}
                                                label={month}
                                                placeholder={month}
                                            />
                                        ))}
                                    </div>
                                );
                            }
                            return null;
                        })}

                        <div className="w-full flex items-center justify-between">
                            <Space>
                                <Button type="primary" htmlType="submit" loading={loading} disabled={!isValid}>
                                    Simpan
                                </Button>
                                <Button type="primary" danger onClick={closeModal}>
                                    Batalkan
                                </Button>
                            </Space>
                            <Space>
                                {quartalVisible !== 1 && (
                                    <Button
                                        onClick={removeQuartal}
                                        icon={<AiOutlineMinus className="mr-2" />}
                                        className="!flex !items-center"
                                        type="text"
                                    >
                                        Quartal
                                    </Button>
                                )}
                                {quartalVisible !== 4 && (
                                    <Button
                                        onClick={addMoreQuartal}
                                        icon={<AiOutlinePlus className="mr-2" />}
                                        className="!flex !items-center"
                                        type="primary"
                                    >
                                        Quartal
                                    </Button>
                                )}
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
