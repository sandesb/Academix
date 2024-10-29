import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base URL for your Express server
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000', // Your Express server URL
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Create adminApi
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQuery,
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    getAdminCredentials: builder.query({
      query: ({ email, password }) => ({
        url: '/admin/login',
        method: 'GET',
        params: { email, password },
      }),
      transformResponse: (response) => ({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      }),
      providesTags: ['Admin'],
    }),
  }),
});


// Export hooks for usage in functional components
export const { useGetAdminCredentialsQuery } = adminApi;

export default adminApi;
