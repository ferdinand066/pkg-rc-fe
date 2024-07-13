import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/general/use-auth-user";

const EmailVerifierPage = () => {
  const { mutation } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    console.log(token);
  }, [token]);

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
