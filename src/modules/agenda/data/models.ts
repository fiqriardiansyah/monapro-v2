import { BaseTableData, AgendaData } from "models";

export interface TDataAgenda extends BaseTableData, AgendaData {
    _?: any;
}

export interface FDataAgenda extends Omit<AgendaData, "id" | "no_agenda_secretariat" | "no_agenda_disposition" | "subunit_name" | "lock_budget"> {
    _?: any;
}
