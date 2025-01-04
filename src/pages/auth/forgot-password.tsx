import { Link } from "react-router-dom";
import InputText from "../../components/forms/InputText";
import useForgotPasswordForm from "../../hooks/auth/use-forgot-password-form";

const ForgotPasswordPage = () => {
  const { register, setValue, errors, handleForgotPasswordEvent, handleSubmit } =
    useForgotPasswordForm();
  return (
    <div className="my-auto w-full">
      <div className="w-full flex flex-col sm:justify-center items-center pt-6 sm:pt-0 my-auto">
        <div className="w-full sm:max-w-lg p-5 mx-auto">
          <h2 className="mb-12 text-center text-5xl font-extrabold">
            Lupa Password.
          </h2>
          <form onSubmit={handleSubmit(handleForgotPasswordEvent)} className="flex flex-col gap-2">
            <InputText
              label={"Email"}
              type="email"
              name="email"
              register={register("email", { required: "Email harus diisi" })}
              setValue={setValue}
              placeholder="Cth: example@gmail.com"
              errors={errors}
            />
            <div className="mt-6 flex items-center justify-end">
              <Link to="/auth/login" className="text-sm link link-primary link-hover">
                Kembali ke Login
              </Link>
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-primary w-full">Kirim Link Reset Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
