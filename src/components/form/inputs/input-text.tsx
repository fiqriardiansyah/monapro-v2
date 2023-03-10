import { ColProps, Form, Input, InputProps, InputRef } from "antd";
import { FiEye, FiEyeOff } from "react-icons/fi";

import React, { forwardRef, Ref } from "react";
import Utils from "utils";

type TextInputProps = InputProps & {
    error: string | undefined;
    label: string;
    labelCol?: ColProps;
    initialValue?: string;
};

const InputText: React.FC<TextInputProps> = forwardRef(
    (
        { type = "text", placeholder, error, label, name, value, labelCol, initialValue, onChange, onBlur, className, ...rest }: TextInputProps,
        ref: Ref<InputRef>
    ) => {
        const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            const num = Math.abs(Utils.convertToIntFormat(e.target.value as unknown as string));
            e.target.value = Utils.convertToStringFormat((Number.isNaN(num) ? "" : num) as number);
        };

        return (
            <Form.Item
                label={label}
                name={name}
                labelCol={labelCol}
                validateStatus={error ? "error" : ""}
                help={error && error}
                initialValue={initialValue}
                className="!w-full"
            >
                {type === "password" && (
                    <Input.Password
                        {...rest}
                        iconRender={(visible) => (visible ? <FiEyeOff /> : <FiEye />)}
                        type="password"
                        placeholder={placeholder}
                        value={value || ""}
                        onChange={onChange}
                        name={name}
                        onBlur={onBlur}
                        ref={ref}
                        className={`!w-full ${className}`}
                    />
                )}

                {type === "text" && (
                    <Input
                        {...rest}
                        type="text"
                        placeholder={placeholder}
                        value={value || ""}
                        onChange={onChange}
                        name={name}
                        onBlur={onBlur}
                        ref={ref}
                        className={`!w-full ${className}`}
                    />
                )}

                {type === "number" && (
                    <Input
                        {...rest}
                        type="text"
                        placeholder={placeholder}
                        value={value ? Utils.convertToStringFormat(value as number) : ""}
                        onChange={onChange}
                        name={name}
                        onBlur={onBlur}
                        ref={ref}
                        onInput={onInput}
                        className={`!w-full ${className}`}
                    />
                )}
            </Form.Item>
        );
    }
);

InputText.displayName = "InputText";

export default InputText;
