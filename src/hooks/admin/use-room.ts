import { useQuery } from "@tanstack/react-query";
import { RoomService } from "../../services/admin/room-service";
import { UserService } from "../../services/admin/user-service";

const useFetchRoom = (params: object) => {
  const { data, status } = useQuery({
    queryKey: ["admin/room", params],
    queryFn: () => RoomService.getRooms(params),
  });

  return {
    data,
    status,
  };
};

const useGetOneRoom = (id: string) => {
  const { data, status } = useQuery({
    queryKey: ["admin/user", id],
    queryFn: () => UserService.getOneUser(id),
    enabled: !!id,
  });

  return {
    data,
    status,
  };
};


export { useFetchRoom, useGetOneRoom };
