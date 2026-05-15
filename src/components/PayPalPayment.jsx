import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, CircularProgress, Alert, Paper, Divider } from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '../context/AuthContext';
import studentService from '../services/studentService';
import toast from 'react-hot-toast';
import { CheckCircle as CheckCircleIcon, CreditCard as CreditCardIcon } from '@mui/icons-material';

const PayPalPayment = ({ open, onClose, feeDetails, onSuccess, onError }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  if (!feeDetails) return null;

  const { month = '', year = '', pendingAmount = 0, studentName = '', _id = '' } = feeDetails;

  const paypalOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "YOUR_PAYPAL_CLIENT_ID",
    currency: "USD",
    intent: "capture"
  };

  const createOrder = async (data, actions) => {
    try {
      setLoading(true);
      const amountInUSD = (pendingAmount / 83).toFixed(2);
      return actions.order.create({
        purchase_units: [{ description: `Hostel Fee - ${month} ${year}`, custom_id: _id, amount: { currency_code: "USD", value: amountInUSD } }],
        application_context: { shipping_preference: "NO_SHIPPING", user_action: "PAY_NOW", brand_name: "Hostel Management" }
      });
    } catch (err) { setError('Failed to create order'); throw err; } 
    finally { setLoading(false); }
  };

  const onApprove = async (data, actions) => {
    try {
      setLoading(true);
      const details = await actions.order.capture();
      if (details.status === 'COMPLETED') {
        setPaymentCompleted(true);
        toast.success('Payment successful!');
        await studentService.processPayment({ feeId: _id, amount: pendingAmount, paymentMethod: 'paypal', transactionId: details.id, paymentDetails: details });
        onSuccess({ success: true, receiptId: `RCP-${Date.now()}`, transactionId: details.id });
      } else throw new Error('Payment not completed');
    } catch (err) { setError(err.message || 'Payment failed'); onError?.(err.message); } 
    finally { setLoading(false); }
  };

  const handleError = (err) => { setError('PayPal error. Please try again.'); onError?.('PayPal error'); };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#10b981', color: 'white' }}><Box display="flex" alignItems="center" gap={1}><CreditCardIcon /><Typography variant="h6">Pay with PayPal</Typography></Box></DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" color="primary">Payment Summary</Typography><Divider sx={{ my: 1 }} />
          <Box display="flex" justifyContent="space-between" mb={1}><Typography variant="body2">Description</Typography><Typography variant="body2">Hostel Fee - {month} {year}</Typography></Box>
          <Box display="flex" justifyContent="space-between" mb={1}><Typography variant="body2">Student</Typography><Typography variant="body2">{studentName || user?.name}</Typography></Box>
          <Divider sx={{ my: 1 }} />
          <Box display="flex" justifyContent="space-between"><Typography variant="h6">Total</Typography><Typography variant="h6" color="primary">₹{pendingAmount.toLocaleString()}</Typography></Box>
        </Paper>
        {loading && !paymentCompleted && <Box textAlign="center" py={3}><CircularProgress sx={{ color: '#10b981' }} /><Typography mt={2}>Processing...</Typography></Box>}
        {!loading && !paymentCompleted && <PayPalScriptProvider options={paypalOptions}><PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={handleError} style={{ layout: 'vertical' }} /></PayPalScriptProvider>}
        {paymentCompleted && <Alert icon={<CheckCircleIcon />} severity="success">Payment completed successfully!</Alert>}
      </DialogContent>
      <DialogActions><Button onClick={onClose} disabled={loading}>{paymentCompleted ? 'Close' : 'Cancel'}</Button></DialogActions>
    </Dialog>
  );
};

export default PayPalPayment;