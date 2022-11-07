import { AuthData } from "./data";

export default {};

export interface BasePaginationResponse<T = any> {
    list: T[];
    total_data: number;
    total_page: number;
    current_page: number;
}

// ===========================================================================
// response AUTH
export interface SignInEmailResponse extends AuthData {
    _?: any;
}

// ===========================================================================
