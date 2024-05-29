
// export default function useAuthorization(allowedRoles: number){
//   const { user } = useUser();

//   // const router = useRouter();
//   const errorHandledRef = useRef(false);
  
//   // Redirect to login page if user is not authenticated
//   if (status === "unauthenticated") {
//     // router.replace("/auth");
//     return false;
//   }

//   // Redirect to unauthorized page if user does not have required role or permissions
//   if (user && user.role < allowedRoles){
//     if (!errorHandledRef.current){
//       toast.error('Unauthorized!');
//       errorHandledRef.current = true;
//       // router.replace("/");
//     }
//     return false;
//   }

//   return true;
// }