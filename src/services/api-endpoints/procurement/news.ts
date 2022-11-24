/* eslint-disable no-useless-constructor */
import * as Models from "models";
import { BasePaginationResponse, ContractSpNopes, Justification, Negotiation, News } from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class NewsService extends BaseService {
    getAll = "/procurement/get-all-news";

    detail = "/procurement/detail-news";

    create = "/procurement/create-news";

    edit = "/procurement/edit-news";

    constructor() {
        super();
    }

    GetAll<T = any>(param: Models.NewsGetAllParam) {
        return this.ProxyRequest<BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<BasePaginationResponse<T>>({
                url: this.getAll,
                config: {
                    params: {
                        ...param,
                    },
                },
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Create<T = any>(data: Models.NewsCreateData) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.post<T>({
                url: this.create,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Detail<T = News>({ id }: Models.NewsDetailPath) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.get<T>({
                url: `${this.detail}/${id}`,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    Edit<T = any>(data: Models.NewsEditData) {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.put<T>({
                url: this.edit,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }
}

const newsService = new NewsService();
export default newsService;
