/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { BasePaginationResponse } from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

// [IMPORTANT] tipe data untuk agenda data dari BE blum tau

class AgendaService extends BaseService {
    getSubUnit = "/agenda-data/get-subunit";

    constructor() {
        super();
    }

    GetSubUnit<T = any>() {
        return this.ProxyRequest<BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<BasePaginationResponse<T>>({
                url: this.getSubUnit,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }
}

const agendaService = new AgendaService();
export default agendaService;
