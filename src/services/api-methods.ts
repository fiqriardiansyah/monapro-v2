import { AxiosResponse } from "axios";
import client from "config/axios";
import { BaseResponse, DeleteMethodParams, GetMethodParams, PostMethodParams, PutMethodParams } from "models";

export default class ApiMethod {
    static get<T>(data: GetMethodParams): Promise<AxiosResponse<BaseResponse<T>, any>> {
        return client.get(data.url, data?.config);
    }

    static post<T>(data: PostMethodParams): Promise<AxiosResponse<BaseResponse<T>, any>> {
        return client.post(data.url, data?.data, data?.config);
    }

    static put<T>(data: PutMethodParams): Promise<AxiosResponse<BaseResponse<T>, any>> {
        return client.put(data.url, data?.data, data?.config);
    }

    static delete<T>(data: DeleteMethodParams): Promise<AxiosResponse<BaseResponse<T>, any>> {
        return client.delete(data.url, data?.config);
    }
}
