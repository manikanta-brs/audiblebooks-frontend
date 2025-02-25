import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateUserProfileAPIMutation } from "../../store/user/userApiSlice.js";
import {
  useGetAuthorProfileAPIQuery,
  useUpdateAuthorProfileAPIMutation,
} from "../../store/user/authorApiSlice.js";
import {
  updateUserProfile,
  updateAuthorProfile,
} from "../../store/user/authSlice.js";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useEffect, useState, useMemo } from "react";

const sharedSchema = Yup.object().shape({
  first_name: Yup.string()
    .required("First Name is required")
    .min(3, "First Name must be at least 3 characters")
    .max(15, "First Name must not exceed 15 characters"),
  last_name: Yup.string()
    .required("Last Name is required")
    .min(3, "Last Name must be at least 3 characters")
    .max(15, "Last Name must not exceed 15 characters"),
  email: Yup.string().email("Email is invalid"),
  pen_name: Yup.string().min(3, "Pen Name must be at least 3 characters"),
});

const AuthorAccount = ({ isAuthor }) => {
  const dispatch = useDispatch();
  const { userData: reduxUserData, loading } = useSelector(
    (state) => state.auth
  );

  // Temporarily disable the author profile query to avoid conflicts
  // const {
  //   data: authorData,
  //   isLoading: isAuthorProfileLoading,
  //   refetch: refetchAuthorProfile,
  //   isFetching: isFetchingAuthorProfile,
  // } = useGetAuthorProfileAPIQuery(undefined, { skip: !isAuthor });

  const [updateAuthorProfileAPI, { isLoading: isAuthorUpdating }] =
    useUpdateAuthorProfileAPIMutation();

  const [updateUserProfileAPI, { isLoading: isUserUpdating }] =
    useUpdateUserProfileAPIMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = loading; // || isFetchingAuthorProfile; // Removed isFetchingAuthorProfile
  const isUpdating = isAuthorUpdating || isUserUpdating || isSubmitting;

  const initialValues = useMemo(() => {
    if (loading || !reduxUserData || !reduxUserData.profileData) {
      return {
        first_name: "",
        last_name: "",
        email: "",
        pen_name: "",
      };
    }
    const profileData = reduxUserData.profileData;
    if (isAuthor) {
      return {
        first_name: profileData?.first_name || "",
        last_name: profileData?.last_name || "",
        email: profileData?.email || "",
        pen_name: profileData?.pen_name || "",
      };
    } else {
      return {
        first_name: profileData?.first_name || "",
        last_name: profileData?.last_name || "",
        email: profileData?.email || "",
      };
    }
  }, [isAuthor, reduxUserData, loading]);

  // console.log(`%c hmm redux data getting amma mari....`, "color: red");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    try {
      let response;

      if (isAuthor) {
        response = await updateAuthorProfileAPI({
          first_name: values.first_name,
          last_name: values.last_name,
          pen_name: values.pen_name,
        }).unwrap();
      } else {
        response = await updateUserProfileAPI({
          first_name: values.first_name,
          last_name: values.last_name,
        }).unwrap();
      }

      // console.log("API Response:", response); // Added: Check API Response
      // console.log(`%c response is coming anta mari`, "color:yellow");

      if (isAuthor) {
        dispatch(
          updateAuthorProfile({
            first_name: values.first_name,
            last_name: values.last_name,
            pen_name: values.pen_name,
          })
        );
      } else {
        dispatch(
          updateUserProfile({
            first_name: values.first_name,
            last_name: values.last_name,
          })
        );
      }

      toast.success(response.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
      console.error("Profile update error:", error);
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
      <div className="relative w-full max-w-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-300 rounded-xl shadow-lg p-8 m-4 sm:m-0">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          {isAuthor ? "Update Author Profile" : "Update User Profile"}
        </h2>

        {!isLoading && initialValues && (
          // Conditionally render Formik form
          <Formik
            key={isAuthor ? "authorForm" : "userForm"}
            initialValues={initialValues}
            validationSchema={sharedSchema}
            onSubmit={handleSubmit}
            enableReinitialize={false}
          >
            {({ isSubmitting: formikIsSubmitting }) => (
              <Form>
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Email Address
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      disabled
                      placeholder="Email Address"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-70 text-sm"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs italic mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="first_name"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      First Name
                    </label>
                    <Field
                      type="text"
                      id="first_name"
                      name="first_name"
                      placeholder="First Name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-70 text-sm"
                    />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="text-red-500 text-xs italic mt-1"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="last_name"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Last Name
                    </label>
                    <Field
                      type="text"
                      id="last_name"
                      name="last_name"
                      placeholder="Last Name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-70 text-sm"
                    />
                    <ErrorMessage
                      name="last_name"
                      component="div"
                      className="text-red-500 text-xs italic mt-1"
                    />
                  </div>

                  <div className="flex items-center justify-center">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                        isUpdating ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isUpdating ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default AuthorAccount;
