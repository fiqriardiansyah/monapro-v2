import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// components
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { LoadType } from "models";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import { MONTH_SHORT, QUARTAL_MONTH, QUARTAL_MONTH_SHORT } from "utils/constant";
import ControlledInputNumber from "components/form/controlled-inputs/controlled-input-number";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import moment from "moment";
import { FDataLoadType } from "./models";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

type Props = {
    onSubmit: (data: FDataLoadType, callback: () => void) => void;
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

const AddLoadType = ({ onSubmit, loading, children }: Props) => {
    const [quartalVisible, setQuartalVisible] = useState(1);

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { isValid },
    } = useForm<FDataLoadType>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const closeModal = () => {
        if (loading) return;
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const onSubmitHandler = handleSubmit((data) => {
        const activeMonth = QUARTAL_MONTH_SHORT.filter((q) => q.quartal <= quartalVisible)
            .map((q) => q.month)
            .reduce((a, b) => a.concat(b), []);
        const deleteNoActiveMonth = Object.keys({ ...data })
            .map((k) => {
                const key = k as keyof FDataLoadType;
                if (!MONTH_SHORT.includes(key) && !activeMonth.includes(key)) return key;
                if (MONTH_SHORT.includes(key) && !activeMonth.includes(key)) {
                    return null;
                }
                return key;
            })
            .filter((el) => el);
        const parseData = { ...data };
        Object.keys(parseData).forEach((k) => {
            const key = k as keyof FDataLoadType;
            if (!deleteNoActiveMonth.includes(key)) {
                delete parseData[key];
            }
        });
        MONTH_SHORT.forEach((m) => {
            const month = m as keyof FDataLoadType;
            if (!(month in parseData)) {
                parseData[month] = 0;
            }
        });

        onSubmit(
            {
                ...parseData,
                year: moment(parseData.year).format("yyyy"),
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
    };

    const addMoreQuartal = () => {
        setQuartalVisible((prev) => prev + 1);
    };

    const removeQuartal = () => {
        setQuartalVisible((prev) => prev - 1);
    };

    return (
        <>
            <Modal width={900} confirmLoading={loading} title="Tambah jenis beban" open={isModalOpen} onCancel={closeModal} footer={null}>
                <Form
                    form={form}
                    labelCol={{ span: 3 }}
                    labelAlign="left"
                    disabled={loading}
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
                        {QUARTAL_MONTH_SHORT?.map((el) => {
                            if (quartalVisible >= el.quartal) {
                                return (
                                    <div className="w-full flex gap-4 items-center">
                                        <p className="capitalize w-[300px] ">quartal: {el.quartal}</p>
                                        {el.month?.map((month) => (
                                            <ControlledInputNumber
                                                control={control}
                                                labelCol={{ xs: 12 }}
                                                name={month.toLowerCase() as any}
                                                label={month.toUpperCase()}
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

export default AddLoadType;
