import React, { useState, useEffect } from 'react';

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';

import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';

import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  HourglassEmpty as ProgressIcon
} from '@mui/icons-material';
import parentService from '../../services/parentService';
import ParentLayout from '../../components/Layout/ParentLayout';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

const ParentComplaints = () => {
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [counts, setCounts] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await parentService.getComplaints();
      setComplaints(response.data.complaints || []);
      setCounts(response.data.counts);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':    return 'success';
      case 'rejected':    return 'error';
      case 'pending':     return 'warning';
      case 'in-progress': return 'info';
      default:            return 'default';
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':    return { bgcolor: '#d1fae5', color: '#065f46' };
      case 'rejected':    return { bgcolor: '#fee2e2', color: '#991b1b' };
      case 'pending':     return { bgcolor: '#fef9c3', color: '#92400e' };
      case 'in-progress': return { bgcolor: '#e0f2fe', color: '#075985' };
      default:            return { bgcolor: '#f3f4f6', color: '#374151' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':    return <CheckCircleIcon sx={{ color: '#059669', fontSize: 20 }} />;
      case 'rejected':    return <CancelIcon sx={{ color: '#ef4444', fontSize: 20 }} />;
      case 'pending':     return <PendingIcon sx={{ color: '#f59e0b', fontSize: 20 }} />;
      case 'in-progress': return <ProgressIcon sx={{ color: '#0ea5e9', fontSize: 20 }} />;
      default:            return null;
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':   return { bgcolor: '#fee2e2', color: '#991b1b' };
      case 'medium': return { bgcolor: '#fef9c3', color: '#92400e' };
      case 'low':    return { bgcolor: '#d1fae5', color: '#065f46' };
      default:       return { bgcolor: '#f3f4f6', color: '#374151' };
    }
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setDetailsOpen(true);
  };

  if (loading) {
    return (
      <ParentLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress sx={{ color: '#059669' }} thickness={5} />
        </Box>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <Container maxWidth="xl">

        {/* Page Title */}
        <Paper
          elevation={0}
          sx={{
            p: 3, mb: 4, borderRadius: '16px',
            background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
            boxShadow: '0 4px 20px rgba(6,95,70,0.2)'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
            Complaints
          </Typography>
          <Typography sx={{ color: '#6ee7b7', fontSize: '0.85rem', mt: 0.3 }}>
            Track and monitor complaint status
          </Typography>
        </Paper>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Total',       value: counts?.total             || 0, color: '#047857', bg: '#ecfdf5', border: '#a7f3d0' },
            { label: 'Pending',     value: counts?.pending           || 0, color: '#92400e', bg: '#fef9c3', border: '#fde68a' },
            { label: 'In Progress', value: counts?.['in-progress']   || 0, color: '#075985', bg: '#e0f2fe', border: '#7dd3fc' },
            { label: 'Resolved',    value: counts?.resolved          || 0, color: '#065f46', bg: '#d1fae5', border: '#6ee7b7' },
          ].map((s) => (
            <Grid item xs={6} sm={3} key={s.label}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: '16px', border: `1.5px solid ${s.border}`,
                  bgcolor: s.bg, transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)' }
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Typography sx={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                    {s.label}
                  </Typography>
                  <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>
                    {s.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Complaint Cards */}
        <Grid container spacing={2}>
          {complaints.map((complaint, idx) => (
            <Grid item xs={12} key={complaint._id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: '14px',
                  border: '1.5px solid #d1fae5',
                  bgcolor: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.22s',
                  boxShadow: '0 2px 10px rgba(6,95,70,0.06)',
                  '&:hover': {
                    boxShadow: '0 8px 28px rgba(6,95,70,0.14)',
                    borderColor: '#6ee7b7',
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => handleViewDetails(complaint)}
              >
                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', letterSpacing: '0.06em' }}>
                        {complaint.complaintNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '0.97rem' }}>
                        {complaint.title}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Box sx={{ display: 'inline-block', px: 1.5, py: 0.4, borderRadius: '8px', bgcolor: '#ecfdf5', border: '1px solid #6ee7b7', color: '#065f46', fontWeight: 600, fontSize: '0.78rem', textTransform: 'capitalize' }}>
                        {complaint.category}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        {getStatusIcon(complaint.status)}
                        <Box sx={{ display: 'inline-block', px: 1.5, py: 0.4, borderRadius: '8px', fontWeight: 700, fontSize: '0.78rem', textTransform: 'capitalize', ...getStatusStyle(complaint.status) }}>
                          {complaint.status}
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={1} sx={{ textAlign: 'right' }}>
                      <IconButton
                        size="small"
                        sx={{ color: '#059669', bgcolor: '#ecfdf5', '&:hover': { bgcolor: '#d1fae5' }, borderRadius: '8px' }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {complaints.length === 0 && (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1.5px solid #d1fae5', bgcolor: '#f0fdf4' }}>
                <Typography sx={{ color: '#9ca3af', fontWeight: 500 }}>No complaints found</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Detail Dialog */}
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden' } }}
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
              color: '#fff', fontWeight: 700, py: 2.5
            }}
          >
            Complaint Details
          </DialogTitle>

          <DialogContent dividers sx={{ bgcolor: '#f0fdf4', borderColor: '#d1fae5' }}>
            {selectedComplaint && (
              <Grid container spacing={2} sx={{ pt: 1 }}>

                {/* Info block */}
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', borderRadius: '14px', border: '1.5px solid #d1fae5' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.3 }}>Complaint Number</Typography>
                        <Typography sx={{ fontWeight: 700, color: '#059669' }}>{selectedComplaint.complaintNumber}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>Status</Typography>
                        <Box sx={{ display: 'inline-block', px: 1.5, py: 0.4, borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', textTransform: 'capitalize', ...getStatusStyle(selectedComplaint.status) }}>
                          {selectedComplaint.status}
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.3 }}>Category</Typography>
                        <Typography sx={{ textTransform: 'capitalize', fontWeight: 600, color: '#111827' }}>{selectedComplaint.category}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>Priority</Typography>
                        <Box sx={{ display: 'inline-block', px: 1.5, py: 0.4, borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', textTransform: 'capitalize', ...getPriorityStyle(selectedComplaint.priority) }}>
                          {selectedComplaint.priority}
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Title & Description */}
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#111827', mb: 1 }}>{selectedComplaint.title}</Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff', borderRadius: '12px', border: '1.5px solid #d1fae5' }}>
                    <Typography sx={{ color: '#374151' }}>{selectedComplaint.description}</Typography>
                  </Paper>
                </Grid>

                {selectedComplaint.location && (
                  <Grid item xs={12}>
                    <Box sx={{ bgcolor: '#fff', borderRadius: '10px', border: '1px solid #d1fae5', p: 1.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.3 }}>Location</Typography>
                      <Typography sx={{ color: '#374151' }}>
                        Room {selectedComplaint.location.room}, Floor {selectedComplaint.location.floor}
                        {selectedComplaint.location.building && `, ${selectedComplaint.location.building}`}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {selectedComplaint.assignedTo && (
                  <Grid item xs={12}>
                    <Box sx={{ bgcolor: '#fff', borderRadius: '10px', border: '1px solid #d1fae5', p: 1.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.3 }}>Assigned To</Typography>
                      <Typography sx={{ fontWeight: 600, color: '#065f46' }}>{selectedComplaint.assignedTo.name}</Typography>
                    </Box>
                  </Grid>
                )}

                {selectedComplaint.resolvedAt && (
                  <Grid item xs={12}>
                    <Box sx={{ bgcolor: '#d1fae5', borderRadius: '10px', border: '1px solid #6ee7b7', p: 1.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#065f46', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.3 }}>Resolved On</Typography>
                      <Typography sx={{ fontWeight: 600, color: '#065f46' }}>{format(parseISO(selectedComplaint.resolvedAt), 'dd MMM yyyy, hh:mm a')}</Typography>
                    </Box>
                  </Grid>
                )}

                {/* Timeline */}
                {selectedComplaint.timeline && selectedComplaint.timeline.length > 0 && (
                  <Grid item xs={12}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#065f46', mb: 1, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.75rem' }}>
                      Status Timeline
                    </Typography>
                    <Timeline position="alternate">
                      {selectedComplaint.timeline.map((event, index) => (
                        <TimelineItem key={index}>
                          <TimelineOppositeContent sx={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                            {format(parseISO(event.updatedAt), 'dd MMM hh:mm a')}
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <TimelineDot sx={{ bgcolor: event.status === 'resolved' ? '#059669' : '#047857', boxShadow: '0 0 0 3px #d1fae5' }}>
                              {event.status === 'resolved' ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <ProgressIcon sx={{ fontSize: 16 }} />}
                            </TimelineDot>
                            {index < selectedComplaint.timeline.length - 1 && <TimelineConnector sx={{ bgcolor: '#d1fae5' }} />}
                          </TimelineSeparator>
                          <TimelineContent>
                            <Paper elevation={0} sx={{ p: 1.5, borderRadius: '10px', border: '1px solid #d1fae5', bgcolor: '#fff' }}>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'capitalize', color: '#065f46' }}>
                                {event.status}
                              </Typography>
                              <Typography sx={{ fontSize: '0.82rem', color: '#6b7280' }}>{event.remark}</Typography>
                            </Paper>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </Grid>
                )}

                {/* Dates */}
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: '#fff', borderRadius: '10px', border: '1px solid #d1fae5', p: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.3 }}>Created On</Typography>
                    <Typography sx={{ fontSize: '0.88rem', color: '#374151' }}>{format(parseISO(selectedComplaint.createdAt), 'dd MMM yyyy, hh:mm a')}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: '#fff', borderRadius: '10px', border: '1px solid #d1fae5', p: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.3 }}>Last Updated</Typography>
                    <Typography sx={{ fontSize: '0.88rem', color: '#374151' }}>{format(parseISO(selectedComplaint.updatedAt), 'dd MMM yyyy, hh:mm a')}</Typography>
                  </Box>
                </Grid>

              </Grid>
            )}
          </DialogContent>

          <DialogActions sx={{ bgcolor: '#f0fdf4', borderTop: '1px solid #d1fae5', px: 3, py: 2 }}>
            <Button
              onClick={() => setDetailsOpen(false)}
              sx={{ bgcolor: '#059669', color: '#fff', borderRadius: '10px', px: 3, fontWeight: 600, '&:hover': { bgcolor: '#047857' } }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </ParentLayout>
  );
};

export default ParentComplaints;