import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  alpha,
  Fade,
  Zoom,
  Tooltip,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
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
  Refresh as RefreshIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import studentService from "../../services/studentService";
import { format } from 'date-fns';


const theme = {
  bg: '#f8fafc',
  bgLight: '#ffffff',
  bgHover: '#f1f5f9',
  cardBg: '#ffffff',
  cardBorder: '#e2e8f0',
  primary: '#059669',
  primaryLight: '#34d399',
  primaryDark: '#047857',
  primarySoft: '#ecfdf5',
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  error: '#ef4444',
  errorLight: '#fee2e2',
  info: '#3b82f6',
  infoLight: '#dbeafe',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  primaryGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  successGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  warningGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  errorGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  cardShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  hoverShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  borderRadius: { sm: '6px', md: '8px', lg: '12px', xl: '16px' }
};

const StyledPaper = styled(Paper)({
  padding: 24,
  margin: 16,
  background: theme.cardBg,
  borderRadius: theme.borderRadius.xl,
  border: `1px solid ${theme.border}`,
  boxShadow: theme.cardShadow,
});

const GlassCard = styled(Card)({
  background: theme.cardBg,
  borderRadius: theme.borderRadius.xl,
  border: `1px solid ${theme.border}`,
  boxShadow: theme.cardShadow,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.hoverShadow,
    borderColor: theme.primary
  }
});

const GradientButton = styled(Button)({
  background: theme.primaryGradient,
  color: 'white',
  borderRadius: theme.borderRadius.lg,
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
  '&:hover': {
    transform: 'translateY(-2px)',
    filter: 'brightness(1.05)'
  }
});

const StatusChip = styled(Chip)(({ statuscolor }) => ({
  background: alpha(statuscolor, 0.1),
  color: statuscolor,
  border: `1px solid ${alpha(statuscolor, 0.2)}`,
  fontWeight: 600,
  fontSize: '0.75rem',
  borderRadius: theme.borderRadius.md,
}));

const StudentFees = () => {
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({
    totalAmount: 0, paidAmount: 0, pendingAmount: 0,
    fineAmount: 0, paidCount: 0, pendingCount: 0, overdueCount: 0
  });
  const [selectedFee, setSelectedFee] = useState(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [processing, setProcessing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [expandedFee, setExpandedFee] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await studentService.getMyFees();
      console.log('Fees response:', response);
      
      if (response && response.success) {
        const feesData = response.data?.fees || [];
        const summaryData = response.data?.summary || {
          totalAmount: 0, paidAmount: 0, pendingAmount: 0,
          fineAmount: 0, paidCount: 0, pendingCount: 0, overdueCount: 0
        };
        setFees(feesData);
        setSummary(summaryData);
      } else {
        setFees([]);
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
      showSnackbar('Failed to load fees', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedFee) return;
    setProcessing(true);
    try {
      const response = await studentService.processPayment({
        feeId: selectedFee._id,
        amount: selectedFee.dueAmount,
        paymentMethod
      });
      if (response && response.success) {
        showSnackbar(`Payment of ₹${response.data?.paidAmount || selectedFee.dueAmount} successful!`, 'success');
        setOpenPaymentDialog(false);
        fetchFees();
      } else {
        showSnackbar(response?.message || 'Payment failed', 'error');
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Payment failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleViewReceipt = (fee) => {
    const lastPayment = fee.payments?.length > 0 ? fee.payments[fee.payments.length - 1] : null;
    if (lastPayment) {
      setSelectedReceipt({ fee, payment: lastPayment });
      setOpenReceiptDialog(true);
    } else {
      showSnackbar('No receipt available', 'info');
    }
  };

  const downloadReceipt = () => {
    if (!selectedReceipt) return;
    const receiptHTML = `<!DOCTYPE html><html><head><title>Payment Receipt</title>
      <style>body{font-family:Arial;padding:40px;background:#f0fdf4}.receipt{max-width:600px;margin:0 auto;background:white;border:1px solid #d1fae5;padding:30px;border-radius:16px}.header{text-align:center;border-bottom:2px solid #059669;padding-bottom:20px}.header h1{color:#059669}.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #ecfdf5}.amount{font-size:24px;color:#059669;font-weight:bold}.footer{text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #d1fae5}</style>
      </head><body><div class="receipt"><div class="header"><h1>PAYMENT RECEIPT</h1><p>Hostel Management System</p></div>
      <div class="row"><span>Receipt No:</span><span>${selectedReceipt.payment.receiptId || 'N/A'}</span></div>
      <div class="row"><span>Date:</span><span>${new Date(selectedReceipt.payment.paymentDate).toLocaleString()}</span></div>
      <div class="row"><span>Student Name:</span><span>${selectedReceipt.fee.studentName || 'N/A'}</span></div>
      <div class="row"><span>Fee Type:</span><span>${selectedReceipt.fee.title || 'N/A'}</span></div>
      <div class="row"><span>Amount Paid:</span><span class="amount">₹${selectedReceipt.payment.amount}</span></div>
      <div class="row"><span>Payment Method:</span><span>${selectedReceipt.payment.paymentMethod || 'Online'}</span></div>
      <div class="footer"><p>Thank you for your payment!</p></div></div></body></html>`;
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  
  const getAttendanceImpact = (attendancePercentage) => {
    if (attendancePercentage >= 90) {
      return { type: 'discount', percentage: 5, message: 'Excellent! 5% discount applied', color: theme.success, icon: <TrendingUpIcon /> };
    } else if (attendancePercentage >= 85) {
      return { type: 'discount', percentage: 3, message: 'Great! 3% discount applied', color: theme.success, icon: <TrendingUpIcon /> };
    } else if (attendancePercentage >= 80) {
      return { type: 'discount', percentage: 1, message: 'Good! 1% discount applied', color: theme.success, icon: <TrendingUpIcon /> };
    } else if (attendancePercentage < 50) {
      return { type: 'penalty', percentage: 20, message: 'Poor attendance! 20% penalty applied', color: theme.error, icon: <TrendingDownIcon /> };
    } else if (attendancePercentage < 65) {
      return { type: 'penalty', percentage: 10, message: 'Low attendance! 10% penalty applied', color: theme.error, icon: <TrendingDownIcon /> };
    } else if (attendancePercentage < 75) {
      return { type: 'penalty', percentage: 5, message: 'Below 75% attendance! 5% penalty applied', color: theme.error, icon: <TrendingDownIcon /> };
    }
    return { type: 'none', percentage: 0, message: 'Attendance requirement met', color: theme.textMuted, icon: <InfoIcon /> };
  };

  const getStatusChip = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid': return <StatusChip statuscolor={theme.success} label="Paid" icon={<CheckCircleIcon />} />;
      case 'partial': return <StatusChip statuscolor={theme.warning} label="Partial" icon={<WarningIcon />} />;
      case 'overdue': return <StatusChip statuscolor={theme.error} label="Overdue" icon={<WarningIcon />} />;
      default: return <StatusChip statuscolor={theme.info} label="Pending" icon={<InfoIcon />} />;
    }
  };

  const showSnackbar = (message, severity) => setSnackbar({ open: true, message, severity });
  const formatDate = (dateString) => dateString ? format(new Date(dateString), 'dd MMM yyyy') : 'N/A';

  const filteredFees = tabValue === 0 ? fees : fees.filter(f => f.status === 'pending' || f.status === 'overdue');
  const pendingTotal = fees.filter(f => f.status === 'pending' || f.status === 'overdue').length;

  if (loading) {
    return (
      <Box sx={{ bgcolor: theme.bg, minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, '& .MuiLinearProgress-bar': { bgcolor: theme.primary } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: theme.primary }}>Loading fee records...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: theme.bg, p: 3 }}>
    
      <StyledPaper elevation={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: theme.primary, width: 46, height: 46, borderRadius: 2 }}>
              <MoneyIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: theme.textPrimary }}>My Fee Records</Typography>
              <Typography variant="body2" sx={{ color: theme.textMuted }}>Fees are calculated based on your monthly attendance</Typography>
            </Box>
          </Box>
          <IconButton onClick={fetchFees} sx={{ bgcolor: theme.bgLight, border: `1px solid ${theme.border}`, borderRadius: 2 }}>
            <RefreshIcon />
          </IconButton>
        </Box>

       
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2, bgcolor: theme.primarySoft, border: `1px solid ${theme.primaryLight}` }}>
          <Typography variant="body2">
            <strong>📊 Attendance-Based Fee Calculation:</strong> Your monthly fee is adjusted based on your attendance percentage.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <Chip label="90%+ → 5% Discount" size="small" sx={{ bgcolor: alpha(theme.success, 0.1), color: theme.success }} />
            <Chip label="85-89% → 3% Discount" size="small" sx={{ bgcolor: alpha(theme.success, 0.1), color: theme.success }} />
            <Chip label="80-84% → 1% Discount" size="small" sx={{ bgcolor: alpha(theme.success, 0.1), color: theme.success }} />
            <Chip label="Below 75% → 5-20% Penalty" size="small" sx={{ bgcolor: alpha(theme.error, 0.1), color: theme.error }} />
          </Box>
        </Alert>

       
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <GlassCard><CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: theme.textMuted }}>Total Fees</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: theme.textPrimary }}>₹{(summary.totalAmount || 0).toLocaleString()}</Typography>
            </CardContent></GlassCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <GlassCard><CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: theme.textMuted }}>Paid Amount</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: theme.success }}>₹{(summary.paidAmount || 0).toLocaleString()}</Typography>
              <LinearProgress variant="determinate" value={(summary.paidAmount / summary.totalAmount) * 100 || 0} sx={{ mt: 1, height: 4, borderRadius: 2 }} />
            </CardContent></GlassCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <GlassCard><CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: theme.textMuted }}>Pending Amount</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: theme.error }}>₹{(summary.pendingAmount || 0).toLocaleString()}</Typography>
            </CardContent></GlassCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <GlassCard><CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: theme.textMuted }}>Fees Paid</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: theme.primary }}>{summary.paidCount || 0}/{fees.length}</Typography>
            </CardContent></GlassCard>
          </Grid>
        </Grid>

        
        <Paper sx={{ mb: 3, borderRadius: 2, border: `1px solid ${theme.border}` }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 }, '& .MuiTabs-indicator': { bgcolor: theme.primary, height: 3 } }}>
            <Tab label={`All Fees (${fees.length})`} />
            <Tab label={`Pending/Overdue (${pendingTotal})`} />
          </Tabs>
        </Paper>

        {filteredFees.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <MoneyIcon sx={{ fontSize: 64, color: theme.textMuted, mb: 2 }} />
            <Typography sx={{ color: theme.textMuted }}>No fee records found</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredFees.map((fee) => {
              const attendanceImpact = getAttendanceImpact(fee.attendancePercentage || 100);
              const isExpanded = expandedFee === fee._id;
              
              return (
                <Grid item xs={12} key={fee._id}>
                  <Card sx={{ borderRadius: 3, border: `1px solid ${fee.status === 'overdue' ? theme.error : theme.border}` }}>
                    <CardContent sx={{ p: 3 }}>

                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                        <Box>
                          <Typography variant="h6" fontWeight={700} sx={{ color: theme.textPrimary }}>{fee.title}</Typography>
                          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            <Chip size="small" label={`${fee.month}/${fee.year}`} sx={{ bgcolor: theme.primarySoft, color: theme.primary }} />
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <CalendarIcon sx={{ fontSize: 14, color: theme.textMuted }} />
                              <Typography variant="caption">Due: {formatDate(fee.dueDate)}</Typography>
                            </Box>
                          </Box>
                        </Box>
                        {getStatusChip(fee.status)}
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" sx={{ color: theme.textMuted }}>Total Amount</Typography>
                          <Typography variant="h6" fontWeight={700}>₹{(fee.amount || 0).toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" sx={{ color: theme.textMuted }}>Paid Amount</Typography>
                          <Typography variant="h6" fontWeight={600} sx={{ color: theme.success }}>₹{(fee.paidAmount || 0).toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" sx={{ color: theme.textMuted }}>Pending Amount</Typography>
                          <Typography variant="h6" fontWeight={700} sx={{ color: (fee.dueAmount || 0) > 0 ? theme.error : theme.success }}>₹{(fee.dueAmount || 0).toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ width: 40, height: 40, bgcolor: alpha(attendanceImpact.color, 0.1) }}>{attendanceImpact.icon}</Avatar>
                            <Box>
                              <Typography variant="caption" sx={{ color: theme.textMuted }}>Attendance</Typography>
                              <Typography variant="body2" fontWeight={600} sx={{ color: attendanceImpact.color }}>
                                {fee.attendancePercentage || 100}% 
                                {attendanceImpact.type !== 'none' && ` (${attendanceImpact.percentage}% ${attendanceImpact.type === 'discount' ? 'off' : 'penalty'})`}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      <Accordion 
                        expanded={isExpanded} 
                        onChange={() => setExpandedFee(isExpanded ? null : fee._id)} 
                        sx={{ mt: 2, boxShadow: 'none', border: `1px solid ${theme.borderLight}`, borderRadius: 2, '&:before': { display: 'none' } }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 48 }}>
                          <Typography variant="body2" fontWeight={600} sx={{ color: attendanceImpact.color }}>
                            📊 {attendanceImpact.message}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ bgcolor: theme.primarySoft, borderRadius: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Paper sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600}>Fee Breakdown</Typography>
                                <Box display="flex" justifyContent="space-between" mt={1}>
                                  <Typography variant="body2">Base Amount</Typography>
                                  <Typography variant="body2">₹{(fee.baseAmount || fee.amount || 0).toLocaleString()}</Typography>
                                </Box>
                                {fee.attendanceBasedDiscount > 0 && (
                                  <Box display="flex" justifyContent="space-between" mt={0.5}>
                                    <Typography variant="body2" sx={{ color: theme.success }}>Attendance Discount ({attendanceImpact.percentage}%)</Typography>
                                    <Typography variant="body2" sx={{ color: theme.success }}>-₹{fee.attendanceBasedDiscount.toLocaleString()}</Typography>
                                  </Box>
                                )}
                                {fee.attendanceBasedPenalty > 0 && (
                                  <Box display="flex" justifyContent="space-between" mt={0.5}>
                                    <Typography variant="body2" sx={{ color: theme.error }}>Attendance Penalty ({attendanceImpact.percentage}%)</Typography>
                                    <Typography variant="body2" sx={{ color: theme.error }}>+₹{fee.attendanceBasedPenalty.toLocaleString()}</Typography>
                                  </Box>
                                )}
                                <Divider sx={{ my: 1 }} />
                                <Box display="flex" justifyContent="space-between">
                                  <Typography variant="body2" fontWeight={600}>Final Amount</Typography>
                                  <Typography variant="body2" fontWeight={600}>₹{(fee.amount || 0).toLocaleString()}</Typography>
                                </Box>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Paper sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600}>How Attendance Affects Your Fee</Typography>
                                <Box mt={1}>
                                  <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="caption">90%+ attendance</Typography>
                                    <Chip label="5% Discount" size="small" sx={{ bgcolor: alpha(theme.success, 0.1), color: theme.success }} />
                                  </Box>
                                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                    <Typography variant="caption">85-89% attendance</Typography>
                                    <Chip label="3% Discount" size="small" sx={{ bgcolor: alpha(theme.success, 0.1), color: theme.success }} />
                                  </Box>
                                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                    <Typography variant="caption">80-84% attendance</Typography>
                                    <Chip label="1% Discount" size="small" sx={{ bgcolor: alpha(theme.success, 0.1), color: theme.success }} />
                                  </Box>
                                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                    <Typography variant="caption">Below 75% attendance</Typography>
                                    <Chip label="5-20% Penalty" size="small" sx={{ bgcolor: alpha(theme.error, 0.1), color: theme.error }} />
                                  </Box>
                                </Box>
                              </Paper>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>

                      <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                        {fee.status !== 'paid' && fee.dueAmount > 0 && (
                          <GradientButton startIcon={<PaymentIcon />} onClick={() => { setSelectedFee(fee); setOpenPaymentDialog(true); }}>
                            Pay Now
                          </GradientButton>
                        )}
                        {fee.payments?.length > 0 && (
                          <Button variant="outlined" startIcon={<ReceiptIcon />} onClick={() => handleViewReceipt(fee)} sx={{ borderColor: theme.border, color: theme.textSecondary }}>
                            View Receipt
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </StyledPaper>

      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <Box sx={{ height: 4, bgcolor: theme.primary }} />
        <DialogTitle sx={{ bgcolor: theme.primarySoft }}>Complete Payment</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedFee && (
            <Box>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2, bgcolor: theme.primarySoft }}>
                <Typography textAlign="center">Amount to Pay: <strong style={{ fontSize: '1.2rem', color: theme.primary }}>₹{(selectedFee.dueAmount || 0).toLocaleString()}</strong></Typography>
              </Alert>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormLabel sx={{ fontWeight: 600, mb: 2, display: 'block' }}>Select Payment Method</FormLabel>
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 3 }}>
                  <FormControlLabel value="online" control={<Radio sx={{ color: theme.primary }} />} label={<Box display="flex" alignItems="center" gap={1}><CreditCardIcon /> Online Payment</Box>} />
                  <FormControlLabel value="cash" control={<Radio sx={{ color: theme.primary }} />} label={<Box display="flex" alignItems="center" gap={1}><WalletIcon /> Cash at Office</Box>} />
                </RadioGroup>
              </FormControl>
              {paymentMethod === 'cash' && <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>💰 Please visit the hostel office to complete your payment.</Alert>}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button onClick={() => setOpenPaymentDialog(false)} sx={{ border: `1px solid ${theme.border}` }}>Cancel</Button>
          <Button onClick={handlePayment} variant="contained" disabled={processing} sx={{ bgcolor: theme.primary }}>{processing ? <CircularProgress size={24} /> : 'Pay Now'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openReceiptDialog} onClose={() => setOpenReceiptDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ bgcolor: theme.primarySoft, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Payment Receipt
          <IconButton onClick={downloadReceipt}><DownloadIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: theme.primarySoft }}>
          {selectedReceipt && (
            <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} textAlign="center"><Typography variant="h5" fontWeight={800} sx={{ color: theme.primary }}>Payment Receipt</Typography><Divider sx={{ my: 2 }} /></Grid>
                <Grid item xs={6}><Typography variant="caption">Receipt No:</Typography><Typography fontWeight={600}>{selectedReceipt.payment.receiptId || 'N/A'}</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption">Date:</Typography><Typography>{new Date(selectedReceipt.payment.paymentDate).toLocaleString()}</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption">Student Name:</Typography><Typography fontWeight={600}>{selectedReceipt.fee.studentName}</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption">Fee Type:</Typography><Typography>{selectedReceipt.fee.title}</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption">Amount Paid:</Typography><Typography variant="h6" fontWeight={700} sx={{ color: theme.success }}>₹{selectedReceipt.payment.amount}</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption">Payment Method:</Typography><Typography>{selectedReceipt.payment.paymentMethod || 'Online'}</Typography></Grid>
                <Grid item xs={12}><Typography variant="caption">Transaction ID:</Typography><Typography>{selectedReceipt.payment.transactionId || 'N/A'}</Typography></Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" textAlign="center" display="block">Thank you for your payment!</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions><Button onClick={() => setOpenReceiptDialog(false)} variant="outlined">Close</Button></DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentFees;