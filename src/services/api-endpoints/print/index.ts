/* eslint-disable no-useless-constructor */
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class PrintService extends BaseService {
    getDoc = "/print/get-doc";

    constructor() {
        super();
    }

    GetDoc<T = { id: any; url_document: string }>() {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.get<T>({
                url: this.getDoc,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }
}

const printService = new PrintService();
export default printService;
