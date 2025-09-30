import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerificationEmail } from '../services/api';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Container, 
  Paper, 
  Snackbar, 
  Alert,
  Divider,
  Grid
} from '@mui/material';
import { VerifiedUser as VerifiedUserIcon, Email as EmailIcon } from '@mui/icons-material';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: 6000
  });

  const showSnackbar = (message, severity = 'info', autoHideDuration = 6000) => {
    setSnackbar({
      open: true,
      message,
      severity,
      autoHideDuration
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      const emailParam = searchParams.get('email');
      
      if (emailParam) {
        setEmail(emailParam);
      } else if (localStorage.getItem('pendingVerificationEmail')) {
        setEmail(localStorage.getItem('pendingVerificationEmail'));
      }

      if (token) {
        try {
          setStatus('verifying');
          const result = await verifyEmail(token);
          
          if (result.success) {
            setStatus('verified');
            showSnackbar(result.message || 'Email verified successfully!', 'success');
            // Clear pending email from storage
            localStorage.removeItem('pendingVerificationEmail');
            // Redirect to login after a short delay
            setTimeout(() => navigate('/login'), 3000);
          } else {
            throw new Error(result.message || 'Verification failed');
          }
        } catch (error) {
          console.error('Verification error:', error);
          setStatus('error');
          showSnackbar(
            error.message || 'Failed to verify email. The link may be invalid or expired.', 
            'error',
            10000
          );
        }
      } else {
        setStatus('no-token');
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  const handleResendEmail = async () => {
    if (!email) {
      showSnackbar('No email address provided. Please try registering again.', 'error');
      return;
    }

    try {
      setIsResending(true);
      const result = await resendVerificationEmail(email);
      
      if (result.success) {
        showSnackbar(
          result.message || 'Verification email sent. Please check your inbox (and spam folder).', 
          'success'
        );
        // Store email in case user navigates away and comes back
        localStorage.setItem('pendingVerificationEmail', email);
      } else {
        throw new Error(result.message || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Resend error:', error);
      showSnackbar(
        error.message || 'Failed to resend verification email. Please try again later.', 
        'error',
        10000
      );
    } finally {
      setIsResending(false);
    }
  };

  if (status === 'verifying') {
    return (
      <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 3, color: 'primary.main' }} />
          <Typography component="h1" variant="h5" gutterBottom align="center">
            Verifying Your Email Address
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 2 }}>
            Please wait while we verify your email address. This may take a moment...
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (status === 'verified') {
    return (
      <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <VerifiedUserIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography component="h1" variant="h4" gutterBottom align="center">
            Email Verified Successfully!
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 3, maxWidth: '80%' }}>
            Thank you for verifying your email address. Your account is now active and ready to use.
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3, fontStyle: 'italic' }}>
            Redirecting you to the login page...
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/login')}
            sx={{ mt: 2, minWidth: 200 }}
            size="large"
          >
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  // Error or no-token state
  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <EmailIcon sx={{ fontSize: 80, color: 'error.main', mb: 2, opacity: 0.8 }} />
        <Typography component="h1" variant="h4" gutterBottom align="center">
          {status === 'error' ? 'Verification Failed' : 'Email Verification Required'}
        </Typography>
        
        <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 3, maxWidth: '90%' }}>
          {status === 'error' 
            ? 'We couldn\'t verify your email address. The verification link may have expired or is invalid.'
            : 'Please check your email for the verification link we sent you.'}
        </Typography>
        
        <Divider sx={{ width: '100%', my: 3 }} />
        
        <Typography variant="h6" gutterBottom align="center">
          Need a new verification email?
        </Typography>
        
        {email ? (
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            We can resend the verification email to <strong>{email}</strong>
          </Typography>
        ) : (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3, fontStyle: 'italic' }}>
            No email address found. Please register again.
          </Typography>
        )}
        
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleResendEmail}
              disabled={!email || isResending}
              startIcon={isResending ? <CircularProgress size={20} /> : null}
              sx={{ minWidth: 220 }}
              size="large"
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => navigate('/register')}
              disabled={isResending}
              size="large"
            >
              Back to Registration
            </Button>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Already have an account?{' '}
            <Button 
              color="primary" 
              onClick={() => navigate('/login')}
              sx={{ p: 0, minWidth: 'auto' }}
            >
              Log In
            </Button>
          </Typography>
        </Box>
      </Paper>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={snackbar.autoHideDuration} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%', maxWidth: 400 }}
          variant="filled"
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EmailVerificationPage;
