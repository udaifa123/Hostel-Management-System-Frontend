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
  Tabs
} from '@mui/material';
import {
  Send as SendIcon,
  Check as CheckIcon,
  DoneAll as DoneAllIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
  WifiOff as WifiOffIcon,
  Person as PersonIcon,
  FamilyRestroom as ParentIcon,
  Chat as ChatIcon  // ✅ ADD THIS IMPORT
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useCall } from '../../context/CallContext';
import { format, isToday, isYesterday } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const WardenChat = () => {
  const { token } = useAuth();
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
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

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

    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);
    socket.on('user_typing', handleTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
      socket.off('user_typing', handleTyping);
    };
  }, [socket, selectedChat]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Fetch students (existing conversations)
      const studentsResponse = await axios.get(`${API_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch parents (new endpoint for warden)
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
      
      setStudents(studentsData);
      setParents(parentsData);
      setFilteredStudents(studentsData);
      setFilteredParents(parentsData);
      
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    if (!userId) return;

    try {
      let response;
      
      // Check if it's a parent or student based on selectedChat role
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
      
      // Mark as read
      await axios.put(`${API_URL}/chat/read/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !isConnected) return;

    try {
      let response;
      
      // Check if it's a parent or student
      if (selectedChat.participant.role === 'parent') {
        response = await axios.post(`${API_URL}/chat/warden/send`, {
          receiverId: selectedChat.participant._id,
          content: newMessage
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.post(`${API_URL}/chat/send`, {
          receiverId: selectedChat.participant._id,
          content: newMessage
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (response.data.success) {
        setMessages(prev => [...prev, response.data.data]);
        setNewMessage('');
        
        if (sendTyping) {
          sendTyping(selectedChat.participant._id, false);
        }
        
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
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

    if (!selectedChat || !sendTyping) return;

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
    const isDisabled = !isConnected || !selectedChat?.participant?._id;
    
    return (
      <Tooltip title={label}>
        <IconButton
          onClick={() => startCall(selectedChat.participant._id, type)}
          disabled={isDisabled}
          sx={{ color: !isDisabled ? '#10b981' : '#94a3b8' }}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
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
    <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
      {/* Connection Status */}
      {!isConnected && (
        <Alert 
          severity="warning" 
          icon={<WifiOffIcon />}
          sx={{ position: 'absolute', top: 70, right: 20, zIndex: 1000 }}
        >
          Connecting to chat server...
        </Alert>
      )}

      {/* Conversations List */}
      <Paper sx={{ width: 350, mr: 2, display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
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
        
        {/* Tabs for Students and Parents */}
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
                  key={conv.id}
                  button
                  selected={selectedChat?.id === conv.id}
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
                      invisible={!isOnline(conv.participant._id)}
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

      {/* Chat Area */}
      {selectedChat ? (
        <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden' }}>
          {/* Chat Header */}
          <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: '#f5f5f5' }}>
            <Toolbar>
              <Box display="flex" alignItems="center" gap={2} flex={1}>
                <Badge
                  color="success"
                  variant="dot"
                  invisible={!isOnline(selectedChat.participant._id)}
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
                    {isOnline(selectedChat.participant._id) ? ' Online' : ' Offline'}
                  </Typography>
                </Box>
              </Box>
              
              {/* Call Buttons */}
              <Box display="flex" gap={1}>
                {renderCallButton('audio', <PhoneIcon />, 'Audio Call')}
                {renderCallButton('video', <VideoCallIcon />, 'Video Call')}
              </Box>
            </Toolbar>
          </AppBar>

          {/* Messages */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#f8fafc' }}>
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

                  {msgs.map((msg, idx) => (
                    <Box
                      key={msg._id || idx}
                      sx={{
                        display: 'flex',
                        justifyContent: msg.sender._id === token ? 'flex-end' : 'flex-start',
                        mb: 2
                      }}
                    >
                      <Box sx={{ maxWidth: '70%' }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: msg.sender._id === token ? '#10b981' : 'white',
                            color: msg.sender._id === token ? 'white' : '#333',
                            borderRadius: 2,
                            borderTopRightRadius: msg.sender._id === token ? 0 : 2,
                            borderTopLeftRadius: msg.sender._id === token ? 2 : 0
                          }}
                        >
                          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                            {msg.content}
                          </Typography>
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
                          {msg.sender._id === token && getMessageStatusIcon(msg)}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ))
            )}
            
            {/* Typing Indicator */}
            {isTyping && (
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

          {/* Message Input */}
          <Box sx={{ p: 2, bgcolor: 'white', borderTop: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder={`Type a message to ${selectedChat.participant.name}...`}
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              disabled={!isConnected}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || !isConnected}
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
        <Paper sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 3 }}>
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
    </Box>
  );
};

export default WardenChat;