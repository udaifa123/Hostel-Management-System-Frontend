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
  Grid,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  FormHelperText,
  Avatar,
  Divider,
  alpha,
  Zoom,
  Badge,
  LinearProgress,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Pending as PendingIcon,
  Engineering as InProgressIcon,
  ReportProblem as ComplaintIcon,
  CheckCircle as ResolvedIcon,
  LocationOn as LocationIcon,
  PriorityHigh as PriorityIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import studentService from "../../services/studentService";

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
  pending: '#f59e0b',       // Amber
  pendingLight: '#fef3c7',
  inProgress: '#8b5cf6',    // Purple
  inProgressLight: '#ede9fe',
  resolved: '#10b981',      // Green
  resolvedLight: '#d1fae5',
  
  // Priority Colors
  low: '#64748b',           // Slate
  medium: '#f59e0b',        // Amber
  high: '#ef4444',          // Red
  urgent: '#dc2626',        // Dark red
  
  // Category Colors
  electrical: '#3b82f6',    // Blue
  plumbing: '#0ea5e9',      // Sky blue
  carpentry: '#8b5cf6',     // Purple
  cleaning: '#10b981',      // Green
  
  // Text Colors
  textPrimary: '#0f172a',   // Dark slate
  textSecondary: '#475569', // Medium slate
  textMuted: '#64748b',     // Light slate
  
  // Borders
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  
  // Gradients
  primaryGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  pendingGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  inProgressGradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  resolvedGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  
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

const StatusChip = styled(Chip)(({ statuscolor = theme.textMuted }) => ({
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

const PriorityChip = styled(Chip)(({ prioritycolor = theme.textMuted }) => ({
  background: alpha(prioritycolor, 0.1),
  color: prioritycolor,
  border: `1px solid ${alpha(prioritycolor, 0.2)}`,
  fontWeight: 600,
  fontSize: '0.7rem',
  borderRadius: theme.borderRadius.md,
  textTransform: 'uppercase'
}));

const CategoryChip = styled(Chip)(({ categorycolor = theme.textMuted }) => ({
  background: alpha(categorycolor, 0.1),
  color: categorycolor,
  border: `1px solid ${alpha(categorycolor, 0.2)}`,
  fontWeight: 500,
  fontSize: '0.7rem',
  borderRadius: theme.borderRadius.md
}));

const StatCard = styled(Card)(({ gradient = theme.primaryGradient }) => ({
  height: '100%',
  background: gradient,
  borderRadius: theme.borderRadius.xl,
  border: `1px solid ${theme.border}`,
  boxShadow: theme.cardShadow,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.8), transparent 50%)',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.hoverShadow,
    '&::before': {
      opacity: 1
    }
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
  '&.Mui-disabled': {
    background: alpha(theme.textMuted, 0.3),
    color: alpha(theme.textPrimary, 0.5)
  }
}));

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
  '& .MuiTypography-root': {
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

const StudentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Simple form state
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: 'electrical',
    priority: 'medium',
    location: { room: '', building: '', floor: '' },
    isAnonymous: false
  });

  // Load complaints from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('myComplaints');
    if (saved) {
      try {
        setComplaints(JSON.parse(saved));
      } catch (e) {}
    }
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await studentService.getComplaints();
      if (Array.isArray(data) && data.length > 0) {
        setComplaints(data);
        localStorage.setItem('myComplaints', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateComplaintNumber = () => {
    return 'CMP' + Date.now().toString().slice(-8);
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    
    if (!newComplaint.title || !newComplaint.description) {
      showSnackbar('Please fill required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      // Create complaint object
      const complaintData = {
  title: newComplaint.title,
  description: newComplaint.description,
  category: newComplaint.category,
  priority: newComplaint.priority,
  location: newComplaint.location,
  isAnonymous: newComplaint.isAnonymous
};

      // Try to send to backend, but don't wait for it
   const res = await studentService.createComplaint(complaintData);

// backend ninn vann data use cheyyanam
const updatedComplaints = [res.data, ...complaints];

setComplaints(updatedComplaints);
localStorage.setItem('myComplaints', JSON.stringify(updatedComplaints));
      
      showSnackbar('Complaint raised: ' + res.data.complaintNumber, 'success');
      setOpenDialog(false);
      
      // Reset form
      setNewComplaint({
        title: '',
        description: '',
        category: 'electrical',
        priority: 'medium',
        location: { room: '', building: '', floor: '' },
        isAnonymous: false
      });
      
    } catch (err) {
      showSnackbar('Error submitting complaint', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewComplaint = (complaint) => {
    setViewComplaint(complaint);
    setOpenViewDialog(true);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusColor = (status) => {
    if (!status) return theme.textMuted;
    switch(status.toLowerCase()) {
      case 'pending': return theme.pending;
      case 'in-progress': return theme.inProgress;
      case 'resolved': return theme.resolved;
      default: return theme.textMuted;
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return <PendingIcon sx={{ fontSize: 16 }} />;
      case 'in-progress': return <InProgressIcon sx={{ fontSize: 16 }} />;
      case 'resolved': return <ResolvedIcon sx={{ fontSize: 16 }} />;
      default: return <ComplaintIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getPriorityColor = (priority) => {
    if (!priority) return theme.textMuted;
    switch(priority.toLowerCase()) {
      case 'low': return theme.low;
      case 'medium': return theme.medium;
      case 'high': return theme.high;
      case 'urgent': return theme.urgent;
      default: return theme.textMuted;
    }
  };

  const getCategoryColor = (category) => {
    if (!category) return theme.textMuted;
    switch(category.toLowerCase()) {
      case 'electrical': return theme.electrical;
      case 'plumbing': return theme.plumbing;
      case 'carpentry': return theme.carpentry;
      case 'cleaning': return theme.cleaning;
      default: return theme.textMuted;
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
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
        <Card sx={{ 
          p: 5, 
          textAlign: 'center', 
          maxWidth: 400,
          background: theme.cardBg,
          borderRadius: theme.borderRadius.xl,
          border: `1px solid ${theme.border}`
        }}>
          <CircularProgress size={60} thickness={4} sx={{ color: theme.primary, mb: 3 }} />
          <Typography variant="h6" sx={{ color: theme.textPrimary, fontWeight: 600, mb: 2 }}>
            Loading Complaints
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
        </Card>
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
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
              Complaint Management
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: theme.textPrimary,
                fontFamily: theme.fontSecondary
              }}
            >
              My Complaints
            </Typography>
            <Typography variant="body2" sx={{ color: theme.textMuted, mt: 0.5 }}>
              Track and manage your complaints
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Tooltip title="Refresh" arrow>
              <IconButton 
                onClick={fetchComplaints}
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
              onClick={() => setOpenDialog(true)}
            >
              RAISE COMPLAINT
            </GradientButton>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard gradient="linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)">
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" sx={{ color: theme.textMuted, fontWeight: 500 }}>
                      Total
                    </Typography>
                    <ComplaintIcon sx={{ color: theme.primary }} />
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="700" sx={{ color: theme.textPrimary }}>
                    {stats.total}
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard gradient={theme.pendingGradient}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" sx={{ color: alpha(theme.bgLight, 0.9), fontWeight: 500 }}>
                      Pending
                    </Typography>
                    <PendingIcon sx={{ color: theme.bgLight }} />
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="700" sx={{ color: theme.bgLight }}>
                    {stats.pending}
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard gradient={theme.inProgressGradient}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" sx={{ color: alpha(theme.bgLight, 0.9), fontWeight: 500 }}>
                      In Progress
                    </Typography>
                    <InProgressIcon sx={{ color: theme.bgLight }} />
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="700" sx={{ color: theme.bgLight }}>
                    {stats.inProgress}
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard gradient={theme.resolvedGradient}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" sx={{ color: alpha(theme.bgLight, 0.9), fontWeight: 500 }}>
                      Resolved
                    </Typography>
                    <ResolvedIcon sx={{ color: theme.bgLight }} />
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="700" sx={{ color: theme.bgLight }}>
                    {stats.resolved}
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
          </Grid>
        </Box>

        {/* Complaints List */}
        {complaints.length > 0 ? (
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
                  <TableHeaderCell>Complaint #</TableHeaderCell>
                  <TableHeaderCell>Title</TableHeaderCell>
                  <TableHeaderCell>Category</TableHeaderCell>
                  <TableHeaderCell>Priority</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell align="center">Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((complaint) => {
                  const statusColor = getStatusColor(complaint.status);
                  const priorityColor = getPriorityColor(complaint.priority);
                  const categoryColor = getCategoryColor(complaint.category);
                  
                  return (
                    <TableRow 
                      key={complaint._id} 
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.bgHover
                        },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleViewComplaint(complaint)}
                    >
                      <TableBodyCell>
                        <Typography variant="body2" fontWeight="600" sx={{ color: theme.primary }}>
                          {complaint.complaintNumber}
                        </Typography>
                      </TableBodyCell>
                      <TableBodyCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200, color: theme.textSecondary }}>
                          {complaint.title}
                        </Typography>
                      </TableBodyCell>
                      <TableBodyCell>
                        <CategoryChip
                          label={complaint.category}
                          categorycolor={categoryColor}
                          size="small"
                        />
                      </TableBodyCell>
                      <TableBodyCell>
                        <PriorityChip
                          label={complaint.priority}
                          prioritycolor={priorityColor}
                          size="small"
                        />
                      </TableBodyCell>
                      <TableBodyCell>
                        <StatusChip
                          label={complaint.status}
                          statuscolor={statusColor}
                          size="small"
                          icon={getStatusIcon(complaint.status)}
                        />
                      </TableBodyCell>
                      <TableBodyCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <TimeIcon sx={{ color: theme.textMuted, fontSize: 14 }} />
                          <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </TableBodyCell>
                      <TableBodyCell align="center">
                        <Tooltip title="View Details" arrow>
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewComplaint(complaint);
                            }}
                            sx={{
                              color: theme.primary,
                              bgcolor: alpha(theme.primary, 0.1),
                              '&:hover': {
                                bgcolor: alpha(theme.primary, 0.2)
                              }
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableBodyCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper sx={{ 
            p: 8, 
            textAlign: 'center',
            background: theme.bgLight,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.borderRadius.xl
          }}>
            <ComplaintIcon sx={{ fontSize: 80, color: alpha(theme.primary, 0.3), mb: 2 }} />
            <Typography variant="h6" sx={{ color: theme.textPrimary, mb: 1 }}>
              No Complaints Found
            </Typography>
            <Typography variant="body2" sx={{ color: theme.textMuted, mb: 3 }}>
              Click "RAISE COMPLAINT" to create your first complaint
            </Typography>
            <GradientButton
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              size="large"
            >
              Raise Your First Complaint
            </GradientButton>
          </Paper>
        )}

        {/* Raise Complaint Dialog */}
        <StyledDialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          maxWidth="md" 
          fullWidth
          TransitionComponent={Zoom}
        >
          <StyledDialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <AddIcon sx={{ color: theme.primary }} />
              <Typography variant="h6">Raise a Complaint</Typography>
            </Box>
          </StyledDialogTitle>
          <form onSubmit={handleSubmitComplaint}>
            <StyledDialogContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <StyledTextField
                    fullWidth
                    label="Title *"
                    value={newComplaint.title}
                    onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                    required
                    placeholder="Brief title of your complaint"
                  />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <StyledTextField
                    fullWidth
                    label="Description *"
                    multiline
                    rows={4}
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                    required
                    placeholder="Please describe your complaint in detail..."
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: theme.textMuted }}>Category</InputLabel>
                    <StyledSelect
                      value={newComplaint.category}
                      onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                      label="Category"
                    >
                      <MenuItem value="electrical">⚡ Electrical</MenuItem>
                      <MenuItem value="plumbing">💧 Plumbing</MenuItem>
                      <MenuItem value="carpentry">🔨 Carpentry</MenuItem>
                      <MenuItem value="cleaning">🧹 Cleaning</MenuItem>
                    </StyledSelect>
                  </FormControl>
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: theme.textMuted }}>Priority</InputLabel>
                    <StyledSelect
                      value={newComplaint.priority}
                      onChange={(e) => setNewComplaint({...newComplaint, priority: e.target.value})}
                      label="Priority"
                    >
                      <MenuItem value="low">🟢 Low</MenuItem>
                      <MenuItem value="medium">🟡 Medium</MenuItem>
                      <MenuItem value="high">🟠 High</MenuItem>
                      <MenuItem value="urgent">🔴 Urgent</MenuItem>
                    </StyledSelect>
                  </FormControl>
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <StyledTextField
                    fullWidth
                    label="Room Number"
                    value={newComplaint.location.room}
                    onChange={(e) => setNewComplaint({
                      ...newComplaint, 
                      location: {...newComplaint.location, room: e.target.value}
                    })}
                    placeholder="e.g., A-101"
                  />
                </Grid>
              </Grid>
            </StyledDialogContent>
            <DialogActions sx={{ p: 3, gap: 2 }}>
              <Button 
                onClick={() => setOpenDialog(false)} 
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
                startIcon={submitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <SendIcon />}
              >
                {submitting ? 'Submitting...' : 'Submit Complaint'}
              </GradientButton>
            </DialogActions>
          </form>
        </StyledDialog>

        {/* View Dialog */}
        <StyledDialog 
          open={openViewDialog} 
          onClose={() => setOpenViewDialog(false)} 
          maxWidth="md" 
          fullWidth
          TransitionComponent={Zoom}
        >
          <StyledDialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <ViewIcon sx={{ color: theme.primary }} />
              <Typography variant="h6">Complaint Details</Typography>
            </Box>
          </StyledDialogTitle>
          <StyledDialogContent>
            {viewComplaint && (
              <Box>
                {/* Header with complaint number */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Box>
                    <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                      Complaint Number
                    </Typography>
                    <Typography variant="h5" sx={{ color: theme.primary, fontWeight: 700 }}>
                      {viewComplaint.complaintNumber}
                    </Typography>
                  </Box>
                  <StatusChip
                    label={viewComplaint.status}
                    statuscolor={getStatusColor(viewComplaint.status)}
                    icon={getStatusIcon(viewComplaint.status)}
                  />
                </Box>

                <Divider sx={{ borderColor: theme.borderLight, mb: 3 }} />

                {/* Title */}
                <Box mb={3}>
                  <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block', mb: 1 }}>
                    Title
                  </Typography>
                  <Typography variant="h6" sx={{ color: theme.textPrimary }}>
                    {viewComplaint.title}
                  </Typography>
                </Box>

                {/* Description */}
                <Box mb={3}>
                  <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block', mb: 1 }}>
                    Description
                  </Typography>
                  <Paper sx={{ 
                    p: 2, 
                    background: theme.bgLight,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.borderRadius.lg
                  }}>
                    <Typography variant="body1" sx={{ color: theme.textSecondary }}>
                      {viewComplaint.description}
                    </Typography>
                  </Paper>
                </Box>

                {/* Details Grid */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ p: 2, background: theme.bgLight, borderRadius: theme.borderRadius.lg, border: `1px solid ${theme.border}` }}>
                      <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                        Category
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
                        <CategoryIcon sx={{ color: getCategoryColor(viewComplaint.category), fontSize: 18 }} />
                        <Typography variant="body1" sx={{ color: theme.textPrimary, textTransform: 'capitalize' }}>
                          {viewComplaint.category}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ p: 2, background: theme.bgLight, borderRadius: theme.borderRadius.lg, border: `1px solid ${theme.border}` }}>
                      <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                        Priority
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
                        <PriorityIcon sx={{ color: getPriorityColor(viewComplaint.priority), fontSize: 18 }} />
                        <Typography variant="body1" sx={{ color: theme.textPrimary, textTransform: 'capitalize' }}>
                          {viewComplaint.priority}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ p: 2, background: theme.bgLight, borderRadius: theme.borderRadius.lg, border: `1px solid ${theme.border}` }}>
                      <Typography variant="caption" sx={{ color: theme.textMuted, display: 'block' }}>
                        Location
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
                        <LocationIcon sx={{ color: theme.primary, fontSize: 18 }} />
                        <Typography variant="body1" sx={{ color: theme.textPrimary }}>
                          {viewComplaint.location?.room || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Timeline */}
                {viewComplaint.timeline && viewComplaint.timeline.length > 0 && (
                  <>
                    <Divider sx={{ borderColor: theme.borderLight, mb: 3 }} />
                    <Typography variant="h6" sx={{ color: theme.textPrimary, mb: 2, fontSize: '1rem' }}>
                      Timeline
                    </Typography>
                    <Stepper orientation="vertical" sx={{ bgcolor: 'transparent' }}>
                      {viewComplaint.timeline.map((step, index) => (
                        <Step key={index} active>
                          <StepLabel 
                            StepIconComponent={() => (
                              <Avatar sx={{ 
                                width: 28, 
                                height: 28, 
                                bgcolor: alpha(getStatusColor(step.status), 0.2),
                                color: getStatusColor(step.status),
                                fontSize: '0.8rem'
                              }}>
                                {index + 1}
                              </Avatar>
                            )}
                          >
                            <Box>
                              <Typography variant="body2" sx={{ color: theme.textPrimary, fontWeight: 600 }}>
                                {step.status}
                              </Typography>
                              <Typography variant="caption" sx={{ color: theme.textMuted }}>
                                {step.remark} • {new Date(step.updatedAt).toLocaleString()}
                              </Typography>
                            </Box>
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </>
                )}
              </Box>
            )}
          </StyledDialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setOpenViewDialog(false)}
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
          onClose={() => setSnackbar({...snackbar, open: false})}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={Zoom}
        >
          <Alert 
            severity={snackbar.severity}
            variant="filled"
            sx={{ 
              width: '100%',
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.hoverShadow,
              fontWeight: 600,
              background: snackbar.severity === 'success' ? theme.resolvedGradient :
                         snackbar.severity === 'error' ? `linear-gradient(135deg, ${theme.high} 0%, ${theme.urgent} 100%)` :
                         snackbar.severity === 'warning' ? theme.pendingGradient :
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

export default StudentComplaints;