
import { PaginationProps } from "../../model/components/pagination";
import { ItemModel } from "../../model/entities/item";
import { BaseResponse } from "../../model/service";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/general/item`;

export class ItemService extends BaseService {
  static async getItems<T extends PaginationProps<ItemModel> | ItemModel[]>(params: object) {
    const res = await this._get<BaseResponse<{
      items: T
    }>>(`${URL}`, params);

    return res?.data?.items;
  }

  static async getOneItem(id: string) {
    if (!id) return null;

    const res = await this._get<BaseResponse<{
      item: ItemModel
    }>>(`${URL}/${id}`);
    return res?.data?.item;
  }
}
