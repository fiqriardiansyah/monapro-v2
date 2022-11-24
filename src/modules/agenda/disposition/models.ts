import { BaseTableData, AgendaDisposition } from "models";

export interface TDataAgendaDisposition extends BaseTableData, AgendaDisposition {
    _?: any;
}

export interface FDataAgendaDisposition
    extends Omit<AgendaDisposition, "id" | "no_agenda_secretariat" | "no_agenda_disposition" | "sender" | "about"> {
    _?: any;
}
