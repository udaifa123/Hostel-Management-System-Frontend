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
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  alpha,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import parentService from '../../services/parentService';
import ParentLayout from '../../components/Layout/ParentLayout';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

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
    case 'pending': return { label: 'Pending', color: '#F59E0B', bg: '#FEF3C7', icon: '⏳' };
    case 'approved': return { label: 'Approved', color: '#10B981', bg: '#ECFDF5', icon: '✅' };
    case 'rejected': return { label: 'Rejected', color: '#EF4444', bg: '#FEF2F2', icon: '❌' };
    case 'cancelled': return { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6', icon: '🚫' };
    case 'completed': return { label: 'Completed', color: '#6B7280', bg: '#F3F4F6', icon: '✔️' };
    default: return { label: status || 'Unknown', color: '#6B7280', bg: '#F3F4F6', icon: '❓' };
  }
};

const ParentVisits = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    visitorName: '',
    relation: '',
    visitorPhone: '',
    visitDate: '',
    visitTime: '',
    purpose: '',
    numberOfVisitors: 1
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      console.log('Fetching visits...');
      const response = await parentService.getVisitRequests();
      console.log('Visits response:', response);
      
      let visitsData = [];
      if (response && response.success) {
        if (response.data && response.data.visits && Array.isArray(response.data.visits)) {
          visitsData = response.data.visits;
        } else if (response.data && Array.isArray(response.data)) {
          visitsData = response.data;
        } else if (Array.isArray(response)) {
          visitsData = response;
        }
      } else if (response && Array.isArray(response)) {
        visitsData = response;
      }
      
      console.log('Processed visits data:', visitsData);
      setVisits(visitsData);
    } catch (error) {
      console.error('Error fetching visits:', error);
      toast.error('Failed to load visits');
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.visitorName) newErrors.visitorName = 'Visitor name is required';
    if (!formData.relation) newErrors.relation = 'Relation is required';
    if (!formData.visitorPhone) newErrors.visitorPhone = 'Phone number is required';
    if (!formData.visitDate) newErrors.visitDate = 'Visit date is required';
    if (!formData.purpose) newErrors.purpose = 'Purpose is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const response = await parentService.createVisitRequest(formData);
      console.log('Create response:', response);
      
      if (response && response.success) {
        toast.success('Visit request sent successfully!');
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this visit request?')) return;
    
    try {
      const response = await parentService.cancelVisit(id);
      if (response && response.success) {
        toast.success('Visit request cancelled successfully');
        fetchVisits();
      } else {
        toast.error(response?.message || 'Failed to cancel');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to cancel request');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this visit request?')) return;
    
    try {
      const response = await parentService.deleteVisit(id);
      if (response && response.success) {
        toast.success('Visit request deleted successfully');
        fetchVisits();
      } else {
        toast.error(response?.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete request');
    }
  };

  const stats = {
    total: visits.length,
    pending: visits.filter(v => v.status === 'pending').length,
    approved: visits.filter(v => v.status === 'approved').length,
    rejected: visits.filter(v => v.status === 'rejected').length,
    cancelled: visits.filter(v => v.status === 'cancelled').length,
    completed: visits.filter(v => v.status === 'completed').length
  };

  if (loading) {
    return (
      <ParentLayout>
        <Box sx={{ p: 3 }}>
          <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
          <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading visits...</Typography>
        </Box>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: G[800] }}>
              Visit Requests
            </Typography>
            <Typography variant="body2" sx={{ color: G[500], mt: 0.5 }}>
              Request and track visits to your child
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchVisits}
              sx={{ borderColor: G[200], color: G[600] }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] } }}
            >
              Request Visit
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 3, bgcolor: G[800] }}>
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
                  Cancelled
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#6B7280', fontSize: '2rem' }}>
                  {stats.cancelled}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Visits List */}
        {visits.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3, border: `1px solid ${G[200]}` }}>
            <AddIcon sx={{ fontSize: 80, color: G[400], mb: 2 }} />
            <Typography variant="h6" sx={{ color: G[600], mb: 1 }}>
              No Visit Requests Yet
            </Typography>
            <Typography variant="body2" sx={{ color: G[500], mb: 2 }}>
              Click the button above to request a visit to your child
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ bgcolor: G[700] }}
            >
              Request a Visit
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {visits.map((visit) => {
              const statusConfig = getStatusConfig(visit.status);
              const canCancel = visit.status === 'pending';
              const canDelete = visit.status === 'cancelled' || visit.status === 'rejected';
              
              return (
                <Grid item xs={12} md={6} key={visit._id || visit.id}>
                  <Card 
                    sx={{ 
                      borderRadius: 3, 
                      border: `1px solid ${G[200]}`,
                      transition: 'all 0.2s ease',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                      opacity: visit.status === 'cancelled' ? 0.7 : 1
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
                            {visit.visitorName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: G[500] }}>
                            {visit.relation}
                          </Typography>
                        </Box>
                        <Chip 
                          label={`${statusConfig.icon} ${statusConfig.label}`} 
                          size="small" 
                          sx={{ bgcolor: statusConfig.bg, color: statusConfig.color, fontWeight: 600 }} 
                        />
                      </Box>

                      <Divider sx={{ borderColor: G[100], mb: 2 }} />

                      <Grid container spacing={1.5}>
                        <Grid item xs={6}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <PhoneIcon sx={{ fontSize: 14, color: G[500] }} />
                            <Typography variant="caption" sx={{ color: G[500] }}>Phone</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: G[700] }}>{visit.visitorPhone}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarIcon sx={{ fontSize: 14, color: G[500] }} />
                            <Typography variant="caption" sx={{ color: G[500] }}>Date</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: G[700] }}>
                            {visit.visitDate ? format(parseISO(visit.visitDate), 'dd MMM yyyy') : 'Not set'}
                          </Typography>
                        </Grid>
                        {visit.visitTime && (
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: G[500] }}>⏰ Time</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: G[700] }}>{visit.visitTime}</Typography>
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Typography variant="caption" sx={{ color: G[500] }}>🎯 Purpose</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: G[700] }}>{visit.purpose}</Typography>
                        </Grid>
                        {visit.numberOfVisitors > 1 && (
                          <Grid item xs={12}>
                            <Typography variant="caption" sx={{ color: G[500] }}>👥 Visitors</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: G[700] }}>{visit.numberOfVisitors} people</Typography>
                          </Grid>
                        )}
                      </Grid>

                      {visit.wardenRemark && (
                        <Box sx={{ mt: 2, p: 1.5, bgcolor: G[50], borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ color: G[500] }}>📝 Warden Remark</Typography>
                          <Typography variant="body2" sx={{ color: G[600] }}>{visit.wardenRemark}</Typography>
                        </Box>
                      )}

                      {visit.rejectionReason && (
                        <Box sx={{ mt: 2, p: 1.5, bgcolor: alpha('#EF4444', 0.1), borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 600 }}>❌ Rejection Reason</Typography>
                          <Typography variant="body2" sx={{ color: '#EF4444' }}>{visit.rejectionReason}</Typography>
                        </Box>
                      )}

                      {visit.status === 'approved' && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: alpha('#10B981', 0.1), borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CheckCircleIcon sx={{ fontSize: 14 }} />
                            Visit Approved
                          </Typography>
                          <Typography variant="caption" sx={{ color: G[500] }}>
                            Please carry ID proof at the time of visit
                          </Typography>
                        </Box>
                      )}

                      <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            onClick={() => setSelectedVisit(visit)} 
                            sx={{ color: G[600], bgcolor: G[100], borderRadius: 1.5 }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {canCancel && (
                          <Tooltip title="Cancel Request">
                            <IconButton 
                              size="small" 
                              onClick={() => handleCancel(visit._id || visit.id)} 
                              sx={{ color: '#F59E0B', bgcolor: alpha('#F59E0B', 0.1), borderRadius: 1.5 }}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {canDelete && (
                          <Tooltip title="Delete Request">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDelete(visit._id || visit.id)} 
                              sx={{ color: '#EF4444', bgcolor: alpha('#EF4444', 0.1), borderRadius: 1.5 }}
                            >
                              <DeleteIcon fontSize="small" />
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
            }
          }}
        >
          <Box sx={{ height: 4, bgcolor: G[600], borderRadius: '12px 12px 0 0' }} />
          <DialogTitle sx={{ pt: 2.5, pb: 1.5 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar sx={{ bgcolor: G[800], width: 38, height: 38, borderRadius: 1.5 }}>
                <AddIcon sx={{ color: G[200] }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
                Request a Visit
              </Typography>
            </Box>
          </DialogTitle>
          <Divider sx={{ borderColor: G[100] }} />
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Visitor Name *"
                  value={formData.visitorName}
                  onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                  error={!!errors.visitorName}
                  helperText={errors.visitorName}
                  placeholder="Enter visitor's full name"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.relation}>
                  <InputLabel>Relation *</InputLabel>
                  <Select
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                    label="Relation *"
                  >
                    <MenuItem value="Father">Father</MenuItem>
                    <MenuItem value="Mother">Mother</MenuItem>
                    <MenuItem value="Brother">Brother</MenuItem>
                    <MenuItem value="Sister">Sister</MenuItem>
                    <MenuItem value="Grandfather">Grandfather</MenuItem>
                    <MenuItem value="Grandmother">Grandmother</MenuItem>
                    <MenuItem value="Uncle">Uncle</MenuItem>
                    <MenuItem value="Aunt">Aunt</MenuItem>
                    <MenuItem value="Friend">Friend</MenuItem>
                    <MenuItem value="Relative">Relative</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {errors.relation && <Typography color="error" variant="caption">{errors.relation}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number *"
                  value={formData.visitorPhone}
                  onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
                  error={!!errors.visitorPhone}
                  helperText={errors.visitorPhone}
                  placeholder="Enter contact number"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Visit Date *"
                  value={formData.visitDate}
                  onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.visitDate}
                  helperText={errors.visitDate}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Visit Time (Optional)"
                  value={formData.visitTime}
                  onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Purpose of Visit *"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  error={!!errors.purpose}
                  helperText={errors.purpose}
                  placeholder="Please provide reason for the visit"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Visitors"
                  value={formData.numberOfVisitors}
                  onChange={(e) => setFormData({ ...formData, numberOfVisitors: parseInt(e.target.value) || 1 })}
                  inputProps={{ min: 1, max: 5 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> Your request will be reviewed by the warden. Approval may take up to 24 hours.
                Please carry a valid ID proof during your visit.
              </Typography>
            </Alert>
          </DialogContent>
          <Divider sx={{ borderColor: G[100] }} />
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ color: G[600], border: `1px solid ${G[200]}` }}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] } }}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog open={!!selectedVisit} onClose={() => setSelectedVisit(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: G[800], color: 'white' }}>
            Visit Details
            <IconButton
              onClick={() => setSelectedVisit(null)}
              sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {selectedVisit && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Gate Pass ID</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      {selectedVisit.gatePassId || 'Pending Approval'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Visitor Name</Typography>
                    <Typography variant="body1">{selectedVisit.visitorName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Relation</Typography>
                    <Typography variant="body1">{selectedVisit.relation}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Contact Number</Typography>
                    <Typography variant="body1">{selectedVisit.visitorPhone}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Visit Date</Typography>
                    <Typography variant="body1">
                      {selectedVisit.visitDate ? format(parseISO(selectedVisit.visitDate), 'dd MMM yyyy') : 'Not set'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Visit Time</Typography>
                    <Typography variant="body1">{selectedVisit.visitTime || 'Not specified'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Purpose</Typography>
                    <Typography variant="body1">{selectedVisit.purpose}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                    <Chip 
                      label={`${getStatusConfig(selectedVisit.status).icon} ${getStatusConfig(selectedVisit.status).label}`} 
                      size="small" 
                      sx={{ mt: 0.5, bgcolor: getStatusConfig(selectedVisit.status).bg, color: getStatusConfig(selectedVisit.status).color }} 
                    />
                  </Grid>
                  {selectedVisit.wardenRemark && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">Warden Remark</Typography>
                      <Paper sx={{ p: 2, bgcolor: G[50], mt: 0.5 }}>{selectedVisit.wardenRemark}</Paper>
                    </Grid>
                  )}
                  {selectedVisit.rejectionReason && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">Rejection Reason</Typography>
                      <Paper sx={{ p: 2, bgcolor: alpha('#EF4444', 0.1), mt: 0.5 }}>{selectedVisit.rejectionReason}</Paper>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedVisit(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ParentLayout>
  );
};

export default ParentVisits;