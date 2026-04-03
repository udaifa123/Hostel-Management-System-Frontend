// components/NotificationBell.jsx
import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  Typography,
  Box,
  Avatar,
  Divider,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  alpha
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  DoneAll as DoneAllIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import notificationService from '../services/notificationService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      notificationService.initSocket(token, user.id, user.role);
      
      const unsubscribeNew = notificationService.onNotification('new', (notification) => {
        setNotifications(prev => [notification, ...prev.slice(0, 9)]);
        setUnreadCount(prev => prev + 1);
      });
      
      const unsubscribeCount = notificationService.onNotification('count_update', (count) => {
        setUnreadCount(count);
      });
      
      fetchUnreadCount();
      
      return () => {
        unsubscribeNew();
        unsubscribeCount();
        notificationService.disconnect();
      };
    }
  }, [user, token]);

  const fetchUnreadCount = async () => {
    const count = await notificationService.fetchUnreadCount();
    setUnreadCount(count);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.fetchNotifications({ limit: 10 });
      if (response.success) {
        setNotifications(response.data);
        setUnreadCount(response.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async (event) => {
    setAnchorEl(event.currentTarget);
    await fetchNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (id, event) => {
    event.stopPropagation();
    await notificationService.markAsRead(id);
    setNotifications(prev =>
      prev.map(n => n._id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      notificationService.markAsRead(notification._id);
    }
    handleClose();
    if (notification.data?.actionUrl) {
      navigate(notification.data.actionUrl);
    }
  };

  const getIcon = (type) => {
    const icons = {
      attendance: '📊',
      leave: '📋',
      complaint: '⚠️',
      fee: '💰',
      visit: '👤',
      message: '💬',
      notice: '📢'
    };
    return icons[type] || '🔔';
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton onClick={handleOpen} sx={{ color: '#64748b' }}>
          <Badge
            badgeContent={unreadCount}
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.7rem',
                minWidth: '18px',
                height: '18px'
              }
            }}
          >
            {unreadCount > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
            borderRadius: 2,
            overflow: 'hidden',
            mt: 1.5
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: '#e2e8f0', bgcolor: '#f8fafc' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>Notifications</Typography>
            {unreadCount > 0 && (
              <Button size="small" startIcon={<DoneAllIcon />} onClick={handleMarkAllAsRead}>
                Mark all read
              </Button>
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Typography>
        </Box>

        <Box sx={{ maxHeight: 380, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <NotificationsNoneIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
              <Typography color="text.secondary">No notifications</Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification) => (
                <ListItem
                  key={notification._id}
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    bgcolor: notification.isRead ? 'transparent' : alpha('#667eea', 0.05),
                    '&:hover': { bgcolor: alpha('#667eea', 0.1) },
                    py: 1.5,
                    px: 2
                  }}
                  secondaryAction={
                    !notification.isRead && (
                      <IconButton size="small" onClick={(e) => handleMarkAsRead(notification._id, e)}>
                        <CircleIcon sx={{ fontSize: 10, color: '#667eea' }} />
                      </IconButton>
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: alpha('#667eea', 0.1) }}>
                      <Typography fontSize={20}>{getIcon(notification.type)}</Typography>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={notification.isRead ? 400 : 600} noWrap>
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box sx={{ p: 1.5, borderTop: 1, borderColor: '#e2e8f0', textAlign: 'center' }}>
          <Button fullWidth onClick={() => { navigate(`/${user?.role}/notifications`); handleClose(); }}>
            View All Notifications
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default NotificationBell;