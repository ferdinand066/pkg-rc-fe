
import { PaginationProps } from "../../model/components/pagination";
import { ItemModel } from "../../model/entities/item";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/general/item`;

export class ItemService extends BaseService {
  static async getItems(params: object): Promise<PaginationProps<ItemModel> | ItemModel[]> {
    try {
      const { data } = await this._get(`${URL}`, params);
      return data.items;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async getOneItem(id: string): Promise<ItemModel | null> {
    if (!id) return null;
    try {
      const { data } = await this._get(`${URL}/${id}`);
      return data.item;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
