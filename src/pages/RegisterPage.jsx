import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Modal from "react-responsive-modal"; // Make sure to install this: npm install react-responsive-modal
import "react-responsive-modal/styles.css"; // Import modal styles
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "react-responsive-modal/styles.css";
import { useRegisterAPIMutation } from "../store/user/userApiSlice"; // Keep user registration import
import { useRegisterAuthorMutation } from "../store/user/authorApiSlice"; // Correctly import author registration hook
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialValues = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  acceptTerms: Yup.boolean().oneOf(
    [true],
    "Accept Terms & Conditions is required"
  ),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [registerUserAPI, { isLoading: isUserRegistering }] =
    useRegisterAPIMutation();
  const [registerAuthorAPI, { isLoading: isAuthorRegistering }] =
    useRegisterAuthorMutation();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false); // State to track user/author toggle
  const [animatedText, setAnimatedText] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      let registrationResponse;
      if (isAuthor) {
        // Register as author
        registrationResponse = await registerAuthorAPI({
          // Now correctly using registerAuthorAPI (from authorApiSlice)
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
        }).unwrap();
      } else {
        // Register as user
        registrationResponse = await registerUserAPI({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
          role: "user", // Or omit role if not needed for user registration
        }).unwrap();
      }

      toast.success(
        "Registration successful! Please check your email to verify the account."
      );
      resetForm();
      setSubmitting(false);
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);

      let errorMessage = "Something went wrong!";

      if (error?.data?.message) {
        errorMessage = error.data.message; // Use the backend error message, if it exists
      } else if (error?.error) {
        // Check for error.error
        errorMessage = error.error; //If error.error exists
      } else if (error?.message) {
        errorMessage = error.message; // Check the error.message
      } else if (typeof error === "string") {
        errorMessage = error; // Check if error is directly a string
      } else {
        errorMessage = JSON.stringify(error); // Last resort, stringify the entire error
      }

      toast.error(errorMessage); // Display the backend-provided error
      setSubmitting(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRole = () => {
    setIsAuthor(!isAuthor);
  };

  const isSubmitting = isUserRegistering || isAuthorRegistering; // Combine loading states for button disable

  return (
    <div className="min-h-screen  bg-black py-12 flex justify-center items-center">
      <div className="relative sm:max-w-lg w-full bg-gradient-to-r from-green-300 to-lightblue-200 p-8 rounded-3xl shadow-xl overflow-hidden">
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
              Sign Up
            </h2>
            <p className="text-gray-700 text-sm">
              Create an account to start exploring!
            </p>
          </div>

          {/* Author/User Toggle */}
          <div className="flex items-center justify-center mb-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isAuthor}
                onChange={toggleRole}
                readOnly // Make sure the toggle is readOnly when using onChange
              />
              <span className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></span>
              <span className="ml-2 text-sm font-medium text-gray-800 w-12 text-center">
                {isAuthor ? "Author" : "User"}
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
                    htmlFor="first_name"
                    className="block text-sm font-semibold text-gray-800 mb-1"
                  >
                    First Name
                  </label>
                  <Field
                    type="text"
                    name="first_name"
                    placeholder="Your First Name"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 leading-5 text-sm"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-semibold text-gray-800 mb-1"
                  >
                    Last Name
                  </label>
                  <Field
                    type="text"
                    name="last_name"
                    placeholder="Your Last Name"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 leading-5 text-sm"
                  />
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

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

                <div className="mb-6 relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-800 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
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
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Field
                      type="checkbox"
                      id="acceptTerms"
                      name="acceptTerms"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded focus:ring-2"
                    />
                    <label
                      htmlFor="acceptTerms"
                      className="ml-2 block text-sm text-gray-800"
                    >
                      I agree with{" "}
                      <span
                        className="text-green-600 hover:text-green-800 cursor-pointer"
                        onClick={onOpenModal}
                      >
                        Terms & Conditions
                      </span>
                    </label>
                  </div>
                  <ErrorMessage
                    name="acceptTerms"
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
                    {isSubmitting ? "Signing Up..." : "Sign Up"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-800">Already have an account?</p>
            <NavLink
              to="/login"
              className="text-green-600 hover:text-green-800 transition duration-200 font-medium"
            >
              Sign In
            </NavLink>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={onCloseModal} center>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Terms & Conditions
        </h2>
        <p className="text-gray-700">
          Welcome to AudibleBooks! By using our platform, you agree to the
          following terms:
        </p>
        <ul className="list-disc pl-5 mt-4 text-gray-700">
          <li>You must be at least 13 years old to use this service.</li>
          <li>
            You are responsible for maintaining the confidentiality of your
            account and password.
          </li>
          <li>
            You agree not to use AudibleBooks for any illegal or unauthorized
            purpose.
          </li>
          <li>
            We reserve the right to modify or terminate the service for any
            reason, without notice, at any time.
          </li>
        </ul>
        <p className="mt-4 text-gray-700">
          For a complete list of terms and conditions, please visit our website.
        </p>
      </Modal>
    </div>
  );
};

export default RegisterPage;
