/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { BasePaginationResponse } from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class LoadTypeService extends BaseService {
    getAll = "/load-type/get-all";

    create = "/load-type/create-load-type";

    edit = "/load-type/edit-load-type";

    delete = "/load-type/delete-load-type";

    detail = "/load-type/detail-load-type";

    constructor() {
        super();
    }

    GetAll<T = any>(param: Models.LoadTypeGetAllParam) {
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

    Create<T = any>(data: Models.LoadTypeCreateData) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.post<T>({
                url: this.create,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Edit<T = any>(data: Models.LoadTypeEditData) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.put<T>({
                url: this.edit,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Delete<T = any>({ id }: Models.LoadTypeDeletePath) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.delete<T>({
                url: `${this.delete}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Detail<T = any>({ id }: Models.LoadTypeDetailPath) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.get<T>({
                url: `${this.detail}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }
}

const loadTypeService = new LoadTypeService();
export default loadTypeService;
