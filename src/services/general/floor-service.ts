
import { FloorModel } from "../../model/entities/room";
import { BaseResponse } from "../../model/service";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/general/floor`;

export class FloorService extends BaseService {
  static async getFloors(params: object) {
    const res = await this._get<BaseResponse<{
      floors: FloorModel[]
    }>>(`${URL}`, params);
    return res?.data.floors;
  }

  static async getOneFloor(id: string) {
    if (!id) return null;
    
    const res = await this._get<BaseResponse<{
      floor: FloorModel
    }>>(`${URL}/${id}`);
    return res?.data?.floor;
  }
}
