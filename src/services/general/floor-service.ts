
import { FloorModel } from "../../model/entities/room";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/general/floor`;

export class FloorService extends BaseService {
  static async getFloors(params: object): Promise<FloorModel[]> {
    try {
      const { data } = await this._get(`${URL}`, params);
      return data.floors;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async getOneFloor(id: string): Promise<FloorModel | null> {
    if (!id) return null;
    try {
      const { data } = await this._get(`${URL}/${id}`);
      return data.floor;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
