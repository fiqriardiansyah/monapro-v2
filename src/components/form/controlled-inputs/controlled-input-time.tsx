import React from "react";
import { ColProps, TimePickerProps } from "antd";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import InputTime from "../inputs/input-time";

type ControlledInputTimeProps<T extends FieldValues> = TimePickerProps & {
    label: string;
    control: Control<T, any>;
    name: Path<T>;
    labelCol?: ColProps;
};

const ControlledInputText = <T extends FieldValues>({ label, control, name, labelCol, ...rest }: ControlledInputTimeProps<T>) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <InputTime
                    {...field}
                    {...rest}
                    label={label}
                    labelCol={labelCol}
                    value={(field.value as unknown as never) || rest.value}
                    error={error?.message}
                />
            )}
        />
    );
};

export default ControlledInputText;
