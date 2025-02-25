import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useForgotUserPasswordAPIMutation } from "../store/user/userApiSlice";
import { useForgotAuthorPasswordAPIMutation } from "../store/user/authorApiSlice";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";

const initialValues = { email: "" };
const validateSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Email is invalid"),
});

const ForgotPasswordPage = () => {
  const [forgotPasswordAPI, { isLoading }] = useForgotUserPasswordAPIMutation();
  const [authorForgotPasswordAPI, { isLoading: isAuthorLoading }] =
    useForgotAuthorPasswordAPIMutation();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isAuthorForgotPassword, setIsAuthorForgotPassword] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn) {
    return null;
  }

  const handleSubmit = async (values, { resetForm }) => {
    try {
      let response;
      if (isAuthorForgotPassword) {
        response = await authorForgotPasswordAPI(values.email).unwrap(); // Pass only the email
      } else {
        response = await forgotPasswordAPI(values.email).unwrap(); // Pass only the email
      }

      if (response.message) {
        toast.success(response.message);
      } else {
        toast.error(response.message || "An unexpected error occurred");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error?.data?.message || error.error || "An error occurred");
    } finally {
      resetForm();
    }
  };

  const toggleForgotPasswordType = () => {
    setIsAuthorForgotPassword(!isAuthorForgotPassword);
    if (toggleRef.current) {
      toggleRef.current.classList.add("animate-wiggle");
      setTimeout(() => {
        toggleRef.current.classList.remove("animate-wiggle");
      }, 300);
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
              Forgot Password
            </h2>
            <p className="text-gray-700 text-sm">
              Enter your email to reset your password.
            </p>
          </div>

          <div className="flex items-center justify-center mb-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isAuthorForgotPassword}
                onChange={toggleForgotPasswordType}
                readOnly
                ref={toggleRef}
              />
              <span className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></span>
              <span className="ml-2 text-sm font-medium text-gray-800 w-12 text-center">
                {isAuthorForgotPassword ? "Author" : "User"}
              </span>
            </label>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
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

                <div>
                  <button
                    type="submit"
                    disabled={isLoading || isSubmitting || isAuthorLoading}
                    className="w-48 px-4 py-2 rounded-md shadow-md text-white font-semibold bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-300 text-sm mx-auto block"
                  >
                    {isLoading || isSubmitting || isAuthorLoading
                      ? "Sending..."
                      : "Send Reset Link"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-800">
              Don't have an account?
              <Link
                to="/register"
                className="text-green-600 hover:text-green-800 transition duration-200 font-medium ml-1"
              >
                Sign Up
              </Link>
            </p>
            <p className="text-sm text-gray-800 mt-2">
              Already have an account?
              <Link
                to="/login"
                className="text-green-600 hover:text-green-800 transition duration-200 font-medium ml-1"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
