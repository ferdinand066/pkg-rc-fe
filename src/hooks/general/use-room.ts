import { useQuery } from "@tanstack/react-query";
import { RoomService } from "../../services/general/room-service";
import { isValid } from "date-fns";

type AvailibilityParam = {
  borrowing_date: string | undefined;
  borrowed_room_id?: string;
  check_schedule?: boolean;
}

const useFetchRoom = (params: object, paginate: boolean) => {
  const { data, status } = useQuery({
    queryKey: ["general/room", {
      ...params,
      paginate: paginate
    }],
    queryFn: () => RoomService.getRooms({
      ...params,
      paginate: paginate,
    }),
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
  const enabled = !!id && !!param.borrowing_date && isValid(new Date(param.borrowing_date));

  const { data, status } = useQuery({
    queryKey: ["genera/room/availibility", id, param],
    queryFn: () => RoomService.getRoomAvailability(id, param),
    enabled: enabled && (param?.check_schedule ?? false),
  });

  return {
    data,
    status,
  };
};


export { useFetchRoom, useGetOneRoom, useGetRoomAvailability };
