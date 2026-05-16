import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Badge,
  CircularProgress,
  InputAdornment,
  Alert,
  Snackbar,
  Tooltip,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import {
  Send as SendIcon,
  Check as CheckIcon,
  DoneAll as DoneAllIcon,
  WifiOff as WifiOffIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useCall } from '../../context/CallContext';
import { format, isToday, isYesterday } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'https://hostel-management-system-backened-1.onrender.com/api';

const StudentChat = () => {
  const theme = useTheme();
  const { user, token } = useAuth();
  const { socket, isConnected, isOnline, joinChat, leaveChat, sendTyping } = useSocket();
  const { startCall } = useCall();
  
  const [loading, setLoading] = useState(true);
  const [warden, setWarden] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [retryCount, setRetryCount] = useState(0); // Add retry counter
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isSendingRef = useRef(false); // Add ref to prevent multiple sends

  useEffect(() => {
    fetchWardenInfo();
  }, []);

  useEffect(() => {
    if (warden && warden._id) {
      fetchMessages();
      if (joinChat) {
        joinChat(warden._id);
      }
    }

    return () => {
      if (warden && warden._id && leaveChat) {
        leaveChat(warden._id);
      }
    };
  }, [warden]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !warden) return;

    const handleNewMessage = (message) => {
      if (message.sender._id === warden._id || message.receiver._id === warden._id) {
        setMessages(prev => [...prev, message]);
        markMessagesAsRead();
      }
    };

    const handleMessagesRead = (data) => {
      if (data.reader === warden._id) {
        setMessages(prev => prev.map(msg => 
          msg.sender._id === warden._id ? { ...msg, isRead: true } : msg
        ));
      }
    };

    const handleTyping = ({ userId, isTyping }) => {
      if (userId === warden._id) {
        setIsTyping(isTyping);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);
    socket.on('user_typing', handleTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
      socket.off('user_typing', handleTyping);
    };
  }, [socket, warden]);

  const fetchWardenInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/chat/online-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const wardenData = response.data.data.find(u => u.role === 'warden');
      
      if (wardenData) {
        setWarden(wardenData);
      } else {
        setError('No warden assigned to your hostel');
      }
    } catch (error) {
      console.error('Error fetching warden:', error);
      setError('Failed to load chat. Please try again.');
      showSnackbar('Failed to load warden information', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!warden || !warden._id) return;

    try {
      const response = await axios.get(`${API_URL}/chat/messages/${warden._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.data) {
        setMessages(response.data.data || []);
      }
      
      markMessagesAsRead();
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Don't show error for message fetch failures
    }
  };

  const markMessagesAsRead = async () => {
    if (!warden || !warden._id) return;
    
    try {
      await axios.put(`${API_URL}/chat/read/${warden._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async () => {
    // Prevent multiple simultaneous sends
    if (isSendingRef.current) {
      console.log('Already sending a message, skipping...');
      return;
    }
    
    if (!newMessage.trim() || !warden || !warden._id) {
      showSnackbar('Cannot send empty message', 'warning');
      return;
    }

    if (!isConnected) {
      showSnackbar('Not connected to chat server. Please wait...', 'warning');
      return;
    }

    isSendingRef.current = true;
    setSendingMessage(true);
    const messageContent = newMessage.trim();
    const currentMessage = newMessage; // Store current message
    setNewMessage(''); // Clear input immediately

    try {
      const requestData = {
        receiverId: warden._id,
        content: messageContent
      };
      
      if (conversationId) {
        requestData.conversationId = conversationId;
      }
      
      console.log('Sending message with data:', requestData);
      
      const response = await axios.post(`${API_URL}/chat/send`, requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.data) {
        setMessages(prev => [...prev, response.data.data]);
        
        if (response.data.data.conversationId && !conversationId) {
          setConversationId(response.data.data.conversationId);
        }
        
        if (sendTyping) {
          sendTyping(warden._id, false);
        }
        
        setTimeout(scrollToBottom, 100);
        setRetryCount(0); // Reset retry count on success
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Restore the message if send failed
      setNewMessage(currentMessage);
      
      let errorMessage = 'Failed to send message';
      
      if (error.response) {
        const serverError = error.response.data?.message || '';
        console.error('Server response:', error.response.data);
        
        if (serverError.includes('duplicate key error')) {
          errorMessage = 'Refreshing conversation...';
          showSnackbar(errorMessage, 'info');
          // Refresh messages to get conversation ID
          await fetchMessages();
          // Don't retry automatically - let user retry manually
        } else {
          errorMessage = serverError || `Server error: ${error.response.status}`;
          showSnackbar(errorMessage, 'error');
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Check your connection.';
        showSnackbar(errorMessage, 'error');
      } else {
        errorMessage = error.message || 'Failed to send message';
        showSnackbar(errorMessage, 'error');
      }
    } finally {
      setSendingMessage(false);
      isSendingRef.current = false;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !sendingMessage && !isSendingRef.current) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTypingInput = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (!warden || !warden._id || !sendTyping) return;

    if (!typing && value.length > 0) {
      setTyping(true);
      sendTyping(warden._id, true);
    }

    if (value.length === 0 && typing) {
      setTyping(false);
      sendTyping(warden._id, false);
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (typing) {
        setTyping(false);
        if (sendTyping && warden?._id) {
          sendTyping(warden._id, false);
        }
      }
    }, 1000);
  };

  const handleCall = (type) => {
    if (!warden || !warden._id) {
      showSnackbar('No warden available', 'warning');
      return;
    }
    
    if (!isConnected) {
      showSnackbar('Not connected to server', 'warning');
      return;
    }
    
    console.log(`🎯 Starting ${type} call to warden:`, warden._id);
    startCall(warden._id, type);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'hh:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'hh:mm a')}`;
    } else {
      return format(date, 'dd MMM yyyy, hh:mm a');
    }
  };

  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const renderCallButton = (type, icon, label) => {
    const isDisabled = !isConnected || !warden?._id;
    
    const button = (
      <IconButton
        onClick={() => handleCall(type)}
        disabled={isDisabled}
        sx={{ 
          color: !isDisabled ? '#10b981' : '#94a3b8',
          '&:hover': { bgcolor: alpha('#10b981', 0.1) }
        }}
      >
        {icon}
      </IconButton>
    );

    if (isDisabled) {
      return <span>{button}</span>;
    }
    
    return <Tooltip title={label}>{button}</Tooltip>;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!warden) {
    return (
      <Box p={3}>
        <Alert severity="info">No warden available for chat</Alert>
      </Box>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      {/* Connection Status */}
      {!isConnected && (
        <Alert 
          severity="warning" 
          icon={<WifiOffIcon />}
          sx={{ mb: 2 }}
        >
          Connecting to chat server...
        </Alert>
      )}

      {/* Header with Warden Info */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Badge
              color="success"
              variant="dot"
              invisible={!isOnline(warden._id)}
              overlap="circular"
            >
              <Avatar sx={{ bgcolor: '#10b981' }}>W</Avatar>
            </Badge>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {warden.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {isOnline(warden._id) ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </Box>
          
          {/* Call Buttons */}
          <Box display="flex" gap={1}>
            {renderCallButton('audio', <PhoneIcon />, 'Audio Call')}
            {renderCallButton('video', <VideoCallIcon />, 'Video Call')}
          </Box>
        </Box>
      </Paper>

      {/* Messages Area */}
      <Paper sx={{ flex: 1, overflow: 'auto', p: 2, mb: 2, bgcolor: '#f8fafc' }}>
        {messages.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography color="textSecondary">No messages yet. Say hello!</Typography>
          </Box>
        ) : (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <Box key={date}>
              <Box display="flex" justifyContent="center" mb={2}>
                <Chip
                  label={isToday(new Date(date)) ? 'Today' : format(new Date(date), 'dd MMM yyyy')}
                  size="small"
                  sx={{ bgcolor: alpha('#64748b', 0.1), color: '#64748b' }}
                />
              </Box>

              {msgs.map((msg) => (
                <Box
                  key={msg._id}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.sender?._id === user?.id ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Box sx={{ maxWidth: '70%' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: msg.sender?._id === user?.id ? '#10b981' : 'white',
                        color: msg.sender?._id === user?.id ? 'white' : 'inherit',
                        borderRadius: 2,
                        borderTopRightRadius: msg.sender?._id === user?.id ? 0 : 2,
                        borderTopLeftRadius: msg.sender?._id === user?.id ? 2 : 0
                      }}
                    >
                      <Typography variant="body2">{msg.content}</Typography>
                    </Paper>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ mr: 0.5 }}>
                        {formatMessageTime(msg.createdAt)}
                      </Typography>
                      {msg.sender?._id === user?.id && (
                        msg.isRead ? (
                          <DoneAllIcon fontSize="small" sx={{ color: '#10b981' }} />
                        ) : (
                          <CheckIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                        )
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ))
        )}
        
        {isTyping && (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: '#10b981' }}>
              {warden.name.charAt(0)}
            </Avatar>
            <Typography variant="caption" color="textSecondary">
              typing...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Message Input */}
      <Paper sx={{ p: 2 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTypingInput}
          onKeyPress={handleKeyPress}
          disabled={!isConnected || sendingMessage}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !isConnected || sendingMessage}
                  sx={{ 
                    bgcolor: '#10b981', 
                    color: 'white', 
                    '&:hover': { bgcolor: '#059669' },
                    '&.Mui-disabled': { bgcolor: alpha('#10b981', 0.5) }
                  }}
                >
                  {sendingMessage ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Paper>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentChat;