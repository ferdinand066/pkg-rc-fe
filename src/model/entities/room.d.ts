
import { GeneralData } from "../components/general-data"
import { UserCurrentBranchModel } from "./branch"
import { EmployeeModel } from "./employee"
import { UserRoleModel } from "./roles"

export type FloorModel = GeneralData;

export type RoomModel = GeneralData & {
  floor: FloorModel,
  room_items?: RoomItem[],
  item_id?: string[],
}

export type RoomItem = {
  id: string,
  room_id: string,
  item_id: string,
  room: RoomModel,
  item: ItemModel,
}