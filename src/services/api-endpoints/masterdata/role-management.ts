/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { BasePaginationResponse } from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class RoleManagementService extends BaseService {
    getAll = "/role-management/get-all";

    constructor() {
        super();
    }

    GetAll<T = any>(param: Models.RoleManagementGetAllParam) {
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
}

const roleManagementService = new RoleManagementService();
export default roleManagementService;
