// pages/parent/ParentFees.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Typography, Grid, Card, CardContent,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, CircularProgress, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, LinearProgress,
  IconButton, Tooltip, Divider, Avatar, alpha, Tabs, Tab,
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
  ChildCare as ChildIcon
} from '@mui/icons-material';
import parentService from '../../services/parentService';
import ParentLayout from '../../components/Layout/ParentLayout';
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

const ParentFees = () => {
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
    
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .receipt { max-width: 600px; margin: 0 auto; border: 1px solid #ccc; padding: 30px; border-radius: 10px; }
          .header { text-align: center; border-bottom: 2px solid #2e7d32; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #2e7d32; margin: 0; }
          .details { margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .label { font-weight: bold; color: #666; }
          .value { color: #333; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; color: #666; }
          .amount { font-size: 24px; color: #2e7d32; font-weight: bold; }
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
      </html>
    `;
    
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
      case 'paid': return <Chip label="Paid" size="small" sx={{ bgcolor: alpha(theme.success, 0.1), color: theme.success }} icon={<CheckCircleIcon />} />;
      case 'partial': return <Chip label="Partial" size="small" sx={{ bgcolor: alpha(theme.warning, 0.1), color: theme.warning }} icon={<WarningIcon />} />;
      case 'overdue': return <Chip label="Overdue" size="small" sx={{ bgcolor: alpha(theme.error, 0.1), color: theme.error }} icon={<WarningIcon />} />;
      default: return <Chip label="Pending" size="small" sx={{ bgcolor: alpha(theme.info, 0.1), color: theme.info }} icon={<InfoIcon />} />;
    }
  };

  // ✅ FIX: Flatten all fees from all children with proper student name
  const allFees = [];
  childrenData.forEach(child => {
    if (child.fees && child.fees.length) {
      child.fees.forEach(fee => {
        // ✅ Get student name from multiple possible sources
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

  if (loading) {
    return (
      <ParentLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress sx={{ color: theme.primary }} />
        </Box>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <Box sx={{ bgcolor: theme.bg, minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: theme.bgLight, border: `1px solid ${theme.border}` }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: alpha(theme.primary, 0.1), width: 56, height: 56 }}>
                <PaymentIcon sx={{ fontSize: 32, color: theme.primary }} />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={800} sx={{ color: theme.primaryDark }}>Children's Fees</Typography>
                <Typography variant="body2" sx={{ color: theme.textMuted }}>View and pay fees for your children</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Children Summary Cards */}
          {childrenData.length > 0 && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {childrenData.map((child, idx) => {
                // ✅ Get child name safely
                const childName = child.child?.name || child.name || `Child ${idx + 1}`;
                return (
                  <Grid item xs={12} sm={6} md={4} key={child.child?.id || child.child?._id || idx}>
                    <Card sx={{ bgcolor: theme.bgLight, borderRadius: 3, border: `1px solid ${theme.border}` }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Avatar sx={{ bgcolor: alpha(theme.primary, 0.1) }}>
                            <ChildIcon sx={{ color: theme.primary }} />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight={700}>{childName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Roll No: {child.child?.rollNumber || child.rollNumber || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Total Fees</Typography>
                            <Typography variant="h6" fontWeight={700}>
                              ₹{(child.summary?.totalAmount || 0).toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Pending</Typography>
                            <Typography variant="h6" fontWeight={700} sx={{ color: theme.error }}>
                              ₹{(child.summary?.pendingAmount || 0).toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* Tabs */}
          <Paper sx={{ mb: 3, borderRadius: 3 }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: `1px solid ${theme.border}`, px: 2 }}>
              <Tab label={`All Fees (${allFees.length})`} />
              <Tab label={`Pending/Overdue (${pendingTotal})`} />
            </Tabs>
          </Paper>

          {/* Fees Table */}
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: theme.bg }}>
                  <TableRow>
                    <TableCell><strong>Student</strong></TableCell>
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
                        {/* ✅ Show student name properly */}
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(theme.primary, 0.1) }}>
                              <SchoolIcon sx={{ fontSize: 16, color: theme.primary }} />
                            </Avatar>
                            <Typography variant="body2" fontWeight={500}>
                              {fee.childName || fee.studentName || 'Unknown'}
                            </Typography>
                          </Box>
                        </TableCell>
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
                            {fee.status !== 'paid' && (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => { setSelectedFee(fee); setOpenPaymentDialog(true); }}
                                sx={{ bgcolor: theme.primary, textTransform: 'none' }}
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
                                  sx={{ color: theme.info }}
                                >
                                  <ReceiptIcon />
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
          </Paper>

          {/* Payment Dialog */}
          <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: theme.primarySoft, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={700}>Complete Payment</Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              {selectedFee && (
                <Box>
                  <Alert severity="info" sx={{ mb: 3, textAlign: 'center' }}>
                    <Typography variant="body2">
                      Student: <strong>{selectedFee.childName || selectedFee.studentName}</strong><br />
                      Amount to Pay: <strong style={{ fontSize: '1.2rem' }}>₹{(selectedFee.dueAmount || 0).toLocaleString()}</strong>
                    </Typography>
                  </Alert>
                  
                  <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
                    <FormLabel component="legend" sx={{ textAlign: 'center', width: '100%' }}>Select Payment Method</FormLabel>
                    <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} sx={{ alignItems: 'center' }}>
                      <FormControlLabel 
                        value="UPI" 
                        control={<Radio />} 
                        label={<Box display="flex" alignItems="center" gap={1}><CreditCardIcon /> UPI / Card Payment</Box>} 
                      />
                      <FormControlLabel 
                        value="Cash" 
                        control={<Radio />} 
                        label={<Box display="flex" alignItems="center" gap={1}><WalletIcon /> Cash at Office</Box>} 
                      />
                    </RadioGroup>
                  </FormControl>
                  
                  {paymentMethod === 'Cash' && (
                    <Alert severity="warning" sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography variant="body2">💰 Please visit the hostel office to complete your payment.</Typography>
                      <Typography variant="caption">Carry this payment request reference.</Typography>
                    </Alert>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
              <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
              <Button 
                onClick={handlePayment} 
                variant="contained" 
                disabled={processing}
                sx={{ bgcolor: theme.primary, textTransform: 'none' }}
              >
                {processing ? <CircularProgress size={24} /> : 'Pay Now'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Receipt Dialog */}
          <Dialog open={openReceiptDialog} onClose={() => setOpenReceiptDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: theme.primarySoft }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={700}>Payment Receipt</Typography>
                <IconButton onClick={downloadReceipt}><DownloadIcon /></IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              {selectedReceipt && (
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} textAlign="center">
                      <Typography variant="h5" fontWeight={800} sx={{ color: theme.primary }}>Payment Receipt</Typography>
                      <Divider sx={{ my: 2 }} />
                    </Grid>
                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Receipt No:</Typography><Typography fontWeight={600}>{selectedReceipt.payment.receiptNumber || selectedReceipt.payment.receiptId || 'N/A'}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Date:</Typography><Typography>{selectedReceipt.payment.paymentDate ? new Date(selectedReceipt.payment.paymentDate).toLocaleString() : 'N/A'}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Student Name:</Typography><Typography fontWeight={600}>{selectedReceipt.child?.name || selectedReceipt.fee.studentName || 'N/A'}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Fee Type:</Typography><Typography>{selectedReceipt.fee.title || 'N/A'}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Amount Paid:</Typography><Typography variant="h6" fontWeight={700} sx={{ color: theme.success }}>₹{(selectedReceipt.payment.amount || 0).toLocaleString()}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="body2" color="text.secondary">Payment Method:</Typography><Typography>{selectedReceipt.payment.paymentMethod || 'UPI'}</Typography></Grid>
                    <Grid item xs={12}><Typography variant="body2" color="text.secondary">Transaction ID:</Typography><Typography variant="body2">{selectedReceipt.payment.transactionId || 'N/A'}</Typography></Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" color="text.secondary" textAlign="center" display="block">Thank you for your payment!</Typography>
                </Box>
              )}
            </DialogContent>
          </Dialog>
        </Container>
      </Box>
    </ParentLayout>
  );
};

export default ParentFees;