import axios from "axios";
import { useAtom, useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleToastError, handleToastSuccess } from "../../lib/functions";
import { TokenData, authAtom } from "../../lib/state/auth-state";
import { setEncryptedCookie } from "../../lib/state/cookie-encrypt";
import { appThemeAtom, formLoadingStateAtom } from "../../lib/state/state";
import { AuthService } from "../../services/general/auth-service";

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
  const [theme, setTheme] = useAtom(appThemeAtom);

  const setAuth = useSetAtom(authAtom);
  const navigate = useNavigate();

  async function handleLoginEvent(data: LoginProps) {
    if (formLoading) return;

    setFormLoading(true);
    try {
      const currentTheem = theme;
      localStorage.clear();

      setTheme(currentTheem);
      const { data: res } = await toast.promise(AuthService.login(data), {
        pending: "Dalam proses login!",
        error: handleToastError(),
        success: handleToastSuccess(),
      });

      const tokenData: TokenData = {
        token: res.token,
        expiresAt: "" + res.expires_in,
        roleId: "" + res.user.role,
      };

      setEncryptedCookie("token", tokenData, "" + tokenData.expiresAt);
      setAuth(tokenData);

      axios.defaults.headers.common["Authorization"] = `Bearer ${res.token}`;

      navigate("/schedule");
    } catch {
      // Ignore error
    }

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