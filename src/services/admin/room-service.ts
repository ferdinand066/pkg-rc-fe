import { RoomModel } from "../../model/entities/room";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/admin/room`;

export class RoomService extends BaseService {
  static async createRoom(params: object): Promise<RoomModel | null> {
    try {
      const data = await this._post(`${URL}`, params);
      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async updateRoom(
    id: string,
    params: object
  ): Promise<RoomModel | null> {
    if (!id) return null;
    console.log(id);
    console.log(params);
    try {
      const data = await this._patch(`${URL}/${id}`, params);
      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async deleteRoom(
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
