import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import parentService from '../../services/parentService';
import ParentLayout from '../../components/Layout/ParentLayout';
import toast from 'react-hot-toast';
import { format, parseISO, differenceInDays } from 'date-fns';

const ParentLeaves = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [counts, setCounts] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await parentService.getLeaves();
      setLeaves(response.data.leaves || []);
      setCounts(response.data.counts);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return { bgcolor: '#d1fae5', color: '#065f46', fontWeight: 700 };
      case 'rejected': return { bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 700 };
      case 'pending':  return { bgcolor: '#fef9c3', color: '#92400e', fontWeight: 700 };
      default:         return { bgcolor: '#f3f4f6', color: '#374151', fontWeight: 700 };
    }
  };

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
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
            Leave Requests
          </Typography>
          <Typography sx={{ color: '#6ee7b7', fontSize: '0.85rem', mt: 0.3 }}>
            Track your child's leave applications
          </Typography>
        </Paper>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Total',    value: counts?.total    || 0, color: '#047857', bg: '#ecfdf5', border: '#a7f3d0' },
            { label: 'Pending',  value: counts?.pending  || 0, color: '#92400e', bg: '#fef9c3', border: '#fde68a' },
            { label: 'Approved', value: counts?.approved || 0, color: '#065f46', bg: '#d1fae5', border: '#6ee7b7' },
            { label: 'Rejected', value: counts?.rejected || 0, color: '#991b1b', bg: '#fee2e2', border: '#fca5a5' },
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

        {/* Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: '16px', border: '1.5px solid #d1fae5', overflow: 'hidden', boxShadow: '0 4px 16px rgba(6,95,70,0.07)' }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)' }}>
                {['Leave Number', 'From', 'To', 'Days', 'Reason', 'Type', 'Status', 'Action'].map((h) => (
                  <TableCell key={h} sx={{ color: '#fff', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: 'none' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.map((leave, idx) => (
                <TableRow
                  key={leave._id}
                  sx={{
                    bgcolor: idx % 2 === 0 ? '#fff' : '#f0fdf4',
                    '&:hover': { bgcolor: '#ecfdf5' },
                    transition: 'background 0.15s'
                  }}
                >
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>
                      {leave.leaveNumber || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: '#374151', fontSize: '0.9rem' }}>{format(parseISO(leave.fromDate), 'dd MMM yyyy')}</TableCell>
                  <TableCell sx={{ color: '#374151', fontSize: '0.9rem' }}>{format(parseISO(leave.toDate), 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'inline-block', px: 1.5, py: 0.4, borderRadius: '8px', bgcolor: '#ecfdf5', border: '1px solid #6ee7b7', color: '#065f46', fontWeight: 700, fontSize: '0.8rem' }}>
                      {`${leave.totalDays || differenceInDays(parseISO(leave.toDate), parseISO(leave.fromDate)) + 1}d`}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#4b5563', fontSize: '0.9rem', maxWidth: 160 }}>
                    <Typography noWrap sx={{ fontSize: '0.9rem' }}>{leave.reason}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ textTransform: 'capitalize', color: '#374151', fontSize: '0.9rem' }}>{leave.type}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'inline-block', px: 1.5, py: 0.4, borderRadius: '8px', textTransform: 'capitalize', fontSize: '0.8rem', ...getStatusStyle(leave.status) }}>
                      {leave.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(leave)}
                      sx={{ color: '#059669', bgcolor: '#ecfdf5', '&:hover': { bgcolor: '#d1fae5' }, borderRadius: '8px' }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {leaves.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#9ca3af' }}>
                    No leave requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Detail Dialog */}
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden' } }}
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
              color: '#fff', fontWeight: 700, py: 2.5
            }}
          >
            Leave Request Details
          </DialogTitle>
          <DialogContent dividers sx={{ bgcolor: '#f0fdf4', borderColor: '#d1fae5' }}>
            {selectedLeave && (
              <Grid container spacing={2} sx={{ pt: 1 }}>
                {[
                  { label: 'Leave Number', value: selectedLeave.leaveNumber, xs: 6 },
                  { label: 'From Date', value: format(parseISO(selectedLeave.fromDate), 'dd MMMM yyyy'), xs: 6 },
                  { label: 'To Date', value: format(parseISO(selectedLeave.toDate), 'dd MMMM yyyy'), xs: 6 },
                  { label: 'Total Days', value: selectedLeave.totalDays || differenceInDays(parseISO(selectedLeave.toDate), parseISO(selectedLeave.fromDate)) + 1, xs: 6 },
                  { label: 'Type', value: selectedLeave.type, xs: 6, capitalize: true },
                ].map((f) => (
                  <Grid item xs={f.xs} key={f.label}>
                    <Box sx={{ bgcolor: '#fff', borderRadius: '10px', border: '1px solid #d1fae5', p: 1.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.3 }}>
                        {f.label}
                      </Typography>
                      <Typography sx={{ fontWeight: 700, color: '#111827', textTransform: f.capitalize ? 'capitalize' : 'none' }}>
                        {f.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}

                <Grid item xs={6}>
                  <Box sx={{ bgcolor: '#fff', borderRadius: '10px', border: '1px solid #d1fae5', p: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
                      Status
                    </Typography>
                    <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, borderRadius: '8px', textTransform: 'capitalize', fontSize: '0.85rem', ...getStatusStyle(selectedLeave.status) }}>
                      {selectedLeave.status}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ bgcolor: '#fff', borderRadius: '10px', border: '1px solid #d1fae5', p: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
                      Reason
                    </Typography>
                    <Typography sx={{ color: '#374151' }}>{selectedLeave.reason}</Typography>
                  </Box>
                </Grid>

                {selectedLeave.destination && (
                  <Grid item xs={12}>
                    <Box sx={{ bgcolor: '#fff', borderRadius: '10px', border: '1px solid #d1fae5', p: 1.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.3 }}>
                        Destination
                      </Typography>
                      <Typography sx={{ color: '#374151' }}>{selectedLeave.destination}</Typography>
                    </Box>
                  </Grid>
                )}

                {selectedLeave.approvedBy && (
                  <Grid item xs={12}>
                    <Box sx={{ bgcolor: '#fff', borderRadius: '10px', border: '1px solid #d1fae5', p: 1.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.3 }}>
                        Approved By
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: '#065f46' }}>{selectedLeave.approvedBy.name}</Typography>
                    </Box>
                  </Grid>
                )}

                {selectedLeave.rejectionReason && (
                  <Grid item xs={12}>
                    <Box sx={{ bgcolor: '#fee2e2', borderRadius: '10px', border: '1px solid #fca5a5', p: 1.5 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#991b1b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.3 }}>
                        Rejection Reason
                      </Typography>
                      <Typography sx={{ color: '#991b1b' }}>{selectedLeave.rejectionReason}</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ bgcolor: '#f0fdf4', borderTop: '1px solid #d1fae5', px: 3, py: 2 }}>
            <Button
              onClick={() => setDetailsOpen(false)}
              sx={{
                bgcolor: '#059669', color: '#fff', borderRadius: '10px', px: 3, fontWeight: 600,
                '&:hover': { bgcolor: '#047857' }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </ParentLayout>
  );
};

export default ParentLeaves;