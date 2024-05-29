// import { handleToastError, handleToastSuccess } from "@/lib/functions/utils";
// import { formLoadingStateAtom } from "@/lib/state/global";
// import { AuthService } from "@/services/auth-service";
// import { useAtom } from "jotai";
// import { toast } from "react-toastify";

// export default function useResendVerificationEmail() {
//   const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);

//   async function handleResendVerificationEmail() {
//     if (formLoading) return;

//     setFormLoading(true);
//     try {
//       await toast.promise(AuthService.resendVerificationEmail(), {
//         pending: "Waiting to resend verification email!",
//         error: handleToastError(),
//         success: handleToastSuccess(),
//       });

//       setFormLoading(false);
//     } catch (e) {
//       setFormLoading(false);
//       return;
//     }
//   }

//   return {
//     handleResendVerificationEmail,
//   };
// }
