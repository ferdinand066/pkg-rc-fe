
import { GeneralData } from "../components/general-data"
import { UserCurrentBranchModel } from "./branch"
import { EmployeeModel } from "./employee"
import { UserRoleModel } from "./roles"
import { RoomModel } from "./room";
import { UserModel } from "./user";

export type BorrowedRoomModel = GeneralData & {
  room_id: string,
  room: RoomModel,
  pic_name: string,
  pic_phone_number: string,
  capacity: number,
  event_name: string,
  borrowed_date: Date,
  start_borrowing_time: Date,
  start_event_time: Date,
  end_event_time: Date,
  borrowed_by: UserModel,
  pending_users?: UserModel[],
  borrowed_by_user_id: string,
  borrowed_status: number,
  borrowed_room_items: BorrowedRoomItemModel[],
  borrowed_room_agreements: BorrowedRoomAgreement[],
  description: string,
  item_id?: string[],
}

export type BorrowedRoomItemModel = {
  id: string,
  borrowed_room_id: string,
  item_id: string,
  quantity: number,
  room: RoomModel,
  item: ItemModel,
}

export type BorrowedRoomAgreement = {
  id: string,
  borrowed_room_id: string,
  agreement_status: number,
  created_by: UserModel,
  created_by_user_id: string,
}