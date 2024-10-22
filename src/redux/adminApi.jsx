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
    // Fetch only email and password from the admin table
    getAdminCredentials: builder.query({
      query: () => '/admin', // Call the Express endpoint to fetch all admin
      transformResponse: (response) => response.map(admin => ({
        email: admin.email,
        password: admin.password,
      })), // Transform the response to return only email and password fields
      providesTags: ['Admin'],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetAdminCredentialsQuery } = adminApi;

export default adminApi;
