import { useQuery } from "@tanstack/react-query";
import { BorrowedRoomService } from "../../services/general/borrowed-room-service";

const useFetchBorrowedRoom = (params: object, sort: object) => {
  const { data, status } = useQuery({
    queryKey: ["general/borrowed-room", {
      ...params,
      paginate: true,
    }, sort],
    queryFn: () => BorrowedRoomService.getBorrowedRooms({
      ...params,
      ...sort,
      paginate: true,
    }),
    // placeholderData: (previousData, _) => previousData || undefined,
  });

  return {
    data,
    status,
  };
};

const useGetOneBorrowedRoom = (id: string) => {
  const { data, status } = useQuery({
    queryKey: ["general/borrowed-room", id],
    queryFn: () => BorrowedRoomService.getOneBorrowedRoom(id),
    enabled: !!id,
  });

  return {
    data,
    status,
  };
};


export { useFetchBorrowedRoom, useGetOneBorrowedRoom };
