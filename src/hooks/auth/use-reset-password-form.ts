import { handleToastError, handleToastSuccess } from "@/lib/functions/utils";
import { formLoadingStateAtom } from "@/lib/state/global";
import { ResetPasswordPageProps } from "@/pages/auth/password/reset/[token]";
import { AuthService } from "@/services/auth-service";
import { useAtom } from "jotai";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type ResetPasswordProps = {
  email: string;
  token: string;
  password: string;
  password_confirmation: string
}

export default function useResetPasswordForm({ email, token }: ResetPasswordPageProps){
  const router = useRouter();
  const { register, setValue, formState: { errors }, handleSubmit, getValues } = useForm<ResetPasswordProps>({
    defaultValues: {
      email: email, 
      token: token,
    }
  });
  const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);

  async function handleResetPasswordEvent(data: ResetPasswordProps){
    if (formLoading) return;

    setFormLoading(true);
    try {
      await toast.promise(AuthService.resetPassword(data), {
        pending: 'Waiting to reset password!',
        error: handleToastError(),
        success: handleToastSuccess(),
      });
      
      setFormLoading(false);
    } catch (e) { 
      setFormLoading(false);
      return;
    }

    router.push('/auth');

  }

  return {
    register,
    setValue,
    errors,
    handleResetPasswordEvent,
    handleSubmit,
    getValues,
  }
}