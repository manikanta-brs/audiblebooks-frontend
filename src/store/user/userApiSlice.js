// import { apiSlice } from "../apiSlice";
// const USER_ENDPOINT = "/api/users"; // You can keep this, but we won't use it directly for login anymore

// export const userAPISlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     loginAPI: builder.mutation({
//       query: ({ url, body }) => ({
//         // Expecting an object with 'url' and 'body'
//         url: url, // Use the dynamic URL passed in the argument
//         method: "POST",
//         body: body,
//       }),
//     }),
//     registerAPI: builder.mutation({
//       query: (data) => ({
//         url: `${USER_ENDPOINT}/register`, // Register API still uses the USER_ENDPOINT
//         method: "POST",
//         body: data,
//       }),
//     }),
//     getUserProfileAPI: builder.query({
//       query: () => ({
//         url: `${USER_ENDPOINT}/profile`,
//         method: "GET",
//       }),
//     }),
//     updateUserProfileAPI: builder.mutation({
//       query: (data) => ({
//         url: `${USER_ENDPOINT}/profile`,
//         method: "PUT",
//         body: data,
//       }),
//     }),
//     updateLanguageAPI: builder.mutation({
//       query: (data) => ({
//         url: `${USER_ENDPOINT}/preferredlanguage`,
//         method: "PUT",
//         body: data,
//       }),
//     }),
//     updatePasswordAPI: builder.mutation({
//       query: (data) => ({
//         url: `${USER_ENDPOINT}/updatepassword`,
//         method: "PUT",
//         body: data,
//       }),
//     }),
//     forgotPasswordAPI: builder.mutation({
//       query: (data) => ({
//         url: `${USER_ENDPOINT}/forgotpassword`,
//         method: "POST",
//         body: data,
//       }),
//     }),
//     resetPasswordAPI: builder.mutation({
//       query: ({ token, password }) => ({
//         url: `${USER_ENDPOINT}/resetpassword/${token}`,
//         method: "POST",
//         body: { password },
//       }),
//     }),

//     saveStoryAPI: builder.mutation({
//       query: (data) => ({
//         url: `${USER_ENDPOINT}/savestory`,
//         method: "POST",
//         body: data,
//       }),
//     }),

//     removeStoryAPI: builder.mutation({
//       query: (data) => ({
//         url: `${USER_ENDPOINT}/removestory`,
//         method: "DELETE",
//         body: data,
//       }),
//     }),

//     getLibrary: builder.query({
//       query: (data) => ({
//         url: `${USER_ENDPOINT}/library`,
//         method: "GET",
//       }),
//     }),

//     getRefreshTokenAPI: builder.query({
//       query: (data) => ({
//         url: `${USER_ENDPOINT}/refreshtoken`,
//         method: "GET",
//       }),
//     }),
//   }),
// });

// export const {
//   useLoginAPIMutation,
//   useRegisterAPIMutation,
//   useGetUserProfileAPIQuery,
//   useUpdateUserProfileAPIMutation,
//   useUpdateLanguageAPIMutation,
//   useUpdatePasswordAPIMutation,
//   useForgotPasswordAPIMutation,
//   useResetPasswordAPIMutation,
//   useSaveStoryAPIMutation,
//   useRemoveStoryAPIMutation,
//   useGetLibraryQuery,
//   useGetRefreshTokenAPIQuery,
// } = userAPISlice;
import { apiSlice } from "../apiSlice";
const USER_ENDPOINT = "/api/users";

export const userAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginAPI: builder.mutation({
      query: ({ url, body }) => ({
        url: url,
        method: "POST",
        body: body,
      }),
    }),
    registerAPI: builder.mutation({
      query: (data) => ({
        url: `${USER_ENDPOINT}/register`,
        method: "POST",
        body: data,
      }),
    }),
    getUserProfileAPI: builder.query({
      query: () => ({
        url: `${USER_ENDPOINT}/profile`,
        method: "GET",
      }),
    }),

    updateUserProfileAPI: builder.mutation({
      query: ({ userData, token, id }) => {
        return {
          url: `/api/users/profile/`,
          method: "PUT",
          body: userData,
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        };
      },
    }),

    updateLanguageAPI: builder.mutation({
      query: (data) => ({
        url: `${USER_ENDPOINT}/preferredlanguage`,
        method: "PUT",
        body: data,
      }),
    }),
    updatePasswordAPI: builder.mutation({
      query: (passwordData) => {
        // Changed parameter name for clarity
        const token = localStorage.getItem("token");
        console.log("Token from localStorage (updatePasswordAPI):", token); // Added logging
        return {
          url: `${USER_ENDPOINT}/updatepassword`,
          method: "PUT",
          body: passwordData,
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        };
      },
    }),
    forgotPasswordAPI: builder.mutation({
      query: (data) => ({
        url: `${USER_ENDPOINT}/forgotpassword`,
        method: "POST",
        body: data,
      }),
    }),
    resetPasswordAPI: builder.mutation({
      query: ({ token, password }) => ({
        url: `${USER_ENDPOINT}/resetpassword/${token}`,
        method: "POST",
        body: { password },
      }),
    }),
    saveStoryAPI: builder.mutation({
      query: (data) => ({
        url: `${USER_ENDPOINT}/savestory`,
        method: "POST",
        body: data,
      }),
    }),
    removeStoryAPI: builder.mutation({
      query: (data) => ({
        url: `${USER_ENDPOINT}/removestory`,
        method: "DELETE",
        body: data,
      }),
    }),
    getLibrary: builder.query({
      query: (data) => ({
        url: `${USER_ENDPOINT}/library`,
        method: "GET",
      }),
    }),
    getRefreshTokenAPI: builder.query({
      query: (data) => ({
        url: `${USER_ENDPOINT}/refreshtoken`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginAPIMutation,
  useRegisterAPIMutation,
  useGetUserProfileAPIQuery,
  useUpdateUserProfileAPIMutation,
  useUpdateLanguageAPIMutation,
  useUpdatePasswordAPIMutation,
  useForgotPasswordAPIMutation,
  useResetPasswordAPIMutation,
  useSaveStoryAPIMutation,
  useRemoveStoryAPIMutation,
  useGetLibraryQuery,
  useGetRefreshTokenAPIQuery,
} = userAPISlice;
