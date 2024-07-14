
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/general/user`;

export class UserService extends BaseService {
  static async updateUserProfile(body: object): Promise<any> {
    try {
      const data = await this._post(`${URL}`, body);
      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
