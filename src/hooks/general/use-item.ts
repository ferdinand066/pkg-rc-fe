import { useQuery } from "@tanstack/react-query";
import { ItemService } from "../../services/general/item-service";

const useFetchItem = (params: object) => {
  const { data, status } = useQuery({
    queryKey: ["general/item", params],
    queryFn: () => ItemService.getItems(params),
  });

  return {
    data,
    status,
  };
};

const useGetOneItem = (id: string) => {
  const { data, status } = useQuery({
    queryKey: ["general/item", id],
    queryFn: () => ItemService.getOneItem(id),
    enabled: !!id,
  });

  return {
    data,
    status,
  };
};


export { useFetchItem, useGetOneItem };
