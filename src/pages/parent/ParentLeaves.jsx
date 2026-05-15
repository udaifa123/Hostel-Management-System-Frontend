import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import parentService from '../../services/parentService';
import toast from 'react-hot-toast';
import { format, parseISO, differenceInDays } from 'date-fns';

const G = {
  900: '#064e3b',
  800: '#065f46',
  700: '#047857',
  600: '#059669',
  500: '#10b981',
  400: '#34d399',
  300: '#6ee7b7',
  200: '#bbf7d0',
  100: '#d1fae5',
  50: '#ecfdf5',
};

const ParentLeaves = () => {
  const navigate = useNavigate();
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

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return { bgcolor: '#d1fae5', color: '#065f46', fontWeight: 700, border: '#6ee7b7' };
      case 'rejected': return { bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 700, border: '#fca5a5' };
      case 'pending':  return { bgcolor: '#fef9c3', color: '#92400e', fontWeight: 700, border: '#fde68a' };
      default:         return { bgcolor: '#f3f4f6', color: '#374151', fontWeight: 700, border: '#e5e7eb' };
    }
  };

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    setDetailsOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f0fdf4' }}>
        <CircularProgress sx={{ color: G[600] }} thickness={5} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0fdf4' }}>
     
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
          color: 'white',
          py: 2,
          px: 3,
          boxShadow: '0 4px 20px rgba(6,95,70,0.2)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={() => navigate('/parent/dashboard')}
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Leave Requests
          </Typography>
        </Box>
      </Paper>

     
      <Box sx={{ p: 3 }}>
      
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: '16px',
            border: '1.5px solid #d1fae5',
            bgcolor: '#fff',
            boxShadow: '0 4px 16px rgba(6,95,70,0.07)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: G[100],
                color: G[600],
                fontSize: '1.6rem',
                fontWeight: 700,
                border: `2px solid ${G[300]}`
              }}
            >
              <DescriptionIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" sx={{ color: G[600], letterSpacing: '0.12em', fontSize: '0.7rem', fontWeight: 600 }}>
                Leave Management
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: G[800], lineHeight: 1.2, mb: 0.5 }}>
                Leave Applications
              </Typography>
              <Typography sx={{ color: G[500], fontSize: '0.85rem', mt: 0.3 }}>
                Track your child's leave requests and approvals
              </Typography>
            </Box>
            <Chip
              icon={<DescriptionIcon sx={{ fontSize: '14px !important' }} />}
              label={`${leaves.length} Applications`}
              size="small"
              sx={{ bgcolor: G[100], color: G[700], fontWeight: 600, fontSize: '0.72rem', border: `1px solid ${G[300]}` }}
            />
          </Box>
        </Paper>

        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TrendingUpIcon sx={{ color: G[600], fontSize: 20 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: G[700], letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Overview
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Total', value: counts?.total || 0, color: '#047857', bg: '#ecfdf5', border: '#a7f3d0' },
            { label: 'Pending', value: counts?.pending || 0, color: '#92400e', bg: '#fef9c3', border: '#fde68a' },
            { label: 'Approved', value: counts?.approved || 0, color: '#065f46', bg: '#d1fae5', border: '#6ee7b7' },
            { label: 'Rejected', value: counts?.rejected || 0, color: '#991b1b', bg: '#fee2e2', border: '#fca5a5' },
          ].map((s, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: '16px',
                  border: `1.5px solid ${s.border}`,
                  bgcolor: s.bg,
                  boxShadow: 'none',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)' },
                  height: '100%'
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

        <Divider sx={{ mb: 3.5, borderColor: G[100] }} />

       
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <DescriptionIcon sx={{ color: G[600], fontSize: 20 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: G[700], letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Leave Applications
          </Typography>
        </Box>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: '16px',
            border: '1.5px solid #d1fae5',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(6,95,70,0.07)'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)' }}>
                {['Leave Number', 'From', 'To', 'Days', 'Reason', 'Type', 'Status', 'Action'].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      borderBottom: 'none'
                    }}
                  >
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
                  <TableCell sx={{ color: '#374151', fontSize: '0.9rem' }}>
                    {format(parseISO(leave.fromDate), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell sx={{ color: '#374151', fontSize: '0.9rem' }}>
                    {format(parseISO(leave.toDate), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <Box sx={{
                      display: 'inline-block',
                      px: 1.5,
                      py: 0.4,
                      borderRadius: '8px',
                      bgcolor: '#ecfdf5',
                      border: '1px solid #6ee7b7',
                      color: '#065f46',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}>
                      {`${leave.totalDays || differenceInDays(parseISO(leave.toDate), parseISO(leave.fromDate)) + 1}d`}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#4b5563', fontSize: '0.9rem', maxWidth: 160 }}>
                    <Typography noWrap sx={{ fontSize: '0.9rem' }}>{leave.reason}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ textTransform: 'capitalize', color: '#374151', fontSize: '0.9rem' }}>
                      {leave.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{
                      display: 'inline-block',
                      px: 1.5,
                      py: 0.4,
                      borderRadius: '8px',
                      textTransform: 'capitalize',
                      fontSize: '0.8rem',
                      bgcolor: getStatusStyle(leave.status).bgcolor,
                      color: getStatusStyle(leave.status).color,
                      fontWeight: getStatusStyle(leave.status).fontWeight,
                      border: `1px solid ${getStatusStyle(leave.status).border}`
                    }}>
                      {leave.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(leave)}
                      sx={{
                        color: '#059669',
                        bgcolor: '#ecfdf5',
                        '&:hover': { bgcolor: '#d1fae5' },
                        borderRadius: '8px'
                      }}
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
      </Box>

      
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
            color: '#fff',
            fontWeight: 700,
            py: 2.5,
            px: 3
          }}
        >
          Leave Request Details
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: '#f0fdf4', borderColor: '#d1fae5', p: 3 }}>
          {selectedLeave && (
            <Grid container spacing={2}>
              {[
                { label: 'Leave Number', value: selectedLeave.leaveNumber, xs: 6 },
                { label: 'From Date', value: format(parseISO(selectedLeave.fromDate), 'dd MMMM yyyy'), xs: 6 },
                { label: 'To Date', value: format(parseISO(selectedLeave.toDate), 'dd MMMM yyyy'), xs: 6 },
                { label: 'Total Days', value: selectedLeave.totalDays || differenceInDays(parseISO(selectedLeave.toDate), parseISO(selectedLeave.fromDate)) + 1, xs: 6 },
                { label: 'Type', value: selectedLeave.type, xs: 6, capitalize: true },
              ].map((f) => (
                <Grid item xs={f.xs} key={f.label}>
                  <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '1px solid #d1fae5', p: 1.5 }}>
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
                <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '1px solid #d1fae5', p: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
                    Status
                  </Typography>
                  <Box sx={{
                    display: 'inline-block',
                    px: 1.5,
                    py: 0.3,
                    borderRadius: '8px',
                    textTransform: 'capitalize',
                    fontSize: '0.85rem',
                    bgcolor: getStatusStyle(selectedLeave.status).bgcolor,
                    color: getStatusStyle(selectedLeave.status).color,
                    fontWeight: getStatusStyle(selectedLeave.status).fontWeight,
                    border: `1px solid ${getStatusStyle(selectedLeave.status).border}`
                  }}>
                    {selectedLeave.status}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '1px solid #d1fae5', p: 1.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
                    Reason
                  </Typography>
                  <Typography sx={{ color: '#374151' }}>{selectedLeave.reason}</Typography>
                </Box>
              </Grid>

              {selectedLeave.destination && (
                <Grid item xs={12}>
                  <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '1px solid #d1fae5', p: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.3 }}>
                      Destination
                    </Typography>
                    <Typography sx={{ color: '#374151' }}>{selectedLeave.destination}</Typography>
                  </Box>
                </Grid>
              )}

              {selectedLeave.approvedBy && (
                <Grid item xs={12}>
                  <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '1px solid #d1fae5', p: 1.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.3 }}>
                      Approved By
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#065f46' }}>{selectedLeave.approvedBy.name}</Typography>
                  </Box>
                </Grid>
              )}

              {selectedLeave.rejectionReason && (
                <Grid item xs={12}>
                  <Box sx={{ bgcolor: '#fee2e2', borderRadius: '12px', border: '1px solid #fca5a5', p: 1.5 }}>
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
              bgcolor: G[600],
              color: '#fff',
              borderRadius: '10px',
              px: 3,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { bgcolor: G[700] }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParentLeaves;