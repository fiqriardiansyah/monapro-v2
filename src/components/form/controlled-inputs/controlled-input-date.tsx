import React from "react";
import { ColProps, DatePickerProps } from "antd";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import InputDate from "../inputs/input-date";

type Props<T extends FieldValues> = DatePickerProps & {
    label: string;
    control: Control<T, any>;
    name: Path<T>;
    labelCol?: ColProps;
};

const ControlledInputDate = <T extends FieldValues>({ label, control, name, labelCol, ...rest }: Props<T>) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <InputDate
                    {...field}
                    {...rest}
                    label={label}
                    labelCol={labelCol}
                    value={(field.value as unknown as never) || rest.value || ""}
                    error={error?.message}
                />
            )}
        />
    );
};

export default ControlledInputDate;
