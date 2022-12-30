/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { BasePaginationResponse, CashCarry, ContractSpNopes, PostMethodParams } from "models";
import { TDataCreateCashCarry, TDataEditCashCarry } from "modules/procurement/cash-carry/models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class CashCarryService extends BaseService {
    getAll = "/cash-carry/get-all";

    detail = "/cash-carry/detail-cash-carry";

    create = "/cash-carry/create";

    edit = "/cash-carry/edit";

    // search = "/procurement/search-contract";

    constructor() {
        super();
    }

    // Search<T = any>(param: Models.SearchParam) {
    //     return this.ProxyRequest<BasePaginationResponse<T>>(async () => {
    //         const req = await ApiMethod.get<BasePaginationResponse<T>>({
    //             url: this.search,
    //             config: {
    //                 params: {
    //                     ...param,
    //                 },
    //             },
    //         });
    //         if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
    //         return req;
    //     });
    // }

    GetAll<T extends CashCarry>(param: { page: any }) {
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

    Create<T = any>(data: TDataCreateCashCarry, config?: PostMethodParams["config"]) {
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

    Detail<T = CashCarry>({ id }: { id: any }) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.get<T>({
                url: `${this.detail}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Edit<T = any>(data: TDataEditCashCarry, config?: PostMethodParams["config"]) {
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
}

const cashCarryService = new CashCarryService();
export default cashCarryService;
