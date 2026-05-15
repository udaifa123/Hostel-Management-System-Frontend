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
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  CheckCircle as ResolvedIcon,
  Engineering as InProgressIcon,
  Pending as PendingIcon,
  Visibility as ViewIcon,
  ReportProblem as ComplaintIcon,
  PriorityHigh as PriorityIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';


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
  50:  '#F4FBF5',
};

const CARD_SHADOW = '0 1px 4px rgba(30,122,53,0.10), 0 0 0 1px rgba(30,122,53,0.08)';


const StatCard = ({ label, value, icon: Icon, dark = false, valueColor }) => (
  <Card elevation={0} sx={{
    borderRadius: 3,
    bgcolor: dark ? G[800] : '#ffffff',
    border: `1px solid ${dark ? G[700] : G[200]}`,
    boxShadow: dark ? '0 4px 16px rgba(13,51,24,0.25)' : CARD_SHADOW,
    height: '100%',
    transition: 'transform 0.15s',
    '&:hover': { transform: 'translateY(-2px)' }
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="caption" sx={{
            color: dark ? G[300] : G[600],
            fontWeight: 600, fontSize: '0.70rem',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            display: 'block', mb: 1
          }}>
            {label}
          </Typography>
          <Typography sx={{
            fontWeight: 700,
            color: valueColor || (dark ? '#ffffff' : G[800]),
            fontSize: '2.2rem', lineHeight: 1,
          }}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{
          bgcolor: dark ? G[700] : G[100],
          width: 48, height: 48, borderRadius: 2,
        }}>
          <Icon sx={{ color: dark ? G[200] : G[600], fontSize: 24 }} />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await adminService.getComplaints();
      console.log('Complaints API Response:', response);
      
      let complaintsData = [];
      if (response.success && response.complaints) {
        complaintsData = response.complaints;
      } else if (response.data && response.data.complaints) {
        complaintsData = response.data.complaints;
      } else if (Array.isArray(response)) {
        complaintsData = response;
      }
      
      setComplaints(complaintsData);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaint, newStatus) => {
    try {
      const response = await adminService.updateComplaintStatus(complaint._id || complaint.id, { status: newStatus });
      
      if (response && response.success) {
        await fetchComplaints();
        setSnackbarMessage(`Complaint status updated to ${newStatus}`);
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setOpenDialog(false);
      } else {
        toast.error(response?.message || 'Failed to update complaint status');
      }
    } catch (error) {
      console.error('Error updating complaint status:', error);
      toast.error('Failed to update complaint status');
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      (c.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.hostel || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { bg: '#FEF3C7', color: '#B45309', icon: <PendingIcon sx={{ fontSize: '13px' }} />, text: 'Pending' };
      case 'in-progress': return { bg: '#E0F2FE', color: '#0284C7', icon: <InProgressIcon sx={{ fontSize: '13px' }} />, text: 'In Progress' };
      case 'resolved': return { bg: G[100], color: G[600], icon: <ResolvedIcon sx={{ fontSize: '13px' }} />, text: 'Resolved' };
      default: return { bg: G[100], color: G[600], text: status };
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return { bg: '#FEF2F2', color: '#EF4444', text: 'High' };
      case 'medium': return { bg: '#FEF3C7', color: '#B45309', text: 'Medium' };
      case 'low': return { bg: G[100], color: G[600], text: 'Low' };
      default: return { bg: G[100], color: G[600], text: priority };
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Electricity': return { bg: '#FEF3C7', color: '#B45309' };
      case 'Plumbing': return { bg: '#E0F2FE', color: '#0284C7' };
      case 'Furniture': return { bg: '#F3E8FF', color: '#7C3AED' };
      case 'Cleaning': return { bg: G[100], color: G[600] };
      default: return { bg: G[100], color: G[600] };
    }
  };

  const getDaysOpen = (date, status) => {
    if (!date) return 'N/A';
    if (status === 'resolved') return 'Closed';
    const openDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today - openDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading complaints...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: G[50], minHeight: '100vh' }}>
      
      <Box sx={{ height: 4, bgcolor: G[600] }} />

      <Box sx={{ p: 3 }}>

    
        <Paper elevation={0} sx={{
          p: 3, mb: 4, borderRadius: 3,
          bgcolor: '#ffffff', border: `1px solid ${G[200]}`,
          boxShadow: '0 2px 8px rgba(13,51,24,0.10)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: G[800], width: 46, height: 46, borderRadius: 2 }}>
              <ComplaintIcon sx={{ color: G[200], fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
                Complaint Management
              </Typography>
              <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
                Manage and track all student complaints
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchComplaints}
            sx={{
              bgcolor: G[700], color: '#ffffff', fontWeight: 600,
              borderRadius: 2, textTransform: 'none',
              boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
              '&:hover': { bgcolor: G[800] }
            }}
          >
            Refresh
          </Button>
        </Paper>

        
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Total Complaints" value={stats.total} icon={ComplaintIcon} dark />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Pending" value={stats.pending} icon={PendingIcon} valueColor="#B45309" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="In Progress" value={stats.inProgress} icon={InProgressIcon} valueColor="#0284C7" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Resolved" value={stats.resolved} icon={ResolvedIcon} valueColor={G[600]} />
          </Grid>
        </Grid>

        
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            placeholder="Search complaints by student name, title, hostel, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: G[400], fontSize: 20 }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#ffffff', borderRadius: 2.5,
                '& fieldset': { borderColor: G[200] },
                '&:hover fieldset': { borderColor: G[400] },
                '&.Mui-focused fieldset': { borderColor: G[600] },
              },
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={(e) => setFilterAnchor(e.currentTarget)}
            sx={{
              borderColor: G[200],
              color: G[600],
              px: 4,
              borderRadius: 2.5,
              textTransform: 'none',
              '&:hover': {
                borderColor: G[400],
                bgcolor: G[50]
              }
            }}
          >
            Filter
          </Button>
          <IconButton 
            onClick={fetchComplaints}
            sx={{
              bgcolor: '#ffffff', borderRadius: 2.5,
              border: `1px solid ${G[200]}`, color: G[600],
              '&:hover': { bgcolor: G[100], borderColor: G[400] }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

       
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={() => setFilterAnchor(null)}
          PaperProps={{
            sx: {
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
              borderRadius: 2.5,
              boxShadow: CARD_SHADOW,
              minWidth: 180
            }
          }}
        >
          <Typography sx={{ px: 2, pt: 1, pb: 0.5, color: G[500], fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em' }}>
            STATUS
          </Typography>
          <MenuItem onClick={() => { setStatusFilter('all'); setFilterAnchor(null); }} sx={{ color: G[700] }}>
            All Complaints
          </MenuItem>
          <MenuItem onClick={() => { setStatusFilter('pending'); setFilterAnchor(null); }} sx={{ color: '#B45309' }}>
            <PendingIcon sx={{ fontSize: 16, mr: 1 }} /> Pending
          </MenuItem>
          <MenuItem onClick={() => { setStatusFilter('in-progress'); setFilterAnchor(null); }} sx={{ color: '#0284C7' }}>
            <InProgressIcon sx={{ fontSize: 16, mr: 1 }} /> In Progress
          </MenuItem>
          <MenuItem onClick={() => { setStatusFilter('resolved'); setFilterAnchor(null); }} sx={{ color: G[600] }}>
            <ResolvedIcon sx={{ fontSize: 16, mr: 1 }} /> Resolved
          </MenuItem>
          
          <Divider sx={{ my: 1, borderColor: G[200] }} />
          
          <Typography sx={{ px: 2, pt: 1, pb: 0.5, color: G[500], fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em' }}>
            PRIORITY
          </Typography>
          <MenuItem onClick={() => { setPriorityFilter('all'); setFilterAnchor(null); }} sx={{ color: G[700] }}>
            All Priorities
          </MenuItem>
          <MenuItem onClick={() => { setPriorityFilter('high'); setFilterAnchor(null); }} sx={{ color: '#EF4444' }}>
            <PriorityIcon sx={{ fontSize: 16, mr: 1 }} /> High
          </MenuItem>
          <MenuItem onClick={() => { setPriorityFilter('medium'); setFilterAnchor(null); }} sx={{ color: '#B45309' }}>
            <PriorityIcon sx={{ fontSize: 16, mr: 1 }} /> Medium
          </MenuItem>
          <MenuItem onClick={() => { setPriorityFilter('low'); setFilterAnchor(null); }} sx={{ color: G[600] }}>
            <PriorityIcon sx={{ fontSize: 16, mr: 1 }} /> Low
          </MenuItem>
        </Menu>

        
        <TableContainer component={Paper} elevation={0} sx={{
          borderRadius: 3, bgcolor: '#ffffff',
          border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: G[50] }}>
                {['Student', 'Complaint', 'Category', 'Priority', 'Status', 'Date', 'Days Open', 'Actions'].map((col, i) => (
                  <TableCell key={col} align={i === 7 ? 'right' : 'left'} sx={{
                    color: G[700], fontWeight: 700, fontSize: '0.70rem',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    borderBottom: `2px solid ${G[200]}`, py: 1.75,
                  }}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => {
                  const statusInfo = getStatusColor(complaint.status);
                  const priorityInfo = getPriorityColor(complaint.priority);
                  const categoryInfo = getCategoryColor(complaint.category);
                  
                  return (
                    <TableRow key={complaint._id || complaint.id} hover sx={{
                      '&:hover': { bgcolor: G[50] },
                      '& td': { borderBottom: `1px solid ${G[100]}`, py: 1.75 }
                    }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{
                            bgcolor: G[100], color: G[700],
                            width: 38, height: 38,
                            border: `2px solid ${G[200]}`
                          }}>
                            {complaint.studentName?.charAt(0) || 'S'}
                          </Avatar>
                          <Box>
                            <Typography sx={{ color: G[800], fontWeight: 600, fontSize: '0.875rem' }}>
                              {complaint.studentName || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: G[500] }}>
                              {complaint.hostel || 'N/A'} • Room {complaint.room || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography sx={{ color: G[800], fontWeight: 500, fontSize: '0.85rem' }}>
                            {complaint.title || 'No Title'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: G[500], display: 'block' }}>
                            {complaint.description?.length > 60 ? `${complaint.description.substring(0, 60)}...` : complaint.description || 'No description'}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={complaint.category || 'General'}
                          size="small"
                          sx={{
                            bgcolor: categoryInfo.bg,
                            color: categoryInfo.color,
                            fontWeight: 600, fontSize: '0.72rem',
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={priorityInfo.text}
                          size="small"
                          sx={{
                            bgcolor: priorityInfo.bg,
                            color: priorityInfo.color,
                            fontWeight: 600, fontSize: '0.72rem',
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={statusInfo.text}
                          size="small"
                          icon={statusInfo.icon}
                          sx={{
                            bgcolor: statusInfo.bg,
                            color: statusInfo.color,
                            border: `1px solid ${statusInfo.color}40`,
                            fontWeight: 600, fontSize: '0.72rem',
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ color: G[600], fontSize: '0.85rem' }}>
                          {complaint.date || complaint.createdAt?.split('T')[0] || 'N/A'}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ color: G[600], fontSize: '0.85rem' }}>
                          {getDaysOpen(complaint.date || complaint.createdAt, complaint.status)}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => { setSelectedComplaint(complaint); setOpenDialog(true); }}
                            sx={{
                              color: G[600], bgcolor: G[100], borderRadius: 1.5, mr: 1,
                              border: `1px solid ${G[200]}`,
                              '&:hover': { bgcolor: G[200] }
                            }}
                          >
                            <ViewIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        {complaint.status !== 'resolved' && (
                          <>
                            <Tooltip title="Mark In Progress">
                              <IconButton
                                size="small"
                                onClick={() => handleStatusUpdate(complaint, 'in-progress')}
                                sx={{
                                  color: '#0284C7', bgcolor: '#E0F2FE', borderRadius: 1.5, mr: 1,
                                  border: '1px solid #BAE6FD',
                                  '&:hover': { bgcolor: '#BAE6FD' }
                                }}
                              >
                                <InProgressIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Mark Resolved">
                              <IconButton
                                size="small"
                                onClick={() => handleStatusUpdate(complaint, 'resolved')}
                                sx={{
                                  color: G[600], bgcolor: G[100], borderRadius: 1.5,
                                  border: `1px solid ${G[200]}`,
                                  '&:hover': { bgcolor: G[200] }
                                }}
                              >
                                <ResolvedIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography sx={{ color: G[400], mb: 2 }}>No complaints found</Typography>
                      <Button
                        variant="outlined"
                        onClick={fetchComplaints}
                        sx={{ borderColor: G[200], color: G[600] }}
                      >
                        Refresh
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
              boxShadow: '0 24px 48px rgba(13,51,24,0.15)',
            }
          }}
        >
          <Box sx={{ height: 4, bgcolor: G[600], borderRadius: '12px 12px 0 0' }} />
          <DialogTitle sx={{ pt: 2.5, pb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: G[800], width: 38, height: 38, borderRadius: 1.5 }}>
                  <ComplaintIcon sx={{ color: G[200], fontSize: 18 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
                  Complaint Details
                </Typography>
              </Box>
              <IconButton onClick={() => setOpenDialog(false)} sx={{ color: G[400] }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <Divider sx={{ borderColor: G[100] }} />
          <DialogContent sx={{ pt: 3 }}>
            {selectedComplaint && (
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" sx={{ color: G[500], fontWeight: 600 }}>Complaint ID</Typography>
                  <Typography sx={{ color: G[800], fontWeight: 500, mb: 1 }}>#{selectedComplaint._id || selectedComplaint.id}</Typography>
                  
                  <Typography variant="caption" sx={{ color: G[500], fontWeight: 600, mt: 1 }}>Student Name</Typography>
                  <Typography sx={{ color: G[800], fontWeight: 500, mb: 1 }}>{selectedComplaint.studentName || 'Unknown'}</Typography>
                  
                  <Typography variant="caption" sx={{ color: G[500], fontWeight: 600, mt: 1 }}>Student ID</Typography>
                  <Typography sx={{ color: G[800], fontWeight: 500, mb: 1 }}>{selectedComplaint.studentId || 'N/A'}</Typography>
                  
                  <Typography variant="caption" sx={{ color: G[500], fontWeight: 600, mt: 1 }}>Hostel & Room</Typography>
                  <Typography sx={{ color: G[800], fontWeight: 500, mb: 1 }}>{selectedComplaint.hostel || 'N/A'} - Room {selectedComplaint.room || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" sx={{ color: G[500], fontWeight: 600 }}>Category</Typography>
                  <Chip
                    label={selectedComplaint.category || 'General'}
                    size="small"
                    sx={{ mt: 0.5, mb: 1, bgcolor: getCategoryColor(selectedComplaint.category).bg, color: getCategoryColor(selectedComplaint.category).color }}
                  />
                  
                  <Typography variant="caption" sx={{ color: G[500], fontWeight: 600, mt: 1, display: 'block' }}>Priority</Typography>
                  <Chip
                    label={getPriorityColor(selectedComplaint.priority).text}
                    size="small"
                    sx={{ mt: 0.5, mb: 1, bgcolor: getPriorityColor(selectedComplaint.priority).bg, color: getPriorityColor(selectedComplaint.priority).color }}
                  />
                  
                  <Typography variant="caption" sx={{ color: G[500], fontWeight: 600, mt: 1, display: 'block' }}>Status</Typography>
                  <Chip
                    label={getStatusColor(selectedComplaint.status).text}
                    size="small"
                    sx={{ mt: 0.5, mb: 1, bgcolor: getStatusColor(selectedComplaint.status).bg, color: getStatusColor(selectedComplaint.status).color }}
                  />
                  
                  <Typography variant="caption" sx={{ color: G[500], fontWeight: 600, mt: 1, display: 'block' }}>Submitted On</Typography>
                  <Typography sx={{ color: G[800], fontWeight: 500, mb: 1 }}>{selectedComplaint.date || selectedComplaint.createdAt?.split('T')[0] || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: G[500], fontWeight: 600 }}>Title</Typography>
                  <Typography sx={{ color: G[800], fontWeight: 600, mb: 1 }}>{selectedComplaint.title || 'No Title'}</Typography>
                  
                  <Typography variant="caption" sx={{ color: G[500], fontWeight: 600, mt: 1 }}>Description</Typography>
                  <Paper sx={{ p: 2, bgcolor: G[50], mt: 0.5, borderRadius: 2 }}>
                    <Typography sx={{ color: G[700] }}>{selectedComplaint.description || 'No description provided'}</Typography>
                  </Paper>
                </Grid>
                {selectedComplaint.assignedTo && (
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: G[500], fontWeight: 600 }}>Assigned To</Typography>
                    <Typography sx={{ color: G[800], fontWeight: 500, mb: 1 }}>{selectedComplaint.assignedTo}</Typography>
                  </Grid>
                )}
                {selectedComplaint.resolvedDate && (
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: G[500], fontWeight: 600 }}>Resolved On</Typography>
                    <Typography sx={{ color: G[800], fontWeight: 500, mb: 1 }}>{selectedComplaint.resolvedDate}</Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: G[500], fontWeight: 600 }}>Status Timeline</Typography>
                  <Box sx={{ mt: 1 }}>
                    {selectedComplaint.timeline?.map((event, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1.5, alignItems: 'flex-start' }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: G[100], fontSize: '0.7rem', color: G[600] }}>
                          {index + 1}
                        </Avatar>
                        <Box>
                          <Typography sx={{ color: G[800], fontWeight: 500, fontSize: '0.85rem' }}>
                            {event.action}
                          </Typography>
                          <Typography variant="caption" sx={{ color: G[500] }}>
                            {event.date}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <Divider sx={{ borderColor: G[100] }} />
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{
              color: G[600], borderRadius: 2, textTransform: 'none', fontWeight: 600,
              border: `1px solid ${G[200]}`, px: 3,
              '&:hover': { bgcolor: G[50] }
            }}>
              Close
            </Button>
            {selectedComplaint && selectedComplaint.status !== 'resolved' && (
              <>
                {selectedComplaint.status !== 'in-progress' && (
                  <Button 
                    variant="contained" 
                    onClick={() => {
                      handleStatusUpdate(selectedComplaint, 'in-progress');
                    }}
                    sx={{
                      bgcolor: '#0284C7', color: '#ffffff', fontWeight: 600,
                      borderRadius: 2, textTransform: 'none', px: 3,
                      '&:hover': { bgcolor: '#0369A1' }
                    }}
                  >
                    Mark In Progress
                  </Button>
                )}
                <Button 
                  variant="contained" 
                  onClick={() => {
                    handleStatusUpdate(selectedComplaint, 'resolved');
                  }}
                  sx={{
                    bgcolor: G[700], color: '#ffffff', fontWeight: 600,
                    borderRadius: 2, textTransform: 'none', px: 3,
                    boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
                    '&:hover': { bgcolor: G[800] }
                  }}
                >
                  Mark Resolved
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>

        
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity={snackbarSeverity} sx={{ borderRadius: 2 }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

      </Box>
    </Box>
  );
};

export default AdminComplaints;