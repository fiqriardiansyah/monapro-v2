import { BaseTableData, Regulation } from "models";

export interface TDataRegulation extends BaseTableData, Regulation {
    _?: any;
}

export interface FDataRegulation extends Omit<Regulation, "id"> {
    _?: any;
}
