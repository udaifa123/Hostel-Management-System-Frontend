import React from 'react';
import { Box } from '@mui/material';
import AdminSidebar from '../AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f1f5f9',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;