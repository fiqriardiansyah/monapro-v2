import React, { useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, Form, message, Row, Space } from "antd";
import ControlledInputText from "components/form/controlled-inputs/controlled-input-text";
import { SignInEmailData } from "models";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { EMAIL_USER, NAME_USER, ROLE_ACCESS, TOKEN_USER } from "utils/constant";
import * as yup from "yup";
import Cookies from "js-cookie";
import { UserContext } from "context/user";
import authService from "services/api-endpoints/auth";

import MonaproImage from "assets/monapro-white.png";
import Background from "assets/background.jpg";

// [FINISH]

const schema: yup.SchemaOf<SignInEmailData> = yup.object().shape({
    email: yup.string().required("Email wajib diisi"),
    password: yup.string().required("Password wajib diisi"),
});

const SignInPage = () => {
    const { setState } = useContext(UserContext);

    const [form] = Form.useForm();
    const { handleSubmit, control } = useForm<SignInEmailData>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const signInMutation = useMutation(
        async (data: SignInEmailData) => {
            const req = await authService.SignInEmail(data);
            return req.data.data;
            // return {
            //     token: "$2a$10$gbVjlLpqVgBxqAxwuPrgQ.XvXR8qSBauRu1djwApYzlBY7qn",
            //     fullname: "Dev Corcomm",
            //     email: "dev.corcomm@gmail.com",
            // };
        },
        {
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const onSubmitHandler = handleSubmit(async (data) => {
        const user = await signInMutation.mutateAsync(data);
        Cookies.set(TOKEN_USER, user.token);
        Cookies.set(NAME_USER, user.fullname);
        Cookies.set(EMAIL_USER, user.email);
        localStorage.setItem(ROLE_ACCESS, JSON.stringify(user.role_access));
        if (setState) {
            setState((prev) => ({
                ...prev,
                user,
            }));
        }
    });

    return (
        <div className=" w-full !h-screen overflow-y-hidden flex items-center justify-center flex-col">
            <img src={Background} alt="" className="absolute w-full h-full object-cover" />
            <div className="flex flex-col items-center z-10">
                <img src={MonaproImage} alt="monapro" className="h-[100px]" />
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
