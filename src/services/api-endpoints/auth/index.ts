import { AxiosResponse } from "axios";
import * as Models from "models";
import { AuthData } from "models";
import ApiMethod from "../../api-methods";

class AuthService {
    signinEmail = "/auth/sign-in/email";

    getLoginUser = "/auth/get-login-user";

    GetLoginUser<T = AuthData>(): Promise<AxiosResponse<Models.BaseResponse<T>, any>> {
        return ApiMethod.get<T>({
            url: this.getLoginUser,
        });
    }

    SignInEmail<T = AuthData>(data: Models.SignInEmailData): Promise<AxiosResponse<Models.BaseResponse<T>, any>> {
        return ApiMethod.post<T>({
            url: this.signinEmail,
            data,
        });
    }
}

const authService = new AuthService();
export default authService;
