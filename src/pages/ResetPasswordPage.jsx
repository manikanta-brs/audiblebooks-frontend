// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useResetUserPasswordAPIMutation } from "../store/user/userApiSlice";
// import { useResetAuthorPasswordAPIMutation } from "../store/user/authorApiSlice";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import { login } from "../store/user/authSlice";

// const validationSchema = Yup.object().shape({
//   password: Yup.string()
//     .required("Password is required")
//     .min(6, "Password must be at least 6 characters")
//     .max(40, "Password must not exceed 40 characters"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password"), null], "Passwords must match")
//     .required("Confirm Password is required"),
// });

// const ResetPasswordPage = ({ isAuthor }) => {
//   // get isLoggedIn from state using useSelector
//   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
//   // navigate to home if isLoggedIn is true

//   const { token } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   useEffect(() => {
//     if (isLoggedIn) {
//       navigate("/home"); // Redirect to the home page
//     }
//   }, [isLoggedIn, navigate]);
//   const [resetUserPassword] = useResetUserPasswordAPIMutation();
//   const [resetAuthorPassword] = useResetAuthorPasswordAPIMutation();
//   const [showPassword, setShowPassword] = useState(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     setSubmitting(true);
//     try {
//       const result = isAuthor
//         ? await resetAuthorPassword({
//             token,
//             password: values.password,
//           }).unwrap()
//         : await resetUserPassword({
//             token,
//             password: values.password,
//           }).unwrap();

//       console.log("Success Ayyindi mawa 😊", result);
//       toast.success("Password reset successful! Redirecting to login...");
//       resetForm();

//       // Dispatch the login action with the new token
//       dispatch(login(result));

//       setTimeout(() => {
//         navigate("/"); // Redirect to home page after successful reset
//       }, 2000); // Delay for 2 seconds
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error(error.data?.message || "Something went wrong.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black py-12 flex justify-center items-center">
//       <div className="relative sm:max-w-lg w-full bg-gradient-to-l from-green-300 to-blue-200 p-8 rounded-3xl shadow-lg shadow-white-shadow overflow-hidden">
//         <div className="absolute inset-0 bg-white bg-opacity-40 backdrop-blur-lg rounded-3xl z-0"></div>
//         <div className="relative z-10">
//           <div className="text-center mb-6">
//             <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
//               AudibleBooks
//             </h2>
//             <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
//               Reset Password ({isAuthor ? "Author" : "User"})
//             </h2>
//             <p className="text-gray-700 text-sm">Enter your new password.</p>
//           </div>

//           <Formik
//             initialValues={{ password: "", confirmPassword: "" }}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ isSubmitting }) => (
//               <Form>
//                 <div className="mb-6 relative">
//                   <label
//                     htmlFor="password"
//                     className="block text-sm font-semibold text-gray-800 mb-1"
//                   >
//                     New Password
//                   </label>
//                   <div className="relative">
//                     <Field
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       placeholder="••••••••"
//                       className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 leading-5 text-sm"
//                       autoComplete="new-password"
//                     />
//                     <div
//                       className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
//                       onClick={togglePasswordVisibility}
//                     >
//                       <FontAwesomeIcon
//                         icon={showPassword ? faEye : faEyeSlash}
//                         className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors duration-200"
//                       />
//                     </div>
//                   </div>
//                   <ErrorMessage
//                     name="password"
//                     component="div"
//                     className="text-red-500 text-xs mt-1"
//                   />
//                 </div>

//                 <div className="mb-6 relative">
//                   <label
//                     htmlFor="confirmPassword"
//                     className="block text-sm font-semibold text-gray-800 mb-1"
//                   >
//                     Confirm New Password
//                   </label>
//                   <div className="relative">
//                     <Field
//                       type={showPassword ? "text" : "password"}
//                       name="confirmPassword"
//                       placeholder="••••••••"
//                       className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 leading-5 text-sm"
//                       autoComplete="new-password"
//                     />
//                     <div
//                       className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
//                       onClick={togglePasswordVisibility}
//                     >
//                       <FontAwesomeIcon
//                         icon={showPassword ? faEye : faEyeSlash}
//                         className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors duration-200"
//                       />
//                     </div>
//                   </div>
//                   <ErrorMessage
//                     name="confirmPassword"
//                     component="div"
//                     className="text-red-500 text-xs mt-1"
//                   />
//                 </div>

//                 <div>
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-48 px-4 py-2 rounded-md shadow-md text-white font-semibold bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-300 text-sm mx-auto block"
//                   >
//                     {isSubmitting ? "Resetting..." : "Reset Password"}
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordPage;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResetUserPasswordAPIMutation } from "../store/user/userApiSlice";
import { useResetAuthorPasswordAPIMutation } from "../store/user/authorApiSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
//import { login } from "../store/user/authSlice"; // Remove import

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(40, "Password must not exceed 40 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const ResetPasswordPage = ({ isAuthor }) => {
  // get isLoggedIn from state using useSelector
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // navigate to home if isLoggedIn is true

  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home"); // Redirect to the home page
    }
  }, [isLoggedIn, navigate]);
  const [resetUserPassword] = useResetUserPasswordAPIMutation();
  const [resetAuthorPassword] = useResetAuthorPasswordAPIMutation();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const result = isAuthor
        ? await resetAuthorPassword({
            token,
            password: values.password,
          }).unwrap()
        : await resetUserPassword({
            token,
            password: values.password,
          }).unwrap();

      console.log("Success Ayyindi mawa 😊", result);
      toast.success("Password reset successful! Redirecting to login...");
      resetForm();

      // **Remove this dispatch.  Don't log in after reset**
      // dispatch(login(result));

      setTimeout(() => {
        navigate("/"); // Redirect to login page (usually root)
      }, 2000); // Delay for 2 seconds
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 flex justify-center items-center">
      <div className="relative sm:max-w-lg w-full bg-gradient-to-l from-green-300 to-blue-200 p-8 rounded-3xl shadow-lg shadow-white-shadow overflow-hidden">
        <div className="absolute inset-0 bg-white bg-opacity-40 backdrop-blur-lg rounded-3xl z-0"></div>
        <div className="relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
              AudibleBooks
            </h2>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
              Reset Password ({isAuthor ? "Author" : "User"})
            </h2>
            <p className="text-gray-700 text-sm">Enter your new password.</p>
          </div>

          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-6 relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-800 mb-1"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 leading-5 text-sm"
                      autoComplete="new-password"
                    />
                    <div
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      />
                    </div>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="mb-6 relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-800 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 leading-5 text-sm"
                      autoComplete="new-password"
                    />
                    <div
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      />
                    </div>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-48 px-4 py-2 rounded-md shadow-md text-white font-semibold bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-300 text-sm mx-auto block"
                  >
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
