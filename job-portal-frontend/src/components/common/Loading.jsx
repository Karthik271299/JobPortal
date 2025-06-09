import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

const Loading = ({ message = 'Loading...', fullScreen = false }) => {
  const containerSx = fullScreen 
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        py: 4
      };

  return (
    <Fade in timeout={300}>
      <Box sx={containerSx}>
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{ 
            mb: 2,
            color: 'primary.main'
          }} 
        />
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {message}
        </Typography>
      </Box>
    </Fade>
  );
};

export default Loading;
