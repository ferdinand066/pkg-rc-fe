
import { PaginationProps } from "../../model/components/pagination";
import { RoomModel } from "../../model/entities/room";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/general/room`;

export class RoomService extends BaseService {
  static async getRooms(params: object): Promise<PaginationProps<RoomModel> | RoomModel[]> {
    try {
      const { data } = await this._get(`${URL}`, params);
      return data.rooms;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async getOneRoom(id: string): Promise<RoomModel | null> {
    if (!id) return null;
    try {
      const { data } = await this._get(`${URL}/${id}`);
      return data.room;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
