import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiReducer';
import subjectsApi from './subjectsApi';
import subjectApi from './subjectApi';
import studentsApi from './studentsApi';
import contentApi from './contentApi';



import contentAdminApi from './contentAdminApi';
import adminApi from './adminApi';
import repoApi from './repoApi'; 
import messagesApi from './messagesApi'; // Import repoApi
// Import repoApi
import userReducer from './userSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [subjectsApi.reducerPath]: subjectsApi.reducer,
    [subjectApi.reducerPath]: subjectApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    [contentApi.reducerPath]: contentApi.reducer,



    [contentAdminApi.reducerPath]: contentAdminApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [repoApi.reducerPath]: repoApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer, // Add repoApi reducer
     // Add repoApi reducer
    user: userReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(subjectsApi.middleware)
      .concat(subjectApi.middleware)
      .concat(studentsApi.middleware)
      .concat(contentApi.middleware)



      .concat(contentAdminApi.middleware)
      .concat(adminApi.middleware)
      .concat(repoApi.middleware)
      .concat(messagesApi.middleware), // Add repoApi middleware
});
