/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { AgendaDisposition, AgendaFinance, BasePaginationResponse } from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class AgendaFinanceService extends BaseService {
    getAll = "/agenda-finance/get-all";

    create = "/agenda-finance/create-agenda-finance";

    edit = "/agenda-finance/edit-agenda-finance";

    detail = "/agenda-finance/detail-agenda-finance";

    setPaid = "/agenda-finance/set-paid";

    search = "/agenda-finance/search-agenda-finance";

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

    Create<T = any>(data: Models.AgendaFinanceCreateData) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.post<T>({
                url: this.create,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Edit<T = any>(data: Models.AgendaFinanceEditData) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.put<T>({
                url: this.edit,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Detail<T extends AgendaFinance>({ id }: Models.AgendaFinanceDetailPath) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.get<T>({
                url: `${this.detail}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    SetPaid<T = any>(data: Models.IsPaid) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.post<T>({
                url: this.setPaid,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }
}

const agendaFinanceService = new AgendaFinanceService();
export default agendaFinanceService;
