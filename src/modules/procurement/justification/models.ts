import { BaseTableData, Justification } from "models";

export interface TDataJustification extends BaseTableData, Justification {
    _?: any;
}

export interface FDataJustification
    extends Omit<Justification, "id" | "no_justification" | "position" | "subunit_name" | "creator" | "lock_budget" | "load_name" | "no_agenda"> {
    agenda_data_id?: number | null;
    approval_position_id: number | string;
    load_type_id: number | string;
    subunit_id: number | string;
    quartal_id: number;
    sub_load_id?: number | string | null;
}
