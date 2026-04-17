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

const drawerWidth = 272;

const ParentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard',        icon: <DashboardIcon />,     path: '/parent/dashboard' },
    { text: 'StudentProfile',   icon: <PersonIcon />,        path: '/parent/profile' },
    { text: 'Attendance',       icon: <CalendarIcon />,      path: '/parent/attendance' },
    { text: 'Leave Status',     icon: <DescriptionIcon />,   path: '/parent/leaves' },
    // { text: 'Complaints',    icon: <ComplaintIcon />,     path: '/parent/complaints' },
    { text: 'Notice Board',     icon: <AnnouncementIcon />,  path: '/parent/notices' },
    { text: 'Fees',             icon: <MoneyIcon />,         path: '/parent/fees' },
    { text: 'Notifications',    icon: <NotificationsIcon />, path: '/parent/notifications' },
    { text: 'Mess Menu',        icon: <RestaurantIcon />,    path: '/parent/mess' },
    { text: 'Visit Request',    icon: <VisitIcon />,         path: '/parent/visits' },
    { text: 'Chat with Warden', icon: <ChatIcon />,          path: '/parent/chat' },
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
          backgroundColor: '#ffffff',
          borderRight: '1px solid #d1fae5',
          boxShadow: '4px 0 20px rgba(6,95,70,0.07)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2.5,
          background: 'linear-gradient(160deg, #064e3b 0%, #059669 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Avatar
          sx={{
            width: 58,
            height: 58,
            bgcolor: 'rgba(255,255,255,0.15)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.4rem',
            border: '2px solid rgba(255,255,255,0.25)',
          }}
        >
          {user?.name?.charAt(0) || 'P'}
        </Avatar>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2, fontSize: '0.95rem' }}
          >
            {user?.name || 'Parent'}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem' }}
          >
            {user?.email || 'parent@example.com'}
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 0.5,
            px: 1.5,
            py: 0.3,
            bgcolor: 'rgba(255,255,255,0.15)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Typography sx={{ fontSize: '0.65rem', color: '#d1fae5', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Parent Portal
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2.5, pt: 2, pb: 0.5 }}>
        <Typography
          sx={{ fontSize: '0.63rem', fontWeight: 700, color: '#10b981', letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          Navigation
        </Typography>
      </Box>

      <List sx={{ px: 1.5, flex: 1, overflowY: 'auto', pb: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.3 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: '10px',
                  px: 1.5,
                  py: 0.9,
                  borderLeft: isActive ? '3px solid #059669' : '3px solid transparent',
                  bgcolor: isActive ? '#f0fdf4' : 'transparent',
                  transition: 'all 0.15s',
                  '&.Mui-selected': {
                    backgroundColor: '#f0fdf4',
                    '&:hover': { backgroundColor: '#d1fae5' },
                  },
                  '&:hover': { backgroundColor: '#f0fdf4' },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? '#059669' : '#6ee7b7',
                    '& .MuiSvgIcon-root': { fontSize: '1.1rem' },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.83rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#065f46' : '#374151',
                    letterSpacing: '-0.01em',
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      width: 6, height: 6,
                      borderRadius: '50%',
                      bgcolor: '#059669',
                      flexShrink: 0,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ bgcolor: '#d1fae5', mx: 2 }} />

      <Box sx={{ px: 1.5, py: 1.5 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '10px',
            px: 1.5,
            py: 0.9,
            bgcolor: '#fff1f2',
            border: '1px solid #fecdd3',
            transition: 'all 0.15s',
            '&:hover': { bgcolor: '#ffe4e6' },
          }}
        >
          <ListItemIcon sx={{ color: '#ef4444', minWidth: 36, '& .MuiSvgIcon-root': { fontSize: '1.1rem' } }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontSize: '0.83rem', fontWeight: 600, color: '#ef4444' }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default ParentSidebar;