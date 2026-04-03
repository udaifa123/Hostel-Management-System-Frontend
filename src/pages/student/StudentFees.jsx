import React, { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Typography, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Chip, CircularProgress, Alert, LinearProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton, Tooltip
} from '@mui/material';
import {
  Payment as PaymentIcon, Receipt as ReceiptIcon, Warning as WarningIcon,
  CheckCircle as CheckCircleIcon, Download as DownloadIcon, Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import studentService from '../../services/studentService';
import StudentSidebar from '../../components/StudentSidebar';
import PayPalPayment from '../../components/PayPalPayment';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const StudentSidebarLayout = ({ children }) => (
  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <StudentSidebar />
    <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f0fdf4', p: 3 }}>{children}</Box>
  </Box>
);

const StudentFees = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => { fetchFees(); }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await studentService.getMyFees();
      if (res.success) setFees(res.data);
    } catch (error) { toast.error('Failed to load fees'); }
    finally { setLoading(false); }
  };

  const handlePay = (fee) => {
    setSelectedFee({
      _id: fee._id, month: fee.month, year: fee.year,
      pendingAmount: fee.dueAmount, studentName: user?.name
    });
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = async (data) => {
    setPaymentOpen(false);
    toast.success('Payment successful!');
    await fetchFees();
    if (data && selectedFee) {
      setReceiptData({
        receiptId: data.receiptId, studentName: user?.name,
        month: selectedFee.month, year: selectedFee.year,
        amount: selectedFee.pendingAmount, paymentDate: new Date(),
        transactionId: data.transactionId
      });
      setReceiptOpen(true);
    }
  };

  const downloadReceipt = () => {
    const html = `<!DOCTYPE html><html><head><title>Receipt</title></head>
      <body style="font-family: Arial; padding: 20px;">
      <h1 style="color: #10b981;">Payment Receipt</h1>
      <hr/>
      <p><strong>Receipt No:</strong> ${receiptData.receiptId}</p>
      <p><strong>Student:</strong> ${receiptData.studentName}</p>
      <p><strong>Month:</strong> ${receiptData.month} ${receiptData.year}</p>
      <p><strong>Amount:</strong> ₹${receiptData.amount.toLocaleString()}</p>
      <p><strong>Date:</strong> ${format(new Date(receiptData.paymentDate), 'dd MMM yyyy, hh:mm a')}</p>
      <p><strong>Transaction:</strong> ${receiptData.transactionId}</p>
      <hr/>
      <p>Thank you for your payment!</p>
      </body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${receiptData.receiptId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Receipt downloaded');
  };

  const getStatusConfig = (status) => {
    switch(status) {
      case 'paid': return { bg: '#d1fae5', color: '#065f46', label: 'Paid', icon: <CheckCircleIcon /> };
      case 'pending': return { bg: '#fef9c3', color: '#92400e', label: 'Pending', icon: <WarningIcon /> };
      case 'overdue': return { bg: '#fee2e2', color: '#991b1b', label: 'Overdue', icon: <WarningIcon /> };
      default: return { bg: '#f3f4f6', color: '#374151', label: status };
    }
  };

  if (loading) return <StudentSidebarLayout><CircularProgress /></StudentSidebarLayout>;

  const summary = fees?.summary || { totalAmount: 0, paidAmount: 0, pendingAmount: 0, paidPercentage: 0, fineAmount: 0 };

  return (
    <StudentSidebarLayout>
      <Container maxWidth="lg">
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: '#10b981', color: 'white' }}>
          <Typography variant="h4" fontWeight="bold">My Fee Details</Typography>
          <Typography variant="body2">View and pay your hostel fees securely</Typography>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2 }}><CardContent><Typography color="textSecondary">Total Fees</Typography><Typography variant="h4">₹{summary.totalAmount.toLocaleString()}</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, bgcolor: '#e8f5e8' }}><CardContent><Typography color="success.main">Paid Amount</Typography><Typography variant="h4">₹{summary.paidAmount.toLocaleString()}</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, bgcolor: '#ffebee' }}><CardContent><Typography color="error.main">Pending Amount</Typography><Typography variant="h4" color="error.main">₹{summary.pendingAmount.toLocaleString()}</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, bgcolor: '#fff3e0' }}><CardContent><Typography color="warning.main">Late Fine</Typography><Typography variant="h4">₹{summary.fineAmount.toLocaleString()}</Typography></CardContent></Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Payment Progress</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Box flex={1}><LinearProgress variant="determinate" value={parseFloat(summary.paidPercentage)} sx={{ height: 10, borderRadius: 5 }} /></Box>
            <Typography variant="body2">{summary.paidPercentage}% Paid</Typography>
          </Box>
        </Paper>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell>Month/Year</TableCell><TableCell>Base Fee</TableCell><TableCell>Fine</TableCell>
                <TableCell>Total</TableCell><TableCell>Paid</TableCell><TableCell>Due</TableCell>
                <TableCell>Status</TableCell><TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fees?.fees?.map(fee => {
                const status = getStatusConfig(fee.status);
                const pending = fee.dueAmount;
                return (
                  <TableRow key={fee._id} hover>
                    <TableCell><Typography fontWeight={600}>{fee.month} {fee.year}</Typography></TableCell>
                    <TableCell>₹{fee.baseAmount?.toLocaleString()}</TableCell>
                    <TableCell><Chip label={`₹${fee.fineAmount?.toLocaleString()}`} size="small" color="error" /></TableCell>
                    <TableCell>₹{fee.totalAmount?.toLocaleString()}</TableCell>
                    <TableCell>₹{fee.paidAmount?.toLocaleString()}</TableCell>
                    <TableCell><Typography color={pending > 0 ? 'error.main' : 'success.main'}>₹{pending.toLocaleString()}</Typography></TableCell>
                    <TableCell><Chip label={status.label} size="small" sx={{ bgcolor: status.bg, color: status.color }} /></TableCell>
                    <TableCell align="center">
                      {pending > 0 && (
                        <Button variant="contained" size="small" startIcon={<PaymentIcon />} onClick={() => handlePay(fee)} sx={{ bgcolor: '#10b981' }}>
                          Pay ₹{pending.toLocaleString()}
                        </Button>
                      )}
                      {fee.status === 'paid' && (
                        <Tooltip title="View Receipt">
                          <IconButton size="small" color="success" onClick={() => {
                            setReceiptData(fee);
                            setReceiptOpen(true);
                          }}><ReceiptIcon /></IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {paymentOpen && <PayPalPayment open={paymentOpen} onClose={() => setPaymentOpen(false)} feeDetails={selectedFee} onSuccess={handlePaymentSuccess} />}

        <Dialog open={receiptOpen} onClose={() => setReceiptOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: '#10b981', color: 'white' }}>Payment Receipt</DialogTitle>
          <DialogContent>{receiptData && <Box><Typography>Receipt: {receiptData.receiptId}</Typography><Typography>Student: {receiptData.studentName}</Typography><Typography>Month: {receiptData.month} {receiptData.year}</Typography><Typography>Amount: ₹{receiptData.amount}</Typography><Typography>Date: {format(new Date(receiptData.paymentDate), 'dd MMM yyyy')}</Typography><Typography>Transaction: {receiptData.transactionId}</Typography></Box>}</DialogContent>
          <DialogActions><Button startIcon={<DownloadIcon />} onClick={downloadReceipt}>Download</Button><Button onClick={() => setReceiptOpen(false)}>Close</Button></DialogActions>
        </Dialog>
      </Container>
    </StudentSidebarLayout>
  );
};

export default StudentFees;