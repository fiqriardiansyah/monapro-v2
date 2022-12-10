/* eslint-disable no-param-reassign */
import { Button, Card, Form, notification, Row, Space } from "antd";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import ControlledInputDate from "components/form/controlled-inputs/controlled-input-date";
import ControlledSelectInput from "components/form/controlled-inputs/controlled-input-select";
import React, { useEffect } from "react";
import { QUARTAL, QUARTAL_MONTH } from "utils/constant";
import { FiDownload } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import procurementService from "services/api-endpoints/procurement";
import { useQuery } from "react-query";
import { SelectOption } from "models";
import { FilterRecapData } from "./models";

const schema: yup.SchemaOf<Partial<FilterRecapData>> = yup.object().shape({
    subunit_id: yup.string(),
    load_type_id: yup.string(),
    quartal_id: yup.string(),
    month: yup.string().nullable(),
    year: yup.string(),
});

const Filter = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [form] = Form.useForm();
    const { handleSubmit, control, watch, setValue } = useForm<FilterRecapData>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

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
            const loadType = req.data.data?.map(
                (el) =>
                    ({
                        label: el.load_name,
                        value: el.load_type_id,
                    } as SelectOption)
            );
            return loadType;
        },
        {
            onError: (error: any) => {
                notification.error({ message: procurementService.getLoadType, description: error?.message });
            },
        }
    );

    const watchQuartal = watch("quartal_id");

    useEffect(() => {
        form.setFieldsValue({
            month: "",
        });
        setValue("month", "");
    }, [watchQuartal]);

    const onSubmitHandler = handleSubmit((data) => {
        Object.keys(data).forEach((k) => {
            const key = k as keyof FilterRecapData;
            if (key === "year" && data[key]) {
                data[key] = moment(data[key]).format("yyyy");
            }
            if (data[key] === undefined || data[key] === "") {
                delete data[key];
            }
        });

        setSearchParams({ ...data, page: 1 } as any);
    });

    const clearFilterHandler = () => {
        form.setFieldsValue({
            month: "",
            load_type_id: "",
            quartal_id: "",
            subunit_id: "",
            year: "",
        });
        setValue("month", "");
        setValue("load_type_id", "");
        setValue("quartal_id", "");
        setValue("subunit_id", "");
        setValue("year", "");
        setSearchParams({});
    };

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
                            name="load_type_id"
                            label=""
                            placeholder="Jenis Beban"
                            optionFilterProp="children"
                            control={control}
                            loading={loadTypeQuery.isLoading}
                            options={[{ label: "All", value: 0 }, ...(loadTypeQuery.data || [])]}
                        />
                        <ControlledSelectInput
                            allowClear
                            showSearch
                            name="subunit_id"
                            label=""
                            placeholder="Sub Unit"
                            optionFilterProp="children"
                            control={control}
                            loading={subUnitQuery.isLoading}
                            options={[{ label: "All", value: 0 }, ...(subUnitQuery.data || [])]}
                        />
                    </div>
                    <div className="">
                        <ControlledInputDate control={control} labelCol={{ xs: 12 }} name="year" picker="year" label="" />
                        <div className="flex gap-4">
                            <ControlledSelectInput
                                allowClear
                                showSearch
                                name="quartal_id"
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
                        <Button onClick={clearFilterHandler} type="text" htmlType="button">
                            Clear Filter
                        </Button>
                    </Space>
                </div>
            </Form>
        </div>
    );
};

export default Filter;
