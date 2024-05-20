import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAtom, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleToastError, handleToastSuccess } from "../../lib/functions";
import { authAtom } from "../../lib/state/auth-state";
import { removeCookie } from "../../lib/state/cookie-encrypt";
import { formLoadingStateAtom, navbarInitialLoadAtom } from "../../lib/state/state";
import { UserService } from "../../services/general/user-service";
import useAuth from "../general/use-auth-user";

export default function useLogout() {
  const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);
  const setNavbarInitialLoadAtom = useSetAtom(navbarInitialLoadAtom)
  const setAuth = useSetAtom(authAtom);
  const navigate = useNavigate();
  const { mutation }= useAuth();
  const queryClient = useQueryClient();

  async function handleLogoutEvent() {
    if (formLoading) return;

    setFormLoading(true);
    try {
      await toast.promise(UserService.logout(), {
        pending: "Dalam proses untuk keluar!",
        error: handleToastError(),
        success: handleToastSuccess("Berhasil keluar!"),
      });

      removeCookie("token");
      setAuth(null);
      await mutation(undefined);

      delete axios.defaults.headers.common["Authorization"];

      setNavbarInitialLoadAtom(false);
      localStorage.clear();
      queryClient.clear();
      navigate("/login");
    } catch (e) {}

    setFormLoading(false);
  }

  return { handleLogoutEvent };
}
