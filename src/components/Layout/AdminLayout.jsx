import React from 'react';
import { Box } from '@mui/material';
import AdminSidebar from '../AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f1f5f9', p: 3, minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;