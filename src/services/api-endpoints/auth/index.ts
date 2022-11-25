import { AxiosResponse } from "axios";
import * as Models from "models";
import { AuthData } from "models";
import ApiMethod from "../../api-methods";

class AuthService {
    signinEmail = "/auth/sign-in/email";

    SignInEmail<T = AuthData>(data: Models.SignInEmailData): Promise<AxiosResponse<Models.BaseResponse<T>, any>> {
        return ApiMethod.post<T>({
            url: this.signinEmail,
            data,
        });
    }
}

const authService = new AuthService();
export default authService;
