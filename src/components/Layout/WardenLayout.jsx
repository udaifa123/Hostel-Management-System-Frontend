import React from 'react';
import { Box } from '@mui/material';
import WardenSidebar from '../WardenSidebar';

const WardenLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <WardenSidebar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f3f8f5', p: 3, minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
};

export default WardenLayout;