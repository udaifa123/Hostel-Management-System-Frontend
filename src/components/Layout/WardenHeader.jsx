import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  alpha,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationIcon,
  Chat as ChatIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useHostel } from '../../context/HostelContext';

const WardenHeader = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { hostelName } = useHostel();

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'rgba(11,18,32,0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
        boxShadow: 'none'
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuClick}
          sx={{ mr: 2, color: '#C9A84C' }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1, color: '#F1F5F9' }}>
          {hostelName || 'Hostel Management'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Messages">
            <IconButton sx={{ color: '#94A3B8' }} onClick={() => navigate('/warden/chat')}>
              <Badge badgeContent={3} color="error">
                <ChatIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton sx={{ color: '#94A3B8' }} onClick={() => navigate('/warden/notices')}>
              <Badge badgeContent={5} color="error">
                <NotificationIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <IconButton sx={{ color: '#94A3B8' }} onClick={() => navigate('/warden/profile')}>
              <AccountIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default WardenHeader;