import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link as MuiLink,
  Paper,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import { requestPasswordReset } from '../../services/api';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
});

const ForgotPasswordForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setError(null);
        
        await requestPasswordReset(values.email);
        setIsSubmitted(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to send reset instructions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (isSubmitted) {
    return (
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            marginTop: 8,
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM12 13L4 8V18H20V8L12 13Z" fill="#1976d2"/>
            </svg>
          </Box>
          
          <Typography component="h1" variant="h5" gutterBottom>
            Check your email
          </Typography>
          
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            We've sent password reset instructions to {formik.values.email}. 
            Please check your email and follow the link to reset your password.
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Didn't receive the email? Check your spam folder or{' '}
            <MuiLink 
              component="button" 
              type="button" 
              onClick={() => setIsSubmitted(false)}
              sx={{ textDecoration: 'none' }}
            >
              try again
            </MuiLink>.
          </Typography>
          
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
          >
            Back to login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
          Forgot your password?
        </Typography>
        
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3, maxWidth: '400px' }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ mt: 1, width: '100%' }}
          noValidate
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Send Reset Instructions'
            )}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <MuiLink
              component={Link}
              to="/login"
              variant="body2"
              sx={{ textDecoration: 'none' }}
            >
              Back to login
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordForm;
