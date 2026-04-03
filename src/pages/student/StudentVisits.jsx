import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  alpha,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  QrCode as QrCodeIcon
} from '@mui/icons-material';
import studentService from '../../services/studentService';
import toast from 'react-hot-toast';

// ==================== Green Design Tokens ====================
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

const getStatusConfig = (status) => {
  switch(status) {
    case 'pending': return { label: 'Pending', color: '#F59E0B', bg: '#FEF3C7', icon: <ScheduleIcon sx={{ fontSize: '14px' }} /> };
    case 'approved': return { label: 'Approved', color: '#10B981', bg: '#ECFDF5', icon: <CheckCircleIcon sx={{ fontSize: '14px' }} /> };
    case 'rejected': return { label: 'Rejected', color: '#EF4444', bg: '#FEF2F2', icon: <CancelIcon sx={{ fontSize: '14px' }} /> };
    case 'cancelled': return { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6', icon: <CancelIcon sx={{ fontSize: '14px' }} /> };
    case 'completed': return { label: 'Completed', color: '#6B7280', bg: '#F3F4F6', icon: <CheckCircleIcon sx={{ fontSize: '14px' }} /> };
    default: return { label: status || 'Unknown', color: '#6B7280', bg: '#F3F4F6', icon: <ScheduleIcon sx={{ fontSize: '14px' }} /> };
  }
};

const StudentVisits = () => {
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [formData, setFormData] = useState({
    visitorName: '',
    relation: '',
    visitorPhone: '',
    visitDate: '',
    visitTime: '',
    purpose: '',
    numberOfVisitors: 1
  });

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const response = await studentService.getVisits();
      console.log('Visits response:', response);
      
      // Handle different response structures
      let visitsData = [];
      if (response && response.success && response.data) {
        // Response has success and data properties
        visitsData = Array.isArray(response.data) ? response.data : [];
        console.log('Extracted from response.data:', visitsData);
      } else if (Array.isArray(response)) {
        // Response is directly an array
        visitsData = response;
        console.log('Direct array:', visitsData);
      } else if (response && response.data && Array.isArray(response.data)) {
        // Response.data is array
        visitsData = response.data;
        console.log('Response.data array:', visitsData);
      } else if (response && response.visits && Array.isArray(response.visits)) {
        // Response has visits property
        visitsData = response.visits;
        console.log('Response.visits array:', visitsData);
      }
      
      setVisits(visitsData);
      console.log('Final visits set:', visitsData.length);
    } catch (error) {
      console.error('Error fetching visits:', error);
      toast.error('Failed to load visits');
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.visitorName || !formData.relation || !formData.visitorPhone || !formData.visitDate) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const response = await studentService.requestVisit(formData);
      console.log('Request response:', response);
      
      if (response && response.success) {
        toast.success('Visit request sent successfully');
        setOpenDialog(false);
        setFormData({
          visitorName: '',
          relation: '',
          visitorPhone: '',
          visitDate: '',
          visitTime: '',
          purpose: '',
          numberOfVisitors: 1
        });
        fetchVisits();
      } else {
        toast.error(response?.message || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    
    try {
      const response = await studentService.cancelVisit(id);
      if (response && response.success) {
        toast.success('Visit request cancelled');
        fetchVisits();
      } else {
        toast.error(response?.message || 'Failed to cancel');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to cancel request');
    }
  };

  const stats = {
    total: visits.length,
    pending: visits.filter(v => v.status === 'pending').length,
    approved: visits.filter(v => v.status === 'approved').length,
    rejected: visits.filter(v => v.status === 'rejected').length,
    completed: visits.filter(v => v.status === 'completed').length
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading visits...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: G[800] }}>
            Visit Management
          </Typography>
          <Typography variant="body2" sx={{ color: G[500] }}>
            Request and track visitor visits
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] } }}
        >
          Request Visit
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, bgcolor: G[800] }}>
            <CardContent>
              <Typography sx={{ color: G[300], fontSize: '0.7rem', textTransform: 'uppercase' }}>Total Requests</Typography>
              <Typography sx={{ fontWeight: 700, color: '#ffffff', fontSize: '2rem' }}>{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent>
              <Typography sx={{ color: G[600], fontSize: '0.7rem', textTransform: 'uppercase' }}>Pending</Typography>
              <Typography sx={{ fontWeight: 700, color: '#F59E0B', fontSize: '2rem' }}>
                {stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent>
              <Typography sx={{ color: G[600], fontSize: '0.7rem', textTransform: 'uppercase' }}>Approved</Typography>
              <Typography sx={{ fontWeight: 700, color: '#10B981', fontSize: '2rem' }}>
                {stats.approved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent>
              <Typography sx={{ color: G[600], fontSize: '0.7rem', textTransform: 'uppercase' }}>Completed</Typography>
              <Typography sx={{ fontWeight: 700, color: '#6B7280', fontSize: '2rem' }}>
                {stats.completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Visits List */}
      {visits.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: `1px solid ${G[200]}` }}>
          <ScheduleIcon sx={{ fontSize: 80, color: G[400], mb: 2 }} />
          <Typography variant="h6" sx={{ color: G[600], mb: 1 }}>
            No Visit Requests Yet
          </Typography>
          <Typography variant="body2" sx={{ color: G[500] }}>
            Click the button above to request a visit or check back later for parent requests
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {visits.map((visit) => {
            const statusConfig = getStatusConfig(visit.status);
            return (
              <Grid size={{ xs: 12, md: 6 }} key={visit._id}>
                <Card sx={{ borderRadius: 3, border: `1px solid ${G[200]}`, '&:hover': { boxShadow: 3 } }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: alpha(statusConfig.color, 0.1), color: statusConfig.color }}>
                          {statusConfig.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">{visit.visitorName}</Typography>
                          <Typography variant="caption" color="textSecondary">{visit.relation}</Typography>
                        </Box>
                      </Box>
                      <Chip label={statusConfig.label} size="small" sx={{ bgcolor: statusConfig.bg, color: statusConfig.color }} />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={1}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="textSecondary">Phone</Typography>
                        <Typography variant="body2">{visit.visitorPhone}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="textSecondary">Visit Date</Typography>
                        <Typography variant="body2">{visit.visitDate ? new Date(visit.visitDate).toLocaleDateString() : 'Not set'}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="textSecondary">Purpose</Typography>
                        <Typography variant="body2">{visit.purpose}</Typography>
                      </Grid>
                      {visit.numberOfVisitors > 1 && (
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="caption" color="textSecondary">Visitors</Typography>
                          <Typography variant="body2">{visit.numberOfVisitors} people</Typography>
                        </Grid>
                      )}
                    </Grid>

                    {visit.wardenRemark && (
                      <Box sx={{ mt: 2, p: 1.5, bgcolor: G[50], borderRadius: 2 }}>
                        <Typography variant="caption" color="textSecondary">Warden Remark</Typography>
                        <Typography variant="body2">{visit.wardenRemark}</Typography>
                      </Box>
                    )}

                    <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => setSelectedVisit(visit)} sx={{ color: G[600] }}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {visit.status === 'pending' && (
                        <Tooltip title="Cancel Request">
                          <IconButton size="small" onClick={() => handleCancel(visit._id)} sx={{ color: '#EF4444' }}>
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {visit.status === 'approved' && visit.gatePassId && (
                        <Tooltip title="Download Gate Pass">
                          <IconButton size="small" onClick={() => toast.success('Gate pass download started')} sx={{ color: G[600] }}>
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Request Visit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <Box sx={{ height: 4, bgcolor: G[600] }} />
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Request a Visit</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Visitor Name" value={formData.visitorName} onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Relation</InputLabel>
                <Select value={formData.relation} onChange={(e) => setFormData({ ...formData, relation: e.target.value })} label="Relation">
                  <MenuItem value="Father">Father</MenuItem>
                  <MenuItem value="Mother">Mother</MenuItem>
                  <MenuItem value="Sibling">Sibling</MenuItem>
                  <MenuItem value="Friend">Friend</MenuItem>
                  <MenuItem value="Relative">Relative</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Phone Number" value={formData.visitorPhone} onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth type="date" label="Visit Date" value={formData.visitDate} onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })} InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth type="time" label="Visit Time" value={formData.visitTime} onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={2} label="Purpose" value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} required />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth type="number" label="Number of Visitors" value={formData.numberOfVisitors} onChange={(e) => setFormData({ ...formData, numberOfVisitors: parseInt(e.target.value) })} inputProps={{ min: 1, max: 5 }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: G[700] }}>Submit Request</Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={!!selectedVisit} onClose={() => setSelectedVisit(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Visit Details</DialogTitle>
        <DialogContent>
          {selectedVisit && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Gate Pass ID</Typography>
              <Typography variant="body1" gutterBottom>{selectedVisit.gatePassId || 'Pending'}</Typography>
              <Typography variant="subtitle2" color="textSecondary">Visitor</Typography>
              <Typography variant="body1">{selectedVisit.visitorName} ({selectedVisit.relation})</Typography>
              <Typography variant="subtitle2" color="textSecondary">Contact</Typography>
              <Typography variant="body1">{selectedVisit.visitorPhone}</Typography>
              <Typography variant="subtitle2" color="textSecondary">Date & Time</Typography>
              <Typography variant="body1">{selectedVisit.visitDate ? new Date(selectedVisit.visitDate).toLocaleDateString() : 'Not set'} {selectedVisit.visitTime}</Typography>
              <Typography variant="subtitle2" color="textSecondary">Purpose</Typography>
              <Typography variant="body1">{selectedVisit.purpose}</Typography>
              {selectedVisit.wardenRemark && (
                <>
                  <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Warden Remark</Typography>
                  <Paper sx={{ p: 2, bgcolor: G[50] }}>{selectedVisit.wardenRemark}</Paper>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedVisit(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentVisits;