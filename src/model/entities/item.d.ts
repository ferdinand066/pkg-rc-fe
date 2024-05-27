
import { GeneralData } from "../components/general-data"
import { UserCurrentBranchModel } from "./branch"
import { EmployeeModel } from "./employee"
import { UserRoleModel } from "./roles"
import { RoomItem } from "./room"

export type ItemModel = GeneralData & {
    room_items: RoomItem[]
}