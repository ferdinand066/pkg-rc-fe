import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleToastError, handleToastSuccess } from "../../lib/functions";
import { formLoadingStateAtom } from "../../lib/state/state";
import { AuthService } from "../../services/general/auth-service";

type RegisterProps = {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
  address: string;
}

export default function useRegisterForm() {
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<RegisterProps>();
  const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);
  const navigate = useNavigate();

  async function handleRegisterEvent(data: RegisterProps) {
    if (formLoading) return;

    setFormLoading(true);
    try {
      localStorage.clear();
      await toast.promise(AuthService.register(data), {
        pending: "Dalam proses pendaftaran!",
        error: handleToastError(),
        success: handleToastSuccess(),
      });

      navigate("/auth/login");
    } catch (e) {}

    setFormLoading(false);
  }

  return {
    register,
    setValue,
    errors,
    handleRegisterEvent,
    handleSubmit,
    watch,
  };
}