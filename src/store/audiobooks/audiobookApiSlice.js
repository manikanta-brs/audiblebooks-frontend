import { apiSlice } from "../apiSlice";

const AUTHOR_ENDPOINT = "/api/authors";
const AUDIOBOOK_ENDPOINT = "/api/audiobooks";

export const audiobookApiSlice = apiSlice.injectEndpoints({
  tagTypes: ["Audiobook"],
  endpoints: (builder) => ({
    getAudiobooksByCategoryAPI: builder.query({
      query: (category) => {
        const encodedCategory = encodeURIComponent(category); // Encode before sending
        return {
          url: `${AUDIOBOOK_ENDPOINT}/category/${encodedCategory}`,
          method: "GET",
        };
      },
      transformResponse: (response) => {
        if (!response.success) {
          // If success is false, return the message
          return { error: response.message };
        }
        return response.data;
      },
      providesTags: (result, error, category) => [
        { type: "Audiobook", id: category },
      ],
    }),

    // getAudiobooksAPI: builder.query({
    //   query: (authorId) => {
    //     let url = `${AUDIOBOOK_ENDPOINT}/getbooks`;
    //     return {
    //       url,
    //       method: "GET",
    //     };
    //   },
    //   transformResponse: (response) => response.data,
    //   providesTags: ["Audiobook"],
    // }),
    getAudiobooksAPI: builder.query({
      query: (authorId) => {
        let url = `${AUDIOBOOK_ENDPOINT}/getbooks`;
        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response, meta, arg) => {
        console.log("transformResponse", response, meta, arg);
        if (!response.success) {
          throw new Error(response.message); // Throw an error for RTK Query to catch
        }
        return response.data;
      },
      providesTags: ["Audiobook"],
    }),

    searchAudiobooksAPI: builder.query({
      query: (searchQuery) => ({
        url: `${AUDIOBOOK_ENDPOINT}/search?q=${searchQuery}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Audiobook"],
    }),
    lazySearchAudiobooksAPI: builder.query({
      query: (searchQuery) => ({
        url: `${AUDIOBOOK_ENDPOINT}/search?q=${searchQuery}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Audiobook"],
    }),
    getAuthorProfileAPI: builder.query({
      query: () => ({
        url: `${AUTHOR_ENDPOINT}/profile`,
        method: "GET",
      }),
    }),
    getAudiobooksByAuthor: builder.query({
      query: (authorId) => ({
        url: `${AUDIOBOOK_ENDPOINT}/${authorId}/getbyauthor`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Audiobook"],
    }),
    addAuthorRatingAPI: builder.mutation({
      query: ({ id, rating, review, token }) => ({
        url: `${AUDIOBOOK_ENDPOINT}/${id}/review/author`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
        body: { rating, review },
      }),
      invalidatesTags: ["Audiobook"], // Invalidate to refetch audiobooks
    }),
    addUserRatingAPI: builder.mutation({
      query: ({ id, rating, review, token }) => ({
        url: `${AUDIOBOOK_ENDPOINT}/${id}/review/user`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { rating, review },
      }),
      invalidatesTags: ["Audiobook"],
    }),

    // Updated mutation using the correct endpoint
    updateAudiobookRatingAPI: builder.mutation({
      query: ({ id, rating, review }) => ({
        url: `${AUDIOBOOK_ENDPOINT}/${id}/review/author`, // Correct endpoint
        method: "PUT", // Or PUT, depending on your API
        body: { rating, review },
      }),
      invalidatesTags: ["Audiobook"], // Invalidate to refetch audiobooks
    }),
    // Mutations for CRUD operations:
    uploadAudiobookAPI: builder.mutation({
      query: (data) => ({
        url: `${AUDIOBOOK_ENDPOINT}/uploadaudiobook`,
        method: "POST",
        body: data, // 'data' will be the FormData object in this case
      }),
      invalidatesTags: ["Audiobook"], // Invalidate the "Audiobook" tag after upload
    }),
    updateAudiobookAPI: builder.mutation({
      query: ({ id, data }) => ({
        url: `${AUDIOBOOK_ENDPOINT}/${id}/update`,
        method: "PUT",
        body: data, // 'data' will be the FormData object here as well
      }),
      invalidatesTags: ["Audiobook"], // Invalidate after update
    }),
    deleteAudiobookAPI: builder.mutation({
      query: (id) => ({
        url: `${AUDIOBOOK_ENDPOINT}/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Audiobook"], // Invalidate after delete
    }),
    getAuthorBooksAPI: builder.query({
      query: (authorId) => ({
        url: `${AUDIOBOOK_ENDPOINT}/authorbooks/${authorId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Audiobook"],
    }),
  }),
});

export const {
  useGetAudiobooksAPIQuery,
  useSearchAudiobooksAPIQuery,
  useLazySearchAudiobooksAPIQuery,
  // useGetAuthorProfileAPIQuery,
  useGetAudiobooksByCategoryAPIQuery, //EXPORT the new query
  useAddAuthorRatingAPIMutation,
  useAddUserRatingAPIMutation,
  // Export the new mutation hook:
  useUpdateAudiobookRatingAPIMutation,
  // Export the existing mutation hooks:
  useUploadAudiobookAPIMutation,
  useUpdateAudiobookAPIMutation,
  useDeleteAudiobookAPIMutation,
  useGetAuthorBooksAPIQuery,
  useGetAudiobooksByAuthorQuery,
} = audiobookApiSlice;
