import { apiSlice } from "../apiSlice";

const AUDIOBOOK_ENDPOINT = "/api/audiobooks";

export const audiobookApiSlice = apiSlice.injectEndpoints({
  tagTypes: ["Audiobook"],
  endpoints: (builder) => ({
    getAudiobooksByCategoryAPI: builder.query({
      query: (category) => {
        const encodedCategory = encodeURIComponent(category);
        return {
          url: `${AUDIOBOOK_ENDPOINT}/category/${encodedCategory}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response.data,
      providesTags: (result, error, category) => [
        { type: "Audiobook", id: category },
      ],
    }),

    getAudiobooksAPI: builder.query({
      query: () => ({
        url: `${AUDIOBOOK_ENDPOINT}/getbooks`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
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

    getAudiobooksByAuthor: builder.query({
      query: (authorId) => ({
        url: `${AUDIOBOOK_ENDPOINT}/${authorId}/getbyauthor`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Audiobook"],
    }),

    addUserRatingAPI: builder.mutation({
      query: ({ id, rating, review }) => ({
        url: `${AUDIOBOOK_ENDPOINT}/${id}/review/user`,
        method: "PUT",
        body: { rating, review },
      }),
      invalidatesTags: ["Audiobook"],
    }),

    addAuthorRatingAPI: builder.mutation({
      query: ({ id, rating, review }) => ({
        url: `${AUDIOBOOK_ENDPOINT}/${id}/review/author`,
        method: "PUT",
        body: { rating, review },
      }),
      invalidatesTags: ["Audiobook"],
    }),

    uploadAudiobookAPI: builder.mutation({
      query: (data) => ({
        url: `${AUDIOBOOK_ENDPOINT}/uploadaudiobook`,
        method: "POST",
        body: data, // 'data' will be the FormData object in this case
      }),
      invalidatesTags: ["Audiobook"],
    }),

    updateAudiobookAPI: builder.mutation({
      query: ({ id, data }) => ({
        url: `${AUDIOBOOK_ENDPOINT}/${id}/update`,
        method: "PUT",
        body: data, // 'data' will be the FormData object here as well
      }),
      invalidatesTags: ["Audiobook"],
    }),

    deleteAudiobookAPI: builder.mutation({
      query: (id) => ({
        url: `${AUDIOBOOK_ENDPOINT}/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Audiobook"],
    }),

    getAuthorBooksAPI: builder.query({
      query: (authorId) => ({
        url: `${AUDIOBOOK_ENDPOINT}/authorbooks/${authorId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Audiobook"],
    }),
    addRatingAPI: builder.mutation({
      query: ({ audiobookId, rating, review }) => ({
        url: `${AUDIOBOOK_ENDPOINT}/review`,
        method: "PUT",
        body: { audiobookId, rating, review },
      }),
      invalidatesTags: ["Audiobook"],
    }),
  }),
});

export const {
  useGetAudiobooksAPIQuery,
  useSearchAudiobooksAPIQuery,
  useGetAudiobooksByCategoryAPIQuery,
  useAddAuthorRatingAPIMutation,
  useAddUserRatingAPIMutation,
  useUploadAudiobookAPIMutation,
  useUpdateAudiobookAPIMutation,
  useDeleteAudiobookAPIMutation,
  useGetAuthorBooksAPIQuery,
  useGetAudiobooksByAuthorQuery,
  useAddRatingAPIMutation,
} = audiobookApiSlice;
