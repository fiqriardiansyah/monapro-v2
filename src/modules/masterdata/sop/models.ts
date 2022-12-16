import { BaseTableData, Sop } from "models";

export interface TDataSop extends BaseTableData, Sop {
    _?: any;
}

export interface FDataSop extends Omit<Sop, "id"> {
    _?: any;
}

export interface FDataSopId extends FDataSop {
    id: number | string;
}
