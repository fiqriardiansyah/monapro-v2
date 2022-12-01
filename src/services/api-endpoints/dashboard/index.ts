import { AxiosResponse } from "axios";
import * as Models from "models";
import { AnalyticSubUnit, AuthData, GetHeaderDashboard, RemainingBudget } from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class DashboardService extends BaseService {
    getAllHeader = "/dashboard/get-header-dashboard";

    getRemainingBudget = "/dashboard/get-remaining-budget";

    getAnalyticSubUnit = "/dashboard/get-analytic-subunit";

    GetAllHeader<T = GetHeaderDashboard>() {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: this.getAllHeader,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetRemainingBudget<T = RemainingBudget[]>(): Promise<AxiosResponse<Models.BaseResponse<T>, any>> {
        return ApiMethod.get<T>({
            url: this.getRemainingBudget,
        });
    }

    GetAnalyticSubUnit<T = AnalyticSubUnit[]>(): Promise<AxiosResponse<Models.BaseResponse<T>, any>> {
        return ApiMethod.get<T>({
            url: this.getAnalyticSubUnit,
        });
    }
}

const dashboardService = new DashboardService();
export default dashboardService;
