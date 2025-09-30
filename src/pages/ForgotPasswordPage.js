import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { LockResetOutlined } from '@mui/icons-material';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <LockResetOutlined color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography component="h1" variant="h5">
            Reset Your Password
          </Typography>
        </Box>
        
        <ForgotPasswordForm />
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
