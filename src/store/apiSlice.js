import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000", // Ensure this is correct
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const token = state.auth?.token; // Safeguard for potential undefined state
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "storytime",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/api/users/register",
        method: "PUT",
        body: userData,
      }),
    }),
  }),
});

export const { useRegisterUserMutation } = apiSlice;
