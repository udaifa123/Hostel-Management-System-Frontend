// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   IconButton,
//   Avatar,
//   Badge,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemAvatar,
//   CircularProgress,
//   Divider,
//   Alert,
//   alpha,
//   useTheme
// } from '@mui/material';
// import {
//   Send as SendIcon,
//   Check as CheckIcon,
//   DoneAll as DoneAllIcon,
//   Person as PersonIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';
// import { format } from 'date-fns';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// const ParentMessages = () => {
//   const theme = useTheme();
//   const { token } = useAuth();
  
//   const [loading, setLoading] = useState(true);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [warden, setWarden] = useState(null);
//   const [error, setError] = useState(null);
  
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     fetchMessages();
//     fetchWardenInfo();
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const fetchMessages = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/parent/messages`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setMessages(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       setError('Failed to load messages');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchWardenInfo = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/chat/online-status`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       const wardenData = response.data.data.find(u => u.role === 'warden');
//       setWarden(wardenData);
//     } catch (error) {
//       console.error('Error fetching warden:', error);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !warden) return;

//     try {
//       const response = await axios.post(`${API_URL}/parent/message`, {
//         studentId: warden._id, // This will be handled by backend
//         content: newMessage
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setMessages(prev => [...prev, response.data.data]);
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return format(date, 'hh:mm a');
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box p={3}>
//         <Alert severity="error">{error}</Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
//       <Typography variant="h4" fontWeight="bold" gutterBottom>
//         Messages with Warden
//       </Typography>

//       {/* Messages Area */}
//       <Paper sx={{ flex: 1, overflow: 'auto', p: 2, mb: 2, bgcolor: '#f8fafc' }}>
//         {messages.length === 0 ? (
//           <Box display="flex" justifyContent="center" alignItems="center" height="100%">
//             <Typography color="textSecondary">No messages yet. Send a message to the warden!</Typography>
//           </Box>
//         ) : (
//           messages.map((msg) => (
//             <Box
//               key={msg._id}
//               sx={{
//                 display: 'flex',
//                 justifyContent: msg.sender._id === token ? 'flex-end' : 'flex-start',
//                 mb: 2
//               }}
//             >
//               <Box sx={{ maxWidth: '70%' }}>
//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 2,
//                     bgcolor: msg.sender._id === token ? '#10b981' : 'white',
//                     color: msg.sender._id === token ? 'white' : 'inherit',
//                     borderRadius: 2,
//                     borderTopRightRadius: msg.sender._id === token ? 0 : 2,
//                     borderTopLeftRadius: msg.sender._id === token ? 2 : 0
//                   }}
//                 >
//                   <Typography variant="body2">{msg.content}</Typography>
//                 </Paper>
//                 <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 0.5 }}>
//                   <Typography variant="caption" color="textSecondary" sx={{ mr: 0.5 }}>
//                     {formatTime(msg.createdAt)}
//                   </Typography>
//                   {msg.sender._id === token && (
//                     msg.isRead ? (
//                       <DoneAllIcon fontSize="small" sx={{ color: '#10b981' }} />
//                     ) : (
//                       <CheckIcon fontSize="small" sx={{ color: '#94a3b8' }} />
//                     )
//                   )}
//                 </Box>
//               </Box>
//             </Box>
//           ))
//         )}
//         <div ref={messagesEndRef} />
//       </Paper>

//       {/* Message Input */}
//       <Paper sx={{ p: 2 }}>
//         <TextField
//           fullWidth
//           multiline
//           maxRows={4}
//           placeholder="Type a message to warden..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyPress={handleKeyPress}
//           disabled={!warden}
//           InputProps={{
//             endAdornment: (
//               <IconButton
//                 color="primary"
//                 onClick={handleSendMessage}
//                 disabled={!newMessage.trim() || !warden}
//                 sx={{ bgcolor: '#10b981', color: 'white', '&:hover': { bgcolor: '#059669' } }}
//               >
//                 <SendIcon />
//               </IconButton>
//             )
//           }}
//         />
//       </Paper>
//     </Box>
//   );
// };

// export default ParentMessages;