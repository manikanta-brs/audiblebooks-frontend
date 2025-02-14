import { Formik, Form, Field, ErrorMessage } from "formik";
import { useResetPasswordAPIMutation } from "../store/user/userApiSlice";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

const initialValues = {
  password: "",
  confirmPassword: "",
};
const validateSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(40, "Password must not exceed 40 characters"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Confirm Password does not match"),
});

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  let { token } = useParams();
  // console.log(token);
  const [resetPasswordAPI, { isLoading }] = useResetPasswordAPIMutation();

  // const handleSubmit = async (values, { resetForm }) => {
  //   console.log(values);
  //   try {
  //     const response = await resetPasswordAPI({
  //       password: values.password,
  //       token,
  //     });
  //     resetForm();
  //     navigate("/login", { replace: true });
  //     toast.success(response.message);
  //   } catch {
  //     toast.error(error?.data?.message || error.error);
  //   }
  //   // const response = await resetPasswordAPI({
  //   //   password: values.password,
  //   //   token,
  //   // });
  //   // console.log(response);
  // };
  // const handleSubmit = async (values, { setSubmitting }) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:5000/api/users/resetpassword/${values.token}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ password: values.password }),
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorResponse = await response.json(); // Capture error message
  //       throw new Error(errorResponse.message || "Failed to reset password");
  //     }

  //     console.log("Password reset successful!");
  //     // Redirect or show success message
  //   } catch (err) {
  //     console.error("Error during password reset:", err.message);
  //     alert(err.message); // Show the error to the user
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  const handleSubmit = async (values, { resetForm }) => {
    console.log(values);
    try {
      const response = await resetPasswordAPI({
        token: token, // Pass the token from the URL
        password: values.password,
      }).unwrap();
      resetForm();
      navigate("/login", { replace: true });
      toast.success(response.message);
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || "Password reset failed"
      );
    }
  };

  return (
    <>
      <div className="grid place-items-center mb-3">
        <img className="w-16 h-16" src="/images/logo.svg" alt="Workflow" />
      </div>
      <div className="Auth-form-container">
        <div className="Auth-form">
          <div className="Auth-form-content">
            <Formik
              initialValues={initialValues}
              validationSchema={validateSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <h3 className="Auth-form-title py-4 text-center">
                    Reset Password
                  </h3>
                  <hr />

                  <div className="form-group mt-3 px-5 py-2 mx-5">
                    <label>New Password</label>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <ErrorMessage
                      className="err_msg"
                      name="password"
                      component="div"
                    />
                  </div>

                  <div className="form-group mt-3 px-5 py-2 mx-5">
                    <label>Confirm New Password</label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <ErrorMessage
                      className="err_msg"
                      name="confirmPassword"
                      component="div"
                    />
                  </div>

                  <div className="d-grid gap-2 mt-3 px-5 mb-4 mx-5">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`block w-full py-2 px-4 rounded-xl btnPurpleColor ${
                        isLoading
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-700 text-white font-bold"
                      }`}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
