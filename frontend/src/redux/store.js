import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import tutorReducer from './slices/tutorSlice'
import parentReducer from './slices/parentSlice'
import sessionReducer from './slices/sessionSlice'
import notificationReducer from './slices/notificationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tutor: tutorReducer,
    parent: parentReducer,
    session: sessionReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

