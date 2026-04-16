// pages/student/StudentNotifications.jsx
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
  NotificationsActive as NotificationsActiveIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  Delete as DeleteIcon,
  Markunread as MarkUnreadIcon,
  MarkEmailRead as MarkReadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  DoneAll as DoneAllIcon,
  AccessTime as AccessTimeIcon,
  Payment as PaymentIcon,
  Error as ErrorIcon,
  Inbox as InboxIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format, formatDistance } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/* ─────────────────────────────────────────────
   White & Green Theme System (Light Mode)
───────────────────────────────────────────── */
const theme = {
  bg: '#f8fafc',
  bgLight: '#ffffff',
  bgHover: '#f1f5f9',
  cardBg: '#ffffff',
  cardBorder: '#e2e8f0',
  primary: '#059669',
  primaryLight: '#34d399',
  primaryDark: '#047857',
  primarySoft: '#ecfdf5',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  primaryGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  successGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  warningGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  errorGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  cardShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  hoverShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  borderRadius: { sm: '6px', md: '8px', lg: '12px', xl: '16px' },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' }
};

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
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [refreshing, setRefreshing] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Demo data for testing
  const demoNotifications = [
    {
      _id: '1',
      title: 'Fee Payment Reminder',
      message: 'Your hostel fee for December is due on 15th December. Please pay before the due date to avoid late fees.',
      type: 'payment',
      priority: 'high',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'Maintenance Request Approved',
      message: 'Your maintenance request for AC repair has been approved. Technician will visit tomorrow at 10 AM.',
      type: 'info',
      priority: 'medium',
      isRead: false,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      _id: '3',
      title: 'Leave Application Status',
      message: 'Your leave application for 20th December has been approved by the warden.',
      type: 'success',
      priority: 'low',
      isRead: true,
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      console.log('📞 Fetching notifications from backend...');
      
      // Try to fetch from backend
      try {
        const response = await fetch(`${API_URL}/student/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        console.log('✅ Notifications response:', data);
        
        let notificationsList = [];
        if (Array.isArray(data)) {
          notificationsList = data;
        } else if (data?.data && Array.isArray(data.data)) {
          notificationsList = data.data;
        } else if (data?.notifications && Array.isArray(data.notifications)) {
          notificationsList = data.notifications;
        }
        
        if (notificationsList.length > 0) {
          notificationsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setNotifications(notificationsList);
        } else {
          // Use demo data if no real data
          setNotifications(demoNotifications);
        }
      } catch (err) {
        console.log('Backend not available, using demo data');
        setNotifications(demoNotifications);
      }
      
      // Trigger event to update sidebar badge
      window.dispatchEvent(new Event('notificationRead'));
      
    } catch (err) {
      console.error('❌ Error fetching notifications:', err);
      setNotifications(demoNotifications);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
    showSnackbar('Notifications refreshed', 'success');
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'info': return <InfoIcon sx={{ color: theme.info }} />;
      case 'warning': return <WarningIcon sx={{ color: theme.warning }} />;
      case 'success': return <CheckCircleIcon sx={{ color: theme.success }} />;
      case 'error': return <ErrorIcon sx={{ color: theme.error }} />;
      case 'event': return <EventIcon sx={{ color: theme.primary }} />;
      case 'payment': return <PaymentIcon sx={{ color: theme.success }} />;
      default: return <NotificationsIcon sx={{ color: theme.textMuted }} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return theme.error;
      case 'medium': return theme.warning;
      case 'low': return theme.success;
      default: return theme.textMuted;
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      // Update local state
      const updatedNotifications = notifications.map(notif => 
        notif._id === id ? { ...notif, isRead: true, read: true } : notif
      );
      setNotifications(updatedNotifications);
      
      // Trigger event to update sidebar badge
      window.dispatchEvent(new Event('notificationRead'));
      
      showSnackbar('Notification marked as read', 'success');
    } catch (err) {
      console.error('Error marking as read:', err);
      showSnackbar('Failed to mark as read', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      console.log("Marking all notifications as read...");
      
      // Update local state - mark all as read
      const updatedNotifications = notifications.map(notif => ({
        ...notif,
        isRead: true,
        read: true
      }));
      
      setNotifications(updatedNotifications);
      
      // Trigger event to update sidebar badge
      window.dispatchEvent(new Event('notificationRead'));
      
      showSnackbar(`All ${notifications.length} notifications marked as read`, 'success');
      
    } catch (err) {
      console.error("Error marking all as read:", err);
      showSnackbar('Failed to mark all as read', 'error');
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const updatedNotifications = notifications.filter(notif => notif._id !== id);
      setNotifications(updatedNotifications);
      
      // Trigger event to update sidebar badge
      window.dispatchEvent(new Event('notificationRead'));
      
      showSnackbar('Notification deleted', 'success');
    } catch (err) {
      console.error('Error deleting notification:', err);
      showSnackbar('Failed to delete notification', 'error');
    }
  };

  const handleDeleteAll = async () => {
    try {
      setNotifications([]);
      
      // Trigger event to update sidebar badge
      window.dispatchEvent(new Event('notificationRead'));
      
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
    if (filter === 'unread') return !notif.isRead && !notif.read;
    if (filter === 'read') return notif.isRead || notif.read;
    return true;
  }).filter(notif => {
    if (typeFilter === 'all') return true;
    return notif.type?.toLowerCase() === typeFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead && !n.read).length;
  const readCount = notifications.filter(n => n.isRead || n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority?.toLowerCase() === 'high').length;

  const notificationTypes = [
    { value: 'all', label: 'All', icon: <NotificationsIcon /> },
    { value: 'info', label: 'Info', icon: <InfoIcon /> },
    { value: 'warning', label: 'Warnings', icon: <WarningIcon /> },
    { value: 'success', label: 'Success', icon: <CheckCircleIcon /> },
    { value: 'payment', label: 'Payments', icon: <PaymentIcon /> }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: theme.bg }}>
        <Card sx={{ p: theme.spacing.xl, textAlign: 'center', maxWidth: 400, borderRadius: theme.borderRadius.xl }}>
          <CircularProgress size={60} thickness={4} sx={{ color: theme.primary, mb: 3 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Loading Notifications</Typography>
          <LinearProgress sx={{ height: 6, borderRadius: 3, '& .MuiLinearProgress-bar': { background: theme.primaryGradient } }} />
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: theme.bg, p: { xs: 2, sm: 3, md: 4 } }}>
      <StyledPaper elevation={0}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box display="flex" alignItems="center" gap={3}>
            <Badge 
              badgeContent={unreadCount} 
              sx={{ '& .MuiBadge-badge': { background: `linear-gradient(135deg, ${theme.error}, ${alpha(theme.error, 0.8)})`, color: '#fff', fontWeight: 700 } }}
              overlap="circular"
            >
              <HeaderAvatar>
                <NotificationsActiveIcon sx={{ fontSize: 32, color: '#fff' }} />
              </HeaderAvatar>
            </Badge>
            <Box>
              <Typography variant="caption" sx={{ color: theme.primary, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block' }}>
                Notification Center
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: theme.textPrimary }}>
                Notifications
              </Typography>
              <Typography variant="body2" sx={{ color: theme.textMuted, mt: 0.5 }}>
                {notifications.length > 0 
                  ? `📬 ${unreadCount} unread · ${readCount} read`
                  : 'No notifications to show'}
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" gap={2}>
            <Tooltip title="Refresh Notifications">
              <ActionButton onClick={handleRefresh} disabled={refreshing}>
                <RefreshIcon className={refreshing ? 'rotating' : ''} />
              </ActionButton>
            </Tooltip>
            
            <Tooltip title="Filter">
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
                  color: '#fff',
                  borderRadius: theme.borderRadius.lg,
                  px: 4,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': { transform: 'translateY(-2px)' }
                }}
              >
                Mark All Read ({unreadCount})
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
          PaperProps={{ sx: { borderRadius: theme.borderRadius.lg, mt: 1, minWidth: 240 } }}
        >
          <MenuItem onClick={() => { setFilter('all'); setAnchorEl(null); }}>
            <ListItemIcon><NotificationsIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="All Notifications" />
            {filter === 'all' && <CheckCircleIcon sx={{ color: theme.primary, ml: 1 }} fontSize="small" />}
          </MenuItem>
          <MenuItem onClick={() => { setFilter('unread'); setAnchorEl(null); }}>
            <ListItemIcon><MarkUnreadIcon fontSize="small" sx={{ color: theme.info }} /></ListItemIcon>
            <ListItemText primary="Unread Only" />
            {filter === 'unread' && <CheckCircleIcon sx={{ color: theme.primary, ml: 1 }} fontSize="small" />}
          </MenuItem>
          <MenuItem onClick={() => { setFilter('read'); setAnchorEl(null); }}>
            <ListItemIcon><MarkReadIcon fontSize="small" sx={{ color: theme.success }} /></ListItemIcon>
            <ListItemText primary="Read Only" />
            {filter === 'read' && <CheckCircleIcon sx={{ color: theme.primary, ml: 1 }} fontSize="small" />}
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleDeleteAll} disabled={filteredNotifications.length === 0}>
            <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: theme.error }} /></ListItemIcon>
            <ListItemText primary="Delete All" sx={{ color: theme.error }} />
          </MenuItem>
        </Menu>

        {/* Error Alert */}
        {error && (
          <Zoom in={!!error}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: theme.borderRadius.lg }} onClose={() => setError(null)}>
              {error}
            </Alert>
          </Zoom>
        )}

        {/* Stats Cards */}
        {notifications.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: theme.borderRadius.xl }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: theme.textPrimary }}>{notifications.length}</Typography>
                  <Typography sx={{ color: theme.textMuted }}>Total Notifications</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: theme.borderRadius.xl, background: theme.primaryGradient }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: '#fff' }}>{unreadCount}</Typography>
                  <Typography sx={{ color: alpha('#fff', 0.9) }}>Unread</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: theme.borderRadius.xl, background: '#f1f5f9' }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: theme.textMuted }}>{readCount}</Typography>
                  <Typography sx={{ color: theme.textMuted }}>Read</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
            sx={{ mb: 3, '& .MuiTabs-indicator': { display: 'none' } }}
          >
            {notificationTypes.map((type, index) => (
              <Tab
                key={type.value}
                icon={type.icon}
                label={type.label}
                iconPosition="start"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  '&.Mui-selected': { color: theme.primary, background: alpha(theme.primary, 0.1), borderRadius: theme.borderRadius.lg }
                }}
              />
            ))}
          </Tabs>
        )}

        {/* Notifications List */}
        <Box sx={{ maxHeight: 600, overflow: 'auto', pr: 1 }}>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => {
              const isUnread = !notification.isRead && !notification.read;
              const date = formatDate(notification.createdAt);
              const priorityColor = getPriorityColor(notification.priority);
              
              return (
                <Fade in timeout={500 + index * 100} key={notification._id || index}>
                  <NotificationCard unread={isUnread}>
                    <CardContent sx={{ p: 3 }}>
                      <Grid container spacing={2} alignItems="flex-start">
                        <Grid item xs={12} sm={1}>
                          <Avatar sx={{ 
                            background: isUnread ? alpha(theme.primary, 0.1) : alpha(theme.textMuted, 0.1),
                            width: 52, height: 52
                          }}>
                            {getNotificationIcon(notification.type)}
                          </Avatar>
                        </Grid>

                        <Grid item xs={12} sm={9}>
                          <Box display="flex" alignItems="center" flexWrap="wrap" gap={1.5} mb={1}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: isUnread ? theme.primary : theme.textPrimary }}>
                              {notification.title || 'Notification'}
                            </Typography>
                            
                            {notification.priority && (
                              <Chip
                                label={notification.priority}
                                size="small"
                                sx={{ background: alpha(priorityColor, 0.1), color: priorityColor, fontWeight: 700 }}
                              />
                            )}
                            
                            {isUnread ? (
                              <Chip 
                                label="New" 
                                size="small" 
                                icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                                sx={{ background: alpha(theme.info, 0.1), color: theme.info, fontWeight: 600 }}
                              />
                            ) : (
                              <Chip 
                                label="Read" 
                                size="small" 
                                icon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                                sx={{ background: alpha(theme.textMuted, 0.1), color: theme.textMuted, fontWeight: 600 }}
                              />
                            )}
                          </Box>

                          <Typography variant="body2" sx={{ color: theme.textSecondary, mb: 1.5 }}>
                            {notification.message}
                          </Typography>

                          <Box display="flex" alignItems="center" gap={2}>
                            <Tooltip title={date.full}>
                              <Typography variant="caption" sx={{ color: theme.textMuted, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTimeIcon sx={{ fontSize: 14 }} />
                                {date.relative || date.full}
                              </Typography>
                            </Tooltip>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Box display="flex" justifyContent="flex-end" gap={1}>
                            {isUnread && (
                              <Tooltip title="Mark as read">
                                <IconButton 
                                  onClick={() => handleMarkAsRead(notification._id)}
                                  size="small"
                                  sx={{ bgcolor: alpha(theme.info, 0.1), color: theme.info, '&:hover': { bgcolor: alpha(theme.info, 0.2) } }}
                                >
                                  <MarkUnreadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Delete">
                              <IconButton 
                                onClick={() => handleDeleteNotification(notification._id)}
                                size="small"
                                sx={{ bgcolor: alpha(theme.error, 0.1), color: theme.error, '&:hover': { bgcolor: alpha(theme.error, 0.2) } }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </NotificationCard>
                </Fade>
              );
            })
          ) : (
            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: theme.borderRadius.xl }}>
              <InboxIcon sx={{ fontSize: 100, color: alpha(theme.primary, 0.3), mb: 3 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: theme.textPrimary }}>No Notifications</Typography>
              <Typography variant="body1" sx={{ color: theme.textMuted }}>
                {filter !== 'all' || typeFilter !== 'all'
                  ? `No ${filter === 'unread' ? 'unread ' : ''}${typeFilter !== 'all' ? typeFilter + ' ' : ''}notifications found`
                  : "You don't have any notifications at the moment"}
              </Typography>
              {(filter !== 'all' || typeFilter !== 'all') && (
                <Button 
                  variant="contained"
                  onClick={() => { setFilter('all'); setTypeFilter('all'); setTabValue(0); }}
                  sx={{ mt: 3, background: theme.primaryGradient }}
                >
                  Clear Filters
                </Button>
              )}
            </Paper>
          )}
        </Box>

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
              borderRadius: theme.borderRadius.lg,
              background: snackbar.severity === 'success' ? theme.successGradient : theme.errorGradient
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