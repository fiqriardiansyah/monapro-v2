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
