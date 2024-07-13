import PageHeader from "../../components/layout/PageHeader";
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
            We have sent a verification link to{" "}
            <span className="font-extrabold text-primary">{user?.email}</span>.
            If you cannot find the email verification mail in the Index folder,
            please check the{" "}
            <span className="font-extrabold text-primary">Junk / Spam</span>{" "}
            folder
          </div>
          <div>
            If you did not receive the{" "}
            <span className="font-extrabold text-primary">
              email verification
            </span>{" "}
            mail, please click on the resend button.
          </div>
          <div className="flex flex-row justify-center">
          <button onClick={() => handleResendVerificationEmail()} className="btn btn-primary max-w-xs w-full" type="button">
            Resend Verification Mail
          </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmailIndex;
