import useSWR, { mutate } from "swr";
import { UserModel } from "../../model/entities/user";
import { AuthService } from "../../services/general/auth-service";

const useAuth = () => {
  const { data: user, error } = useSWR(`/api/me`, () => AuthService.me());

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
