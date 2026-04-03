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
  Badge
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
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import parentService from '../../services/parentService';
import ParentLayout from '../../components/Layout/ParentLayout';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────
   Design tokens – edit here to retheme the whole page
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
  50:  '#ecfdf5',
};

const styles = {
  page: {
    minHeight: '100vh',
    background: `linear-gradient(160deg, ${G[50]} 0%, #ffffff 60%, ${G[100]} 100%)`,
    fontFamily: "'DM Sans', 'Nunito', sans-serif",
  },
  welcomeCard: {
    background: `linear-gradient(135deg, ${G[800]} 0%, ${G[600]} 100%)`,
    borderRadius: '20px',
    p: { xs: 3, md: 4 },
    mb: 4,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `0 20px 60px ${G[900]}33`,
    color: '#fff',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -60,
      right: -60,
      width: 220,
      height: 220,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.08)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -40,
      left: '40%',
      width: 160,
      height: 160,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.05)',
    },
  },
  avatar: {
    width: 64,
    height: 64,
    bgcolor: 'rgba(255,255,255,0.25)',
    border: '3px solid rgba(255,255,255,0.6)',
    fontSize: '1.6rem',
    fontWeight: 700,
    backdropFilter: 'blur(8px)',
  },
  statCard: {
    borderRadius: '16px',
    border: `1.5px solid ${G[100]}`,
    background: '#ffffff',
    boxShadow: `0 4px 20px ${G[900]}0d`,
    transition: 'transform 0.25s, box-shadow 0.25s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 12px 32px ${G[900]}1a`,
    },
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.3rem',
  },
  menuCard: {
    borderRadius: '18px',
    border: `1.5px solid ${G[100]}`,
    background: '#ffffff',
    boxShadow: `0 4px 16px ${G[900]}0a`,
    cursor: 'pointer',
    transition: 'all 0.28s cubic-bezier(.4,0,.2,1)',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: `0 18px 40px ${G[900]}22`,
      borderColor: G[400],
    },
  },
  menuIconWrap: {
    width: 54,
    height: 54,
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sectionLabel: {
    fontWeight: 700,
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: G[700],
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
};

/* ─────────────────────────────────────────────
   Helper – colour map per attendance state
───────────────────────────────────────────── */
const attendanceDisplay = (state) => {
  const map = {
    present: { label: 'Present', color: G[600] },
    absent:  { label: 'Absent',  color: '#ef4444' },
  };
  return map[state] ?? { label: 'Not Marked', color: '#f59e0b' };
};

/* ─────────────────────────────────────────────
   Menu items
───────────────────────────────────────────── */
const menuItems = [
  { title: 'Student Profile',  icon: <PersonIcon />,       path: '/parent/profile',       bg: `${G[100]}`, iconColor: G[700] },
  { title: 'Attendance',       icon: <CalendarIcon />,     path: '/parent/attendance',    bg: '#dcfce7',    iconColor: '#16a34a' },
  { title: 'Leave Status',     icon: <DescriptionIcon />,  path: '/parent/leaves',        bg: '#fef9c3',    iconColor: '#ca8a04' },
  { title: 'Complaints',       icon: <ComplaintIcon />,    path: '/parent/complaints',    bg: '#fee2e2',    iconColor: '#dc2626' },
  { title: 'Fees',             icon: <MoneyIcon />,        path: '/parent/fees',          bg: '#d1fae5',    iconColor: G[700]    },
  { title: 'Notifications',    icon: <NotificationsIcon />,path: '/parent/notifications', bg: '#ede9fe',    iconColor: '#7c3aed' },
];

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
const ParentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading]           = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [unreadCount, setUnreadCount]   = useState(0);

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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
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
      bg: `${attInfo.color}15`,
      icon: <CalendarIcon sx={{ fontSize: 20, color: attInfo.color }} />,
    },
    {
      label: 'Pending Leaves',
      value: dashboardData?.pendingLeaves || 0,
      color: dashboardData?.pendingLeaves > 0 ? '#f59e0b' : G[600],
      bg: dashboardData?.pendingLeaves > 0 ? '#fef9c315' : `${G[100]}`,
      icon: <DescriptionIcon sx={{ fontSize: 20, color: dashboardData?.pendingLeaves > 0 ? '#f59e0b' : G[600] }} />,
    },
    {
      label: 'Active Complaints',
      value: dashboardData?.activeComplaints || 0,
      color: dashboardData?.activeComplaints > 0 ? '#ef4444' : G[600],
      bg: dashboardData?.activeComplaints > 0 ? '#fee2e215' : `${G[100]}`,
      icon: <ComplaintIcon sx={{ fontSize: 20, color: dashboardData?.activeComplaints > 0 ? '#ef4444' : G[600] }} />,
    },
    {
      label: 'Unread Notifications',
      value: unreadCount,
      color: G[700],
      bg: G[50],
      icon: <NotificationsIcon sx={{ fontSize: 20, color: G[700] }} />,
    },
  ];

  return (
    <ParentLayout>
      <Box sx={styles.page}>
        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>

          {/* ── Welcome Banner ── */}
          <Paper elevation={0} sx={styles.welcomeCard}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, position: 'relative', zIndex: 1 }}>
              <Avatar sx={styles.avatar}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="overline" sx={{ color: G[300], letterSpacing: '0.12em', fontSize: '0.7rem' }}>
                  Parent Portal
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.2, mb: 0.5 }}>
                  Welcome back, {user?.name}
                </Typography>
                {dashboardData?.student && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<PersonIcon sx={{ fontSize: '14px !important', color: `${G[200]} !important` }} />}
                      label={dashboardData.student.name}
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: '0.72rem', backdropFilter: 'blur(4px)' }}
                    />
                    <Chip
                      icon={<HomeIcon sx={{ fontSize: '14px !important', color: `${G[200]} !important` }} />}
                      label={`Room ${dashboardData.student.roomNumber} · ${dashboardData.student.hostelName}`}
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: '0.72rem', backdropFilter: 'blur(4px)' }}
                    />
                  </Box>
                )}
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5, bgcolor: 'rgba(255,255,255,0.15)', px: 2, py: 1, borderRadius: '10px', backdropFilter: 'blur(8px)' }}>
                <CheckCircleIcon sx={{ color: G[300], fontSize: 18 }} />
                <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>Active</Typography>
              </Box>
            </Box>
          </Paper>

          {/* ── Stats ── */}
          <Box sx={styles.sectionLabel}>
            <TrendingUpIcon sx={{ fontSize: 16 }} />
            Overview
          </Box>

          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {stats.map((s) => (
              <Grid item xs={12} sm={6} md={3} key={s.label}>
                <Card elevation={0} sx={styles.statCard}>
                  <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography sx={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600 }}>
                        {s.label}
                      </Typography>
                      <Box sx={{ ...styles.statIcon, bgcolor: s.bg }}>
                        {s.icon}
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: '1.7rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>
                      {s.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ mb: 3.5, borderColor: G[100] }} />

          {/* ── Quick Access ── */}
          <Box sx={styles.sectionLabel}>
            Quick Access
          </Box>

          <Grid container spacing={2.5}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.title}>
                <Card elevation={0} sx={styles.menuCard} onClick={() => navigate(item.path)}>
                  <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ ...styles.menuIconWrap, bgcolor: item.bg }}>
                        {React.cloneElement(item.icon, { sx: { color: item.iconColor, fontSize: 26 } })}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.97rem', color: '#111827', lineHeight: 1.2 }}>
                          {item.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 0.3 }}>
                          Tap to open
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
    </ParentLayout>
  );
};

export default ParentDashboard;