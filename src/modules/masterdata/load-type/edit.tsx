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
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
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

const schema: yup.SchemaOf<FDataLoadType> = yup.object().shape({
    load_name: yup.string().required("Jenis beban wajib diisi"),
    sub_load: yup.number(),
    sub_load_model: yup.array(),
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
        watch,
        register,
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
        // const inputsSubLoad = document.querySelectorAll(".input_sub_load");
        // if(inputsSubLoad) {
        // }
        // const subLoads = detailMutation.data?.list_sub_load?.map((subLoad) => {
        //     const input = inpt as HTMLInputElement;
        //     return {
        //         sub_load_id: input.dataset.subid,
        //         sub_load_name: input.value,
        //         is_active:
        //     };
        // });
        // console.log(subLoads);
        // onSubmit(
        //     {
        //         ...data,
        //         id: prevData?.id as any,
        //         sub_load_model: data.sub_load_model?.map((el: any) => ({ sub_load_name: el } as any)) || [],
        //         sub_load: data.sub_load_model?.length ? 1 : null,
        //     },
        //     () => {
        //         closeModal();
        //     }
        // );
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
                        <ControlledInputText control={control} labelCol={{ xs: 12 }} name="load_name" label="Nama Beban" placeholder="Nama Beban" />
                        <p className="mb-1">Sub Beban</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {detailMutation.data?.list_sub_load?.length !== 0 &&
                                detailMutation.data?.list_sub_load?.map((el, i) => (
                                    <input
                                        className="input_sub_load px-2 py-1 border-solid border border-gray-400 rounded-md"
                                        data-subid={el.sub_load_id}
                                        defaultValue={el.sub_load_name}
                                        key={el.sub_load_id}
                                    />
                                ))}
                        </div>

                        <Row justify="start">
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

export default EditLoadType;
