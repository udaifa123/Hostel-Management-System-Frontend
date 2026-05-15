import React from 'react';
import { Box } from '@mui/material';
import ParentSidebar from '../ParentSidebar';

const ParentLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <ParentSidebar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f0fdf4', p: 3, minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
};

export default ParentLayout;