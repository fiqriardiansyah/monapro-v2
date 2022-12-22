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
