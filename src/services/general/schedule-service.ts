import { ScheduleData, ScheduleRawData } from "../../model/entities/schedule";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/general/schedule`;

export class ScheduleService extends BaseService {
  static async getSchedules(params: object): Promise<ScheduleData> {
    try {
      const { data } = await this._get(`${URL}`, params);
      const rawData = data as ScheduleRawData;
      return ({
        channels: rawData.rooms.map((room) => ({
          uuid: room.id as string,
          logo: '',
          ...room,
        })),
        epgs: rawData.borrowedRooms.map((borrowedRoom) => ({
          channelUuid: borrowedRoom.room_id,
          id: borrowedRoom.id as string,
          since: borrowedRoom.borrowed_date + 'T' + borrowedRoom.start_time + ":00",
          till: borrowedRoom.borrowed_date + 'T' + borrowedRoom.end_time + ":00",
          title: borrowedRoom.borrowed_by.name,
          description: borrowedRoom.reason,
          image: '',
        }))
      });

    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
