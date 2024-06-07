import { useQuery } from "@tanstack/react-query";
import { RoomService } from "../../services/general/room-service";
import { isValid } from "date-fns";

type AvailibilityParam = {
  borrowing_date: string | undefined;
  borrowed_room_id?: string
}

const useFetchRoom = (params: object) => {
  const { data, status } = useQuery({
    queryKey: ["general/room", params],
    queryFn: () => RoomService.getRooms(params),
  });

  return {
    data,
    status,
  };
};

const useGetOneRoom = (id: string) => {
  const { data, status } = useQuery({
    queryKey: ["general/room", id],
    queryFn: () => RoomService.getOneRoom(id),
    enabled: !!id,
  });

  return {
    data,
    status,
  };
};

const useGetRoomAvailability = (id: string, param: AvailibilityParam) => {
  console.log(param);
  const { data, status } = useQuery({
    queryKey: ["genera/room/availibility", id, param],
    queryFn: () => RoomService.getRoomAvailability(id, param),
    enabled: !!id && !!param.borrowing_date && isValid(new Date(param.borrowing_date)),
  });

  return {
    data,
    status,
  };
};


export { useFetchRoom, useGetOneRoom, useGetRoomAvailability };
