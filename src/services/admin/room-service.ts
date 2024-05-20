
import { PaginationProps } from "../../model/components/pagination";
import { UserModel } from "../../model/entities/user";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/admin/room`;

export class RoomService extends BaseService {
  static async getRooms(params: object): Promise<PaginationProps<UserModel>> {
    try {
      const { data } = await this._get(`${URL}`, params);
      return data.users;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async getOneRoom(id: string): Promise<UserModel[] | null> {
    if (!id) return null;
    try {
      const { data } = await this._get(`${URL}/${id}`);
      return data.user;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
