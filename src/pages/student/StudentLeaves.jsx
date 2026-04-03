import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  InputAdornment,
  alpha,
  useTheme,
  Fade,
  Zoom,
  Tooltip,
  Card,
  CardContent,
  Avatar,
  Badge,
  Stack,
  LinearProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CloudUpload as UploadIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Event as EventIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  FileUpload as FileUploadIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import studentService from "../../services/studentService";
import { format } from 'date-fns';

/* ─────────────────────────────────────────────
   White & Green Theme System (Light Mode)
───────────────────────────────────────────── */
const theme = {
  // Background Colors
  bg: '#f8fafc',           // Main background: light gray
  bgLight: '#ffffff',       // White
  bgHover: '#f1f5f9',      // Hover state
  
  // Card Colors
  cardBg: '#ffffff',        // White cards
  cardBorder: '#e2e8f0',    // Light gray border
  
  // Primary Colors - Green
  primary: '#059669',       // Emerald green
  primaryLight: '#34d399',  // Light green
  primaryDark: '#047857',   // Dark green
  primarySoft: '#ecfdf5',   // Very light green background
  
  // Status Colors
  success: '#10b981',       // Green
  successLight: '#d1fae5',
  warning: '#f59e0b',       // Amber
  warningLight: '#fef3c7',
  error: '#ef4444',         // Red
  errorLight: '#fee2e2',
  info: '#3b82f6',          // Blue
  infoLight: '#dbeafe',
  
  // Text Colors
  textPrimary: '#0f172a',   // Dark slate
  textSecondary: '#475569', // Medium slate
  textMuted: '#64748b',     // Light slate
  
  // Borders
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  
  // Gradients
  primaryGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  successGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  warningGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  errorGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  
  // Shadows
  cardShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  hoverShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  
  // Border Radius
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  },
  
  // Typography
  fontPrimary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSecondary: "'SF Pro Display', 'Inter', 'Segoe UI', sans-serif",
};

/* ─────────────────────────────────────────────
   Styled Components
───────────────────────────────────────────── */
const StyledPaper = styled(Paper)(({ theme: muiTheme }) => ({
  padding: muiTheme.spacing(3),
  margin: muiTheme.spacing(2),
  background: theme.cardBg,
  borderRadius: theme.borderRadius.xl,
  border: `1px solid ${theme.border}`,
  boxShadow: theme.cardShadow,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.hoverShadow,
    borderColor: theme.primaryLight
  }
}));

const GlassCard = styled(Card)(({ bgcolor = theme.cardBg }) => ({
  background: bgcolor,
  borderRadius: theme.borderRadius.xl,
  border: `1px solid ${theme.border}`,
  boxShadow: theme.cardShadow,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.hoverShadow,
    borderColor: theme.primary
  }
}));

const GradientButton = styled(Button)(({ gradient = theme.primaryGradient }) => ({
  background: gradient,
  color: 'white',
  borderRadius: theme.borderRadius.lg,
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
  boxShadow: '0 4px 6px -1px rgba(5,150,105,0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgba(5,150,105,0.3)',
    filter: 'brightness(1.05)'
  },
  '&:active': {
    transform: 'translateY(0)'
  },
  '&.Mui-disabled': {
    background: alpha(theme.textMuted, 0.3),
    color: alpha(theme.textPrimary, 0.5)
  }
}));

const StatusChip = styled(Chip)(({ statuscolor }) => ({
  background: alpha(statuscolor, 0.1),
  color: statuscolor,
  border: `1px solid ${alpha(statuscolor, 0.2)}`,
  fontWeight: 600,
  fontSize: '0.75rem',
  borderRadius: theme.borderRadius.md,
  '& .MuiChip-icon': {
    color: statuscolor
  }
}));

const TableHeaderCell = styled(TableCell)({
  backgroundColor: theme.bgLight,
  color: theme.textPrimary,
  fontWeight: 700,
  fontSize: '0.85rem',
  borderBottom: `2px solid ${theme.primary}`,
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
});

const TableBodyCell = styled(TableCell)({
  color: theme.textSecondary,
  borderBottom: `1px solid ${theme.borderLight}`,
  fontSize: '0.9rem'
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: theme.cardBg,
    borderRadius: theme.borderRadius.xl,
    border: `1px solid ${theme.border}`,
    boxShadow: theme.hoverShadow
  }
});

const StyledDialogTitle = styled(DialogTitle)({
  background: theme.bgLight,
  color: theme.textPrimary,
  padding: '24px 24px 16px',
  borderBottom: `1px solid ${theme.border}`,
  '& h6': {
    fontWeight: 700,
    fontSize: '1.25rem',
    fontFamily: theme.fontSecondary,
    color: theme.primary
  }
});

const StyledDialogContent = styled(DialogContent)({
  padding: '24px',
  '& .MuiDivider-root': {
    borderColor: theme.borderLight,
    margin: '16px 0'
  }
});

const StyledTextField = styled(TextField)({
  '& .MuiInputLabel-root': {
    color: theme.textMuted,
    fontSize: '0.9rem'
  },
  '& .MuiOutlinedInput-root': {
    color: theme.textPrimary,
    borderRadius: theme.borderRadius.lg,
    '& fieldset': {
      borderColor: theme.border
    },
    '&:hover fieldset': {
      borderColor: theme.primary
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.primary
    }
  },
  '& .MuiFormHelperText-root': {
    color: theme.error,
    fontSize: '0.75rem'
  }
});

const StyledSelect = styled(Select)({
  color: theme.textPrimary,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.border
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.primary
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.primary
  },
  '& .MuiSvgIcon-root': {
    color: theme.textMuted
  }
});

const StudentLeaves = () => {
  const muiTheme = useTheme();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewLeave, setViewLeave] = useState(null);
  
  // Form state
  const [newLeave, setNewLeave] = useState({
    type: 'casual',
    reason: '',
    fromDate: '',
    toDate: '',
    destination: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    documents: []
  });

  const [formErrors, setFormErrors] = useState({});

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const leaveTypes = [
    { value: 'casual', label: 'Casual Leave', icon: '🌴', color: theme.primary },
    { value: 'medical', label: 'Medical Leave', icon: '🏥', color: theme.success },
    { value: 'emergency', label: 'Emergency Leave', icon: '🚨', color: theme.error },
    { value: 'vacation', label: 'Vacation', icon: '✈️', color: theme.warning },
    { value: 'other', label: 'Other', icon: '📝', color: theme.textMuted }
  ];

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching leaves...');
      
      const data = await studentService.getLeaves();
      console.log('Leaves received:', data);
      
      if (Array.isArray(data)) {
        setLeaves(data);
      } else if (data?.data && Array.isArray(data.data)) {
        setLeaves(data.data);
      } else {
        setLeaves([]);
      }
    } catch (err) {
      console.error('Error fetching leaves:', err);
      setError(err.response?.data?.message || 'Failed to load leave applications');
      showSnackbar('Failed to load leaves', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = () => {
    setNewLeave({
      type: 'casual',
      reason: '',
      fromDate: '',
      toDate: '',
      destination: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      },
      documents: []
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewLeave({
      type: 'casual',
      reason: '',
      fromDate: '',
      toDate: '',
      destination: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      },
      documents: []
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('emergency.')) {
      const field = name.split('.')[1];
      setNewLeave(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setNewLeave(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!newLeave.type) {
      errors.type = 'Leave type is required';
    }
    
    if (!newLeave.fromDate) {
      errors.fromDate = 'From date is required';
    }
    
    if (!newLeave.toDate) {
      errors.toDate = 'To date is required';
    }
    
    if (!newLeave.reason) {
      errors.reason = 'Reason is required';
    } else if (newLeave.reason.length < 10) {
      errors.reason = 'Reason must be at least 10 characters';
    }
    
    if (newLeave.fromDate && newLeave.toDate) {
      const from = new Date(newLeave.fromDate);
      const to = new Date(newLeave.toDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (from < today) {
        errors.fromDate = 'From date cannot be in the past';
      }
      
      if (to < from) {
        errors.toDate = 'To date cannot be before from date';
      }
      
      const diffTime = Math.abs(to - from);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      if (diffDays > 30) {
        errors.toDate = 'Maximum 30 days leave allowed at once';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showSnackbar('Please fix the errors in the form', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      const leaveData = {
        type: newLeave.type,
        reason: newLeave.reason,
        fromDate: newLeave.fromDate,
        toDate: newLeave.toDate,
        destination: newLeave.destination || undefined,
        emergencyContact: newLeave.emergencyContact?.name ? {
          name: newLeave.emergencyContact.name,
          phone: newLeave.emergencyContact.phone,
          relationship: newLeave.emergencyContact.relationship
        } : undefined,
        documents: newLeave.documents,
        status: 'pending'
      };
      
      Object.keys(leaveData).forEach(key => 
        leaveData[key] === undefined && delete leaveData[key]
      );
      
      console.log('Submitting leave data:', leaveData);
      
      const response = await studentService.applyLeave(leaveData);
      console.log('Leave submitted successfully:', response);
      
      if (response) {
        setLeaves(prev => [response, ...prev]);
      }
      
      handleCloseDialog();
      showSnackbar('Leave application submitted successfully!', 'success');
      
      fetchLeaves();
      
    } catch (err) {
      console.error('Error submitting leave:', err);
      const errorMessage = err.response?.data?.message || 'Failed to submit leave application';
      showSnackbar(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewLeave = async (leave) => {
    try {
      if (leave.id || leave._id) {
        const details = await studentService.getLeaveDetails(leave.id || leave._id);
        setViewLeave(details || leave);
      } else {
        setViewLeave(leave);
      }
      setOpenViewDialog(true);
    } catch (err) {
      console.error('Error fetching leave details:', err);
      setViewLeave(leave);
      setOpenViewDialog(true);
    }
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setViewLeave(null);
  };

  const handleCancelLeave = async (leaveId) => {
    if (!window.confirm('Are you sure you want to cancel this leave application?')) {
      return;
    }
    
    try {
      await studentService.cancelLeave(leaveId);
      showSnackbar('Leave application cancelled successfully', 'success');
      fetchLeaves();
    } catch (err) {
      console.error('Error cancelling leave:', err);
      showSnackbar(err.response?.data?.message || 'Failed to cancel leave', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getStatusColor = (status) => {
    if (!status) return theme.textMuted;
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'approved':
        return theme.success;
      case 'pending':
        return theme.warning;
      case 'rejected':
      case 'cancelled':
        return theme.error;
      default:
        return theme.textMuted;
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return null;
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'approved':
        return <CheckCircleIcon fontSize="small" />;
      case 'pending':
        return <WarningIcon fontSize="small" />;
      case 'rejected':
      case 'cancelled':
        return <ErrorIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const getApprovalStatusColor = (status) => {
    if (!status) return theme.textMuted;
    switch (status) {
      case 'approved':
        return theme.success;
      case 'pending':
        return theme.warning;
      case 'rejected':
        return theme.error;
      default:
        return theme.textMuted;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return dateString;
    }
  };

  const calculateDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return '-';
    try {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const diffTime = Math.abs(to - from);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    } catch {
      return '-';
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: theme.bg }}
      >
        <GlassCard sx={{ p: 5, textAlign: 'center', maxWidth: 400 }}>
          <CircularProgress size={60} thickness={4} sx={{ color: theme.primary, mb: 3 }} />
          <Typography variant="h6" sx={{ color: theme.textPrimary, fontWeight: 600, mb: 2 }}>
            Loading Leave Applications
          </Typography>
          <LinearProgress 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              background: alpha(theme.primary, 0.1),
              '& .MuiLinearProgress-bar': {
                background: theme.primaryGradient,
                borderRadius: 3
              }
            }} 
          />
        </GlassCard>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.bg,
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>

      <StyledPaper elevation={0}>
        {/* Header */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={4}
          className="fade-in"
        >
          <Box>
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.primary,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                mb: 1,
                display: 'block'
              }}
            >
              Leave Management
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: theme.textPrimary,
                fontFamily: theme.fontSecondary
              }}
            >
              My Leave Applications
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Tooltip title="Refresh" arrow>
              <IconButton
                onClick={fetchLeaves}
                sx={{
                  bgcolor: theme.bgLight,
                  border: `1px solid ${theme.border}`,
                  color: theme.textMuted,
                  width: 45,
                  height: 45,
                  '&:hover': {
                    borderColor: theme.primary,
                    color: theme.primary,
                    transform: 'rotate(180deg)'
                  },
                  transition: 'all 0.5s ease'
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <GradientButton
              startIcon={<AddIcon />}
              onClick={handleApplyLeave}
            >
              Apply for Leave
            </GradientButton>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Fade in={true}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: theme.borderRadius.lg,
                background: alpha(theme.error, 0.1),
                color: theme.error,
                border: `1px solid ${alpha(theme.error, 0.2)}`,
                '& .MuiAlert-icon': {
                  color: theme.error
                }
              }}
              onClose={() => setError(null)}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={fetchLeaves}
                  sx={{ color: theme.error }}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <GlassCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: alpha(theme.primary, 0.1), width: 50, height: 50, mx: 'auto', mb: 2 }}>
                  <AssignmentIcon sx={{ color: theme.primary }} />
                </Avatar>
                <Typography variant="h4" sx={{ color: theme.textPrimary, fontWeight: 700 }}>
                  {leaves.length}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.textMuted }}>
                  Total Applications
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <GlassCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: alpha(theme.success, 0.1), width: 50, height: 50, mx: 'auto', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: theme.success }} />
                </Avatar>
                <Typography variant="h4" sx={{ color: theme.textPrimary, fontWeight: 700 }}>
                  {leaves.filter(l => l.status?.toLowerCase() === 'approved').length}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.textMuted }}>
                  Approved
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <GlassCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: alpha(theme.warning, 0.1), width: 50, height: 50, mx: 'auto', mb: 2 }}>
                  <WarningIcon sx={{ color: theme.warning }} />
                </Avatar>
                <Typography variant="h4" sx={{ color: theme.textPrimary, fontWeight: 700 }}>
                  {leaves.filter(l => l.status?.toLowerCase() === 'pending').length}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.textMuted }}>
                  Pending
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <GlassCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: alpha(theme.error, 0.1), width: 50, height: 50, mx: 'auto', mb: 2 }}>
                  <ErrorIcon sx={{ color: theme.error }} />
                </Avatar>
                <Typography variant="h4" sx={{ color: theme.textPrimary, fontWeight: 700 }}>
                  {leaves.filter(l => l.status?.toLowerCase() === 'rejected').length}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.textMuted }}>
                  Rejected
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
        </Grid>

        {/* Leaves Table */}
        <TableContainer 
          component={Paper} 
          variant="outlined"
          sx={{ 
            background: theme.bgLight,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.borderRadius.xl,
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Leave #</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>From Date</TableHeaderCell>
                <TableHeaderCell>To Date</TableHeaderCell>
                <TableHeaderCell>Days</TableHeaderCell>
                <TableHeaderCell>Reason</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Parent</TableHeaderCell>
                <TableHeaderCell>Warden</TableHeaderCell>
                <TableHeaderCell align="center">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.length > 0 ? (
                leaves.map((leave, index) => {
                  const statusColor = getStatusColor(leave.status);
                  return (
                    <TableRow 
                      key={leave.id || leave._id || index} 
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.bgHover
                        }
                      }}
                    >
                      <TableBodyCell>
                        <Typography variant="body2" fontWeight="600" sx={{ color: theme.primary }}>
                          {leave.leaveNumber || `LEV-${String(index + 1).padStart(3, '0')}`}
                        </Typography>
                      </TableBodyCell>
                      <TableBodyCell>
                        <Chip
                          label={leave.type || 'casual'}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.primary, 0.1),
                            color: theme.primary,
                            border: `1px solid ${alpha(theme.primary, 0.2)}`,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableBodyCell>
                      <TableBodyCell>{formatDate(leave.fromDate)}</TableBodyCell>
                      <TableBodyCell>{formatDate(leave.toDate)}</TableBodyCell>
                      <TableBodyCell>
                        <Chip
                          label={calculateDays(leave.fromDate, leave.toDate)}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.textMuted, 0.1),
                            color: theme.textMuted,
                            fontWeight: 600,
                            minWidth: 45
                          }}
                        />
                      </TableBodyCell>
                      <TableBodyCell>
                        <Tooltip title={leave.reason} arrow>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 150, color: theme.textSecondary }}>
                            {leave.reason}
                          </Typography>
                        </Tooltip>
                      </TableBodyCell>
                      <TableBodyCell>
                        <StatusChip
                          statuscolor={statusColor}
                          label={leave.status || 'pending'}
                          size="small"
                          icon={getStatusIcon(leave.status)}
                        />
                      </TableBodyCell>
                      <TableBodyCell>
                        {leave.parentApproval ? (
                          <Chip
                            label={leave.parentApproval.status || 'pending'}
                            size="small"
                            sx={{
                              bgcolor: alpha(getApprovalStatusColor(leave.parentApproval?.status), 0.1),
                              color: getApprovalStatusColor(leave.parentApproval?.status),
                              border: `1px solid ${alpha(getApprovalStatusColor(leave.parentApproval?.status), 0.2)}`,
                              fontWeight: 600,
                              fontSize: '0.7rem'
                            }}
                          />
                        ) : (
                          <Chip 
                            label="N/A" 
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.textMuted, 0.1),
                              color: theme.textMuted
                            }}
                          />
                        )}
                      </TableBodyCell>
                      <TableBodyCell>
                        {leave.wardenApproval ? (
                          <Chip
                            label={leave.wardenApproval.status || 'pending'}
                            size="small"
                            sx={{
                              bgcolor: alpha(getApprovalStatusColor(leave.wardenApproval?.status), 0.1),
                              color: getApprovalStatusColor(leave.wardenApproval?.status),
                              border: `1px solid ${alpha(getApprovalStatusColor(leave.wardenApproval?.status), 0.2)}`,
                              fontWeight: 600,
                              fontSize: '0.7rem'
                            }}
                          />
                        ) : (
                          <Chip 
                            label="N/A" 
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.textMuted, 0.1),
                              color: theme.textMuted
                            }}
                          />
                        )}
                      </TableBodyCell>
                      <TableBodyCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleViewLeave(leave)}
                              sx={{
                                color: theme.info,
                                bgcolor: alpha(theme.info, 0.1),
                                '&:hover': {
                                  bgcolor: alpha(theme.info, 0.2)
                                }
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {leave.status?.toLowerCase() === 'pending' && (
                            <Tooltip title="Cancel Leave" arrow>
                              <IconButton
                                size="small"
                                onClick={() => handleCancelLeave(leave.id || leave._id)}
                                sx={{
                                  color: theme.error,
                                  bgcolor: alpha(theme.error, 0.1),
                                  '&:hover': {
                                    bgcolor: alpha(theme.error, 0.2)
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableBodyCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableBodyCell colSpan={10} align="center" sx={{ py: 8 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: alpha(theme.textMuted, 0.1), width: 80, height: 80 }}>
                        <AssignmentIcon sx={{ fontSize: 40, color: theme.textMuted }} />
                      </Avatar>
                      <Typography variant="h6" sx={{ color: theme.textPrimary }}>
                        No Leave Applications Found
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.textMuted, mb: 2 }}>
                        Click the button below to apply for your first leave
                      </Typography>
                      <GradientButton
                        startIcon={<AddIcon />}
                        onClick={handleApplyLeave}
                        size="small"
                      >
                        Apply for Leave
                      </GradientButton>
                    </Box>
                  </TableBodyCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Apply Leave Dialog */}
        <StyledDialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="md" 
          fullWidth
          TransitionComponent={Zoom}
        >
          <form onSubmit={handleSubmitLeave}>
            <StyledDialogTitle>
              <Box display="flex" alignItems="center" gap={1}>
                <AddIcon sx={{ color: theme.primary }} />
                <Typography variant="h6">Apply for Leave</Typography>
              </Box>
            </StyledDialogTitle>
            <StyledDialogContent>
              <Grid container spacing={3}>
                {/* Leave Type */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!formErrors.type}>
                    <InputLabel sx={{ color: theme.textMuted }}>Leave Type *</InputLabel>
                    <StyledSelect
                      name="type"
                      value={newLeave.type}
                      onChange={handleInputChange}
                      label="Leave Type *"
                      disabled={submitting}
                    >
                      {leaveTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <span>{type.icon}</span>
                            <span style={{ color: theme.textPrimary }}>{type.label}</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </StyledSelect>
                    {formErrors.type && (
                      <Typography color="error" variant="caption">
                        {formErrors.type}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Destination */}
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="Destination (Optional)"
                    name="destination"
                    value={newLeave.destination}
                    onChange={handleInputChange}
                    disabled={submitting}
                    placeholder="Where are you going?"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon sx={{ color: theme.textMuted }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                {/* From Date */}
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="From Date *"
                    type="date"
                    name="fromDate"
                    value={newLeave.fromDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                    error={!!formErrors.fromDate}
                    helperText={formErrors.fromDate}
                    disabled={submitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon sx={{ color: theme.textMuted }} />
                        </InputAdornment>
                      )
                    }}
                    inputProps={{
                      min: new Date().toISOString().split('T')[0]
                    }}
                  />
                </Grid>

                {/* To Date */}
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="To Date *"
                    type="date"
                    name="toDate"
                    value={newLeave.toDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                    error={!!formErrors.toDate}
                    helperText={formErrors.toDate}
                    disabled={submitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventIcon sx={{ color: theme.textMuted }} />
                        </InputAdornment>
                      )
                    }}
                    inputProps={{
                      min: newLeave.fromDate || new Date().toISOString().split('T')[0]
                    }}
                  />
                </Grid>

                {/* Reason */}
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Reason for Leave *"
                    name="reason"
                    value={newLeave.reason}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    required
                    error={!!formErrors.reason}
                    helperText={formErrors.reason || 'Minimum 10 characters'}
                    disabled={submitting}
                    placeholder="Please provide detailed reason for your leave"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                          <DescriptionIcon sx={{ color: theme.textMuted }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider>
                    <Chip 
                      label="Emergency Contact (Optional)" 
                      size="small"
                      sx={{ 
                        bgcolor: alpha(theme.primary, 0.1),
                        color: theme.primary,
                        border: `1px solid ${alpha(theme.primary, 0.2)}`
                      }}
                    />
                  </Divider>
                </Grid>

                {/* Emergency Contact Name */}
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    label="Contact Name"
                    name="emergency.name"
                    value={newLeave.emergencyContact?.name}
                    onChange={handleInputChange}
                    disabled={submitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: theme.textMuted }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                {/* Emergency Contact Phone */}
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    label="Contact Phone"
                    name="emergency.phone"
                    value={newLeave.emergencyContact?.phone}
                    onChange={handleInputChange}
                    disabled={submitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: theme.textMuted }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                {/* Emergency Contact Relationship */}
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    label="Relationship"
                    name="emergency.relationship"
                    value={newLeave.emergencyContact?.relationship}
                    onChange={handleInputChange}
                    disabled={submitting}
                    placeholder="e.g., Father, Mother"
                  />
                </Grid>

                {/* Document Upload */}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FileUploadIcon />}
                    sx={{
                      borderColor: alpha(theme.primary, 0.3),
                      color: theme.primary,
                      py: 1.5,
                      borderRadius: theme.borderRadius.lg,
                      '&:hover': {
                        borderColor: theme.primary,
                        bgcolor: alpha(theme.primary, 0.05)
                      }
                    }}
                  >
                    Upload Supporting Documents (Optional)
                  </Button>
                </Grid>
              </Grid>
            </StyledDialogContent>
            <DialogActions sx={{ p: 3, gap: 2 }}>
              <Button 
                onClick={handleCloseDialog} 
                disabled={submitting}
                sx={{
                  color: theme.textMuted,
                  border: `1px solid ${theme.border}`,
                  '&:hover': {
                    borderColor: theme.primary,
                    bgcolor: alpha(theme.primary, 0.05)
                  }
                }}
              >
                Cancel
              </Button>
              <GradientButton
                type="submit"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : null}
                sx={{ minWidth: 150 }}
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </GradientButton>
            </DialogActions>
          </form>
        </StyledDialog>

        {/* View Leave Dialog */}
        <StyledDialog 
          open={openViewDialog} 
          onClose={handleCloseViewDialog} 
          maxWidth="md" 
          fullWidth
          TransitionComponent={Zoom}
        >
          <StyledDialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <ViewIcon sx={{ color: theme.primary }} />
              <Typography variant="h6">Leave Details</Typography>
            </Box>
          </StyledDialogTitle>
          <StyledDialogContent>
            {viewLeave && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <GlassCard sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                          Leave Number
                        </Typography>
                        <Typography variant="h6" sx={{ color: theme.primary, fontWeight: 700 }}>
                          {viewLeave.leaveNumber || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                          Status
                        </Typography>
                        <StatusChip
                          statuscolor={getStatusColor(viewLeave.status)}
                          label={viewLeave.status || 'pending'}
                          size="small"
                          icon={getStatusIcon(viewLeave.status)}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                          Type
                        </Typography>
                        <Chip
                          label={viewLeave.type || 'casual'}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.primary, 0.1),
                            color: theme.primary,
                            border: `1px solid ${alpha(theme.primary, 0.2)}`,
                            fontWeight: 600
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                          Total Days
                        </Typography>
                        <Typography variant="h6" sx={{ color: theme.textPrimary, fontWeight: 700 }}>
                          {calculateDays(viewLeave.fromDate, viewLeave.toDate)} days
                        </Typography>
                      </Grid>
                    </Grid>
                  </GlassCard>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                    From Date
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.textPrimary, fontWeight: 500 }}>
                    {formatDate(viewLeave.fromDate)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                    To Date
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.textPrimary, fontWeight: 500 }}>
                    {formatDate(viewLeave.toDate)}
                  </Typography>
                </Grid>

                {viewLeave.destination && (
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                      Destination
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.textPrimary }}>
                      {viewLeave.destination}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block', mb: 1 }}>
                    Reason
                  </Typography>
                  <GlassCard sx={{ p: 3, bgcolor: theme.bgLight }}>
                    <Typography variant="body1" sx={{ color: theme.textSecondary }}>
                      {viewLeave.reason}
                    </Typography>
                  </GlassCard>
                </Grid>

                {viewLeave.emergencyContact?.name && (
                  <>
                    <Grid item xs={12}>
                      <Divider>
                        <Chip 
                          label="Emergency Contact" 
                          size="small"
                          sx={{ 
                            bgcolor: alpha(theme.primary, 0.1),
                            color: theme.primary
                          }}
                        />
                      </Divider>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                        Name
                      </Typography>
                      <Typography variant="body1" sx={{ color: theme.textPrimary }}>
                        {viewLeave.emergencyContact.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                        Phone
                      </Typography>
                      <Typography variant="body1" sx={{ color: theme.textPrimary }}>
                        {viewLeave.emergencyContact.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                        Relationship
                      </Typography>
                      <Typography variant="body1" sx={{ color: theme.textPrimary }}>
                        {viewLeave.emergencyContact.relationship}
                      </Typography>
                    </Grid>
                  </>
                )}

                {/* Approval Status */}
                <Grid item xs={12}>
                  <Divider>
                    <Chip 
                      label="Approval Status" 
                      size="small"
                      sx={{ 
                        bgcolor: alpha(theme.primary, 0.1),
                        color: theme.primary
                      }}
                    />
                  </Divider>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block', mb: 1 }}>
                    Parent Approval
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={viewLeave.parentApproval?.status || 'pending'}
                      size="small"
                      sx={{
                        bgcolor: alpha(getApprovalStatusColor(viewLeave.parentApproval?.status), 0.1),
                        color: getApprovalStatusColor(viewLeave.parentApproval?.status),
                        border: `1px solid ${alpha(getApprovalStatusColor(viewLeave.parentApproval?.status), 0.2)}`,
                        fontWeight: 600
                      }}
                    />
                    {viewLeave.parentApproval?.approvedBy && (
                      <Typography variant="caption" sx={{ color: theme.textMuted }}>
                        by {viewLeave.parentApproval.approvedBy}
                      </Typography>
                    )}
                  </Box>
                  {viewLeave.parentApproval?.remarks && (
                    <Typography variant="body2" sx={{ color: theme.textMuted, mt: 1 }}>
                      Remarks: {viewLeave.parentApproval.remarks}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block', mb: 1 }}>
                    Warden Approval
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={viewLeave.wardenApproval?.status || 'pending'}
                      size="small"
                      sx={{
                        bgcolor: alpha(getApprovalStatusColor(viewLeave.wardenApproval?.status), 0.1),
                        color: getApprovalStatusColor(viewLeave.wardenApproval?.status),
                        border: `1px solid ${alpha(getApprovalStatusColor(viewLeave.wardenApproval?.status), 0.2)}`,
                        fontWeight: 600
                      }}
                    />
                    {viewLeave.wardenApproval?.approvedBy && (
                      <Typography variant="caption" sx={{ color: theme.textMuted }}>
                        by {viewLeave.wardenApproval.approvedBy}
                      </Typography>
                    )}
                  </Box>
                  {viewLeave.wardenApproval?.remarks && (
                    <Typography variant="body2" sx={{ color: theme.textMuted, mt: 1 }}>
                      Remarks: {viewLeave.wardenApproval.remarks}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                    Applied At
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                    {formatDate(viewLeave.appliedAt || viewLeave.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                    Last Updated
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                    {formatDate(viewLeave.updatedAt)}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </StyledDialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleCloseViewDialog}
              variant="outlined"
              sx={{
                borderColor: alpha(theme.primary, 0.3),
                color: theme.primary,
                '&:hover': {
                  borderColor: theme.primary,
                  bgcolor: alpha(theme.primary, 0.05)
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </StyledDialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={Zoom}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            variant="filled"
            sx={{ 
              width: '100%',
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.hoverShadow,
              fontWeight: 600,
              background: snackbar.severity === 'success' ? theme.successGradient :
                         snackbar.severity === 'error' ? theme.errorGradient :
                         snackbar.severity === 'warning' ? theme.warningGradient :
                         theme.primaryGradient
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </StyledPaper>
    </Box>
  );
};

export default StudentLeaves;