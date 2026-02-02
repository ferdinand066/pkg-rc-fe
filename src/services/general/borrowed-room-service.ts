import { PaginationProps } from "../../model/components/pagination";
import { BorrowedRoomModel } from "../../model/entities/borrowed-room";
import { BaseResponse } from "../../model/service";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/general/borrowed-room`;

export class BorrowedRoomService extends BaseService {
  static async getBorrowedRooms(
    params: object
  ) {
    const res = await this._get<BaseResponse<{
      borrowedRooms: PaginationProps<BorrowedRoomModel>
    }>>(`${URL}`, params);
    return res?.data.borrowedRooms;
  }

  static async getOneBorrowedRoom(
    id: string
  ) {
    if (!id) return null;
    const res = await this._get<BaseResponse<{
      borrowedRoom: BorrowedRoomModel
    }>>(`${URL}/${id}`);
    return res?.data?.borrowedRoom;
  }

  static async createRecurringBorrowedRoom(params: object) {
    return await this._post<BaseResponse<never>>(`${URL}/recurring`, params);
  }

  static async createBorrowedRoom(
    params: object
  ) {
    return await this._post<BaseResponse<never>>(`${URL}`, params);
  }

  static async updateBorrowedRoom(
    id: string,
    params: object
  ) {
    if (!id) return null;
    return await this._patch<BaseResponse<never>>(`${URL}/${id}`, params);
  }

  static async deleteBorrowedRoom(id: string) {
    if (!id) return;
    return await this._delete<BaseResponse<never>>(`${URL}/${id}`, {});
  }
}
