import { BorrowedRoomModel } from "../../model/entities/borrowed-room";
import { FloorModel } from "../../model/entities/room";
import { BaseService } from "../base-service";

const URL = `${__API_URL__}/general/schedule`;
const ROOM_SCHEDULE_URL = `${__API_URL__}/general/room-schedule`;

export class ScheduleService extends BaseService {
  static async getRoomSchedules(): Promise<FloorModel[]> {
    const { data } = await this._get(`${ROOM_SCHEDULE_URL}`);
    return data.floors as FloorModel[];
  }

  static async getSchedules(params: object): Promise<BorrowedRoomModel[]> {
    try {
      const { data } = await this._get(`${URL}`, params);
      // console.log(data);
      // const res = data as ScheduleData;
      // const res = ({
      //   channels: rawData.rooms.map((room) => ({
      //     uuid: room.id as string,
      //     logo: '',
      //     ...room,
      //   })),
      //   epgs: rawData.borrowedRooms.map((borrowedRoom) => {
      //     const sinceDate = new Date(`${borrowedRoom.borrowed_date}T${borrowedRoom.start_borrowing_time}:00`);
      //     const tillDate = new Date(`${borrowedRoom.borrowed_date}T${borrowedRoom.end_event_time}:00`);

      //     // sinceDate.setMinutes(sinceDate.getMinutes() + 18);
      //     // tillDate.setMinutes(tillDate.getMinutes() + 20);

      //     return {
      //       channelUuid: borrowedRoom.room_id,
      //       id: borrowedRoom.id as string,
      //       since: sinceDate.toString(),
      //       till: tillDate.toString(),
      //       title: borrowedRoom.event_name,
      //       description: borrowedRoom.description,
      //       borrowed_by_user_id: borrowedRoom.borrowed_by_user_id,
      //       image: '',
      //     }
      //   })
      // });

      return data.borrowedRooms as BorrowedRoomModel[];
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
