import React, { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Typography, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Chip, CircularProgress, TextField, InputAdornment,
  MenuItem, FormControl, InputLabel, Select, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, Tabs, Tab
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import AdminLayout from '../../components/Layout/AdminLayout';
import toast from 'react-hot-toast';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const AdminFees = () => {
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState({ status: 'all', month: '', year: new Date().getFullYear() });
  const [generateOpen, setGenerateOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    month: months[new Date().getMonth()],
    year: new Date().getFullYear(),
    dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString().split('T')[0],
    finePerDay: 10
  });

  useEffect(() => { fetchData(); }, [filters, tabValue]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const feesRes = await adminService.getAllFees(filters);
      if (feesRes.success) {
        setFees(feesRes.data);
        setSummary(feesRes.summary);
      }
    } catch (error) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await adminService.generateAllFees({
        month: formData.month, year: parseInt(formData.year),
        dueDate: formData.dueDate, finePerDay: formData.finePerDay
      });
      if (response.success) {
        toast.success(response.message || 'Fees generated successfully');
        setGenerateOpen(false);
        fetchData();
      } else {
        toast.error(response.message || 'Failed to generate fees');
      }
    } catch (error) { toast.error('Failed to generate fees'); }
    finally { setGenerating(false); }
  };

  const handleDelete = async (feeId) => {
    if (window.confirm('Delete this fee?')) {
      try { await adminService.deleteFee(feeId); toast.success('Fee deleted'); fetchData(); }
      catch (error) { toast.error('Delete failed'); }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return { bg: '#d1fae5', color: '#065f46', label: 'Paid' };
      case 'pending': return { bg: '#fef9c3', color: '#92400e', label: 'Pending' };
      case 'overdue': return { bg: '#fee2e2', color: '#991b1b', label: 'Overdue' };
      default: return { bg: '#f3f4f6', color: '#374151', label: status };
    }
  };

  if (loading) return <AdminLayout><CircularProgress /></AdminLayout>;

  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <Paper sx={{ p: 3, mb: 4, bgcolor: '#10b981', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box><Typography variant="h4" fontWeight="bold">Fee Management</Typography><Typography variant="body2">Full control over fees and payments</Typography></Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setGenerateOpen(true)} sx={{ bgcolor: 'white', color: '#10b981' }}>Generate Fee</Button>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}><Card><CardContent><Typography color="textSecondary">Total Fees</Typography><Typography variant="h4">₹{summary?.totalAmount?.toLocaleString() || 0}</Typography></CardContent></Card></Grid>
          <Grid item xs={12} sm={6} md={3}><Card sx={{ bgcolor: '#e8f5e8' }}><CardContent><Typography color="success.main">Collected</Typography><Typography variant="h4">₹{summary?.paidAmount?.toLocaleString() || 0}</Typography></CardContent></Card></Grid>
          <Grid item xs={12} sm={6} md={3}><Card sx={{ bgcolor: '#ffebee' }}><CardContent><Typography color="error.main">Pending</Typography><Typography variant="h4">₹{summary?.pendingAmount?.toLocaleString() || 0}</Typography></CardContent></Card></Grid>
          <Grid item xs={12} sm={6} md={3}><Card sx={{ bgcolor: '#fff3e0' }}><CardContent><Typography color="warning.main">Total Fine</Typography><Typography variant="h4">₹{summary?.totalFine?.toLocaleString() || 0}</Typography></CardContent></Card></Grid>
        </Grid>

        <Paper sx={{ mb: 3 }}><Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}><Tab label="All Fees" /><Tab label="Analytics" /></Tabs></Paper>

        {tabValue === 0 && (<><Paper sx={{ p: 3, mb: 3 }}><Grid container spacing={2}><Grid item xs={12} sm={3}><FormControl fullWidth size="small"><InputLabel>Status</InputLabel><Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><MenuItem value="all">All</MenuItem><MenuItem value="paid">Paid</MenuItem><MenuItem value="pending">Pending</MenuItem><MenuItem value="overdue">Overdue</MenuItem></Select></FormControl></Grid>
        <Grid item xs={12} sm={3}><FormControl fullWidth size="small"><InputLabel>Month</InputLabel><Select value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })}><MenuItem value="">All</MenuItem>{months.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}</Select></FormControl></Grid>
        <Grid item xs={12} sm={3}><TextField fullWidth size="small" type="number" label="Year" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} /></Grid>
        <Grid item xs={12} sm={3}><Button fullWidth variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData}>Refresh</Button></Grid></Grid></Paper>
        <TableContainer component={Paper}><Table><TableHead sx={{ bgcolor: '#f8fafc' }}><TableRow><TableCell>Student</TableCell><TableCell>Month/Year</TableCell><TableCell>Base</TableCell><TableCell>Fine</TableCell><TableCell>Total</TableCell><TableCell>Paid</TableCell><TableCell>Due</TableCell><TableCell>Status</TableCell><TableCell align="center">Action</TableCell></TableRow></TableHead>
        <TableBody>{fees.map(fee => { const status = getStatusColor(fee.status);
          return (<TableRow key={fee._id} hover><TableCell><Typography fontWeight={600}>{fee.studentName}</Typography></TableCell><TableCell>{fee.month} {fee.year}</TableCell>
          <TableCell>₹{fee.baseAmount?.toLocaleString()}</TableCell><TableCell><Chip label={`₹${fee.fineAmount?.toLocaleString()}`} size="small" color="error" /></TableCell>
          <TableCell>₹{fee.totalAmount?.toLocaleString()}</TableCell><TableCell>₹{fee.paidAmount?.toLocaleString()}</TableCell>
          <TableCell><Typography color={fee.dueAmount > 0 ? 'error.main' : 'success.main'}>₹{fee.dueAmount?.toLocaleString()}</Typography></TableCell>
          <TableCell><Chip label={status.label} size="small" sx={{ bgcolor: status.bg, color: status.color }} /></TableCell>
          <TableCell align="center"><Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(fee._id)}><DeleteIcon /></IconButton></Tooltip></TableCell></TableRow>);})}</TableBody></Table></TableContainer></>)}

        <Dialog open={generateOpen} onClose={() => setGenerateOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Generate Fees for All Students</DialogTitle>
          <DialogContent><Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}><InputLabel>Month</InputLabel><Select value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })}>{months.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}</Select></FormControl>
            <TextField fullWidth type="number" label="Year" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} sx={{ mb: 2 }} />
            <TextField fullWidth type="date" label="Due Date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
            <TextField fullWidth type="number" label="Fine Per Day (₹)" value={formData.finePerDay} onChange={(e) => setFormData({ ...formData, finePerDay: parseInt(e.target.value) })} />
            <Alert severity="info" sx={{ mt: 2 }}>Fine: ₹{formData.finePerDay} per day after due date</Alert>
          </Box></DialogContent>
          <DialogActions><Button onClick={() => setGenerateOpen(false)}>Cancel</Button><Button variant="contained" onClick={handleGenerate} disabled={generating} sx={{ bgcolor: '#10b981' }}>{generating ? <CircularProgress size={24} /> : 'Generate'}</Button></DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default AdminFees;