import { BaseTableData, LoadType } from "models";

export interface TDataLoadType extends BaseTableData, LoadType {
    _?: any;
}

export interface FDataLoadType extends Omit<LoadType, "id"> {
    _?: any;
}

export interface FDataLoadTypeId extends FDataLoadType {
    id: number | string;
}
