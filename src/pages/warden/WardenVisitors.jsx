import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  alpha,
  Divider,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  CheckCircleOutline as CheckInIcon,
  ExitToApp as CheckOutIcon
} from '@mui/icons-material';
import wardenService from '../../services/wardenService';
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
  50: '#F4FBF5',
};

const getStatusConfig = (status) => {
  switch(status) {
    case 'pending': return { label: 'Pending', color: '#F59E0B', bg: '#FEF3C7' };
    case 'approved': return { label: 'Approved', color: '#10B981', bg: '#ECFDF5' };
    case 'rejected': return { label: 'Rejected', color: '#EF4444', bg: '#FEF2F2' };
    case 'cancelled': return { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6' };
    case 'completed': return { label: 'Completed', color: '#6B7280', bg: '#F3F4F6' };
    default: return { label: status || 'Unknown', color: '#6B7280', bg: '#F3F4F6' };
  }
};

const WardenVisits = () => {
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [remark, setRemark] = useState('');
  const [timeSlot, setTimeSlot] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const response = await wardenService.getVisitRequests();
      console.log('Visits response:', response);
      
      let visitsData = [];
      if (response.success && response.data) {
        visitsData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        visitsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        visitsData = response.data;
      }
      
      setVisits(visitsData);
      filterByTab(tabValue, visitsData);
    } catch (error) {
      console.error('Error fetching visits:', error);
      toast.error('Failed to load visit requests');
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  const filterByTab = (tab, data = visits) => {
    let filtered = [...data];
    if (tab === 1) filtered = filtered.filter(v => v.status === 'pending');
    else if (tab === 2) filtered = filtered.filter(v => v.status === 'approved');
    else if (tab === 3) filtered = filtered.filter(v => v.status === 'rejected');
    else if (tab === 4) filtered = filtered.filter(v => v.status === 'completed');
    setFilteredVisits(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    filterByTab(newValue);
  };

  const handleApprove = async () => {
    try {
      const response = await wardenService.approveVisit(selectedVisit._id, {
        remarks: remark,
        timeSlot
      });
      if (response.success) {
        toast.success('Visit approved successfully');
        setOpenDialog(false);
        setRemark('');
        setTimeSlot({ start: '', end: '' });
        fetchVisits();
      } else {
        toast.error(response.message || 'Failed to approve');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to approve visit');
    }
  };

  const handleReject = async () => {
    if (!remark) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    try {
      const response = await wardenService.rejectVisit(selectedVisit._id, remark);
      if (response.success) {
        toast.success('Visit rejected');
        setOpenDialog(false);
        setRemark('');
        fetchVisits();
      } else {
        toast.error(response.message || 'Failed to reject');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to reject visit');
    }
  };

  const handleCheckIn = async (id) => {
    try {
      const response = await wardenService.markVisitCheckedIn(id);
      if (response.success) {
        toast.success('Visitor checked in');
        fetchVisits();
      } else {
        toast.error(response.message || 'Failed to check in');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to check in visitor');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      const response = await wardenService.markVisitCheckedOut(id);
      if (response.success) {
        toast.success('Visitor checked out');
        fetchVisits();
      } else {
        toast.error(response.message || 'Failed to check out');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to check out visitor');
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
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading visit requests...</Typography>
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
          <Typography variant="body2" sx={{ color: G[500], mt: 0.5 }}>
            Manage and approve student visit requests
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchVisits}
          sx={{ borderColor: G[200], color: G[600] }}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card sx={{ borderRadius: 3, bgcolor: G[800] }}>
            <CardContent>
              <Typography sx={{ color: G[300], fontSize: '0.7rem', textTransform: 'uppercase' }}>Total Requests</Typography>
              <Typography sx={{ fontWeight: 700, color: '#ffffff', fontSize: '2rem' }}>{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent>
              <Typography sx={{ color: G[600], fontSize: '0.7rem', textTransform: 'uppercase' }}>Pending</Typography>
              <Typography sx={{ fontWeight: 700, color: '#F59E0B', fontSize: '2rem' }}>{stats.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent>
              <Typography sx={{ color: G[600], fontSize: '0.7rem', textTransform: 'uppercase' }}>Approved</Typography>
              <Typography sx={{ fontWeight: 700, color: '#10B981', fontSize: '2rem' }}>{stats.approved}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent>
              <Typography sx={{ color: G[600], fontSize: '0.7rem', textTransform: 'uppercase' }}>Rejected</Typography>
              <Typography sx={{ fontWeight: 700, color: '#EF4444', fontSize: '2rem' }}>{stats.rejected}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent>
              <Typography sx={{ color: G[600], fontSize: '0.7rem', textTransform: 'uppercase' }}>Completed</Typography>
              <Typography sx={{ fontWeight: 700, color: '#6B7280', fontSize: '2rem' }}>{stats.completed}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ '& .MuiTabs-indicator': { bgcolor: G[600] } }}
        >
          <Tab label={<Badge badgeContent={stats.total} color="primary">All</Badge>} />
          <Tab label={<Badge badgeContent={stats.pending} color="warning">Pending</Badge>} />
          <Tab label={<Badge badgeContent={stats.approved} color="success">Approved</Badge>} />
          <Tab label={<Badge badgeContent={stats.rejected} color="error">Rejected</Badge>} />
          <Tab label={<Badge badgeContent={stats.completed} color="secondary">Completed</Badge>} />
        </Tabs>
      </Paper>

      {/* Visits List */}
      {filteredVisits.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3, border: `1px solid ${G[200]}` }}>
          <ScheduleIcon sx={{ fontSize: 80, color: G[400], mb: 2 }} />
          <Typography variant="h6" sx={{ color: G[600], mb: 1 }}>
            No Visit Requests
          </Typography>
          <Typography variant="body2" sx={{ color: G[500] }}>
            {tabValue === 1 ? 'No pending visit requests' : 
             tabValue === 2 ? 'No approved visits' :
             tabValue === 3 ? 'No rejected visits' :
             tabValue === 4 ? 'No completed visits' :
             'No visit requests found'}
          </Typography>
          {tabValue === 0 && visits.length === 0 && (
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ mt: 2, bgcolor: G[700] }}
            >
              Refresh
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredVisits.map((visit) => {
            const statusConfig = getStatusConfig(visit.status);
            const studentName = visit.studentId?.user?.name || visit.studentName || 'Unknown';
            const studentRoom = visit.roomNumber || 'N/A';
            
            return (
              <Grid size={{ xs: 12, md: 6 }} key={visit._id}>
                <Card sx={{ borderRadius: 3, border: `1px solid ${G[200]}`, '&:hover': { boxShadow: 3 } }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: G[100], color: G[700] }}>
                          {studentName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">{studentName}</Typography>
                          <Typography variant="caption" color="textSecondary">Room {studentRoom}</Typography>
                        </Box>
                      </Box>
                      <Chip label={statusConfig.label} size="small" sx={{ bgcolor: statusConfig.bg, color: statusConfig.color }} />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="textSecondary">Visitor</Typography>
                        <Typography variant="body2" fontWeight="500">{visit.visitorName}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="textSecondary">Relation</Typography>
                        <Typography variant="body2">{visit.relation}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="textSecondary">Phone</Typography>
                        <Typography variant="body2">{visit.visitorPhone}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="textSecondary">Date</Typography>
                        <Typography variant="body2">{new Date(visit.visitDate).toLocaleDateString()}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="textSecondary">Purpose</Typography>
                        <Typography variant="body2">{visit.purpose}</Typography>
                      </Grid>
                    </Grid>

                    {visit.wardenRemark && (
                      <Box sx={{ mt: 2, p: 1.5, bgcolor: G[50], borderRadius: 2 }}>
                        <Typography variant="caption" color="textSecondary">Remark</Typography>
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
                        <>
                          <Tooltip title="Approve">
                            <IconButton 
                              size="small" 
                              onClick={() => { setSelectedVisit(visit); setOpenDialog(true); }} 
                              sx={{ color: '#10B981' }}
                            >
                              <ApproveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton 
                              size="small" 
                              onClick={() => { setSelectedVisit(visit); setOpenDialog(true); }} 
                              sx={{ color: '#EF4444' }}
                            >
                              <RejectIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      
                      {visit.status === 'approved' && (
                        <>
                          {!visit.checkInTime && (
                            <Tooltip title="Check In">
                              <IconButton size="small" onClick={() => handleCheckIn(visit._id)} sx={{ color: '#10B981' }}>
                                <CheckInIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {visit.checkInTime && !visit.checkOutTime && (
                            <Tooltip title="Check Out">
                              <IconButton size="small" onClick={() => handleCheckOut(visit._id)} sx={{ color: '#F59E0B' }}>
                                <CheckOutIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Approve/Reject Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <Box sx={{ height: 4, bgcolor: G[600] }} />
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {selectedVisit?.status === 'pending' ? 'Review Visit Request' : 'Visit Details'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedVisit && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Student</Typography>
                  <Typography variant="body2" fontWeight="bold">{selectedVisit.studentId?.user?.name || selectedVisit.studentName}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Room</Typography>
                  <Typography variant="body2">{selectedVisit.roomNumber}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Visitor</Typography>
                  <Typography variant="body2">{selectedVisit.visitorName}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="textSecondary">Relation</Typography>
                  <Typography variant="body2">{selectedVisit.relation}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="textSecondary">Purpose</Typography>
                  <Typography variant="body2">{selectedVisit.purpose}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Remark" multiline rows={2} value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Add remarks or instructions..." />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="textSecondary">Time Slot (Optional)</Typography>
                  <Box display="flex" gap={2} mt={1}>
                    <TextField size="small" type="time" label="Start" value={timeSlot.start} onChange={(e) => setTimeSlot({ ...timeSlot, start: e.target.value })} InputLabelProps={{ shrink: true }} />
                    <TextField size="small" type="time" label="End" value={timeSlot.end} onChange={(e) => setTimeSlot({ ...timeSlot, end: e.target.value })} InputLabelProps={{ shrink: true }} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          {selectedVisit?.status === 'pending' && (
            <>
              <Button variant="contained" onClick={handleReject} sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}>
                Reject
              </Button>
              <Button variant="contained" onClick={handleApprove} sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] } }}>
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WardenVisits;