import { useAtom, useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { formLoadingStateAtom } from "../../lib/state/state";
import { TokenData, authAtom } from "../../lib/state/auth-state";
import { useNavigate } from "react-router-dom";
import { UserService } from "../../services/general/user-service";
import { handleToastError, handleToastSuccess } from "../../lib/functions";
import { setEncryptedCookie } from "../../lib/state/cookie-encrypt";
import axios from "axios";

type LoginProps = {
  email: string;
  password: string;
}

export default function useLoginForm() {
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginProps>();
  const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);
  const setAuth = useSetAtom(authAtom);
  const navigate = useNavigate();

  async function handleLoginEvent(data: LoginProps) {
    if (formLoading) return;

    setFormLoading(true);
    try {
      localStorage.clear();
      const { data: res } = await toast.promise(UserService.login(data), {
        pending: "Dalam proses login!",
        error: handleToastError(),
        success: handleToastSuccess(),
      });

      const tokenData: TokenData = {
        token: res.token,
        expiresAt: res.expires_in,
        roleId: res.user.role,
      };

      setEncryptedCookie("token", tokenData, res.expiresAt);
      setAuth(tokenData);

      axios.defaults.headers.common["Authorization"] = `Bearer ${res.token}`;

      navigate("/schedule");
    } catch (e) {}

    setFormLoading(false);
  }

  return {
    register,
    setValue,
    errors,
    handleLoginEvent,
    handleSubmit,
  };
}