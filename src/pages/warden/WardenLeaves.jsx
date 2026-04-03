import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
  alpha,
  useTheme,
  Menu,
  ListItemIcon,
  ListItemText,
  TablePagination,
  InputAdornment,
  LinearProgress,
  Zoom,
  Fade
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  DateRange as DateRangeIcon,
  Person as PersonIcon,
  Room as RoomIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  Refresh as RefreshIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  AccessTime as AccessTimeIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  MoreVert as MoreVertIcon,
  History as HistoryIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { format, parseISO } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// ==================== Constants ====================
const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

const LEAVE_STATUS_CONFIG = {
  [LEAVE_STATUS.PENDING]: {
    label: 'Pending',
    color: '#f97316',
    bg: '#fff7ed',
    icon: <AccessTimeIcon />,
    priority: 1
  },
  [LEAVE_STATUS.APPROVED]: {
    label: 'Approved',
    color: '#10b981',
    bg: '#ecfdf5',
    icon: <ApproveIcon />,
    priority: 2
  },
  [LEAVE_STATUS.REJECTED]: {
    label: 'Rejected',
    color: '#ef4444',
    bg: '#fef2f2',
    icon: <RejectIcon />,
    priority: 3
  },
  [LEAVE_STATUS.CANCELLED]: {
    label: 'Cancelled',
    color: '#6b7280',
    bg: '#f3f4f6',
    icon: <CancelIcon />,
    priority: 4
  }
};

const LEAVE_TYPES = {
  casual: { label: 'Casual Leave', color: '#3b82f6' },
  medical: { label: 'Medical Leave', color: '#10b981' },
  emergency: { label: 'Emergency', color: '#ef4444' },
  vacation: { label: 'Vacation', color: '#8b5cf6' },
  other: { label: 'Other', color: '#6b7280' }
};

// ==================== Styled Components ====================
const StatusChip = ({ status, size = 'small' }) => {
  const config = LEAVE_STATUS_CONFIG[status] || LEAVE_STATUS_CONFIG[LEAVE_STATUS.PENDING];
  
  return (
    <Chip
      label={config.label}
      size={size}
      icon={config.icon}
      sx={{
        bgcolor: config.bg,
        color: config.color,
        fontWeight: 600,
        border: `1px solid ${alpha(config.color, 0.2)}`,
        '& .MuiChip-icon': {
          color: config.color
        }
      }}
    />
  );
};

// ==================== Main Component ====================
const WardenLeaves = () => {
  const theme = useTheme();
  const { token } = useAuth();
  
  // ==================== State Management ====================
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuLeave, setMenuLeave] = useState(null);
  
  // Filters
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0
  });

  // ==================== Helper Functions ====================
  const calculateDays = (from, to) => {
    if (!from || !to) return 1;
    try {
      const start = new Date(from);
      const end = new Date(to);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    } catch {
      return 1;
    }
  };

  const calculateStats = (leavesArray) => {
    const newStats = leavesArray.reduce((acc, leave) => {
      acc.total++;
      acc[leave.status]++;
      return acc;
    }, {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0
    });

    setStats(newStats);
  };

  // ==================== Fetch Leaves ====================
  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching all leave requests...');
      
      const response = await axios.get(`${API_URL}/leaves`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Leaves response:', response.data);

      const leavesData = response.data.data || response.data.leaves || response.data;
      
      if (Array.isArray(leavesData)) {
        const transformedLeaves = leavesData.map(leave => {
          // Safely extract student information
          const student = leave.student || {};
          const user = student.user || {};
          
          return {
            id: leave._id,
            _id: leave._id,
            leaveNumber: leave.leaveNumber || 'N/A',
            
            // Student information - properly traversed
            studentId: student._id,
            studentName: user.name || student.name || 'Unknown Student',
            studentEmail: user.email || student.email || '',
            
            // Academic info
            rollNo: student.rollNumber || student.registrationNumber || 'N/A',
            room: student.room?.roomNumber || 'Not Assigned',
            block: student.room?.block || '',
            
            // Leave details
            type: leave.type || 'casual',
            reason: leave.reason || '',
            fromDate: leave.fromDate,
            toDate: leave.toDate,
            days: leave.totalDays || calculateDays(leave.fromDate, leave.toDate),
            status: leave.status || 'pending',
            appliedOn: leave.createdAt || leave.appliedOn,
            
            // Additional info
            destination: leave.destination || '',
            emergencyContact: leave.emergencyContact || {
              name: leave.emergencyContact?.name || '',
              phone: leave.emergencyContact?.phone || '',
              relationship: leave.emergencyContact?.relationship || ''
            },
            
            // Documents and approvals
            documents: leave.documents || [],
            parentApproval: leave.parentApproval || null,
            wardenApproval: leave.wardenApproval || null,
            
            // Timestamps
            createdAt: leave.createdAt,
            updatedAt: leave.updatedAt
          };
        });

        console.log('✅ Transformed leaves:', transformedLeaves);
        setLeaves(transformedLeaves);
        calculateStats(transformedLeaves);
      }
    } catch (error) {
      console.error('❌ Error fetching leaves:', error);
      showSnackbar(error.response?.data?.message || 'Failed to load leave requests', 'error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchLeaves();
    }
  }, [token, fetchLeaves]);

  // ==================== Filtering ====================
  useEffect(() => {
    let filtered = [...leaves];

    // Tab filter
    if (tabValue === 1) {
      filtered = filtered.filter(l => l.status === LEAVE_STATUS.PENDING);
    } else if (tabValue === 2) {
      filtered = filtered.filter(l => l.status === LEAVE_STATUS.APPROVED);
    } else if (tabValue === 3) {
      filtered = filtered.filter(l => l.status === LEAVE_STATUS.REJECTED);
    } else if (tabValue === 4) {
      filtered = filtered.filter(l => l.status === LEAVE_STATUS.CANCELLED);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(l =>
        l.studentName?.toLowerCase().includes(term) ||
        l.rollNo?.toLowerCase().includes(term) ||
        l.room?.toLowerCase().includes(term) ||
        l.reason?.toLowerCase().includes(term) ||
        l.leaveNumber?.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(l => l.type === typeFilter);
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      filtered = filtered.filter(l => {
        const applied = new Date(l.appliedOn);
        return applied >= start && applied <= end;
      });
    }

    setFilteredLeaves(filtered);
    setPage(0);
  }, [leaves, tabValue, searchTerm, typeFilter, dateRange]);

  // ==================== Handlers ====================
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleMenuOpen = (event, leave) => {
    setAnchorEl(event.currentTarget);
    setMenuLeave(leave);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuLeave(null);
  };

  const handleApprove = async (leave) => {
    try {
      setLoading(true);
      console.log(`✅ Approving leave: ${leave.id}`);
      
      const response = await axios.put(
        `${API_URL}/leaves/${leave.id}/approve`,
        { remarks: 'Approved by warden' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Approve response:', response.data);

      // Update local state
      const updatedLeaves = leaves.map(l => 
        l.id === leave.id 
          ? { 
              ...l, 
              status: LEAVE_STATUS.APPROVED,
              wardenApproval: {
                status: 'approved',
                remarks: 'Approved by warden',
                approvedBy: 'Warden',
                approvedAt: new Date().toISOString()
              }
            } 
          : l
      );

      setLeaves(updatedLeaves);
      calculateStats(updatedLeaves);
      showSnackbar(`Leave request approved for ${leave.studentName}`, 'success');
      
    } catch (error) {
      console.error('❌ Error approving leave:', error);
      showSnackbar(error.response?.data?.message || 'Failed to approve leave', 'error');
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      showSnackbar('Please provide a rejection reason', 'error');
      return;
    }

    try {
      setLoading(true);
      console.log(`❌ Rejecting leave: ${selectedLeave.id}`);
      
      const response = await axios.put(
        `${API_URL}/leaves/${selectedLeave.id}/reject`,
        { remarks: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Reject response:', response.data);

      // Update local state
      const updatedLeaves = leaves.map(l => 
        l.id === selectedLeave.id 
          ? { 
              ...l, 
              status: LEAVE_STATUS.REJECTED,
              wardenApproval: {
                status: 'rejected',
                remarks: rejectReason,
                approvedBy: 'Warden',
                approvedAt: new Date().toISOString()
              }
            } 
          : l
      );

      setLeaves(updatedLeaves);
      calculateStats(updatedLeaves);
      showSnackbar(`Leave request rejected for ${selectedLeave.studentName}`, 'info');
      
      setOpenRejectDialog(false);
      setRejectReason('');
      setSelectedLeave(null);
      
    } catch (error) {
      console.error('❌ Error rejecting leave:', error);
      showSnackbar(error.response?.data?.message || 'Failed to reject leave', 'error');
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    setOpenViewDialog(true);
    handleMenuClose();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setDateRange({ start: '', end: '' });
    setTabValue(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'dd MMM yyyy');
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'dd MMM yyyy, hh:mm a');
    } catch {
      return dateString;
    }
  };

  // ==================== Pagination ====================
  const paginatedLeaves = filteredLeaves.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // ==================== Render ====================
  if (loading && leaves.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography ml={2}>Loading leave requests...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Leave Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage and process student leave requests
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchLeaves}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 2, bgcolor: alpha('#3b82f6', 0.1) }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total</Typography>
              <Typography variant="h3" fontWeight="bold" color="#3b82f6">{stats.total}</Typography>
              <LinearProgress 
                variant="determinate" 
                value={100} 
                sx={{ mt: 1, height: 4, borderRadius: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 2, bgcolor: alpha('#f97316', 0.1) }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Pending</Typography>
              <Typography variant="h3" fontWeight="bold" color="#f97316">{stats.pending}</Typography>
              <LinearProgress 
                variant="determinate" 
                value={stats.total > 0 ? (stats.pending / stats.total) * 100 : 0} 
                sx={{ mt: 1, height: 4, borderRadius: 2, bgcolor: alpha('#f97316', 0.2) }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 2, bgcolor: alpha('#10b981', 0.1) }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Approved</Typography>
              <Typography variant="h3" fontWeight="bold" color="#10b981">{stats.approved}</Typography>
              <LinearProgress 
                variant="determinate" 
                value={stats.total > 0 ? (stats.approved / stats.total) * 100 : 0} 
                sx={{ mt: 1, height: 4, borderRadius: 2, bgcolor: alpha('#10b981', 0.2) }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 2, bgcolor: alpha('#ef4444', 0.1) }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Rejected</Typography>
              <Typography variant="h3" fontWeight="bold" color="#ef4444">{stats.rejected}</Typography>
              <LinearProgress 
                variant="determinate" 
                value={stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0} 
                sx={{ mt: 1, height: 4, borderRadius: 2, bgcolor: alpha('#ef4444', 0.2) }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 2, bgcolor: alpha('#6b7280', 0.1) }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Cancelled</Typography>
              <Typography variant="h3" fontWeight="bold" color="#6b7280">{stats.cancelled}</Typography>
              <LinearProgress 
                variant="determinate" 
                value={stats.total > 0 ? (stats.cancelled / stats.total) * 100 : 0} 
                sx={{ mt: 1, height: 4, borderRadius: 2, bgcolor: alpha('#6b7280', 0.2) }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, v) => setTabValue(v)}
          sx={{
            '& .MuiTab-root': { minWidth: 120 },
            '& .Mui-selected': { color: '#10b981' },
            '& .MuiTabs-indicator': { backgroundColor: '#10b981' }
          }}
        >
          <Tab label={<Badge badgeContent={stats.total} color="primary">All</Badge>} />
          <Tab label={<Badge badgeContent={stats.pending} color="warning">Pending</Badge>} />
          <Tab label={<Badge badgeContent={stats.approved} color="success">Approved</Badge>} />
          <Tab label={<Badge badgeContent={stats.rejected} color="error">Rejected</Badge>} />
          <Tab label={<Badge badgeContent={stats.cancelled} color="default">Cancelled</Badge>} />
        </Tabs>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, roll no, room, reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Leave Type</InputLabel>
              <Select
                value={typeFilter}
                label="Leave Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                {Object.entries(LEAVE_TYPES).map(([key, value]) => (
                  <MenuItem key={key} value={key}>{value.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="From"
              InputLabelProps={{ shrink: true }}
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="To"
              InputLabelProps={{ shrink: true }}
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Summary */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body2" color="textSecondary">
          Showing {paginatedLeaves.length} of {filteredLeaves.length} requests
        </Typography>
        <Typography variant="body2" fontWeight="bold" sx={{ color: '#10b981' }}>
          Total Days: {filteredLeaves.reduce((acc, l) => acc + (l.days || 0), 0)}
        </Typography>
      </Box>

      {/* Leave Requests List */}
      {filteredLeaves.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
          <EventIcon sx={{ fontSize: 80, color: '#94a3b8', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="textSecondary">
            No Leave Requests Found
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {searchTerm || typeFilter !== 'all' || dateRange.start || dateRange.end
              ? 'Try adjusting your filters'
              : 'No leave requests have been submitted yet'}
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedLeaves.map((leave) => (
              <Grid item xs={12} key={leave.id}>
                <Zoom in={true} style={{ transitionDelay: `${Math.random() * 100}ms` }}>
                  <Card 
                    sx={{ 
                      borderRadius: 2,
                      borderLeft: `4px solid ${LEAVE_STATUS_CONFIG[leave.status]?.color || '#f97316'}`,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: theme.shadows[4],
                        transform: 'translateY(-2px)'
                      },
                      position: 'relative'
                    }}
                  >
                    <CardContent>
                      <Box position="absolute" top={16} right={16}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, leave)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar 
                              sx={{ 
                                bgcolor: alpha(LEAVE_STATUS_CONFIG[leave.status]?.color || '#f97316', 0.1),
                                color: LEAVE_STATUS_CONFIG[leave.status]?.color || '#f97316',
                                width: 56,
                                height: 56
                              }}
                            >
                              {leave.studentName?.charAt(0) || '?'}
                            </Avatar>
                            <Box>
                              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                                <Typography variant="h6" fontWeight="bold">
                                  {leave.studentName}
                                </Typography>
                                <Chip 
                                  size="small"
                                  label={leave.rollNo}
                                  variant="outlined"
                                />
                                <Chip 
                                  size="small"
                                  label={leave.leaveNumber}
                                  variant="outlined"
                                  sx={{ bgcolor: alpha('#10b981', 0.1), color: '#10b981' }}
                                />
                              </Box>
                              <Box display="flex" gap={2} flexWrap="wrap" mt={0.5}>
                                <Chip 
                                  size="small"
                                  icon={<RoomIcon />}
                                  label={`Room ${leave.room} ${leave.block ? `(${leave.block})` : ''}`}
                                  variant="outlined"
                                />
                                <Chip 
                                  size="small"
                                  icon={<DateRangeIcon />}
                                  label={`${leave.days} ${leave.days === 1 ? 'day' : 'days'}`}
                                  variant="outlined"
                                />
                                <Chip 
                                  size="small"
                                  label={LEAVE_TYPES[leave.type]?.label || leave.type}
                                  sx={{
                                    bgcolor: alpha(LEAVE_TYPES[leave.type]?.color || '#3b82f6', 0.1),
                                    color: LEAVE_TYPES[leave.type]?.color || '#3b82f6',
                                    fontWeight: 500
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>

                          <Box display="flex" gap={4} mb={2} flexWrap="wrap">
                            <Box>
                              <Typography variant="caption" color="textSecondary">
                                From
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {formatDate(leave.fromDate)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="textSecondary">
                                To
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {formatDate(leave.toDate)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="textSecondary">
                                Applied
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {formatDate(leave.appliedOn)}
                              </Typography>
                            </Box>
                          </Box>

                          <Box mb={2}>
                            <Typography variant="caption" color="textSecondary">
                              Reason
                            </Typography>
                            <Typography variant="body2">
                              {leave.reason}
                            </Typography>
                          </Box>

                          {leave.destination && (
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <HomeIcon fontSize="small" sx={{ color: '#64748b' }} />
                              <Typography variant="body2">{leave.destination}</Typography>
                            </Box>
                          )}

                          {leave.emergencyContact?.phone && (
                            <Box display="flex" alignItems="center" gap={1}>
                              <PhoneIcon fontSize="small" sx={{ color: '#64748b' }} />
                              <Typography variant="body2">
                                {leave.emergencyContact.phone}
                                {leave.emergencyContact.name && ` (${leave.emergencyContact.name})`}
                              </Typography>
                            </Box>
                          )}

                          {leave.wardenApproval?.remarks && leave.status !== LEAVE_STATUS.PENDING && (
                            <Alert 
                              severity={leave.status === LEAVE_STATUS.APPROVED ? 'success' : 'error'} 
                              sx={{ mt: 2 }}
                            >
                              <Typography variant="body2">
                                <strong>
                                  {leave.status === LEAVE_STATUS.APPROVED ? 'Approved' : 'Rejected'}:
                                </strong>{' '}
                                {leave.wardenApproval.remarks}
                              </Typography>
                            </Alert>
                          )}
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={2}>
                            <StatusChip status={leave.status} />

                            {leave.status === LEAVE_STATUS.PENDING && (
                              <Box display="flex" gap={1}>
                                <Tooltip title="Approve">
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    startIcon={<ApproveIcon />}
                                    onClick={() => handleApprove(leave)}
                                    disabled={loading}
                                  >
                                    Approve
                                  </Button>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    startIcon={<RejectIcon />}
                                    onClick={() => {
                                      setSelectedLeave(leave);
                                      setOpenRejectDialog(true);
                                    }}
                                    disabled={loading}
                                  >
                                    Reject
                                  </Button>
                                </Tooltip>
                              </Box>
                            )}

                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<ViewIcon />}
                              onClick={() => handleViewDetails(leave)}
                              fullWidth
                            >
                              View Details
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredLeaves.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{ mt: 3 }}
          />
        </>
      )}

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => handleViewDetails(menuLeave)}>
          <ListItemIcon><ViewIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        {menuLeave?.status === LEAVE_STATUS.PENDING && (
          <div>
            <MenuItem onClick={() => handleApprove(menuLeave)}>
              <ListItemIcon><ApproveIcon fontSize="small" color="success" /></ListItemIcon>
              <ListItemText sx={{ color: 'success.main' }}>Approve</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              setSelectedLeave(menuLeave);
              setOpenRejectDialog(true);
              handleMenuClose();
            }}>
              <ListItemIcon><RejectIcon fontSize="small" color="error" /></ListItemIcon>
              <ListItemText sx={{ color: 'error.main' }}>Reject</ListItemText>
            </MenuItem>
          </div>
        )}
      </Menu>

      {/* View Details Dialog */}
      <Dialog 
        open={openViewDialog} 
        onClose={() => setOpenViewDialog(false)} 
        maxWidth="md" 
        fullWidth
        TransitionComponent={Zoom}
      >
        {selectedLeave && (
          <>
            <DialogTitle sx={{ bgcolor: '#f8fafc' }}>
              <Typography variant="h6" fontWeight="bold">
                Leave Request Details
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: '#10b981', width: 64, height: 64 }}>
                      {selectedLeave.studentName?.charAt(0) || '?'}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {selectedLeave.studentName}
                      </Typography>
                      <Box display="flex" gap={2} flexWrap="wrap">
                        <Chip 
                          size="small"
                          label={selectedLeave.rollNo}
                          variant="outlined"
                        />
                        <Chip 
                          size="small"
                          label={`Room ${selectedLeave.room}`}
                          variant="outlined"
                          icon={<RoomIcon />}
                        />
                        <Chip 
                          size="small"
                          label={selectedLeave.leaveNumber}
                          variant="outlined"
                          sx={{ bgcolor: alpha('#10b981', 0.1), color: '#10b981' }}
                        />
                      </Box>
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <EmailIcon fontSize="small" sx={{ color: '#64748b' }} />
                        <Typography variant="body2" color="textSecondary">
                          {selectedLeave.studentEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Leave Type</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {LEAVE_TYPES[selectedLeave.type]?.label || selectedLeave.type}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <StatusChip status={selectedLeave.status} />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">From Date</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatDate(selectedLeave.fromDate)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">To Date</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatDate(selectedLeave.toDate)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Total Days</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedLeave.days} days
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Applied On</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatDateTime(selectedLeave.appliedOn)}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Reason</Typography>
                  <Paper sx={{ p: 2, bgcolor: '#f8fafc', mt: 1 }}>
                    <Typography variant="body2">
                      {selectedLeave.reason}
                    </Typography>
                  </Paper>
                </Grid>

                {selectedLeave.destination && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Destination</Typography>
                    <Typography variant="body1">
                      {selectedLeave.destination}
                    </Typography>
                  </Grid>
                )}

                {selectedLeave.emergencyContact?.name && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Emergency Contact</Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="body1">
                        {selectedLeave.emergencyContact.name} ({selectedLeave.emergencyContact.relationship})
                      </Typography>
                      <Chip
                        icon={<PhoneIcon />}
                        label={selectedLeave.emergencyContact.phone}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Grid>
                )}

                {selectedLeave.documents?.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Documents</Typography>
                    <Box display="flex" gap={1}>
                      {selectedLeave.documents.map((doc, index) => (
                        <Chip
                          key={index}
                          label={doc.name || `Document ${index + 1}`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                )}

                {selectedLeave.wardenApproval?.remarks && (
                  <Grid item xs={12}>
                    <Alert severity={selectedLeave.status === LEAVE_STATUS.APPROVED ? 'success' : 'error'}>
                      <Typography variant="body2">
                        <strong>Warden Remarks:</strong> {selectedLeave.wardenApproval.remarks}
                        {selectedLeave.wardenApproval.approvedAt && 
                          ` (${formatDateTime(selectedLeave.wardenApproval.approvedAt)})`
                        }
                      </Typography>
                    </Alert>
                  </Grid>
                )}

                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">
                    Created: {formatDateTime(selectedLeave.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary" align="right" display="block">
                    Last Updated: {formatDateTime(selectedLeave.updatedAt)}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
              {selectedLeave.status === LEAVE_STATUS.PENDING && (
                <>
                  <Button 
                    variant="contained" 
                    color="success"
                    onClick={() => {
                      handleApprove(selectedLeave);
                      setOpenViewDialog(false);
                    }}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error"
                    onClick={() => {
                      setOpenViewDialog(false);
                      setOpenRejectDialog(true);
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Reject Dialog */}
      <Dialog 
        open={openRejectDialog} 
        onClose={() => setOpenRejectDialog(false)} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Zoom}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold" color="error">
            Reject Leave Request
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Please provide a reason for rejecting {selectedLeave?.studentName}'s leave request.
          </Typography>
          <TextField
            fullWidth
            label="Rejection Reason"
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            autoFocus
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenRejectDialog(false);
            setRejectReason('');
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleReject} 
            variant="contained" 
            color="error"
            disabled={!rejectReason.trim() || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Reject Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Fade}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WardenLeaves;