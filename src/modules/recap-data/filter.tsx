import { Button, Card, Form, Row, Space } from "antd";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import React from "react";
import { QUARTAL, QUARTAL_MONTH } from "utils/constant";
import { FiDownload } from "react-icons/fi";
import { FilterRecapData } from "./models";

const schema: yup.SchemaOf<Partial<FilterRecapData>> = yup.object().shape({
    sub_unit: yup.string(),
    quartal: yup.string(),
    load_type: yup.string(),
    date: yup.string(),
    year: yup.string(),
    month: yup.string(),
});

const Filter = () => {
    const [form] = Form.useForm();
    const { handleSubmit, control, watch } = useForm<FilterRecapData>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const watchQuartal = watch("quartal");

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
                <div className="grid grid-cols-2 gap-4">
                    <div className="">
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
                    </div>
                    <div className="">
                        <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="year" picker="year" label="" />
                        <div className="flex gap-4">
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
                            <ControlledSelectInput
                                disabled={!watchQuartal || watchQuartal === "0"}
                                allowClear
                                showSearch
                                name="month"
                                label=""
                                placeholder="Bulan"
                                optionFilterProp="children"
                                control={control}
                                options={
                                    QUARTAL_MONTH.find((el) => el.quartal === Number(watchQuartal || ""))?.month.map((m, i) => ({
                                        label: m,
                                        value: (i + 1) * Number(watchQuartal),
                                    })) || []
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <Button className="!flex !items-center" icon={<FiDownload className="mr-2" />}>
                        Download
                    </Button>
                    <Space>
                        <Button type="primary" className="BTN-DELETE" htmlType="submit">
                            Cari
                        </Button>
                        <Button type="text" htmlType="button">
                            Clear Filter
                        </Button>
                    </Space>
                </div>
            </Form>
        </div>
    );
};

export default Filter;
