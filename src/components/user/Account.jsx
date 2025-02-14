// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { useSelector, useDispatch } from "react-redux";
// import { useUpdateUserProfileAPIMutation } from "../../store/user/userApiSlice";
// import { updateUserProfile } from "../../store/user/authSlice";
// import { toast } from "react-toastify";
// import * as Yup from "yup";
// import { useState, useEffect } from "react";

// const userSchema = Yup.object().shape({
//   first_name: Yup.string()
//     .required("First Name is required")
//     .min(3, "First Name must be at least 3 characters")
//     .max(15, "First Name must not exceed 15 characters"),
//   last_name: Yup.string()
//     .required("Last Name is required")
//     .min(3, "Last Name must be at least 3 characters")
//     .max(15, "Last Name must not exceed 15 characters"),
//   email: Yup.string().required("Email is required").email("Email is invalid"),
// });

// const Account = () => {
//   const [userData, setUserData] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//   });

//   const [updateProfile, { isLoading, isError, error }] =
//     useUpdateUserProfileAPIMutation(); // Get the mutation hook

//   const dispatch = useDispatch(); // Add this line

//   useEffect(() => {
//     const storedUserData = JSON.parse(localStorage.getItem("userData"));
//     if (storedUserData) {
//       setUserData(storedUserData);
//     }
//   }, []);

//   const handleSubmit = async (values) => {
//     // Make handleSubmit async
//     try {
//       const token = localStorage.getItem("token"); // Get the token
//       if (!token) {
//         console.error("No token found in localStorage!");
//         toast.error("You are not authenticated. Please log in."); // Show error to the user
//         return; // Stop submission
//       }

//       await updateProfile({ userData: values, token: token }).unwrap(); // Pass both data and token and unwrap

//       localStorage.setItem("userData", JSON.stringify(values));
//       setUserData(values);

//       // **Dispatch the action to update the Redux store:**
//       dispatch(updateUserProfile(values)); // Dispatch the action with the updated values

//       toast.success("Profile updated successfully!");
//     } catch (err) {
//       console.error("Failed to update profile:", err);
//       // Customize the error message based on the error from the backend
//       let errorMessage = "Failed to update profile. Please try again.";
//       if (err.data && err.data.message) {
//         errorMessage = err.data.message; // Use the backend error message
//       }
//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
//       <div className="relative w-full max-w-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-300 rounded-xl shadow-lg p-8 m-4 sm:m-0">
//         <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
//           Update Profile
//         </h2>

//         <Formik
//           initialValues={userData}
//           enableReinitialize
//           validationSchema={userSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                   Email Address
//                 </label>
//                 <Field
//                   type="email"
//                   name="email"
//                   disabled={true}
//                   placeholder="Email Address"
//                   className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-70 text-sm"
//                 />
//                 <ErrorMessage
//                   name="email"
//                   component="div"
//                   className="text-red-500 text-xs italic mt-1"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                   First Name
//                 </label>
//                 <Field
//                   type="text"
//                   name="first_name"
//                   placeholder="First Name"
//                   className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-70 text-sm"
//                 />
//                 <ErrorMessage
//                   name="first_name"
//                   component="div"
//                   className="text-red-500 text-xs italic mt-1"
//                 />
//               </div>

//               <div className="mb-6">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                   Last Name
//                 </label>
//                 <Field
//                   type="text"
//                   name="last_name"
//                   placeholder="Last Name"
//                   className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-70 text-sm"
//                 />
//                 <ErrorMessage
//                   name="last_name"
//                   component="div"
//                   className="text-red-500 text-xs italic mt-1"
//                 />
//               </div>

//               <div className="flex items-center justify-center">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting || isLoading} // Disable while submitting or loading
//                   className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
//                     isSubmitting || isLoading
//                       ? "opacity-50 cursor-not-allowed"
//                       : ""
//                   }`}
//                 >
//                   {isSubmitting || isLoading ? "Updating..." : "Update"}
//                 </button>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default Account;
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector, useDispatch } from "react-redux";
import {
  useUpdateUserProfileAPIMutation,
  useGetUserProfileAPIQuery,
} from "../../store/user/userApiSlice";
import { updateUserProfile } from "../../store/user/authSlice";
import { toast } from "react-toastify";
import * as Yup from "yup";

const userSchema = Yup.object().shape({
  first_name: Yup.string()
    .required("First Name is required")
    .min(3, "First Name must be at least 3 characters")
    .max(15, "First Name must not exceed 15 characters"),
  last_name: Yup.string()
    .required("Last Name is required")
    .min(3, "Last Name must be at least 3 characters")
    .max(15, "Last Name must not exceed 15 characters"),
  email: Yup.string().required("Email is required").email("Email is invalid"),
});

const Account = () => {
  const { userData } = useSelector((state) => state.auth);

  const { userId } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading, isError, error }] =
    useUpdateUserProfileAPIMutation();
  const dispatch = useDispatch();
  const { refetch: refetchUserProfile } = useGetUserProfileAPIQuery();
  //Ensure that we set a handle function to ensure the proper refresh function is called
  const handleRefetch = async () => {
    try {
      console.log("Fetching Profile Data");
      // This triggers refetch
      await refetchUserProfile()
        .then((response) => {
          console.log("Refetch Successful! Profile data:", response.data); // Check new data
          // Handle the result, e.g., update the local state
        })
        .catch((error) => {
          console.error("Refetch Failed!", error);
          // Handle the error
        });
    } catch (err) {
      console.error(err);
    }
  };
  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage!");
        toast.error("You are not authenticated. Please log in.");
        return;
      }

      await updateProfile({
        userData: values,
        token: token,
        id: userData._id,
      }).unwrap(); // Pass both data and token and id

      dispatch(updateUserProfile(values));

      // After a successful API call, immediately refetch the user profile:
      toast.success("Profile updated successfully!");
      await handleRefetch();
    } catch (err) {
      console.error("Failed to update profile:", err);
      let errorMessage = "Failed to update profile. Please try again.";
      if (err.data && err.data.message) {
        errorMessage = err.data.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
      <div className="relative w-full max-w-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-300 rounded-xl shadow-lg p-8 m-4 sm:m-0">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Update Profile
        </h2>
        <Formik
          initialValues={
            userData.profileData || { first_name: "", last_name: "", email: "" }
          } // Use Redux data or empty object
          enableReinitialize
          validationSchema={userSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email Address
                </label>
                <Field
                  type="email"
                  name="email"
                  disabled={true}
                  placeholder="Email Address"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-70 text-sm"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-xs italic mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  First Name
                </label>
                <Field
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-70 text-sm"
                />
                <ErrorMessage
                  name="first_name"
                  component="div"
                  className="text-red-500 text-xs italic mt-1"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Last Name
                </label>
                <Field
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-70 text-sm"
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
                  disabled={isSubmitting || isLoading} // Disable while submitting or loading
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    isSubmitting || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting || isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default Account;
