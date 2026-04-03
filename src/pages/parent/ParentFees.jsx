import React, { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Typography, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Chip, CircularProgress, Alert, Accordion, AccordionSummary, AccordionDetails,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Payment as PaymentIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import parentService from '../../services/parentService';
import ParentLayout from '../../components/Layout/ParentLayout';
import PayPalPayment from '../../components/PayPalPayment';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ParentFees = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [childrenData, setChildrenData] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  useEffect(() => { fetchFees(); }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await parentService.getChildrenFees();
      if (response.success) setChildrenData(response.data);
    } catch (error) { toast.error('Failed to load fees'); }
    finally { setLoading(false); }
  };

  const handlePay = (child, fee) => {
    setSelectedFee({
      _id: fee._id, month: fee.month, year: fee.year,
      pendingAmount: fee.dueAmount, studentName: child.name
    });
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = async (data) => {
    setPaymentOpen(false);
    toast.success('Payment successful!');
    await fetchFees();
    if (data && selectedFee) {
      setReceiptData({
        receiptId: data.receiptId, studentName: selectedFee.studentName,
        month: selectedFee.month, year: selectedFee.year,
        amount: selectedFee.pendingAmount, paymentDate: new Date(),
        transactionId: data.transactionId
      });
      setReceiptOpen(true);
    }
  };

  const downloadReceipt = () => {
    const html = `<!DOCTYPE html><html><head><title>Receipt</title></head>
      <body><h1>Payment Receipt</h1><p>Receipt: ${receiptData.receiptId}</p>
      <p>Student: ${receiptData.studentName}</p><p>Month: ${receiptData.month} ${receiptData.year}</p>
      <p>Amount: ₹${receiptData.amount}</p><p>Date: ${format(new Date(receiptData.paymentDate), 'dd MMM yyyy')}</p>
      <p>Transaction: ${receiptData.transactionId}</p></body></html>`;
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

  if (loading) return <ParentLayout><CircularProgress /></ParentLayout>;

  return (
    <ParentLayout>
      <Container maxWidth="lg">
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: '#10b981', color: 'white' }}>
          <Typography variant="h4" fontWeight="bold">Children's Fee Details</Typography>
          <Typography variant="body2">Manage and pay fees for your children</Typography>
        </Paper>

        {childrenData.length === 0 ? (
          <Alert severity="info">No fee records found for your children.</Alert>
        ) : (
          childrenData.map(childData => (
            <Accordion key={childData.child.id} defaultExpanded sx={{ mb: 2, borderRadius: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#f8fafc' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                  <Box><Typography variant="h6">{childData.child.name}</Typography><Typography variant="caption">{childData.child.registrationNumber}</Typography></Box>
                  <Box textAlign="right"><Typography variant="h6" color={childData.summary.pendingAmount > 0 ? 'error.main' : 'success.main'}>₹{childData.summary.pendingAmount.toLocaleString()} Due</Typography><Typography variant="caption">{childData.summary.paidPercentage}% Paid</Typography></Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer><Table size="small"><TableHead><TableRow><TableCell>Month/Year</TableCell><TableCell>Base</TableCell><TableCell>Fine</TableCell><TableCell>Total</TableCell><TableCell>Paid</TableCell><TableCell>Due</TableCell><TableCell>Status</TableCell><TableCell>Action</TableCell></TableRow></TableHead>
                <TableBody>{childData.fees.map(fee => (<TableRow key={fee._id}><TableCell>{fee.month} {fee.year}</TableCell><TableCell>₹{fee.baseAmount?.toLocaleString()}</TableCell><TableCell><Chip label={`₹${fee.fineAmount?.toLocaleString()}`} size="small" color="error" /></TableCell><TableCell>₹{fee.totalAmount?.toLocaleString()}</TableCell><TableCell>₹{fee.paidAmount?.toLocaleString()}</TableCell><TableCell><Typography color={fee.dueAmount > 0 ? 'error.main' : 'success.main'}>₹{fee.dueAmount?.toLocaleString()}</Typography></TableCell><TableCell><Chip label={fee.status} size="small" color={fee.status === 'paid' ? 'success' : 'warning'} /></TableCell>
                <TableCell>{fee.dueAmount > 0 && <Button size="small" variant="contained" startIcon={<PaymentIcon />} onClick={() => handlePay(childData.child, fee)}>Pay ₹{fee.dueAmount.toLocaleString()}</Button>}</TableCell></TableRow>))}</TableBody></Table></TableContainer>
              </AccordionDetails>
            </Accordion>
          ))
        )}

        {paymentOpen && <PayPalPayment open={paymentOpen} onClose={() => setPaymentOpen(false)} feeDetails={selectedFee} onSuccess={handlePaymentSuccess} />}

        <Dialog open={receiptOpen} onClose={() => setReceiptOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Payment Receipt</DialogTitle>
          <DialogContent>{receiptData && <Box><Typography>Receipt: {receiptData.receiptId}</Typography><Typography>Student: {receiptData.studentName}</Typography><Typography>Month: {receiptData.month} {receiptData.year}</Typography><Typography>Amount: ₹{receiptData.amount}</Typography><Typography>Date: {format(new Date(receiptData.paymentDate), 'dd MMM yyyy')}</Typography><Typography>Transaction: {receiptData.transactionId}</Typography></Box>}</DialogContent>
          <DialogActions><Button startIcon={<DownloadIcon />} onClick={downloadReceipt}>Download</Button><Button onClick={() => setReceiptOpen(false)}>Close</Button></DialogActions>
        </Dialog>
      </Container>
    </ParentLayout>
  );
};

export default ParentFees;