import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { formLoadingStateAtom } from "../../lib/state/state";
import { useFetchFloor } from "./use-floor";
import { useFetchRoom } from "./use-room";
import { filterBorrwedRoomInitialState, useFilterBorrowedRoomStore } from "../../pages/user/borrowed-room/components/use-filter-borrowed-room-store";
import { RoomModel } from "../../model/entities/room";

export type ManageFilterBorrowedRoomProps = {
  start_date?: string | null;
  end_date?: string | null;
  status?: number[] | null;
  floor_id?: string | null;
  room_id?: string[] | null;
};

const useFilterBorrowedRoom = () => {
  const { getFilter, setFilter } = useFilterBorrowedRoomStore();
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
    formState,
  } = useForm<ManageFilterBorrowedRoomProps>({
    defaultValues: getFilter(),
  });

  const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);
  const queryClient = useQueryClient();

  const { data: floors, status: floorStatus } = useFetchFloor({
    order_by: "name",
    data_order: "asc",
  });

  const { data: rooms, status: roomStatus } = useFetchRoom<RoomModel[]>(
    {},
    {
      order_by: "name",
      data_order: "asc",
      floor_id: getValues("floor_id"),
    },
    false,
    !!getValues("floor_id")
  );

  async function handleFilterBorrowedRoom(data: ManageFilterBorrowedRoomProps) {
    // if (!role) return;
    if (formLoading) return;

    setFormLoading(true);
    setFilter(data);

    queryClient.invalidateQueries({ queryKey: ["general/borrowed-room"] });
    
    setFormLoading(false);
  }

  const resetFilter = () => {
    reset(filterBorrwedRoomInitialState);
    setFilter(filterBorrwedRoomInitialState);
  }

  return {
    register,
    setValue,
    errors,
    handleSubmit,
    watch,
    getValues,
    formState,
    resetFilter,
    reset,

    handleFilterBorrowedRoom,
    floors,
    floorStatus,
    rooms,
    roomStatus,
  };
};

export default useFilterBorrowedRoom;
