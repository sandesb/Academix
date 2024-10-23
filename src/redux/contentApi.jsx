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
   // Load content based on subjects_id and matric
   loadContent: builder.query({
    query: ({ subjects_id, matric }) => {
      const matricFilter = matric
        ? `&matric=eq.${matric}`
        : `&matric=is.null`;
      return {
        url: `/content?subjects_id=${subjects_id}${matricFilter}`,
        method: 'GET',
      };
    },
    providesTags: ['Content'],
  }),

    // Update Content Mutation
    updateContent: builder.mutation({
        query: ({ content_id, subjects_id, matric, content, name }) => ({
          url: `/content`, // PATCH route in your API
          method: 'PATCH',
          body: { content_id, subjects_id, matric, note: content, name },
        }),
        invalidatesTags: ['Content'], // Invalidate cache
        async onQueryStarted({ content_id, ...content }, { dispatch, queryFulfilled }) {
          // Optimistic update to improve UX
          const patchResult = dispatch(
            contentApi.util.updateQueryData('loadContent', undefined, (draft) => {
              const index = draft.findIndex((c) => c.content_id === content_id);
              if (index !== -1) draft[index] = { content_id, ...content };
            })
          );
          try {
            await queryFulfilled;
            showToast('success', 'Content updated successfully');
          } catch (error) {
            patchResult.undo(); // Rollback if there's an error
            showToast('error', 'Failed to update content');
          } finally {
            dispatch(contentApi.util.invalidateTags(['Content'])); // Invalidate tags to refresh
          }
        },
      }),
  }),
});

// Export hooks for usage in functional components
export const { useAddContentCopyMutation, useLoadContentQuery, useUpdateContentMutation } = contentApi;

export default contentApi;
