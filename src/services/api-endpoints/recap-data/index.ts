/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class RecapDataService extends BaseService {
    getAll = "/data-recap/get-all";

    setLockBudget = "/data-recap/set-lock-budget";

    setIsPaid = "/data-recap/set-is-paid";

    constructor() {
        super();
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
}

const recapDataService = new RecapDataService();
export default recapDataService;
