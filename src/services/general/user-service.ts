
import axios from "axios";
import { UserModel } from "../../model/entities/user";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/auth`;
const EMAIL_URL = `${__API_URL__}/email`;

export class UserService extends BaseService {
  static async login(body: object): Promise<any> {
    try {
      const data = await this._post(`${URL}/login`, body);
      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async register(body: object): Promise<any> {
    try {
      const data = await this._post(`${URL}/register`, body);
      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async me(): Promise<UserModel | undefined> {
    if (!axios.defaults.headers.common["Authorization"]) return undefined;
    try {
      const { data } = await this._get(`${URL}/me`);
      return data.user;
    } catch (e: any) {}
  }

  static async changePassword(body: object): Promise<any> {
    try {
      const data = await this._patch(`${URL}/change-password`, body);

      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async logout(): Promise<UserModel | undefined> {
    try {
      const data = await this._get(`${URL}/logout`);
      return data;
    } catch (e: any) {}
  }

  static async resendVerificationEmail() {
    const data = await this._post(`${EMAIL_URL}/resend`, {});
    return data;
  }
}
