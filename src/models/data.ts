/* eslint-disable no-use-before-define */
export default {};

export interface AuthData {
    is_new: boolean;
    id: number | string;
    fullname: string;
    email: string;
    token: string;
    profile_image: string;
    role_id: number;
    phone: any;
    role_access: [
        {
            dashboard: boolean;
        },
        {
            agenda: boolean;
        },
        {
            justification: boolean;
        },
        {
            data_recap: boolean;
        },
        {
            master_data: boolean;
        },
        {
            profile: boolean;
        }
    ];
}

export interface Profile extends Omit<AuthData, "is_new" | "token" | "phone" | "fullname" | "profile_image"> {
    profile_image: string | null;
    full_name: string;
    username: string;
    _?: any;
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
    code: string;
    pic_name: string;
}

export interface Role {
    user_id: number;
    role_id: number;
    role_name: string;
    full_name: string;
    email: string;
}

export interface LoadType {
    id: number | string;
    load_name: string;
    budget_id?: string | number;
    year: string;
    jan: string;
    feb: string;
    mar: string;
    apr: string;
    may: string;
    jun: string;
    jul: string;
    agu: string;
    sep: string;
    oct: string;
    nov: string;
    des: string;
}

export interface Sop {
    id: number | string;
    name: string;
    document: string | null;
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
    no_agenda_directors: string;
    no_agenda_ccir: string;
    date: string | null;
    endorse: string;
    letter_no: string;
    letter_date: string | null;
    sender: string;
    about: string;
    subunit_id: string;
    subunit_name: string;
    follow_up: string;
    decision: string;
    document: any;
    event_date: string | null;
    estimation_paydate: string | null;
    status: number | string;
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

export interface AgendaFinance {
    id: string | number;
    no_agenda_secretariat: string;
    agenda_data_id?: string;
    load_type_id?: string;
    sender: string;
    about: string;
    finnest_no: string;
    finnest_date: string;
    letter_no: string;
    load_name: string;
    date: string;
    value_payment: string;
    spb_date: string;
    transfer_to: string;
    no_rekening: string;
    payment_date: string;
    note: string;
    is_paid?: number;
}

export interface Justification {
    id: string | number;
    no_justification: string;
    justification_date: number | string;
    no_agenda: string;
    about_justification: string;
    position: string;
    agenda_data_id?: string | null;
    load_type_id?: number | string;
    value: number | string;
    subunit_name: string;
    load_name: string;
    creator: string;
    note: string;
    doc_justification: any | null;
    event_date: string | number | null;
    estimation_paydate: string | number | null;
    lock_budget?: number;
}

export interface Negotiation {
    id: string | number;
    justification_id: string;
    no_justification: string;
    about_justification: string;
    negotiation_date: string;
    note: string;
    doc_negotiation: any;
}

export interface ContractSpNopes {
    id: string | number;
    justification_id: string;
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
    justification_id: string;
    no_justification: string;
    about_justification: string;
    date_news: string | null;
    no_bap: string;
    no_bar: string;
    no_bapp: string;
    file_bap: any;
    file_bar: any;
    file_bapp: any;
}

export interface Finance {
    id: string | number;
    justification_id: string;
    no_justification: string;
    about_justification: string;
    invoice_file: any;
    tel21_date: string;
    spb_date: string;
    payment_date: string;
    value_payment: string;
    note: string;
    attachment_file: any;
    is_paid?: number;
}

export interface CashCarry {
    id: number | string;
    submission_date: string;
    submission_value: string;
    load_type_id: string;
    load_name: string;
    subunit_name: string;
    billing_month: string;
    about: string;
    file_document: string | null;
    status: string;
}

export interface RecapData {
    justification_id: number;
    finance_id: number | null;
    no_agenda: number | null;
    no_justification: string;
    about_justification: string;
    estimation_paydate: string;
    value: number;
    load_name: string;
    subunit_name: string;
    no_contract: string | null;
    no_bap: string | null;
    file_bap: string | null;
    no_bar: string | null;
    file_bar: string | null;
    no_bapp: string | null;
    file_bapp: string | null;
    lock_budget: number;
    is_paid: number;
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

export interface SubLoadProcurement {
    sub_load_id?: number;
    sub_load_name: string;
}

export interface NoAgendaProcurement {
    agenda_data_id: number;
    no_agenda_secretariat: string;
    about: string;
}

export interface AgendaDataDisposition {
    agenda_data_id: number;
    no_agenda_secretariat: string;
}

export interface AgendaLoadType {
    load_type_id: number;
    load_name: string;
}

export interface RemainingBudget {
    id: number;
    subunit_name: string;
    budget: number;
    total_usage: number;
}

export interface AnalyticSubUnit {
    subunit_id: number;
    subunit_name: string;
    note: string;
    list_analytic: {
        plan_budget: number;
        total_usage: number;
        not_paid: number;
    }[];
}

export interface LineChart {
    subunit_id: number;
    subunit_name: string;
    list_chart: {
        month: string;
        total: null | number;
    }[];
}

export interface Regulation {
    id: number | string;
    name: string;
    document: string | null;
}
