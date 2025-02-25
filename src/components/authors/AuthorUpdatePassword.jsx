import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUpdateAuthorPasswordAPIMutation } from "../../store/user/authorApiSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(40, "Password must not exceed 40 characters"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Confirm Password does not match"),
});

const initialValues = { password: "", confirmPassword: "" };

const AuthorUpdatePassword = () => {
  const [updatePasswordAPI, { isLoading }] =
    useUpdateAuthorPasswordAPIMutation();
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    // Force a re-render of the hidden field after the component mounts
    // to help the browser recognize the autocomplete attribute.
    const timer = setTimeout(() => {
      // No actual logic needed; the re-render is the point
    }, 0); // Use a zero-delay timeout

    return () => clearTimeout(timer); // Clean up the timeout
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // ADD: Construct the data based on what the backend expects!
      const passwordData = {
        password: values.password, // Corrected
        // other fields the backend needs... (e.g., currentPassword)
      };

      const response = await updatePasswordAPI(passwordData).unwrap();

      toast.success(response.message);
      resetForm();
    } catch (error) {
      console.error("API Error Response:", error);
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
      <div className="relative w-full max-w-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-300 rounded-xl shadow-lg p-8 m-4 sm:m-0">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Author Reset Password
        </h3>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="max-w-md" action="">
              {" "}
              {/* Reduced max-w for better fit. Added action="" */}
              {/*Hidden Email Field*/}
              <Field
                type="hidden"
                id="email"
                name="email"
                value={userData?.email || ""}
                autoComplete="username" // Try this for testing (carefully)
              />
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  New Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-70 text-sm"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs italic mt-1"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Confirm New Password
                </label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-70 text-sm"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-xs italic mt-1"
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    isLoading || isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isLoading || isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AuthorUpdatePassword;
