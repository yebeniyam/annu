import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  return (
    <Container component="main" maxWidth="xs">
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
          <LockOutlined color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography component="h1" variant="h5">
            Sign in to ANNU ERP
          </Typography>
        </Box>
        
        <LoginForm redirectTo={from} />
      </Box>
    </Container>
  );
};

export default LoginPage;
