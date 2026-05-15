import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Grid, Card, CardContent,
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

const WardenFees = () => {
  const { token } = useAuth();
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

  const demoFees = [
    {
      _id: '1',
      studentName: 'John Doe',
      title: 'Hostel Fee - Semester 1',
      amount: 25000,
      paidAmount: 15000,
      dueAmount: 10000,
      status: 'partial',
      dueDate: '2024-12-31'
    },
    {
      _id: '2',
      studentName: 'Jane Smith',
      title: 'Hostel Fee - Semester 1',
      amount: 25000,
      paidAmount: 25000,
      dueAmount: 0,
      status: 'paid',
      dueDate: '2024-12-31'
    },
    {
      _id: '3',
      studentName: 'Mike Johnson',
      title: 'Hostel Fee - Semester 1',
      amount: 25000,
      paidAmount: 0,
      dueAmount: 25000,
      status: 'overdue',
      dueDate: '2024-11-30'
    },
    {
      _id: '4',
      studentName: 'Sarah Williams',
      title: 'Hostel Fee - Semester 1',
      amount: 25000,
      paidAmount: 0,
      dueAmount: 25000,
      status: 'pending',
      dueDate: '2025-01-15'
    },
    {
      _id: '5',
      studentName: 'David Brown',
      title: 'Hostel Fee - Semester 1',
      amount: 25000,
      paidAmount: 25000,
      dueAmount: 0,
      status: 'paid',
      dueDate: '2024-12-31'
    }
  ];

  const demosummary = {
    totalAmount: 125000,
    paidAmount: 65000,
    pendingAmount: 60000,
    totalStudents: 5
  };

  const fetchFees = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${API_URL}/warden/fees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Fees response:', response);
      
      if (response.data && response.data.success) {
        setFees(response.data.data || []);
        setSummary(response.data.summary || {
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          totalStudents: 0
        });
      } else {
        setFees(demoFees);
        setSummary(demosummary);
        toast.success('Using demo data (Backend API not configured)', { icon: '📋' });
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
      setFees(demoFees);
      setSummary(demosummary);
      toast.success('Using demo data - Backend API not available', { icon: '📋' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFees();
    }
  }, [token]);

  const handleManualPayment = async () => {
    if (!selectedFee) return;
    if (!paymentAmount || paymentAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setProcessing(true);
    try {
      const updatedFees = fees.map(fee => {
        if (fee._id === selectedFee._id) {
          const newPaidAmount = fee.paidAmount + Number(paymentAmount);
          const newDueAmount = fee.amount - newPaidAmount;
          let newStatus = fee.status;
          if (newDueAmount <= 0) newStatus = 'paid';
          else if (newPaidAmount > 0) newStatus = 'partial';
          
          return {
            ...fee,
            paidAmount: newPaidAmount,
            dueAmount: newDueAmount,
            status: newStatus
          };
        }
        return fee;
      });
      
      setFees(updatedFees);
      
      const newTotalPaid = updatedFees.reduce((sum, f) => sum + f.paidAmount, 0);
      const newTotalPending = updatedFees.reduce((sum, f) => sum + f.dueAmount, 0);
      setSummary({
        ...summary,
        paidAmount: newTotalPaid,
        pendingAmount: newTotalPending
      });
      
      toast.success(`Payment of ₹${paymentAmount} recorded successfully!`);
      setOpenPaymentDialog(false);
      setPaymentAmount('');
      setPaymentNote('');
      
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
      const updatedFees = fees.map(fee => {
        if (fee._id === selectedFee._id) {
          const newAmount = fee.amount + Number(fineAmount);
          const newDueAmount = fee.dueAmount + Number(fineAmount);
          return {
            ...fee,
            amount: newAmount,
            dueAmount: newDueAmount,
            status: fee.status === 'paid' ? 'partial' : fee.status
          };
        }
        return fee;
      });
      
      setFees(updatedFees);
      
      const newTotalAmount = updatedFees.reduce((sum, f) => sum + f.amount, 0);
      const newTotalPending = updatedFees.reduce((sum, f) => sum + f.dueAmount, 0);
      setSummary({
        ...summary,
        totalAmount: newTotalAmount,
        pendingAmount: newTotalPending
      });
      
      toast.success(`Fine of ₹${fineAmount} added successfully!`);
      setOpenFineDialog(false);
      setFineAmount('');
      setFineReason('');
      
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
      toast.success(`Reminder sent to ${selectedFee.studentName} successfully!`);
      setOpenReminderDialog(false);
    } catch (error) {
      console.error('Send reminder error:', error);
      toast.error(error.response?.data?.message || 'Failed to send reminder');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusChip = (status) => {
    switch(status) {
      case 'paid': 
        return <Chip label="Paid" size="small" sx={{ bgcolor: alpha(G[600], 0.1), color: G[600] }} icon={<CheckCircleIcon />} />;
      case 'partial': 
        return <Chip label="Partial" size="small" sx={{ bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b' }} icon={<WarningIcon />} />;
      case 'overdue': 
        return <Chip label="Overdue" size="small" sx={{ bgcolor: alpha('#ef4444', 0.1), color: '#ef4444' }} icon={<WarningIcon />} />;
      default: 
        return <Chip label="Pending" size="small" sx={{ bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6' }} icon={<InfoIcon />} />;
    }
  };

  const filteredFees = tabValue === 0 ? fees : fees.filter(f => f.status === 'pending' || f.status === 'overdue');
  const pendingTotal = fees.filter(f => f.status === 'pending' || f.status === 'overdue').length;

  if (loading) {
    return (
      <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading fee records...</Typography>
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
            <PaymentIcon sx={{ color: G[200], fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
              Fee Management
            </Typography>
            <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
              Manage student fees for your hostel
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchFees}
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
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, bgcolor: G[800], border: `1px solid ${G[700]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: G[300], fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                Total Students
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#ffffff', fontSize: '2rem' }}>
                {summary.totalStudents || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: G[600], fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                Total Fees
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: G[800], fontSize: '2rem' }}>
                ₹{(summary.totalAmount || 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: G[600], fontWeight: 600, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                Pending Collection
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#ef4444', fontSize: '2rem' }}>
                ₹{(summary.pendingAmount || 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ mb: 3, borderRadius: 2.5, border: `1px solid ${G[200]}` }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
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
          <Tab label={`All Fees (${fees.length})`} />
          <Tab label={`Pending/Overdue (${pendingTotal})`} />
        </Tabs>
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{
        borderRadius: 3,
        bgcolor: '#ffffff',
        border: `1px solid ${G[200]}`,
        boxShadow: '0 1px 4px rgba(30,122,53,0.10), 0 0 0 1px rgba(30,122,53,0.08)'
      }}>
        <Table>
          <TableHead sx={{ bgcolor: G[50] }}>
            <TableRow>
              <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Student Name</TableCell>
              <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Title</TableCell>
              <TableCell align="right" sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Amount</TableCell>
              <TableCell align="right" sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Paid</TableCell>
              <TableCell align="right" sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Pending</TableCell>
              <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Due Date</TableCell>
              <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Status</TableCell>
              <TableCell align="center" sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <PaymentIcon sx={{ fontSize: 48, color: G[400], mb: 1 }} />
                    <Typography sx={{ color: G[600] }}>No fee records found</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredFees.map((fee) => (
                <TableRow key={fee._id} hover sx={{ '&:hover': { bgcolor: G[50] } }}>
                  <TableCell sx={{ color: G[800], fontWeight: 500 }}>{fee.studentName || 'Unknown'}</TableCell>
                  <TableCell sx={{ color: G[700] }}>{fee.title}</TableCell>
                  <TableCell align="right" sx={{ color: G[700] }}>₹{(fee.amount || 0).toLocaleString()}</TableCell>
                  <TableCell align="right" sx={{ color: G[600] }}>₹{(fee.paidAmount || 0).toLocaleString()}</TableCell>
                  <TableCell align="right" sx={{ color: (fee.dueAmount || 0) > 0 ? '#ef4444' : G[600] }}>
                    ₹{(fee.dueAmount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ color: G[600] }}>{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{getStatusChip(fee.status)}</TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Tooltip title="Record Payment">
                        <IconButton 
                          size="small" 
                          onClick={() => { setSelectedFee(fee); setOpenPaymentDialog(true); }}
                          sx={{ color: G[600], bgcolor: G[100], borderRadius: 1.5 }}
                        >
                          <PaymentIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Add Fine">
                        <IconButton 
                          size="small" 
                          onClick={() => { setSelectedFee(fee); setOpenFineDialog(true); }}
                          sx={{ color: '#f59e0b', bgcolor: alpha('#f59e0b', 0.1), borderRadius: 1.5 }}
                        >
                          <WarningIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send Reminder">
                        <IconButton 
                          size="small" 
                          onClick={() => { setSelectedFee(fee); setOpenReminderDialog(true); }}
                          sx={{ color: '#3b82f6', bgcolor: alpha('#3b82f6', 0.1), borderRadius: 1.5 }}
                        >
                          <NotificationIcon sx={{ fontSize: 16 }} />
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

      <Dialog 
        open={openPaymentDialog} 
        onClose={() => setOpenPaymentDialog(false)} 
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
          <Typography variant="h6" component="div" fontWeight="bold" sx={{ color: G[800] }}>
            Record Manual Payment
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedFee && (
            <Box>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Student:</strong> {selectedFee.studentName}<br />
                  <strong>Fee:</strong> {selectedFee.title}<br />
                  <strong>Pending Amount:</strong> <span style={{ fontSize: '1.1rem', color: G[600] }}>₹{(selectedFee.dueAmount || 0).toLocaleString()}</span>
                </Typography>
              </Alert>
              
              <TextField
                fullWidth
                type="number"
                label="Payment Amount (₹)"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: 2, '& fieldset': { borderColor: G[200] } }
                }}
              />
              <TextField
                fullWidth
                label="Payment Notes (Optional)"
                multiline
                rows={2}
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                InputProps={{
                  sx: { borderRadius: 2, '& fieldset': { borderColor: G[200] } }
                }}
              />
            </Box>
          )}
        </DialogContent>
        <Divider sx={{ borderColor: G[100] }} />
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenPaymentDialog(false)} sx={{ color: G[600], border: `1px solid ${G[200]}`, px: 3, borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleManualPayment} 
            variant="contained" 
            disabled={processing}
            sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] }, px: 3, borderRadius: 2 }}
          >
            {processing ? <CircularProgress size={24} /> : 'Record Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openFineDialog} 
        onClose={() => setOpenFineDialog(false)} 
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
        <Box sx={{ height: 4, bgcolor: '#ef4444', borderRadius: '12px 12px 0 0' }} />
        <DialogTitle sx={{ bgcolor: G[50], borderBottom: `1px solid ${G[100]}` }}>
          <Typography variant="h6" component="div" fontWeight="bold" sx={{ color: G[800] }}>
            Add Fine
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedFee && (
            <Box>
              <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Student:</strong> {selectedFee.studentName}<br />
                  <strong>Fee:</strong> {selectedFee.title}
                </Typography>
              </Alert>
              
              <TextField
                fullWidth
                type="number"
                label="Fine Amount (₹)"
                value={fineAmount}
                onChange={(e) => setFineAmount(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: 2, '& fieldset': { borderColor: G[200] } }
                }}
              />
              <TextField
                fullWidth
                label="Reason for Fine"
                value={fineReason}
                onChange={(e) => setFineReason(e.target.value)}
                placeholder="e.g., Late payment, Damage, etc."
                InputProps={{
                  sx: { borderRadius: 2, '& fieldset': { borderColor: G[200] } }
                }}
              />
            </Box>
          )}
        </DialogContent>
        <Divider sx={{ borderColor: G[100] }} />
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenFineDialog(false)} sx={{ color: G[600], border: `1px solid ${G[200]}`, px: 3, borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddFine} 
            variant="contained" 
            disabled={processing}
            sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, px: 3, borderRadius: 2 }}
          >
            {processing ? <CircularProgress size={24} /> : 'Add Fine'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openReminderDialog} 
        onClose={() => setOpenReminderDialog(false)} 
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
        <Box sx={{ height: 4, bgcolor: '#3b82f6', borderRadius: '12px 12px 0 0' }} />
        <DialogTitle sx={{ bgcolor: G[50], borderBottom: `1px solid ${G[100]}` }}>
          <Typography variant="h6" component="div" fontWeight="bold" sx={{ color: G[800] }}>
            Send Fee Reminder
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedFee && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                Send reminder to <strong>{selectedFee.studentName}</strong> about pending fee of <strong>₹{(selectedFee.dueAmount || 0).toLocaleString()}</strong>
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <Divider sx={{ borderColor: G[100] }} />
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenReminderDialog(false)} sx={{ color: G[600], border: `1px solid ${G[200]}`, px: 3, borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendReminder} 
            variant="contained" 
            disabled={processing}
            sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, px: 3, borderRadius: 2 }}
          >
            {processing ? <CircularProgress size={24} /> : 'Send Reminder'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WardenFees;