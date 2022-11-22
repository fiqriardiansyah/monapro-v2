import { AxiosRequestConfig } from "axios";
import { AgendaData, AgendaDisposition, ApprovalPosition, Justification, LoadType, SubUnitData } from "./data";

export default {};

// BASE RESPONSE AND METHOD PARAMS
export interface BaseResponse<T = any> {
    data: T;
    status: number;
    message: string;
}

export interface GetMethodParams<T = any> {
    url: string;
    config?: AxiosRequestConfig<T>;
}

export interface PostMethodParams<T = any> {
    url: string;
    data?: any;
    config?: AxiosRequestConfig<T>;
}

export interface PutMethodParams<T = any> {
    url: string;
    data?: any;
    config?: AxiosRequestConfig<T>;
}

export interface DeleteMethodParams<T = any> {
    url: string;
    config?: AxiosRequestConfig<T>;
}

// AUTH
export interface SignInEmailData {
    email: string;
    password: string;
}

// MASTER DATA - SUBUNIT
export interface SubUnitGetAllParam {
    page: string | number;
}

export interface SubUnitCreateData extends Omit<SubUnitData, "id"> {
    _?: any;
}

export interface SubUnitEditData extends SubUnitData {
    _?: any;
}

export interface SubUnitDetailPath {
    id: string | number;
}

export interface SubUnitDeletePath {
    id: string | number;
}

// MASTER DATA - ROLE MANAGEMENT
export interface RoleManagementGetAllParam {
    page: string | number;
}

// MASTER DATA - LOAD TYPE
export interface LoadTypeGetAllParam {
    page: string | number;
}

export interface LoadTypeCreateData extends Omit<LoadType, "id"> {
    _?: any;
}

export interface LoadTypeEditData extends LoadType {
    _?: any;
}

export interface LoadTypeDetailPath {
    id: string | number;
}

export interface LoadTypeDeletePath {
    id: string | number;
}

// MASTER DATA - APPROVAL POSITION
export interface ApprovalPositionGetAllParam {
    page: string | number;
}

export interface ApprovalPositionCreateData extends Omit<ApprovalPosition, "id"> {
    _?: any;
}

export interface ApprovalPositionEditData extends ApprovalPosition {
    _?: any;
}

export interface ApprovalPositionDetailPath {
    id: string | number;
}

export interface ApprovalPositionDeletePath {
    id: string | number;
}

// AGENDA - AGENDA DATA
export interface AgendaDataGetAllParam {
    page: string | number;
}

export interface AgendaDataCreateData extends Omit<AgendaData, "id"> {
    _?: any;
}

export interface AgendaDataEditData extends AgendaData {
    _?: any;
}

export interface AgendaDataDetailPath {
    id: string | number;
}

export interface AgendaDataLockBudgetData {
    id: string | number;
    lock_budget: string | number;
}

// AGENDA - AGENDA DISPOSITION
export interface AgendaDispositionGetAllParam {
    page: string | number;
}

export interface AgendaDispositionCreateData extends Omit<AgendaDisposition, "id"> {
    _?: any;
}

export interface AgendaDispositionEditData extends AgendaDisposition {
    _?: any;
}

export interface AgendaDispositionDetailPath {
    id: string | number;
}

// PROCUREMENT - JUSTIFICATION
export interface JustificationGetAllParam {
    page: string | number;
}

export interface JustificationCreateData extends Omit<Justification, "id"> {
    _?: any;
}

export interface JustificationEditData extends Justification {
    _?: any;
}

export interface JustificationDetailPath {
    id: string | number;
}

export interface JustificationLockBudgetData {
    id: string | number;
    lock_budget: string | number;
}
