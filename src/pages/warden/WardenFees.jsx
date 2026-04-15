// pages/warden/WardenFees.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Typography, Grid, Card, CardContent,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, CircularProgress, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, LinearProgress,
  IconButton, Tooltip, Divider, Avatar, alpha, Tabs, Tab,
  FormControl, InputLabel, Select
} from '@mui/material';
import {
  Payment as PaymentIcon, Receipt as ReceiptIcon, 
  Warning as WarningIcon, CheckCircle as CheckCircleIcon, 
  Info as InfoIcon, AccountBalanceWallet as WalletIcon,
  School as SchoolIcon, Add as AddIcon, Refresh as RefreshIcon,
  NotificationsActive as NotificationIcon
} from '@mui/icons-material';
import wardenService from '../../services/wardenService';
import WardenLayout from '../../components/Layout/WardenLayout';
import toast from 'react-hot-toast';

const theme = {
  primary: '#2e7d32',
  primaryLight: '#4caf50',
  primaryDark: '#1b5e20',
  primarySoft: '#e8f5e9',
  bg: '#f5f9f5',
  bgLight: '#ffffff',
  border: '#c8e6c9',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
};

const WardenFees = () => {
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    totalStudents: 0
  });
  const [selectedFee, setSelectedFee] = useState(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openFineDialog, setOpenFineDialog] = useState(false);
  const [openReminderDialog, setOpenReminderDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [fineAmount, setFineAmount] = useState('');
  const [fineReason, setFineReason] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await wardenService.getHostelFees();
      console.log('Warden fees response:', response);
      
      if (response && response.success) {
        setFees(response.data || []);
        setSummary(response.summary || {
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          totalStudents: 0
        });
      } else {
        setFees([]);
        setSummary({
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          totalStudents: 0
        });
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
      toast.error('Failed to load fees');
      setFees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleManualPayment = async () => {
    if (!selectedFee) return;
    if (!paymentAmount || paymentAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setProcessing(true);
    try {
      const response = await wardenService.manualPayment({
        feeId: selectedFee._id,
        amount: Number(paymentAmount),
        notes: paymentNote
      });
      
      if (response && response.success) {
        toast.success(`Payment of ₹${paymentAmount} recorded successfully!`);
        setOpenPaymentDialog(false);
        setPaymentAmount('');
        setPaymentNote('');
        fetchFees();
      } else {
        toast.error(response?.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Manual payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleAddFine = async () => {
    if (!selectedFee) return;
    if (!fineAmount || fineAmount <= 0) {
      toast.error('Please enter a valid fine amount');
      return;
    }
    if (!fineReason) {
      toast.error('Please provide a reason for the fine');
      return;
    }
    
    setProcessing(true);
    try {
      const response = await wardenService.addFine({
        feeId: selectedFee._id,
        fineAmount: Number(fineAmount),
        reason: fineReason
      });
      
      if (response && response.success) {
        toast.success(`Fine of ₹${fineAmount} added successfully!`);
        setOpenFineDialog(false);
        setFineAmount('');
        setFineReason('');
        fetchFees();
      } else {
        toast.error(response?.message || 'Failed to add fine');
      }
    } catch (error) {
      console.error('Add fine error:', error);
      toast.error(error.response?.data?.message || 'Failed to add fine');
    } finally {
      setProcessing(false);
    }
  };

  const handleSendReminder = async () => {
    if (!selectedFee) return;
    
    setProcessing(true);
    try {
      const response = await wardenService.sendFeeReminder(selectedFee._id);
      
      if (response && response.success) {
        toast.success('Reminder sent successfully!');
        setOpenReminderDialog(false);
      } else {
        toast.error(response?.message || 'Failed to send reminder');
      }
    } catch (error) {
      console.error('Send reminder error:', error);
      toast.error(error.response?.data?.message || 'Failed to send reminder');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusChip = (status) => {
    switch(status) {
      case 'paid': return <Chip label="Paid" size="small" sx={{ bgcolor: alpha(theme.success, 0.1), color: theme.success }} icon={<CheckCircleIcon />} />;
      case 'partial': return <Chip label="Partial" size="small" sx={{ bgcolor: alpha(theme.warning, 0.1), color: theme.warning }} icon={<WarningIcon />} />;
      case 'overdue': return <Chip label="Overdue" size="small" sx={{ bgcolor: alpha(theme.error, 0.1), color: theme.error }} icon={<WarningIcon />} />;
      default: return <Chip label="Pending" size="small" sx={{ bgcolor: alpha(theme.info, 0.1), color: theme.info }} icon={<InfoIcon />} />;
    }
  };

  const filteredFees = tabValue === 0 ? fees : fees.filter(f => f.status === 'pending' || f.status === 'overdue');
  const pendingTotal = fees.filter(f => f.status === 'pending' || f.status === 'overdue').length;

  if (loading) {
    return (
      <WardenLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress sx={{ color: theme.primary }} />
        </Box>
      </WardenLayout>
    );
  }

  return (
    <WardenLayout>
      <Box sx={{ bgcolor: theme.bg, minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: theme.bgLight, border: `1px solid ${theme.border}` }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: alpha(theme.primary, 0.1), width: 56, height: 56 }}>
                  <PaymentIcon sx={{ fontSize: 32, color: theme.primary }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={800} sx={{ color: theme.primaryDark }}>Fee Management</Typography>
                  <Typography variant="body2" sx={{ color: theme.textMuted }}>Manage student fees for your hostel</Typography>
                </Box>
              </Box>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchFees}>Refresh</Button>
            </Box>
          </Paper>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: theme.bgLight, borderRadius: 3, border: `1px solid ${theme.border}` }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: theme.textMuted }}>Total Students</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: theme.primary }}>{summary.totalStudents || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: theme.bgLight, borderRadius: 3, border: `1px solid ${theme.border}` }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: theme.textMuted }}>Total Fees</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: theme.primary }}>₹{(summary.totalAmount || 0).toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: theme.bgLight, borderRadius: 3, border: `1px solid ${theme.border}` }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: theme.textMuted }}>Pending Collection</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: theme.error }}>₹{(summary.pendingAmount || 0).toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabs */}
          <Paper sx={{ mb: 3, borderRadius: 3 }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: `1px solid ${theme.border}`, px: 2 }}>
              <Tab label={`All Fees (${fees.length})`} />
              <Tab label={`Pending/Overdue (${pendingTotal})`} />
            </Tabs>
          </Paper>

          {/* Fees Table */}
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: theme.bg }}>
                  <TableRow>
                    <TableCell><strong>Student Name</strong></TableCell>
                    <TableCell><strong>Title</strong></TableCell>
                    <TableCell align="right"><strong>Amount</strong></TableCell>
                    <TableCell align="right"><strong>Paid</strong></TableCell>
                    <TableCell align="right"><strong>Pending</strong></TableCell>
                    <TableCell><strong>Due Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No fee records found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFees.map((fee) => (
                      <TableRow key={fee._id} hover>
                        <TableCell>{fee.studentName || 'Unknown'}</TableCell>
                        <TableCell>{fee.title}</TableCell>
                        <TableCell align="right">₹{(fee.amount || 0).toLocaleString()}</TableCell>
                        <TableCell align="right">₹{(fee.paidAmount || 0).toLocaleString()}</TableCell>
                        <TableCell align="right" sx={{ color: (fee.dueAmount || 0) > 0 ? theme.error : theme.success }}>
                          ₹{(fee.dueAmount || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{getStatusChip(fee.status)}</TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={1} justifyContent="center">
                            <Tooltip title="Record Payment">
                              <IconButton 
                                size="small" 
                                onClick={() => { setSelectedFee(fee); setOpenPaymentDialog(true); }}
                                sx={{ color: theme.success }}
                              >
                                <PaymentIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Add Fine">
                              <IconButton 
                                size="small" 
                                onClick={() => { setSelectedFee(fee); setOpenFineDialog(true); }}
                                sx={{ color: theme.warning }}
                              >
                                <WarningIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Send Reminder">
                              <IconButton 
                                size="small" 
                                onClick={() => { setSelectedFee(fee); setOpenReminderDialog(true); }}
                                sx={{ color: theme.info }}
                              >
                                <NotificationIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Manual Payment Dialog */}
          <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: theme.primarySoft }}>
              <Typography variant="h6" fontWeight={700}>Record Manual Payment</Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              {selectedFee && (
                <Box>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      Student: <strong>{selectedFee.studentName}</strong><br />
                      Fee: <strong>{selectedFee.title}</strong><br />
                      Pending Amount: <strong style={{ fontSize: '1.2rem' }}>₹{(selectedFee.dueAmount || 0).toLocaleString()}</strong>
                    </Typography>
                  </Alert>
                  
                  <TextField
                    fullWidth
                    type="number"
                    label="Payment Amount (₹)"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Payment Notes (Optional)"
                    multiline
                    rows={2}
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
              <Button onClick={handleManualPayment} variant="contained" disabled={processing} sx={{ bgcolor: theme.primary }}>
                {processing ? <CircularProgress size={24} /> : 'Record Payment'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add Fine Dialog */}
          <Dialog open={openFineDialog} onClose={() => setOpenFineDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: theme.primarySoft }}>
              <Typography variant="h6" fontWeight={700}>Add Fine</Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              {selectedFee && (
                <Box>
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      Student: <strong>{selectedFee.studentName}</strong><br />
                      Fee: <strong>{selectedFee.title}</strong>
                    </Typography>
                  </Alert>
                  
                  <TextField
                    fullWidth
                    type="number"
                    label="Fine Amount (₹)"
                    value={fineAmount}
                    onChange={(e) => setFineAmount(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Reason for Fine"
                    value={fineReason}
                    onChange={(e) => setFineReason(e.target.value)}
                    placeholder="e.g., Late payment, Damage, etc."
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setOpenFineDialog(false)}>Cancel</Button>
              <Button onClick={handleAddFine} variant="contained" disabled={processing} sx={{ bgcolor: theme.warning }}>
                {processing ? <CircularProgress size={24} /> : 'Add Fine'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Send Reminder Dialog */}
          <Dialog open={openReminderDialog} onClose={() => setOpenReminderDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: theme.primarySoft }}>
              <Typography variant="h6" fontWeight={700}>Send Fee Reminder</Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              {selectedFee && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Send reminder to <strong>{selectedFee.studentName}</strong> about pending fee of <strong>₹{(selectedFee.dueAmount || 0).toLocaleString()}</strong>
                  </Typography>
                </Alert>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setOpenReminderDialog(false)}>Cancel</Button>
              <Button onClick={handleSendReminder} variant="contained" disabled={processing} sx={{ bgcolor: theme.info }}>
                {processing ? <CircularProgress size={24} /> : 'Send Reminder'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </WardenLayout>
  );
};

export default WardenFees;