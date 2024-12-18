/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { signupUser, loginUser,logoutUser } from '../services/userService';
import { completeUserProfile } from '../services/userService';

interface UserState {
  user: {
    userName:string,
    email:string,
    phone:string,
    password:string,
    isProfileCompleted:boolean,
    goal?:string,
    image?:string,
    trainer?:string,
    dietplan?:string,

  }  | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // Login user logic
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload; // Update with user data
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload?.message || 'An error occurred during login';
      })
      // Signup logic
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred during signup';
      })


      .addCase(completeUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user = { ...state.user, ...action.payload }; // Update user state
        }
      })
      .addCase(completeUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An error occurred during profile completion';
      })

        // Logout user logic
        .addCase(logoutUser.pending, (state) => {
          state.loading = true;
        })
        .addCase(logoutUser.fulfilled, (state) => {
          state.loading = false;
          state.user = null; // Clear user data on successful logout
          state.error = null;
        })
        .addCase(logoutUser.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload?.message || 'An error occurred during logout';
        });
  },
});


export default userSlice.reducer;
