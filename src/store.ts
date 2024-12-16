// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer, // Add your user slice
  },
});

// Export types for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
