
import { GeneralData } from "../components/general-data"
import { RoomItem } from "./room"

export type ItemModel = GeneralData & {
    idle_quantity: number;
    room_items: RoomItem[];
}

export type ItemHistoryModel = GeneralData & {
    item_id: string;
    room_id?: string;
    item: ItemModel;
    room?: RoomModel;
    quantity: number;
    type?: string;
    user: UserModel;
}