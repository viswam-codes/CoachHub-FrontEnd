/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './Signup.module.scss';
import signupImage from '../../../../assets/Images/girl-holding-blue-rolled-yoga-matte-light-dumbbell.jpg'; // Adjust the path as needed
import { useAppDispatch,useAppSelector } from '../../../../hooks/hooks';
import { signupUser, verifyOtp } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import OtpModal from '../OtpModal/OtpModal';
import { Google as GoogleIcon } from '@mui/icons-material';
import {CircularProgress} from '@mui/material';

interface SignupFormValues {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const {loading,error}=useAppSelector((state)=>state.user)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validationSchema: Yup.Schema<SignupFormValues> = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/\d/, 'Password must contain at least one number')
      .matches(
        /[@$!%*?&]/,
        'Password must contain at least one special character',
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(signupUser(values)).unwrap();
        setUserEmail(values.email);
        setIsOtpModalOpen(true);
        setSnackbar({
          open: true,
          message: 'Signup successful! OTP sent to your email.',
          severity: 'success',
        });
        formik.resetForm();
      } catch (error: any) {
        const { status, message } = error || {};

        if (status === 409) {
          if (message.includes('not verified')) {
            setUserEmail(values.email);
            setIsOtpModalOpen(true);
            setSnackbar({
              open: true,
              message: 'Existing unverified user. OTP resent to your email.',
              severity: 'success',
            });
          } else if (message.includes('and is verified')) {
            setSnackbar({
              open: true,
              message: 'Account already exists and is verified. Please log in.',
              severity: 'warning',
            });
            navigate('/login');
          }
        } else {
          console.error('Signup failed:', error);
          setSnackbar({
            open: true,
            message:
              message ||
              'An error occurred during signup. Please try again later.',
            severity: 'error',
          });
        }
      }
    },
  });

  const handleGoogleSignIn = async () => {};

  const handleOtpVerify = async (otp: string) => {
    try {
      const isVerified = await verifyOtp(userEmail, otp); // Call the OTP verification function

      if (isVerified) {
        setSnackbar({
          open: true,
          message: 'OTP verified successfully!',
          severity: 'success',
        });
        setIsOtpModalOpen(false);
        setTimeout(()=>navigate("/login"),1000)
      } else {
        setSnackbar({
          open: true,
          message: 'Invalid or expired OTP.',
          severity: 'warning',
        });
      }
    } catch (error) {
      console.error('An error occurred during OTP verification:', error);
      setSnackbar({
        open: true,
        message: 'Something went wrong. Please try again later.',
        severity: 'error',
      });
    }
  };

  return (
    <div className={styles.signup__container}>
      <div className={styles.signup__form__container}>
      <div
            className={styles.signup__logo}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            CoachHub
          </div>
        <Box className={styles.signup__form__wrapper}>
       

          <Typography variant="h4" className={styles.signup__title}>
            Create Your Account
          </Typography>
          <Typography variant="body2" className={styles.signup__subtitle}>
            Start your fitness journey with us
          </Typography>

          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={formik.handleSubmit}
            className={styles.signup__form}
          >
            <TextField
              fullWidth
              label="Username"
              name="username"
              variant="outlined"
              margin="normal"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              className={styles.signup__input}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              margin="normal"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              className={styles.signup__input}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              type="tel"
              variant="outlined"
              margin="normal"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              className={styles.signup__input}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              margin="normal"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              className={styles.signup__input}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
              margin="normal"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              className={styles.signup__input}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={styles.signup__button}
            >
             {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
              // disabled={disabled}
              className={styles.google_signin_button }
            >
              Sign In with Google
            </Button>

            <Typography variant="body2" className={styles.signup__login__link}>
              Already have an account? <a href="/login">Log In</a>
            </Typography>
          </Box>
        </Box>
      </div>
      <div className={styles.signup__image__container}>
        <img
          src={signupImage}
          className={styles.signup__image__placeholder}
          alt="Profile"
        />
      </div>
      <OtpModal
        open={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onVerify={handleOtpVerify}
        email={userEmail}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signup;
