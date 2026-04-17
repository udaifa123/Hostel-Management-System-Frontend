import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Badge,
  Chip,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Tab,
  Tabs,
  useTheme,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  ReportProblem as ComplaintIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationsIcon,
  Chat as ChatIcon,
  Login as VisitIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Send as SendIcon,
  Event as EventIcon,
  Receipt as ReceiptIcon,
  Restaurant as RestaurantIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`parent-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ParentPortal = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { socket } = useSocket();
  
  // State
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [leaveCounts, setLeaveCounts] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [complaintCounts, setComplaintCounts] = useState(null);
  const [fees, setFees] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [visits, setVisits] = useState([]);
  const [visitCounts, setVisitCounts] = useState(null);
  const [wardens, setWardens] = useState([]);
  const [messMenu, setMessMenu] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  

  const [chatDialog, setChatDialog] = useState(false);
  const [visitDialog, setVisitDialog] = useState(false);
  const [selectedWarden, setSelectedWarden] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [visitData, setVisitData] = useState({
    visitDate: '',
    purpose: 'Family Visit',
    numberOfVisitors: 1
  });

  useEffect(() => {
    fetchAllData();

 
    if (socket) {
      socket.on('new_notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        toast.success('New notification received');
      });

      socket.on('new_message', (message) => {
        if (selectedWarden && message.sender === selectedWarden._id) {
          setChatMessages(prev => [...prev, message]);
          toast.success('New message from warden');
        }
      });

      return () => {
        socket.off('new_notification');
        socket.off('new_message');
      };
    }
  }, [socket]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
   
      const dashboardRes = await axios.get('/api/parents/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardSummary(dashboardRes.data.data);

      const profileRes = await axios.get('/api/parents/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudent(profileRes.data.data);

     
      const attendanceRes = await axios.get('/api/parents/attendance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(attendanceRes.data.data.records);
      setAttendanceSummary(attendanceRes.data.data.summary);

   
      const leavesRes = await axios.get('/api/parents/leaves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(leavesRes.data.data.leaves);
      setLeaveCounts(leavesRes.data.data.counts);

     
      const complaintsRes = await axios.get('/api/parents/complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(complaintsRes.data.data.complaints);
      setComplaintCounts(complaintsRes.data.data.counts);

     
      const feesRes = await axios.get('/api/parents/fees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFees(feesRes.data.data);

     
      const notifRes = await axios.get('/api/parents/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifRes.data.data.notifications);
      setUnreadCount(notifRes.data.data.unreadCount);

    
      const visitsRes = await axios.get('/api/parents/visit-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVisits(visitsRes.data.data.visits);
      setVisitCounts(visitsRes.data.data.counts);

      const wardensRes = await axios.get('/api/parents/wardens', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWardens(wardensRes.data.data);

    
      const menuRes = await axios.get('/api/parents/mess-menu', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessMenu(menuRes.data.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.response?.data?.message || 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openChatWithWarden = async (warden) => {
    setSelectedWarden(warden);
    
    try {
      const res = await axios.get(`/api/parents/chat/history/${warden._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatMessages(res.data.data);
      setChatDialog(true);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast.error('Error loading chat history');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedWarden) return;

    try {
      const res = await axios.post('/api/parents/chat/send', {
        receiverId: selectedWarden._id,
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setChatMessages(prev => [...prev, res.data.data]);
      setNewMessage('');

      
      if (socket) {
        socket.emit('send_message', {
          receiverId: selectedWarden._id,
          content: newMessage
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message');
    }
  };

  const handleVisitRequest = async () => {
    try {
      await axios.post('/api/parents/visit-request', {
        ...visitData,
        studentId: student?.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setVisitDialog(false);
      setVisitData({ visitDate: '', purpose: 'Family Visit', numberOfVisitors: 1 });
      toast.success('Visit request sent successfully');
      
      
      const visitsRes = await axios.get('/api/parents/visit-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVisits(visitsRes.data.data.visits);
      setVisitCounts(visitsRes.data.data.counts);
    } catch (error) {
      console.error('Error requesting visit:', error);
      toast.error(error.response?.data?.message || 'Error requesting visit');
    }
  };

  const handleMarkNotificationRead = async (notificationId) => {
    try {
      await axios.put(`/api/parents/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification read:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'resolved':
      case 'completed':
      case 'present':
        return 'success';
      case 'rejected':
      case 'absent':
        return 'error';
      case 'pending':
      case 'in-progress':
      case 'late':
      case 'half-day':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
    
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 60, height: 60 }}>
                <PersonIcon sx={{ fontSize: 30 }} />
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Welcome, {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {dashboardSummary?.student?.name} • Room {dashboardSummary?.student?.roomNumber} • {dashboardSummary?.student?.hostelName}
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchAllData} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>

       
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Today's Attendance</Typography>
                <Typography variant="h6" color={
                  dashboardSummary?.todayAttendance === 'present' ? 'success.main' :
                  dashboardSummary?.todayAttendance === 'absent' ? 'error.main' : 'warning.main'
                }>
                  {dashboardSummary?.todayAttendance === 'present' ? 'Present' :
                   dashboardSummary?.todayAttendance === 'absent' ? 'Absent' : 'Not Marked'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Pending Leaves</Typography>
                <Typography variant="h6" color={dashboardSummary?.pendingLeaves > 0 ? 'warning.main' : 'success.main'}>
                  {dashboardSummary?.pendingLeaves || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Active Complaints</Typography>
                <Typography variant="h6" color={dashboardSummary?.activeComplaints > 0 ? 'error.main' : 'success.main'}>
                  {dashboardSummary?.activeComplaints || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Pending Fees</Typography>
                <Typography variant="h6" color={dashboardSummary?.feeSummary?.pendingFee > 0 ? 'error.main' : 'success.main'}>
                  ₹{dashboardSummary?.feeSummary?.pendingFee?.toLocaleString() || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Notifications</Typography>
                <Typography variant="h6" color="primary">
                  {unreadCount} New
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 2, 
                cursor: 'pointer',
                '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
                transition: 'all 0.3s'
              }}
              onClick={() => setTabValue(1)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <PersonIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="h6">Student Profile</Typography>
                <Typography variant="body2" color="text.secondary">View student details</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 2, 
                cursor: 'pointer',
                '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
                transition: 'all 0.3s'
              }}
              onClick={() => setTabValue(2)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <CalendarIcon sx={{ fontSize: 40, color: theme.palette.info.main, mb: 1 }} />
                <Typography variant="h6">Attendance</Typography>
                <Typography variant="body2" color="text.secondary">Check attendance records</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 2, 
                cursor: 'pointer',
                '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
                transition: 'all 0.3s'
              }}
              onClick={() => setTabValue(3)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <DescriptionIcon sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
                <Typography variant="h6">Leave Requests</Typography>
                <Typography variant="body2" color="text.secondary">Track leave status</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 2, 
                cursor: 'pointer',
                '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
                transition: 'all 0.3s'
              }}
              onClick={() => setTabValue(4)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <ComplaintIcon sx={{ fontSize: 40, color: theme.palette.error.main, mb: 1 }} />
                <Typography variant="h6">Complaints</Typography>
                <Typography variant="body2" color="text.secondary">View complaint status</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 2, 
                cursor: 'pointer',
                '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
                transition: 'all 0.3s'
              }}
              onClick={() => setTabValue(5)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <MoneyIcon sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
                <Typography variant="h6">Fees</Typography>
                <Typography variant="body2" color="text.secondary">Check fee details</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 2, 
                cursor: 'pointer',
                '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
                transition: 'all 0.3s'
              }}
              onClick={() => setTabValue(6)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mb: 1 }} />
                </Badge>
                <Typography variant="h6">Notifications</Typography>
                <Typography variant="body2" color="text.secondary">View updates</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 2, 
                cursor: 'pointer',
                '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
                transition: 'all 0.3s'
              }}
              onClick={() => setTabValue(7)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <ChatIcon sx={{ fontSize: 40, color: theme.palette.info.main, mb: 1 }} />
                <Typography variant="h6">Chat with Warden</Typography>
                <Typography variant="body2" color="text.secondary">Send messages</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 2, 
                cursor: 'pointer',
                '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
                transition: 'all 0.3s'
              }}
              onClick={() => setTabValue(8)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <VisitIcon sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
                <Typography variant="h6">Visit Requests</Typography>
                <Typography variant="body2" color="text.secondary">Request to visit</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      
        <Paper sx={{ mt: 4, borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              <Tab label="Dashboard" />
              <Tab label="Profile" />
              <Tab label="Attendance" />
              <Tab label="Leaves" />
              <Tab label="Complaints" />
              <Tab label="Fees" />
              <Tab label="Notifications" />
              <Tab label="Chat" />
              <Tab label="Visits" />
            </Tabs>
          </Box>

         
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Recent Notifications</Typography>
                <List>
                  {notifications.slice(0, 5).map((notif) => (
                    <ListItem key={notif._id} divider>
                      <ListItemIcon>
                        <NotificationsIcon color={notif.isRead ? 'disabled' : 'primary'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={notif.title}
                        secondary={
                          <>
                            {notif.message}
                            <br />
                            <small>{format(parseISO(notif.createdAt), 'dd MMM yyyy, hh:mm a')}</small>
                          </>
                        }
                      />
                      {!notif.isRead && (
                        <Button size="small" onClick={() => handleMarkNotificationRead(notif._id)}>
                          Mark Read
                        </Button>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Recent Leaves</Typography>
                <List>
                  {leaves.slice(0, 5).map((leave) => (
                    <ListItem key={leave._id} divider>
                      <ListItemIcon>
                        {leave.status === 'approved' && <CheckCircleIcon color="success" />}
                        {leave.status === 'pending' && <PendingIcon color="warning" />}
                        {leave.status === 'rejected' && <CancelIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={leave.reason}
                        secondary={`${format(parseISO(leave.fromDate), 'dd MMM')} - ${format(parseISO(leave.toDate), 'dd MMM yyyy')}`}
                      />
                      <Chip label={leave.status} size="small" color={getStatusColor(leave.status)} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </TabPanel>

          
          <TabPanel value={tabValue} index={1}>
            {student && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: theme.palette.primary.main }}>
                        {student.name?.charAt(0)}
                      </Avatar>
                      <Typography variant="h5">{student.name}</Typography>
                      <Typography color="text.secondary">{student.course}</Typography>
                      <Chip label={`Semester ${student.semester || 'N/A'}`} sx={{ mt: 1 }} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Card>
                    <CardContent>
                      <List>
                        <ListItem>
                          <ListItemIcon><HomeIcon /></ListItemIcon>
                          <ListItemText primary="Room Number" secondary={student.roomNumber || 'N/A'} />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon><SchoolIcon /></ListItemIcon>
                          <ListItemText primary="Hostel" secondary={student.hostelName || 'N/A'} />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon><PhoneIcon /></ListItemIcon>
                          <ListItemText primary="Phone" secondary={student.phoneNumber || 'N/A'} />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon><EmailIcon /></ListItemIcon>
                          <ListItemText primary="Email" secondary={student.email || 'N/A'} />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemIcon><DescriptionIcon /></ListItemIcon>
                          <ListItemText primary="Enrollment No" secondary={student.enrollmentNo || 'N/A'} />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </TabPanel>

          
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>Attendance Summary</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={2.4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary">Total Days</Typography>
                    <Typography variant="h5">{attendanceSummary?.totalDays || 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={2.4}>
                <Card sx={{ bgcolor: '#e8f5e8' }}>
                  <CardContent>
                    <Typography color="success.main">Present</Typography>
                    <Typography variant="h5" color="success.main">{attendanceSummary?.presentDays || 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={2.4}>
                <Card sx={{ bgcolor: '#ffebee' }}>
                  <CardContent>
                    <Typography color="error.main">Absent</Typography>
                    <Typography variant="h5" color="error.main">{attendanceSummary?.absentDays || 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={2.4}>
                <Card sx={{ bgcolor: '#fff3e0' }}>
                  <CardContent>
                    <Typography color="warning.main">Late/Half Day</Typography>
                    <Typography variant="h5" color="warning.main">
                      {(attendanceSummary?.lateDays || 0) + (attendanceSummary?.halfDays || 0)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={2.4}>
                <Card sx={{ bgcolor: '#e3f2fd' }}>
                  <CardContent>
                    <Typography color="info.main">Percentage</Typography>
                    <Typography variant="h5" color="info.main">{attendanceSummary?.attendancePercentage || 0}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>Attendance History</Typography>
            <Paper variant="outlined">
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f5f5f5' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((record) => (
                      <tr key={record._id}>
                        <td style={{ padding: '12px' }}>{format(parseISO(record.date), 'dd MMM yyyy')}</td>
                        <td style={{ padding: '12px' }}>
                          <Chip label={record.status} size="small" color={getStatusColor(record.status)} />
                        </td>
                        <td style={{ padding: '12px' }}>{record.remarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Paper>
          </TabPanel>

         
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Chip label={`Total: ${leaveCounts?.total || 0}`} variant="outlined" />
              <Chip label={`Pending: ${leaveCounts?.pending || 0}`} color="warning" />
              <Chip label={`Approved: ${leaveCounts?.approved || 0}`} color="success" />
              <Chip label={`Rejected: ${leaveCounts?.rejected || 0}`} color="error" />
            </Box>

            <Grid container spacing={2}>
              {leaves.map((leave) => (
                <Grid item xs={12} key={leave._id}>
                  <Card>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <Typography variant="body2" color="text.secondary">From - To</Typography>
                          <Typography>
                            {format(parseISO(leave.fromDate), 'dd MMM')} - {format(parseISO(leave.toDate), 'dd MMM yyyy')}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="body2" color="text.secondary">Reason</Typography>
                          <Typography>{leave.reason}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body2" color="text.secondary">Status</Typography>
                          <Chip label={leave.status} size="small" color={getStatusColor(leave.status)} />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body2" color="text.secondary">Days</Typography>
                          <Typography>{leave.totalDays || 1} days</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

        
          <TabPanel value={tabValue} index={4}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Chip label={`Total: ${complaintCounts?.total || 0}`} variant="outlined" />
              <Chip label={`Pending: ${complaintCounts?.pending || 0}`} color="warning" />
              <Chip label={`In Progress: ${complaintCounts?.['in-progress'] || 0}`} color="info" />
              <Chip label={`Resolved: ${complaintCounts?.resolved || 0}`} color="success" />
            </Box>

            <Grid container spacing={2}>
              {complaints.map((complaint) => (
                <Grid item xs={12} key={complaint._id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{complaint.title}</Typography>
                        <Chip label={complaint.status} size="small" color={getStatusColor(complaint.status)} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {complaint.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Filed on: {format(parseISO(complaint.createdAt), 'dd MMM yyyy')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

         
          <TabPanel value={tabValue} index={5}>
            {fees && (
              <>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#e3f2fd' }}>
                      <CardContent>
                        <Typography color="info.main">Total Fees</Typography>
                        <Typography variant="h4" color="info.main">₹{fees.summary.totalAmount?.toLocaleString() || 0}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#e8f5e8' }}>
                      <CardContent>
                        <Typography color="success.main">Paid Amount</Typography>
                        <Typography variant="h4" color="success.main">₹{fees.summary.paidAmount?.toLocaleString() || 0}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#ffebee' }}>
                      <CardContent>
                        <Typography color="error.main">Pending Amount</Typography>
                        <Typography variant="h4" color="error.main">₹{fees.summary.pendingAmount?.toLocaleString() || 0}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom>Fee History</Typography>
                <Grid container spacing={2}>
                  {fees.fees?.map((fee) => (
                    <Grid item xs={12} key={fee._id}>
                      <Card>
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                              <Typography variant="body2" color="text.secondary">Type</Typography>
                              <Typography>{fee.type}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <Typography variant="body2" color="text.secondary">Total</Typography>
                              <Typography>₹{fee.amount?.toLocaleString()}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <Typography variant="body2" color="text.secondary">Paid</Typography>
                              <Typography color="success.main">₹{fee.paidAmount?.toLocaleString() || 0}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <Typography variant="body2" color="text.secondary">Due Date</Typography>
                              <Typography>{fee.dueDate ? format(parseISO(fee.dueDate), 'dd MMM yyyy') : 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Typography variant="body2" color="text.secondary">Status</Typography>
                              <Chip label={fee.status} size="small" color={getStatusColor(fee.status)} />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={6}>
            <List>
              {notifications.map((notif) => (
                <ListItem 
                  key={notif._id} 
                  divider
                  sx={{ bgcolor: notif.isRead ? 'transparent' : 'rgba(33, 150, 243, 0.05)' }}
                  secondaryAction={
                    !notif.isRead && (
                      <Button size="small" onClick={() => handleMarkNotificationRead(notif._id)}>
                        Mark Read
                      </Button>
                    )
                  }
                >
                  <ListItemIcon>
                    <NotificationsIcon color={notif.isRead ? 'disabled' : 'primary'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={notif.title}
                    secondary={
                      <>
                        {notif.message}
                        <br />
                        <small>{format(parseISO(notif.createdAt), 'dd MMM yyyy, hh:mm a')}</small>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={7}>
            <Typography variant="h6" gutterBottom>Chat with Warden</Typography>
            <Grid container spacing={2}>
              {wardens.map((warden) => (
                <Grid item xs={12} sm={6} md={4} key={warden._id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 6 }
                    }}
                    onClick={() => openChatWithWarden(warden)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar>{warden.name?.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="subtitle1">{warden.name}</Typography>
                          <Typography variant="body2" color="text.secondary">Warden</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          
          <TabPanel value={tabValue} index={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Visit Requests</Typography>
              <Button variant="contained" startIcon={<VisitIcon />} onClick={() => setVisitDialog(true)}>
                New Request
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Chip label={`Total: ${visitCounts?.total || 0}`} variant="outlined" />
              <Chip label={`Pending: ${visitCounts?.pending || 0}`} color="warning" />
              <Chip label={`Approved: ${visitCounts?.approved || 0}`} color="success" />
              <Chip label={`Completed: ${visitCounts?.completed || 0}`} color="info" />
            </Box>

            <Grid container spacing={2}>
              {visits.map((visit) => (
                <Grid item xs={12} key={visit._id}>
                  <Card>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="body2" color="text.secondary">Visit Date</Typography>
                          <Typography>{format(parseISO(visit.visitDate), 'dd MMM yyyy')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="body2" color="text.secondary">Purpose</Typography>
                          <Typography>{visit.purpose}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body2" color="text.secondary">Visitors</Typography>
                          <Typography>{visit.numberOfVisitors}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body2" color="text.secondary">Status</Typography>
                          <Chip label={visit.status} size="small" color={getStatusColor(visit.status)} />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Paper>

       
        <Dialog open={chatDialog} onClose={() => setChatDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar>{selectedWarden?.name?.charAt(0)}</Avatar>
              <Box>
                <Typography variant="h6">{selectedWarden?.name}</Typography>
                <Typography variant="body2" color="text.secondary">Warden</Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent dividers sx={{ height: 400, overflowY: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {chatMessages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.sender === user?.id ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      bgcolor: msg.sender === user?.id ? theme.palette.primary.main : '#f5f5f5',
                      color: msg.sender === user?.id ? 'white' : 'inherit'
                    }}
                  >
                    <Typography variant="body2">{msg.content}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>
                      {format(parseISO(msg.createdAt), 'hh:mm a')}
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <IconButton color="primary" onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </DialogActions>
        </Dialog>

   
        <Dialog open={visitDialog} onClose={() => setVisitDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Request Visit</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Visit Date & Time"
                value={visitData.visitDate}
                onChange={(e) => setVisitData({ ...visitData, visitDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel>Purpose</InputLabel>
                <Select
                  value={visitData.purpose}
                  onChange={(e) => setVisitData({ ...visitData, purpose: e.target.value })}
                  label="Purpose"
                >
                  <MenuItem value="Family Visit">Family Visit</MenuItem>
                  <MenuItem value="Emergency">Emergency</MenuItem>
                  <MenuItem value="Weekend Outing">Weekend Outing</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                type="number"
                label="Number of Visitors"
                value={visitData.numberOfVisitors}
                onChange={(e) => setVisitData({ ...visitData, numberOfVisitors: parseInt(e.target.value) })}
                inputProps={{ min: 1, max: 10 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVisitDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleVisitRequest} disabled={!visitData.visitDate}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ParentPortal;