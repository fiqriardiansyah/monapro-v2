import { AxiosResponse } from "axios";
import * as Models from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

export interface SaveNote {
    subunit_id: any;
    note: string;
}
class DashboardSubUnitService extends BaseService {
    getHeaderSubunit = "/dashboard/get-header-subunit";

    getChartSubunit = "/dashboard/get-chart-subunit";

    getRecapData = "/dashboard/get-recap-data";

    saveNote = "/dashboard/save-note";

    SaveNote<T = any>(data: SaveNote) {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.post<T>({
                url: this.saveNote,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetHeaderSubunit<T = Models.GetHeaderSubUnitDashboard>({ id, ...param }: Models.GetHeaderSubUnitPath & Models.QuartalParam) {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: `${this.getHeaderSubunit}/${id}`,
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

    GetChartSubunit<T = Models.GetChartSubUnitDashboard>({ id, ...param }: Models.GetChartSubUnitPath & Models.QuartalParam) {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: `${this.getChartSubunit}/${id}`,
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

    GetRecapData<T = Models.RecapData>({ subunitId, page, ...param }: Models.GetRecapDataPathParam & Models.QuartalParam) {
        return this.ProxyRequest<Models.BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<Models.BasePaginationResponse<T>>({
                url: `${this.getRecapData}/${subunitId}`,
                config: {
                    params: {
                        ...param,
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
