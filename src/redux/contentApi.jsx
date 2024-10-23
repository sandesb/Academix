import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base URL for your Express server
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api', // Adjust this for production
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Create contentApi
export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: baseQuery,
  tagTypes: ['Content', 'Subjects'], // Both tags for invalidation
  endpoints: (builder) => ({
    // Add a content copy and insert it into both the content and subjects table
    addContentCopy: builder.mutation({
      query: (newContent) => ({
        url: '/content',
        method: 'POST',
        body: newContent,
      }),
      invalidatesTags: ['Content', 'Subjects'], // Invalidate both Content and Subjects tags to trigger refresh
    }),
  }),
});

// Export hooks for usage in functional components
export const { useAddContentCopyMutation } = contentApi;

export default contentApi;
