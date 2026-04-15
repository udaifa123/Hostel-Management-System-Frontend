import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  IconButton,
  CircularProgress,
  Badge,
  Chip,
  Divider
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  Circle as CircleIcon,
  WifiOff as WifiOffIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import parentService from '../../services/parentService';
import ParentLayout from '../../components/Layout/ParentLayout';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Color Tokens
const G = {
  50:  '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
};

const ParentChat = () => {
  const { user, token } = useAuth();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [wardens, setWardens] = useState([]);
  const [selectedWarden, setSelectedWarden] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Setup Socket
  useEffect(() => {
    if (!token) return;
    
    const socket = io(API_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });
    
    socket.on('connect', () => {
      console.log('✅ Chat socket connected');
      setIsConnected(true);
    });
    
    socket.on('disconnect', () => {
      console.log('❌ Chat socket disconnected');
      setIsConnected(false);
    });
    
    socket.on('new_message', (message) => {
      console.log('📩 New message received:', message);
      if (selectedWarden && message.sender._id === selectedWarden._id) {
        setMessages(prev => [...prev, message]);
      }
    });
    
    socketRef.current = socket;
    
    return () => {
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    fetchWardens();
  }, []);

  useEffect(() => {
    if (selectedWarden) {
      fetchChatHistory();
    }
  }, [selectedWarden]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchWardens = async () => {
    try {
      setLoading(true);
      const response = await parentService.getWardens();
      console.log('Wardens response:', response);
      
      if (response.success && response.data && response.data.length > 0) {
        setWardens(response.data);
        setSelectedWarden(response.data[0]);
      } else {
        setWardens([]);
        toast.error(response.message || 'No warden found');
      }
    } catch (error) {
      console.error('Error fetching wardens:', error);
      toast.error('Failed to load wardens');
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    if (!selectedWarden) return;
    
    try {
      const response = await parentService.getChatHistory(selectedWarden._id);
      console.log('Chat history:', response);
      
      if (response.success) {
        setMessages(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedWarden || sending) return;
    
    setSending(true);
    try {
      const response = await parentService.sendMessage(selectedWarden._id, newMessage);
      console.log('Send message response:', response);
      
      if (response.success) {
        setMessages(prev => [...prev, response.data]);
        setNewMessage('');
        scrollToBottom();
      }
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <ParentLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress sx={{ color: G[600] }} />
        </Box>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <Box sx={{ minHeight: '100vh', background: `linear-gradient(160deg, ${G[50]} 0%, #fff 60%, ${G[100]} 100%)`, py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              background: `linear-gradient(135deg, ${G[700]} 0%, ${G[500]} 100%)`,
              borderRadius: 3,
              p: 3,
              mb: 3,
              boxShadow: `0 8px 32px ${G[200]}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <ChatIcon sx={{ color: '#fff', fontSize: 24 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                    Chat with Warden
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                    Real-time messaging
                  </Typography>
                </Box>
              </Box>
              <Chip
                icon={isConnected ? <CircleIcon sx={{ fontSize: 10, color: '#4ade80' }} /> : <WifiOffIcon sx={{ fontSize: 14, color: '#fca5a5' }} />}
                label={isConnected ? 'Connected' : 'Connecting...'}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }}
              />
            </Box>
          </Paper>

          {/* Chat Grid */}
          <Grid container spacing={2.5} sx={{ height: 620 }}>
            {/* Wardens List */}
            <Grid size={{ xs: 12, md: 3.5 }}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: `1px solid ${G[100]}`,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ px: 2.5, py: 2, background: G[50], borderBottom: `1px solid ${G[100]}` }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: G[800] }}>
                    WARDENS
                  </Typography>
                </Box>
                
                {wardens.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No wardens available
                    </Typography>
                  </Box>
                ) : (
                  <List disablePadding sx={{ flex: 1, overflowY: 'auto' }}>
                    {wardens.map((warden) => (
                      <ListItem
                        key={warden._id}
                        button
                        selected={selectedWarden?._id === warden._id}
                        onClick={() => setSelectedWarden(warden)}
                        sx={{
                          px: 2.5,
                          py: 1.5,
                          borderLeft: selectedWarden?._id === warden._id ? `4px solid ${G[500]}` : '4px solid transparent',
                          bgcolor: selectedWarden?._id === warden._id ? G[50] : 'transparent',
                          '&:hover': { bgcolor: G[50] }
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: G[500], border: '2px solid #fff' }} />
                            }
                          >
                            <Avatar sx={{ bgcolor: selectedWarden?._id === warden._id ? G[600] : G[200], color: G[800] }}>
                              {warden.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: selectedWarden?._id === warden._id ? 700 : 500 }}>
                              {warden.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: G[600] }}>
                              {warden.unreadCount > 0 ? `${warden.unreadCount} unread` : 'Warden'}
                            </Typography>
                          }
                        />
                        {warden.unreadCount > 0 && (
                          <Chip label={warden.unreadCount} size="small" sx={{ bgcolor: G[500], color: '#fff', height: 20, fontSize: '0.7rem' }} />
                        )}
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>

            {/* Chat Area */}
            <Grid size={{ xs: 12, md: 8.5 }}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: `1px solid ${G[100]}`,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {selectedWarden ? (
                  <>
                    {/* Chat Header */}
                    <Box sx={{
                      px: 3, py: 2,
                      borderBottom: `1px solid ${G[100]}`,
                      background: G[50],
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}>
                      <Avatar sx={{ width: 42, height: 42, bgcolor: G[600] }}>
                        {selectedWarden.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: G[800] }}>
                          {selectedWarden.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: G[600] }}>
                          Hostel Warden
                        </Typography>
                      </Box>
                      <IconButton onClick={fetchChatHistory} sx={{ ml: 'auto' }}>
                        <RefreshIcon />
                      </IconButton>
                    </Box>

                    {/* Messages */}
                    <Box sx={{
                      flex: 1,
                      overflowY: 'auto',
                      p: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      background: '#fafafa',
                    }}>
                      {messages.length === 0 ? (
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 56, height: 56, bgcolor: G[100] }}>
                            <ChatIcon sx={{ fontSize: 28, color: G[400] }} />
                          </Avatar>
                          <Typography variant="body2" color="text.secondary">
                            No messages yet. Start a conversation!
                          </Typography>
                        </Box>
                      ) : (
                        messages.map((msg, idx) => {
                          const isMyMessage = msg.sender?._id === user?.id || msg.sender === user?.id;
                          return (
                            <Box
                              key={idx}
                              sx={{
                                display: 'flex',
                                justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                              }}
                            >
                              {!isMyMessage && (
                                <Avatar sx={{ width: 28, height: 28, bgcolor: G[200], mr: 1, fontSize: '0.75rem' }}>
                                  {selectedWarden.name?.charAt(0)?.toUpperCase()}
                                </Avatar>
                              )}
                              <Box sx={{ maxWidth: '65%' }}>
                                <Paper sx={{
                                  px: 2, py: 1,
                                  borderRadius: isMyMessage ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                  bgcolor: isMyMessage ? G[600] : '#fff',
                                  color: isMyMessage ? '#fff' : '#333',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                }}>
                                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                    {msg.content}
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, textAlign: 'right', color: isMyMessage ? 'rgba(255,255,255,0.7)' : G[400], fontSize: '0.65rem' }}>
                                    {msg.createdAt ? format(parseISO(msg.createdAt), 'hh:mm a') : new Date().toLocaleTimeString()}
                                  </Typography>
                                </Paper>
                              </Box>
                            </Box>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </Box>

                    {/* Input */}
                    <Box sx={{
                      px: 2.5, py: 2,
                      borderTop: `1px solid ${G[100]}`,
                      background: '#fff',
                      display: 'flex',
                      gap: 1.5,
                    }}>
                      <TextField
                        fullWidth
                        multiline
                        maxRows={3}
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={sending}
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            '& fieldset': { borderColor: G[200] },
                            '&:hover fieldset': { borderColor: G[400] },
                          }
                        }}
                      />
                      <IconButton
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                        sx={{
                          width: 42, height: 42,
                          bgcolor: newMessage.trim() && !sending ? G[600] : G[100],
                          color: newMessage.trim() && !sending ? '#fff' : G[300],
                          borderRadius: 2.5,
                          '&:hover': {
                            bgcolor: newMessage.trim() && !sending ? G[700] : G[100],
                          }
                        }}
                      >
                        {sending ? <CircularProgress size={20} /> : <SendIcon />}
                      </IconButton>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: G[100] }}>
                      <ChatIcon sx={{ fontSize: 34, color: G[400] }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: G[600] }}>Select a Warden</Typography>
                    <Typography variant="body2" color="text.secondary">Choose a warden from the list to start chatting</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ParentLayout>
  );
};

export default ParentChat;