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
        // console.log("Token from localStorage (updatePasswordAPI):", token); // Added logging
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
    forgotUserPasswordAPI: builder.mutation({
      query: (email) => ({
        url: `${USER_ENDPOINT}/forgotpassword`,
        method: "POST",
        body: { email },
      }),
    }),
    resetUserPasswordAPI: builder.mutation({
      query: ({ token, password }) => ({
        url: `${USER_ENDPOINT}/resetuserpassword/${token}`,
        method: "PUT",
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
  useForgotUserPasswordAPIMutation,
  useResetUserPasswordAPIMutation,
  useSaveStoryAPIMutation,
  useRemoveStoryAPIMutation,
  useGetLibraryQuery,
  useGetRefreshTokenAPIQuery,
} = userAPISlice;
