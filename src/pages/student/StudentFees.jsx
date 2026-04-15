// pages/student/StudentFees.jsx
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  InputAdornment,
  alpha,
  Fade,
  Zoom,
  Tooltip,
  Card,
  CardContent,
  Avatar,
  Badge,
  Stack,
  LinearProgress,
  Tabs,
  Tab,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel
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
  QrCode as QrCodeIcon,
  School as SchoolIcon,
  Refresh as RefreshIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import studentService from "../../services/studentService";
import { format } from 'date-fns';

/* ─────────────────────────────────────────────
   White & Green Theme System (Light Mode)
───────────────────────────────────────────── */
const theme = {
  // Background Colors
  bg: '#f8fafc',           // Main background: light gray
  bgLight: '#ffffff',       // White
  bgHover: '#f1f5f9',      // Hover state
  
  // Card Colors
  cardBg: '#ffffff',        // White cards
  cardBorder: '#e2e8f0',    // Light gray border
  
  // Primary Colors - Green
  primary: '#059669',       // Emerald green
  primaryLight: '#34d399',  // Light green
  primaryDark: '#047857',   // Dark green
  primarySoft: '#ecfdf5',   // Very light green background
  
  // Status Colors
  success: '#10b981',       // Green
  successLight: '#d1fae5',
  warning: '#f59e0b',       // Amber
  warningLight: '#fef3c7',
  error: '#ef4444',         // Red
  errorLight: '#fee2e2',
  info: '#3b82f6',          // Blue
  infoLight: '#dbeafe',
  
  // Text Colors
  textPrimary: '#0f172a',   // Dark slate
  textSecondary: '#475569', // Medium slate
  textMuted: '#64748b',     // Light slate
  
  // Borders
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  
  // Gradients
  primaryGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  successGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  warningGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  errorGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  
  // Shadows
  cardShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  hoverShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  
  // Border Radius
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  },
  
  // Typography
  fontPrimary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSecondary: "'SF Pro Display', 'Inter', 'Segoe UI', sans-serif",
};

/* ─────────────────────────────────────────────
   Styled Components
───────────────────────────────────────────── */
const StyledPaper = styled(Paper)(({ theme: muiTheme }) => ({
  padding: muiTheme.spacing(3),
  margin: muiTheme.spacing(2),
  background: theme.cardBg,
  borderRadius: theme.borderRadius.xl,
  border: `1px solid ${theme.border}`,
  boxShadow: theme.cardShadow,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.hoverShadow,
    borderColor: theme.primaryLight
  }
}));

const GlassCard = styled(Card)(({ bgcolor = theme.cardBg }) => ({
  background: bgcolor,
  borderRadius: theme.borderRadius.xl,
  border: `1px solid ${theme.border}`,
  boxShadow: theme.cardShadow,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.hoverShadow,
    borderColor: theme.primary
  }
}));

const GradientButton = styled(Button)(({ gradient = theme.primaryGradient }) => ({
  background: gradient,
  color: 'white',
  borderRadius: theme.borderRadius.lg,
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
  boxShadow: '0 4px 6px -1px rgba(5,150,105,0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgba(5,150,105,0.3)',
    filter: 'brightness(1.05)'
  },
  '&:active': {
    transform: 'translateY(0)'
  },
  '&.Mui-disabled': {
    background: alpha(theme.textMuted, 0.3),
    color: alpha(theme.textPrimary, 0.5)
  }
}));

const StatusChip = styled(Chip)(({ statuscolor }) => ({
  background: alpha(statuscolor, 0.1),
  color: statuscolor,
  border: `1px solid ${alpha(statuscolor, 0.2)}`,
  fontWeight: 600,
  fontSize: '0.75rem',
  borderRadius: theme.borderRadius.md,
  '& .MuiChip-icon': {
    color: statuscolor
  }
}));

const TableHeaderCell = styled(TableCell)({
  backgroundColor: theme.bgLight,
  color: theme.textPrimary,
  fontWeight: 700,
  fontSize: '0.85rem',
  borderBottom: `2px solid ${theme.primary}`,
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
});

const TableBodyCell = styled(TableCell)({
  color: theme.textSecondary,
  borderBottom: `1px solid ${theme.borderLight}`,
  fontSize: '0.9rem'
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: theme.cardBg,
    borderRadius: theme.borderRadius.xl,
    border: `1px solid ${theme.border}`,
    boxShadow: theme.hoverShadow
  }
});

const StyledDialogTitle = styled(DialogTitle)({
  background: theme.bgLight,
  color: theme.textPrimary,
  padding: '24px 24px 16px',
  borderBottom: `1px solid ${theme.border}`,
  '& h6': {
    fontWeight: 700,
    fontSize: '1.25rem',
    fontFamily: theme.fontSecondary,
    color: theme.primary
  }
});

const StyledDialogContent = styled(DialogContent)({
  padding: '24px',
  '& .MuiDivider-root': {
    borderColor: theme.borderLight,
    margin: '16px 0'
  }
});

const StudentFees = () => {
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    fineAmount: 0,
    paidCount: 0,
    pendingCount: 0,
    overdueCount: 0
  });
  const [selectedFee, setSelectedFee] = useState(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [processing, setProcessing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentService.getMyFees();
      console.log('Fees response:', response);
      
      if (response && response.success) {
        const feesData = response.data?.fees || [];
        const summaryData = response.data?.summary || {
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          fineAmount: 0,
          paidCount: 0,
          pendingCount: 0,
          overdueCount: 0
        };
        
        setFees(feesData);
        setSummary(summaryData);
      } else {
        setFees([]);
        setSummary({
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          fineAmount: 0,
          paidCount: 0,
          pendingCount: 0,
          overdueCount: 0
        });
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
      setError('Failed to load fee records');
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
      console.error('Payment error:', error);
      showSnackbar(error.response?.data?.message || 'Payment failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleViewReceipt = (fee) => {
    const lastPayment = fee.payments && fee.payments.length > 0 ? fee.payments[fee.payments.length - 1] : null;
    if (lastPayment) {
      setSelectedReceipt({ fee, payment: lastPayment });
      setOpenReceiptDialog(true);
    } else {
      showSnackbar('No receipt available for this payment', 'info');
    }
  };

  const downloadReceipt = () => {
    if (!selectedReceipt) return;
    
    const receiptHTML = `<!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; padding: 40px; background: #f8fafc; }
          .receipt { max-width: 600px; margin: 0 auto; background: white; border: 1px solid #e2e8f0; padding: 30px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
          .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #059669; margin: 0; font-size: 28px; }
          .details { margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
          .label { font-weight: bold; color: #64748b; }
          .value { color: #0f172a; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
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
            <div class="row"><span class="label">Receipt No:</span><span class="value">${selectedReceipt.payment.receiptId || 'N/A'}</span></div>
            <div class="row"><span class="label">Date:</span><span class="value">${new Date(selectedReceipt.payment.paymentDate).toLocaleString()}</span></div>
            <div class="row"><span class="label">Student Name:</span><span class="value">${selectedReceipt.fee.studentName || 'N/A'}</span></div>
            <div class="row"><span class="label">Fee Type:</span><span class="value">${selectedReceipt.fee.title || 'N/A'}</span></div>
            <div class="row"><span class="label">Amount Paid:</span><span class="value amount">₹${selectedReceipt.payment.amount}</span></div>
            <div class="row"><span class="label">Payment Method:</span><span class="value">${selectedReceipt.payment.paymentMethod || 'Online'}</span></div>
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
    a.download = `receipt_${selectedReceipt.payment.receiptId || Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusChip = (status) => {
    if (!status) return null;
    const statusLower = status.toLowerCase();
    switch(statusLower) {
      case 'paid':
        return <StatusChip statuscolor={theme.success} label="Paid" icon={<CheckCircleIcon />} />;
      case 'partial':
        return <StatusChip statuscolor={theme.warning} label="Partial" icon={<WarningIcon />} />;
      case 'overdue':
        return <StatusChip statuscolor={theme.error} label="Overdue" icon={<WarningIcon />} />;
      default:
        return <StatusChip statuscolor={theme.info} label="Pending" icon={<InfoIcon />} />;
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return dateString;
    }
  };

  const filteredFees = tabValue === 0 ? fees : fees.filter(f => f.status === 'pending' || f.status === 'overdue');
  const pendingTotal = fees.filter(f => f.status === 'pending' || f.status === 'overdue').length;

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: theme.bg }}
      >
        <GlassCard sx={{ p: 5, textAlign: 'center', maxWidth: 400 }}>
          <CircularProgress size={60} thickness={4} sx={{ color: theme.primary, mb: 3 }} />
          <Typography variant="h6" sx={{ color: theme.textPrimary, fontWeight: 600, mb: 2 }}>
            Loading Fee Records
          </Typography>
          <LinearProgress 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              background: alpha(theme.primary, 0.1),
              '& .MuiLinearProgress-bar': {
                background: theme.primaryGradient,
                borderRadius: 3
              }
            }} 
          />
        </GlassCard>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.bg,
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>

      <StyledPaper elevation={0}>
        {/* Header */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={4}
          className="fade-in"
        >
          <Box>
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.primary,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                mb: 1,
                display: 'block'
              }}
            >
              Fee Management
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: theme.textPrimary,
                fontFamily: theme.fontSecondary
              }}
            >
              My Fee Records
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Tooltip title="Refresh" arrow>
              <IconButton
                onClick={fetchFees}
                sx={{
                  bgcolor: theme.bgLight,
                  border: `1px solid ${theme.border}`,
                  color: theme.textMuted,
                  width: 45,
                  height: 45,
                  '&:hover': {
                    borderColor: theme.primary,
                    color: theme.primary,
                    transform: 'rotate(180deg)'
                  },
                  transition: 'all 0.5s ease'
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Fade in={true}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: theme.borderRadius.lg,
                background: alpha(theme.error, 0.1),
                color: theme.error,
                border: `1px solid ${alpha(theme.error, 0.2)}`,
                '& .MuiAlert-icon': {
                  color: theme.error
                }
              }}
              onClose={() => setError(null)}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={fetchFees}
                  sx={{ color: theme.error }}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <GlassCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: alpha(theme.primary, 0.1), width: 50, height: 50, mx: 'auto', mb: 2 }}>
                  <MoneyIcon sx={{ color: theme.primary }} />
                </Avatar>
                <Typography variant="h4" sx={{ color: theme.textPrimary, fontWeight: 700 }}>
                  ₹{(summary.totalAmount || 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.textMuted }}>
                  Total Fees
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <GlassCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: alpha(theme.success, 0.1), width: 50, height: 50, mx: 'auto', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: theme.success }} />
                </Avatar>
                <Typography variant="h4" sx={{ color: theme.textPrimary, fontWeight: 700 }}>
                  ₹{(summary.paidAmount || 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.textMuted }}>
                  Paid Amount
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={summary.totalAmount > 0 ? (summary.paidAmount / summary.totalAmount) * 100 : 0} 
                  sx={{ mt: 2, height: 6, borderRadius: 3, background: alpha(theme.success, 0.2),
                    '& .MuiLinearProgress-bar': { background: theme.successGradient, borderRadius: 3 }
                  }} 
                />
              </CardContent>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <GlassCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: alpha(theme.warning, 0.1), width: 50, height: 50, mx: 'auto', mb: 2 }}>
                  <WarningIcon sx={{ color: theme.warning }} />
                </Avatar>
                <Typography variant="h4" sx={{ color: theme.textPrimary, fontWeight: 700 }}>
                  ₹{(summary.pendingAmount || 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.textMuted }}>
                  Pending Amount
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <GlassCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: alpha(theme.error, 0.1), width: 50, height: 50, mx: 'auto', mb: 2 }}>
                  <WarningIcon sx={{ color: theme.error }} />
                </Avatar>
                <Typography variant="h4" sx={{ color: theme.textPrimary, fontWeight: 700 }}>
                  ₹{(summary.fineAmount || 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.textMuted }}>
                  Fine Amount
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: theme.borderRadius.lg, overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)} 
            sx={{ 
              borderBottom: `1px solid ${theme.border}`,
              px: 2,
              pt: 1,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                minHeight: 48,
                '&.Mui-selected': {
                  color: theme.primary
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.primary,
                height: 3
              }
            }}
          >
            <Tab label={`All Fees (${fees.length})`} />
            <Tab label={`Pending/Overdue (${pendingTotal})`} />
          </Tabs>
        </Paper>

        {/* Fees Table */}
        <TableContainer 
          component={Paper} 
          variant="outlined"
          sx={{ 
            background: theme.bgLight,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.borderRadius.xl,
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Title</TableHeaderCell>
                <TableHeaderCell align="right">Amount</TableHeaderCell>
                <TableHeaderCell align="right">Paid</TableHeaderCell>
                <TableHeaderCell align="right">Pending</TableHeaderCell>
                <TableHeaderCell>Due Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell align="center">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFees.length > 0 ? (
                filteredFees.map((fee, index) => (
                  <TableRow 
                    key={fee._id || index} 
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.bgHover
                      }
                    }}
                  >
                    <TableBodyCell>
                      <Typography variant="body2" fontWeight="600" sx={{ color: theme.textPrimary }}>
                        {fee.title || 'Monthly Fee'}
                      </Typography>
                    </TableBodyCell>
                    <TableBodyCell align="right">
                      <Typography variant="body2" fontWeight="600" sx={{ color: theme.textPrimary }}>
                        ₹{(fee.amount || 0).toLocaleString()}
                      </Typography>
                    </TableBodyCell>
                    <TableBodyCell align="right">
                      <Typography variant="body2" sx={{ color: theme.success }}>
                        ₹{(fee.paidAmount || 0).toLocaleString()}
                      </Typography>
                    </TableBodyCell>
                    <TableBodyCell align="right">
                      <Typography variant="body2" fontWeight="600" sx={{ color: (fee.dueAmount || 0) > 0 ? theme.error : theme.success }}>
                        ₹{(fee.dueAmount || 0).toLocaleString()}
                      </Typography>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarIcon sx={{ fontSize: 14, color: theme.textMuted }} />
                        <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                          {formatDate(fee.dueDate)}
                        </Typography>
                      </Box>
                    </TableBodyCell>
                    <TableBodyCell>
                      {getStatusChip(fee.status)}
                    </TableBodyCell>
                    <TableBodyCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        {fee.status !== 'paid' && (
                          <GradientButton
                            size="small"
                            onClick={() => { setSelectedFee(fee); setOpenPaymentDialog(true); }}
                            sx={{ py: 0.5, px: 2, fontSize: '0.75rem', minWidth: 80 }}
                          >
                            Pay Now
                          </GradientButton>
                        )}
                        {fee.payments && fee.payments.length > 0 && (
                          <Tooltip title="View Receipt" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleViewReceipt(fee)}
                              sx={{
                                color: theme.info,
                                bgcolor: alpha(theme.info, 0.1),
                                '&:hover': {
                                  bgcolor: alpha(theme.info, 0.2)
                                }
                              }}
                            >
                              <ReceiptIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableBodyCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableBodyCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: alpha(theme.textMuted, 0.1), width: 80, height: 80 }}>
                        <PaymentIcon sx={{ fontSize: 40, color: theme.textMuted }} />
                      </Avatar>
                      <Typography variant="h6" sx={{ color: theme.textPrimary }}>
                        No Fee Records Found
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.textMuted }}>
                        All your fee records will appear here
                      </Typography>
                    </Box>
                  </TableBodyCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Payment Dialog */}
        <StyledDialog 
          open={openPaymentDialog} 
          onClose={() => setOpenPaymentDialog(false)} 
          maxWidth="sm" 
          fullWidth
          TransitionComponent={Zoom}
        >
          <StyledDialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <PaymentIcon sx={{ color: theme.primary }} />
              <Typography variant="h6">Complete Payment</Typography>
            </Box>
          </StyledDialogTitle>
          <StyledDialogContent>
            {selectedFee && (
              <Box>
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: theme.borderRadius.lg,
                    background: alpha(theme.primary, 0.1),
                    border: `1px solid ${alpha(theme.primary, 0.2)}`,
                    '& .MuiAlert-icon': { color: theme.primary }
                  }}
                >
                  <Typography variant="body2" textAlign="center">
                    Amount to Pay: <strong style={{ fontSize: '1.2rem', color: theme.primary }}>₹{(selectedFee.dueAmount || 0).toLocaleString()}</strong>
                  </Typography>
                </Alert>
                
                <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
                  <FormLabel sx={{ color: theme.textSecondary, mb: 2, display: 'block' }}>
                    Select Payment Method
                  </FormLabel>
                  <RadioGroup 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)} 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'row', 
                      justifyContent: 'center',
                      gap: 3
                    }}
                  >
                    <FormControlLabel 
                      value="online" 
                      control={<Radio sx={{ color: theme.primary, '&.Mui-checked': { color: theme.primary } }} />} 
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <CreditCardIcon sx={{ color: theme.primary }} />
                          <Typography>Online Payment</Typography>
                        </Box>
                      } 
                    />
                    <FormControlLabel 
                      value="cash" 
                      control={<Radio sx={{ color: theme.primary, '&.Mui-checked': { color: theme.primary } }} />} 
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <WalletIcon sx={{ color: theme.warning }} />
                          <Typography>Cash at Office</Typography>
                        </Box>
                      } 
                    />
                  </RadioGroup>
                </FormControl>
                
                {paymentMethod === 'cash' && (
                  <Alert 
                    severity="warning" 
                    sx={{ 
                      mt: 2, 
                      borderRadius: theme.borderRadius.lg,
                      background: alpha(theme.warning, 0.1),
                      border: `1px solid ${alpha(theme.warning, 0.2)}`,
                      '& .MuiAlert-icon': { color: theme.warning }
                    }}
                  >
                    <Typography variant="body2">💰 Please visit the hostel office to complete your payment.</Typography>
                    <Typography variant="caption">Carry this payment request reference.</Typography>
                  </Alert>
                )}
              </Box>
            )}
          </StyledDialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button 
              onClick={() => setOpenPaymentDialog(false)} 
              disabled={processing}
              sx={{
                color: theme.textMuted,
                border: `1px solid ${theme.border}`,
                '&:hover': {
                  borderColor: theme.primary,
                  bgcolor: alpha(theme.primary, 0.05)
                }
              }}
            >
              Cancel
            </Button>
            <GradientButton
              onClick={handlePayment}
              disabled={processing}
              startIcon={processing ? <CircularProgress size={20} sx={{ color: 'white' }} /> : null}
              sx={{ minWidth: 150 }}
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </GradientButton>
          </DialogActions>
        </StyledDialog>

        {/* Receipt Dialog */}
        <StyledDialog 
          open={openReceiptDialog} 
          onClose={() => setOpenReceiptDialog(false)} 
          maxWidth="md" 
          fullWidth
          TransitionComponent={Zoom}
        >
          <StyledDialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={1}>
                <ReceiptIcon sx={{ color: theme.primary }} />
                <Typography variant="h6">Payment Receipt</Typography>
              </Box>
              <IconButton onClick={downloadReceipt} sx={{ color: theme.primary }}>
                <DownloadIcon />
              </IconButton>
            </Box>
          </StyledDialogTitle>
          <StyledDialogContent>
            {selectedReceipt && (
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} textAlign="center">
                    <Typography variant="h5" fontWeight={800} sx={{ color: theme.primary }}>
                      Payment Receipt
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Receipt No:</Typography>
                    <Typography fontWeight={600} sx={{ color: theme.textPrimary }}>{selectedReceipt.payment.receiptId || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Date:</Typography>
                    <Typography sx={{ color: theme.textPrimary }}>{selectedReceipt.payment.paymentDate ? new Date(selectedReceipt.payment.paymentDate).toLocaleString() : 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Student Name:</Typography>
                    <Typography fontWeight={600} sx={{ color: theme.textPrimary }}>{selectedReceipt.fee.studentName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Fee Type:</Typography>
                    <Typography sx={{ color: theme.textPrimary }}>{selectedReceipt.fee.title || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Amount Paid:</Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ color: theme.success }}>₹{(selectedReceipt.payment.amount || 0).toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Payment Method:</Typography>
                    <Typography sx={{ color: theme.textPrimary }}>{selectedReceipt.payment.paymentMethod || 'Online'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Transaction ID:</Typography>
                    <Typography variant="body2" sx={{ color: theme.textMuted }}>{selectedReceipt.payment.transactionId || 'N/A'}</Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                  Thank you for your payment!
                </Typography>
              </Box>
            )}
          </StyledDialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setOpenReceiptDialog(false)}
              variant="outlined"
              sx={{
                borderColor: alpha(theme.primary, 0.3),
                color: theme.primary,
                '&:hover': {
                  borderColor: theme.primary,
                  bgcolor: alpha(theme.primary, 0.05)
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </StyledDialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={Zoom}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            variant="filled"
            sx={{ 
              width: '100%',
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.hoverShadow,
              fontWeight: 600,
              background: snackbar.severity === 'success' ? theme.successGradient :
                         snackbar.severity === 'error' ? theme.errorGradient :
                         snackbar.severity === 'warning' ? theme.warningGradient :
                         theme.primaryGradient
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </StyledPaper>
    </Box>
  );
};

export default StudentFees;