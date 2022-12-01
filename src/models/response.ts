import { RemainingUsage, TotalActivity, TotalUsage } from "./data";

export default {};

export interface BasePaginationResponse<T = any> {
    list: T[];
    total_data: number;
    total_page: number;
    current_page: number;
}

export interface GetHeaderDashboard {
    total_usage: TotalUsage[];
    remaining_usage: RemainingUsage[];
    total_activity: TotalActivity[];
}

export interface GetHeaderSubUnitDashboard {
    total_usage: number;
    total_paid: number;
    not_paid: number;
    remaining_usage: number;
    subunit_name: string;
    list_activity: {
        sponsorship: number;
        procurement: number;
    }[];
}

export interface GetChartSubUnitDashboard {
    _?: any;
}
