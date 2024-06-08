import { ScheduleData, ScheduleRawData } from "../../model/entities/schedule";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/general/schedule`;

export class ScheduleService extends BaseService {
  static async getSchedules(params: object): Promise<ScheduleData> {
    try {
      const { data } = await this._get(`${URL}`, params);
      const rawData = data as ScheduleRawData;
      const res = ({
        channels: rawData.rooms.map((room) => ({
          uuid: room.id as string,
          logo: '',
          ...room,
        })),
        epgs: rawData.borrowedRooms.map((borrowedRoom) => {
          const sinceDate = new Date(`${borrowedRoom.borrowed_date}T${borrowedRoom.start_borrowing_time}:00`);
          const tillDate = new Date(`${borrowedRoom.borrowed_date}T${borrowedRoom.end_event_time}:00`);

          // sinceDate.setMinutes(sinceDate.getMinutes() + 18);
          // tillDate.setMinutes(tillDate.getMinutes() + 20);

          return {
            channelUuid: borrowedRoom.room_id,
            id: borrowedRoom.id as string,
            since: sinceDate.toString(),
            till: tillDate.toString(),
            title: borrowedRoom.event_name,
            description: borrowedRoom.description,
            borrowed_by_user_id: borrowedRoom.borrowed_by_user_id,
            image: '',
          }
        })
      });

      return res;

    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
