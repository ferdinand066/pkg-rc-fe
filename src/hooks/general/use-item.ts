import { useQuery } from "@tanstack/react-query";
import { ItemService } from "../../services/general/item-service";

const useFetchItem = (params: object, sort: object, paginate: boolean = false) => {
  const { data, status } = useQuery({
    queryKey: ["general/item", {
      ...params,
      paginate: paginate,
    }, sort],
    queryFn: () => ItemService.getItems({
      ...params,
      ...sort,
      paginate: paginate,
    }),
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
