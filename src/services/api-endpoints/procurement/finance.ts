/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { BasePaginationResponse, ContractSpNopes, Finance, Justification, Negotiation, News } from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class FinanceService extends BaseService {
    getAll = "/procurement/get-all-finance";

    detail = "/procurement/detail-finance";

    create = "/procurement/create-finance";

    edit = "/procurement/edit-finance";

    isPaid = "/procurement/set-paid";

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

    Create<T = any>(data: Models.FinanceCreateData) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.post<T>({
                url: this.create,
                data,
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

    Edit<T = any>(data: Models.FinanceEditData) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.put<T>({
                url: this.edit,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    SetPaid<T = any>(data: Models.FinanceIsPaid) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.post<T>({
                url: this.isPaid,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }
}

const financeService = new FinanceService();
export default financeService;