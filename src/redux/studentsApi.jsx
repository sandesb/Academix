import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base URL for your Express server
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000', // Change this to your deployed backend URL when in production
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Create studentsApi
export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: baseQuery,
  tagTypes: ['Students'],
  endpoints: (builder) => ({
    // Fetch all students
    getStudents: builder.query({
      query: () => '/students', // Fetch all students from the Express backend
      providesTags: ['Students'],
    }),
    
    // Fetch student by ID
    getStudentById: builder.query({
      query: (id) => `/students/${id}`, // Fetch a student by ID
      providesTags: (result, error, id) => [{ type: 'Students', id }],
    }),
    
    // Add a new student
    addStudent: builder.mutation({
      query: (student) => ({
        url: '/students',
        method: 'POST',
        body: student, // Send new student data to the backend
      }),
      invalidatesTags: ['Students'],
    }),
    
    // Update an existing student
    updateStudent: builder.mutation({
      query: ({ id, student }) => ({
        url: `/students/${id}`,
        method: 'PUT',
        body: student, // Send updated student data to the backend
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Students', id }],
    }),
    
    // Delete a student by ID
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Students', id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetStudentsQuery,
  useAddStudentMutation,
  useGetStudentByIdQuery,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;

export default studentsApi;
