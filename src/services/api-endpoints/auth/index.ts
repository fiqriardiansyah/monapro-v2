import { AxiosResponse } from "axios";
import * as Models from "models";
import ApiMethod from "../../api-methods";

export default class AuthEndPoints {
    static signinEmail = "/auth/sign-in/email";

    static SignInEmail<T = any>(data: Models.SignInEmailData): Promise<AxiosResponse<Models.BaseResponse<T>, any>> {
        return ApiMethod.post<T>({
            url: this.signinEmail,
            data,
        });
    }
}
