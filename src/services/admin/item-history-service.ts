import { PaginationProps } from "../../model/components/pagination";
import { ItemHistoryModel } from "../../model/entities/item";
import { BaseResponse } from "../../model/service";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/admin/item-history`;

export class ItemHistoryService extends BaseService {
  static async getItemHistories(params: object) {
    const res = await this._get<BaseResponse<{
      itemHistories: PaginationProps<ItemHistoryModel>
    }>>(`${URL}`, params);
    return res?.data?.itemHistories;
  }

  static async createItemHistory(params: object) {
    return await this._post<BaseResponse<never>>(`${URL}`, params);
  }
}
