/* eslint-disable no-useless-constructor */
import { AxiosResponse } from "axios";
import * as Models from "models";
import { AuthData } from "models";
import { DEFAULT_ERROR_MESSAGE } from "utils/constant";
import ApiMethod from "../../api-methods";
import BaseService from "../base";

class ProfileService extends BaseService {
    getProfile = "/profile/get-profile";

    getRole = "/profile/get-role";

    editRole = "/profile/edit-role";

    constructor() {
        super();
    }

    GetProfile<T = Models.Profile>(): Promise<AxiosResponse<Models.BaseResponse<T>, any>> {
        return this.ProxyRequest(async () => {
            const req = await ApiMethod.get<T>({
                url: this.getProfile,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }

    GetRole<T = Models.Role>(param: Models.GetRoleProfileParam) {
        return this.ProxyRequest<Models.BasePaginationResponse<T>>(async () => {
            const req = await ApiMethod.get<Models.BasePaginationResponse<T>>({
                url: this.getRole,
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

    EditRole<T = Models.Role>(data: Models.EditRoleData) {
        return this.ProxyRequest<T>(async () => {
            const req = await ApiMethod.put<T>({
                url: this.editRole,
                data,
            });
            if (req.data?.status !== 200) throw new Error(req.data?.message || DEFAULT_ERROR_MESSAGE);
            return req;
        });
    }
}

const profileService = new ProfileService();
export default profileService;
