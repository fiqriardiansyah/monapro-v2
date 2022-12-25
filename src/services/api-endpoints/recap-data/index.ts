/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

export interface SearchParam {
    query: string;
    page: any;
}
class RecapDataService extends BaseService {
    getAll = "/data-recap/get-all";

    setLockBudget = "/data-recap/set-lock-budget";

    setIsPaid = "/data-recap/set-is-paid";

    filter = "data-recap/filter";

    search = "/data-recap/search";

    filterAll = "/data-recap/filter-all";

    constructor() {
        super();
    }

    FilterAll<T = Models.RecapData>(param: Models.RecapFilterAllParam) {
        return this.ProxyRequest<Models.BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<Models.BasePaginationResponse<T>>({
                url: this.filterAll,
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

    Search<T = Models.RecapData>(param: SearchParam) {
        return this.ProxyRequest<Models.BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<Models.BasePaginationResponse<T>>({
                url: this.search,
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

    GetAll<T = Models.RecapData>(param: Models.ContractGetAllParam) {
        return this.ProxyRequest<Models.BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<Models.BasePaginationResponse<T>>({
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

    SetLockBudget<T = any>(data: Models.RecapLockBudgetData) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.post<T>({
                url: this.setLockBudget,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    SetIsPaid<T = any>(data: Models.RecapIsPaidData) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.post<T>({
                url: this.setIsPaid,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Filter<T = Models.RecapData>(param: Models.RecapFilterParam) {
        return this.ProxyRequest<Models.BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<Models.BasePaginationResponse<T>>({
                url: this.filter,
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
}

const recapDataService = new RecapDataService();
export default recapDataService;
