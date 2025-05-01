import { useQuery } from "@tanstack/react-query";
import { UserService } from "../../services/admin/user-service";

const useFetchUser = (params: object, sort: object) => {
  const { data, status } = useQuery({
    queryKey: ["admin/user", params, sort],
    queryFn: () => UserService.getUsers({
      ...params,
      ...sort,
    }),
  });

  return {
    data,
    status,
  };
};

const useGetOneUser = (id: string) => {
  const { data, status } = useQuery({
    queryKey: ["admin/user", id],
    queryFn: () => UserService.getOneUser(id),
    enabled: !!id,
    retry: false,
  });

  return {
    data,
    status,
  };
};


export { useFetchUser, useGetOneUser };
