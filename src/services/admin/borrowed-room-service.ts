import { BaseResponse } from "../../model/service";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/admin/borrowed-room`;

export class BorrowedRoomService extends BaseService {
  static async acceptBorrowedRoom(id: string, body: object) {
    if (!id) return;
    return await this._post<BaseResponse<never>>(`${URL}/${id}/accept`, body);
  }

  static async declineBorrowedRoom(id: string) {
    if (!id) return;
    return await this._post<BaseResponse<never>>(`${URL}/${id}/decline`, {});
  }
}
