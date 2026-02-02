import { useQuery } from "@tanstack/react-query";
import { ItemHistoryService } from "../../services/admin/item-history-service";

const useFetchItemHistories = (params: object, sort: object) => {
  const { data, status } = useQuery({
    queryKey: ["admin/item-history", params, sort],
    queryFn: () => ItemHistoryService.getItemHistories({
      ...params,
      ...sort,
    }),
  });

  return {
    data,
    status,
  };
};

export { useFetchItemHistories };
