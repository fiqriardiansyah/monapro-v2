import { BaseTableData, Role } from "models";

export interface TDataRoleManagement extends BaseTableData, Role {
    _?: any;
}

export interface FDataUser {
    email: string;
    password: string;
    role_id: number;
    full_name: string;
}

export interface FEditUser {
    full_name: string;
    profile_image: string | null;
}
