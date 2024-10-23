import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base URL for your Express server
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000", // Change this to your deployed backend URL when in production
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Create subjectApi
export const subjectApi = createApi({
  reducerPath: "subjectApi",
  baseQuery: baseQuery,
  tagTypes: ["Subjects"],
  endpoints: (builder) => ({
    // Fetch all subjects without any filters
    fetchSubjects: builder.query({
      query: () => ({
        url: "/api/all-subjects", // Call the new endpoint
        method: "GET",
      }),
      providesTags: ["Subjects"],
    }),

    // Add a new subject
    addSubject: builder.mutation({
      query: (subject) => ({
        url: "/api/add-subjects",
        method: "POST",
        body: {
          id: subject.id,
          title: subject.title,
          progress: subject.progress,
          icon: subject.icon,
          bgColor: subject.bgColor,
          matric: subject.matric,
          content_id: subject.content_id,
          note: {
            time: 1729351709073,
            blocks: [
              {
                id: "56BN6lrTNl",
                data: { text: "write here..." },
                type: "paragraph",
              },
            ],
            version: "2.30.5",
          },
        },
      }),
      invalidatesTags: ["Subjects"],
    }),

    // Fetch all subjects with optional matric filtering
    getSubjects: builder.query({
      query: ({ matric = null }) => {
        // Construct query parameter for matric filtering
        let matricFilter = "is.null"; // Default to 'is.null' for admin or guest
        if (matric !== "GUEST" && matric !== null) {
          matricFilter = `eq.${matric}`; // Filter for specific matric number
        }

        return {
          url: `/api/subjects?matric=${matricFilter}`, // Use query parameter to filter based on matric value
          method: "GET",
        };
      },
      providesTags: ["Subjects"],
    }),

    updateSubject: builder.mutation({
      query: ({ id, ...subject }) => ({
        url: `/api/subjects/${id}`, // Use PATCH method
        method: "PATCH",
        body: subject, // Send only the fields that are being updated
      }),
      invalidatesTags: ["Subjects"],
      async onQueryStarted({ id, ...subject }, { dispatch, queryFulfilled }) {
        // Optimistic update before the server responds
        const patchResult = dispatch(
          subjectApi.util.updateQueryData("getSubjects", undefined, (draft) => {
            const index = draft.findIndex((s) => s.id === id);
            if (index !== -1) draft[index] = { id, ...subject };
          })
        );
        try {
          await queryFulfilled;
          showToast("success", "Subject updated successfully");
        } catch (error) {
          patchResult.undo();
          showToast("error", "Failed to update subject");
        } finally {
          dispatch(subjectApi.util.invalidateTags(["Subjects"]));
        }
      },
    }),

    // Delete a subject
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/api/subjects/${id}`, // Assuming subjects are deleted by ID
        method: "DELETE",
      }),
      invalidatesTags: ["Subjects"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update before the server responds
        const patchResult = dispatch(
          subjectApi.util.updateQueryData("getSubjects", undefined, (draft) => {
            return draft.filter((subject) => subject.id !== id);
          })
        );
        try {
          await queryFulfilled;
          showToast("success", "Subject deleted successfully");
        } catch (error) {
          patchResult.undo();
          showToast("error", "Failed to delete subject");
        } finally {
          dispatch(subjectApi.util.invalidateTags(["Subjects"]));
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useAddSubjectMutation,
  useGetSubjectsQuery,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useFetchSubjectsQuery, // New hook for fetching all subjects
} = subjectApi;

export default subjectApi;
