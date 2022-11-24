import { BaseTableData, ContractSpNopes } from "models";

export interface TDataContractSpNopes extends BaseTableData, ContractSpNopes {
    _?: any;
}

export interface FDataContractSpNopes extends Omit<ContractSpNopes, "about_justification" | "no_justification" | "id"> {
    justification_id: string;
}
