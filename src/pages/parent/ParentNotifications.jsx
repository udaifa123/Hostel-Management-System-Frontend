import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
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
  Avatar
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
  Circle as CircleIcon
} from '@mui/icons-material';
import parentService from '../../services/parentService';
import ParentLayout from '../../components/Layout/ParentLayout';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

// ─── Color Tokens ───────────────────────────────────────────────
const GREEN = {
  50:  '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
};

// ─── Type Config ────────────────────────────────────────────────
const TYPE_CONFIG = {
  attendance: { label: 'Attendance', color: '#0ea5e9',  bg: '#e0f2fe', icon: <EventIcon    sx={{ fontSize: 18 }} /> },
  leave:      { label: 'Leave',      color: '#f59e0b',  bg: '#fef9c3', icon: <InfoIcon     sx={{ fontSize: 18 }} /> },
  complaint:  { label: 'Complaint',  color: '#ef4444',  bg: '#fee2e2', icon: <WarningIcon  sx={{ fontSize: 18 }} /> },
  fee:        { label: 'Fee',        color: GREEN[600],  bg: GREEN[100], icon: <CheckCircleIcon sx={{ fontSize: 18 }} /> },
  visit:      { label: 'Visit',      color: '#8b5cf6',  bg: '#ede9fe', icon: <EventIcon    sx={{ fontSize: 18 }} /> },
  message:    { label: 'Message',    color: GREEN[700],  bg: GREEN[50],  icon: <MessageIcon sx={{ fontSize: 18 }} /> },
  default:    { label: 'General',    color: '#6b7280',  bg: '#f3f4f6', icon: <NotificationsIcon sx={{ fontSize: 18 }} /> },
};

const getConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.default;

// ─── Styles ─────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    background: `linear-gradient(160deg, ${GREEN[50]} 0%, #ffffff 60%, ${GREEN[100]} 100%)`,
    py: 4,
  },
  headerCard: {
    background: `linear-gradient(135deg, ${GREEN[700]} 0%, ${GREEN[500]} 100%)`,
    borderRadius: 3,
    p: { xs: 2.5, sm: 3.5 },
    mb: 3,
    boxShadow: `0 8px 32px ${GREEN[200]}`,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -40,
      right: -40,
      width: 160,
      height: 160,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.08)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -20,
      right: 60,
      width: 80,
      height: 80,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.05)',
    },
  },
  badgeAvatar: {
    width: 52,
    height: 52,
    bgcolor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(8px)',
    border: '2px solid rgba(255,255,255,0.3)',
  },
  markAllBtn: {
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
  },
  listCard: {
    borderRadius: 3,
    overflow: 'hidden',
    boxShadow: `0 2px 20px rgba(0,0,0,0.06)`,
    border: `1px solid ${GREEN[100]}`,
  },
  notifItem: (isRead) => ({
    px: { xs: 2, sm: 3 },
    py: 2,
    transition: 'background 0.2s',
    background: isRead ? '#fff' : GREEN[50],
    borderLeft: isRead ? '4px solid transparent' : `4px solid ${GREEN[500]}`,
    '&:hover': {
      background: GREEN[50],
    },
  }),
  iconWrap: (cfg) => ({
    width: 40,
    height: 40,
    borderRadius: 2,
    bgcolor: cfg.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: cfg.color,
    flexShrink: 0,
  }),
  markReadBtn: {
    color: GREEN[700],
    borderColor: GREEN[300],
    fontWeight: 600,
    fontSize: '0.72rem',
    textTransform: 'none',
    borderRadius: 2,
    minWidth: 90,
    px: 1.5,
    py: 0.5,
    '&:hover': {
      borderColor: GREEN[600],
      background: GREEN[50],
    },
  },
  emptyState: {
    py: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1.5,
  },
};

// ─── Component ──────────────────────────────────────────────────
const ParentNotifications = () => {
  const [loading, setLoading]           = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]   = useState(0);

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

  // ── Loading ──
  if (loading) {
    return (
      <ParentLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress sx={{ color: GREEN[600] }} />
        </Box>
      </ParentLayout>
    );
  }

  // ── Render ──
  return (
    <ParentLayout>
      <Box sx={styles.page}>
        <Container maxWidth="md">

          {/* ── Header Card ── */}
          <Paper elevation={0} sx={styles.headerCard}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={styles.badgeAvatar}>
                  <Badge
                    badgeContent={unreadCount}
                    color="error"
                    max={99}
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 18, height: 18 } }}
                  >
                    <NotificationsIcon sx={{ color: '#fff', fontSize: 26 }} />
                  </Badge>
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.3px' }}>
                    Notifications
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.3, fontSize: '0.82rem' }}>
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                      : 'You\'re all caught up!'}
                  </Typography>
                </Box>
              </Box>

              {unreadCount > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<DoneAllIcon sx={{ fontSize: 16 }} />}
                  onClick={handleMarkAllAsRead}
                  sx={styles.markAllBtn}
                >
                  Mark All Read
                </Button>
              )}
            </Box>
          </Paper>

          {/* ── Notification List ── */}
          <Paper elevation={0} sx={styles.listCard}>
            {notifications.length === 0 ? (
              <Box sx={styles.emptyState}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: GREEN[100] }}>
                  <CheckCircleIcon sx={{ fontSize: 34, color: GREEN[500] }} />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: GREEN[800] }}>
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
                      {index > 0 && <Divider sx={{ borderColor: GREEN[100] }} />}
                      <ListItem
                        alignItems="flex-start"
                        sx={styles.notifItem(notif.isRead)}
                        secondaryAction={
                          !notif.isRead && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleMarkAsRead(notif._id)}
                              sx={styles.markReadBtn}
                            >
                              Mark Read
                            </Button>
                          )
                        }
                      >
                        {/* Icon */}
                        <ListItemIcon sx={{ mt: 0.5, minWidth: 56 }}>
                          <Box sx={styles.iconWrap(cfg)}>
                            {!notif.isRead && (
                              <CircleIcon sx={{ position: 'absolute', top: 6, left: 6, fontSize: 8, color: GREEN[500] }} />
                            )}
                            {React.cloneElement(cfg.icon, { sx: { fontSize: 20, color: cfg.color } })}
                          </Box>
                        </ListItemIcon>

                        {/* Content */}
                        <ListItemText
                          sx={{ mr: notif.isRead ? 0 : 13 }}
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.3 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: notif.isRead ? 500 : 700,
                                  color: notif.isRead ? 'text.primary' : GREEN[800],
                                  fontSize: '0.92rem',
                                }}
                              >
                                {notif.title}
                              </Typography>
                              <Chip
                                label={cfg.label}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: '0.65rem',
                                  fontWeight: 600,
                                  bgcolor: cfg.bg,
                                  color: cfg.color,
                                  border: 'none',
                                  '& .MuiChip-label': { px: 1 },
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', fontSize: '0.82rem', lineHeight: 1.6, mb: 0.5 }}
                              >
                                {notif.message}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: GREEN[600], fontWeight: 500, fontSize: '0.72rem' }}
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

        </Container>
      </Box>
    </ParentLayout>
  );
};

export default ParentNotifications;