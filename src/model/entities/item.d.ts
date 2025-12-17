
import { GeneralData } from "../components/general-data"
import { RoomItem } from "./room"

export type ItemModel = GeneralData & {
    room_items: RoomItem[]
}