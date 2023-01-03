/* eslint-disable camelcase */
import { Auth, getAuth, EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { AxiosResponse } from "axios";
import * as Models from "models";
import { AuthData } from "models";
import { FirebaseApp } from "firebase/app";
import configFirebase from "config/firebase";
import { PasswordChange } from "modules/profile/modal-password-change";
import ApiMethod from "../../api-methods";

class AuthService {
    auth: Auth;

    config: FirebaseApp;

    signinEmail = "/auth/sign-in/email";

    getLoginUser = "/auth/get-login-user";

    constructor(config: FirebaseApp) {
        this.config = config;
        this.auth = getAuth(this.config);
    }

    GetLoginUser<T = AuthData>(): Promise<AxiosResponse<Models.BaseResponse<T>, any>> {
        return ApiMethod.get<T>({
            url: this.getLoginUser,
        });
    }

    async SignInEmail(data: Models.SignInEmailData): Promise<AxiosResponse<Models.BaseResponse<AuthData>, any>> {
        const req = await ApiMethod.post<AuthData>({
            url: this.signinEmail,
            data,
        });
        await signInWithEmailAndPassword(this.auth, data.email, data.password);
        return req;
    }

    async ChangePassword({ password_new, password_old }: PasswordChange) {
        if (!this.auth.currentUser?.email) return;
        const credential = EmailAuthProvider.credential(this.auth.currentUser?.email, password_old);
        await reauthenticateWithCredential(this.auth.currentUser, credential);
        await updatePassword(this.auth.currentUser, password_new);
    }
}

const authService = new AuthService(configFirebase.app);
export default authService;
