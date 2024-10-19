import { createApi } from '@reduxjs/toolkit/query/react';
import supabase from '../config/supabaseClient';
import { showToast } from '../utils/toast';

// Base query function for Supabase
const supabaseBaseQuery = async ({ url, method, body, returning }) => {
  let supabaseQuery;
  switch (method) {
    case 'select':
      supabaseQuery = supabase.from(url).select(body);
      break;
    case 'insert':
      supabaseQuery = supabase.from(url).insert(body);
      break;
    case 'update':
      if (!body.id) {
        return { error: { status: 'CUSTOM_ERROR', data: 'ID is required for update' } };
      }
      supabaseQuery = supabase.from(url).update(body).eq('id', body.id).select(); // Ensure id is used
      break;
    case 'upsert':
      supabaseQuery = supabase.from(url).upsert(body).eq('subjects_id', body.subjects_id).select();
      break;
      case 'upserting':
  supabaseQuery = supabase.from(url).upsert(body, { onConflict: 'content_id' }).select(); // Use POST for upsert
  break;

    case 'delete':
      supabaseQuery = supabase.from(url).delete().eq('id', body.id);
      break;
    default:
      return { error: { status: 'CUSTOM_ERROR', data: 'Invalid method' } };
  }

  const { data, error } = await supabaseQuery;
  if (error) {
    console.error('Error in Supabase query:', error);
    return { error: { status: 'CUSTOM_ERROR', data: error.message } };
  }

  return { data };
};

// API Definition
export const subjectsApi = createApi({
  reducerPath: 'subjectsApi',
  baseQuery: supabaseBaseQuery,
  tagTypes: ['Courses', 'Content'],
  endpoints: (builder) => ({
    // Fetch Courses
    getCourses: builder.query({
      query: () => ({ url: 'subjects', method: 'select', body: '*' }),
      providesTags: ['Courses'],
    }),

    // Add Course Mutation
    addCourse: builder.mutation({
      query: (course) => ({
        url: 'subjects',
        method: 'insert',
        body: course,
      }),
      invalidatesTags: ['Courses'],
      onQueryStarted(course, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(subjectsApi.util.updateQueryData('getCourses', undefined, (draft) => {
          draft.push(course);
        }));
        queryFulfilled.catch(patchResult.undo);
        queryFulfilled.finally(() => {
          showToast('success', 'Course added successfully');
          dispatch(subjectsApi.util.invalidateTags(['Courses']));
        });
      },
    }),

    // Update Course Mutation
    updateCourse: builder.mutation({
      query: ({ id, ...course }) => ({
        url: 'subjects',
        method: 'update',
        body: { id, ...course },
      }),
      invalidatesTags: ['Courses'],
      async onQueryStarted({ id, ...course }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          subjectsApi.util.updateQueryData('getCourses', undefined, (draft) => {
            const index = draft.findIndex((c) => c.id === id);
            if (index !== -1) draft[index] = { id, ...course };
          })
        );
        try {
          await queryFulfilled;
          showToast('success', 'Course updated successfully');
        } catch (error) {
          patchResult.undo();
          showToast('error', 'Failed to update course');
        } finally {
          dispatch(subjectsApi.util.invalidateTags(['Courses']));
        }
      },
    }),

    // Delete Course Mutation
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: 'subjects',
        method: 'delete',
        body: { id },
      }),
      invalidatesTags: ['Courses'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          subjectsApi.util.updateQueryData('getCourses', undefined, (draft) => {
            return draft.filter((course) => course.id !== id);
          })
        );
        try {
          await queryFulfilled;
          showToast('success', 'Course deleted successfully');
        } catch (error) {
          patchResult.undo();
          showToast('error', 'Failed to delete course');
        } finally {
          dispatch(subjectsApi.util.invalidateTags(['Courses']));
        }
      },
    }),

    // Load Note Query
    loadNote: builder.query({
      query: (id) => ({
        url: `subjects?id=eq.${id}`,
        method: 'select',
        body: '*',
      }),
      providesTags: ['Courses'],
    }),

    // Update Note Mutation
    updateNote: builder.mutation({
      query: ({ id, note }) => ({
        url: 'subjects',
        method: 'update',
        body: { id, note },
      }),
      invalidatesTags: ['Courses'],
    }),

    // Load Content Query
    loadContent: builder.query({
      query: ({ subjects_id, matric }) => {
        const matricFilter = matric ? `&matric=eq.${matric}` : `&matric=is.null`;
        return {
          url: `content?subjects_id=eq.${subjects_id}${matricFilter}`,
          method: 'select',
          body: '*',
        };
      },
      providesTags: ['Courses'],
    }),

    viewContent: builder.query({
      query: ({ content_id }) => {
        console.log(`Fetching note for content_id: ${content_id}`); // Debugging log
        return `content?content_id=eq.${content_id}`;
      },
      providesTags: ['Notes'],
    }),
    

    // Update Content Mutation
    updateContent: builder.mutation({
      query: ({ content_id, subjects_id, matric, content, name }) => ({
        url: 'content',
        method: 'upsert',
        body: { content_id, subjects_id, matric, note: content, name },
        returning: 'representation',
      }),
      invalidatesTags: ['Content'],
    }),

// Edit Content Mutation with POST (for upsert)
// Update Content Mutation (for client-side with subjects_id)
// Edit Content Mutation for admin (updating content based on content_id)
editContent: builder.mutation({
  query: ({ content_id, content, name }) => ({
    url: `content?content_id=eq.${content_id}`, // Only use content_id for admin updates
    method: 'upserting', // Use PATCH for updates
    body: { note: content, name }, // Only send note and name
    returning: 'representation', // Return the updated row
  }),
  invalidatesTags: ['Content'],
}),









 // Fetch Content
getContent: builder.query({
  query: ({ subject_id, matric }) => {
    let filterQuery = '';
    if (subject_id) {
      filterQuery += `subjects_id=eq.${subject_id}`;
    }
    // Only include the matric filter if matric is not null
    if (matric) {
      filterQuery += (filterQuery ? '&' : '') + `matric=eq.${matric}`;
    }
    return {
      url: `content${filterQuery ? '?' + filterQuery : ''}`, // Add filters to URL if any exist
      method: 'select',
      body: 'content_id, name, matric, note', // Ensure the body fetches content_id, name, matric, and note
    };
  },
  providesTags: ['Content'],
}),


    // Add Content Copy Mutation
    addContentCopy: builder.mutation({
      query: (newContent) => ({
        url: 'content',
        method: 'insert',
        body: newContent,
      }),
      invalidatesTags: ['Content'],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useUpdateNoteMutation,
  useLoadNoteQuery,
  useLoadContentQuery,
  useUpdateContentMutation,
  useEditContentMutation,
  useAddContentCopyMutation,
  useGetContentQuery,
  useViewContentQuery,
} = subjectsApi;

export default subjectsApi;
