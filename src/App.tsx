import { ClockIcon } from "@heroicons/react/outline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { useAtomValue } from "jotai";
import { Suspense, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingFallback from "./components/layout/LoadingFallback";
import { authAtom } from "./lib/state/auth-state";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import RoomIndex from "./pages/admin/room";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ScheduleIndexPage from "./pages/schedule";
import UserIndex from "./pages/admin/user";
import UserShow from "./pages/admin/user/show";
import ItemIndex from "./pages/admin/item";
import BorrowedRoomIndex from "./pages/admin/borrowed-room";
import UserBorrowedRoomIndex from "./pages/user/borrowed-room";
import ManageBorrowedRoomPage from "./pages/user/borrowed-room/manage";

const queryClient = new QueryClient();

const App = () => {
  const auth = useAtomValue(authAtom);
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
        <ToastContainer />
      </QueryClientProvider>
    </Suspense>
  );
};

const AuthenticatedRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.startsWith('/auth')) {
      navigate('/schedule');
    }
  }, [location.pathname])

  return (
    <Layout>
      <Routes>
        <Route path="/schedule" element={<ScheduleIndexPage />} />
        <Route path="/admin">
          <Route path="room" element={<RoomIndex />} />
          <Route path="item" element={<ItemIndex />} />
          <Route path="room-request" element={<BorrowedRoomIndex />} />
          <Route path="user">
            <Route path="" element={<UserIndex />}></Route>
            <Route path=":id" element={<UserShow />}></Route>
          </Route>
        </Route>
        <Route path="/user">
          <Route path="room-request">
            <Route path="" element={<UserBorrowedRoomIndex />}></Route>
            <Route path="create" element={<ManageBorrowedRoomPage />}></Route>
            <Route path=":id" element={<ManageBorrowedRoomPage />}></Route>
          </Route>
        </Route>
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
        </Route>
        {/*<Route path="*" element={<Navigate replace to="/employee/register" />} /> */}
      </Routes>
    </Layout>
  );
};

export default App;
