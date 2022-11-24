import { BaseTableData, Finance } from "models";

export interface TDataFinance extends BaseTableData, Finance {
    _?: any;
}

export interface FDataFinance extends Omit<Finance, "id" | "no_justification" | "about_justification" | "is_paid"> {
    justification_id: string;
}
