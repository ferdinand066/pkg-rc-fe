import { ClockIcon } from "@heroicons/react/outline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { useAtomValue } from "jotai";
import React, { Suspense, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authAtom } from "./lib/state/auth-state";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { appThemeAtom } from "./lib/state/state";
import useAuth from "./hooks/general/use-auth-user";
import useLogout from "./hooks/form/use-logout";

const LoadingFallback = React.lazy(() => import("./components/layout/LoadingFallback"));
const Layout = React.lazy(() => import("./components/layout/Layout"));
const ReportIndex = React.lazy(() => import("./pages/admin/report"));
const RoomIndex = React.lazy(() => import("./pages/admin/room"));
const LoginPage = React.lazy(() => import("./pages/auth/login"));
const RegisterPage = React.lazy(() => import("./pages/auth/register"));
const ScheduleIndexPage = React.lazy(() => import("./pages/schedule"));
const UserIndex = React.lazy(() => import("./pages/admin/user"));
const ShowUserPage = React.lazy(() => import("./pages/admin/user/show"));
const ItemIndex = React.lazy(() => import("./pages/admin/item"));
const UserBorrowedRoomIndex = React.lazy(() => import("./pages/user/borrowed-room"));
const ManageBorrowedRoomPage = React.lazy(() => import("./pages/user/borrowed-room/manage"));
const VerifyEmailIndex = React.lazy(() => import("./pages/verify-email"));
const PendingVerificationIndex = React.lazy(() => import("./pages/pending-verification"));
const EmailVerifierPage = React.lazy(() => import("./pages/verify-email/token"));
const ForgotPasswordPage = React.lazy(() => import("./pages/auth/forgot-password"));
const ResetPasswordPage = React.lazy(() => import("./pages/auth/reset-password"));

const queryClient = new QueryClient();

const App = () => {
  const auth = useAtomValue(authAtom);
  const theme = useAtomValue(appThemeAtom);

  const [headersSet, setHeadersSet] = useState(false);

  useEffect(() => {
    const setHeaders = async () => {
      if (auth && auth.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
      } else {
        delete axios.defaults.headers.common["Authorization"];
      }
      setHeadersSet(true);
    };

    setHeaders();
  }, [auth]);

  if (!headersSet) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <ClockIcon className="w-10 h-10 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <QueryClientProvider client={queryClient}>
        {auth ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
        <ToastContainer theme={theme}/>
      </QueryClientProvider>
    </Suspense>
  );
};

const verifyEmailPath = '/verify-email';
const pendingVerificationPath = '/pending-verification';

const AuthenticatedRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogoutEvent } = useLogout();

  useEffect(() => {
    if (location.pathname.startsWith('/auth')) {
      return navigate('/schedule');
    }

    if (!user) return;

    if (!!user.suspended_at){
      toast.error('Your account has been suspended!');
      handleLogoutEvent();
      return;
    }

    if (!user.email_verified_at){
      if (!location.pathname.startsWith(verifyEmailPath)) {
        navigate(verifyEmailPath);
      }

      return;
    }

    if (!user.account_accepted_at){
      if (!location.pathname.startsWith(pendingVerificationPath)) {
        navigate(pendingVerificationPath);
      }

      return;
    }

    if (user.email_verified_at){
      if (location.pathname.startsWith(verifyEmailPath)) {
        navigate('/schedule');
      }

      return;
    }
  }, [location.pathname, user])

  return (
    <Layout>
      <Routes>
        <Route path="schedule" element={<ScheduleIndexPage />} />
        <Route path="room-request">
          <Route path="" element={<UserBorrowedRoomIndex />}></Route>
          <Route path="create" element={<ManageBorrowedRoomPage />}></Route>
          <Route path=":id" element={<ManageBorrowedRoomPage />}></Route>
        </Route>
        <Route path="admin">
          <Route path="report" element={<ReportIndex />} />
          <Route path="room" element={<RoomIndex />} />
          <Route path="item" element={<ItemIndex />} />
          {/* <Route path="room-request" element={<BorrowedRoomIndex />} /> */}
          <Route path="user">
            <Route path="" element={<UserIndex />}></Route>
            <Route path=":id" element={<ShowUserPage />}></Route>
          </Route>
        </Route>
        <Route path="verify-email">
          <Route path="" element={<VerifyEmailIndex />}></Route>
          <Route path=":token" element={<EmailVerifierPage />}></Route>
          {/* <Route path=":id" element={<ManageBorrowedRoomPage />}></Route> */}
        </Route>
        <Route path="pending-verification" element={<PendingVerificationIndex />} />
        <Route path="*" element={<Navigate to={"schedule"}/>}/>
        {/* <Route path="/user">
          <Route path="room-request">
            <Route path="" element={<UserBorrowedRoomIndex />}></Route>
            <Route path="create" element={<ManageBorrowedRoomPage />}></Route>
            <Route path=":id" element={<ManageBorrowedRoomPage />}></Route>
          </Route>
        </Route> */}
      </Routes>
    </Layout>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.pathname.startsWith('/auth')) {
      navigate('/auth/login');
    }
  }, [location.pathname])

  return (
    <Layout>
      <Routes>
        {/* <Route path="/employee/register" element={<EmployeeRegisterPage />} /> */}
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="password/reset/:token" element={<ResetPasswordPage />} />
        </Route>
        <Route path="/verify-email">
          <Route path="" element={<VerifyEmailIndex />} />
          <Route path=":id" element={<EmailVerifierPage />} />
        </Route>
        {/*<Route path="*" element={<Navigate replace to="/employee/register" />} /> */}
      </Routes>
    </Layout>
  );
};

export default App;
