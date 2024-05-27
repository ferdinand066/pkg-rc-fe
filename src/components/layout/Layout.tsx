import { PhoneIcon } from "@heroicons/react/outline";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useLogout from "../../hooks/form/use-logout";
import useAuth from "../../hooks/general/use-auth-user";
import { ADMIN_ROLE_INT, USER_ROLE_INT } from "../../lib/constants";
import { authAtom } from "../../lib/state/auth-state";
import { appThemeAtom, navbarInitialLoadAtom } from "../../lib/state/state";

type NavigationModel = {
  name: string;
  href: string;
  child?: NavigationModel[];
};

const Navbar = () => {
  const { user } = useAuth();
  const auth = useAtomValue(authAtom);

  const [navbarInitialLoad, setNavbarInitialLoad] = useAtom(
    navbarInitialLoadAtom
  );
  const { handleLogoutEvent } = useLogout();

  const [navigation, setNavigation] = useState<NavigationModel[]>([
    // { name: "Jadwal", href: "/schedule" },
  ]);

  useEffect(() => {
    if (!user) return;
    if (navbarInitialLoad) return;

    switch (user.role) {
      case ADMIN_ROLE_INT:
        setNavigation([
          { name: "Jadwal", href: "/schedule" },
          {
            name: "Proposal",
            href: "/room-request",
          },
          {
            name: "Admin",
            href: "/admin",
            child: [
              { name: "Ruangan", href: "/room" },
              { name: "Barang", href: "/item" },
              { name: "User", href: "/user" },
            ],
          },
        ]);
        break;
      case USER_ROLE_INT:
        setNavigation([
          { name: "Jadwal", href: "/schedule" },
          {
            name: "Proposal",
            href: "/room-request",
          },
        ]);
        break;
      default:
        break;
    }
    setNavbarInitialLoad(true);
  }, [user]);

  return (
    <div className="bg-base-100 w-full flex items-center justify-center shadow-sm z-[100]">
      <div className="navbar max-w-7xl">
        <div className="flex-1">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[10] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {navigation.map((nav) => {
                if (!nav.child) {
                  return (
                    <li key={nav.href}>
                      <Link to={nav.href}>{nav.name}</Link>
                    </li>
                  );
                }
                return (
                  <li key={nav.href}>
                    <span>{nav.name}</span>
                    <ul className="p-2 z-[10]">
                      {nav.child.map((child) => (
                        <li key={child.href}>
                          <Link to={nav.href + child.href}>{child.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
              {auth ? (
                <li className="sm:hidden">
                  <Link to={"/auth/logout"}>Logout</Link>
                </li>
              ) : (
                <>
                  <li className="sm:hidden">
                    <Link to={"/auth/login"}>Login</Link>
                  </li>
                  <li className="sm:hidden">
                    <Link to={"/auth/register"}>Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <Link to={"/schedule"} className="btn btn-ghost text-xl">
            PKG RC
          </Link>
          <ul className="menu menu-horizontal px-1 hidden lg:flex">
            {navigation.map((nav) => {
              if (!nav.child) {
                return (
                  <li key={nav.href}>
                    <Link to={nav.href}>{nav.name}</Link>
                  </li>
                );
              }

              return (
                <li key={nav.href}>
                  <details>
                    <summary>{nav.name}</summary>
                    <ul className="p-2 w-48">
                      {nav.child.map((child) => (
                        <li key={child.href}>
                          <Link to={nav.href + child.href}>{child.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              );
            })}
          </ul>
        </div>
        {auth ? (
          <div className="flex-none flex flex-row gap-4">
            <ThemeToggle />
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="navbar-right hidden sm:flex">
            <ThemeToggle />
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link to="/auth/login">Login</Link>
              </li>
              <li>
                <Link to="/auth/register">Register</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const ThemeToggle = () => {
  const setTheme = useSetAtom(appThemeAtom);

  return (
    <label className="swap swap-rotate">
      <input
        type="checkbox"
        className="theme-controller hidden"
        value="dark"
        onChange={(e) => setTheme((_) => (e.target.checked ? "drakula" : "cupcake"))}
      />
      <svg
        className="swap-off fill-current w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
      </svg>
      <svg
        className="swap-on fill-current w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
      </svg>
    </label>
  );
};

const PageContainer = ({ children }: any) => {
  return (
    <div className="flex flex-col justify-center flex-1 max-w-7xl mx-auto w-full">
      {children}
    </div>
  );
};

const Footer = () => {
  return (
    <div className="flex flex-row justify-center bg-base-100 text-base-content mt-auto shadow-sm">
      <footer className="footer items-center py-4 sm:py-8 max-w-7xl px-6 gap-4 sm:gap-6">
        <aside className="items-center grid-flow-col">
          <p>PKG RC © {new Date().getFullYear()} - All right reserved</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a href="https://wa.me/6281912121230?text=Mau+tanya+tentang+ruangan+di+RC">
            <PhoneIcon className="w-5 h-5" />
          </a>
          {/* <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
    </a>
    <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg></a>
    <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg></a> */}
        </nav>
      </footer>
    </div>
  );
};

const Layout = ({ children }: any) => {
  const theme = useAtomValue(appThemeAtom);
  return (
    <div data-theme={theme} className="flex flex-col min-h-screen bg-base-200">
      <Navbar />
      <PageContainer>{children}</PageContainer>
      <Footer />
    </div>
  );
};

// const ShowImageDialog = () => {
//   const [imageUrl, setImageUrl] = useAtom(previewImageUrlAtom)
//   return imageUrl ? <div className="fixed w-screen h-screen bg-black/50 inset-0 z-50">
//     <div className="relative w-full h-full">
//       <img
//           src={imageUrl}
//           alt={"Image Detail"}
//           className="object-contain w-full h-full rounded-lg p-4 sm:p-36"
//         />
//       <button
//         className="absolute top-2 right-2 text-white hover:text-gray-200 p-2 rounded-full focus:outline-none cursor-pointer"
//         onClick={() => {
//           setImageUrl("")
//         }}
//       >
//         <XIcon className="w-6 h-6" />
//       </button>
//     </div>
//   </div> : <></>
// }

export default Layout;
