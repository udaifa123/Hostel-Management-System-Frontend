import React, { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Typography, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Chip, CircularProgress, TextField, InputAdornment,
  MenuItem, FormControl, InputLabel, Select, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert
} from '@mui/material';
import { Search as SearchIcon, Refresh as RefreshIcon, Money as MoneyIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import wardenService from '../../services/wardenService';
import WardenLayout from '../../components/Layout/WardenLayout';
import toast from 'react-hot-toast';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const WardenFees = () => {
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [defaulters, setDefaulters] = useState([]);
  const [filters, setFilters] = useState({ status: 'all', month: '', year: new Date().getFullYear(), search: '' });
  const [manualPaymentOpen, setManualPaymentOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [manualAmount, setManualAmount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => { fetchFees(); }, [filters]);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await wardenService.getAllFees(filters);
      if (response.success) {
        setFees(response.data);
        setSummary(response.summary);
        setDefaulters(response.defaulters || []);
      }
    } catch (error) { toast.error('Failed to load fees'); }
    finally { setLoading(false); }
  };

  const handleManualPayment = async () => {
    if (!manualAmount || manualAmount <= 0) { toast.error('Please enter valid amount'); return; }
    try {
      const response = await wardenService.manualPayment({ feeId: selectedFee._id, amount: parseFloat(manualAmount), notes });
      if (response.success) { toast.success('Manual payment recorded'); setManualPaymentOpen(false); setManualAmount(''); setNotes(''); fetchFees(); }
    } catch (error) { toast.error('Failed to record payment'); }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return { bg: '#d1fae5', color: '#065f46', label: 'Paid' };
      case 'pending': return { bg: '#fef9c3', color: '#92400e', label: 'Pending' };
      case 'overdue': return { bg: '#fee2e2', color: '#991b1b', label: 'Overdue' };
      default: return { bg: '#f3f4f6', color: '#374151', label: status };
    }
  };

  if (loading) return <WardenLayout><CircularProgress /></WardenLayout>;

  return (
    <WardenLayout>
      <Container maxWidth="xl">
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: '#10b981', color: 'white' }}>
          <Typography variant="h4" fontWeight="bold">Fee Management</Typography>
          <Typography variant="body2">Monitor and manage all student fees</Typography>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}><Card><CardContent><Typography color="textSecondary">Total Collection</Typography><Typography variant="h5">₹{summary?.totalAmount?.toLocaleString() || 0}</Typography></CardContent></Card></Grid>
          <Grid item xs={12} sm={6} md={3}><Card sx={{ bgcolor: '#e8f5e8' }}><CardContent><Typography color="success.main">Collected</Typography><Typography variant="h5">₹{summary?.paidAmount?.toLocaleString() || 0}</Typography></CardContent></Card></Grid>
          <Grid item xs={12} sm={6} md={3}><Card sx={{ bgcolor: '#ffebee' }}><CardContent><Typography color="error.main">Pending</Typography><Typography variant="h5">₹{summary?.pendingAmount?.toLocaleString() || 0}</Typography></CardContent></Card></Grid>
          <Grid item xs={12} sm={6} md={3}><Card sx={{ bgcolor: '#fff3e0' }}><CardContent><Typography color="warning.main">Defaulters</Typography><Typography variant="h5">{defaulters.length}</Typography></CardContent></Card></Grid>
        </Grid>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}><FormControl fullWidth size="small"><InputLabel>Status</InputLabel><Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><MenuItem value="all">All</MenuItem><MenuItem value="paid">Paid</MenuItem><MenuItem value="pending">Pending</MenuItem><MenuItem value="overdue">Overdue</MenuItem></Select></FormControl></Grid>
            <Grid item xs={12} sm={3}><FormControl fullWidth size="small"><InputLabel>Month</InputLabel><Select value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })}><MenuItem value="">All</MenuItem>{months.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}</Select></FormControl></Grid>
            <Grid item xs={12} sm={3}><TextField fullWidth size="small" type="number" label="Year" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} /></Grid>
            <Grid item xs={12} sm={3}><TextField fullWidth size="small" placeholder="Search student..." InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /></Grid>
          </Grid>
        </Paper>

        {defaulters.length > 0 && <Alert severity="warning" sx={{ mb: 3 }}>{defaulters.length} student(s) have overdue fees!</Alert>}

        <TableContainer component={Paper}>
          <Table><TableHead sx={{ bgcolor: '#f8fafc' }}><TableRow><TableCell>Student</TableCell><TableCell>Month/Year</TableCell><TableCell>Base</TableCell><TableCell>Fine</TableCell><TableCell>Total</TableCell><TableCell>Paid</TableCell><TableCell>Due</TableCell><TableCell>Status</TableCell><TableCell align="center">Action</TableCell></TableRow></TableHead>
          <TableBody>{fees.map(fee => { const status = getStatusColor(fee.status);
            return (<TableRow key={fee._id} hover><TableCell><Typography fontWeight={600}>{fee.studentName}</Typography></TableCell><TableCell>{fee.month} {fee.year}</TableCell>
            <TableCell>₹{fee.baseAmount?.toLocaleString()}</TableCell><TableCell><Chip label={`₹${fee.fineAmount?.toLocaleString()}`} size="small" color="error" /></TableCell>
            <TableCell>₹{fee.totalAmount?.toLocaleString()}</TableCell><TableCell>₹{fee.paidAmount?.toLocaleString()}</TableCell>
            <TableCell><Typography color={fee.dueAmount > 0 ? 'error.main' : 'success.main'}>₹{fee.dueAmount?.toLocaleString()}</Typography></TableCell>
            <TableCell><Chip label={status.label} size="small" sx={{ bgcolor: status.bg, color: status.color }} /></TableCell>
            <TableCell align="center">{fee.dueAmount > 0 && <Tooltip title="Record Manual Payment"><IconButton color="primary" onClick={() => { setSelectedFee(fee); setManualPaymentOpen(true); }}><MoneyIcon /></IconButton></Tooltip>}</TableCell></TableRow>);})}</TableBody></Table>
        </TableContainer>

        <Dialog open={manualPaymentOpen} onClose={() => setManualPaymentOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Record Manual Payment</DialogTitle>
          <DialogContent>{selectedFee && <Box><Typography><strong>Student:</strong> {selectedFee.studentName}</Typography><Typography><strong>Month:</strong> {selectedFee.month} {selectedFee.year}</Typography><Typography><strong>Due Amount:</strong> ₹{selectedFee.dueAmount?.toLocaleString()}</Typography><TextField fullWidth label="Amount" type="number" value={manualAmount} onChange={(e) => setManualAmount(e.target.value)} sx={{ mt: 2 }} /><TextField fullWidth label="Notes" multiline rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} sx={{ mt: 2 }} /></Box>}</DialogContent>
          <DialogActions><Button onClick={() => setManualPaymentOpen(false)}>Cancel</Button><Button variant="contained" onClick={handleManualPayment} sx={{ bgcolor: '#10b981' }}>Record Payment</Button></DialogActions>
        </Dialog>
      </Container>
    </WardenLayout>
  );
};

export default WardenFees;