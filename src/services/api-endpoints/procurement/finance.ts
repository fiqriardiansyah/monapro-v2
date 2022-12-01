/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { BasePaginationResponse, ContractSpNopes, Finance, Justification, Negotiation, News, PostMethodParams } from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class FinanceService extends BaseService {
    getAll = "/procurement/get-all-finance";

    detail = "/procurement/detail-finance";

    create = "/procurement/create-finance";

    edit = "/procurement/edit-finance";

    setPaid = "/procurement/set-paid";

    constructor() {
        super();
    }

    GetAll<T = any>(param: Models.FinanceGetAllParam) {
        return this.ProxyRequest<BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<BasePaginationResponse<T>>({
                url: this.getAll,
                config: {
                    params: {
                        ...param,
                    },
                },
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Create<T = any>(data: Models.FinanceCreateData, config?: PostMethodParams["config"]) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.post<T>({
                url: this.create,
                data,
                config,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Detail<T = Finance>({ id }: Models.FinanceDetailPath) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.get<T>({
                url: `${this.detail}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Edit<T = any>(data: Models.FinanceEditData, config?: PostMethodParams["config"]) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.put<T>({
                url: this.edit,
                data,
                config,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    SetPaid<T = any>(data: Models.IsPaid) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.post<T>({
                url: this.setPaid,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }
}

const financeService = new FinanceService();
export default financeService;
