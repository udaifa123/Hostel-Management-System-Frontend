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
  Chip
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  Circle as CircleIcon,
  WifiOff as WifiOffIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import parentService from '../../services/parentService';
import ParentLayout from '../../components/Layout/ParentLayout';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

// ─── Color Tokens ───────────────────────────────────────────────
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

// ─── Helper ─────────────────────────────────────────────────────
const isMine = (msg, userId) =>
  msg.sender === userId || msg.senderId === userId;

// ─── Component ──────────────────────────────────────────────────
const ParentChat = () => {
  const { user } = useAuth();
  const { socket, isConnected, sendMessage: socketSendMessage } = useSocket();
  const messagesEndRef = useRef(null);

  const [loading, setLoading]           = useState(true);
  const [wardens, setWardens]           = useState([]);
  const [selectedWarden, setSelectedWarden] = useState(null);
  const [messages, setMessages]         = useState([]);
  const [newMessage, setNewMessage]     = useState('');
  const [sending, setSending]           = useState(false);

  useEffect(() => { fetchWardens(); }, []);

  useEffect(() => {
    if (selectedWarden) fetchChatHistory(selectedWarden._id);
  }, [selectedWarden]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (message) => {
      if (selectedWarden && (message.sender === selectedWarden._id || message.senderId === selectedWarden._id)) {
        setMessages(prev => [...prev, message]);
      }
    };
    socket.on('receive_message', handleReceiveMessage);
    socket.on('new_message', handleReceiveMessage);
    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('new_message', handleReceiveMessage);
    };
  }, [socket, selectedWarden]);

  const fetchWardens = async () => {
    try {
      setLoading(true);
      const response = await parentService.getWardens();
      setWardens(response.data || []);
      if (response.data.length > 0) setSelectedWarden(response.data[0]);
    } catch (error) {
      console.error('Error fetching wardens:', error);
      toast.error('Failed to load wardens');
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (wardenId) => {
    try {
      const response = await parentService.getChatHistory(wardenId);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast.error('Failed to load chat history');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedWarden || sending) return;
    setSending(true);
    try {
      const response = await parentService.sendMessage(selectedWarden._id, newMessage);
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      if (socket && isConnected) {
        socket.emit('send_message', {
          receiverId: selectedWarden._id,
          message: newMessage,
          senderId: user?.id,
          senderName: user?.name
        });
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

          {/* ── Page Header ── */}
          <Paper
            elevation={0}
            sx={{
              background: `linear-gradient(135deg, ${G[700]} 0%, ${G[500]} 100%)`,
              borderRadius: 3,
              p: { xs: 2.5, sm: 3 },
              mb: 3,
              boxShadow: `0 8px 32px ${G[200]}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""', position: 'absolute',
                top: -40, right: -40,
                width: 150, height: 150,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.07)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)' }}>
                  <ChatIcon sx={{ color: '#fff', fontSize: 24 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
                    Chat with Warden
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem' }}>
                    Real-time messaging
                  </Typography>
                </Box>
              </Box>

              {/* Connection Badge */}
              <Chip
                icon={
                  isConnected
                    ? <CircleIcon sx={{ fontSize: '10px !important', color: G[400] }} />
                    : <WifiOffIcon sx={{ fontSize: '14px !important', color: '#fca5a5' }} />
                }
                label={isConnected ? 'Connected' : 'Connecting...'}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  border: '1px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(8px)',
                  '& .MuiChip-icon': { ml: 0.5 },
                }}
              />
            </Box>
          </Paper>

          {/* ── Main Grid ── */}
          <Grid container spacing={2.5} sx={{ height: 620 }}>

            {/* ── Warden Sidebar ── */}
            <Grid size={{ xs: 12, md: 3 }}>
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
                {/* Sidebar Header */}
                <Box sx={{
                  px: 2.5, py: 2,
                  background: G[50],
                  borderBottom: `1px solid ${G[100]}`,
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: G[800], fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Wardens
                  </Typography>
                </Box>

                {/* Warden List */}
                <List disablePadding sx={{ flex: 1, overflowY: 'auto' }}>
                  {wardens.length === 0 ? (
                    <ListItem sx={{ py: 4, justifyContent: 'center' }}>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        No wardens available
                      </Typography>
                    </ListItem>
                  ) : wardens.map((warden) => {
                    const selected = selectedWarden?._id === warden._id;
                    return (
                      <ListItem
                        key={warden._id}
                        button
                        selected={selected}
                        onClick={() => setSelectedWarden(warden)}
                        sx={{
                          px: 2, py: 1.5,
                          borderLeft: selected ? `4px solid ${G[500]}` : '4px solid transparent',
                          bgcolor: selected ? G[50] : 'transparent',
                          transition: 'all 0.15s',
                          '&:hover': { bgcolor: G[50] },
                          '&.Mui-selected': { bgcolor: G[50] },
                        }}
                      >
                        <ListItemAvatar sx={{ minWidth: 44 }}>
                          <Avatar
                            sx={{
                              width: 36, height: 36,
                              bgcolor: selected ? G[600] : G[200],
                              color: selected ? '#fff' : G[800],
                              fontWeight: 700,
                              fontSize: '0.85rem',
                            }}
                          >
                            {warden.name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: selected ? 700 : 500, color: selected ? G[800] : 'text.primary', fontSize: '0.88rem' }}>
                              {warden.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ color: G[600], fontSize: '0.72rem', fontWeight: 500 }}>
                              Warden
                            </Typography>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            </Grid>

            {/* ── Chat Area ── */}
            <Grid size={{ xs: 12, md: 9 }}>
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
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: isConnected ? G[500] : '#9ca3af', border: '2px solid #fff' }} />
                        }
                      >
                        <Avatar sx={{ width: 42, height: 42, bgcolor: G[600], fontWeight: 700 }}>
                          {selectedWarden.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                      </Badge>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: G[800], lineHeight: 1.2 }}>
                          {selectedWarden.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: G[600], fontSize: '0.72rem', fontWeight: 500 }}>
                          Hostel Warden
                        </Typography>
                      </Box>
                    </Box>

                    {/* Messages */}
                    <Box
                      sx={{
                        flex: 1,
                        overflowY: 'auto',
                        p: 2.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        background: '#fafafa',
                        '&::-webkit-scrollbar': { width: 4 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: G[200], borderRadius: 4 },
                      }}
                    >
                      {messages.length === 0 && (
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, py: 6 }}>
                          <Avatar sx={{ width: 56, height: 56, bgcolor: G[100] }}>
                            <ChatIcon sx={{ fontSize: 28, color: G[400] }} />
                          </Avatar>
                          <Typography variant="body2" color="text.secondary">
                            No messages yet. Say hello!
                          </Typography>
                        </Box>
                      )}

                      {messages.map((msg, index) => {
                        const mine = isMine(msg, user?.id);
                        return (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              justifyContent: mine ? 'flex-end' : 'flex-start',
                            }}
                          >
                            {!mine && (
                              <Avatar
                                sx={{
                                  width: 28, height: 28,
                                  bgcolor: G[200], color: G[800],
                                  fontSize: '0.75rem', fontWeight: 700,
                                  mr: 1, mt: 'auto', mb: 0.5, flexShrink: 0,
                                }}
                              >
                                {selectedWarden.name?.charAt(0)?.toUpperCase()}
                              </Avatar>
                            )}
                            <Box sx={{ maxWidth: '65%' }}>
                              <Box
                                sx={{
                                  px: 2, py: 1.2,
                                  borderRadius: mine
                                    ? '18px 18px 4px 18px'
                                    : '18px 18px 18px 4px',
                                  background: mine
                                    ? `linear-gradient(135deg, ${G[600]}, ${G[500]})`
                                    : '#fff',
                                  boxShadow: mine
                                    ? `0 4px 14px ${G[200]}`
                                    : '0 2px 8px rgba(0,0,0,0.06)',
                                  border: mine ? 'none' : `1px solid ${G[100]}`,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: mine ? '#fff' : 'text.primary',
                                    fontSize: '0.88rem',
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {msg.content || msg.message}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: 'block',
                                    mt: 0.5,
                                    fontSize: '0.68rem',
                                    color: mine ? 'rgba(255,255,255,0.65)' : G[400],
                                    textAlign: 'right',
                                  }}
                                >
                                  {format(parseISO(msg.createdAt), 'hh:mm a')}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </Box>

                    {/* Input Bar */}
                    <Box
                      sx={{
                        px: 2.5, py: 2,
                        borderTop: `1px solid ${G[100]}`,
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 1.5,
                      }}
                    >
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
                            fontSize: '0.88rem',
                            '& fieldset': { borderColor: G[200] },
                            '&:hover fieldset': { borderColor: G[400] },
                            '&.Mui-focused fieldset': { borderColor: G[500] },
                          },
                        }}
                      />
                      <IconButton
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                        sx={{
                          width: 42, height: 42,
                          background: newMessage.trim() && !sending
                            ? `linear-gradient(135deg, ${G[600]}, ${G[500]})`
                            : G[100],
                          color: newMessage.trim() && !sending ? '#fff' : G[300],
                          borderRadius: 2.5,
                          flexShrink: 0,
                          transition: 'all 0.2s',
                          '&:hover': {
                            background: newMessage.trim() && !sending
                              ? `linear-gradient(135deg, ${G[700]}, ${G[600]})`
                              : G[100],
                            transform: newMessage.trim() && !sending ? 'scale(1.05)' : 'none',
                          },
                          '&.Mui-disabled': { background: G[100], color: G[300] },
                        }}
                      >
                        {sending
                          ? <CircularProgress size={18} sx={{ color: G[400] }} />
                          : <SendIcon sx={{ fontSize: 18 }} />
                        }
                      </IconButton>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: G[100] }}>
                      <ChatIcon sx={{ fontSize: 34, color: G[400] }} />
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: G[800] }}>
                      Select a Warden
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Choose a warden from the list to start chatting
                    </Typography>
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