/* eslint-disable no-useless-constructor */
import {
    ApprovalPositionProcurement,
    GetSubLoadParam,
    JustificationProcurement,
    LoadTypeProcurement,
    NoAgendaProcurement,
    SubLoadProcurement,
    SubUnitProcurement,
} from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class ProcurementService extends BaseService {
    getSubUnit = "/procurement/get-subunit";

    getLoadType = "/procurement/get-load-type";

    getApprovalPosition = "/procurement/get-approval-position";

    getJustification = "/procurement/list-justification";

    getNoAgenda = "/procurement/get-no-agenda";

    getSubLoad = "/procurement/get-sub-load";

    constructor() {
        super();
    }

    GetSubUnit<T extends SubUnitProcurement[]>() {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: this.getSubUnit,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetLoadType<T extends LoadTypeProcurement[]>() {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: this.getLoadType,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetApprovalPosition<T extends ApprovalPositionProcurement[]>() {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: this.getApprovalPosition,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetJustification<T extends JustificationProcurement[]>() {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: this.getJustification,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetNoAgenda<T extends NoAgendaProcurement[]>() {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: this.getNoAgenda,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetSubLoad<T extends SubLoadProcurement[]>(param: GetSubLoadParam) {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: this.getNoAgenda,
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

const procurementService = new ProcurementService();
export default procurementService;
