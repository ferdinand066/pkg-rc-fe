import { BaseResponse } from "../../model/service";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/admin/room`;

export class RoomService extends BaseService {
  static async createRoom(params: object) {
    return await this._post<BaseResponse<never>>(`${URL}`, params);
  }

  static async updateRoom(
    id: string,
    params: object
  ) {
    if (!id) return;
    return await this._patch<BaseResponse<never>>(`${URL}/${id}`, params);
  }

  static async deleteRoom(
    id: string,
  ) {
    if (!id) return;
    return await this._delete<BaseResponse<never>>(`${URL}/${id}`, {});
  }
}
