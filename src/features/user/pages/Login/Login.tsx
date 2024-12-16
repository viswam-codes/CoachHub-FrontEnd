import React ,{useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import { loginUser } from '../../services/userService';
import styles from './login.module.scss';
import { FcGoogle } from 'react-icons/fc';
import { CircularProgress } from '@mui/material';
import { Link,useNavigate } from 'react-router-dom';
import ModalForProfileCompletion from '../ProfileCompletion/ModalForProfileCompletion'


// Yup validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error , user } = useAppSelector((state) => state.user);
  const [isProfileCompletionRequired, setIsProfileCompletionRequired] = useState<boolean>(false);
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
      const data=  await dispatch(loginUser(values)).unwrap();
      console.log(data)
        console.log(data.isProfileCompleted)
        if(!data.
          isProfileCompleted
          ){
          setIsProfileCompletionRequired(true)
        }else{
           navigate("/");
        }
      } catch (err: any) {
        console.error('Login failed:', err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

 

  return (
    <div className={styles.login_page}>
       <div
            className={styles.login__logo}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            CoachHub
          </div>
      <div className={styles.login_form}>
        <h1>Welcome Back</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.form_group}>
            <div className={styles.input_wrapper}>
            {formik.touched.email && formik.errors.email && (
                <p className={styles.input_error}>{formik.errors.email}</p>
              )}
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.email && formik.errors.email ? styles.input_error : ''}
                required
              />
              
            </div>
            <div className={styles.input_wrapper}>
            {formik.touched.password && formik.errors.password && (
                <p className={styles.input_error}>{formik.errors.password}</p>
              )}
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.password && formik.errors.password ? styles.input_error : ''}
                required
              />
              
            </div>
            <button
              type="submit"
              disabled={loading || formik.isSubmitting}
              className={styles.login_button}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
            </button>
          </div>
        </form>
        {error && <p className={styles.error_message}>{error}</p>}
        <div className={styles.divider}>
          <span>or</span>
        </div>
        <button className={styles.google_button}>
          <FcGoogle className={styles.google_icon} />
          Sign in with Google
        </button>
        <p className={styles.signup_link}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
      <ModalForProfileCompletion
        show={isProfileCompletionRequired}
        onClose={() => setIsProfileCompletionRequired(false)}
      />
    </div>
  );
};

export default LoginPage;
