
import { GeneralData } from "../components/general-data";

export type FloorModel = GeneralData & {
  rooms: RoomModel[];
};

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
  quantity: number,
}