/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { BasePaginationResponse, PostMethodParams } from "models";
import { FDataRegulation, TDataRegulation } from "modules/masterdata/regulation/models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class RegulationService extends BaseService {
    getAll = "/regulation/get-all";

    create = "/regulation/create-regulation";

    edit = "/regulation/edit-regulation";

    delete = "/regulation/delete-regulation";

    detail = "/regulation/detail-regulation";

    search = "/regulation/search-regulation";

    constructor() {
        super();
    }

    Search<T = Models.Regulation>(param: { query: string; page: any }) {
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

    GetAll<T = Models.Regulation>(param: { page: any }) {
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

    Create<T = any>(data: FDataRegulation, config?: PostMethodParams["config"]) {
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

    Edit<T = any>(data: TDataRegulation, config?: PostMethodParams["config"]) {
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

    Delete<T = any>({ id }: { id: any }) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.delete<T>({
                url: `${this.delete}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Detail<T = Models.Regulation>({ id }: { id: any }) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.get<T>({
                url: `${this.detail}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }
}

const regulationService = new RegulationService();
export default regulationService;
