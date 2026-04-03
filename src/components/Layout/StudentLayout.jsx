import React from 'react';
import { Box } from '@mui/material';
import StudentSidebar from '../StudentSidebar';

const StudentLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <StudentSidebar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f0fdf4', p: 3, minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
};

export default StudentLayout;