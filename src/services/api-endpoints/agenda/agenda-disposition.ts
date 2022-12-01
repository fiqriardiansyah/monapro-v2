/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { AgendaDisposition, BasePaginationResponse, PostMethodParams } from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

// [IMPORTANT] tipe data untuk agenda data dari BE blum tau

class AgendaDispositionService extends BaseService {
    getAll = "/agenda-dispo/get-all";

    create = "/agenda-dispo/create-agenda-disposition";

    edit = "/agenda-dispo/edit-agenda-disposition";

    detail = "/agenda-dispo/detail-agenda-disposition";

    getAgendaData = "/agenda-dispo/get-agenda-data";

    search = "/agenda-dispo/search-agenda-disposition";

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

    GetAll<T = any>(param: Models.AgendaDispositionGetAllParam) {
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

    Create<T = any>(data: Models.AgendaDispositionCreateData, config?: PostMethodParams["config"]) {
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

    Edit<T = any>(data: Models.AgendaDispositionEditData, config?: PostMethodParams["config"]) {
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

    Detail<T extends AgendaDisposition>({ id }: Models.AgendaDispositionDetailPath) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.get<T>({
                url: `${this.detail}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetAgendaData<T = any>() {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: this.getAgendaData,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }
}

const agendaDispositionService = new AgendaDispositionService();
export default agendaDispositionService;
