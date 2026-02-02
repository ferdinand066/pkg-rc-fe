
import axios from "axios";
import { EmailVerificationResponse } from "../../model/response/auth/email-verification.response";
import { LoginResponse } from "../../model/response/auth/login.response";
import { MeResponse } from "../../model/response/auth/me.response";
import { BaseResponse } from "../../model/service";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/auth`;
const EMAIL_URL = `${__API_URL__}/email`;

export class AuthService extends BaseService {
  static async login(body: object) {
    const data = await this._post<BaseResponse<LoginResponse>>(`${URL}/login`, body);
    return data;
  }

  static async register(body: object) {
    const data = await this._post<BaseResponse<never>>(`${URL}/register`, body);
    return data;
  }

  static async me() {
    if (!axios.defaults.headers.common["Authorization"]) return undefined;
    const data = await this._get<BaseResponse<MeResponse>>(`${URL}/me`);
    return data?.data?.user;
  }

  static async forgotPassword(body: object) {
    const data = await this._post<BaseResponse<never>>(`${URL}/forgot-password`, body);
    return data;
  }

  static async resetPassword(body: object) {
    const data = await this._post<BaseResponse<never>>(`${URL}/reset-password`, body);
    return data;
  }

  static async logout() {
    const data = await this._get<BaseResponse<never>>(`${URL}/logout`);
    return data?.data;
  }

  static async resendVerificationEmail() {
    const data = await this._post<BaseResponse<never>>(`${EMAIL_URL}/resend`, {});
    return data;
  }


  static async emailVerificationConfirmation(token: string, param: object) {
    const data = await this._get<BaseResponse<EmailVerificationResponse>>(`${EMAIL_URL}/verify/${token}`, param);
    return data;
  }

  static async getForgotPasswordTokenValidation(token: string, email: string) {
    try {
      await this._get(`${URL}/token/${token}`, {
        email: email,
      });
      return true;
    } catch {
      return false;
    }
  }
}
