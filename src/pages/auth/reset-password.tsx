import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import InputText from "../../components/forms/InputText";
import useResetPasswordForm from "../../hooks/auth/use-reset-password-form";
import { AuthService } from "../../services/general/auth-service";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [searchParam, _] = useSearchParams();
  const email = searchParam.get("email") ?? "";

  const { register, setValue, errors, handleResetPasswordEvent, handleSubmit } =
    useResetPasswordForm(email, token ?? "");
  
  const { data: validToken, status: tokenStatus } = useQuery({
    queryKey: ["token", token, searchParam.get("email")],
    queryFn: () => AuthService.getForgotPasswordTokenValidation(token ?? "", email),
    retry: false,
    enabled: !!token && !!email
  });

  if (tokenStatus === "pending") {
    return <></>
  }

  if (tokenStatus === "error" || !validToken){
    toast.error('Token tidak valid, harap request link ulang.');
    setTimeout(() => {
      navigate('/auth/forgot-password');
    }, 200)
    return <></>
  }

  return (
    <div className="my-auto w-full">
      <div className="w-full flex flex-col sm:justify-center items-center pt-6 sm:pt-0 my-auto">
        <div className="w-full sm:max-w-lg p-5 mx-auto">
          <h2 className="mb-12 text-center text-5xl font-extrabold">
            Atur ulang password Anda.
          </h2>
          <form onSubmit={handleSubmit(handleResetPasswordEvent)} className="flex flex-col gap-2">
            <InputText
              label={"Email"}
              type="email"
              name="email"
              register={register("email", { required: "Email harus diisi" })}
              setValue={setValue}
              placeholder="Cth: example@gmail.com"
              errors={errors}
            />
            <InputText
              label="Kata sandi"
              type="password"
              name="password"
              register={register("password", {
                required: "Kata sandi harus diisi",
              })}
              setValue={setValue}
              placeholder="Kata sandi"
              errors={errors}
            />
            <InputText
              label="Konfirmasi kata sandi"
              type="password"
              name="password_confirmation"
              register={register("password_confirmation", {
                required: "Kata sandi harus diisi",
              })}
              setValue={setValue}
              placeholder="Kata sandi"
              errors={errors}
            />
            <div className="mt-4">
              <button type="submit" className="btn btn-primary w-full">Atur Ulang Password Anda</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
