import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAtom, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleToastError, handleToastSuccess } from "../../lib/functions";
import { authAtom } from "../../lib/state/auth-state";
import { removeCookie } from "../../lib/state/cookie-encrypt";
import { appThemeAtom, formLoadingStateAtom, navbarInitialLoadAtom } from "../../lib/state/state";
import { AuthService } from "../../services/general/auth-service";
import useAuth from "../general/use-auth-user";

export default function useLogout() {
  const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);
  const setNavbarInitialLoadAtom = useSetAtom(navbarInitialLoadAtom)
  const setAuth = useSetAtom(authAtom);
  const navigate = useNavigate();
  const { mutation }= useAuth();
  const queryClient = useQueryClient();

  const [theme, setTheme] = useAtom(appThemeAtom);

  async function handleLogoutEvent() {
    if (formLoading) return;

    setFormLoading(true);
    try {
      await toast.promise(AuthService.logout(), {
        pending: "Dalam proses untuk keluar!",
        error: handleToastError(),
        success: handleToastSuccess("Berhasil keluar!"),
      });

      removeCookie("token");
      setAuth(null);
      await mutation(undefined);

      delete axios.defaults.headers.common["Authorization"];

      setNavbarInitialLoadAtom(false);

      const currentTheme = theme;
      localStorage.clear();

      setTheme(currentTheme);
      queryClient.clear();
      navigate("/login");
    } catch {
      // Ignore error
    }

    setFormLoading(false);
  }

  return { handleLogoutEvent };
}
