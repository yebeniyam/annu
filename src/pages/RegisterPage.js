import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { PersonAddOutlined } from '@mui/icons-material';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
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
          <PersonAddOutlined color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography component="h1" variant="h5">
            Create your ANNU ERP account
          </Typography>
        </Box>
        
        <RegisterForm />
      </Box>
    </Container>
  );
};

export default RegisterPage;
