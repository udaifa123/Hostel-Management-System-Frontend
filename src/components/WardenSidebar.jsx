import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  Divider,
  Avatar
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MeetingRoom as RoomIcon,
  EventSeat as AttendanceIcon,
  ExitToApp as LeaveIcon,
  Report as ComplaintIcon,
  Chat as ChatIcon,
  Notifications as NoticeIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AttachMoney as FeesIcon,
  QrCodeScanner as QrCodeIcon,
  Build as MaintenanceIcon,
  Restaurant as MessIcon,
  Assessment as ReportsIcon,
  Visibility as VisitorsIcon,
  Inventory as AssetsIcon
} from '@mui/icons-material';

const drawerWidth = 270;

const WardenSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/warden/dashboard' },
    { text: 'Students', icon: <PeopleIcon />, path: '/warden/students' },
    { text: 'Rooms', icon: <RoomIcon />, path: '/warden/rooms' },
    { text: 'Attendance', icon: <AttendanceIcon />, path: '/warden/attendance' },
    { text: 'Leaves', icon: <LeaveIcon />, path: '/warden/leaves' },
    { text: 'Complaints', icon: <ComplaintIcon />, path: '/warden/complaints' },
    { text: 'Chat', icon: <ChatIcon />, path: '/warden/chat' },
    { text: 'Fees', icon: <FeesIcon />, path: '/warden/fees' },
    { text: 'Notices', icon: <NoticeIcon />, path: '/warden/notices' },
    { text: 'Visitors', icon: <VisitorsIcon />, path: '/warden/visitors' },
    { text: 'Assets', icon: <AssetsIcon />, path: '/warden/assets' },
    { text: 'Mess', icon: <MessIcon />, path: '/warden/mess' },
    { text: 'Reports', icon: <ReportsIcon />, path: '/warden/reports' },
    { text: 'QR Scanner', icon: <QrCodeIcon />, path: '/warden/qr-scanner' },
    { text: 'Maintenance', icon: <MaintenanceIcon />, path: '/warden/maintenance' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/warden/settings' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#ffffff',
          color: '#1e4430',
          borderRight: '1px solid #d4ead9',
          boxShadow: '4px 0 20px rgba(26,107,60,0.07)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box
        sx={{
          p: '28px 20px 22px',
          textAlign: 'center',
          background: 'linear-gradient(160deg, #1a6b3c 0%, #22914f 60%, #27a85c 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -28, right: -28,
            width: 100, height: 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -16, left: -16,
            width: 70, height: 70,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          },
        }}
      >
        <Avatar
          sx={{
            width: 62, height: 62,
            mx: 'auto', mb: 1.5,
            bgcolor: 'rgba(255,255,255,0.22)',
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: 500,
            border: '2.5px solid rgba(255,255,255,0.5)',
            position: 'relative', zIndex: 1,
          }}
        >
          {user?.name?.charAt(0) || 'W'}
        </Avatar>

        <Typography
          variant="subtitle1"
          sx={{ color: '#fff', fontWeight: 500, fontSize: '0.95rem', position: 'relative', zIndex: 1 }}
        >
          {user?.name || 'Warden'}
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.72rem', display: 'block', mt: 0.3, position: 'relative', zIndex: 1 }}
        >
          {user?.email || 'warden@hostel.com'}
        </Typography>

        <Box
          sx={{
            display: 'inline-block', mt: 1.2,
            px: 1.8, py: 0.4,
            borderRadius: '20px',
            bgcolor: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.32)',
            position: 'relative', zIndex: 1,
          }}
        >
          <Typography sx={{ fontSize: '9px', color: '#fff', fontWeight: 500, letterSpacing: '1.2px' }}>
            WARDEN
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: '3px', background: 'linear-gradient(90deg, #1a6b3c, #4cdb82, #1a6b3c)' }} />

      <Typography
        sx={{
          fontSize: '9.5px', fontWeight: 500,
          letterSpacing: '1.5px', color: '#a8c5b0',
          px: 2.5, pt: 2.2, pb: 0.5,
          textTransform: 'uppercase',
        }}
      >
        Main Navigation
      </Typography>

      <List sx={{ px: 1.2, pb: 1, flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: '2px' }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: '10px',
                  py: '8px', px: '12px',
                  transition: 'background 0.15s, transform 0.1s',
                  background: isActive
                    ? 'linear-gradient(135deg, #1a6b3c 0%, #27a85c 100%)'
                    : 'transparent',
                  boxShadow: isActive ? '0 3px 12px rgba(26,107,60,0.28)' : 'none',
                  '&.Mui-selected': { bgcolor: 'transparent' },
                  '&.Mui-selected:hover': {
                    background: 'linear-gradient(135deg, #1a6b3c 0%, #27a85c 100%)',
                  },
                  '&:hover': {
                    bgcolor: isActive ? 'transparent' : '#edf7f0',
                    background: isActive
                      ? 'linear-gradient(135deg, #1a6b3c 0%, #27a85c 100%)'
                      : '#edf7f0',
                    transform: 'translateX(2px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? '#ffffff' : '#3aaa66',
                    '& svg': { fontSize: '1.15rem' },
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? '#ffffff' : '#1e4430',
                    letterSpacing: '0.15px',
                  }}
                />

                {isActive && (
                  <Box
                    sx={{
                      width: 6, height: 6,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.65)',
                      ml: 1, flexShrink: 0,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 1.5, borderColor: '#daeee0' }} />

      <List sx={{ px: 1.2, pt: 1, pb: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '10px',
              py: '8px', px: '12px',
              border: '1.5px solid #fcd5d5',
              bgcolor: '#fff8f8',
              transition: 'background 0.15s, transform 0.1s',
              '&:hover': { bgcolor: '#fee2e2', transform: 'translateX(2px)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#e53e3e', '& svg': { fontSize: '1.15rem' } }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: '0.86rem', fontWeight: 500, color: '#c53030' }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      <Box
        sx={{
          mx: 1.2, mb: 1.5,
          p: '10px 14px',
          borderRadius: '10px',
          bgcolor: '#f0faf4',
          border: '1px solid #c8e6c9',
          textAlign: 'center',
        }}
      >
        <Typography sx={{ fontSize: '11px', color: '#2e7d50', fontWeight: 500 }}>
          Hostel Management System
        </Typography>
        <Typography sx={{ fontSize: '10px', color: '#8fc4a1', mt: 0.3 }}>
          v1.0 · Warden Portal
        </Typography>
      </Box>
    </Drawer>
  );
};

export default WardenSidebar;