import { BaseTableData, Negotiation } from "models";

export interface TDataNegotiation extends BaseTableData, Negotiation {
    _?: any;
}

export interface FDataNegotiation extends Omit<Negotiation, "id" | "no_justification" | "about_justification"> {
    justification_id: string;
}
