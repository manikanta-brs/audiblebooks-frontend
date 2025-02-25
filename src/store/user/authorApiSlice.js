import { apiSlice } from "../apiSlice";

const AUTHOR_ENDPOINT = "/api/authors";

export const authorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuthorsAPI: builder.query({
      query: () => ({
        url: `${AUTHOR_ENDPOINT}/getauthors`,
        method: "GET",
      }),
    }),
    getAuthorProfileAPI: builder.query({
      query: () => ({
        url: `${AUTHOR_ENDPOINT}/profile`,
        method: "GET",
      }),
    }),
    registerAuthor: builder.mutation({
      query: (authorData) => ({
        url: `${AUTHOR_ENDPOINT}/register`,
        method: "POST",
        body: authorData,
      }),
    }),
    updateAuthorProfileAPI: builder.mutation({
      query: (authorData) => {
        const token = localStorage.getItem("token");
        // console.log("Token from localStorage:", token);
        return {
          url: `${AUTHOR_ENDPOINT}/profile`,
          method: "PUT",
          body: authorData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    updateAuthorPasswordAPI: builder.mutation({
      // ADD THIS
      query: (passwordData) => {
        const token = localStorage.getItem("token");
        // console.log("Token from localStorage:", token);
        return {
          url: `${AUTHOR_ENDPOINT}/updatepassword`, // Adjust the URL if different
          method: "PUT", // Or POST, depending on your API
          body: passwordData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    forgotAuthorPasswordAPI: builder.mutation({
      query: (email) => ({
        url: `${AUTHOR_ENDPOINT}/forgotpassword`,
        method: "POST",
        body: { email },
      }),
    }),
    resetAuthorPasswordAPI: builder.mutation({
      query: ({ token, password }) => ({
        url: `${AUTHOR_ENDPOINT}/resetauthorpassword/${token}`,
        method: "PUT",
        body: { password },
      }),
    }),
  }),
});

export const {
  useGetAuthorsAPIQuery,
  useGetAuthorProfileAPIQuery,
  useRegisterAuthorMutation,
  useUpdateAuthorProfileAPIMutation,
  useUpdateAuthorPasswordAPIMutation,
  useForgotAuthorPasswordAPIMutation,
  useResetAuthorPasswordAPIMutation,
} = authorApiSlice;
