import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base URL for your Express server
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000', // Update this URL to match your production server when deployed
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Create repoApi
export const repoApi = createApi({
  reducerPath: 'repoApi',
  baseQuery: baseQuery,
  tagTypes: ['Repositories'],
  endpoints: (builder) => ({
    // Fetch all repositories
    getRepos: builder.query({
      query: () => '/repositories', // Fetch all repositories from Express backend
      providesTags: ['Repositories'],
    }),

    // Fetch a repository by ID
    getRepoById: builder.query({
      query: (id) => `/repositories/${id}`, // Fetch a repository by ID
      providesTags: (result, error, id) => [{ type: 'Repositories', id }],
    }),

    // Add a new repository
    addRepo: builder.mutation({
      query: (repo) => ({
        url: '/repositories',
        method: 'POST',
        body: repo, // Send the repository data to the backend
      }),
      invalidatesTags: ['Repositories'],
    }),

    // Update an existing repository
    updateRepo: builder.mutation({
      query: ({ id, repo }) => ({
        url: `/repositories/${id}`,
        method: 'PUT',
        body: repo, // Send updated repository data to the backend
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Repositories', id }],
    }),

    // Delete a repository by ID
    deleteRepo: builder.mutation({
      query: (id) => ({
        url: `/repositories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Repositories', id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetReposQuery,
  useGetRepoByIdQuery,
  useAddRepoMutation,
  useUpdateRepoMutation,
  useDeleteRepoMutation,
} = repoApi;

export default repoApi;
