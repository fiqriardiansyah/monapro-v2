export default {};

export interface AuthData {
    is_new: boolean;
    id: number | string;
    fullname: string;
    email: string;
    token: string;
    phone: any;
}

export interface BaseTableData {
    key: string | number;
    id: string | number;
}

export interface SelectOption {
    label: string;
    value: number;
}

export interface SubUnitData {
    id: number | string;
    unit_name: string;
    pic_name: string;
    budget: number | string;
}

export interface Role {
    id: number | string;
    role_id: number | string;
    role_name: string;
    full_name: string;
    email: string;
}

export interface LoadType {
    id: number | string;
    load_name: string;
}

export interface ApprovalPosition {
    id: number | string;
    name: string;
    position: string;
}

export interface AgendaData {
    id: string | number;
    no_agenda_secretariat: string;
    no_agenda_disposition: string;
    date: string;
    endorse: number;
    letter_no: string;
    letter_date: string;
    sender: string;
    about: string;
    subunit_id: string;
    subunit_name: string;
    follow_up: string;
    decision: string;
    document: any;
    event_date: string;
    estimation_paydate: string;
    lock_budget?: number;
}

export interface AgendaDisposition {
    id: string | number;
    agenda_data_id: string;
    no_agenda_secretariat: string;
    no_agenda_disposition: string;
    disposition_to: string;
    letter_no: string;
    sender: string;
    about: string;
    disposition_date: string;
    note: string;
    disposition_doc: any;
}

export interface Justification {
    id: string | number;
    no_justification: string;
    justification_date: number | string;
    no_agenda: string;
    about_justification: string;
    position: string;
    value: number | string;
    subunit_name: string;
    creator: string;
    note: string;
    doc_justification: any | null;
    event_date: string | number;
    estimation_paydate: string | number;
    lock_budget?: number;
}

export interface Negotiation {
    id: string | number;
    no_justification: string;
    about_justification: string;
    negotiation_date: string;
    note: string;
    doc_negotiation: any;
}

export interface ContractSpNopes {
    id: string | number;
    no_justification: string;
    about_justification: string;
    no_contract: string;
    about_manage: string;
    date: string;
    value: string;
    doc: any;
}

export interface News {
    id: string | number;
    no_justification: string;
    about_justification: string;
    no_bap: string;
    no_bar: string;
    no_bapp: string;
    file_bap: any;
    file_bar: any;
    file_bapp: any;
}

export interface Finance {
    id: string | number;
    no_justification: string;
    about_justification: string;
    invoice_file: string;
    tel21_date: string;
    spb_date: string;
    payment_date: string;
    value_payment: string;
    note: string;
    attachment_file: any;
    is_paid?: number;
}

export interface SubUnitProcurement {
    subunit_id: number;
    subunit_name: string;
}

export interface LoadTypeProcurement {
    load_type_id: number;
    load_name: string;
}

export interface ApprovalPositionProcurement {
    approval_position_id: number;
    position: string;
}

export interface JustificationProcurement {
    justification_id: number;
    no_justification: string;
}

export interface AgendaDataDisposition {
    agenda_data_id: number;
    no_agenda_secretariat: string;
}
