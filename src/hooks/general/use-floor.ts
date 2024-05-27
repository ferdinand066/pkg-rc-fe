import { useQuery } from "@tanstack/react-query";
import { FloorService } from "../../services/general/floor-service";

const useFetchFloor = (params: object) => {
  const { data, status } = useQuery({
    queryKey: ["general/floor", params],
    queryFn: () => FloorService.getFloors(params),
  });

  return {
    data,
    status,
  };
};

const useGetOneFloor = (id: string) => {
  const { data, status } = useQuery({
    queryKey: ["general/floor", id],
    queryFn: () => FloorService.getOneFloor(id),
    enabled: !!id,
  });

  return {
    data,
    status,
  };
};


export { useFetchFloor, useGetOneFloor };
