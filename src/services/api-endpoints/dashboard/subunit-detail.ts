import { AxiosResponse } from "axios";
import * as Models from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class DashboardSubUnitService extends BaseService {
    getHeaderSubunit = "/dashboard/get-header-subunit";

    getChartSubunit = "/dashboard/get-chart-subunit";

    getAgendaSubunit = "/dashboard/get-agenda-subunit";

    getJustificationSubunit = "/dashboard/get-justification-subunit";

    GetHeaderSubunit<T = Models.GetHeaderSubUnitDashboard>({ id }: Models.GetHeaderSubUnitPath) {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: `${this.getHeaderSubunit}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetChartSubunit<T = Models.GetChartSubUnitDashboard>({ id }: Models.GetChartSubUnitPath) {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: `${this.getChartSubunit}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetAgendaSubUnit<T = Models.AgendaData>({ id, page }: Models.GetAgendaSubUnitPathParam) {
        return this.ProxyRequest<Models.BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<Models.BasePaginationResponse<T>>({
                url: `${this.getAgendaSubunit}/${id}`,
                config: {
                    params: {
                        page,
                    },
                },
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetJustificationSubunit<T = Models.Justification>({ id, page }: Models.GetJustificationSubUnitPathParam) {
        return this.ProxyRequest<Models.BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<Models.BasePaginationResponse<T>>({
                url: `${this.getJustificationSubunit}/${id}`,
                config: {
                    params: {
                        page,
                    },
                },
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }
}

const dashboardSubUnitService = new DashboardSubUnitService();
export default dashboardSubUnitService;
