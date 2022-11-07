import { ColProps, Form, TimePicker, TimePickerProps } from "antd";
import moment from "moment";
import React, { forwardRef } from "react";

type InputTimeProps = TimePickerProps & {
    error: string | undefined;
    label: string;
    labelCol?: ColProps;
};

const InputTime: React.FC<InputTimeProps> = forwardRef(({ error, label, name, value, labelCol, onChange, onBlur, ...rest }: InputTimeProps) => {
    return (
        <Form.Item label={label} name={name} labelCol={labelCol} validateStatus={error ? "error" : ""} help={error && error} initialValue={undefined}>
            <TimePicker
                {...rest}
                style={{ width: "100%" }}
                value={moment(value, "HH:mm")}
                defaultValue={undefined}
                format="HH:mm"
                onChange={onChange}
                onBlur={onBlur}
            />
        </Form.Item>
    );
});

InputTime.displayName = "InputTime";

export default InputTime;
