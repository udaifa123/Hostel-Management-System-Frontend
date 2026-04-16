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
  IconButton  // ← ADD THIS IMPORT
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Event as EventIcon,
  Message as MessageIcon,
  DoneAll as DoneAllIcon,
  Circle as CircleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import parentService from '../../services/parentService';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

// ─── Color Tokens (Same as ParentStudentProfile) ───────────────────────────────
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
  attendance: { label: 'Attendance', color: '#0ea5e9',  bg: '#e0f2fe', icon: <EventIcon    sx={{ fontSize: 18 }} /> },
  leave:      { label: 'Leave',      color: '#f59e0b',  bg: '#fef9c3', icon: <InfoIcon     sx={{ fontSize: 18 }} /> },
  complaint:  { label: 'Complaint',  color: '#ef4444',  bg: '#fee2e2', icon: <WarningIcon  sx={{ fontSize: 18 }} /> },
  fee:        { label: 'Fee',        color: G[600],     bg: G[100],    icon: <CheckCircleIcon sx={{ fontSize: 18 }} /> },
  visit:      { label: 'Visit',      color: '#8b5cf6',  bg: '#ede9fe', icon: <EventIcon    sx={{ fontSize: 18 }} /> },
  message:    { label: 'Message',    color: G[700],     bg: G[50],     icon: <MessageIcon sx={{ fontSize: 18 }} /> },
  default:    { label: 'General',    color: '#6b7280',  bg: '#f3f4f6', icon: <NotificationsIcon sx={{ fontSize: 18 }} /> },
};

const getConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.default;

const ParentNotifications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await parentService.getNotifications();
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await parentService.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Marked as read');
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
      await Promise.all(unreadIds.map(id => parentService.markNotificationAsRead(id)));
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f0fdf4' }}>
        <CircularProgress sx={{ color: G[600] }} thickness={5} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0fdf4' }}>
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

          {unreadCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<DoneAllIcon sx={{ fontSize: 16 }} />}
              onClick={handleMarkAllAsRead}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.5)',
                fontWeight: 600,
                fontSize: '0.8rem',
                letterSpacing: 0.5,
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                py: 0.8,
                '&:hover': {
                  borderColor: '#fff',
                  background: 'rgba(255,255,255,0.12)',
                },
              }}
            >
              Mark All Read
            </Button>
          )}
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
                <NotificationsIcon sx={{ fontSize: 32 }} />
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
                  ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                  : "You're all caught up!"}
              </Typography>
            </Box>
          </Box>
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
          {notifications.length === 0 ? (
            <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: G[100] }}>
                <CheckCircleIcon sx={{ fontSize: 34, color: G[500] }} />
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: G[800] }}>
                No Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You're all caught up. Check back later!
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((notif, index) => {
                const cfg = getConfig(notif.type);
                return (
                  <React.Fragment key={notif._id}>
                    {index > 0 && <Divider sx={{ borderColor: G[100] }} />}
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        px: { xs: 2, sm: 3 },
                        py: 2,
                        transition: 'background 0.2s',
                        bgcolor: notif.isRead ? '#fff' : G[50],
                        borderLeft: notif.isRead ? '4px solid transparent' : `4px solid ${G[600]}`,
                        '&:hover': { bgcolor: G[50] },
                      }}
                      secondaryAction={
                        !notif.isRead && (
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
                              px: 1.5,
                              py: 0.5,
                              '&:hover': {
                                borderColor: G[600],
                                background: G[50],
                              },
                            }}
                          >
                            Mark Read
                          </Button>
                        )
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
                          {!notif.isRead && (
                            <CircleIcon sx={{ position: 'absolute', top: -2, left: -2, fontSize: 10, color: G[600] }} />
                          )}
                          {React.cloneElement(cfg.icon, { sx: { fontSize: 20, color: cfg.color } })}
                        </Box>
                      </ListItemIcon>

                      <ListItemText
                        sx={{ mr: notif.isRead ? 0 : 13 }}
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: notif.isRead ? 500 : 700,
                                color: notif.isRead ? 'text.primary' : G[800],
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
                                '& .MuiChip-label': { px: 1 },
                              }}
                            />
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
                            <Typography
                              variant="caption"
                              sx={{ color: G[600], fontWeight: 500, fontSize: '0.7rem' }}
                            >
                              {format(parseISO(notif.createdAt), 'dd MMM yyyy, hh:mm a')}
                            </Typography>
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
    </Box>
  );
};

export default ParentNotifications;