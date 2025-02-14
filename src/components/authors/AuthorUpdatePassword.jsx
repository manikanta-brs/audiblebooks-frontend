import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUpdateAuthorPasswordAPIMutation } from "../../store/user/authorApiSlice"; // Corrected import
import { toast } from "react-toastify";

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
    useUpdateAuthorPasswordAPIMutation(); // Corrected mutation

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token before API call:", token); // Log the token

      const response = await updatePasswordAPI({
        password: values.password,
      }).unwrap();

      console.log("API Success Response:", response); // Log success response
      toast.success(response.message);
      resetForm();
    } catch (error) {
      console.error("API Error Response:", error); // Log the full error
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
            <Form className="max-w-md">
              {" "}
              {/* Reduced max-w for better fit */}
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
