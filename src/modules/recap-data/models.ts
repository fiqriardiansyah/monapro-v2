import { RecapData } from "models";

export default {};

export interface TDataRecapData extends RecapData {
    _?: any;
}

export interface FilterRecapData {
    sub_unit: string;
    quartal: string;
    date: string;
    year: string;
    load_type: string;
    month: string;
}