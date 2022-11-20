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
    name: string;
    email: string;
    status: string;
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
    no_secretariat: string;
    no_disposition: string;
    date: string;
    endorse: number;
    letter_no: string;
    letter_date: string;
    sender: string;
    regarding: string;
    sub_unit: string;
    follow_up: string;
    decision: string;
    document: any;
    event_date: string;
    payment_estimation_date: string;
}

export interface AgendaDisposition {
    id: string | number;
    no_secretariat: string;
    no_disposition: string;
    disposition_to: string;
    letter_no: string;
    regarding: string;
    sender: string;
    disposition_date: string;
    disposition_note: string;
    document: any;
}

export interface Justification {
    id: string | number;
    no: string;
    date: string;
    agenda_no: string;
    regarding: string;
    justification_value: string;
    creator: string;
    sub_unit: string;
    last_approval: string;
    code_and_budget: string;
    notes: string;
    document: any;
    event_date: string;
    payment_estimation_date: string;
}

export interface Negotiation {
    id: string | number;
    justification_no: string;
    justification_regarding: string;
    date: string;
    notes: string;
    document: any;
}

export interface ContractSpNopes {
    id: string | number;
    justification_no: string;
    justification_regarding: string;
    no: string;
    manage_regarding: string;
    date: string;
    value: string;
    document: any;
}

export interface News {
    id: string | number;
    justification_no: string;
    justification_regarding: string;
    bap_no: string;
    bar_no: string;
    bapp_no: string;
    bap_document: any;
    bar_document: any;
    bapp_document: any;
}

export interface Finance {
    id: string | number;
    justification_no: string;
    justification_regarding: string;
    bill_file: string;
    tel21_spb_date: string;
    spb_finance_date: string;
    payment_date: string;
    payment_value: string;
    notes: string;
    document: any;
}
