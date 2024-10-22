import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),  // Your backend API base URL
  endpoints: (builder) => ({
    // Fetch all messages
    getMessages: builder.query({
      query: () => '/messages',  // Backend route to get all messages
    }),
    // Add a new message
    addMessage: builder.mutation({
      query: (newMessage) => ({
        url: '/messages',
        method: 'POST',
        body: newMessage,
      }),
    }),
    // Delete a message
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: 'DELETE',
      }),
      // Optimistic update: remove the message from the cache before the server responds
      async onQueryStarted(messageId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          messagesApi.util.updateQueryData('getMessages', undefined, (draft) => {
            return draft.filter((message) => message.message_id !== messageId);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetMessagesQuery, useAddMessageMutation, useDeleteMessageMutation } = messagesApi;

export default messagesApi;