// pages/parent/ParentFees.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Grid, Card, CardContent,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, CircularProgress, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, LinearProgress,
  IconButton, Tooltip, Divider, Avatar,  Tabs, Tab,
  RadioGroup, Radio, FormControlLabel, FormControl, FormLabel
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  AccountBalanceWallet as WalletIcon,
  CreditCard as CreditCardIcon,
  School as SchoolIcon,
  ChildCare as ChildIcon,
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import parentService from '../../services/parentService';
import toast from 'react-hot-toast';

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

const ParentFees = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [childrenData, setChildrenData] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchChildrenFees();
  }, []);

  const fetchChildrenFees = async () => {
    try {
      setLoading(true);
      const response = await parentService.getChildrenFees();
      console.log('Children fees response:', response);
      
      if (response && response.success) {
        setChildrenData(response.data || []);
      } else {
        setChildrenData([]);
      }
    } catch (error) {
      console.error('Error fetching children fees:', error);
      toast.error('Failed to load fees');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedFee) return;
    
    setProcessing(true);
    try {
      const response = await parentService.payChildFee({
        feeId: selectedFee._id,
        amount: selectedFee.dueAmount,
        paymentMethod
      });
      
      if (response && response.success) {
        toast.success(`Payment of ₹${response.data?.paidAmount || selectedFee.dueAmount} successful!`);
        setOpenPaymentDialog(false);
        fetchChildrenFees();
      } else {
        toast.error(response?.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleViewReceipt = (fee, child) => {
    const lastPayment = fee.payments && fee.payments.length > 0 ? fee.payments[fee.payments.length - 1] : null;
    if (lastPayment) {
      setSelectedReceipt({ fee, payment: lastPayment, child });
      setOpenReceiptDialog(true);
    } else {
      toast.info('No receipt available for this payment');
    }
  };

  const downloadReceipt = () => {
    if (!selectedReceipt) return;
    
    const receiptHTML = `<!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; background: #f0fdf4; }
          .receipt { max-width: 600px; margin: 0 auto; background: white; border: 1px solid #d1fae5; padding: 30px; border-radius: 16px; box-shadow: 0 4px 16px rgba(6,95,70,0.07); }
          .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #059669; margin: 0; font-size: 28px; }
          .details { margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #ecfdf5; }
          .label { font-weight: bold; color: #6b7280; }
          .value { color: #111827; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #d1fae5; color: #6b7280; font-size: 12px; }
          .amount { font-size: 24px; color: #059669; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>PAYMENT RECEIPT</h1>
            <p>Hostel Management System</p>
          </div>
          <div class="details">
            <div class="row"><span class="label">Receipt No:</span><span class="value">${selectedReceipt.payment.receiptNumber || selectedReceipt.payment.receiptId || 'N/A'}</span></div>
            <div class="row"><span class="label">Date:</span><span class="value">${selectedReceipt.payment.paymentDate ? new Date(selectedReceipt.payment.paymentDate).toLocaleString() : 'N/A'}</span></div>
            <div class="row"><span class="label">Student Name:</span><span class="value">${selectedReceipt.child?.name || selectedReceipt.fee.studentName || 'N/A'}</span></div>
            <div class="row"><span class="label">Fee Type:</span><span class="value">${selectedReceipt.fee.title || 'N/A'}</span></div>
            <div class="row"><span class="label">Amount Paid:</span><span class="value amount">₹${selectedReceipt.payment.amount}</span></div>
            <div class="row"><span class="label">Payment Method:</span><span class="value">${selectedReceipt.payment.paymentMethod || 'UPI'}</span></div>
            <div class="row"><span class="label">Transaction ID:</span><span class="value">${selectedReceipt.payment.transactionId || 'N/A'}</span></div>
          </div>
          <div class="footer">
            <p>Thank you for your payment!</p>
            <p>This is a computer generated receipt. No signature required.</p>
          </div>
        </div>
      </body>
      </html>`;
    
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${selectedReceipt.payment.receiptNumber || Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusChip = (status) => {
    switch(status) {
      case 'paid': 
        return <Chip label="Paid" size="small" sx={{ bgcolor: '#d1fae5', color: '#065f46', fontWeight: 600 }} icon={<CheckCircleIcon />} />;
      case 'partial': 
        return <Chip label="Partial" size="small" sx={{ bgcolor: '#fef9c3', color: '#92400e', fontWeight: 600 }} icon={<WarningIcon />} />;
      case 'overdue': 
        return <Chip label="Overdue" size="small" sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 600 }} icon={<WarningIcon />} />;
      default: 
        return <Chip label="Pending" size="small" sx={{ bgcolor: '#fef9c3', color: '#92400e', fontWeight: 600 }} icon={<InfoIcon />} />;
    }
  };

  // Flatten all fees from all children with proper student name
  const allFees = [];
  childrenData.forEach(child => {
    if (child.fees && child.fees.length) {
      child.fees.forEach(fee => {
        let studentName = 'Unknown';
        if (child.child?.name) {
          studentName = child.child.name;
        } else if (fee.studentName) {
          studentName = fee.studentName;
        } else if (child.name) {
          studentName = child.name;
        } else if (fee.student?.name) {
          studentName = fee.student.name;
        }
        
        allFees.push({
          ...fee,
          childName: studentName,
          childId: child.child?.id || child.child?._id,
          rollNumber: child.child?.rollNumber || fee.registrationNumber,
          student: child.child
        });
      });
    }
  });

  const filteredFees = tabValue === 0 ? allFees : allFees.filter(f => f.status === 'pending' || f.status === 'overdue');
  const pendingTotal = allFees.filter(f => f.status === 'pending' || f.status === 'overdue').length;

  // Calculate totals
  const totalAmount = allFees.reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalPaid = allFees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
  const totalPending = allFees.reduce((sum, f) => sum + (f.dueAmount || 0), 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f0fdf4' }}>
        <CircularProgress sx={{ color: G[600] }} thickness={5} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0fdf4' }}>
      {/* Header */}
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
            Fee Management
          </Typography>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Welcome Card */}
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
              <PaymentIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" sx={{ color: G[600], letterSpacing: '0.12em', fontSize: '0.7rem', fontWeight: 600 }}>
                Fee Management
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: G[800], lineHeight: 1.2, mb: 0.5 }}>
                Children's Fees
              </Typography>
              <Typography sx={{ color: G[500], fontSize: '0.85rem', mt: 0.3 }}>
                View and pay fees for your children
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Stats Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TrendingUpIcon sx={{ color: G[600], fontSize: 20 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: G[700], letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Overview
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Total Fees', value: `₹${totalAmount.toLocaleString()}`, color: '#047857', bg: '#ecfdf5', border: '#a7f3d0' },
            { label: 'Paid Amount', value: `₹${totalPaid.toLocaleString()}`, color: '#065f46', bg: '#d1fae5', border: '#6ee7b7' },
            { label: 'Pending Amount', value: `₹${totalPending.toLocaleString()}`, color: '#92400e', bg: '#fef9c3', border: '#fde68a' },
            { label: 'Children Count', value: childrenData.length, color: '#065f46', bg: '#d1fae5', border: '#6ee7b7' },
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

        {/* Children Summary Cards */}
        {childrenData.length > 0 && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ChildIcon sx={{ color: G[600], fontSize: 20 }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: G[700], letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Children Overview
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {childrenData.map((child, idx) => {
                const childName = child.child?.name || child.name || `Child ${idx + 1}`;
                const totalChildFees = child.fees?.reduce((sum, f) => sum + (f.amount || 0), 0) || 0;
                const pendingChildFees = child.fees?.reduce((sum, f) => sum + (f.dueAmount || 0), 0) || 0;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={child.child?.id || child.child?._id || idx}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: '16px',
                        border: '1.5px solid #d1fae5',
                        bgcolor: '#fff',
                        boxShadow: '0 4px 16px rgba(6,95,70,0.07)',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-3px)' },
                        height: '100%'
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Avatar sx={{ bgcolor: G[100], color: G[600] }}>
                            <ChildIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight={700} sx={{ color: G[800] }}>
                              {childName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                              Roll No: {child.child?.rollNumber || child.rollNumber || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider sx={{ my: 1, borderColor: G[100] }} />
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              Total Fees
                            </Typography>
                            <Typography variant="h6" fontWeight={700} sx={{ color: G[800] }}>
                              ₹{totalChildFees.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              Pending
                            </Typography>
                            <Typography variant="h6" fontWeight={700} sx={{ color: '#92400e' }}>
                              ₹{pendingChildFees.toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                        {totalChildFees > 0 && (
                          <LinearProgress
                            variant="determinate"
                            value={((totalChildFees - pendingChildFees) / totalChildFees) * 100}
                            sx={{ mt: 2, height: 6, borderRadius: 3, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600], borderRadius: 3 } }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}

        <Divider sx={{ mb: 3.5, borderColor: G[100] }} />

        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: '16px', border: '1.5px solid #d1fae5', overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)} 
            sx={{ 
              px: 2, pt: 1,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                minHeight: 48,
                '&.Mui-selected': { color: G[600] }
              },
              '& .MuiTabs-indicator': { backgroundColor: G[600], height: 3 }
            }}
          >
            <Tab label={`All Fees (${allFees.length})`} />
            <Tab label={`Pending/Overdue (${pendingTotal})`} />
          </Tabs>
        </Paper>

        {/* Fees Table */}
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
                {['Student', 'Title', 'Amount', 'Paid', 'Pending', 'Due Date', 'Status', 'Action'].map((h) => (
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
              {filteredFees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#9ca3af' }}>
                    No fee records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredFees.map((fee, idx) => (
                  <TableRow
                    key={fee._id}
                    sx={{
                      bgcolor: idx % 2 === 0 ? '#fff' : '#f0fdf4',
                      '&:hover': { bgcolor: '#ecfdf5' },
                      transition: 'background 0.15s'
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: '#d1fae5', color: G[600] }}>
                          <SchoolIcon sx={{ fontSize: 16 }} />
                        </Avatar>
                        <Typography variant="body2" fontWeight={500} sx={{ color: '#111827' }}>
                          {fee.childName || fee.studentName || 'Unknown'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#374151' }}>{fee.title}</TableCell>
                    <TableCell sx={{ color: '#374151' }}>₹{(fee.amount || 0).toLocaleString()}</TableCell>
                    <TableCell sx={{ color: '#374151' }}>₹{(fee.paidAmount || 0).toLocaleString()}</TableCell>
                    <TableCell sx={{ color: (fee.dueAmount || 0) > 0 ? '#991b1b' : '#374151', fontWeight: (fee.dueAmount || 0) > 0 ? 700 : 400 }}>
                      ₹{(fee.dueAmount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: '#374151' }}>{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{getStatusChip(fee.status)}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1} justifyContent="center">
                        {fee.status !== 'paid' && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => { setSelectedFee(fee); setOpenPaymentDialog(true); }}
                            sx={{
                              bgcolor: G[600],
                              textTransform: 'none',
                              fontSize: '0.75rem',
                              borderRadius: '8px',
                              '&:hover': { bgcolor: G[700] }
                            }}
                          >
                            Pay Now
                          </Button>
                        )}
                        {fee.payments && fee.payments.length > 0 && (
                          <Tooltip title="View Receipt">
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                const parentChild = childrenData.find(c => 
                                  (c.child?.id === fee.childId) || 
                                  (c.child?._id === fee.childId) ||
                                  (c.child?.name === fee.childName)
                                );
                                handleViewReceipt(fee, parentChild?.child);
                              }}
                              sx={{ color: G[600], bgcolor: '#ecfdf5', borderRadius: '8px' }}
                            >
                              <ReceiptIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Payment Dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
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
          Complete Payment
        </DialogTitle>
        <DialogContent sx={{ pt: 3, bgcolor: '#f0fdf4' }}>
          {selectedFee && (
            <Box>
              <Alert
                severity="info"
                sx={{
                  mb: 3,
                  borderRadius: '12px',
                  bgcolor: '#ecfdf5',
                  color: '#065f46',
                  border: '1px solid #6ee7b7'
                }}
              >
                <Typography variant="body2" textAlign="center">
                  <strong>Student:</strong> {selectedFee.childName || selectedFee.studentName}<br />
                  <strong>Amount to Pay:</strong> <span style={{ fontSize: '1.2rem', color: G[600] }}>₹{(selectedFee.dueAmount || 0).toLocaleString()}</span>
                </Typography>
              </Alert>
              
              <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
                <FormLabel sx={{ color: G[700], fontWeight: 600, mb: 1, display: 'block' }}>
                  Select Payment Method
                </FormLabel>
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} sx={{ alignItems: 'center' }}>
                  <FormControlLabel 
                    value="UPI" 
                    control={<Radio sx={{ color: G[600], '&.Mui-checked': { color: G[600] } }} />} 
                    label={<Box display="flex" alignItems="center" gap={1}><CreditCardIcon sx={{ color: G[600] }} /> UPI / Card Payment</Box>} 
                  />
                  <FormControlLabel 
                    value="Cash" 
                    control={<Radio sx={{ color: G[600], '&.Mui-checked': { color: G[600] } }} />} 
                    label={<Box display="flex" alignItems="center" gap={1}><WalletIcon sx={{ color: '#92400e' }} /> Cash at Office</Box>} 
                  />
                </RadioGroup>
              </FormControl>
              
              {paymentMethod === 'Cash' && (
                <Alert
                  severity="warning"
                  sx={{
                    mt: 2,
                    borderRadius: '12px',
                    bgcolor: '#fef9c3',
                    color: '#92400e',
                    border: '1px solid #fde68a'
                  }}
                >
                  <Typography variant="body2">💰 Please visit the hostel office to complete your payment.</Typography>
                  <Typography variant="caption">Carry this payment request reference.</Typography>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#f0fdf4', borderTop: '1px solid #d1fae5', px: 3, py: 2 }}>
          <Button
            onClick={() => setOpenPaymentDialog(false)}
            sx={{
              borderColor: G[300], color: G[700],
              borderRadius: '10px', textTransform: 'none', fontWeight: 600,
              '&:hover': { borderColor: G[500], bgcolor: G[50] }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            variant="contained"
            disabled={processing}
            sx={{
              bgcolor: G[600],
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': { bgcolor: G[700] }
            }}
          >
            {processing ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Pay Now'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog
        open={openReceiptDialog}
        onClose={() => setOpenReceiptDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
            color: '#fff',
            fontWeight: 700,
            py: 2.5,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          Payment Receipt
          <IconButton onClick={downloadReceipt} sx={{ color: '#fff' }}>
            <DownloadIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: '#f0fdf4', borderColor: '#d1fae5', p: 3 }}>
          {selectedReceipt && (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} textAlign="center">
                  <Typography variant="h5" fontWeight={800} sx={{ color: G[600] }}>Payment Receipt</Typography>
                  <Divider sx={{ my: 2, borderColor: G[100] }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>Receipt No:</Typography>
                  <Typography fontWeight={600} sx={{ color: '#111827' }}>{selectedReceipt.payment.receiptNumber || selectedReceipt.payment.receiptId || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>Date:</Typography>
                  <Typography sx={{ color: '#111827' }}>{selectedReceipt.payment.paymentDate ? new Date(selectedReceipt.payment.paymentDate).toLocaleString() : 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>Student Name:</Typography>
                  <Typography fontWeight={600} sx={{ color: '#111827' }}>{selectedReceipt.child?.name || selectedReceipt.fee.studentName || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>Fee Type:</Typography>
                  <Typography sx={{ color: '#111827' }}>{selectedReceipt.fee.title || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>Amount Paid:</Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ color: G[600] }}>₹{(selectedReceipt.payment.amount || 0).toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>Payment Method:</Typography>
                  <Typography sx={{ color: '#111827' }}>{selectedReceipt.payment.paymentMethod || 'UPI'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>Transaction ID:</Typography>
                  <Typography variant="body2" sx={{ color: '#111827' }}>{selectedReceipt.payment.transactionId || 'N/A'}</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2, borderColor: G[100] }} />
              <Typography variant="caption" sx={{ color: '#6b7280' }} textAlign="center" display="block">
                Thank you for your payment!
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#f0fdf4', borderTop: '1px solid #d1fae5', px: 3, py: 2 }}>
          <Button
            onClick={() => setOpenReceiptDialog(false)}
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

export default ParentFees;