import { Link } from "react-router-dom";
import useRegisterForm from "../../hooks/auth/use-register-form";
import InputText from "../../components/forms/InputText";
import InputTextarea from "../../components/forms/InputTextarea";

const RegisterPage = () => {
  const {
    register,
    setValue,
    errors,
    handleRegisterEvent,
    handleSubmit,
  } = useRegisterForm();

  return (
    <div className="my-auto w-full">
      <div className="w-full flex flex-col sm:justify-center items-center pt-6 sm:pt-0 my-auto">
        <div className="w-full sm:max-w-lg p-5 mx-auto">
          <h2 className="mb-12 text-center text-5xl font-extrabold">
            Daftar
          </h2>
          <form onSubmit={handleSubmit(handleRegisterEvent)}>
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
              label={"Nama lengkap"}
              type="text"
              name="name"
              register={register("name", { required: "Nama harus diisi" })}
              setValue={setValue}
              placeholder="Cth: John Doe"
              errors={errors}
            />
            <InputText
              label={"Kata sandi"}
              type="password"
              name="password"
              register={register("password", { required: "Kata sandi harus diisi" })}
              setValue={setValue}
              placeholder="Kata sandi"
              errors={errors}
            />
            <InputText
              label={"Konfirmasi kata sandi"}
              type="password"
              name="password_confirmation"
              register={register("password_confirmation", { required: "Konfirmasi kata sandi harus diisi" })}
              setValue={setValue}
              placeholder="Konfirmasi kata sandi"
              errors={errors}
            />
            <InputTextarea
              label={"Alamat"}
              name="address"
              register={register("address", { required: "Alamat harus diisi" })}
              setValue={setValue}
              placeholder="Alamat harus diisi"
              errors={errors}
            />
            <div className="mt-6">
              <button type="submit" className="btn btn-primary w-full">Daftar</button>
            </div>
            <div className="mt-6 text-center">
              <Link to="/auth/login" className="text-sm link link-primary">
                Masuk dengan akun anda
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
