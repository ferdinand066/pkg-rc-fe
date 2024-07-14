import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/general/use-auth-user";
import { handleToastError, handleToastSuccess } from "../../lib/functions";
import { UserModel } from "../../model/entities/user";
import { AuthService } from "../../services/general/auth-service";

const EmailVerifierPage = () => {
  const { mutation } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams();
  const [searchParams, _] = useSearchParams();

  useEffect(() => {
    async function verifyEmail(){
      const expires = searchParams.get('expires');
      const hash = searchParams.get('hash');
      const signature = searchParams.get('signature');

      try {
        const data = await toast.promise(AuthService.emailVerificationConfirmation(token as string, {
          expires,
          hash,
          signature,
        }), {
          pending: 'Waiting to verify email!',
          error: handleToastError(),
          success: handleToastSuccess(),
        });
  
        const user = data.data.user as UserModel;
        await mutation(user);

        console.log('after mutation');

        navigate('/schedule');
      } catch (e) {
        console.log(e);
      }
    }
    
    verifyEmail();
  }, []);

  return (
    <section className="flex flex-col h-full flex-1 gap-4">
      <div className="px-6">
        <div className="max-w-7xl p-8 shadow-lg rounded-lg mx-auto flex flex-col gap-4">
          <div>Verifying email...</div>
        </div>
      </div>
    </section>
  );
};

export default EmailVerifierPage;
