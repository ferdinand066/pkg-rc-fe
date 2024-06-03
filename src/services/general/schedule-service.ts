import { ScheduleData, ScheduleRawData } from "../../model/entities/schedule";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/general/schedule`;

export class ScheduleService extends BaseService {
  static async getSchedules(params: object): Promise<ScheduleData> {
    console.log(params);
    try {
      const { data } = await this._get(`${URL}`, params);
      const rawData = data as ScheduleRawData;
      const res = ({
        channels: rawData.rooms.map((room) => ({
          uuid: room.id as string,
          logo: '',
          ...room,
        })),
        epgs: rawData.borrowedRooms.map((borrowedRoom) => ({
          channelUuid: borrowedRoom.room_id,
          id: borrowedRoom.id as string,
          since: borrowedRoom.borrowed_date + 'T' + borrowedRoom.start_borrowing_time + ":00",
          till: borrowedRoom.borrowed_date + 'T' + borrowedRoom.end_event_time + ":00",
          title: borrowedRoom.event_name,
          description: borrowedRoom.description,
          image: '',
        }))
      });

      console.log(res);

      return res;

    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
