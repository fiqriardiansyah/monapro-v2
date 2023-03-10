import { AxiosRequestConfig } from "axios";
import { FDataLoadType } from "modules/masterdata/load-type/models";
import {
    AgendaData,
    AgendaDisposition,
    AgendaFinance,
    ApprovalPosition,
    ContractSpNopes,
    Finance,
    Justification,
    LoadType,
    Negotiation,
    News,
    SubUnitData,
} from "./data";

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

export interface LoadTypeCreateData extends FDataLoadType {
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

// AGENDA - AGENDA FINANCE
export interface AgendaFinanceGetAllParam {
    page: string | number;
}

export interface AgendaFinanceCreateData extends Omit<AgendaFinance, "id"> {
    _?: any;
}

export interface AgendaFinanceEditData extends AgendaFinance {
    _?: any;
}

export interface AgendaFinanceDetailPath {
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

// PROCUREMENT - NEGOTIATION
export interface NegotiationGetAllParam {
    page: string | number;
}

export interface NegotiationCreateData extends Omit<Negotiation, "id"> {
    _?: any;
}

export interface NegotiationEditData extends Negotiation {
    _?: any;
}

export interface NegotiationDetailPath {
    id: string | number;
}

// PROCUREMENT - CONTRACT
export interface ContractGetAllParam {
    page: string | number;
}

export interface ContractCreateData extends Omit<ContractSpNopes, "id"> {
    _?: any;
}

export interface ContractEditData extends ContractSpNopes {
    _?: any;
}

export interface ContractDetailPath {
    id: string | number;
}

// PROCUREMENT - NEWS
export interface NewsGetAllParam {
    page: string | number;
}

export interface NewsCreateData extends Omit<News, "id"> {
    _?: any;
}

export interface NewsEditData extends News {
    _?: any;
}

export interface NewsDetailPath {
    id: string | number;
}

// PROCUREMENT - FINANCE
export interface FinanceGetAllParam {
    page: string | number;
}

export interface FinanceCreateData extends Omit<Finance, "id"> {
    _?: any;
}

export interface FinanceEditData extends Finance {
    _?: any;
}

export interface FinanceDetailPath {
    id: string | number;
}

export interface IsPaid {
    id: string | number;
    is_paid: string | number;
}

// dashboard subunit detail
export interface GetHeaderSubUnitPath {
    id: string | number;
}

export interface GetChartSubUnitPath {
    id: string | number;
}

export interface GetAgendaSubUnitPathParam {
    id: string | number;
    page: number | string;
}

export interface GetJustificationSubUnitPathParam {
    id: string | number;
    page: number | string;
}

export interface GetRecapDataPathParam {
    subunitId: string | number;
    page: number | string;
}

// PROFILE
export interface GetRoleProfileParam {
    page: string | number;
}

export interface EditRoleData {
    user_id: number | string;
    role_id: number | string;
}

export interface SearchParam {
    query: string;
    page: number;
}

export interface QuartalParam {
    quartal_id: number;
    year: number;
}

export interface GetSubLoadParam {
    load_type_id: number;
}

//  DATA RECAP
export interface RecapLockBudgetData {
    justification_id: number;
    lock_budget: number;
}

export interface RecapIsPaidData {
    finance_id: number;
    is_paid: number;
}

export interface RecapFilterParam {
    load_type_id: number | string;
    subunit_id: number | string;
    year: number | string;
    quartal_id: number | string;
    month: number | string;
    page: number | string;
}

export interface RecapFilterAllParam extends Omit<RecapFilterParam, "page"> {
    _?: any;
}

export interface DefaultTypeParam {
    page: string | number;
    type: number;
}

export interface DefaultSearchTypeParam {
    query: string;
    page: number;
    type: number;
}
