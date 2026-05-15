import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  IconButton,
  Badge,
  Snackbar
} from '@mui/material';
import {
  Message as MessageIcon,
  Visibility as VisitIcon,
  Notifications as NotifIcon,
  ExitToApp as LeaveIcon,
  Payment as PaymentIcon,
  ReportProblem as ComplaintIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { format, formatDistance } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';


const T = {
  navy:    '#f3f8f5',
  navyMid: '#eaf2ed',
  navyCard:'#ffffff',
  border:  'rgba(5,150,105,0.12)',
  gold:    '#047857',
  goldLt:  '#059669',
  slate:   '#4a7060',
  white:   '#0c1a12',
  blue:    '#0284c7',
  teal:    '#0d9488',
  rose:    '#e05c7a',
  violet:  '#7c3aed',
  amber:   '#d97706',
  emerald: '#059669',
  red:     '#ef4444',
  fontPrimary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSecondary: "'SF Pro Display', 'Inter', 'Segoe UI', sans-serif",
  fontMono: "'SF Mono', 'Fira Code', monospace",
  heroGrad: 'linear-gradient(135deg, #eaf2ed 0%, #d1ede0 100%)',
  goldLine: 'linear-gradient(90deg, #047857, #059669)',
  barGrad:  'linear-gradient(90deg, #047857 0%, #34d399 100%)',
};


const Heading1 = ({ children, sx = {}, ...props }) => (
  <Typography sx={{ fontFamily: T.fontSecondary, fontSize: { xs: '1.8rem', md: '2.2rem' }, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, color: T.white, ...sx }} {...props}>
    {children}
  </Typography>
);

const Heading2 = ({ children, sx = {}, ...props }) => (
  <Typography sx={{ fontFamily: T.fontSecondary, fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3, color: T.white, ...sx }} {...props}>
    {children}
  </Typography>
);

const Heading3 = ({ children, sx = {}, ...props }) => (
  <Typography sx={{ fontFamily: T.fontSecondary, fontSize: { xs: '1.2rem', md: '1.3rem' }, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.4, color: T.white, ...sx }} {...props}>
    {children}
  </Typography>
);

const BodyText = ({ children, sx = {}, ...props }) => (
  <Typography sx={{ fontFamily: T.fontPrimary, fontSize: '0.95rem', fontWeight: 400, lineHeight: 1.6, color: T.slate, ...sx }} {...props}>
    {children}
  </Typography>
);

const SmallText = ({ children, sx = {}, ...props }) => (
  <Typography sx={{ fontFamily: T.fontPrimary, fontSize: '0.8rem', fontWeight: 400, lineHeight: 1.5, color: T.slate, ...sx }} {...props}>
    {children}
  </Typography>
);

const CaptionText = ({ children, sx = {}, ...props }) => (
  <Typography sx={{ fontFamily: T.fontPrimary, fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase', color: T.slate + 'cc', ...sx }} {...props}>
    {children}
  </Typography>
);

const StatNumber = ({ children, sx = {}, ...props }) => (
  <Typography sx={{ fontFamily: T.fontSecondary, fontSize: { xs: '2.5rem', md: '3rem' }, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, ...sx }} {...props}>
    {children}
  </Typography>
);

const PriceText = ({ children, sx = {}, ...props }) => (
  <Typography sx={{ fontFamily: T.fontMono, fontSize: '1.8rem', fontWeight: 600, letterSpacing: '-0.02em', ...sx }} {...props}>
    {children}
  </Typography>
);

const SectionLabel = ({ children }) => (
  <CaptionText sx={{ color: T.gold, fontWeight: 600, mb: 0.5 }}>{children}</CaptionText>
);

const GlassCard = ({ children, sx = {}, ...props }) => (
  <Paper elevation={0} sx={{ background: T.navyCard, border: `1px solid ${T.border}`, borderRadius: '16px', backdropFilter: 'blur(12px)', boxShadow: '0 1px 4px rgba(5,150,105,0.06), 0 4px 16px rgba(5,150,105,0.06)', ...sx }} {...props}>
    {children}
  </Paper>
);

const GoldDivider = () => <Box sx={{ height: '1px', background: T.goldLine, opacity: 0.3, my: 2 }} />;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      studentName: '',
      roomNumber: '',
      hostelName: '',
      semester: '',
      unreadMessages: 0,
      pendingVisits: 0,
      unreadNotifications: 0,
      pendingLeaves: 0,
      totalFees: 0,
      paidFees: 0,
      dueFees: 0,
      feePaymentPercentage: 0
    },
    notifications: [],
    leaves: [],
    complaints: [],
    visits: []
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Fetching student dashboard data...');
      
      const token = localStorage.getItem('token');
      
      
      const statsResponse = await fetch(`${API_URL}/student/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let statsData = await statsResponse.json();
      console.log('✅ Dashboard stats:', statsData);
      
      const notifResponse = await fetch(`${API_URL}/student/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let notificationsList = [];
      const notifData = await notifResponse.json();
      if (Array.isArray(notifData)) {
        notificationsList = notifData;
      } else if (notifData?.data && Array.isArray(notifData.data)) {
        notificationsList = notifData.data;
      } else if (notifData?.notifications && Array.isArray(notifData.notifications)) {
        notificationsList = notifData.notifications;
      }
      
   
      const leavesResponse = await fetch(`${API_URL}/student/leaves`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let leavesList = [];
      const leavesData = await leavesResponse.json();
      if (Array.isArray(leavesData)) {
        leavesList = leavesData;
      } else if (leavesData?.data && Array.isArray(leavesData.data)) {
        leavesList = leavesData.data;
      }
      
     
      const complaintsResponse = await fetch(`${API_URL}/student/complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let complaintsList = [];
      const complaintsData = await complaintsResponse.json();
      if (Array.isArray(complaintsData)) {
        complaintsList = complaintsData;
      } else if (complaintsData?.data && Array.isArray(complaintsData.data)) {
        complaintsList = complaintsData.data;
      }
      
      
      const visitsResponse = await fetch(`${API_URL}/student/visits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let visitsList = [];
      const visitsData = await visitsResponse.json();
      if (Array.isArray(visitsData)) {
        visitsList = visitsData;
      } else if (visitsData?.data && Array.isArray(visitsData.data)) {
        visitsList = visitsData.data;
      }
      
      
      const pendingVisitsCount = visitsList.filter(v => v.status === 'pending').length;
      
     
      const stats = statsData?.data || statsData || {};
      
      setDashboardData({
        stats: {
          studentName: stats.studentName || user?.name || 'Student',
          roomNumber: stats.roomNumber || stats.roomNo || 'N/A',
          hostelName: stats.hostelName || 'N/A',
          semester: stats.semester || 1,
          unreadMessages: stats.unreadMessages || 0,
          pendingVisits: pendingVisitsCount,
          unreadNotifications: notificationsList.filter(n => !n.isRead).length,
          pendingLeaves: leavesList.filter(l => l.status === 'pending').length,
          totalFees: stats.totalFees || 0,
          paidFees: stats.paidFees || 0,
          dueFees: stats.dueFees || 0,
          feePaymentPercentage: stats.feePaymentPercentage || 0
        },
        notifications: notificationsList.slice(0, 5),
        leaves: leavesList.slice(0, 5),
        complaints: complaintsList.slice(0, 5),
        visits: visitsList.slice(0, 5)
      });
      
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error);
      setError('Failed to load dashboard data. Please try again.');
      showSnackbar('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnack = () => setSnackbar(s => ({ ...s, open: false }));

  const getStatusColor = (status) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'approved': case 'resolved': case 'paid': case 'completed': return 'success';
      case 'pending': case 'in-progress': return 'warning';
      case 'rejected': case 'cancelled': case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const getStatusHex = (status) => {
    switch (getStatusColor(status)) {
      case 'success': return T.emerald;
      case 'warning': return T.amber;
      case 'error': return T.red;
      default: return T.slate;
    }
  };

  const getNotifColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'warning': return T.amber;
      case 'error': return T.red;
      case 'success': return T.emerald;
      default: return T.blue;
    }
  };

  const getNotifIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'warning': return <WarningIcon />;
      case 'error': return <ErrorIcon />;
      case 'success': return <CheckCircleIcon />;
      default: return <InfoIcon />;
    }
  };

  if (loading && !refreshing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: T.navy }}>
        <Box textAlign="center">
          <CircularProgress size={48} thickness={2} sx={{ color: T.gold }} />
          <BodyText sx={{ mt: 2, color: T.slate, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Loading Dashboard</BodyText>
        </Box>
      </Box>
    );
  }

  const stats = dashboardData.stats;
  const recentNotifications = dashboardData.notifications || [];
  const recentLeaves = dashboardData.leaves || [];
  const recentComplaints = dashboardData.complaints || [];

  const statCards = [
    { title: 'Unread Messages', value: stats.unreadMessages || 0, icon: <MessageIcon />, color: T.blue, path: '/student/chat' },
    { title: 'Pending Visits', value: stats.pendingVisits || 0, icon: <VisitIcon />, color: T.amber, path: '/student/visits' },
    { title: 'Notifications', value: stats.unreadNotifications || 0, icon: <NotifIcon />, color: T.rose, path: '/student/notifications' },
    { title: 'Pending Leaves', value: stats.pendingLeaves || 0, icon: <LeaveIcon />, color: T.emerald, path: '/student/leaves' },
  ];

  const quickActions = [
    { label: 'Apply Leave', icon: <LeaveIcon />, path: '/student/leaves', bg: T.emerald },
    { label: 'Attendance', icon: <CalendarIcon />, path: '/student/attendance', bg: T.blue },
    { label: 'Complaint', icon: <ComplaintIcon />, path: '/student/complaints', bg: T.amber },
    { label: 'Pay Fees', icon: <PaymentIcon />, path: '/student/fees', bg: T.violet },
    { label: 'Chat', icon: <MessageIcon />, path: '/student/chat', bg: T.rose },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: T.navy, p: { xs: 2, sm: 3, md: 4 }, fontFamily: T.fontPrimary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .fade-up-1 { animation-delay: 0.05s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.10s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.15s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.20s; opacity: 0; }
        .fade-up-5 { animation-delay: 0.25s; opacity: 0; }
        .stat-card:hover { transform: translateY(-4px) !important; }
      `}</style>

    
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} className="fade-up fade-up-1">
        <Box>
          <SectionLabel>Hostel Management System</SectionLabel>
          <Heading1>Student Dashboard</Heading1>
        </Box>
        <IconButton onClick={handleRefresh} disabled={refreshing} sx={{ width: 42, height: 42, border: `1px solid ${T.border}`, background: T.navyCard, color: T.slate, '&:hover': { borderColor: T.gold, color: T.gold }, transition: 'all 0.25s' }}>
          <RefreshIcon sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none', fontSize: 18 }} />
        </IconButton>
      </Box>

      
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2, bgcolor: 'rgba(239,68,68,0.07)', color: '#7f1d1d', border: '1px solid rgba(239,68,68,0.2)' }} onClose={() => setError(null)} action={<Button color="inherit" size="small" onClick={fetchDashboardData}>Retry</Button>}>
          <BodyText>{error}</BodyText>
        </Alert>
      )}

      
      <GlassCard className="fade-up fade-up-1" sx={{ p: { xs: 3, md: 4 }, mb: 4, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #eaf2ed 0%, #d4ede1 60%, #f3f8f5 100%)', borderColor: 'rgba(5,150,105,0.2)' }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: T.goldLine }} />
        <Box sx={{ position: 'absolute', top: '-60px', right: '-60px', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,150,105,0.10) 0%, transparent 70%)' }} />
        <Box sx={{ position: 'absolute', bottom: '-40px', left: '-40px', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)' }} />

        <Grid container spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item>
            <Avatar sx={{ width: 72, height: 72, background: 'linear-gradient(135deg, #047857, #059669)', border: '2px solid rgba(5,150,105,0.3)', boxShadow: '0 0 0 4px rgba(5,150,105,0.10)' }}>
              <PersonIcon sx={{ fontSize: 36, color: '#ffffff' }} />
            </Avatar>
          </Grid>
          <Grid item xs>
            <SectionLabel>Welcome back</SectionLabel>
            <Heading2 sx={{ mb: 1.5 }}>{stats.studentName || user?.name || 'Student'}</Heading2>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {[
                `Room: ${stats.roomNumber || 'N/A'}`,
                `Hostel: ${stats.hostelName || 'N/A'}`,
                `Semester: ${stats.semester || 'N/A'}`,
                format(new Date(), 'EEEE, MMM d'),
              ].map((label, i) => (
                <Chip key={i} label={label} size="small" sx={{ bgcolor: 'rgba(5,150,105,0.08)', color: '#047857', border: `1px solid rgba(5,150,105,0.20)`, fontWeight: 500, fontSize: '0.75rem', height: 26 }} />
              ))}
            </Box>
          </Grid>
        </Grid>
      </GlassCard>

     
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {statCards.map((card, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <GlassCard className={`stat-card fade-up fade-up-${i + 2}`} onClick={() => navigate(card.path)} sx={{ p: 3, cursor: 'pointer', transition: 'all 0.3s ease', '&:hover': { borderColor: card.color + '55', boxShadow: `0 8px 32px ${card.color}22` } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <CaptionText sx={{ color: T.slate, mb: 1 }}>{card.title}</CaptionText>
                  <StatNumber sx={{ color: card.color }}>{card.value}</StatNumber>
                </Box>
                <Box sx={{ width: 46, height: 46, borderRadius: '12px', background: card.color + '18', border: `1px solid ${card.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                  {card.icon}
                </Box>
              </Box>
              <Box sx={{ mt: 2, height: 2, borderRadius: 1, background: T.border }}>
                <Box sx={{ width: `${Math.min(card.value * 10, 100)}%`, height: '100%', borderRadius: 1, background: card.color, transition: 'width 1s ease' }} />
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      {/* Fee Overview */}
      {/* <GlassCard className="fade-up fade-up-3" sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
        <SectionLabel>Financial Overview</SectionLabel>
        <Heading3 sx={{ mb: 3 }}>Fee Status</Heading3>
        <Grid container spacing={4} sx={{ mb: 3 }}>
          {[
            { label: 'Total Fees', value: stats.totalFees || 0, color: T.blue },
            { label: 'Amount Paid', value: stats.paidFees || 0, color: T.emerald },
            { label: 'Amount Due', value: stats.dueFees || 0, color: T.rose },
          ].map((f, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Box sx={{ p: 2.5, borderRadius: '12px', background: f.color + '0F', border: `1px solid ${f.color}22`, textAlign: 'center' }}>
                <PriceText sx={{ color: f.color }}>₹{f.value.toLocaleString()}</PriceText>
                <CaptionText sx={{ mt: 0.5 }}>{f.label}</CaptionText>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <SmallText>Payment Progress</SmallText>
          <SmallText sx={{ fontWeight: 600, color: T.goldLt }}>{stats.feePaymentPercentage || 0}%</SmallText>
        </Box>
        <Box sx={{ height: 6, borderRadius: 3, bgcolor: T.border, overflow: 'hidden' }}>
          <Box sx={{ height: '100%', borderRadius: 3, width: `${stats.feePaymentPercentage || 0}%`, background: T.barGrad, transition: 'width 1s ease' }} />
        </Box>
      </GlassCard> */}

      
      <Grid container spacing={3} sx={{ mb: 4 }}>
     
        <Grid item xs={12} md={4}>
          <ActivityPanel
            title="Notifications"
            icon={<NotifIcon />}
            badge={stats.unreadNotifications}
            onViewAll={() => navigate('/student/notifications')}
            btnLabel="View All"
            empty={recentNotifications.length === 0}
            emptyIcon={<NotifIcon sx={{ fontSize: 36, color: T.slate }} />}
            emptyText="No new notifications"
          >
            {recentNotifications.map((n, i) => (
              <ActivityItem
                key={n._id || i}
                onClick={() => navigate('/student/notifications')}
                avatarColor={getNotifColor(n.type)}
                avatarIcon={getNotifIcon(n.type)}
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <BodyText sx={{ fontWeight: 600, color: T.white }}>{n.title || 'Notification'}</BodyText>
                    {!n.isRead && <StatusDot color={T.blue} />}
                  </Box>
                }
                secondary={n.message || n.description || 'No message'}
                meta={n.createdAt ? formatDistance(new Date(n.createdAt), new Date(), { addSuffix: true }) : 'Recently'}
              />
            ))}
          </ActivityPanel>
        </Grid>

       
        <Grid item xs={12} md={4}>
          <ActivityPanel
            title="Leave Applications"
            icon={<LeaveIcon />}
            badge={stats.pendingLeaves}
            onViewAll={() => navigate('/student/leaves')}
            btnLabel="Apply Leave"
            btnIcon={<LeaveIcon />}
            empty={recentLeaves.length === 0}
            emptyIcon={<LeaveIcon sx={{ fontSize: 36, color: T.slate }} />}
            emptyText="No leave applications"
          >
            {recentLeaves.map((l, i) => (
              <ActivityItem
                key={l._id || i}
                onClick={() => navigate('/student/leaves')}
                avatarColor={getStatusHex(l.status)}
                avatarIcon={<LeaveIcon />}
                primary={
                  <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                    <BodyText sx={{ fontWeight: 600, color: T.white }}>
                      {l.fromDate && l.toDate
                        ? `${format(new Date(l.fromDate), 'dd MMM')} – ${format(new Date(l.toDate), 'dd MMM')}`
                        : 'Leave Application'}
                    </BodyText>
                    <StatusBadge status={l.status} />
                  </Box>
                }
                secondary={l.reason || 'No reason provided'}
                meta={null}
              />
            ))}
          </ActivityPanel>
        </Grid>

      
        <Grid item xs={12} md={4}>
          <ActivityPanel
            title="Complaints"
            icon={<ComplaintIcon />}
            badge={stats.pendingComplaints || 0}
            onViewAll={() => navigate('/student/complaints')}
            btnLabel="Raise Complaint"
            btnIcon={<ComplaintIcon />}
            empty={recentComplaints.length === 0}
            emptyIcon={<ComplaintIcon sx={{ fontSize: 36, color: T.slate }} />}
            emptyText="No complaints filed"
          >
            {recentComplaints.map((c, i) => (
              <ActivityItem
                key={c._id || i}
                onClick={() => navigate('/student/complaints')}
                avatarColor={getStatusHex(c.status)}
                avatarIcon={<ComplaintIcon />}
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <BodyText sx={{ fontWeight: 600, color: T.white }}>{c.title || 'Complaint'}</BodyText>
                    <StatusBadge status={c.status} />
                  </Box>
                }
                secondary={c.description || 'No description'}
                meta={c.createdAt ? format(new Date(c.createdAt), 'dd MMM') : 'Recently'}
              />
            ))}
          </ActivityPanel>
        </Grid>
      </Grid>

     
      <GlassCard className="fade-up fade-up-5" sx={{ p: { xs: 3, md: 4 } }}>
        <SectionLabel>Quick Actions</SectionLabel>
        <Heading3 sx={{ mb: 3 }}>Common Tasks</Heading3>
        <Grid container spacing={2}>
          {quickActions.map((a, i) => (
            <Grid item xs={6} sm={4} md={2.4} key={i}>
              <Button fullWidth onClick={() => navigate(a.path)} startIcon={a.icon} sx={{ py: 1.6, borderRadius: '10px', background: a.bg + '18', color: a.bg, border: `1px solid ${a.bg}30`, fontWeight: 600, fontSize: '0.85rem', fontFamily: T.fontPrimary, letterSpacing: '0.02em', transition: 'all 0.25s', '&:hover': { background: a.bg + '30', borderColor: a.bg + '70', transform: 'translateY(-2px)', boxShadow: `0 6px 20px ${a.bg}25` } }}>
                {a.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </GlassCard>

     
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnack} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnack} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          <BodyText>{snackbar.message}</BodyText>
        </Alert>
      </Snackbar>
    </Box>
  );
};


const StatusDot = ({ color }) => <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />;

const StatusBadge = ({ status }) => {
  const map = {
    approved: { bg: T.emerald + '20', color: T.emerald, border: T.emerald + '40' },
    resolved: { bg: T.emerald + '20', color: T.emerald, border: T.emerald + '40' },
    completed: { bg: T.emerald + '20', color: T.emerald, border: T.emerald + '40' },
    pending: { bg: T.amber + '20', color: T.amber, border: T.amber + '40' },
    'in-progress': { bg: T.amber + '20', color: T.amber, border: T.amber + '40' },
    rejected: { bg: T.red + '20', color: T.red, border: T.red + '40' },
    cancelled: { bg: T.red + '20', color: T.red, border: T.red + '40' },
  };
  const s = map[(status || 'pending').toLowerCase()] || { bg: T.slate + '20', color: T.slate, border: T.slate + '40' };
  return (
    <Box component="span" sx={{ px: 1, py: 0.2, borderRadius: '4px', background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: '0.7rem', fontWeight: 600, fontFamily: T.fontPrimary, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
      {status || 'pending'}
    </Box>
  );
};

const ActivityPanel = ({ title, icon, badge, onViewAll, btnLabel, btnIcon, empty, emptyIcon, emptyText, children }) => (
  <GlassCard sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
      <Heading3 sx={{ fontSize: '1.1rem' }}>{title}</Heading3>
      <Badge badgeContent={badge} color="warning" sx={{ '& .MuiBadge-badge': { background: T.gold, color: '#ffffff', fontWeight: 700, fontSize: '0.7rem' } }}>
        <Box sx={{ color: T.slate }}>{icon}</Box>
      </Badge>
    </Box>
    <GoldDivider />
    {empty ? (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flex={1} py={4} gap={1}>
        {emptyIcon}
        <SmallText>{emptyText}</SmallText>
      </Box>
    ) : (
      <List sx={{ p: 0, flex: 1 }}>{children}</List>
    )}
    <Button fullWidth onClick={onViewAll} startIcon={btnIcon} sx={{ mt: 2, py: 1.2, borderRadius: '8px', border: `1px solid ${T.border}`, color: T.goldLt, fontSize: '0.85rem', fontWeight: 600, fontFamily: T.fontPrimary, '&:hover': { background: 'rgba(5,150,105,0.08)', borderColor: 'rgba(5,150,105,0.35)' }, transition: 'all 0.2s' }}>
      {btnLabel}
    </Button>
  </GlassCard>
);

const ActivityItem = ({ onClick, avatarColor, avatarIcon, primary, secondary, meta }) => (
  <ListItem button onClick={onClick} sx={{ px: 1.5, py: 1.2, borderRadius: '8px', mb: 0.5, '&:hover': { background: 'rgba(5,150,105,0.05)' }, transition: 'background 0.2s' }}>
    <ListItemAvatar sx={{ minWidth: 44 }}>
      <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: avatarColor + '20', border: `1px solid ${avatarColor}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: avatarColor, '& svg': { fontSize: 17 } }}>
        {avatarIcon}
      </Box>
    </ListItemAvatar>
    <ListItemText
      primary={primary}
      secondary={
        <Box>
          <SmallText sx={{ mt: 0.2, color: T.slate, fontSize: '0.8rem' }}>{secondary}</SmallText>
          {meta && <CaptionText sx={{ color: T.slate + 'aa', fontSize: '0.65rem' }}>{meta}</CaptionText>}
        </Box>
      }
      sx={{ m: 0 }}
    />
  </ListItem>
);

export default StudentDashboard;