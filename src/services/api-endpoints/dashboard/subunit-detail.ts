import { AxiosResponse } from "axios";
import * as Models from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class DashboardSubUnitService extends BaseService {
    getHeaderSubunit = "/dashboard/get-header-subunit";

    getChartSubunit = "/dashboard/get-chart-subunit";

    getRecapData = "/dashboard/get-recap-data";

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

    GetRecapData<T = Models.RecapData>({ subunitId, page }: Models.GetRecapDataPathParam) {
        return this.ProxyRequest<Models.BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<Models.BasePaginationResponse<T>>({
                url: `${this.getRecapData}/${subunitId}`,
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
