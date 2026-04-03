import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Avatar,
  Divider,
  Badge,
  CircularProgress,
  // alpha,
  Button
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  EventNote as LeaveIcon,
  FactCheck as AttendanceIcon,
  Chat as ChatIcon,
  Person as ProfileIcon,
  ReportProblem as ComplaintIcon,
  Receipt as FeesIcon,
  Notifications as NotificationIcon,
  Visibility as VisitIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import studentService from '../services/studentService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const drawerWidth = 300;

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchUnreadCount();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await studentService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const notifications = await studentService.getNotifications();
      const unread = notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/student/dashboard' },
    { text: 'Apply Leave', icon: <LeaveIcon />, path: '/student/leaves' },
    { text: 'Attendance', icon: <AttendanceIcon />, path: '/student/attendance' },
    { text: 'Complaints', icon: <ComplaintIcon />, path: '/student/complaints' },
    { text: 'Fees', icon: <FeesIcon />, path: '/student/fees' },
    { 
      text: 'Notifications', 
      icon: (
        <Badge 
          badgeContent={unreadCount} 
          color="error"
        >
          <NotificationIcon />
        </Badge>
      ), 
      path: '/student/notifications' 
    },
    { text: 'Visits', icon: <VisitIcon />, path: '/student/visits' },
    { text: 'Chat', icon: <ChatIcon />, path: '/student/chat' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/student/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/student/settings' },
    { text: 'Help', icon: <HelpIcon />, path: '/student/help' },
  ];

  const handleLogout = () => {
    toast.loading('Logging out...', { id: 'logout' });
    setTimeout(() => {
      logout();
      toast.success('Logged out successfully!', { id: 'logout' });
      navigate('/login');
    }, 1000);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
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
          // Theme Change: Clean White Background
          background: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden'
        },
      }}
    >
      {/* Header Section */}
      <Box sx={{ flexShrink: 0, px: 2, pt: 3, pb: 2 }}>
        <Toolbar sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                mr: 2
              }}
            >
              <SchoolIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 800, fontSize: '1.1rem' }}>
                Ilham
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, letterSpacing: 1 }}>
                STUDENT
              </Typography>
            </Box>
          </Box>
        </Toolbar>

        {/* Profile Card */}
        <Box
          sx={{
            background: '#F8FAFC',
            borderRadius: '20px',
            p: 2,
            border: '1px solid #F1F5F9',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {loading ? (
              <CircularProgress size={40} sx={{ color: '#10B981', mr: 2 }} />
            ) : (
              <Avatar 
                src={profile?.profilePicture} 
                sx={{ 
                  background: '#10B981',
                  width: 50, 
                  height: 50,
                  mr: 2,
                  fontWeight: 'bold',
                }}
              >
                {getInitials(profile?.name || user?.name)}
              </Avatar>
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#1E293B', fontWeight: 700 }}>
                {profile?.name || user?.name || 'User'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HomeIcon sx={{ fontSize: 12, color: '#10B981' }} />
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  Room: {profile?.roomNumber || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mx: 2, my: 1, opacity: 0.5 }} />

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1 }}>
        <List>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isSelected}
                  sx={{
                    borderRadius: '12px',
                    py: 1.2,
                    '&:hover': { bgcolor: '#F0FDF4' },
                    '&.Mui-selected': { 
                      bgcolor: '#DCFCE7',
                      '&:hover': { bgcolor: '#DCFCE7' },
                      '& .MuiListItemIcon-root': { color: '#059669' },
                      '& .MuiListItemText-primary': { color: '#059669', fontWeight: 700 }
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isSelected ? '#059669' : '#94A3B8',
                    minWidth: 40 
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      '& .MuiTypography-root': { 
                        fontSize: '0.875rem', 
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? '#059669' : '#475569'
                      } 
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Logout Section */}
      <Box sx={{ px: 3, pb: 4, pt: 2 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogout}
          startIcon={<ExitToAppIcon />}
          sx={{
            background: '#F1F5F9',
            color: '#475569',
            py: 1.5,
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 700,
            boxShadow: 'none',
            '&:hover': {
              background: '#FEE2E2',
              color: '#EF4444',
            }
          }}
        >
          Logout
        </Button>
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#94A3B8' }}>
          v2.0.0 • CampusFlow
        </Typography>
      </Box>
    </Drawer>
  );
};

export default StudentSidebar;