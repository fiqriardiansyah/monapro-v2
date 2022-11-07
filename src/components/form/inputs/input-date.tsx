import { ColProps, DatePicker, DatePickerProps, Form } from "antd";
import React, { forwardRef } from "react";

type Props = DatePickerProps & {
    error: string | undefined;
    label: string;
    labelCol?: ColProps;
};

const InputDate: React.FC<Props> = forwardRef(({ error, label, name, value, labelCol, onChange, onBlur, ...rest }: Props) => {
    return (
        <Form.Item
            label={label}
            name={name}
            labelCol={labelCol}
            validateStatus={error ? "error" : ""}
            help={error && error}
            initialValue={undefined}
            className="!w-full"
        >
            <DatePicker {...rest} style={{ width: "100%" }} value={value} defaultValue={undefined} onChange={onChange} onBlur={onBlur} />
        </Form.Item>
    );
});

InputDate.displayName = "InputDate";

export default InputDate;
