import PageHeader from "../../components/layout/page-header";
import useResendVerificationEmail from "../../hooks/auth/use-verification-email";
import useAuth from "../../hooks/general/use-auth-user";

const VerifyEmailIndex = () => {
  const { user } = useAuth();
  const { handleResendVerificationEmail } = useResendVerificationEmail();

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <PageHeader pageName="Verify Your Email" />
      <div className="px-6">
        <div className="max-w-7xl p-8 shadow-lg rounded-lg mx-auto flex flex-col gap-4">
          <div>
            Kami telah mengirimkan link verifikasi ke{" "}
            <span className="font-extrabold text-primary">{user?.email}</span>.
            Bila tidak menemukan email verifikasi dalam folder Index,
            harap cek folder{" "}
            <span className="font-extrabold text-primary">Junk / Spam</span>
          </div>
          <div>
            Jika tidak menerima{" "}
            <span className="font-extrabold text-primary">
              email verifikasi
            </span>{" "}
            , dapat menekan tombol kirim kembali.
          </div>
          <div className="flex flex-row justify-center">
          <button onClick={() => handleResendVerificationEmail()} className="btn btn-primary max-w-xs w-full" type="button">
            Kirim Kembail Email Verifikasi
          </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmailIndex;
