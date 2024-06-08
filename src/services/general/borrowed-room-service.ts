
import { PaginationProps } from "../../model/components/pagination";
import { BorrowedRoomModel } from "../../model/entities/borrowed-room";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/general/borrowed-room`;

export class BorrowedRoomService extends BaseService {
  static async getBorrowedRooms(params: object): Promise<PaginationProps<BorrowedRoomModel>> {
    try {
      const { data } = await this._get(`${URL}`, params);
      return data.borrowedRooms;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async getOneBorrowedRoom(id: string): Promise<BorrowedRoomModel | null> {
    if (!id) return null;
    try {
      const { data } = await this._get(`${URL}/${id}`);
      return data.borrowedRoom;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async createBorrowedRoom(params: object): Promise<BorrowedRoomModel | null> {
    try {
      const data = await this._post(`${URL}`, params);
      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async updateBorrowedRoom(
    id: string,
    params: object
  ): Promise<BorrowedRoomModel | null> {
    if (!id) return null;
    try {
      const data = await this._patch(`${URL}/${id}`, params);
      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async deleteBorrowedRoom(
    id: string,
  ): Promise<void> {
    if (!id) return;
    try {
      const data = await this._delete(`${URL}/${id}`, {});
      return data
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
