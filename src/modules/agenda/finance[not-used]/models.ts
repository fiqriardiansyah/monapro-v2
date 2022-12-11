import { AgendaFinance, BaseTableData } from "models";

export interface TDataAgendaFinance extends BaseTableData, AgendaFinance {
    _?: any;
}

export interface FDataAgendaFinance
    extends Omit<
        AgendaFinance,
        "id" | "no_agenda_secretariat" | "no_agenda_disposition" | "sender" | "about" | "load_name" | "is_paid" | "letter_no"
    > {
    load_type_id: string;
    agenda_data_id: string;
}
