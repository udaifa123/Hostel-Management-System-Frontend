import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Button,
  CircularProgress,
  Divider,
  Chip,
  Avatar,
  IconButton,
  LinearProgress,
  alpha,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Event as EventIcon,
  Message as MessageIcon,
  DoneAll as DoneAllIcon,
  Circle as CircleIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Markunread as MarkUnreadIcon,
  AccessTime as AccessTimeIcon,
  Inbox as InboxIcon
} from '@mui/icons-material';
import { format, parseISO, formatDistance } from 'date-fns';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// ─── Color Tokens (Same as Parent Pages) ───────────────────────────────
const G = {
  900: '#064e3b',
  800: '#065f46',
  700: '#047857',
  600: '#059669',
  500: '#10b981',
  400: '#34d399',
  300: '#6ee7b7',
  200: '#bbf7d0',
  100: '#d1fae5',
  50: '#ecfdf5',
};

// ─── Type Config ────────────────────────────────────────────────
const TYPE_CONFIG = {
  attendance: { label: 'Attendance', color: '#0ea5e9',  bg: '#e0f2fe', icon: <EventIcon sx={{ fontSize: 18 }} /> },
  leave:      { label: 'Leave',      color: '#f59e0b',  bg: '#fef9c3', icon: <InfoIcon sx={{ fontSize: 18 }} /> },
  complaint:  { label: 'Complaint',  color: '#ef4444',  bg: '#fee2e2', icon: <WarningIcon sx={{ fontSize: 18 }} /> },
  fee:        { label: 'Fee',        color: G[600],     bg: G[100],    icon: <CheckCircleIcon sx={{ fontSize: 18 }} /> },
  visit:      { label: 'Visit',      color: '#8b5cf6',  bg: '#ede9fe', icon: <EventIcon sx={{ fontSize: 18 }} /> },
  message:    { label: 'Message',    color: G[700],     bg: G[50],     icon: <MessageIcon sx={{ fontSize: 18 }} /> },
  default:    { label: 'General',    color: '#6b7280',  bg: '#f3f4f6', icon: <NotificationsIcon sx={{ fontSize: 18 }} /> },
};

const getConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.default;

const ParentNotifications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      setRefreshing(true);
      console.log('📞 Fetching parent notifications from backend...');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/parent/notifications`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('✅ Notifications response:', data);
      
      let notificationsList = [];
      let unread = 0;
      
      // Handle different response structures
      if (data?.data?.notifications) {
        notificationsList = data.data.notifications;
        unread = data.data.unreadCount || 0;
      } else if (data?.notifications) {
        notificationsList = data.notifications;
        unread = data.unreadCount || 0;
      } else if (Array.isArray(data)) {
        notificationsList = data;
        unread = notificationsList.filter(n => !n.isRead).length;
      } else if (data?.data && Array.isArray(data.data)) {
        notificationsList = data.data;
        unread = notificationsList.filter(n => !n.isRead).length;
      }
      
      // Sort by date (newest first)
      notificationsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setNotifications(notificationsList);
      setUnreadCount(unread);
      console.log(`📊 Received ${notificationsList.length} notifications (${unread} unread)`);
      
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter notifications based on tab
  useEffect(() => {
    let filtered = [...notifications];
    if (tabValue === 1) {
      filtered = notifications.filter(n => !n.isRead);
    } else if (tabValue === 2) {
      filtered = notifications.filter(n => n.isRead);
    }
    setFilteredNotifications(filtered);
  }, [notifications, tabValue]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/parent/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const updatedNotifications = notifications.map(n =>
          n._id === notificationId ? { ...n, isRead: true } : n
        );
        setNotifications(updatedNotifications);
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        // Trigger sidebar update
        window.dispatchEvent(new Event('notificationRead'));
        
        toast.success('Marked as read');
      } else {
        toast.error(data.message || 'Failed to mark as read');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/parent/notifications/read-all`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
        setNotifications(updatedNotifications);
        setUnreadCount(0);
        
        // Trigger sidebar update
        window.dispatchEvent(new Event('notificationRead'));
        
        toast.success(data.message || 'All notifications marked as read');
      } else {
        toast.error(data.message || 'Failed to mark all as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/parent/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const updatedNotifications = notifications.filter(n => n._id !== notificationId);
        setNotifications(updatedNotifications);
        const newUnreadCount = updatedNotifications.filter(n => !n.isRead).length;
        setUnreadCount(newUnreadCount);
        
        // Trigger sidebar update
        window.dispatchEvent(new Event('notificationRead'));
        
        toast.success('Notification deleted');
      } else {
        toast.error(data.message || 'Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return format(date, 'dd MMM yyyy, hh:mm a');
    } catch {
      return dateString;
    }
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f0fdf4' }}>
        <CircularProgress sx={{ color: G[600] }} thickness={5} />
      </Box>
    );
  }

  const readCount = notifications.filter(n => n.isRead).length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0fdf4' }}>
      {/* Top accent bar */}
      <Box sx={{ height: 4, bgcolor: G[600] }} />

      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
          color: 'white',
          py: 2,
          px: 3,
          boxShadow: '0 4px 20px rgba(6,95,70,0.2)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/parent/dashboard')}
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Notifications
            </Typography>
          </Box>

          <Box display="flex" gap={2}>
            <Tooltip title="Refresh">
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.5)',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#fff',
                    background: 'rgba(255,255,255,0.12)',
                  },
                }}
              >
                Refresh
              </Button>
            </Tooltip>

            {unreadCount > 0 && (
              <Button
                variant="contained"
                startIcon={<DoneAllIcon />}
                onClick={handleMarkAllAsRead}
                sx={{
                  bgcolor: '#fff',
                  color: G[700],
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { bgcolor: G[100] }
                }}
              >
                Mark All Read ({unreadCount})
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Welcome Card */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: '16px',
            border: '1.5px solid #d1fae5',
            bgcolor: '#fff',
            boxShadow: '0 4px 16px rgba(6,95,70,0.07)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: G[100],
                color: G[600],
                fontSize: '1.6rem',
                fontWeight: 700,
                border: `2px solid ${G[300]}`
              }}
            >
              <Badge
                badgeContent={unreadCount}
                color="error"
                max={99}
                sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 18, height: 18, bgcolor: '#ef4444' } }}
              >
                <NotificationsActiveIcon sx={{ fontSize: 32 }} />
              </Badge>
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" sx={{ color: G[600], letterSpacing: '0.12em', fontSize: '0.7rem', fontWeight: 600 }}>
                Notification Center
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: G[800], lineHeight: 1.2, mb: 0.5 }}>
                Your Alerts
              </Typography>
              <Typography sx={{ color: G[500], fontSize: '0.85rem', mt: 0.3 }}>
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''} · ${readCount} read`
                  : "You're all caught up!"}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Tabs */}
        <Paper elevation={0} sx={{ mb: 3, borderRadius: 2.5, border: `1px solid ${G[200]}` }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                color: G[500],
                '&.Mui-selected': { color: G[700] }
              },
              '& .MuiTabs-indicator': { bgcolor: G[600], height: 3 }
            }}
          >
            <Tab label={`All (${notifications.length})`} />
            <Tab label={`Unread (${unreadCount})`} />
            <Tab label={`Read (${readCount})`} />
          </Tabs>
        </Paper>

        {/* Notification List */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            border: '1.5px solid #d1fae5',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(6,95,70,0.07)'
          }}
        >
          {filteredNotifications.length === 0 ? (
            <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: G[100] }}>
                <InboxIcon sx={{ fontSize: 34, color: G[400] }} />
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: G[800] }}>
                {tabValue === 1 ? 'No Unread Notifications' : tabValue === 2 ? 'No Read Notifications' : 'No Notifications'}
              </Typography>
              <Typography variant="body2" sx={{ color: G[500] }}>
                {tabValue === 1 ? "You've read all your notifications!" : "You're all caught up. Check back later!"}
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {filteredNotifications.map((notif, index) => {
                const cfg = getConfig(notif.type);
                const isUnread = !notif.isRead;
                const relativeTime = getRelativeTime(notif.createdAt);
                
                return (
                  <React.Fragment key={notif._id}>
                    {index > 0 && <Divider sx={{ borderColor: G[100] }} />}
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        px: { xs: 2, sm: 3 },
                        py: 2,
                        transition: 'background 0.2s',
                        bgcolor: isUnread ? G[50] : '#fff',
                        borderLeft: isUnread ? `4px solid ${G[600]}` : '4px solid transparent',
                        '&:hover': { bgcolor: G[50] },
                      }}
                      secondaryAction={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {isUnread && (
                            <Tooltip title="Mark as read">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleMarkAsRead(notif._id)}
                                sx={{
                                  color: G[600],
                                  borderColor: G[300],
                                  fontWeight: 600,
                                  fontSize: '0.72rem',
                                  textTransform: 'none',
                                  borderRadius: '8px',
                                  minWidth: 90,
                                  '&:hover': { borderColor: G[600], background: G[50] },
                                }}
                              >
                                <MarkUnreadIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                Mark Read
                              </Button>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteNotification(notif._id)}
                              sx={{ color: '#ef4444', '&:hover': { bgcolor: alpha('#ef4444', 0.1) } }}
                            >
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                    >
                      <ListItemIcon sx={{ mt: 0.5, minWidth: 56 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            bgcolor: cfg.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: cfg.color,
                            flexShrink: 0,
                            position: 'relative'
                          }}
                        >
                          {isUnread && (
                            <CircleIcon sx={{ position: 'absolute', top: -2, left: -2, fontSize: 10, color: G[600] }} />
                          )}
                          {React.cloneElement(cfg.icon, { sx: { fontSize: 20, color: cfg.color } })}
                        </Box>
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: isUnread ? 700 : 500,
                                color: isUnread ? G[800] : G[600],
                                fontSize: '0.92rem',
                              }}
                            >
                              {notif.title}
                            </Typography>
                            <Chip
                              label={cfg.label}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                bgcolor: cfg.bg,
                                color: cfg.color,
                                border: 'none',
                                borderRadius: '6px',
                              }}
                            />
                            {notif.priority === 'high' && (
                              <Chip
                                label="High Priority"
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.65rem',
                                  fontWeight: 600,
                                  bgcolor: alpha('#ef4444', 0.1),
                                  color: '#ef4444',
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              variant="body2"
                              sx={{ color: 'text.secondary', fontSize: '0.82rem', lineHeight: 1.5, mb: 0.5 }}
                            >
                              {notif.message}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AccessTimeIcon sx={{ fontSize: 12, color: G[400] }} />
                              <Typography
                                variant="caption"
                                sx={{ color: G[600], fontWeight: 500, fontSize: '0.7rem' }}
                              >
                                {relativeTime || formatDate(notif.createdAt)}
                              </Typography>
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ParentNotifications;