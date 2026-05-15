import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  alpha,
  CircularProgress,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  People as PeopleIcon,
  MeetingRoom as RoomIcon,
  Report as ComplaintIcon,
  ExitToApp as LeaveIcon,
  Visibility as VisitorsIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const WardenDashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      totalRooms: 0,
      occupiedRooms: 0,
      availableRooms: 0,
      pendingComplaints: 0,
      pendingLeaves: 0,
      visitorsToday: 0,
      todayPresent: 0,
      todayAbsent: 0,
      attendancePercentage: 0
    },
    warden: {
      name: '',
      email: '',
      hostel: {}
    },
    recentComplaints: [],
    recentLeaves: [],
    recentStudents: []
  });

  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const extractStudentName = (item) => {
    console.log('Extracting name from:', item);
    
    if (item.student) {
      if (item.student.user && item.student.user.name) {
        return item.student.user.name;
      }
      if (item.student.name) {
        return item.student.name;
      }
      if (item.student.studentName) {
        return item.student.studentName;
      }
      if (typeof item.student === 'string') {
        return 'Student ID: ' + item.student.slice(-6);
      }
    }
    
    if (item.studentName) return item.studentName;
    if (item.name) return item.name;
    if (item.user?.name) return item.user.name;
    
    return 'Unknown Student';
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching warden dashboard...');
      const response = await axios.get(`${API_URL}/warden/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Dashboard response:', JSON.stringify(response.data, null, 2));
      
      if (response.data.success) {
        const data = response.data.data;
        
        const processedComplaints = (data.recentComplaints || []).map(complaint => {
          const studentName = extractStudentName(complaint);
          console.log(`Complaint "${complaint.title}" - Student: ${studentName}`);
          return {
            ...complaint,
            displayStudentName: studentName
          };
        });
        
        const processedLeaves = (data.recentLeaves || []).map(leave => {
          const studentName = extractStudentName(leave);
          console.log(`Leave request - Student: ${studentName}`);
          return {
            ...leave,
            displayStudentName: studentName
          };
        });
        
        setDashboardData({
          ...data,
          recentComplaints: processedComplaints,
          recentLeaves: processedLeaves
        });
        
        generateWeeklyAttendanceData(data.stats.attendancePercentage || 75);
      } else {
        setError(response.data.message || 'Failed to load dashboard');
        setMockData();
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    const mockComplaints = [
      { 
        _id: '1', 
        title: 'Water leakage in room 101', 
        status: 'pending',
        displayStudentName: 'John Doe',
        student: { user: { name: 'John Doe' } }
      },
      { 
        _id: '2', 
        title: 'Electricity problem in room 205', 
        status: 'in-progress',
        displayStudentName: 'Jane Smith',
        student: { user: { name: 'Jane Smith' } }
      },
      { 
        _id: '3', 
        title: 'Noise complaint from room 310', 
        status: 'pending',
        displayStudentName: 'Mike Johnson',
        student: { user: { name: 'Mike Johnson' } }
      }
    ];
    
    const mockLeaves = [
      {
        _id: '1',
        reason: 'Family function',
        status: 'pending',
        displayStudentName: 'David Brown',
        student: { user: { name: 'David Brown' } }
      },
      {
        _id: '2',
        reason: 'Medical emergency',
        status: 'pending',
        displayStudentName: 'Emily Davis',
        student: { user: { name: 'Emily Davis' } }
      }
    ];
    
    setDashboardData({
      stats: {
        totalStudents: 125,
        totalRooms: 60,
        occupiedRooms: 48,
        availableRooms: 12,
        pendingComplaints: 5,
        pendingLeaves: 3,
        visitorsToday: 2,
        todayPresent: 98,
        todayAbsent: 27,
        attendancePercentage: 78
      },
      warden: {
        name: 'Warden',
        email: 'warden@hostel.com',
        hostel: { name: 'Main Hostel' }
      },
      recentComplaints: mockComplaints,
      recentLeaves: mockLeaves,
      recentStudents: []
    });
    generateWeeklyAttendanceData(78);
  };

  const generateWeeklyAttendanceData = (basePercentage) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map(day => {
      let percentage = basePercentage;
      if (day === 'Sat') percentage = basePercentage - 15;
      if (day === 'Sun') percentage = basePercentage - 25;
      if (day === 'Mon') percentage = basePercentage + 5;
      
      return {
        day,
        present: Math.min(100, Math.max(0, percentage)),
        absent: Math.min(100, Math.max(0, 100 - percentage))
      };
    });
    setAttendanceData(data);
  };

  const statCards = [
    { 
      title: 'Total Students', 
      value: dashboardData.stats.totalStudents, 
      icon: <PeopleIcon />, 
      color: '#3b82f6', 
      bg: '#eff6ff',
      link: '/warden/students'
    },
    { 
      title: 'Total Rooms', 
      value: dashboardData.stats.totalRooms, 
      icon: <RoomIcon />, 
      color: '#10b981', 
      bg: '#ecfdf5',
      link: '/warden/rooms'
    },
    { 
      title: 'Available Rooms', 
      value: dashboardData.stats.availableRooms, 
      icon: <RoomIcon />, 
      color: '#8b5cf6', 
      bg: '#f5f3ff',
      link: '/warden/rooms'
    },
    { 
      title: 'Pending Complaints', 
      value: dashboardData.stats.pendingComplaints, 
      icon: <ComplaintIcon />, 
      color: '#f97316', 
      bg: '#fff7ed',
      link: '/warden/complaints'
    },
    { 
      title: 'Pending Leaves', 
      value: dashboardData.stats.pendingLeaves, 
      icon: <LeaveIcon />, 
      color: '#ef4444', 
      bg: '#fef2f2',
      link: '/warden/leaves'
    },
    { 
      title: 'Visitors Today', 
      value: dashboardData.stats.visitorsToday || 0, 
      icon: <VisitorsIcon />, 
      color: '#06b6d4', 
      bg: '#ecfeff',
      link: '/warden/visitors'
    },
    { 
      title: 'Present Today', 
      value: `${dashboardData.stats.todayPresent || 0}/${dashboardData.stats.totalStudents || 0}`, 
      icon: <SchoolIcon />, 
      color: '#84cc16', 
      bg: '#f7fee7',
      link: '/warden/attendance'
    },
    { 
      title: 'Attendance Rate', 
      value: `${dashboardData.stats.attendancePercentage || 0}%`, 
      icon: <TrendingUpIcon />, 
      color: '#14b8a6', 
      bg: '#ecfdf5',
      link: '/warden/attendance'
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography ml={2}>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Welcome back, {dashboardData.warden?.name || 'Warden'}! Here's what's happening in {dashboardData.warden?.hostel?.name || 'your hostel'} today.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchDashboardData}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error} - Showing demo data
        </Alert>
      )}

      <Grid container spacing={3} mb={4}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
              }}
              onClick={() => navigate(stat.link)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" variant="body2" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.bg, color: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
                {stat.title === 'Attendance Rate' && (
                  <Box mt={2}>
                    <LinearProgress 
                      variant="determinate" 
                      value={dashboardData.stats.attendancePercentage || 0} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Weekly Attendance Trend
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Overall attendance rate: <strong>{dashboardData.stats.attendancePercentage || 0}%</strong>
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} name="Present %" />
                <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} name="Absent %" />
              </LineChart>
            </ResponsiveContainer>
            <Box display="flex" justifyContent="center" gap={4} mt={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#10b981', borderRadius: '50%' }} />
                <Typography variant="caption">Present</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#ef4444', borderRadius: '50%' }} />
                <Typography variant="caption">Absent</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Today's Attendance
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" gap={4} my={3}>
              <Box textAlign="center">
                <Avatar sx={{ bgcolor: '#10b981', width: 80, height: 80, mx: 'auto', mb: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="#10b981">
                  {dashboardData.stats.todayPresent || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">Present</Typography>
              </Box>
              <Box textAlign="center">
                <Avatar sx={{ bgcolor: '#ef4444', width: 80, height: 80, mx: 'auto', mb: 1 }}>
                  <WarningIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="#ef4444">
                  {dashboardData.stats.todayAbsent || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">Absent</Typography>
              </Box>
            </Box>
            <Typography variant="body2" textAlign="center" color="textSecondary">
              Total Students: {dashboardData.stats.totalStudents || 0}
            </Typography>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => navigate('/warden/attendance')}
              sx={{ mt: 3 }}
            >
              View Full Attendance Report
            </Button>
          </Paper>
        </Grid>

       
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Complaints
            </Typography>
            {dashboardData.recentComplaints && dashboardData.recentComplaints.length > 0 ? (
              <List>
                {dashboardData.recentComplaints.slice(0, 4).map((complaint, index) => (
                  <React.Fragment key={complaint._id || index}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: alpha('#f97316', 0.1), color: '#f97316' }}>
                          <WarningIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="bold">
                            {complaint.title || 'Complaint'}
                          </Typography>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ color: 'text.primary', display: 'inline' }}
                            >
                              By: {complaint.displayStudentName || extractStudentName(complaint)}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                      <Chip 
                        label={complaint.status || 'pending'} 
                        size="small"
                        sx={{ 
                          bgcolor: (complaint.status === 'pending' || complaint.status === 'in-progress') ? '#fff7ed' : '#ecfdf5',
                          color: (complaint.status === 'pending' || complaint.status === 'in-progress') ? '#f97316' : '#10b981'
                        }}
                      />
                    </ListItem>
                    {index < dashboardData.recentComplaints.length - 1 && index < 3 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box py={4} textAlign="center">
                <Typography color="textSecondary">No recent complaints</Typography>
              </Box>
            )}
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => navigate('/warden/complaints')}
              sx={{ mt: 2 }}
            >
              View All Complaints
            </Button>
          </Paper>
        </Grid>

        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Pending Leave Requests
            </Typography>
            {dashboardData.recentLeaves && dashboardData.recentLeaves.length > 0 ? (
              <List>
                {dashboardData.recentLeaves.slice(0, 4).map((leave, index) => (
                  <React.Fragment key={leave._id || index}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: alpha('#ef4444', 0.1), color: '#ef4444' }}>
                          <LeaveIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="bold">
                            {leave.displayStudentName || extractStudentName(leave)}
                          </Typography>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ color: 'text.primary', display: 'inline' }}
                            >
                              Reason: {leave.reason || 'No reason provided'}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                      <Chip 
                        label={leave.status || 'pending'} 
                        size="small"
                        sx={{ bgcolor: '#fef2f2', color: '#ef4444' }}
                      />
                    </ListItem>
                    {index < dashboardData.recentLeaves.length - 1 && index < 3 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box py={4} textAlign="center">
                <Typography color="textSecondary">No pending leave requests</Typography>
              </Box>
            )}
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => navigate('/warden/leaves')}
              sx={{ mt: 2 }}
            >
              View All Leave Requests
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WardenDashboard;