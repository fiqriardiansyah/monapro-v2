/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { BasePaginationResponse, Justification, PostMethodParams } from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class JustificationService extends BaseService {
    getAll = "/procurement/get-all-justification";

    getAllNon = "/procurement/get-non-justification";

    create = "/procurement/create-justification";

    edit = "/procurement/edit-justification";

    delete = "/approval/delete-approval";

    detail = "/procurement/detail-justification";

    lockBudget = "/procurement/set-lock-budget";

    search = "/procurement/search-justification";

    searchNon = "/procurement/search-non-justification";

    createNon = "/procurement/create-non-justification";

    editNon = "/procurement/edit-non-justification";

    constructor() {
        super();
    }

    EditNon<T = any>(data: Models.JustificationEditData, config?: PostMethodParams["config"]) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.put<T>({
                url: this.editNon,
                data,
                config,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    CreateNon<T = any>(data: Models.JustificationCreateData, config?: PostMethodParams["config"]) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.post<T>({
                url: this.createNon,
                data,
                config,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    SearchNon<T = any>(param: { query: any; page: any }) {
        return this.ProxyRequest<BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<BasePaginationResponse<T>>({
                url: this.searchNon,
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

    GetAllNon<T = any>(param: { page: any }) {
        return this.ProxyRequest<BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<BasePaginationResponse<T>>({
                url: this.getAllNon,
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

    Search<T = any>(param: Models.DefaultSearchTypeParam) {
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

    GetAll<T = any>(param: Models.DefaultTypeParam) {
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

    Create<T = any>(data: Models.JustificationCreateData, config?: PostMethodParams["config"]) {
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

    Edit<T = any>(data: Models.JustificationEditData, config?: PostMethodParams["config"]) {
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

    Detail<T = Justification>({ id }: Models.JustificationDetailPath) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.get<T>({
                url: `${this.detail}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    LockBudget<T = any>(data: Models.JustificationLockBudgetData) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.post<T>({
                url: this.lockBudget,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }
}

const justificationService = new JustificationService();
export default justificationService;
