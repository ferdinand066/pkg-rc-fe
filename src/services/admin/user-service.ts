
import { PaginationProps } from "../../model/components/pagination";
import { UserModel } from "../../model/entities/user";
import { BaseResponse } from "../../model/service";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/admin/user`;

export class UserService extends BaseService {
  static async getUsers(params: object) {
    const res = await this._get<BaseResponse<{
      users: PaginationProps<UserModel>
    }>>(`${URL}`, params);

    return res?.data?.users;
  }

  static async getOneUser(id: string) {
    if (!id) return;
    const res = await this._get<BaseResponse<{
      user: UserModel
    }>>(`${URL}/${id}`);

    return res?.data?.user;
  }

  static async updateUserRole(id: string, body: object) {
    if (!id) return null;

    const data = await this._patch<BaseResponse<never>>(`${URL}/${id}`, body);
    return data;
  }

  static async activateUser(id: string) {
    if (!id) return null;

    const data = await this._post<BaseResponse<never>>(`${URL}/${id}/activate`, {});
    return data;
  }

  static async rejectUser(id: string) {
    if (!id) return null;

    const data = await this._post<BaseResponse<never>>(`${URL}/${id}/reject`, {});
    return data;
  }
}
