import { BaseTableData, News } from "models";

export interface TDataNews extends BaseTableData, News {
    _?: any;
}

export interface FDataNews extends Omit<News, "id" | "no_justification" | "about_justification" | "no_bar" | "no_bapp" | "no_bap"> {
    justification_id: string;
}
