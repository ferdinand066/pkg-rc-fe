import { useAtom } from "jotai";
import { toast } from "react-toastify";
import { handleToastError, handleToastSuccess } from "../../lib/functions";
import { formLoadingStateAtom } from "../../lib/state/state";
import { UserService } from "../../services/general/user-service";

export default function useResendVerificationEmail() {
  const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);

  async function handleResendVerificationEmail() {
    if (formLoading) return;

    setFormLoading(true);
    try {
      await toast.promise(UserService.resendVerificationEmail(), {
        pending: "Waiting to resend verification email!",
        error: handleToastError(),
        success: handleToastSuccess(),
      });

      setFormLoading(false);
    } catch (e) {
      setFormLoading(false);
      return;
    }
  }

  return {
    handleResendVerificationEmail,
  };
}
