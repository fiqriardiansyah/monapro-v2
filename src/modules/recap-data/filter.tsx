import { Button, Card, Form, Row, Space } from "antd";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import React from "react";
import { QUARTAL } from "utils/constant";
import { FilterRecapData } from "./models";

const schema: yup.SchemaOf<Partial<FilterRecapData>> = yup.object().shape({
    sub_unit: yup.string(),
    quartal: yup.string(),
    load_type: yup.string(),
    date: yup.string(),
});

const Filter = () => {
    const [form] = Form.useForm();
    const { handleSubmit, control } = useForm<FilterRecapData>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const onSubmitHandler = handleSubmit((data) => {
        console.log(data);
    });

    return (
        <div className="w-full">
            <Form
                form={form}
                labelCol={{ span: 3 }}
                labelAlign="left"
                colon={false}
                style={{ width: "100%" }}
                onFinish={onSubmitHandler}
                layout="horizontal"
            >
                <Space direction="vertical" className="w-full">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="">
                            <ControlledSelectInput
                                allowClear
                                showSearch
                                name="sub_unit"
                                label=""
                                placeholder="Sub Unit"
                                optionFilterProp="children"
                                control={control}
                                options={[{ label: "All", value: 0 }]}
                            />
                            <ControlledSelectInput
                                allowClear
                                showSearch
                                name="quartal"
                                label=""
                                placeholder="Quartal"
                                optionFilterProp="children"
                                control={control}
                                options={[{ label: "All", value: 0 }, ...QUARTAL]}
                            />
                            <ControlledInputDate allowClear control={control} name="date" label="" />
                            <ControlledSelectInput
                                showSearch
                                allowClear
                                name="load_type"
                                label=""
                                placeholder="Jenis Beban"
                                optionFilterProp="children"
                                control={control}
                                options={[{ label: "All", value: 0 }]}
                            />
                        </div>
                        <div className="">
                            <Card>
                                <div className="w-full flex items-center justify-between">
                                    <p className="text-gray-400 font-semibold">total budget plan</p>
                                    <p className="text-gray-600 font-semibold">Rp.100.000.000</p>
                                </div>
                                <div className="w-full flex items-center justify-between mt-4">
                                    <p className="text-gray-400 font-semibold">total pemakaian</p>
                                    <p className="text-gray-600 font-semibold">Rp.10.000.000</p>
                                </div>
                            </Card>
                            <div className="flex items-center justify-center mt-4">
                                <Space>
                                    <Button type="primary" className="BTN-DELETE" htmlType="submit">
                                        Cari
                                    </Button>
                                    <Button type="text" htmlType="button">
                                        Clear Filter
                                    </Button>
                                </Space>
                            </div>
                        </div>
                    </div>
                </Space>
            </Form>
        </div>
    );
};

export default Filter;
