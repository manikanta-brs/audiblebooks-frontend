// import { useEffect } from "react";
// import { useGetUserProfileAPIQuery } from "../../store/user/userApiSlice"; // Adjust the import path
// import { useDispatch, useSelector } from "react-redux";
// import { setUserProfile } from "../../store/user/authSlice";

// const ProfileLoader = ({ children }) => {
//   const dispatch = useDispatch();
//   const { isLoggedIn, isAuthorLogin } = useSelector((state) => state.auth);
//   const { data: userProfile, isSuccess } = useGetUserProfileAPIQuery(
//     undefined,
//     {
//       skip: !isLoggedIn,
//     }
//   );

//   useEffect(() => {
//     if (isSuccess && userProfile) {
//       localStorage.setItem("profile", JSON.stringify(userProfile));
//       console.log("Setting user profile:", userProfile);
//       dispatch(setUserProfile(userProfile));
//     }
//   }, [dispatch, userProfile, isSuccess]);

//   return <>{children}</>;
// };

// export default ProfileLoader;
