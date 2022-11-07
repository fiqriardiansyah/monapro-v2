import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, Form, Row, Space } from "antd";
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { SignInEmailData } from "models";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import AuthEndPoints from "services/api-endpoints/auth";
import { DEFAULT_ERROR_MESSAGE, TOKEN_USER } from "utils/constant";
import * as yup from "yup";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const schema: yup.SchemaOf<SignInEmailData> = yup.object().shape({
    email: yup.string().required("Email wajib diisi"),
    password: yup.string().required("Password wajib diisi"),
});

const SignInPage = () => {
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const { handleSubmit, control } = useForm<SignInEmailData>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const signInMutation = useMutation(async (data: SignInEmailData) => {}, {
        onSuccess: (data) => {},
    });

    const onSubmitHandler = handleSubmit((data) => {
        // signInMutation.mutate(data);

        Cookies.set(TOKEN_USER, "blbalbalbalbalbal");
        navigate("/");
    });

    return (
        <div className=" w-full !h-screen overflow-y-hidden flex items-center justify-center flex-col">
            <div className="flex flex-col items-center z-10">
                <div className="bg-white rounded-2xl w-40vw 2xl:w-[500px] p-10 shadow-xl z-10">
                    <Form
                        form={form}
                        labelCol={{ span: 3 }}
                        labelAlign="left"
                        disabled={signInMutation.isLoading}
                        colon={false}
                        style={{ width: "100%" }}
                        onFinish={onSubmitHandler}
                        layout="vertical"
                    >
                        <Space direction="vertical" className="w-full">
                            <ControlledInputText control={control} labelCol={{ xs: 12 }} name="email" label="Email" placeholder="Email" />
                            <ControlledInputText
                                control={control}
                                labelCol={{ xs: 12 }}
                                name="password"
                                label="Password"
                                placeholder="Password"
                                type="password"
                            />

                            <Row justify="start">
                                <Space>
                                    <Button type="primary" htmlType="submit" loading={signInMutation.isLoading} disabled={signInMutation.isLoading}>
                                        Masuk
                                    </Button>
                                </Space>
                            </Row>
                        </Space>
                    </Form>

                    {signInMutation.isError && (
                        <>
                            <div className="h-5" />
                            <Alert message={(signInMutation.error as any)?.message || signInMutation.error} type="error" />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
