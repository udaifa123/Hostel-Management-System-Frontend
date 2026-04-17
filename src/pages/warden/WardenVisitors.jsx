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
  Refresh as RefreshIcon,
  CheckCircleOutline as CheckInIcon,
  ExitToApp as CheckOutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

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

const CARD_SHADOW = '0 1px 4px rgba(30,122,53,0.10), 0 0 0 1px rgba(30,122,53,0.08)';

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
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [remark, setRemark] = useState('');
  const [timeSlot, setTimeSlot] = useState({ start: '', end: '' });
  const [actionType, setActionType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchVisits();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
    if (severity === 'success') toast.success(message);
    else if (severity === 'error') toast.error(message);
    else toast(message);
  };

  const fetchVisits = async () => {
    setLoading(true);
    try {
      console.log('Fetching all visit requests...');
      
      const pendingResponse = await axios.get(`${API_URL}/warden/visitors/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Pending visits response:', pendingResponse.data);
      
      const approvedResponse = await axios.get(`${API_URL}/warden/visitors/approved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Approved visits response:', approvedResponse.data);
      
      const rejectedResponse = await axios.get(`${API_URL}/warden/visitors/rejected`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Rejected visits response:', rejectedResponse.data);
      
      const completedResponse = await axios.get(`${API_URL}/warden/visitors/completed`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Completed visits response:', completedResponse.data);
      
      let pendingData = [];
      let approvedData = [];
      let rejectedData = [];
      let completedData = [];
      
      if (pendingResponse.data && pendingResponse.data.success && pendingResponse.data.data) {
        pendingData = pendingResponse.data.data;
      } else if (pendingResponse.data && Array.isArray(pendingResponse.data)) {
        pendingData = pendingResponse.data;
      }
      
      if (approvedResponse.data && approvedResponse.data.success && approvedResponse.data.data) {
        approvedData = approvedResponse.data.data;
      } else if (approvedResponse.data && Array.isArray(approvedResponse.data)) {
        approvedData = approvedResponse.data;
      }
      
      if (rejectedResponse.data && rejectedResponse.data.success && rejectedResponse.data.data) {
        rejectedData = rejectedResponse.data.data;
      } else if (rejectedResponse.data && Array.isArray(rejectedResponse.data)) {
        rejectedData = rejectedResponse.data;
      }
      
      if (completedResponse.data && completedResponse.data.success && completedResponse.data.data) {
        completedData = completedResponse.data.data;
      } else if (completedResponse.data && Array.isArray(completedResponse.data)) {
        completedData = completedResponse.data;
      }
      
      const allVisits = [...pendingData, ...approvedData, ...rejectedData, ...completedData];
      console.log('All visits:', allVisits);
      console.log('Stats - Pending:', pendingData.length, 'Approved:', approvedData.length, 'Rejected:', rejectedData.length, 'Completed:', completedData.length);
      
      setVisits(allVisits);
      filterByTab(tabValue, allVisits);
      
    } catch (error) {
      console.error('Error fetching visits:', error);
      try {
        console.log('Trying fallback endpoints...');
        const pendingResponse = await axios.get(`${API_URL}/warden/visitors/pending`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const activeResponse = await axios.get(`${API_URL}/warden/visitors/active`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let pendingData = [];
        let activeData = [];
        
        if (pendingResponse.data && pendingResponse.data.success && pendingResponse.data.data) {
          pendingData = pendingResponse.data.data;
        } else if (pendingResponse.data && Array.isArray(pendingResponse.data)) {
          pendingData = pendingResponse.data;
        }
        
        if (activeResponse.data && activeResponse.data.success && activeResponse.data.data) {
          activeData = activeResponse.data.data;
        } else if (activeResponse.data && Array.isArray(activeResponse.data)) {
          activeData = activeResponse.data;
        }
        
        const allVisits = [...pendingData, ...activeData];
        setVisits(allVisits);
        filterByTab(tabValue, allVisits);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        showSnackbar('Failed to load visit requests', 'error');
        setVisits([]);
        setFilteredVisits([]);
      }
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
    if (!selectedVisit) return;
    
    try {
      const response = await axios.put(`${API_URL}/warden/visitors/${selectedVisit._id}/approve`, {
        remarks: remark,
        meetingLocation: remark || 'Visitor Room',
        timeSlot
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.success) {
        showSnackbar('Visit approved successfully', 'success');
        setOpenDialog(false);
        setRemark('');
        setTimeSlot({ start: '', end: '' });
        fetchVisits();
      } else {
        showSnackbar(response.data?.message || 'Failed to approve', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar(error.response?.data?.message || 'Failed to approve visit', 'error');
    }
  };

  const handleReject = async () => {
    if (!selectedVisit) return;
    if (!remark) {
      showSnackbar('Please provide a reason for rejection', 'error');
      return;
    }
    
    try {
      const response = await axios.put(`${API_URL}/warden/visitors/${selectedVisit._id}/reject`, {
        remarks: remark
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.success) {
        showSnackbar('Visit rejected', 'success');
        setOpenDialog(false);
        setRemark('');
        fetchVisits();
      } else {
        showSnackbar(response.data?.message || 'Failed to reject', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar(error.response?.data?.message || 'Failed to reject visit', 'error');
    }
  };

  const handleCheckIn = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/warden/visitors/${id}/checkin`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.success) {
        showSnackbar('Visitor checked in successfully', 'success');
        fetchVisits();
      } else {
        showSnackbar(response.data?.message || 'Failed to check in', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar(error.response?.data?.message || 'Failed to check in visitor', 'error');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/warden/visitors/${id}/checkout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.success) {
        showSnackbar('Visitor checked out successfully', 'success');
        fetchVisits();
      } else {
        showSnackbar(response.data?.message || 'Failed to check out', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar(error.response?.data?.message || 'Failed to check out visitor', 'error');
    }
  };

  const handleViewDetails = (visit) => {
    setSelectedVisit(visit);
    setOpenViewDialog(true);
  };

  const handleActionClick = (visit, action) => {
    setSelectedVisit(visit);
    setActionType(action);
    setOpenDialog(true);
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
      <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading visit requests...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
      <Box sx={{ height: 4, bgcolor: G[600], mb: 3, borderRadius: 2 }} />

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
            <ScheduleIcon sx={{ color: G[200], fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
              Visit Management
            </Typography>
            <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
              Manage and approve student visit requests
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchVisits}
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

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 3, bgcolor: G[800], border: `1px solid ${G[700]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ color: G[300], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
                Total Requests
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
              <Typography sx={{ fontWeight: 700, color: '#F59E0B', fontSize: '2rem' }}>
                {stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
                Approved
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#10B981', fontSize: '2rem' }}>
                {stats.approved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
                Rejected
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#EF4444', fontSize: '2rem' }}>
                {stats.rejected}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
                Completed
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#6B7280', fontSize: '2rem' }}>
                {stats.completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      
      <Paper elevation={0} sx={{ mb: 3, borderRadius: 2.5, border: `1px solid ${G[200]}` }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              color: G[500],
              '&.Mui-selected': { color: G[700] }
            },
            '& .MuiTabs-indicator': { bgcolor: G[600], height: 3 }
          }}
        >
          <Tab label={`All (${stats.total})`} />
          <Tab label={`Pending (${stats.pending})`} />
          <Tab label={`Approved (${stats.approved})`} />
          <Tab label={`Rejected (${stats.rejected})`} />
          <Tab label={`Completed (${stats.completed})`} />
        </Tabs>
      </Paper>

      
      {filteredVisits.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3, border: `1px solid ${G[200]}` }}>
          <ScheduleIcon sx={{ fontSize: 80, color: G[400], mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ color: G[600] }}>
            No Visit Requests
          </Typography>
          <Typography variant="body1" sx={{ color: G[500] }}>
            {tabValue === 1 ? 'No pending visit requests' : 
             tabValue === 2 ? 'No approved visits' :
             tabValue === 3 ? 'No rejected visits' :
             tabValue === 4 ? 'No completed visits' :
             'No visit requests found'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredVisits.map((visit) => {
            const statusConfig = getStatusConfig(visit.status);
            const studentName = visit.studentId?.user?.name || visit.studentName || visit.studentId?.name || 'Unknown Student';
            const studentRoom = visit.roomNumber || visit.studentId?.room?.roomNumber || 'N/A';
            
            return (
              <Grid item xs={12} md={6} key={visit._id}>
                <Card sx={{ borderRadius: 3, border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW, '&:hover': { boxShadow: 3 } }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: G[100], color: G[700], width: 48, height: 48 }}>
                          {studentName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: G[800] }}>
                            {studentName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: G[500] }}>
                            Room: {studentRoom}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={statusConfig.label} 
                        size="small" 
                        sx={{ bgcolor: statusConfig.bg, color: statusConfig.color, fontWeight: 600 }} 
                      />
                    </Box>

                    <Divider sx={{ my: 2, borderColor: G[100] }} />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: G[500] }}>Visitor Name</Typography>
                        <Typography variant="body2" fontWeight="500" sx={{ color: G[800] }}>
                          {visit.visitorName}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: G[500] }}>Relation</Typography>
                        <Typography variant="body2" sx={{ color: G[700] }}>
                          {visit.relation}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: G[500] }}>Phone</Typography>
                        <Typography variant="body2" sx={{ color: G[700] }}>
                          {visit.visitorPhone}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: G[500] }}>Visit Date</Typography>
                        <Typography variant="body2" sx={{ color: G[700] }}>
                          {visit.visitDate ? new Date(visit.visitDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" sx={{ color: G[500] }}>Purpose</Typography>
                        <Typography variant="body2" sx={{ color: G[700] }}>
                          {visit.purpose || 'Not specified'}
                        </Typography>
                      </Grid>
                      {visit.wardenRemark && (
                        <Grid item xs={12}>
                          <Box sx={{ mt: 1, p: 1.5, bgcolor: G[50], borderRadius: 2 }}>
                            <Typography variant="caption" sx={{ color: G[500] }}>Warden Remark</Typography>
                            <Typography variant="body2" sx={{ color: G[700] }}>{visit.wardenRemark}</Typography>
                          </Box>
                        </Grid>
                      )}
                      {visit.checkInTime && (
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: G[500] }}>Check In Time</Typography>
                          <Typography variant="body2" sx={{ color: G[700] }}>
                            {new Date(visit.checkInTime).toLocaleString()}
                          </Typography>
                        </Grid>
                      )}
                      {visit.checkOutTime && (
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: G[500] }}>Check Out Time</Typography>
                          <Typography variant="body2" sx={{ color: G[700] }}>
                            {new Date(visit.checkOutTime).toLocaleString()}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>

                    <Box display="flex" justifyContent="flex-end" gap={1} mt={3}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewDetails(visit)} 
                          sx={{ color: G[600], bgcolor: G[100], borderRadius: 1.5 }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      {visit.status === 'pending' && (
                        <>
                          <Tooltip title="Approve">
                            <IconButton 
                              size="small" 
                              onClick={() => handleActionClick(visit, 'approve')} 
                              sx={{ color: '#10B981', bgcolor: alpha('#10B981', 0.1), borderRadius: 1.5 }}
                            >
                              <ApproveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton 
                              size="small" 
                              onClick={() => handleActionClick(visit, 'reject')} 
                              sx={{ color: '#EF4444', bgcolor: alpha('#EF4444', 0.1), borderRadius: 1.5 }}
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
                              <IconButton 
                                size="small" 
                                onClick={() => handleCheckIn(visit._id)} 
                                sx={{ color: '#10B981', bgcolor: alpha('#10B981', 0.1), borderRadius: 1.5 }}
                              >
                                <CheckInIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {visit.checkInTime && !visit.checkOutTime && (
                            <Tooltip title="Check Out">
                              <IconButton 
                                size="small" 
                                onClick={() => handleCheckOut(visit._id)} 
                                sx={{ color: '#F59E0B', bgcolor: alpha('#F59E0B', 0.1), borderRadius: 1.5 }}
                              >
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

      
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
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
        <Box sx={{ height: 4, bgcolor: actionType === 'approve' ? G[600] : '#EF4444', borderRadius: '12px 12px 0 0' }} />
        <DialogTitle sx={{ bgcolor: G[50], borderBottom: `1px solid ${G[100]}` }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: G[800] }}>
            {actionType === 'approve' ? 'Approve Visit Request' : 'Reject Visit Request'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedVisit && (
            <Box>
              <Alert 
                severity={actionType === 'approve' ? 'info' : 'warning'} 
                sx={{ mb: 3, borderRadius: 2 }}
              >
                <Typography variant="body2">
                  <strong>Student:</strong> {selectedVisit.studentId?.user?.name || selectedVisit.studentName}<br />
                  <strong>Visitor:</strong> {selectedVisit.visitorName} ({selectedVisit.relation})
                </Typography>
              </Alert>
              
              <TextField
                fullWidth
                label={actionType === 'approve' ? "Remarks / Meeting Location" : "Rejection Reason"}
                multiline
                rows={3}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder={actionType === 'approve' ? "Add meeting location or remarks..." : "Provide reason for rejection..."}
                required={actionType === 'reject'}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: 2, '& fieldset': { borderColor: G[200] } }
                }}
              />
              
              {actionType === 'approve' && (
                <Box>
                  <Typography variant="caption" sx={{ color: G[500], mb: 1, display: 'block' }}>
                    Time Slot (Optional)
                  </Typography>
                  <Box display="flex" gap={2}>
                    <TextField
                      size="small"
                      type="time"
                      label="Start Time"
                      value={timeSlot.start}
                      onChange={(e) => setTimeSlot({ ...timeSlot, start: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      size="small"
                      type="time"
                      label="End Time"
                      value={timeSlot.end}
                      onChange={(e) => setTimeSlot({ ...timeSlot, end: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <Divider sx={{ borderColor: G[100] }} />
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: G[600], border: `1px solid ${G[200]}`, px: 3, borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={actionType === 'approve' ? handleApprove : handleReject}
            sx={{ 
              bgcolor: actionType === 'approve' ? G[700] : '#EF4444', 
              '&:hover': { bgcolor: actionType === 'approve' ? G[800] : '#DC2626' },
              px: 3,
              borderRadius: 2
            }}
          >
            {actionType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      
      <Dialog 
        open={openViewDialog} 
        onClose={() => setOpenViewDialog(false)} 
        maxWidth="sm" 
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
        <DialogTitle sx={{ bgcolor: G[50], borderBottom: `1px solid ${G[100]}` }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: G[800] }}>
            Visit Request Details
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedVisit && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: G[600], width: 48, height: 48 }}>
                    <PersonIcon sx={{ color: '#fff' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: G[800] }}>
                      {selectedVisit.studentId?.user?.name || selectedVisit.studentName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: G[500] }}>
                      Room: {selectedVisit.roomNumber || selectedVisit.studentId?.room?.roomNumber || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: G[500] }}>Visitor Name</Typography>
                <Typography variant="body2" fontWeight="500" sx={{ color: G[800] }}>
                  {selectedVisit.visitorName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: G[500] }}>Relation</Typography>
                <Typography variant="body2" sx={{ color: G[700] }}>
                  {selectedVisit.relation}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: G[500] }}>Phone</Typography>
                <Typography variant="body2" sx={{ color: G[700] }}>
                  {selectedVisit.visitorPhone}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: G[500] }}>Visit Date</Typography>
                <Typography variant="body2" sx={{ color: G[700] }}>
                  {selectedVisit.visitDate ? new Date(selectedVisit.visitDate).toLocaleDateString() : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: G[500] }}>Purpose</Typography>
                <Typography variant="body2" sx={{ color: G[700] }}>
                  {selectedVisit.purpose || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1, borderColor: G[100] }} />
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: G[800], mb: 1 }}>
                  Status Information
                </Typography>
                <Chip 
                  label={getStatusConfig(selectedVisit.status).label} 
                  sx={{ bgcolor: getStatusConfig(selectedVisit.status).bg, color: getStatusConfig(selectedVisit.status).color }} 
                />
              </Grid>
              {selectedVisit.wardenRemark && (
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: G[500] }}>Warden Remark</Typography>
                  <Typography variant="body2" sx={{ color: G[700] }}>
                    {selectedVisit.wardenRemark}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <Divider sx={{ borderColor: G[100] }} />
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenViewDialog(false)} sx={{ color: G[600], border: `1px solid ${G[200]}`, px: 3, borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      
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

export default WardenVisits;