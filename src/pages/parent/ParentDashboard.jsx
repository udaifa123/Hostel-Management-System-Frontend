import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  CircularProgress,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  ReportProblem as ComplaintIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import parentService from '../../services/parentService';
import ParentLayout from '../../components/Layout/ParentLayout';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────
   Green Design Tokens (Same as ParentAttendance)
───────────────────────────────────────────── */
const G = {
  900: '#064e3b',
  800: '#065f46',
  700: '#047857',
  600: '#059669',
  500: '#10b981',
  400: '#34d399',
  300: '#6ee7b7',
  100: '#d1fae5',
  50: '#ecfdf5',
};

/* ─────────────────────────────────────────────
   Helper – colour map per attendance state
───────────────────────────────────────────── */
const attendanceDisplay = (state) => {
  const map = {
    present: { label: 'Present', color: G[600], bg: '#d1fae5' },
    absent: { label: 'Absent', color: '#ef4444', bg: '#fee2e2' },
  };
  return map[state] ?? { label: 'Not Marked', color: '#f59e0b', bg: '#fef9c3' };
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const ParentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, notifRes] = await Promise.all([
        parentService.getDashboard(),
        parentService.getNotifications(),
      ]);
      setDashboardData(dashboardRes.data);
      setUnreadCount(notifRes.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ParentLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f0fdf4' }}>
          <CircularProgress sx={{ color: G[600] }} thickness={5} />
        </Box>
      </ParentLayout>
    );
  }

  const attInfo = attendanceDisplay(dashboardData?.todayAttendance);

  const stats = [
    {
      label: "Today's Attendance",
      value: attInfo.label,
      color: attInfo.color,
      bg: attInfo.bg,
      icon: <CalendarIcon sx={{ fontSize: 20, color: attInfo.color }} />,
    },
    {
      label: 'Pending Leaves',
      value: dashboardData?.pendingLeaves || 0,
      color: dashboardData?.pendingLeaves > 0 ? '#f59e0b' : G[600],
      bg: dashboardData?.pendingLeaves > 0 ? '#fef9c3' : '#d1fae5',
      icon: <DescriptionIcon sx={{ fontSize: 20, color: dashboardData?.pendingLeaves > 0 ? '#f59e0b' : G[600] }} />,
    },
    // {
    //   label: 'Active Complaints',
    //   value: dashboardData?.activeComplaints || 0,
    //   color: dashboardData?.activeComplaints > 0 ? '#ef4444' : G[600],
    //   bg: dashboardData?.activeComplaints > 0 ? '#fee2e2' : '#d1fae5',
    //   icon: <ComplaintIcon sx={{ fontSize: 20, color: dashboardData?.activeComplaints > 0 ? '#ef4444' : G[600] }} />,
    // },
    {
      label: 'Notifications',
      value: unreadCount,
      color: unreadCount > 0 ? '#f59e0b' : G[600],
      bg: unreadCount > 0 ? '#fef9c3' : '#d1fae5',
      icon: <NotificationsIcon sx={{ fontSize: 20, color: unreadCount > 0 ? '#f59e0b' : G[600] }} />,
    },
  ];

  const menuItems = [
    { title: 'Student Profile', icon: <PersonIcon />, path: '/parent/profile', color: G[600], bg: '#d1fae5' },
    { title: 'Attendance', icon: <CalendarIcon />, path: '/parent/attendance', color: G[600], bg: '#d1fae5' },
    { title: 'Leave Status', icon: <DescriptionIcon />, path: '/parent/leaves', color: G[600], bg: '#d1fae5' },
    // { title: 'Complaints', icon: <ComplaintIcon />, path: '/parent/complaints', color: G[600], bg: '#d1fae5' },
    { title: 'Fees', icon: <MoneyIcon />, path: '/parent/fees', color: G[600], bg: '#d1fae5' },
    { title: 'Notifications', icon: <NotificationsIcon />, path: '/parent/notifications', color: G[600], bg: '#d1fae5' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0fdf4' }}>
      {/* Header - Same as ParentAttendance */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
          color: 'white',
          py: 2,
          boxShadow: '0 4px 20px rgba(6,95,70,0.2)'
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/parent/dashboard')}
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Parent Dashboard
            </Typography>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: 4 }}>

        {/* ── Welcome Card ── */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: '16px',
            border: '1.5px solid #d1fae5',
            bgcolor: '#fff',
            boxShadow: '0 4px 16px rgba(6,95,70,0.07)'
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
              {user?.name?.charAt(0)?.toUpperCase() || 'P'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" sx={{ color: G[600], letterSpacing: '0.12em', fontSize: '0.7rem', fontWeight: 600 }}>
                Parent Portal
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: G[800], lineHeight: 1.2, mb: 0.5 }}>
                Welcome back, {user?.name?.split(' ')[0] || 'Parent'}
              </Typography>
              {dashboardData?.student && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Chip
                    icon={<PersonIcon sx={{ fontSize: '14px !important' }} />}
                    label={dashboardData.student.name}
                    size="small"
                    sx={{ bgcolor: G[100], color: G[700], fontWeight: 600, fontSize: '0.72rem' }}
                  />
                  <Chip
                    icon={<HomeIcon sx={{ fontSize: '14px !important' }} />}
                    label={`Room ${dashboardData.student.roomNumber || 'N/A'} · ${dashboardData.student.hostelName || 'Hostel'}`}
                    size="small"
                    sx={{ bgcolor: G[100], color: G[700], fontWeight: 600, fontSize: '0.72rem' }}
                  />
                </Box>
              )}
            </Box>
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
              label="Active"
              size="small"
              sx={{ bgcolor: G[100], color: G[600], fontWeight: 600, fontSize: '0.72rem', border: `1px solid ${G[300]}` }}
            />
          </Box>
        </Paper>

        {/* ── Stats Section (Same as ParentAttendance summary cards) ── */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TrendingUpIcon sx={{ color: G[600], fontSize: 20 }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: G[700], letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Overview
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {stats.map((s, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: '16px',
                    border: `1.5px solid ${s.bg}`,
                    bgcolor: s.bg,
                    boxShadow: 'none',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-3px)' }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2.5, '&:last-child': { pb: 2.5 } }}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                      {s.label}
                    </Typography>
                    <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>
                      {s.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ mb: 3.5, borderColor: G[100] }} />

        {/* ── Quick Access Section (Same card style as ParentAttendance) ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SchoolIcon sx={{ color: G[600], fontSize: 20 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: G[700], letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Quick Access
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.title}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: '16px',
                  border: '1.5px solid #d1fae5',
                  bgcolor: '#fff',
                  boxShadow: '0 4px 16px rgba(6,95,70,0.07)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)', borderColor: G[400] }
                }}
                onClick={() => navigate(item.path)}
              >
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: item.bg,
                        color: item.color,
                        width: 50,
                        height: 50,
                        borderRadius: '12px'
                      }}
                    >
                      {React.cloneElement(item.icon, { sx: { fontSize: 26 } })}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af', mt: 0.25 }}>
                        Click to view
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Container>
    </Box>
  );
};

export default ParentDashboard;