import React from 'react';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const NotFoundPage = () => {
  const theme = useTheme();

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.contrastText,
            mb: 3,
          }}
        >
          <SentimentVeryDissatisfiedIcon sx={{ fontSize: 60 }} />
        </Box>
        
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: '4rem', fontWeight: 700 }}>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Oops! Page not found
        </Typography>
        
        <Typography variant="body1" color="textSecondary" paragraph sx={{ maxWidth: 600, mb: 4 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
        >
          Return to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
