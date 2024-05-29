
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/admin/borrowed-room`;

export class BorrowedRoomService extends BaseService {
  static async acceptBorrowedRoom(
    id: string,
  ): Promise<void> {
    if (!id) return;
    try {
      const data = await this._post(`${URL}/${id}/accept`, {});
      return data
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async declineBorrowedRoom(
    id: string,
  ): Promise<void> {
    if (!id) return;
    try {
      const data = await this._post(`${URL}/${id}/decline`, {});
      return data
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
