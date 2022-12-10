export default {};

export interface BasePaginationResponse<T = any> {
    list: T[];
    total_data: number;
    total_page: number;
    current_page: number;
}

export interface GetHeaderDashboard {
    plan_budget: {
        plan_budget: number;
        percentage_plan: number;
    }[];
    total_usage: {
        total_usage: number;
        percentage_usage: number;
    }[];
    not_paid: {
        not_paid: number;
        percentage_notpaid: number;
    }[];
    remaining_budget: {
        remaining_budget: number;
        percentage_remaining: number;
    }[];
}

export interface GetSubHeaderDashboard {
    list_activity: {
        load_name: string;
        load_usage: number;
    }[];
}

export interface GetHeaderSubUnitDashboard {
    subunit_id: number;
    subunit_name: string;
    list_analytic: {
        plan_budget: number;
        total_usage: number;
        not_paid: number;
    }[];
    list_activity: {
        load_name: string;
        load_usage: number;
    }[];
}

export interface GetChartSubUnitDashboard
    extends Array<{
        month: string;
        total: number;
    }> {
    _?: any;
}
