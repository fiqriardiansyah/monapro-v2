/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { BasePaginationResponse, ContractSpNopes, Justification, Negotiation, PostMethodParams } from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class ContractService extends BaseService {
    getAll = "/procurement/get-all-contract";

    detail = "/procurement/detail-contract";

    create = "/procurement/create-contract";

    edit = "/procurement/edit-contract";

    search = "/procurement/search-contract";

    constructor() {
        super();
    }

    Search<T = any>(param: Models.SearchParam) {
        return this.ProxyRequest<BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<BasePaginationResponse<T>>({
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

    GetAll<T = any>(param: Models.ContractGetAllParam) {
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

    Create<T = any>(data: Models.ContractCreateData, config?: PostMethodParams["config"]) {
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

    Detail<T = ContractSpNopes>({ id }: Models.ContractDetailPath) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.get<T>({
                url: `${this.detail}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Edit<T = any>(data: Models.ContractEditData, config?: PostMethodParams["config"]) {
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

const contractService = new ContractService();
export default contractService;
