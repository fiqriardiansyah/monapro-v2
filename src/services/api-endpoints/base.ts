import { AxiosResponse } from "axios";
import { BaseResponse } from "models";
import ApiMethod from "services/api-methods";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";

/* eslint-disable class-methods-use-this */
class BaseService {
    async ProxyRequest<T>(request: () => Promise<AxiosResponse<BaseResponse<T>, any>>): Promise<AxiosResponse<BaseResponse<T>, any>> {
        try {
            return request();
        } catch (error: any) {
            const message = error?.message || DEFAULT_ERROR_MESSAGE;
            throw new Error(message);
        }
    }
}

export default BaseService;
