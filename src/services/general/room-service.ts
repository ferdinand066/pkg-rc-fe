import { PaginationProps } from "../../model/components/pagination";
import { RoomModel } from "../../model/entities/room";
import { BaseResponse } from "../../model/service";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/general/room`;

export class RoomService extends BaseService {
  static async getRooms<T extends PaginationProps<RoomModel> | RoomModel[]>(params: object) {
    const res = await this._get<
      BaseResponse<{
        rooms: T;
      }>
    >(`${URL}`, params);
    return res?.data?.rooms;
  }

  static async getOneRoom(id: string) {
    if (!id) return null;
    const res = await this._get<
      BaseResponse<{
        room: RoomModel;
      }>
    >(`${URL}/${id}`);
    return res?.data?.room;
  }

  static async getRoomAvailability(id: string, param: object) {
    const res = await this._get<
      BaseResponse<{
        slots: string[];
      }>
    >(`${URL}/availability/${id}`, param);
    return res?.data?.slots ?? [];
  }
}
