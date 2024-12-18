
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice/userSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web

// Persist configuration
const persistConfig = {
  key: 'user', // Key to store in localStorage
  storage,     // Storage engine
};

// Wrap the user reducer with persistReducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Configure the store
export const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Use the persisted reducer for the user slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor for persisting the store
export const persistor = persistStore(store);

// Export types for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
