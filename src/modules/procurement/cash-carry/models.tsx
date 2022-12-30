import { BaseTableData, CashCarry } from "models";

export interface TDataCashCarry extends BaseTableData, CashCarry {
    _?: any;
}

export interface TDataCreateCashCarry extends Omit<CashCarry, "load_name" | "subunit_name" | "status" | "id"> {
    _?: any;
}

export interface TDataEditCashCarry extends TDataCreateCashCarry {
    status: string;
}
