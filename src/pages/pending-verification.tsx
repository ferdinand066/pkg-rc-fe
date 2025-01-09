
import PageHeader from "../components/layout/PageHeader";
import useAuth from "../hooks/general/use-auth-user";

const PendingVerificationIndex = () => {
  const { user } = useAuth();
//   const { handleResendVerificationEmail } = useResendVerificationEmail();

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <PageHeader pageName="Akun Tidak Terverifikasi" />
      <div className="px-6">
        <div className="max-w-7xl p-8 shadow-lg rounded-lg mx-auto flex flex-col gap-4">
          <div>
            Email anda (<span className="font-extrabold text-primary">{user?.email}</span>) belum diverifikasi oleh admin. Harap kontak admin agar akun anda diverifikasi lebih lanjut.
          </div>
        </div>
      </div>
    </section>
  );
};

export default PendingVerificationIndex;
