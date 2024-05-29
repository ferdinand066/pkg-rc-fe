// import { handleToastError, handleToastSuccess } from "@/lib/functions/utils";
// import { formLoadingStateAtom } from "@/lib/state/global";
// import { AuthService } from "@/services/auth-service";
// import { useAtom } from "jotai";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";

// type ForgotPasswordProps = {
//   email: string;
// }

// export default function useForgotPasswordForm(){
//   const { register, setValue, formState: { errors }, handleSubmit } = useForm<ForgotPasswordProps>();
//   const [formLoading, setFormLoading] = useAtom(formLoadingStateAtom);

//   async function handleForgotPasswordEvent(data: ForgotPasswordProps){
//     if (formLoading) return;

//     setFormLoading(true);
//     try {
//       await toast.promise(AuthService.forgotPassword(data), {
//         pending: 'Waiting to send reset password link!',
//         error: handleToastError(),
//         success: handleToastSuccess(),
//       });
      
//     } catch (e) { 

//     }

//     setFormLoading(false);
//   }

//   return {
//     register,
//     setValue,
//     errors,
//     handleForgotPasswordEvent,
//     handleSubmit
//   }
// }