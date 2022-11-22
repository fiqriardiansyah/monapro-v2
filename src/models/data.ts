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
