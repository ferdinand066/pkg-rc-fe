import { Link } from "react-router-dom";
import InputText from "../../components/forms/InputText";
import useLoginForm from "../../hooks/auth/use-login-form";

const LoginPage = () => {
  const { register, setValue, errors, handleLoginEvent, handleSubmit } =
    useLoginForm();
  return (
    <div className="my-auto w-full">
      <div className="w-full flex flex-col sm:justify-center items-center pt-6 sm:pt-0 my-auto">
        <div className="w-full sm:max-w-lg p-5 mx-auto">
          <h2 className="mb-12 text-center text-5xl font-extrabold">
            Selamat datang.
          </h2>
          <form onSubmit={handleSubmit(handleLoginEvent)} className="flex flex-col gap-2">
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
            <div className="mt-6 flex items-center justify-end">
              {/* <div className="form-control">
                <label className="label cursor-pointer">
                  <input type="checkbox" defaultChecked className="checkbox checkbox-sm checkbox-primary" />
                  <span className="ml-2 label-text">Remember me</span>
                </label>
              </div> */}
              <Link to="/auth/forgot-password" className="text-sm link link-primary link-hover">
                {" "}
                Lupa kata sandi?{" "}
              </Link>
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-primary w-full">Masuk</button>
            </div>
            <div className="mt-4 text-center">
              <Link to="/auth/register" className="text-sm link link-primary">
                Daftar akun baru
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
