import { BaseTableData, Justification } from "models";

export interface TDataJustification extends BaseTableData, Justification {
    _?: any;
}

export interface FDataJustification
    extends Omit<Justification, "id" | "no_justification" | "position" | "subunit_name" | "creator" | "lock_budget" | "load_name"> {
    approval_position_id: number | string;
    load_type_id: number | string;
    subunit_id: number | string;
}
