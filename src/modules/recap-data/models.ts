import { RecapData } from "models";

export default {};

export interface TDataRecapData extends RecapData {
    _?: any;
}

export interface FilterRecapData {
    load_type_id: string;
    subunit_id: string;
    year: string;
    quartal_id: string;
    month: string | null;
}
