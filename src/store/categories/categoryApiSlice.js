// src/store/categories/categoryApiSlice.js (Make sure this path is correct)
import { apiSlice } from "../apiSlice";

const CATEGORY_URL = "/api/audiobooks";

export const categoryAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategoriesAPI: builder.query({
      query: () => ({
        url: `${CATEGORY_URL}/categories`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesAPIQuery } = categoryAPISlice;
