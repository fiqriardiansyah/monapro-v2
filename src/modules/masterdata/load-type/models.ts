import { BaseTableData, LoadType } from "models";

export interface TDataLoadType extends BaseTableData, LoadType {
    _?: any;
}

export interface FDataLoadType {
    load_name: string;
    sub_load?: number | null;
    sub_load_model: {
        sub_load_name: string;
    }[];
}

export interface FDataLoadTypeId extends FDataLoadType {
    id: number | string;
}
