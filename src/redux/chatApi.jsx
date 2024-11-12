// chatApi.js (Redux Toolkit setup)
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api', 
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getChatResponse: builder.mutation({
      query: (message) => ({
        url: '/complete',
        method: 'POST',
        body: message,
      }),
    }),
  }),
});

export const { useGetChatResponseMutation } = chatApi;

export default chatApi;
