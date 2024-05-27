
import { GeneralData } from "../components/general-data"
import { UserCurrentBranchModel } from "./branch"
import { EmployeeModel } from "./employee"
import { UserRoleModel } from "./roles"
import { RoomModel } from "./room";
import { UserModel } from "./user";

export type FloorModel = GeneralData;

export type BorrowedRoomModel = GeneralData & {
  room_id: string,
  room: RoomModel,
  borrowed_date: Date,
  start_time: Date,
  end_time: Date,
  borrowed_by: UserModel,
  borrowed_by_user_id: string,
  borrowed_status: number,
  borrowed_room_items: BorrowedRoomItemModel[],
  item_id?: string[],
}

export type BorrowedRoomItemModel = {
  id: string,
  borrowed_room_id: string,
  item_id: string,
  room: RoomModel,
  item: ItemModel,
}