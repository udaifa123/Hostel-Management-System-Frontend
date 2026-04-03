import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Alert,
  Divider,
  LinearProgress,
  Avatar,
  Chip,
  Tooltip,
  Button
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Refresh as RefreshIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  MeetingRoom as RoomIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  ReportProblem as ComplaintIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  Login as VisitIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import adminService from '../../services/adminService';
import AdminLayout from '../../components/Layout/AdminLayout';
import toast from 'react-hot-toast';

// Green Design Tokens
const G = {
  900: '#0D3318',
  800: '#1A5C2A',
  700: '#1E7A35',
  600: '#2E9142',
  500: '#3AAF51',
  400: '#5DC470',
  300: '#8FD9A0',
  200: '#C1EDCA',
  100: '#E4F7E8',
  50: '#F4FBF5',
};

const CARD_SHADOW = '0 4px 20px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.05)';

// ✅ ADD THIS - Monthly Trend Data
const monthlyTrendData = [
  { month: 'Jan', students: 245, fees: 325000, complaints: 12, leaves: 8 },
  { month: 'Feb', students: 258, fees: 342000, complaints: 10, leaves: 12 },
  { month: 'Mar', students: 272, fees: 368000, complaints: 15, leaves: 10 },
  { month: 'Apr', students: 285, fees: 385000, complaints: 8, leaves: 15 },
  { month: 'May', students: 298, fees: 402000, complaints: 6, leaves: 18 },
  { month: 'Jun', students: 312, fees: 421000, complaints: 9, leaves: 20 },
  { month: 'Jul', students: 325, fees: 438000, complaints: 11, leaves: 16 },
  { month: 'Aug', students: 338, fees: 456000, complaints: 14, leaves: 14 },
  { month: 'Sep', students: 352, fees: 475000, complaints: 7, leaves: 11 },
  { month: 'Oct', students: 365, fees: 492000, complaints: 5, leaves: 9 },
  { month: 'Nov', students: 378, fees: 510000, complaints: 8, leaves: 13 },
  { month: 'Dec', students: 392, fees: 528000, complaints: 10, leaves: 17 },
];

// Stat Card Component
const StatCard = ({ label, value, icon: Icon, trend, trendValue, dark = false, subtext }) => {
  const isDark = dark;
  const isPositive = trend === 'up';
  
  return (
    <Card elevation={0} sx={{
      borderRadius: 3,
      bgcolor: isDark ? G[800] : '#ffffff',
      border: `1px solid ${isDark ? G[700] : G[200]}`,
      boxShadow: isDark ? '0 8px 24px rgba(13,51,24,0.2)' : CARD_SHADOW,
      height: '100%',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: isDark ? '0 12px 32px rgba(13,51,24,0.3)' : '0 12px 32px rgba(30,122,53,0.12)',
      },
      position: 'relative',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{
              color: isDark ? G[300] : G[600],
              fontWeight: 600,
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'block',
              mb: 1
            }}>
              {label}
            </Typography>
            <Typography sx={{
              fontWeight: 800,
              color: isDark ? '#ffffff' : G[800],
              fontSize: '2rem',
              lineHeight: 1.2,
              mb: 0.5
            }}>
              {value}
            </Typography>
            {subtext && (
              <Typography variant="caption" sx={{ color: isDark ? G[300] : G[500] }}>
                {subtext}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                {isPositive ? (
                  <ArrowUpIcon sx={{ fontSize: 14, color: G[600] }} />
                ) : (
                  <ArrowDownIcon sx={{ fontSize: 14, color: '#EF4444' }} />
                )}
                <Typography variant="caption" sx={{ 
                  color: isPositive ? G[600] : '#EF4444', 
                  fontWeight: 600 
                }}>
                  {trendValue}%
                </Typography>
                <Typography variant="caption" sx={{ color: G[500] }}>vs last month</Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{
            bgcolor: isDark ? G[700] : G[100],
            width: 48,
            height: 48,
            borderRadius: 2,
          }}>
            <Icon sx={{ color: isDark ? G[200] : G[600], fontSize: 24 }} />
          </Avatar>
        </Box>
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 80,
          height: 80,
          opacity: 0.05,
          transform: 'rotate(15deg)'
        }}>
          <Icon sx={{ fontSize: 80 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Mini Metric Card
const MiniMetricCard = ({ label, value, icon: Icon, color, trend }) => (
  <Card elevation={0} sx={{
    borderRadius: 2.5,
    bgcolor: '#ffffff',
    border: `1px solid ${G[200]}`,
    transition: 'all 0.2s ease',
    '&:hover': { borderColor: G[300], boxShadow: CARD_SHADOW }
  }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption" sx={{
          color: G[600],
          fontWeight: 600,
          fontSize: '0.68rem',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
        }}>
          {label}
        </Typography>
        <Avatar sx={{ bgcolor: `${color}10`, width: 28, height: 28, borderRadius: 1.5 }}>
          <Icon sx={{ color: color, fontSize: 14 }} />
        </Avatar>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: G[800], mb: 0.5 }}>
        {value}
      </Typography>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {trend > 0 ? (
            <TrendingUpIcon sx={{ fontSize: 12, color: G[600] }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 12, color: '#EF4444' }} />
          )}
          <Typography variant="caption" sx={{ color: G[500] }}>
            {trend > 0 ? '+' : ''}{trend}% from last month
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

// Activity Item
const ActivityItem = ({ activity }) => {
  const getIcon = () => {
    switch(activity.type) {
      case 'student': return <SchoolIcon sx={{ fontSize: 16 }} />;
      case 'fee': return <MoneyIcon sx={{ fontSize: 16 }} />;
      case 'complaint': return <ComplaintIcon sx={{ fontSize: 16 }} />;
      case 'leave': return <DescriptionIcon sx={{ fontSize: 16 }} />;
      case 'visit': return <VisitIcon sx={{ fontSize: 16 }} />;
      case 'attendance': return <CalendarIcon sx={{ fontSize: 16 }} />;
      default: return <SchoolIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getColor = () => {
    switch(activity.type) {
      case 'student': return G[600];
      case 'fee': return '#10B981';
      case 'complaint': return '#F59E0B';
      case 'leave': return '#8B5CF6';
      case 'visit': return '#3B82F6';
      case 'attendance': return '#EC489A';
      default: return G[600];
    }
  };

  const getBg = () => {
    switch(activity.type) {
      case 'student': return G[100];
      case 'fee': return '#D1FAE5';
      case 'complaint': return '#FEF3C7';
      case 'leave': return '#EDE9FE';
      case 'visit': return '#DBEAFE';
      case 'attendance': return '#FCE7F3';
      default: return G[100];
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2, 
      py: 1.5,
      borderBottom: `1px solid ${G[100]}`,
      '&:last-child': { borderBottom: 'none' }
    }}>
      <Avatar sx={{ bgcolor: getBg(), width: 40, height: 40, borderRadius: 2 }}>
        {getIcon()}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: G[800] }}>
          {activity.action}
        </Typography>
        <Typography variant="caption" sx={{ color: G[500] }}>
          {activity.user} • {activity.time}
        </Typography>
      </Box>
      {activity.amount && (
        <Chip 
          label={activity.amount} 
          size="small" 
          sx={{ 
            bgcolor: G[100], 
            color: G[700], 
            fontWeight: 600,
            fontSize: '0.7rem'
          }} 
        />
      )}
    </Box>
  );
};

// Main Dashboard Component
const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [visitorData, setVisitorData] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [visitorStats, setVisitorStats] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [dashboardRes, weeklyAttendanceRes, weeklyVisitorsRes, attendanceStatsRes, visitorStatsRes] = await Promise.all([
        adminService.getDashboardStats().catch(() => null),
        adminService.getWeeklyAttendance().catch(() => null),
        adminService.getWeeklyVisitors().catch(() => null),
        adminService.getAttendanceStats().catch(() => null),
        adminService.getVisitorStats().catch(() => null)
      ]);
      
      // Set dashboard stats
      let dashboardData = dashboardRes?.data || dashboardRes;
      setStats(dashboardData);
      
      // Set attendance data
      if (weeklyAttendanceRes && weeklyAttendanceRes.data) {
        const attendance = weeklyAttendanceRes.data.data || weeklyAttendanceRes.data;
        setAttendanceData(attendance);
      } else {
        generateMockAttendanceData();
      }
      
      // Set visitor data
      if (weeklyVisitorsRes && weeklyVisitorsRes.data) {
        const visitors = weeklyVisitorsRes.data.data || weeklyVisitorsRes.data;
        setVisitorData(visitors);
      } else {
        generateMockVisitorData();
      }
      
      // Set attendance stats
      if (attendanceStatsRes && attendanceStatsRes.data) {
        setAttendanceStats(attendanceStatsRes.data.data || attendanceStatsRes.data);
      } else {
        setAttendanceStats({
          today: { present: 245, absent: 147, rate: 62.5 },
          weekly: { average: 78.5 },
          monthly: { average: 76.2 }
        });
      }
      
      // Set visitor stats
      if (visitorStatsRes && visitorStatsRes.data) {
        setVisitorStats(visitorStatsRes.data.data || visitorStatsRes.data);
      } else {
        setVisitorStats({
          today: { total: 18, students: 12, parents: 6 },
          weekly: { total: 124 },
          monthly: { total: 456 }
        });
      }
      
      generateRecentActivities();
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard');
      
      // Set mock data for fallback
      setStats({
        overview: {
          totalStudents: 392,
          totalHostels: 4,
          totalWardens: 8,
          totalRooms: 350,
          occupancyRate: 82,
          occupiedRooms: 287
        },
        pending: {
          leaves: 12,
          complaints: 8
        },
        financial: {
          totalCollected: 528000,
          pendingAmount: 125000
        },
        monthly: {
          newStudents: 28,
          feesCollected: 528000,
          complaintsResolved: 24,
          leavesApproved: 17
        }
      });
      
      generateMockAttendanceData();
      generateMockVisitorData();
      generateRecentActivities();
      
    } finally {
      setLoading(false);
    }
  };

  const generateMockAttendanceData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const mockData = days.map(day => ({
      date: day,
      present: Math.floor(Math.random() * (320 - 280 + 1) + 280),
      absent: Math.floor(Math.random() * (120 - 80 + 1) + 80),
      late: Math.floor(Math.random() * (30 - 10 + 1) + 10)
    }));
    setAttendanceData(mockData);
  };

  const generateMockVisitorData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const mockData = days.map(day => ({
      date: day,
      students: Math.floor(Math.random() * (25 - 10 + 1) + 10),
      parents: Math.floor(Math.random() * (15 - 5 + 1) + 5),
      total: Math.floor(Math.random() * (40 - 20 + 1) + 20)
    }));
    setVisitorData(mockData);
  };

  const generateRecentActivities = () => {
    const activities = [
      { id: 1, type: 'student', action: 'New student admitted - Rahul Sharma', user: 'Admin', time: '5 min ago' },
      { id: 2, type: 'fee', action: 'Fee payment received', user: 'Amina Khan', time: '10 min ago', amount: '₹25,000' },
      { id: 3, type: 'complaint', action: 'Complaint #123 resolved', user: 'Room 101', time: '15 min ago' },
      { id: 4, type: 'leave', action: 'Leave application approved', user: 'Sarah Khan', time: '30 min ago' },
      { id: 5, type: 'visit', action: 'Visitor checked in', user: 'Parent of John', time: '45 min ago' },
      { id: 6, type: 'attendance', action: 'Attendance marked for 45 students', user: 'Warden', time: '1 hour ago' },
    ];
    setRecentActivities(activities);
  };

  const getValue = (obj, path, defaultValue = 0) => {
    if (!obj) return defaultValue;
    let current = obj;
    for (const key of path.split('.')) {
      if (current === null || current === undefined || typeof current !== 'object') return defaultValue;
      current = current[key];
    }
    return current !== null && current !== undefined ? current : defaultValue;
  };

  const occupancy = Math.min(Number(getValue(stats, 'overview.occupancyRate', 0)), 100);
  const totalStudents = getValue(stats, 'overview.totalStudents', 0);
  const totalHostels = getValue(stats, 'overview.totalHostels', 0);
  const totalRooms = getValue(stats, 'overview.totalRooms', 0);
  const totalWardens = getValue(stats, 'overview.totalWardens', 0);
  const pendingLeaves = getValue(stats, 'pending.leaves', 0);
  const pendingComplaints = getValue(stats, 'pending.complaints', 0);
  const feesCollected = getValue(stats, 'financial.totalCollected', 0);
  const monthlyNewStudents = getValue(stats, 'monthly.newStudents', 0);
  const monthlyFeesCollected = getValue(stats, 'monthly.feesCollected', 0);
  const monthlyComplaintsResolved = getValue(stats, 'monthly.complaintsResolved', 0);
  const monthlyLeavesApproved = getValue(stats, 'monthly.leavesApproved', 0);
  
  const todayAttendance = attendanceStats?.today?.present || 245;
  const todayVisitors = visitorStats?.today?.total || 18;

  if (loading) return (
    <AdminLayout>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh', 
        gap: 3 
      }}>
        <CircularProgress sx={{ color: G[600] }} size={48} thickness={4} />
        <Typography variant="body1" sx={{ color: G[500], fontWeight: 500 }}>
          Loading dashboard...
        </Typography>
      </Box>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {error}
        </Alert>
      </Container>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <Box sx={{ height: 4, bgcolor: G[600] }} />

      <Container maxWidth="xl" sx={{ py: 4 }}>

        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: G[800], letterSpacing: '-0.02em', mb: 1 }}>
                Dashboard Overview
              </Typography>
              <Typography variant="body2" sx={{ color: G[500] }}>
                Welcome back! Here's what's happening with your hostel management system.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Tooltip title="Export Report">
                <IconButton 
                  onClick={() => toast.success('Report download started')}
                  sx={{ bgcolor: '#ffffff', border: `1px solid ${G[200]}`, '&:hover': { bgcolor: G[100], borderColor: G[400] } }}
                >
                  <DownloadIcon sx={{ color: G[600] }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh Data">
                <IconButton 
                  onClick={fetchAllData}
                  sx={{ bgcolor: '#ffffff', border: `1px solid ${G[200]}`, '&:hover': { bgcolor: G[100], borderColor: G[400] } }}
                >
                  <RefreshIcon sx={{ color: G[600] }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: '14px' }} />}
            label="System Online"
            size="small"
            sx={{ bgcolor: G[100], color: G[700], fontWeight: 600, fontSize: '0.7rem', border: `1px solid ${G[200]}` }}
          />
        </Box>

        {/* Primary Stat Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="Total Students" value={totalStudents.toLocaleString()} icon={SchoolIcon} dark trend="up" trendValue="12" subtext="Active enrollment" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="Total Hostels" value={totalHostels} icon={HomeIcon} trend="up" trendValue="5" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="Total Rooms" value={totalRooms} icon={RoomIcon} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="Active Wardens" value={totalWardens} icon={PersonIcon} />
          </Grid>
        </Grid>

        {/* Occupancy & Quick Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{
              p: 3, borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW, height: '100%'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography sx={{ fontWeight: 700, color: G[800], fontSize: '1rem' }}>Overall Occupancy Rate</Typography>
                <Typography sx={{ fontWeight: 800, color: G[600], fontSize: '1.8rem' }}>{occupancy}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={occupancy} sx={{
                height: 12, borderRadius: 6, bgcolor: G[200], mb: 2,
                '& .MuiLinearProgress-bar': { bgcolor: G[600], borderRadius: 6, background: `linear-gradient(90deg, ${G[500]}, ${G[600]})` }
              }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: G[500] }}>{getValue(stats, 'overview.occupiedRooms')} occupied rooms</Typography>
                <Typography variant="caption" sx={{ color: G[500] }}>{totalRooms - getValue(stats, 'overview.occupiedRooms', 0)} available</Typography>
              </Box>

              <Divider sx={{ my: 3, borderColor: G[100] }} />
              <Typography sx={{ fontWeight: 600, color: G[800], mb: 2, fontSize: '0.85rem' }}>Occupancy by Hostel</Typography>
              {[
                { name: 'Boys Hostel A', occupied: 85, total: 100, percentage: 85 },
                { name: 'Boys Hostel B', occupied: 72, total: 90, percentage: 80 },
                { name: 'Girls Hostel', occupied: 95, total: 110, percentage: 86 },
                { name: 'International Hostel', occupied: 45, total: 60, percentage: 75 },
              ].map((hostel, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: G[700], fontWeight: 500 }}>{hostel.name}</Typography>
                    <Typography variant="caption" sx={{ color: G[600], fontWeight: 600 }}>{hostel.percentage}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={hostel.percentage} sx={{
                    height: 6, borderRadius: 3, bgcolor: G[200],
                    '& .MuiLinearProgress-bar': { bgcolor: hostel.percentage > 80 ? G[600] : G[400], borderRadius: 3 }
                  }} />
                </Box>
              ))}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={3} sx={{ height: '100%' }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <MiniMetricCard label="Pending Leaves" value={pendingLeaves} icon={DescriptionIcon} color="#F59E0B" trend={-5} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <MiniMetricCard label="Pending Complaints" value={pendingComplaints} icon={ComplaintIcon} color="#EF4444" trend={12} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <MiniMetricCard label="Monthly Revenue" value={`₹${(feesCollected / 1000).toFixed(0)}k`} icon={MoneyIcon} color={G[600]} trend={8} />
              </Grid>
              
              {/* Today's Attendance Card */}
              <Grid size={{ xs: 12 }}>
                <Paper elevation={0} sx={{
                  p: 3, borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW, mt: 1
                }}>
                  <Typography sx={{ fontWeight: 700, color: G[800], mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon sx={{ color: G[600], fontSize: 20 }} />
                    Today's Attendance
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                      <Typography variant="caption" sx={{ color: G[500] }}>Present</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: G[600] }}>{todayAttendance}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                      <Typography variant="caption" sx={{ color: G[500] }}>Absent</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#EF4444' }}>{totalStudents - todayAttendance}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                      <Typography variant="caption" sx={{ color: G[500] }}>Rate</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: G[600] }}>{((todayAttendance / totalStudents) * 100).toFixed(1)}%</Typography>
                    </Box>
                  </Box>
                  <LinearProgress variant="determinate" value={(todayAttendance / totalStudents) * 100} sx={{
                    height: 8, borderRadius: 4, bgcolor: G[200],
                    '& .MuiLinearProgress-bar': { bgcolor: G[600], borderRadius: 4 }
                  }} />
                </Paper>
              </Grid>

              {/* Today's Visitors Card */}
              <Grid size={{ xs: 12 }}>
                <Paper elevation={0} sx={{
                  p: 3, borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW, mt: 1
                }}>
                  <Typography sx={{ fontWeight: 700, color: G[800], mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VisitIcon sx={{ color: G[600], fontSize: 20 }} />
                    Today's Visitors
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: G[500] }}>Students</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: G[600] }}>{visitorData[visitorData.length - 1]?.students || 12}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: G[500] }}>Parents</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#3B82F6' }}>{visitorData[visitorData.length - 1]?.parents || 6}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: G[500] }}>Total</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: G[600] }}>{todayVisitors}</Typography>
                    </Box>
                  </Box>
                  <Button fullWidth variant="outlined" size="small" onClick={() => toast.info('View visitor details')} sx={{ borderColor: G[300], color: G[600] }}>
                    View Visitor Log
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Attendance & Visitors Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{
              p: 3, borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW
            }}>
              <Typography sx={{ fontWeight: 700, color: G[800], mb: 2 }}>Weekly Attendance Trend</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={G[200]} />
                  <XAxis dataKey="date" stroke={G[500]} />
                  <YAxis stroke={G[500]} />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="present" fill={G[600]} name="Present" />
                  <Bar dataKey="absent" fill="#EF4444" name="Absent" />
                  <Bar dataKey="late" fill="#F59E0B" name="Late" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{
              p: 3, borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW
            }}>
              <Typography sx={{ fontWeight: 700, color: G[800], mb: 2 }}>Weekly Visitor Statistics</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={visitorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={G[200]} />
                  <XAxis dataKey="date" stroke={G[500]} />
                  <YAxis stroke={G[500]} />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="students" stroke={G[600]} name="Students" strokeWidth={2} />
                  <Line type="monotone" dataKey="parents" stroke="#3B82F6" name="Parents" strokeWidth={2} />
                  <Line type="monotone" dataKey="total" stroke="#F59E0B" name="Total" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Activities & Monthly Summary */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{
              p: 3, borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon sx={{ color: G[600], fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>Recent Activities</Typography>
                </Box>
                <Button size="small" sx={{ color: G[600], textTransform: 'none', fontWeight: 600 }} onClick={() => toast.info('View all activities')}>
                  View All
                </Button>
              </Box>
              <Divider sx={{ borderColor: G[100], mb: 2 }} />
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{
              p: 3, borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WarningIcon sx={{ color: G[600], fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>Monthly Performance Summary</Typography>
              </Box>
              <Divider sx={{ borderColor: G[100], mb: 3 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: G[50], border: `1px solid ${G[200]}`, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                      New Students
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: G[800] }}>{monthlyNewStudents}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                      <ArrowUpIcon sx={{ fontSize: 12, color: G[600] }} />
                      <Typography variant="caption" sx={{ color: G[600] }}>+8%</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: G[50], border: `1px solid ${G[200]}`, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                      Fees Collected
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: G[800] }}>₹{(monthlyFeesCollected / 1000).toFixed(0)}k</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                      <ArrowUpIcon sx={{ fontSize: 12, color: G[600] }} />
                      <Typography variant="caption" sx={{ color: G[600] }}>+12%</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: G[50], border: `1px solid ${G[200]}`, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                      Complaints Resolved
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: G[800] }}>{monthlyComplaintsResolved}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                      <ArrowUpIcon sx={{ fontSize: 12, color: G[600] }} />
                      <Typography variant="caption" sx={{ color: G[600] }}>+5%</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: G[50], border: `1px solid ${G[200]}`, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                      Leaves Approved
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: G[800] }}>{monthlyLeavesApproved}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                      <ArrowDownIcon sx={{ fontSize: 12, color: '#EF4444' }} />
                      <Typography variant="caption" sx={{ color: '#EF4444' }}>-3%</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Monthly Trend Chart */}
        <Paper elevation={0} sx={{
          mt: 4, p: 3, borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontWeight: 700, color: G[800], fontSize: '1.1rem' }}>Yearly Performance Trends</Typography>
            <Chip label="Last 12 months" size="small" sx={{ bgcolor: G[100], color: G[600] }} />
          </Box>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={G[200]} />
              <XAxis dataKey="month" stroke={G[500]} />
              <YAxis yAxisId="left" stroke={G[500]} />
              <YAxis yAxisId="right" orientation="right" stroke={G[500]} />
              <RechartsTooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="students" stroke={G[600]} strokeWidth={2} name="Students" dot={{ fill: G[600] }} />
              <Line yAxisId="right" type="monotone" dataKey="fees" stroke="#F59E0B" strokeWidth={2} name="Fees (₹)" dot={{ fill: '#F59E0B' }} />
              <Line yAxisId="left" type="monotone" dataKey="complaints" stroke="#EF4444" strokeWidth={2} name="Complaints" dot={{ fill: '#EF4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

      </Container>
    </AdminLayout>
  );
};

export default AdminDashboard;