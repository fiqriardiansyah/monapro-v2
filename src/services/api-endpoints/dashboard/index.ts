import { AxiosResponse } from "axios";
import * as Models from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class DashboardService extends BaseService {
    getAllHeader = "/dashboard/get-header-dashboard";

    getSubHeader = "/dashboard/get-sub-header";

    getAnalyticSubUnit = "/dashboard/get-analytic-subunit";

    getLineChart = "/dashboard/get-line-chart";

    GetAllHeader<T = Models.GetHeaderDashboard>(params: Models.QuartalParam) {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: this.getAllHeader,
                config: {
                    params: {
                        ...params,
                    },
                },
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetSubHeader<T = Models.GetSubHeaderDashboard>(params: Models.QuartalParam) {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: this.getSubHeader,
                config: {
                    params: {
                        ...params,
                    },
                },
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetAnalyticSubUnit<T = Models.AnalyticSubUnit[]>(params: Models.QuartalParam): Promise<AxiosResponse<Models.BaseResponse<T>, any>> {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: this.getAnalyticSubUnit,
                config: {
                    params: {
                        ...params,
                    },
                },
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetLineChart<T = Models.LineChart[]>(params: Models.QuartalParam): Promise<AxiosResponse<Models.BaseResponse<T>, any>> {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: this.getLineChart,
                config: {
                    params: {
                        ...params,
                    },
                },
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }
}

const dashboardService = new DashboardService();
export default dashboardService;
