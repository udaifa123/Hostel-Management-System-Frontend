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
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  ReportProblem as ComplaintIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationsIcon,
  Chat as ChatIcon,
  Login as VisitIcon,
  Restaurant as RestaurantIcon,
  Logout as LogoutIcon,
  Announcement as AnnouncementIcon
} from '@mui/icons-material';

const drawerWidth = 280;

const ParentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/parent/dashboard' },
    { text: 'StudentProfile', icon: <PersonIcon />, path: '/parent/profile' },
    { text: 'Attendance', icon: <CalendarIcon />, path: '/parent/attendance' },
    { text: 'Leave Status', icon: <DescriptionIcon />, path: '/parent/leaves' },
    // { text: 'Complaints', icon: <ComplaintIcon />, path: '/parent/complaints' },
    { text: 'Notice Board', icon: <AnnouncementIcon />, path: '/parent/notices' },
    { text: 'Fees', icon: <MoneyIcon />, path: '/parent/fees' },
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/parent/notifications' },
    { text: 'Mess Menu', icon: <RestaurantIcon />, path: '/parent/mess' },
    { text: 'Visit Request', icon: <VisitIcon />, path: '/parent/visits' },
    { text: 'Chat with Warden', icon: <ChatIcon />, path: '/parent/chat' }
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
          background: 'linear-gradient(180deg, #065f46 0%, #047857 60%, #059669 100%)',
          color: 'white',
          borderRight: 'none',
          boxShadow: '4px 0 24px rgba(6,95,70,0.18)'
        }
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar sx={{
          width: 60, height: 60, mx: 'auto', mb: 2,
          background: 'linear-gradient(135deg, #fff, #e8f5e9)',
          color: '#047857',
          fontWeight: 700,
          fontSize: '1.5rem'
        }}>
          {user?.name?.charAt(0) || 'P'}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>
          {user?.name || 'Parent'}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.85, color: '#6ee7b7' }}>
          {user?.email || 'parent@example.com'}
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />

      <List sx={{ mt: 2, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: '10px',
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.18)',
                  borderLeft: '4px solid #6ee7b7',
                  pl: '12px',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' }
                },
                '&:hover': { bgcolor: 'rgba(255,255,255,0.10)' }
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#6ee7b7' : 'rgba(255,255,255,0.85)', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.88rem',
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.85)'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem disablePadding sx={{ mt: 2 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '10px',
              bgcolor: 'rgba(239,68,68,0.15)',
              '&:hover': { bgcolor: 'rgba(239,68,68,0.25)' }
            }}
          >
            <ListItemIcon sx={{ color: '#fca5a5', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 600, color: '#fca5a5' }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default ParentSidebar;