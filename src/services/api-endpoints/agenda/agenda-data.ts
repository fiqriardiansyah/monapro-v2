/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { BasePaginationResponse, PostMethodParams } from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

// [IMPORTANT] tipe data untuk agenda data dari BE blum tau

class AgendaDataService extends BaseService {
    getAll = "/agenda-data/get-all";

    create = "/agenda-data/create-agenda-data";

    edit = "/agenda-data/edit-agenda-data";

    detail = "/agenda-data/detail-agenda-data";

    lockBudget = "/agenda-data/set-lock-budget";

    search = "/agenda-data/search-agenda-data";

    templateDocx = "https://panggilin-user.s3.ap-southeast-1.amazonaws.com/resources/telco/Template+Agenda.docx";

    constructor() {
        super();
    }

    GetTemplateDocx<T = any>() {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: this.templateDocx,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
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

    GetAll<T = any>(param: Models.AgendaDataGetAllParam) {
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

    Create<T = any>(data: Models.AgendaDataCreateData, config?: PostMethodParams["config"]) {
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

    Edit<T = any>(data: Models.AgendaDataEditData, config?: PostMethodParams["config"]) {
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

    Detail<T = any>({ id }: Models.AgendaDataDetailPath) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.get<T>({
                url: `${this.detail}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    LockBudget<T = any>(data: Models.AgendaDataLockBudgetData) {
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

const agendaDataService = new AgendaDataService();
export default agendaDataService;
