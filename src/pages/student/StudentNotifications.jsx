import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Badge,
  Avatar,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Zoom,
  LinearProgress,
  alpha,
  Stack
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  Delete as DeleteIcon,
  Markunread as MarkUnreadIcon,
  MarkEmailRead as MarkReadIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  DoneAll as DoneAllIcon,
  AccessTime as AccessTimeIcon,
  Announcement as AnnouncementIcon,
  Feedback as FeedbackIcon,
  Payment as PaymentIcon,
  MeetingRoom as MeetingRoomIcon,
  Restaurant as RestaurantIcon,
  LocalLaundryService as LaundryIcon,
  Security as SecurityIcon,
  Error as ErrorIcon,
  Inbox as InboxIcon,
  SentimentDissatisfied as SadIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format, formatDistance } from 'date-fns';
import studentService from '../../services/studentService';

/* ─────────────────────────────────────────────
   White & Green Theme System (Light Mode)
───────────────────────────────────────────── */
const theme = {
  // Background Colors
  bg: '#f8fafc',           // Main background: light gray
  bgLight: '#ffffff',       // White
  bgHover: '#f1f5f9',      // Hover state
  
  // Card Colors
  cardBg: '#ffffff',        // White cards
  cardBorder: '#e2e8f0',    // Light gray border
  
  // Primary Colors - Green
  primary: '#059669',       // Emerald green
  primaryLight: '#34d399',  // Light green
  primaryDark: '#047857',   // Dark green
  primarySoft: '#ecfdf5',   // Very light green background
  
  // Status Colors
  success: '#10b981',       // Green
  successLight: '#d1fae5',
  warning: '#f59e0b',       // Amber
  warningLight: '#fef3c7',
  error: '#ef4444',         // Red
  errorLight: '#fee2e2',
  info: '#3b82f6',          // Blue
  infoLight: '#dbeafe',
  
  // Priority Colors
  high: '#ef4444',          // Red
  medium: '#f59e0b',        // Amber
  low: '#10b981',           // Green
  
  // Text Colors
  textPrimary: '#0f172a',   // Dark slate
  textSecondary: '#475569', // Medium slate
  textMuted: '#64748b',     // Light slate
  
  // Borders
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  
  // Gradients
  primaryGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  successGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  warningGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  errorGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  
  // Shadows
  cardShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  hoverShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  
  // Border Radius
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  },
  
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  
  // Typography
  fontPrimary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSecondary: "'SF Pro Display', 'Inter', 'Segoe UI', sans-serif",
};

/* ─────────────────────────────────────────────
   Styled Components
───────────────────────────────────────────── */
const StyledPaper = styled(Paper)(({ theme: muiTheme }) => ({
  padding: theme.spacing.xl,
  margin: theme.spacing.md,
  background: theme.cardBg,
  borderRadius: theme.borderRadius.xl,
  border: `1px solid ${theme.border}`,
  boxShadow: theme.cardShadow,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.hoverShadow,
    borderColor: theme.primaryLight
  }
}));

const NotificationCard = styled(Card)(({ unread }) => ({
  marginBottom: theme.spacing.md,
  background: unread ? alpha(theme.primary, 0.05) : theme.bgLight,
  border: `1px solid ${unread ? alpha(theme.primary, 0.2) : theme.border}`,
  borderRadius: theme.borderRadius.xl,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.hoverShadow,
    borderColor: theme.primary,
    background: unread ? alpha(theme.primary, 0.08) : theme.bgHover
  },
  '&::before': unread ? {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background: `linear-gradient(180deg, ${theme.primary}, ${theme.primaryLight})`
  } : {}
}));

const StyledTab = styled(Tab)({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.85rem',
  minHeight: '48px',
  borderRadius: theme.borderRadius.lg,
  margin: '0 4px',
  color: theme.textMuted,
  transition: 'all 0.3s ease',
  '&:hover': {
    color: theme.primary,
    background: alpha(theme.primary, 0.05)
  },
  '&.Mui-selected': {
    background: alpha(theme.primary, 0.1),
    color: theme.primary
  }
});

const EmptyState = styled(Paper)({
  padding: theme.spacing.xl,
  textAlign: 'center',
  background: theme.bgLight,
  borderRadius: theme.borderRadius.xl,
  border: `2px dashed ${alpha(theme.primary, 0.2)}`
});

const StatCard = styled(Card)(({ gradient = theme.primaryGradient }) => ({
  background: gradient,
  borderRadius: theme.borderRadius.xl,
  border: `1px solid ${theme.border}`,
  boxShadow: theme.cardShadow,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.hoverShadow
  }
}));

const HeaderAvatar = styled(Avatar)({
  background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
  width: 64,
  height: 64,
  boxShadow: `0 10px 20px -8px ${alpha(theme.primary, 0.3)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05) rotate(5deg)'
  }
});

const ActionButton = styled(IconButton)({
  background: theme.bgLight,
  border: `1px solid ${theme.border}`,
  color: theme.textMuted,
  width: 45,
  height: 45,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.primary,
    color: theme.primary,
    transform: 'translateY(-2px)',
    boxShadow: `0 10px 15px -3px ${alpha(theme.primary, 0.2)}`
  }
});

const StudentNotifications = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [refreshing, setRefreshing] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      console.log('📞 Fetching notifications from backend...');
      
      const response = await studentService.getNotifications();
      console.log('✅ Raw notifications data:', response);
      
      // Process the data - handle different response formats
      let notificationsList = [];
      
      if (Array.isArray(response)) {
        notificationsList = response;
      } else if (response?.data && Array.isArray(response.data)) {
        notificationsList = response.data;
      } else if (response?.notifications && Array.isArray(response.notifications)) {
        notificationsList = response.notifications;
      } else if (response?.results && Array.isArray(response.results)) {
        notificationsList = response.results;
      }
      
      console.log(`📊 Received ${notificationsList.length} notifications`);
      
      // Sort by date (newest first)
      notificationsList.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date || a.timestamp || a.sentAt || 0);
        const dateB = new Date(b.createdAt || b.date || b.timestamp || b.sentAt || 0);
        return dateB - dateA;
      });
      
      setNotifications(notificationsList);
      
      if (notificationsList.length === 0) {
        console.log('ℹ️ No notifications found');
      }
      
    } catch (err) {
      console.error('❌ Error fetching notifications:', err);
      setError(err.response?.data?.message || 'Failed to load notifications');
      showSnackbar('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  const getNotificationIcon = (type) => {
    const iconProps = { sx: { fontSize: 20 } };
    
    switch (type?.toLowerCase()) {
      case 'info':
      case 'information':
        return <InfoIcon {...iconProps} sx={{ color: theme.info }} />;
      case 'warning':
      case 'alert':
        return <WarningIcon {...iconProps} sx={{ color: theme.warning }} />;
      case 'success':
        return <CheckCircleIcon {...iconProps} sx={{ color: theme.success }} />;
      case 'error':
      case 'danger':
        return <ErrorIcon {...iconProps} sx={{ color: theme.error }} />;
      case 'event':
        return <EventIcon {...iconProps} sx={{ color: theme.primary }} />;
      case 'payment':
        return <PaymentIcon {...iconProps} sx={{ color: theme.success }} />;
      case 'announcement':
        return <AnnouncementIcon {...iconProps} sx={{ color: theme.info }} />;
      case 'feedback':
        return <FeedbackIcon {...iconProps} sx={{ color: theme.warning }} />;
      case 'room':
        return <MeetingRoomIcon {...iconProps} sx={{ color: theme.primary }} />;
      case 'mess':
      case 'food':
        return <RestaurantIcon {...iconProps} sx={{ color: theme.warning }} />;
      case 'laundry':
        return <LaundryIcon {...iconProps} sx={{ color: theme.info }} />;
      case 'security':
        return <SecurityIcon {...iconProps} sx={{ color: theme.error }} />;
      default:
        return <NotificationsIcon {...iconProps} sx={{ color: theme.textMuted }} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'urgent':
        return theme.high;
      case 'medium':
        return theme.medium;
      case 'low':
        return theme.low;
      default:
        return theme.textMuted;
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await studentService.markNotificationAsRead(id);
      
      setNotifications(notifications.map(notif => 
        (notif._id === id || notif.id === id) ? { ...notif, read: true, isRead: true } : notif
      ));
      
      showSnackbar('Notification marked as read', 'success');
    } catch (err) {
      console.error('Error marking as read:', err);
      showSnackbar('Failed to mark as read', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await studentService.markAllNotificationsAsRead();
      
      setNotifications(notifications.map(notif => ({ ...notif, read: true, isRead: true })));
      showSnackbar('All notifications marked as read', 'success');
    } catch (err) {
      console.error('Error marking all as read:', err);
      showSnackbar('Failed to mark all as read', 'error');
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await studentService.deleteNotification(id);
      
      setNotifications(notifications.filter(notif => notif._id !== id && notif.id !== id));
      showSnackbar('Notification deleted', 'success');
    } catch (err) {
      console.error('Error deleting notification:', err);
      showSnackbar('Failed to delete notification', 'error');
    }
  };

  const handleDeleteAll = async () => {
    try {
      for (const notif of filteredNotifications) {
        await studentService.deleteNotification(notif._id || notif.id);
      }
      
      const deletedIds = new Set(filteredNotifications.map(n => n._id || n.id));
      setNotifications(notifications.filter(n => !deletedIds.has(n._id || n.id)));
      
      showSnackbar('All notifications deleted', 'success');
      setAnchorEl(null);
    } catch (err) {
      console.error('Error deleting all:', err);
      showSnackbar('Failed to delete all notifications', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDate = (dateString) => {
    if (!dateString) return { full: 'Date not available', relative: '' };
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { full: dateString, relative: '' };
      
      return {
        full: format(date, 'PPP p'),
        relative: formatDistance(date, new Date(), { addSuffix: true })
      };
    } catch {
      return { full: dateString, relative: '' };
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read && !notif.isRead;
    if (filter === 'read') return notif.read || notif.isRead;
    return true;
  }).filter(notif => {
    if (typeFilter === 'all') return true;
    return notif.type?.toLowerCase() === typeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read && !n.isRead).length;
  const highPriorityCount = notifications.filter(n => 
    n.priority?.toLowerCase() === 'high' || n.priority?.toLowerCase() === 'urgent'
  ).length;

  const notificationTypes = [
    { value: 'all', label: 'All', icon: <NotificationsIcon /> },
    { value: 'info', label: 'Info', icon: <InfoIcon /> },
    { value: 'warning', label: 'Warnings', icon: <WarningIcon /> },
    { value: 'success', label: 'Success', icon: <CheckCircleIcon /> },
    { value: 'event', label: 'Events', icon: <EventIcon /> },
    { value: 'payment', label: 'Payments', icon: <PaymentIcon /> }
  ];

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: theme.bg }}
      >
        <Card sx={{ 
          p: theme.spacing.xl, 
          textAlign: 'center', 
          maxWidth: 400,
          background: theme.cardBg,
          borderRadius: theme.borderRadius.xl,
          border: `1px solid ${theme.border}`
        }}>
          <CircularProgress size={60} thickness={4} sx={{ color: theme.primary, mb: 3 }} />
          <Typography variant="h6" sx={{ color: theme.textPrimary, fontWeight: 600, mb: 2 }}>
            Loading Notifications
          </Typography>
          <LinearProgress 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              background: alpha(theme.primary, 0.1),
              '& .MuiLinearProgress-bar': {
                background: theme.primaryGradient,
                borderRadius: 3
              }
            }} 
          />
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.bg,
      p: { xs: theme.spacing.sm, sm: theme.spacing.md, md: theme.spacing.lg }
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.6s ease forwards;
        }
        
        .rotating {
          animation: rotate 1s linear infinite;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${alpha(theme.textMuted, 0.1)};
          border-radius: ${theme.borderRadius.lg};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${alpha(theme.primary, 0.3)};
          border-radius: ${theme.borderRadius.lg};
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${alpha(theme.primary, 0.5)};
        }
      `}</style>

      <StyledPaper elevation={0}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} className="fade-in-up">
          <Box display="flex" alignItems="center" gap={3}>
            <Badge 
              badgeContent={unreadCount} 
              sx={{
                '& .MuiBadge-badge': {
                  background: `linear-gradient(135deg, ${theme.error}, ${alpha(theme.error, 0.8)})`,
                  color: theme.bgLight,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  minWidth: '22px',
                  height: '22px'
                }
              }}
              overlap="circular"
            >
              <HeaderAvatar>
                <NotificationsIcon sx={{ fontSize: 32, color: theme.bgLight }} />
              </HeaderAvatar>
            </Badge>
            <Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.primary,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  mb: 0.5,
                  display: 'block'
                }}
              >
                Notification Center
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: theme.textPrimary, fontFamily: theme.fontSecondary }}>
                Notifications
              </Typography>
              <Typography variant="body1" sx={{ color: theme.textMuted, mt: 0.5 }}>
                {notifications.length > 0 
                  ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                  : 'No notifications to show'}
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" gap={2}>
            <Tooltip title="Refresh" arrow placement="bottom">
              <ActionButton onClick={handleRefresh} disabled={refreshing}>
                <RefreshIcon className={refreshing ? 'rotating' : ''} />
              </ActionButton>
            </Tooltip>
            
            <Tooltip title="Filter" arrow placement="bottom">
              <ActionButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <FilterIcon />
              </ActionButton>
            </Tooltip>
            
            {unreadCount > 0 && (
              <Button
                variant="contained"
                startIcon={<DoneAllIcon />}
                onClick={handleMarkAllAsRead}
                sx={{
                  background: theme.primaryGradient,
                  color: theme.bgLight,
                  borderRadius: theme.borderRadius.lg,
                  px: 4,
                  py: 1.2,
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  boxShadow: `0 4px 6px -1px ${alpha(theme.primary, 0.3)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 10px 15px -3px ${alpha(theme.primary, 0.4)}`
                  }
                }}
              >
                Mark All Read
              </Button>
            )}
          </Box>
        </Box>

        {/* Filter Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          TransitionComponent={Fade}
          PaperProps={{
            sx: { 
              borderRadius: theme.borderRadius.lg, 
              mt: 1, 
              minWidth: 240,
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              boxShadow: theme.hoverShadow,
              '& .MuiMenuItem-root': {
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: alpha(theme.primary, 0.05)
                }
              }
            }
          }}
        >
          <MenuItem onClick={() => { setFilter('all'); setAnchorEl(null); }}>
            <ListItemIcon><NotificationsIcon fontSize="small" sx={{ color: theme.textMuted }} /></ListItemIcon>
            <ListItemText primary="All Notifications" sx={{ color: theme.textPrimary }} />
            {filter === 'all' && <CheckCircleIcon sx={{ color: theme.primary, ml: 1 }} fontSize="small" />}
          </MenuItem>
          <MenuItem onClick={() => { setFilter('unread'); setAnchorEl(null); }}>
            <ListItemIcon><MarkUnreadIcon fontSize="small" sx={{ color: theme.info }} /></ListItemIcon>
            <ListItemText primary="Unread Only" sx={{ color: theme.textPrimary }} />
            {filter === 'unread' && <CheckCircleIcon sx={{ color: theme.primary, ml: 1 }} fontSize="small" />}
          </MenuItem>
          <MenuItem onClick={() => { setFilter('read'); setAnchorEl(null); }}>
            <ListItemIcon><MarkReadIcon fontSize="small" sx={{ color: theme.success }} /></ListItemIcon>
            <ListItemText primary="Read Only" sx={{ color: theme.textPrimary }} />
            {filter === 'read' && <CheckCircleIcon sx={{ color: theme.primary, ml: 1 }} fontSize="small" />}
          </MenuItem>
          <Divider sx={{ borderColor: theme.borderLight, my: 1 }} />
          <MenuItem onClick={handleDeleteAll} disabled={filteredNotifications.length === 0}>
            <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: theme.error }} /></ListItemIcon>
            <ListItemText primary="Delete All" sx={{ color: theme.error }} />
          </MenuItem>
        </Menu>

        {/* Error Alert */}
        {error && (
          <Zoom in={!!error}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: theme.borderRadius.lg,
                background: alpha(theme.error, 0.1),
                color: theme.error,
                border: `1px solid ${alpha(theme.error, 0.2)}`,
                '& .MuiAlert-icon': {
                  color: theme.error
                }
              }}
              onClose={() => setError(null)}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={fetchNotifications} 
                  sx={{ 
                    color: theme.error,
                    '&:hover': { background: alpha(theme.error, 0.1) }
                  }}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          </Zoom>
        )}

        {/* Stats Cards */}
        {notifications.length > 0 && (
          <Fade in={notifications.length > 0} timeout={800}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <StatCard gradient="linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)">
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ color: theme.textPrimary, fontWeight: 800, fontFamily: theme.fontSecondary }}>
                      {notifications.length}
                    </Typography>
                    <Typography sx={{ color: theme.textMuted, fontSize: '1rem' }}>
                      Total Notifications
                    </Typography>
                  </CardContent>
                </StatCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ color: theme.bgLight, fontWeight: 800, fontFamily: theme.fontSecondary }}>
                      {unreadCount}
                    </Typography>
                    <Typography sx={{ color: alpha(theme.bgLight, 0.9), fontSize: '1rem' }}>
                      Unread
                    </Typography>
                  </CardContent>
                </StatCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ color: theme.bgLight, fontWeight: 800, fontFamily: theme.fontSecondary }}>
                      {highPriorityCount}
                    </Typography>
                    <Typography sx={{ color: alpha(theme.bgLight, 0.9), fontSize: '1rem' }}>
                      High Priority
                    </Typography>
                  </CardContent>
                </StatCard>
              </Grid>
            </Grid>
          </Fade>
        )}

        {/* Type Filter Tabs */}
        {notifications.length > 0 && (
          <Tabs
            value={tabValue}
            onChange={(e, val) => {
              setTabValue(val);
              setTypeFilter(val === 0 ? 'all' : notificationTypes[val].value);
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              mb: 3, 
              '& .MuiTabs-indicator': { display: 'none' }
            }}
          >
            {notificationTypes.map((type, index) => (
              <StyledTab
                key={type.value}
                icon={type.icon}
                label={type.label}
                iconPosition="start"
              />
            ))}
          </Tabs>
        )}

        {/* Notifications List */}
        <Box sx={{ 
          maxHeight: 600, 
          overflow: 'auto', 
          pr: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(theme.textMuted, 0.1),
            borderRadius: theme.borderRadius.lg,
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(theme.primary, 0.3),
            borderRadius: theme.borderRadius.lg,
            '&:hover': {
              background: alpha(theme.primary, 0.5)
            }
          }
        }}>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => {
              const isUnread = !notification.read && !notification.isRead;
              const date = formatDate(notification.createdAt || notification.date || notification.timestamp || notification.sentAt);
              const notificationId = notification._id || notification.id || index;
              const priorityColor = getPriorityColor(notification.priority);
              
              return (
                <Fade in timeout={500 + index * 100} key={notificationId}>
                  <div style={{ animationDelay: `${index * 0.1}s` }} className="fade-in-up">
                    <NotificationCard unread={isUnread}>
                      <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={2} alignItems="flex-start">
                          {/* Icon */}
                          <Grid item xs={12} sm={1}>
                            <Avatar 
                              sx={{ 
                                background: isUnread ? alpha(theme.primary, 0.1) : alpha(theme.textMuted, 0.1),
                                color: isUnread ? theme.primary : theme.textMuted,
                                width: 52,
                                height: 52,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  background: isUnread ? alpha(theme.primary, 0.2) : alpha(theme.textMuted, 0.2)
                                }
                              }}
                            >
                              {getNotificationIcon(notification.type)}
                            </Avatar>
                          </Grid>

                          {/* Content */}
                          <Grid item xs={12} sm={9}>
                            <Box display="flex" alignItems="center" flexWrap="wrap" gap={1.5} mb={1}>
                              <Typography variant="h6" sx={{ color: theme.textPrimary, fontWeight: 700, fontSize: '1.1rem' }}>
                                {notification.title || notification.subject || 'Notification'}
                              </Typography>
                              
                              {notification.priority && (
                                <Chip
                                  label={notification.priority}
                                  size="small"
                                  sx={{
                                    background: alpha(priorityColor, 0.1),
                                    color: priorityColor,
                                    border: `1px solid ${alpha(priorityColor, 0.2)}`,
                                    fontWeight: 700,
                                    fontSize: '0.7rem',
                                    height: 24
                                  }}
                                />
                              )}
                              
                              {isUnread && (
                                <Chip 
                                  label="New" 
                                  size="small" 
                                  sx={{
                                    background: alpha(theme.info, 0.1),
                                    color: theme.info,
                                    border: `1px solid ${alpha(theme.info, 0.2)}`,
                                    fontWeight: 700,
                                    fontSize: '0.7rem',
                                    height: 24
                                  }}
                                  icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                                />
                              )}
                              
                              {notification.type && (
                                <Chip
                                  label={notification.type}
                                  size="small"
                                  sx={{
                                    background: alpha(theme.textMuted, 0.1),
                                    color: theme.textMuted,
                                    fontSize: '0.7rem',
                                    height: 24,
                                    border: `1px solid ${alpha(theme.textMuted, 0.2)}`
                                  }}
                                />
                              )}
                            </Box>

                            <Typography variant="body1" sx={{ color: theme.textSecondary, lineHeight: 1.7, mb: 1.5 }}>
                              {notification.message || notification.description || notification.content}
                            </Typography>

                            <Box display="flex" alignItems="center" gap={2}>
                              <Tooltip title={date.full} arrow>
                                <Typography variant="caption" sx={{ 
                                  color: theme.textMuted, 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 0.5,
                                  '&:hover': { color: theme.primary }
                                }}>
                                  <AccessTimeIcon sx={{ fontSize: 14 }} />
                                  {date.relative || date.full}
                                </Typography>
                              </Tooltip>
                              
                              {notification.sender && (
                                <Typography variant="caption" sx={{ color: theme.textMuted }}>
                                  • From: {typeof notification.sender === 'object' ? notification.sender.name || notification.sender.fullName : notification.sender}
                                </Typography>
                              )}
                            </Box>
                          </Grid>

                          {/* Actions */}
                          <Grid item xs={12} sm={2}>
                            <Box display="flex" justifyContent="flex-end" gap={1}>
                              {isUnread && (
                                <Tooltip title="Mark as read" arrow>
                                  <IconButton 
                                    onClick={() => handleMarkAsRead(notificationId)}
                                    size="small"
                                    sx={{
                                      bgcolor: alpha(theme.info, 0.1),
                                      color: theme.info,
                                      width: 36,
                                      height: 36,
                                      '&:hover': { 
                                        bgcolor: alpha(theme.info, 0.2),
                                        transform: 'scale(1.1)'
                                      },
                                      transition: 'all 0.2s ease'
                                    }}
                                  >
                                    <MarkUnreadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Delete" arrow>
                                <IconButton 
                                  onClick={() => handleDeleteNotification(notificationId)}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(theme.error, 0.1),
                                    color: theme.error,
                                    width: 36,
                                    height: 36,
                                    '&:hover': { 
                                      bgcolor: alpha(theme.error, 0.2),
                                      transform: 'scale(1.1)'
                                    },
                                    transition: 'all 0.2s ease'
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </NotificationCard>
                  </div>
                </Fade>
              );
            })
          ) : (
            <Zoom in={notifications.length === 0}>
              <EmptyState>
                <InboxIcon sx={{ fontSize: 100, color: alpha(theme.primary, 0.3), mb: 3 }} />
                <Typography variant="h4" sx={{ color: theme.textPrimary, fontWeight: 700, mb: 2 }}>
                  No Notifications
                </Typography>
                <Typography variant="body1" sx={{ color: theme.textMuted, mb: 4, fontSize: '1.1rem' }}>
                  {filter !== 'all' || typeFilter !== 'all'
                    ? `No ${filter === 'unread' ? 'unread ' : ''}${typeFilter !== 'all' ? typeFilter + ' ' : ''}notifications found`
                    : "You don't have any notifications at the moment"}
                </Typography>
                {(filter !== 'all' || typeFilter !== 'all') && (
                  <Button 
                    variant="contained"
                    onClick={() => {
                      setFilter('all');
                      setTypeFilter('all');
                      setTabValue(0);
                    }}
                    sx={{
                      background: theme.primaryGradient,
                      color: theme.bgLight,
                      borderRadius: theme.borderRadius.lg,
                      px: 5,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1rem',
                      textTransform: 'none',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 10px 15px -3px ${alpha(theme.primary, 0.3)}`
                      }
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
                {filter === 'all' && typeFilter === 'all' && notifications.length === 0 && (
                  <Button 
                    variant="outlined"
                    onClick={handleRefresh}
                    startIcon={<RefreshIcon />}
                    sx={{
                      borderColor: alpha(theme.primary, 0.3),
                      color: theme.primary,
                      borderRadius: theme.borderRadius.lg,
                      px: 5,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: theme.primary,
                        bgcolor: alpha(theme.primary, 0.05),
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Refresh
                  </Button>
                )}
              </EmptyState>
            </Zoom>
          )}
        </Box>

        {/* Loading More Indicator */}
        {notifications.length > filteredNotifications.length && (
          <Box textAlign="center" py={3}>
            <Chip 
              label={`Showing ${filteredNotifications.length} of ${notifications.length} notifications`}
              sx={{
                background: alpha(theme.textMuted, 0.1),
                color: theme.textMuted,
                border: `1px solid ${alpha(theme.textMuted, 0.2)}`,
                borderRadius: theme.borderRadius.lg,
                fontWeight: 500,
                px: 2
              }}
            />
          </Box>
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={Zoom}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ 
              width: '100%',
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.hoverShadow,
              fontWeight: 600,
              fontSize: '0.95rem',
              background: snackbar.severity === 'success' ? theme.successGradient :
                         snackbar.severity === 'error' ? theme.errorGradient :
                         snackbar.severity === 'warning' ? theme.warningGradient :
                         theme.primaryGradient
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </StyledPaper>
    </Box>
  );
};

export default StudentNotifications;