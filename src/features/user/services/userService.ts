/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios,{AxiosResponse} from "axios";

// Signup service
export const signupUser = createAsyncThunk(
  'user/signup',
  async (
    formData: { username: string; email: string; password: string; phone: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post('http://localhost:3000/users/register', formData);
      return response.data;
    } catch (error: any) {
      // Provide a consistent error structure
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || 'An error occurred during signup',
      });
    }
  }
);

//OTP verification service
interface VerifyOtpResponse {
    message: string;
  }

export const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      const response: AxiosResponse<VerifyOtpResponse> = await axios.post('http://localhost:3000/users/verify-otp', { email, otp });
      return response.data.message === 'OTP verified successfully.';
    } catch (error: any) {
      console.error('OTP verification failed:', error.response?.data?.message || error.message);
      return false;
    }
  };


//Resend OTP service
  export const resendOtp = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post('http://localhost:3000/users/resend-otp', { email });
      console.log(response.data)
      return response.data; // The data should be the object { success, message }
    } catch (error: any) {
      console.log("Error in resendOtp:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: 'Failed to resend OTP' };
    }
  };

  //Login Service
  
  export const loginUser = createAsyncThunk(
    'user/login',
    async (
      { email, password }: { email: string; password: string },
      { rejectWithValue }
    ) => {
      try {
        const response = await axios.post('http://localhost:3000/users/login', {
          email,
          password,
        },{withCredentials:true});
        return response.data; // Assuming the API returns user details and a token
      } catch (error: any) {
        console.log(error)
        return rejectWithValue({
          status: error.response?.status,
          message: error.response?.data?.message || 'An error occurred during login',
        });
      }
    }
  );
  