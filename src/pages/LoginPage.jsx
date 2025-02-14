import { Link, NavLink, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/user/authSlice";
import { useLoginAPIMutation } from "../store/user/userApiSlice";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const initialValues = {
  email: "",
  password: "",
  rememberme: false,
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Email is invalid"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(40, "Password must not exceed 40 characters"),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [loginAPI, { isLoading }] = useLoginAPIMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthorLogin, setIsAuthorLogin] = useState(false);
  const toggleRef = useRef(null);
  const [animatedText, setAnimatedText] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimatedText((prev) => !prev);
    }, 8000); // Toggle animation every 8 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [navigate, isLoggedIn]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const apiData = {
        url: isAuthorLogin ? "/api/authors/login" : "/api/users/login",
        body: {
          email: values.email,
          password: values.password,
        },
      };

      const response = await loginAPI(apiData).unwrap();

      if (!response.token) {
        console.error(
          "Backend login response is missing the 'token' property!"
        );
        toast.error(
          "Login successful, but the token is missing. Please contact support."
        );
        return;
      }

      const token = response.token;
      localStorage.setItem("token", JSON.stringify(token));

      const userDataForStore = {
        ...response,
        isAuthorLogin: isAuthorLogin,
      };

      dispatch(login(userDataForStore));
      navigate("/home");
      toast.success((isAuthorLogin ? "Author" : "User") + " Login successful");
      resetForm();
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error?.data?.message || error.error || "Something went wrong!"
      );
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLoginType = () => {
    setIsAuthorLogin(!isAuthorLogin);
    // Trigger the animation when the toggle is clicked
    if (toggleRef.current) {
      toggleRef.current.classList.add("animate-wiggle");
      setTimeout(() => {
        toggleRef.current.classList.remove("animate-wiggle");
      }, 300); // Remove the class after the animation duration
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 flex justify-center items-center">
      <div className="relative sm:max-w-lg w-full bg-gradient-to-l from-green-300 to-blue-200 p-8 rounded-3xl shadow-lg shadow-white-shadow overflow-hidden">
        {" "}
        {/* Glass plate effect */}
        <div className="absolute inset-0 bg-white bg-opacity-40 backdrop-blur-lg rounded-3xl z-0"></div>
        <div className="relative z-10">
          <div className="text-center mb-6">
            <h2
              className={`text-3xl font-extrabold text-gray-800 mb-2 ${
                animatedText ? "animate-pulse" : ""
              }`}
            >
              AudibleBooks
            </h2>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
              Sign In
            </h2>
            <p className="text-gray-700 text-sm">
              Welcome back! Enter your credentials to access your account.
            </p>
          </div>

          {/* Author/User Toggle */}
          <div className="flex items-center justify-center mb-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isAuthorLogin}
                onChange={toggleLoginType}
                readOnly
                ref={toggleRef}
              />
              <span className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></span>
              <span className="ml-2 text-sm font-medium text-gray-800 w-12 text-center">
                {isAuthorLogin ? "Author" : "User"}
              </span>
            </label>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-800 mb-1"
                  >
                    Email Address
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 leading-5 text-sm"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="mb-6 relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-800 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 leading-5 text-sm"
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

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberme"
                      name="rememberme"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded focus:ring-2"
                    />
                    <label
                      htmlFor="rememberme"
                      className="ml-2 block text-sm text-gray-800"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgotpassword"
                    className="text-sm text-green-600 hover:text-green-800 transition duration-200"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-48 px-4 py-2 rounded-md shadow-md text-white font-semibold bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-300 text-sm mx-auto block"
                  >
                    {isSubmitting || isLoading ? "Signing In..." : "Sign In"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-800">Don't have an account?</p>
            <NavLink
              to="/register"
              className="text-green-600 hover:text-green-800 transition duration-200 font-medium"
            >
              Sign Up
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// const initialValues = {
//   email: "",
//   password: "",
//   rememberme: false,
// };

// const validationSchema = Yup.object().shape({
//   email: Yup.string().required("Email is required").email("Email is invalid"),
//   password: Yup.string()
//     .required("Password is required")
//     .min(6, "Password must be at least 6 characters")
//     .max(40, "Password must not exceed 40 characters"),
// });

// const LoginPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isLoggedIn } = useSelector((state) => state.auth);
//   const [loginAPI, { isLoading }] = useLoginAPIMutation();
//   const [showPassword, setShowPassword] = useState(false);
//   const [isAuthorLogin, setIsAuthorLogin] = useState(false);
//   const toggleRef = useRef(null);
//   const [animatedText, setAnimatedText] = useState(false);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setAnimatedText((prev) => !prev);
//     }, 8000); // Toggle animation every 8 seconds

//     return () => clearInterval(intervalId); // Clean up on unmount
//   }, []);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   useEffect(() => {
//     if (isLoggedIn) {
//       navigate("/home");
//     }
//   }, [navigate, isLoggedIn]);

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     setSubmitting(true);
//     try {
//       const apiData = {
//         url: isAuthorLogin ? "/api/authors/login" : "/api/users/login",
//         body: {
//           email: values.email,
//           password: values.password,
//         },
//       };

//       const response = await loginAPI(apiData).unwrap();
//       console.log("full response", response);
//       if (!response.token) {
//         console.error(
//           "Backend login response is missing the 'token' property!"
//         );
//         toast.error(
//           "Login successful, but the token is missing. Please contact support."
//         );
//         return;
//       }

//       const token = response.token;
//       localStorage.setItem("token", JSON.stringify(token));

//       // Determine if the response is for an author or a user and extract relevant data
//       let userId = null;
//       let authorId = null;
//       let profileData = null;

//       if (isAuthorLogin) {
//         // Author login
//         authorId = response._id; // Assuming authors return _id as authorId
//         profileData = {
//           _id: response._id,
//           first_name: response.first_name,
//           last_name: response.last_name,
//           email: response.email,
//         };
//       } else {
//         // User login
//         userId = response._id; // Assuming users return _id as userId
//         profileData = {
//           _id: response._id,
//           first_name: response.first_name,
//           last_name: response.last_name,
//           email: response.email,
//         };
//       }

//       const userDataForStore = {
//         ...response,
//         isAuthorLogin: isAuthorLogin,
//         userId: userId,
//         authorId: authorId,
//         profileData: profileData,
//       };

//       // Set persist:auth state with localStorage
//       localStorage.setItem(
//         "persist:auth",
//         JSON.stringify({
//           isLoggedIn: "true",
//           userData: JSON.stringify({ profileData: profileData }), // JSONify the user data
//           isAuthorLogin: JSON.stringify(isAuthorLogin), // Make sure this is a string
//           _persist: '{"version":-1,"rehydrated":true}',
//         })
//       );

//       dispatch(login(userDataForStore));
//       navigate("/home");
//       toast.success((isAuthorLogin ? "Author" : "User") + " Login successful");
//       resetForm();
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error(
//         error?.data?.message || error.error || "Something went wrong!"
//       );
//       resetForm();
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const toggleLoginType = () => {
//     setIsAuthorLogin(!isAuthorLogin);
//     // Trigger the animation when the toggle is clicked
//     if (toggleRef.current) {
//       toggleRef.current.classList.add("animate-wiggle");
//       setTimeout(() => {
//         toggleRef.current.classList.remove("animate-wiggle");
//       }, 300); // Remove the class after the animation duration
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black py-12 flex justify-center items-center">
//       <div className="relative sm:max-w-lg w-full bg-gradient-to-l from-green-300 to-blue-200 p-8 rounded-3xl shadow-lg shadow-white-shadow overflow-hidden">
//         <div className="absolute inset-0 bg-white bg-opacity-40 backdrop-blur-lg rounded-3xl z-0"></div>
//         <div className="relative z-10">
//           <div className="text-center mb-6">
//             <h2
//               className={`text-3xl font-extrabold text-gray-800 mb-2 ${
//                 animatedText ? "animate-pulse" : ""
//               }`}
//             >
//               AudibleBooks
//             </h2>
//             <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
//               Sign In
//             </h2>
//             <p className="text-gray-700 text-sm">
//               Welcome back! Enter your credentials to access your account.
//             </p>
//           </div>

//           {/* Author/User Toggle */}
//           <div className="flex items-center justify-center mb-4">
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="sr-only peer"
//                 checked={isAuthorLogin}
//                 onChange={toggleLoginType}
//                 readOnly
//                 ref={toggleRef}
//               />
//               <span className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></span>
//               <span className="ml-2 text-sm font-medium text-gray-800 w-12 text-center">
//                 {isAuthorLogin ? "Author" : "User"}
//               </span>
//             </label>
//           </div>

//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ isSubmitting }) => (
//               <Form>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="email"
//                     className="block text-sm font-semibold text-gray-800 mb-1"
//                   >
//                     Email Address
//                   </label>
//                   <Field
//                     type="email"
//                     name="email"
//                     placeholder="your.email@example.com"
//                     className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 leading-5 text-sm"
//                   />
//                   <ErrorMessage
//                     name="email"
//                     component="div"
//                     className="text-red-500 text-xs mt-1"
//                   />
//                 </div>

//                 <div className="mb-6 relative">
//                   <label
//                     htmlFor="password"
//                     className="block text-sm font-semibold text-gray-800 mb-1"
//                   >
//                     Password
//                   </label>
//                   <div className="relative">
//                     <Field
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       placeholder="••••••••"
//                       className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 leading-5 text-sm"
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

//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="rememberme"
//                       name="rememberme"
//                       className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded focus:ring-2"
//                     />
//                     <label
//                       htmlFor="rememberme"
//                       className="ml-2 block text-sm text-gray-800"
//                     >
//                       Remember me
//                     </label>
//                   </div>
//                   <Link
//                     to="/forgotpassword"
//                     className="text-sm text-green-600 hover:text-green-800 transition duration-200"
//                   >
//                     Forgot your password?
//                   </Link>
//                 </div>

//                 <div>
//                   <button
//                     type="submit"
//                     disabled={isSubmitting || isLoading}
//                     className="w-48 px-4 py-2 rounded-md shadow-md text-white font-semibold bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-300 text-sm mx-auto block"
//                   >
//                     {isSubmitting || isLoading ? "Signing In..." : "Sign In"}
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>

//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-800">Don't have an account?</p>
//             <NavLink
//               to="/register"
//               className="text-green-600 hover:text-green-800 transition duration-200 font-medium"
//             >
//               Sign Up
//             </NavLink>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
