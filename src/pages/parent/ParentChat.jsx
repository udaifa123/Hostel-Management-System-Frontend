import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Alert,
  Popover,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  Circle as CircleIcon,
  WifiOff as WifiOffIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
  Phone as PhoneIcon,
  Videocam as VideocamIcon,
  CallEnd as CallEndIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  EmojiEmotions as EmojiIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import parentService from '../../services/parentService';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ─── Color Tokens ───────────────────────────────────────────────────────────────
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

// Reaction options
const REACTIONS = [
  { emoji: '👍', label: 'Like' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '😂', label: 'Haha' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '🙏', label: 'Pray' },
];

const ParentChat = () => {
  const navigate = useNavigate();
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
  
  // Call states
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef(null);
  
  // Reaction states
  const [reactionAnchorEl, setReactionAnchorEl] = useState(null);
  const [selectedMessageForReaction, setSelectedMessageForReaction] = useState(null);
  const [messageMenuAnchorEl, setMessageMenuAnchorEl] = useState(null);
  const [selectedMessageForMenu, setSelectedMessageForMenu] = useState(null);
  const [removeReactionAnchorEl, setRemoveReactionAnchorEl] = useState(null);
  const [selectedMessageForRemoveReaction, setSelectedMessageForRemoveReaction] = useState(null);

  // ── Socket Setup ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;

    const socket = io(API_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
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
        setMessages((prev) => [...prev, message]);
      }
    });
    
    socket.on('message_reaction', (data) => {
      console.log('📩 Message reaction received:', data);
      setMessages(prev => prev.map(msg => 
        msg._id === data.messageId 
          ? { ...msg, reaction: data.reaction }
          : msg
      ));
    });
    
    socket.on('reaction_removed', (data) => {
      console.log('📩 Reaction removed:', data);
      setMessages(prev => prev.map(msg => 
        msg._id === data.messageId 
          ? { ...msg, reaction: null }
          : msg
      ));
    });
    
    // Call events
    socket.on('incoming_call', (data) => {
      console.log('📞 Incoming call:', data);
      toast.success(`${data.from} is calling you...`);
      handleAcceptCall();
    });
    
    socket.on('call_accepted', () => {
      console.log('📞 Call accepted');
      setIsCallActive(true);
      startCallTimer();
    });
    
    socket.on('call_rejected', () => {
      console.log('📞 Call rejected');
      toast.error('Call rejected');
      endCall();
    });
    
    socket.on('call_ended', () => {
      console.log('📞 Call ended');
      endCall();
    });

    socketRef.current = socket;
    return () => { socket.disconnect(); };
  }, [token]);

  useEffect(() => { fetchWardens(); }, []);

  useEffect(() => {
    if (selectedWarden) fetchChatHistory();
  }, [selectedWarden]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, []);

  // ── Data Fetching ───────────────────────────────────────────────────────────
  const fetchWardens = async () => {
    try {
      setLoading(true);
      const response = await parentService.getWardens();
      console.log('Wardens response:', response);
      if (response.success && response.data && response.data.length > 0) {
        setWardens(response.data);
        if (response.data[0]) {
          setSelectedWarden(response.data[0]);
        }
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
      if (response.success) setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  // ── Send Message ────────────────────────────────────────────────────────────
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedWarden || sending) return;
    setSending(true);
    try {
      const response = await parentService.sendMessage(selectedWarden._id, newMessage);
      console.log('Send message response:', response);
      if (response.success) {
        setMessages((prev) => [...prev, response.data]);
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

  // ── Reaction Functions ──────────────────────────────────────────────────────
  const handleReactionClick = (event, message) => {
    setSelectedMessageForReaction(message);
    setReactionAnchorEl(event.currentTarget);
  };

  const handleReactionClose = () => {
    setReactionAnchorEl(null);
    setSelectedMessageForReaction(null);
  };

  const handleAddReaction = async (reaction) => {
    if (!selectedMessageForReaction) return;
    
    try {
      if (parentService.addMessageReaction) {
        const response = await parentService.addMessageReaction(
          selectedMessageForReaction._id, 
          reaction.emoji
        );
        
        if (response.success) {
          setMessages(prev => prev.map(msg =>
            msg._id === selectedMessageForReaction._id
              ? { ...msg, reaction: reaction.emoji }
              : msg
          ));
          
          if (socketRef.current) {
            socketRef.current.emit('message_reaction', {
              messageId: selectedMessageForReaction._id,
              reaction: reaction.emoji,
              to: selectedWarden?._id
            });
          }
          
          toast.success(`Added ${reaction.label} reaction`);
        }
      } else {
        setMessages(prev => prev.map(msg =>
          msg._id === selectedMessageForReaction._id
            ? { ...msg, reaction: reaction.emoji }
            : msg
        ));
        toast.success(`Added ${reaction.label} reaction (local only)`);
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    }
    
    handleReactionClose();
  };

  // ── Remove Reaction Functions ────────────────────────────────────────────────
  const handleRemoveReactionClick = (event, message) => {
    setSelectedMessageForRemoveReaction(message);
    setRemoveReactionAnchorEl(event.currentTarget);
  };

  const handleRemoveReactionClose = () => {
    setRemoveReactionAnchorEl(null);
    setSelectedMessageForRemoveReaction(null);
  };

  const handleRemoveReaction = async () => {
    if (!selectedMessageForRemoveReaction) return;
    
    try {
      if (parentService.removeMessageReaction) {
        const response = await parentService.removeMessageReaction(
          selectedMessageForRemoveReaction._id
        );
        
        if (response.success) {
          setMessages(prev => prev.map(msg =>
            msg._id === selectedMessageForRemoveReaction._id
              ? { ...msg, reaction: null }
              : msg
          ));
          
          if (socketRef.current) {
            socketRef.current.emit('reaction_removed', {
              messageId: selectedMessageForRemoveReaction._id,
              to: selectedWarden?._id
            });
          }
          
          toast.success('Reaction removed');
        }
      } else {
        setMessages(prev => prev.map(msg =>
          msg._id === selectedMessageForRemoveReaction._id
            ? { ...msg, reaction: null }
            : msg
        ));
        toast.success('Reaction removed (local only)');
      }
    } catch (error) {
      console.error('Error removing reaction:', error);
      toast.error('Failed to remove reaction');
    }
    
    handleRemoveReactionClose();
  };

  // ── Message Menu Functions ──────────────────────────────────────────────────
  const handleMessageMenuOpen = (event, message) => {
    event.preventDefault();
    setSelectedMessageForMenu(message);
    setMessageMenuAnchorEl(event.currentTarget);
  };

  const handleMessageMenuClose = () => {
    setMessageMenuAnchorEl(null);
    setSelectedMessageForMenu(null);
  };

  const handleCopyMessage = () => {
    if (selectedMessageForMenu) {
      navigator.clipboard.writeText(selectedMessageForMenu.content);
      toast.success('Message copied to clipboard');
    }
    handleMessageMenuClose();
  };

  // ── Call Functions ──────────────────────────────────────────────────────────
  const handleStartCall = (type) => {
    setCallType(type);
    setCallDialogOpen(true);
  };

  const handleInitiateCall = () => {
    setCallDialogOpen(false);
    setIsCallActive(true);
    setCallDuration(0);
    startCallTimer();
    toast.success(`Calling ${selectedWarden?.name}...`);
    
    if (socketRef.current) {
      socketRef.current.emit('start_call', {
        to: selectedWarden?._id,
        from: user?.name,
        type: callType
      });
    }
  };

  const handleAcceptCall = () => {
    setIsCallActive(true);
    setCallDuration(0);
    startCallTimer();
    toast.success('Call connected');
    
    if (socketRef.current) {
      socketRef.current.emit('accept_call', { to: selectedWarden?._id });
    }
  };

  const handleEndCall = () => {
    endCall();
    if (socketRef.current) {
      socketRef.current.emit('end_call', { to: selectedWarden?._id });
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallType(null);
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    toast.success('Call ended');
  };

  const startCallTimer = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleSpeaker = () => setIsSpeakerOff(!isSpeakerOff);

  // ── Loading State ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f0fdf4' }}>
        <CircularProgress sx={{ color: G[600] }} thickness={5} />
      </Box>
    );
  }

  // ── Render ── Full Width Layout ────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0fdf4' }}>

      {/* ── Header ── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
          color: 'white',
          py: 2,
          px: 3,
          boxShadow: '0 4px 20px rgba(6,95,70,0.2)',
          width: '100%'
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
              Chat with Warden
            </Typography>
          </Box>

          <Chip
            icon={isConnected ? <CircleIcon sx={{ fontSize: 10, color: '#4ade80' }} /> : <WifiOffIcon sx={{ fontSize: 14, color: '#fca5a5' }} />}
            label={isConnected ? 'Connected' : 'Connecting...'}
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }}
          />
        </Box>
      </Paper>

      {/* ── Main Content - Full Width ── */}
      <Box sx={{ p: 3, width: '100%' }}>

        {/* Welcome Card */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: '16px',
            border: '1.5px solid #d1fae5',
            bgcolor: '#fff',
            boxShadow: '0 4px 16px rgba(6,95,70,0.07)',
            width: '100%'
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
              <ChatIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" sx={{ color: G[600], letterSpacing: '0.12em', fontSize: '0.7rem', fontWeight: 600 }}>
                Communication
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: G[800], lineHeight: 1.2, mb: 0.5 }}>
                Chat with Warden
              </Typography>
              <Typography sx={{ color: G[500], fontSize: '0.85rem', mt: 0.3 }}>
                Real-time messaging, reactions, and calling with hostel wardens
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* ── Chat Grid - Full Width ── */}
        <Grid container spacing={3} sx={{ width: '100%', margin: 0 }}>
          
          {/* Wardens Sidebar */}
          <Grid item xs={12} md={3.5}>
            <Paper
              elevation={0}
              sx={{
                height: { xs: 'auto', md: 620 },
                borderRadius: '16px',
                border: '1.5px solid #d1fae5',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#fff',
                boxShadow: '0 4px 16px rgba(6,95,70,0.07)'
              }}
            >
              <Box sx={{ px: 2.5, py: 2, bgcolor: G[50], borderBottom: '1.5px solid #d1fae5' }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: G[600], letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Wardens
                </Typography>
              </Box>

              {wardens.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No wardens available</Typography>
                </Box>
              ) : (
                <List disablePadding sx={{ flex: 1, overflowY: 'auto' }}>
                  {wardens.map((warden) => {
                    const isActive = selectedWarden?._id === warden._id;
                    return (
                      <ListItem
                        key={warden._id}
                        onClick={() => setSelectedWarden(warden)}
                        sx={{
                          px: 2.5, py: 1.5,
                          cursor: 'pointer',
                          borderLeft: isActive ? `4px solid ${G[600]}` : '4px solid transparent',
                          bgcolor: isActive ? G[50] : 'transparent',
                          transition: 'all 0.2s',
                          '&:hover': { bgcolor: G[50] },
                        }}
                      >
                        <ListItemAvatar sx={{ minWidth: 56 }}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: G[500], border: '2px solid #fff' }} />
                            }
                          >
                            <Avatar sx={{ width: 40, height: 40, bgcolor: isActive ? G[600] : G[100], color: isActive ? '#fff' : G[700] }}>
                              {warden.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography sx={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 500, color: G[800] }}>{warden.name}</Typography>}
                          secondary={<Typography sx={{ fontSize: '0.75rem', color: G[500] }}>{warden.unreadCount > 0 ? `${warden.unreadCount} unread` : 'Warden'}</Typography>}
                        />
                        {warden.unreadCount > 0 && (
                          <Chip label={warden.unreadCount} size="small" sx={{ bgcolor: G[600], color: '#fff', height: 20, fontSize: '0.7rem' }} />
                        )}
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Chat Area - Full Width */}
          <Grid item xs={12} md={8.5}>
            <Paper
              elevation={0}
              sx={{
                height: { xs: 500, md: 620 },
                borderRadius: '16px',
                border: '1.5px solid #d1fae5',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                bgcolor: '#fff',
                boxShadow: '0 4px 16px rgba(6,95,70,0.07)'
              }}
            >
              {selectedWarden ? (
                <>
                  {/* Chat Top Bar */}
                  <Box sx={{ px: 3, py: 2, borderBottom: '1.5px solid #d1fae5', bgcolor: G[50], display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 42, height: 42, bgcolor: G[600] }}>
                      {selectedWarden.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 700, color: G[800] }}>{selectedWarden.name}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: G[500] }}>Hostel Warden · Online</Typography>
                    </Box>
                    
                    <Tooltip title="Audio Call">
                      <IconButton onClick={() => handleStartCall('audio')} sx={{ color: G[600], bgcolor: '#fff', border: `1px solid ${G[200]}`, borderRadius: '10px' }}>
                        <PhoneIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Video Call">
                      <IconButton onClick={() => handleStartCall('video')} sx={{ color: G[600], bgcolor: '#fff', border: `1px solid ${G[200]}`, borderRadius: '10px' }}>
                        <VideocamIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    
                    <IconButton onClick={fetchChatHistory} sx={{ color: G[500], border: `1px solid ${G[200]}`, borderRadius: '10px' }}>
                      <RefreshIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>

                  {/* Active Call Banner */}
                  {isCallActive && (
                    <Box sx={{ px: 3, py: 1.5, bgcolor: G[600], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16 }} />
                        <Typography>Call in progress with {selectedWarden.name} • {formatCallDuration(callDuration)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={toggleMute} sx={{ color: '#fff' }}>
                          {isMuted ? <MicOffIcon /> : <MicIcon />}
                        </IconButton>
                        <IconButton size="small" onClick={toggleSpeaker} sx={{ color: '#fff' }}>
                          {isSpeakerOff ? <VolumeOffIcon /> : <VolumeUpIcon />}
                        </IconButton>
                        <IconButton size="small" onClick={handleEndCall} sx={{ color: '#ef4444' }}>
                          <CallEndIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  )}

                  {/* Messages List */}
                  <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 1.5, bgcolor: '#fafffe' }}>
                    {messages.length === 0 ? (
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: G[50] }}><ChatIcon sx={{ fontSize: 28, color: G[400] }} /></Avatar>
                        <Typography variant="body2" sx={{ color: G[500] }}>No messages yet. Start a conversation!</Typography>
                      </Box>
                    ) : (
                      messages.map((msg, idx) => {
                        const isMyMessage = msg.sender?._id === user?.id || msg.sender === user?.id;
                        return (
                          <Box
                            key={idx}
                            sx={{ display: 'flex', justifyContent: isMyMessage ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 1 }}
                            onContextMenu={(e) => handleMessageMenuOpen(e, msg)}
                          >
                            {!isMyMessage && (
                              <Avatar sx={{ width: 28, height: 28, bgcolor: G[100], color: G[700] }}>
                                {selectedWarden.name?.charAt(0)?.toUpperCase()}
                              </Avatar>
                            )}
                            <Box sx={{ maxWidth: '70%' }}>
                              <Paper
                                elevation={0}
                                sx={{
                                  px: 2, py: 1,
                                  borderRadius: isMyMessage ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                  bgcolor: isMyMessage ? G[600] : '#fff',
                                  color: isMyMessage ? '#fff' : '#2d3748',
                                  border: isMyMessage ? 'none' : `1px solid ${G[200]}`,
                                  position: 'relative'
                                }}
                              >
                                <Typography sx={{ fontSize: '0.85rem', lineHeight: 1.55, wordBreak: 'break-word', pr: msg.reaction ? 4 : 0 }}>
                                  {msg.content}
                                </Typography>
                                
                                {/* Reaction Button */}
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleReactionClick(e, msg)}
                                  sx={{
                                    position: 'absolute',
                                    bottom: -8,
                                    right: -8,
                                    bgcolor: '#fff',
                                    border: `1px solid ${G[200]}`,
                                    width: 24,
                                    height: 24,
                                    '&:hover': { bgcolor: G[50] }
                                  }}
                                >
                                  <EmojiIcon sx={{ fontSize: 14, color: G[500] }} />
                                </IconButton>
                                
                                {/* Reaction Display with Remove Option */}
                                {msg.reaction && (
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      bottom: -12,
                                      left: isMyMessage ? 'auto' : 8,
                                      right: isMyMessage ? 8 : 'auto',
                                      bgcolor: '#fff',
                                      borderRadius: '20px',
                                      border: `1px solid ${G[200]}`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.3,
                                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                      cursor: 'pointer',
                                      '&:hover': { bgcolor: G[50] }
                                    }}
                                    onClick={(e) => handleRemoveReactionClick(e, msg)}
                                  >
                                    <Typography sx={{ fontSize: '0.75rem', px: 0.8, py: 0.3 }}>
                                      {msg.reaction}
                                    </Typography>
                                    <DeleteIcon sx={{ fontSize: 12, color: G[500], mr: 0.5 }} />
                                  </Box>
                                )}
                                
                                <Typography sx={{ display: 'block', mt: 0.5, textAlign: 'right', fontSize: '0.65rem', color: isMyMessage ? 'rgba(255,255,255,0.7)' : G[400] }}>
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

                  {/* Input Bar */}
                  <Box sx={{ px: 3, py: 2, borderTop: '1.5px solid #d1fae5', bgcolor: '#fff', display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
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
                          borderRadius: '12px',
                          '& fieldset': { borderColor: G[200] },
                          '&:hover fieldset': { borderColor: G[400] },
                          '&.Mui-focused fieldset': { borderColor: G[600] },
                        },
                      }}
                    />
                    <IconButton
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      sx={{
                        width: 42, height: 42,
                        borderRadius: '12px',
                        bgcolor: newMessage.trim() && !sending ? G[600] : G[100],
                        color: newMessage.trim() && !sending ? '#fff' : G[300],
                      }}
                    >
                      {sending ? <CircularProgress size={20} /> : <SendIcon />}
                    </IconButton>
                  </Box>
                </>
              ) : (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: G[50] }}><ChatIcon sx={{ fontSize: 32, color: G[400] }} /></Avatar>
                  <Typography variant="h6" sx={{ color: G[600] }}>Select a Warden</Typography>
                  <Typography variant="body2" sx={{ color: G[500] }}>Choose a warden from the list to start chatting</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Reaction Popover - Add Reaction */}
      <Popover
        open={Boolean(reactionAnchorEl)}
        anchorEl={reactionAnchorEl}
        onClose={handleReactionClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        PaperProps={{
          sx: {
            borderRadius: '30px',
            bgcolor: '#fff',
            border: `1px solid ${G[200]}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            px: 1,
            py: 0.5
          }
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          {REACTIONS.map((reaction) => (
            <Tooltip key={reaction.label} title={reaction.label}>
              <IconButton
                onClick={() => handleAddReaction(reaction)}
                sx={{
                  width: 36,
                  height: 36,
                  '&:hover': { bgcolor: G[50], transform: 'scale(1.1)' },
                  transition: 'transform 0.2s'
                }}
              >
                <Typography sx={{ fontSize: '1.3rem' }}>{reaction.emoji}</Typography>
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Popover>

      {/* Remove Reaction Confirmation Popover */}
      <Popover
        open={Boolean(removeReactionAnchorEl)}
        anchorEl={removeReactionAnchorEl}
        onClose={handleRemoveReactionClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            bgcolor: '#fff',
            border: `1px solid ${G[200]}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            minWidth: 180
          }
        }}
      >
        <Box sx={{ p: 1.5 }}>
          <Typography sx={{ fontSize: '0.85rem', color: G[800], mb: 1, textAlign: 'center' }}>
            Remove this reaction?
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button 
              size="small" 
              onClick={handleRemoveReactionClose}
              sx={{ color: G[600], textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button 
              size="small" 
              variant="contained" 
              onClick={handleRemoveReaction}
              sx={{ bgcolor: G[600], textTransform: 'none', '&:hover': { bgcolor: G[700] } }}
            >
              Remove
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Message Context Menu */}
      <Menu
        anchorEl={messageMenuAnchorEl}
        open={Boolean(messageMenuAnchorEl)}
        onClose={handleMessageMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            border: `1px solid ${G[200]}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            minWidth: 150
          }
        }}
      >
        <MenuItem onClick={handleCopyMessage} sx={{ gap: 1 }}>
          📋 Copy Message
        </MenuItem>
        {selectedMessageForMenu && (
          <MenuItem onClick={() => {
            handleReactionClick({ currentTarget: messageMenuAnchorEl }, selectedMessageForMenu);
            handleMessageMenuClose();
          }} sx={{ gap: 1 }}>
            😊 Add Reaction
          </MenuItem>
        )}
      </Menu>

      {/* Call Confirmation Dialog */}
      <Dialog open={callDialogOpen} onClose={() => setCallDialogOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: '16px', bgcolor: '#fff', border: `1px solid ${G[200]}` } }}>
        <Box sx={{ height: 4, bgcolor: G[600] }} />
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar sx={{ bgcolor: G[600] }}>{callType === 'audio' ? <PhoneIcon /> : <VideocamIcon />}</Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
              {callType === 'audio' ? 'Audio Call' : 'Video Call'}
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography sx={{ color: G[700], textAlign: 'center', py: 2 }}>
            Start {callType === 'audio' ? 'audio' : 'video'} call with <strong>{selectedWarden?.name}</strong>?
          </Typography>
          <Alert severity="info" sx={{ borderRadius: '12px', bgcolor: G[50] }}>
            Ensure you have a stable internet connection for better call quality.
          </Alert>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
          <Button onClick={() => setCallDialogOpen(false)} sx={{ borderColor: G[300], color: G[700], borderRadius: '10px' }}>Cancel</Button>
          <Button variant="contained" onClick={handleInitiateCall} sx={{ bgcolor: G[600], borderRadius: '10px', '&:hover': { bgcolor: G[700] } }}>Start Call</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParentChat;