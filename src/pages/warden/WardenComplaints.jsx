import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Alert,
  Snackbar,
  Divider,
  LinearProgress,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as ResolvedIcon,
  Comment as CommentIcon,
  Assignment as AssignmentIcon,
  Send as SendIcon,
  Close as CloseIcon,
  ReportProblem as ComplaintIcon,
  Person as PersonIcon,
  Room as RoomIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

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

const WardenComplaints = () => {
  const { token } = useAuth();
  
  // State
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [remark, setRemark] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [updating, setUpdating] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0
  });

  // Fetch complaints from backend
  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching complaints from backend...');
      
      const response = await axios.get(`${API_URL}/warden/complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Complaints response:', response.data);

      let complaintsData = [];
      if (response.data.success && response.data.data) {
        complaintsData = response.data.data;
      } else if (response.data.success && response.data.complaints) {
        complaintsData = response.data.complaints;
      } else if (Array.isArray(response.data)) {
        complaintsData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        complaintsData = response.data.data;
      }
      
      console.log(`📊 Found ${complaintsData.length} complaints`);
      
      if (complaintsData.length > 0) {
        const transformedComplaints = complaintsData.map(complaint => ({
          id: complaint._id || complaint.id,
          _id: complaint._id || complaint.id,
          complaintNumber: complaint.complaintNumber || `CMP-${String(complaint._id).slice(-6)}`,
          student: complaint.student?.user?.name || complaint.student?.name || complaint.studentName || "Unknown Student",
          studentId: complaint.student?._id || complaint.studentId,
          room: complaint.location?.room || complaint.room?.roomNumber || complaint.roomNumber || complaint.room || "N/A",
          block: complaint.location?.block || complaint.room?.block || complaint.block || "",
          category: complaint.category || 'other',
          issue: complaint.title || complaint.issue || 'No Title',
          description: complaint.description || 'No description provided',
          status: complaint.status || 'pending',
          priority: complaint.priority || 'medium',
          date: complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          createdAt: complaint.createdAt,
          timeline: complaint.timeline || []
        }));

        setComplaints(transformedComplaints);
        setFilteredComplaints(transformedComplaints);
        calculateStats(transformedComplaints);
      } else {
        setComplaints([]);
        setFilteredComplaints([]);
        calculateStats([]);
      }
      
    } catch (error) {
      console.error('❌ Error fetching complaints:', error);
      showSnackbar(error.response?.data?.message || 'Failed to load complaints', 'error');
      setComplaints([]);
      setFilteredComplaints([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchComplaints();
    }
  }, [token, fetchComplaints]);

  // Calculate stats
  const calculateStats = (complaintsArray) => {
    const newStats = {
      total: complaintsArray.length,
      pending: complaintsArray.filter(c => c.status === 'pending').length,
      inProgress: complaintsArray.filter(c => c.status === 'in-progress').length,
      resolved: complaintsArray.filter(c => c.status === 'resolved').length,
      highPriority: complaintsArray.filter(c => c.priority === 'high' || c.priority === 'urgent').length
    };
    setStats(newStats);
  };

  // Filter complaints
  useEffect(() => {
    let filtered = [...complaints];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.student?.toLowerCase().includes(term) ||
        c.room?.toLowerCase().includes(term) ||
        c.issue?.toLowerCase().includes(term) ||
        c.complaintNumber?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(c => c.category === categoryFilter);
    }

    setFilteredComplaints(filtered);
  }, [complaints, searchTerm, statusFilter, categoryFilter]);

  // Handlers
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    setUpdating(true);
    try {
      const response = await axios.put(
        `${API_URL}/warden/complaints/${complaintId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedComplaints = complaints.map(c => 
          c.id === complaintId ? { ...c, status: newStatus } : c
        );
        setComplaints(updatedComplaints);
        calculateStats(updatedComplaints);
        showSnackbar(`Complaint marked as ${newStatus === 'in-progress' ? 'In Progress' : newStatus}`, 'success');
        
        if (selectedComplaint && selectedComplaint.id === complaintId) {
          setSelectedComplaint({ ...selectedComplaint, status: newStatus });
        }
      } else {
        showSnackbar(response.data.message || 'Failed to update complaint', 'error');
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      showSnackbar(error.response?.data?.message || 'Failed to update complaint', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddRemark = async () => {
    if (!remark.trim()) return;
    
    setUpdating(true);
    try {
      const response = await axios.post(
        `${API_URL}/warden/complaints/${selectedComplaint.id}/remark`,
        { remark: remark },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const newRemark = {
          status: selectedComplaint.status,
          remark: remark,
          updatedBy: 'Warden',
          updatedAt: new Date().toISOString()
        };

        const updatedComplaints = complaints.map(c => 
          c.id === selectedComplaint.id 
            ? { ...c, timeline: [...(c.timeline || []), newRemark] } 
            : c
        );

        setComplaints(updatedComplaints);
        setSelectedComplaint({
          ...selectedComplaint,
          timeline: [...(selectedComplaint.timeline || []), newRemark]
        });
        setRemark('');
        showSnackbar('Remark added successfully', 'success');
      } else {
        showSnackbar(response.data.message || 'Failed to add remark', 'error');
      }
    } catch (error) {
      console.error('Error adding remark:', error);
      showSnackbar('Failed to add remark', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f97316';
      case 'in-progress': return '#3b82f6';
      case 'resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'pending': return '#fff7ed';
      case 'in-progress': return '#eff6ff';
      case 'resolved': return '#ecfdf5';
      default: return '#f3f4f6';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent':
      case 'high': return '#ef4444';
      case 'medium': return '#f97316';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCategoryLabel = (category) => {
    const categories = {
      electrical: 'Electrical',
      plumbing: 'Plumbing',
      carpentry: 'Carpentry',
      cleaning: 'Cleaning',
      food: 'Food',
      room: 'Room',
      security: 'Security',
      harassment: 'Harassment',
      medical: 'Medical',
      other: 'Other'
    };
    return categories[category] || category;
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
    <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
      {/* Top accent bar */}
      <Box sx={{ height: 4, bgcolor: G[600], mb: 3, borderRadius: 2 }} />

      {/* Header */}
      <Paper elevation={0} sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        bgcolor: '#ffffff',
        border: `1px solid ${G[200]}`,
        boxShadow: '0 2px 8px rgba(13,51,24,0.10)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
              Manage and resolve student complaints
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchComplaints}
          sx={{
            bgcolor: G[700],
            color: '#ffffff',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
            '&:hover': { bgcolor: G[800] }
          }}
        >
          Refresh
        </Button>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 3, bgcolor: G[800], border: `1px solid ${G[700]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ color: G[300], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
                Total Complaints
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#ffffff', fontSize: '2rem' }}>
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
                Pending
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#f97316', fontSize: '2rem' }}>
                {stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
                In Progress
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#3b82f6', fontSize: '2rem' }}>
                {stats.inProgress}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
                Resolved
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#10b981', fontSize: '2rem' }}>
                {stats.resolved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
                High Priority
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#ef4444', fontSize: '2rem' }}>
                {stats.highPriority}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by student, room, or issue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: G[400] }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="electrical">Electrical</MenuItem>
                <MenuItem value="plumbing">Plumbing</MenuItem>
                <MenuItem value="carpentry">Carpentry</MenuItem>
                <MenuItem value="cleaning">Cleaning</MenuItem>
                <MenuItem value="food">Food</MenuItem>
                <MenuItem value="room">Room</MenuItem>
                <MenuItem value="security">Security</MenuItem>
                <MenuItem value="harassment">Harassment</MenuItem>
                <MenuItem value="medical">Medical</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="textSecondary" align="center">
              {filteredComplaints.length} complaint{filteredComplaints.length !== 1 ? 's' : ''} found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Complaints Table */}
      <TableContainer component={Paper} elevation={0} sx={{
        borderRadius: 3,
        bgcolor: '#ffffff',
        border: `1px solid ${G[200]}`,
        boxShadow: '0 1px 4px rgba(30,122,53,0.10), 0 0 0 1px rgba(30,122,53,0.08)'
      }}>
        <Table>
          <TableHead sx={{ bgcolor: G[50] }}>
            <TableRow>
              <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Complaint #</TableCell>
              <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Student</TableCell>
              <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Issue/Room</TableCell>
              <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Category</TableCell>
              <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Priority</TableCell>
              <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Status</TableCell>
              <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Date</TableCell>
              <TableCell align="center" sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredComplaints.map((complaint) => (
              <TableRow 
                key={complaint.id} 
                hover 
                sx={{ 
                  '&:hover': { bgcolor: G[50] },
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setSelectedComplaint(complaint);
                  setOpenDialog(true);
                }}
              >
                <TableCell sx={{ color: G[800], fontWeight: 600 }}>{complaint.complaintNumber}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: G[100], fontSize: '0.7rem', color: G[700] }}>
                      {complaint.student?.charAt(0) || '?'}
                    </Avatar>
                    <Typography variant="body2" sx={{ color: G[700] }}>{complaint.student}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: G[800] }}>
                    {complaint.issue.length > 35 ? `${complaint.issue.substring(0, 35)}...` : complaint.issue}
                  </Typography>
                  <Typography variant="caption" sx={{ color: G[500] }}>
                    Room {complaint.room} {complaint.block && `- Block ${complaint.block}`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getCategoryLabel(complaint.category)}
                    size="small"
                    sx={{ bgcolor: alpha(G[600], 0.1), color: G[600], fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={complaint.priority}
                    size="small"
                    sx={{ 
                      bgcolor: alpha(getPriorityColor(complaint.priority), 0.1),
                      color: getPriorityColor(complaint.priority),
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={complaint.status}
                    size="small"
                    sx={{ 
                      bgcolor: getStatusBg(complaint.status),
                      color: getStatusColor(complaint.status),
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: G[600] }}>{complaint.date}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    <Tooltip title="Add Remark">
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedComplaint(complaint);
                          setOpenDialog(true);
                        }}
                        sx={{ color: G[600], bgcolor: G[100], borderRadius: 1.5 }}
                      >
                        <CommentIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    {complaint.status === 'pending' && (
                      <Tooltip title="Mark In Progress">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(complaint.id, 'in-progress');
                          }}
                          disabled={updating}
                          sx={{ color: '#3b82f6', bgcolor: '#eff6ff', borderRadius: 1.5 }}
                        >
                          <AssignmentIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {(complaint.status === 'pending' || complaint.status === 'in-progress') && (
                      <Tooltip title="Mark Resolved">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(complaint.id, 'resolved');
                          }}
                          disabled={updating}
                          sx={{ color: '#10b981', bgcolor: '#ecfdf5', borderRadius: 1.5 }}
                        >
                          <ResolvedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {filteredComplaints.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <ComplaintIcon sx={{ fontSize: 48, color: G[400], mb: 1 }} />
                    <Typography sx={{ color: G[600] }}>No complaints found</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Complaint Details Dialog */}
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
        {selectedComplaint && (
          <>
            <Box sx={{ height: 4, bgcolor: G[600], borderRadius: '12px 12px 0 0' }} />
            <DialogTitle sx={{ bgcolor: G[50], borderBottom: `1px solid ${G[100]}` }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: G[800] }}>
                    Complaint Details
                  </Typography>
                  <Typography variant="caption" sx={{ color: G[500] }}>
                    {selectedComplaint.complaintNumber}
                  </Typography>
                </Box>
                <Chip 
                  label={selectedComplaint.status}
                  sx={{ 
                    bgcolor: getStatusBg(selectedComplaint.status),
                    color: getStatusColor(selectedComplaint.status),
                    fontWeight: 600
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: G[500] }}>Student</Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Avatar sx={{ bgcolor: G[600], width: 32, height: 32 }}>
                      {selectedComplaint.student?.charAt(0) || '?'}
                    </Avatar>
                    <Typography variant="body1" fontWeight="bold" sx={{ color: G[800] }}>
                      {selectedComplaint.student}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: G[500] }}>Room</Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: G[800], mt: 0.5 }}>
                    Room {selectedComplaint.room} {selectedComplaint.block && `- Block ${selectedComplaint.block}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: G[500] }}>Category</Typography>
                  <Chip 
                    label={getCategoryLabel(selectedComplaint.category)}
                    size="small"
                    sx={{ mt: 0.5, bgcolor: alpha(G[600], 0.1), color: G[600] }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: G[500] }}>Priority</Typography>
                  <Chip 
                    label={selectedComplaint.priority}
                    size="small"
                    sx={{ 
                      mt: 0.5,
                      bgcolor: alpha(getPriorityColor(selectedComplaint.priority), 0.1),
                      color: getPriorityColor(selectedComplaint.priority),
                      fontWeight: 600
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: G[500] }}>Issue</Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: G[800], mt: 0.5 }}>
                    {selectedComplaint.issue}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: G[500] }}>Description</Typography>
                  <Paper sx={{ p: 2, bgcolor: G[50], mt: 1, borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: G[700] }}>{selectedComplaint.description}</Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2, borderColor: G[100] }} />
                  <Typography variant="h6" gutterBottom sx={{ color: G[800] }}>Timeline</Typography>
                  {selectedComplaint.timeline?.length > 0 ? (
                    selectedComplaint.timeline.map((entry, index) => (
                      <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: G[50], borderRadius: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Chip 
                            label={entry.status}
                            size="small"
                            sx={{ 
                              bgcolor: getStatusBg(entry.status),
                              color: getStatusColor(entry.status),
                              fontWeight: 600
                            }}
                          />
                          <Typography variant="caption" sx={{ color: G[500] }}>
                            {new Date(entry.updatedAt).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: G[700] }}>{entry.remark}</Typography>
                        <Typography variant="caption" sx={{ color: G[500] }}>
                          By: {entry.updatedBy || 'System'}
                        </Typography>
                      </Paper>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ color: G[500] }}>
                      No timeline entries yet
                    </Typography>
                  )}
                  
                  <Box mt={3}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: G[800], mb: 1 }}>
                      Add Remark
                    </Typography>
                    <Box display="flex" gap={2}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter remark..."
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        multiline
                        rows={2}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '& fieldset': { borderColor: G[200] },
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={handleAddRemark}
                        disabled={!remark.trim() || updating}
                        sx={{ 
                          alignSelf: 'flex-end', 
                          bgcolor: G[700],
                          '&:hover': { bgcolor: G[800] }
                        }}
                      >
                        Add
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1 }}>
              <Button onClick={() => setOpenDialog(false)} sx={{ color: G[600] }}>
                Close
              </Button>
              {selectedComplaint.status !== 'resolved' && (
                <Button 
                  variant="contained" 
                  onClick={() => {
                    const newStatus = selectedComplaint.status === 'pending' ? 'in-progress' : 'resolved';
                    handleStatusChange(selectedComplaint.id, newStatus);
                    if (newStatus === 'resolved') setOpenDialog(false);
                  }}
                  disabled={updating}
                  sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                >
                  {selectedComplaint.status === 'pending' ? 'Start Working' : 'Mark Resolved'}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WardenComplaints;