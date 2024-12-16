/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { resendOtp } from '../../services/userService';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import './OtpModal.scss';

interface OtpModalProps {
  open: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  email: string; // Add this prop
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  },
);

const OtpModal: React.FC<OtpModalProps> = ({
  open,
  onClose,
  onVerify,
  email,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [timeRemaining, setTimeRemaining] = useState(1 * 60); // 5 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    new Array(6).fill(null),
  );
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') return; // Prevent close on clickaway
    setSnackbar({ ...snackbar, open: false });
  };

  // Reset timer and active state when modal opens
  useEffect(() => {
    if (open) {
      setTimeRemaining(1 * 60);
      setIsTimerActive(true);
      setOtp(new Array(6).fill(''));
    }
  }, [open]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerActive(false);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const handleOtpChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input when a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6 && isTimerActive) {
      onVerify(otpString);
      setOtp(new Array(6).fill(''));
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleResendOtp = async () => {
    try {
      console.log(email);
      const response = await resendOtp(email); // Expect an object { success, message }
      if (response) {
        setTimeRemaining(1 * 60); // Restart the timer
        setIsTimerActive(true);
        setOtp(new Array(6).fill('')); // Clear the OTP input
        setSnackbar({
          open: true,
          message: response.message || 'OTP resent successfully',
          severity: 'success',
        }); // Show the success message
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to resend OTP. Please try again.',
          severity: 'error',
        });
      }
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Something went wrong while resending OTP.',
        severity: 'error',
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>OTP Verification</DialogTitle>
      <DialogContent>
        <div className="otp-timer">
          {isTimerActive ? (
            <p>Time Remaining: {formatTime(timeRemaining)}</p>
          ) : (
            <p>OTP Expired</p>
          )}
        </div>

        <div className="otp-input-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleOtpChange(index, e)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                handleOtpKeyDown(index, e)
              }
              ref={(el) => (inputRefs.current[index] = el)}
              className="otp-input"
              disabled={!isTimerActive}
            />
          ))}
        </div>

        {!isTimerActive && (
          <Button
            onClick={handleResendOtp}
            color="primary"
            variant="contained"
            className="resend-otp-btn"
          >
            Resend OTP
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleVerify}
          color="primary"
          variant="contained"
          disabled={otp.join('').length !== 6 || !isTimerActive}
        >
          Verify
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default OtpModal;
