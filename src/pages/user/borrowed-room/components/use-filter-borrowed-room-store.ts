import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ManageFilterBorrowedRoomProps } from "../../../../hooks/general/use-filter-borrowed-room";

export const filterBorrwedRoomInitialState: ManageFilterBorrowedRoomProps = {
  start_date: null,
  end_date: null,
  status: null,
  floor_id: null,
  room_id: null,
};

interface BorrowedRoomState {
  start_date?: string | null;
  end_date?: string | null;
  status?: number[] | null;
  floor_id?: string | null;
  room_id?: string[] | null;

  getFilter: () => Record<string, any>;
  setFilter: (filter: ManageFilterBorrowedRoomProps) => void;
  clear: () => void;
}

export const useFilterBorrowedRoomStore = create<BorrowedRoomState>()(
  persist(
    (set, get) => ({
      ...filterBorrwedRoomInitialState,

      getFilter: () => {
        const { getFilter, setFilter, clear, status, room_id, ...rest} = get();

        return Object.fromEntries(Object.entries({
            ...rest,
            status: status?.filter((i) => !!i),
            room_id: room_id?.filter((i) => !!i),
        }).filter(([_, value]) => !!value &&
        !(Array.isArray(value) && value.length === 0)));
      },
      setFilter: (filter: ManageFilterBorrowedRoomProps) => set({...filter}),
      clear: () => set(filterBorrwedRoomInitialState),
    }),
    {
      name: "filter-borrowed-room-store",
    }
  )
);
