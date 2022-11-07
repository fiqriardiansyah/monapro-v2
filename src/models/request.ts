import { AxiosRequestConfig } from "axios";

export default {};

// BASE RESPONSE AND METHOD PARAMS
export interface BaseResponse<T = any> {
    data: T;
    status: number;
    message: string;
}

export interface GetMethodParams<T = any> {
    url: string;
    config?: AxiosRequestConfig<T>;
}

export interface PostMethodParams<T = any> {
    url: string;
    data?: any;
    config?: AxiosRequestConfig<T>;
}

export interface PutMethodParams<T = any> {
    url: string;
    data?: any;
    config?: AxiosRequestConfig<T>;
}

export interface DeleteMethodParams<T = any> {
    url: string;
    config?: AxiosRequestConfig<T>;
}

// AUTH
export interface SignInEmailData {
    email: string;
    password: string;
}
