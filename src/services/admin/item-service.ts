import { ItemModel } from "../../model/entities/item";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/admin/item`;

export class ItemService extends BaseService {
  static async createItem(params: object): Promise<ItemModel | null> {
    try {
      const data = await this._post(`${URL}`, params);
      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async updateItem(
    id: string,
    params: object
  ): Promise<ItemModel | null> {
    if (!id) return null;
    try {
      const data = await this._patch(`${URL}/${id}`, params);
      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async deleteItem(
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
