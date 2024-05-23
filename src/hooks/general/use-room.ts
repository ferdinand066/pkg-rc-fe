import { useQuery } from "@tanstack/react-query";
import { RoomService } from "../../services/general/room-service";

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


export { useFetchRoom, useGetOneRoom };
