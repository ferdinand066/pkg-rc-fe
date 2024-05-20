import useSWR, { mutate } from "swr";
import { UserService } from "../../services/general/user-service";
import { UserModel } from "../../model/entities/user";

const useAuth = () => {
  const { data: user, error } = useSWR(`/api/me`, () => UserService.me());

  // const role = ["hrd-user", "hrd-hq"].includes(user?.role?.name?.toLowerCase() ?? '')
  //   ? "hr"
  //   : user?.role.name.toLowerCase();
  
  const mutation = async (data: UserModel | undefined) => {
    const updatedUser = data;
    await mutate(`/api/me`, updatedUser, false);
  };

  return {
    user,
    // role,
    error,
    mutation,
  };
};

export default useAuth;
