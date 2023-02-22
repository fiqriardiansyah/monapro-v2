/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { AgendaData, CashCarry, ContractSpNopes, News } from "models";
import { TDataJustification } from "modules/procurement/justification/models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class MyActivityService extends BaseService {
    getMyJustification = "/activity/get-my-justification";

    getMyCashCarry = "/activity/get-my-cash-carry";

    getMyAgenda = "/activity/get-my-agenda";

    getMyContract = "/activity/get-my-contract";

    getMyNews = "/activity/get-my-news";

    constructor() {
        super();
    }

    GetMyNews<T = News>(params: { page: any }) {
        return this.ProxyRequest<Models.BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<Models.BasePaginationResponse<T>>({
                url: this.getMyNews,
                config: {
                    params,
                },
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetMyContract<T = ContractSpNopes>(params: { page: any }) {
        return this.ProxyRequest<Models.BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<Models.BasePaginationResponse<T>>({
                url: this.getMyContract,
                config: {
                    params,
                },
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetMyAgenda<T = AgendaData>(params: { page: any }) {
        return this.ProxyRequest<Models.BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<Models.BasePaginationResponse<T>>({
                url: this.getMyAgenda,
                config: {
                    params,
                },
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetMyJustification<T = TDataJustification>(params: { page: any; type: 1 | 2 | 3 }) {
        return this.ProxyRequest<Models.BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<Models.BasePaginationResponse<T>>({
                url: this.getMyJustification,
                config: {
                    params,
                },
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetMyCashCarry<T = CashCarry>(params: { page: any }) {
        return this.ProxyRequest<Models.BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<Models.BasePaginationResponse<T>>({
                url: this.getMyCashCarry,
                config: {
                    params,
                },
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }
}

const myActivityService = new MyActivityService();
export default myActivityService;
