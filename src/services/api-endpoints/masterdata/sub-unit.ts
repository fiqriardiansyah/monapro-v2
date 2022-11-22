/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { BasePaginationResponse } from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class SubUnitService extends BaseService {
    getAll = "/sub-unit/get-all";

    create = "/sub-unit/create-subunit";

    edit = "/sub-unit/edit-subunit";

    delete = "/sub-unit/delete-subunit";

    detail = "/sub-unit/detail-subunit";

    constructor() {
        super();
    }

    GetAll<T = any>(param: Models.SubUnitGetAllParam) {
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

    Create<T = any>(data: Models.SubUnitCreateData) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.post<T>({
                url: this.create,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Edit<T = any>(data: Models.SubUnitEditData) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.put<T>({
                url: this.edit,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Delete<T = any>({ id }: Models.SubUnitDeletePath) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.delete<T>({
                url: `${this.delete}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Detail<T = any>({ id }: Models.SubUnitDetailPath) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.get<T>({
                url: `${this.detail}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }
}

const subUnitService = new SubUnitService();
export default subUnitService;
