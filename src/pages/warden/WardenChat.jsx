import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  AppBar,
  Toolbar,
  InputAdornment,
  Chip,
  alpha,
  Button,
  Tooltip,
  Alert,
  Tab,
  Tabs,
  Popover,
  Menu,
  MenuItem,
  Snackbar
} from '@mui/material';
import {
  Send as SendIcon,
  Check as CheckIcon,
  DoneAll as DoneAllIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
  WifiOff as WifiOffIcon,
  Chat as ChatIcon,
  EmojiEmotions as EmojiIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useCall } from '../../context/CallContext';
import { format, isToday, isYesterday } from 'date-fns';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const REACTIONS = [
  { emoji: '👍', label: 'Like' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '😂', label: 'Haha' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '🙏', label: 'Pray' },
];

const WardenChat = () => {
  const { token, user } = useAuth();
  const { socket, isOnline, isConnected, sendTyping } = useSocket();
  const { startCall } = useCall();
  
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  
 
  const [reactionAnchorEl, setReactionAnchorEl] = useState(null);
  const [selectedMessageForReaction, setSelectedMessageForReaction] = useState(null);
  const [messageMenuAnchorEl, setMessageMenuAnchorEl] = useState(null);
  const [selectedMessageForMenu, setSelectedMessageForMenu] = useState(null);
  const [removeReactionAnchorEl, setRemoveReactionAnchorEl] = useState(null);
  const [selectedMessageForRemoveReaction, setSelectedMessageForRemoveReaction] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

 
  const loadMockData = () => {
    const mockStudents = [
      {
        _id: '1',
        participant: {
          _id: 'student1',
          name: 'John Doe',
          role: 'student',
          room: 'A-101'
        },
        lastMessage: {
          content: 'Hello Warden!',
          createdAt: new Date()
        },
        unreadCount: 2
      },
      {
        _id: '2',
        participant: {
          _id: 'student2',
          name: 'Jane Smith',
          role: 'student',
          room: 'B-202'
        },
        lastMessage: {
          content: 'Need help with room issue',
          createdAt: new Date()
        },
        unreadCount: 0
      },
      {
        _id: '3',
        participant: {
          _id: 'student3',
          name: 'Mike Johnson',
          role: 'student',
          room: 'C-303'
        },
        lastMessage: {
          content: 'When is the curfew?',
          createdAt: new Date()
        },
        unreadCount: 1
      }
    ];
    
    const mockParents = [
      {
        _id: '4',
        participant: {
          _id: 'parent1',
          name: 'Robert Johnson',
          role: 'parent'
        },
        lastMessage: {
          content: 'How is my son doing?',
          createdAt: new Date()
        },
        unreadCount: 1
      },
      {
        _id: '5',
        participant: {
          _id: 'parent2',
          name: 'Mary Smith',
          role: 'parent'
        },
        lastMessage: {
          content: 'Thank you for your help',
          createdAt: new Date()
        },
        unreadCount: 0
      }
    ];
    
    setStudents(mockStudents);
    setParents(mockParents);
    setFilteredStudents(mockStudents);
    setFilteredParents(mockParents);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.participant._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setFilteredStudents(students.filter(s => s.participant.name?.toLowerCase().includes(term)));
      setFilteredParents(parents.filter(p => p.participant.name?.toLowerCase().includes(term)));
    } else {
      setFilteredStudents(students);
      setFilteredParents(parents);
    }
  }, [searchTerm, students, parents]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (selectedChat && (message.sender._id === selectedChat.participant._id || message.receiver._id === selectedChat.participant._id)) {
        setMessages(prev => [...prev, message]);
      }
      fetchConversations();
    };

    const handleMessagesRead = (data) => {
      if (data.reader === selectedChat?.participant._id) {
        setMessages(prev => prev.map(msg => 
          msg.sender._id === selectedChat.participant._id ? { ...msg, isRead: true } : msg
        ));
      }
    };

    const handleTyping = ({ userId, isTyping: typing }) => {
      if (userId === selectedChat?.participant._id) {
        setIsTyping(typing);
      }
    };
    
    const handleMessageReaction = (data) => {
      console.log('📩 Message reaction received:', data);
      setMessages(prev => prev.map(msg => 
        msg._id === data.messageId 
          ? { ...msg, reaction: data.reaction }
          : msg
      ));
    };
    
    const handleReactionRemoved = (data) => {
      console.log('📩 Reaction removed:', data);
      setMessages(prev => prev.map(msg => 
        msg._id === data.messageId 
          ? { ...msg, reaction: null }
          : msg
      ));
    };

    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);
    socket.on('user_typing', handleTyping);
    socket.on('message_reaction', handleMessageReaction);
    socket.on('reaction_removed', handleReactionRemoved);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
      socket.off('user_typing', handleTyping);
      socket.off('message_reaction', handleMessageReaction);
      socket.off('reaction_removed', handleReactionRemoved);
    };
  }, [socket, selectedChat]);


  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      try {
       
        const studentsResponse = await axios.get(`${API_URL}/chat/conversations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let parentsResponse = { data: { data: [] } };
        try {
          parentsResponse = await axios.get(`${API_URL}/chat/warden/conversations`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          console.log('Parents endpoint not available yet');
        } 
        
        const studentsData = studentsResponse.data.data || [];
        const parentsData = parentsResponse.data.data || [];
        
        if (studentsData.length > 0 || parentsData.length > 0) {
          setStudents(studentsData);
          setParents(parentsData);
          setFilteredStudents(studentsData);
          setFilteredParents(parentsData);
          setOfflineMode(false);
        } else {
         
          loadMockData();
          setOfflineMode(true);
          setSnackbar({
            open: true,
            message: 'Using demo mode - Backend API not available',
            severity: 'info'
          });
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        
        loadMockData();
        setOfflineMode(true);
        setSnackbar({
          open: true,
          message: 'Using demo mode - Backend API not available',
          severity: 'info'
        });
      }
    } catch (error) {
      console.error('Unexpected error in fetchConversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    if (!userId) return;

    try {
      if (offlineMode) {
       
        const mockMessages = getMockMessages(userId);
        setMessages(mockMessages);
        return;
      }

      let response;
      
      if (selectedChat?.participant?.role === 'parent') {
        response = await axios.get(`${API_URL}/chat/warden/chat/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.get(`${API_URL}/chat/messages/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setMessages(response.data.data || []);
      
      try {
        await axios.put(`${API_URL}/chat/read/${userId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.log('Failed to mark messages as read');
      }

    } catch (error) {
      console.error('Error fetching messages:', error);
      
      const mockMessages = getMockMessages(userId);
      setMessages(mockMessages);
    }
  };

  const getMockMessages = (userId) => {
    const isParent = selectedChat?.participant?.role === 'parent';
    const participantName = selectedChat?.participant?.name || 'User';
    
    return [
      {
        _id: 'msg1',
        content: `Hello! This is a demo message from ${participantName}.`,
        sender: { _id: userId },
        receiver: { _id: user?._id || 'warden1' },
        createdAt: new Date(Date.now() - 86400000),
        isRead: true,
        isDelivered: true
      },
      {
        _id: 'msg2',
        content: isParent ? 'How is my child doing?' : 'I have a question about the hostel rules.',
        sender: { _id: userId },
        receiver: { _id: user?._id || 'warden1' },
        createdAt: new Date(Date.now() - 3600000),
        isRead: true,
        isDelivered: true
      },
      {
        _id: 'msg3',
        content: 'Sure, I can help you with that. What specific information do you need?',
        sender: { _id: user?._id || 'warden1' },
        receiver: { _id: userId },
        createdAt: new Date(Date.now() - 1800000),
        isRead: false,
        isDelivered: true
      }
    ];
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const messageContent = newMessage;
    setNewMessage('');

    try {
      if (offlineMode) {
        
        const newMsg = {
          _id: Date.now().toString(),
          content: messageContent,
          sender: { _id: user?._id || 'warden1' },
          receiver: { _id: selectedChat.participant._id },
          createdAt: new Date(),
          isRead: false,
          isDelivered: true
        };
        setMessages(prev => [...prev, newMsg]);
        toast.success('Message sent (Demo mode)');
        return;
      }

      let response;
      
      if (selectedChat.participant.role === 'parent') {
        response = await axios.post(`${API_URL}/chat/warden/send`, {
          receiverId: selectedChat.participant._id,
          content: messageContent
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.post(`${API_URL}/chat/send`, {
          receiverId: selectedChat.participant._id,
          content: messageContent
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (response.data.success) {
        setMessages(prev => [...prev, response.data.data]);
        
        if (sendTyping) {
          sendTyping(selectedChat.participant._id, false);
        }
        
        fetchConversations();
        toast.success('Message sent');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const newMsg = {
        _id: Date.now().toString(),
        content: messageContent,
        sender: { _id: user?._id || 'warden1' },
        receiver: { _id: selectedChat.participant._id },
        createdAt: new Date(),
        isRead: false,
        isDelivered: true
      };
      setMessages(prev => [...prev, newMsg]);
      toast.success('Message sent (Demo mode)');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (!selectedChat || !sendTyping || offlineMode) return;

    if (value.length > 0) {
      sendTyping(selectedChat.participant._id, true);
      
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(selectedChat.participant._id, false);
      }, 1000);
    } else {
      sendTyping(selectedChat.participant._id, false);
    }
  };

 
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
      if (!offlineMode) {
        try {
          const response = await axios.post(`${API_URL}/chat/message/reaction`, {
            messageId: selectedMessageForReaction._id,
            reaction: reaction.emoji
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.success) {
            setMessages(prev => prev.map(msg =>
              msg._id === selectedMessageForReaction._id
                ? { ...msg, reaction: reaction.emoji }
                : msg
            ));
            
            if (socket) {
              socket.emit('message_reaction', {
                messageId: selectedMessageForReaction._id,
                reaction: reaction.emoji,
                to: selectedChat?.participant._id
              });
            }
            
            toast.success(`Added ${reaction.label} reaction`);
          }
        } catch (error) {
          console.error('API error, using local reaction:', error);
         
          setMessages(prev => prev.map(msg =>
            msg._id === selectedMessageForReaction._id
              ? { ...msg, reaction: reaction.emoji }
              : msg
          ));
          toast.success(`Added ${reaction.label} reaction (Demo mode)`);
        }
      } else {
        
        setMessages(prev => prev.map(msg =>
          msg._id === selectedMessageForReaction._id
            ? { ...msg, reaction: reaction.emoji }
            : msg
        ));
        toast.success(`Added ${reaction.label} reaction (Demo mode)`);
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    }
    
    handleReactionClose();
  };

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
      if (!offlineMode) {
        try {
          const response = await axios.delete(`${API_URL}/chat/message/reaction/${selectedMessageForRemoveReaction._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.success) {
            setMessages(prev => prev.map(msg =>
              msg._id === selectedMessageForRemoveReaction._id
                ? { ...msg, reaction: null }
                : msg
            ));
            
            if (socket) {
              socket.emit('reaction_removed', {
                messageId: selectedMessageForRemoveReaction._id,
                to: selectedChat?.participant._id
              });
            }
            
            toast.success('Reaction removed');
          }
        } catch (error) {
       
          setMessages(prev => prev.map(msg =>
            msg._id === selectedMessageForRemoveReaction._id
              ? { ...msg, reaction: null }
              : msg
          ));
          toast.success('Reaction removed (Demo mode)');
        }
      } else {
        
        setMessages(prev => prev.map(msg =>
          msg._id === selectedMessageForRemoveReaction._id
            ? { ...msg, reaction: null }
            : msg
        ));
        toast.success('Reaction removed (Demo mode)');
      }
    } catch (error) {
      console.error('Error removing reaction:', error);
      toast.error('Failed to remove reaction');
    }
    
    handleRemoveReactionClose();
  };

  
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

  const getMessageStatusIcon = (message) => {
    if (message.isRead) {
      return <DoneAllIcon fontSize="small" sx={{ color: '#10b981' }} />;
    } else if (message.isDelivered) {
      return <DoneAllIcon fontSize="small" sx={{ color: '#94a3b8' }} />;
    } else {
      return <CheckIcon fontSize="small" sx={{ color: '#94a3b8' }} />;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    const isDisabled = !selectedChat?.participant?._id || offlineMode;
    
    return (
      <Tooltip title={offlineMode ? `${label} (Unavailable in demo mode)` : label}>
        <IconButton
          onClick={() => {
            if (!offlineMode) {
              startCall(selectedChat.participant._id, type);
            } else {
              toast.info(`${label} is not available in demo mode`);
            }
          }}
          disabled={isDisabled}
          sx={{ color: !isDisabled ? '#10b981' : '#94a3b8' }}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const currentList = tabValue === 0 ? filteredStudents : filteredParents;
  const currentTitle = tabValue === 0 ? 'Students' : 'Parents';

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#10b981' }} />
      </Box>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)', width: '100%', bgcolor: '#f0fdf4', p: 3 }}>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          iconMapping={{
            info: <WifiOffIcon />
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

     
      {!isConnected && !offlineMode && (
        <Alert 
          severity="warning" 
          icon={<WifiOffIcon />}
          sx={{ position: 'absolute', top: 70, right: 20, zIndex: 1000 }}
        >
          Connecting to chat server...
        </Alert>
      )}

      {offlineMode && (
        <Alert 
          severity="info" 
          icon={<WifiOffIcon />}
          sx={{ position: 'absolute', top: 70, right: 20, zIndex: 1000 }}
        >
          Demo Mode - Using local mock data
        </Alert>
      )}

    
      <Paper sx={{ width: 350, mr: 3, display: 'flex', flexDirection: 'column', borderRadius: '16px', border: '1.5px solid #d1fae5', boxShadow: '0 4px 16px rgba(6,95,70,0.07)' }}>
        <Box p={2}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#166534' }}>
            Messages
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder={`Search ${currentTitle}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mt: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>
        
      
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ px: 2 }}>
          <Tab label={`Students (${students.length})`} />
          <Tab label={`Parents (${parents.length})`} />
        </Tabs>
        
        <Divider />
        
        <Box sx={{ overflow: 'auto', flex: 1 }}>
          <List>
            {currentList.length === 0 ? (
              <ListItem>
                <ListItemText 
                  primary={`No ${currentTitle.toLowerCase()} found`}
                  secondary={`${currentTitle} will appear here when they message you`}
                />
              </ListItem>
            ) : (
              currentList.map((conv) => (
                <ListItem
                  key={conv._id}
                  button
                  selected={selectedChat?._id === conv._id}
                  onClick={() => setSelectedChat(conv)}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: alpha('#10b981', 0.1),
                      borderLeft: '4px solid #10b981'
                    },
                    borderLeft: '4px solid transparent'
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      color="success"
                      variant="dot"
                      invisible={!isOnline(conv.participant._id) || offlineMode}
                      overlap="circular"
                    >
                      <Avatar sx={{ bgcolor: '#10b981' }}>
                        {conv.participant.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" fontWeight="bold">
                          {conv.participant.name}
                        </Typography>
                        {conv.unreadCount > 0 && (
                          <Chip
                            label={conv.unreadCount}
                            size="small"
                            sx={{ bgcolor: '#ef4444', color: 'white', height: 20, fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="caption" color="textSecondary" noWrap>
                          {conv.lastMessage?.content || 'No messages yet'}
                        </Typography>
                        {conv.participant.role === 'student' && (
                          <Typography variant="caption" color="textSecondary" display="block">
                            Room: {conv.participant.room || 'N/A'}
                          </Typography>
                        )}
                        {conv.participant.role === 'parent' && (
                          <Typography variant="caption" color="textSecondary" display="block">
                            Parent
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Paper>

      
      {selectedChat ? (
        <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '16px', border: '1.5px solid #d1fae5', boxShadow: '0 4px 16px rgba(6,95,70,0.07)', overflow: 'hidden' }}>
         
          <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: '#f5f5f5', borderBottom: '1.5px solid #d1fae5' }}>
            <Toolbar>
              <Box display="flex" alignItems="center" gap={2} flex={1}>
                <Badge
                  color="success"
                  variant="dot"
                  invisible={!isOnline(selectedChat.participant._id) || offlineMode}
                  overlap="circular"
                >
                  <Avatar sx={{ bgcolor: '#10b981' }}>
                    {selectedChat.participant.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                </Badge>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedChat.participant.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {selectedChat.participant.role === 'student' ? `Room: ${selectedChat.participant.room || 'N/A'}` : 'Parent'} • 
                    {offlineMode ? ' Demo Mode' : (isOnline(selectedChat.participant._id) ? ' Online' : ' Offline')}
                  </Typography>
                </Box>
              </Box>
              
              
              <Box display="flex" gap={1}>
                {renderCallButton('audio', <PhoneIcon />, 'Audio Call')}
                {renderCallButton('video', <VideoCallIcon />, 'Video Call')}
              </Box>
            </Toolbar>
          </AppBar>

          
          <Box sx={{ flex: 1, overflow: 'auto', p: 3, bgcolor: '#f8fafc' }}>
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

                  {msgs.map((msg, idx) => {
                    const isMyMessage = msg.sender?._id === user?._id;
                    return (
                      <Box
                        key={msg._id || idx}
                        sx={{
                          display: 'flex',
                          justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                          mb: 2
                        }}
                        onContextMenu={(e) => handleMessageMenuOpen(e, msg)}
                      >
                        <Box sx={{ maxWidth: '70%', position: 'relative' }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: isMyMessage ? '#10b981' : 'white',
                              color: isMyMessage ? 'white' : '#333',
                              borderRadius: '18px',
                              borderTopRightRadius: isMyMessage ? 4 : 18,
                              borderTopLeftRadius: isMyMessage ? 18 : 4,
                              position: 'relative'
                            }}
                          >
                            <Typography variant="body2" sx={{ wordBreak: 'break-word', pr: msg.reaction ? 4 : 0 }}>
                              {msg.content}
                            </Typography>
                            
                            
                            <IconButton
                              size="small"
                              onClick={(e) => handleReactionClick(e, msg)}
                              sx={{
                                position: 'absolute',
                                bottom: -8,
                                right: -8,
                                bgcolor: '#fff',
                                border: '1px solid #d1fae5',
                                width: 24,
                                height: 24,
                                '&:hover': { bgcolor: '#ecfdf5' }
                              }}
                            >
                              <EmojiIcon sx={{ fontSize: 14, color: '#10b981' }} />
                            </IconButton>
                            
                           
                            {msg.reaction && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: -12,
                                  left: isMyMessage ? 'auto' : 8,
                                  right: isMyMessage ? 8 : 'auto',
                                  bgcolor: '#fff',
                                  borderRadius: '20px',
                                  border: '1px solid #d1fae5',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.3,
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                  cursor: 'pointer',
                                  '&:hover': { bgcolor: '#ecfdf5' }
                                }}
                                onClick={(e) => handleRemoveReactionClick(e, msg)}
                              >
                                <Typography sx={{ fontSize: '0.75rem', px: 0.8, py: 0.3 }}>
                                  {msg.reaction}
                                </Typography>
                                <DeleteIcon sx={{ fontSize: 12, color: '#10b981', mr: 0.5 }} />
                              </Box>
                            )}
                          </Paper>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                              gap: 0.5,
                              mt: 0.5,
                              ml: 1
                            }}
                          >
                            <Typography variant="caption" color="textSecondary">
                              {formatMessageTime(msg.createdAt)}
                            </Typography>
                            {isMyMessage && getMessageStatusIcon(msg)}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              ))
            )}
            
           
            {isTyping && !offlineMode && (
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: '#10b981' }}>
                  {selectedChat.participant.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Typography variant="caption" color="textSecondary">
                  typing...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

         
          <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1.5px solid #d1fae5' }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder={`Type a message to ${selectedChat.participant.name}...`}
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': { borderColor: '#d1fae5' },
                  '&:hover fieldset': { borderColor: '#10b981' },
                  '&.Mui-focused fieldset': { borderColor: '#10b981' }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      sx={{ bgcolor: '#10b981', color: 'white', '&:hover': { bgcolor: '#059669' } }}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Paper>
      ) : (
        <Paper sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '16px', border: '1.5px solid #d1fae5', boxShadow: '0 4px 16px rgba(6,95,70,0.07)' }}>
          <Box textAlign="center">
            <Avatar sx={{ width: 64, height: 64, bgcolor: alpha('#10b981', 0.1), mx: 'auto', mb: 2 }}>
              <ChatIcon sx={{ fontSize: 34, color: '#10b981' }} />
            </Avatar>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Select a conversation
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Choose a student or parent from the list to start messaging
            </Typography>
          </Box>
        </Paper>
      )}

     
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
            border: '1px solid #d1fae5',
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
                  '&:hover': { bgcolor: '#ecfdf5', transform: 'scale(1.1)' },
                  transition: 'transform 0.2s'
                }}
              >
                <Typography sx={{ fontSize: '1.3rem' }}>{reaction.emoji}</Typography>
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Popover>

     
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
            border: '1px solid #d1fae5',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            minWidth: 180
          }
        }}
      >
        <Box sx={{ p: 1.5 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#064e3b', mb: 1, textAlign: 'center' }}>
            Remove this reaction?
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button 
              size="small" 
              onClick={handleRemoveReactionClose}
              sx={{ color: '#10b981', textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button 
              size="small" 
              variant="contained" 
              onClick={handleRemoveReaction}
              sx={{ bgcolor: '#10b981', textTransform: 'none', '&:hover': { bgcolor: '#059669' } }}
            >
              Remove
            </Button>
          </Box>
        </Box>
      </Popover>

 
      <Menu
        anchorEl={messageMenuAnchorEl}
        open={Boolean(messageMenuAnchorEl)}
        onClose={handleMessageMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            border: '1px solid #d1fae5',
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
            
            setSelectedMessageForReaction(selectedMessageForMenu);
            setReactionAnchorEl(messageMenuAnchorEl);
            handleMessageMenuClose();
          }} sx={{ gap: 1 }}>
            😊 Add Reaction
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default WardenChat;