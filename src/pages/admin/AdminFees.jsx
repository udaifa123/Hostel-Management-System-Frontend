import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  alpha,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  AutoAwesome as AutoIcon,
  Save as SaveIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// ─── Green Design Tokens (Same as AdminHostels) ───────────────────────────────
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

const CARD_SHADOW = '0 1px 4px rgba(30,122,53,0.10), 0 0 0 1px rgba(30,122,53,0.08)';

// ─── Stat Card Component (Same as AdminHostels) ───────────────────────────────
const StatCard = ({ label, value, icon: Icon, dark = false }) => {
  const IconComponent = Icon;
  return (
    <Card elevation={0} sx={{
      borderRadius: 3,
      bgcolor: dark ? G[800] : '#ffffff',
      border: `1px solid ${dark ? G[700] : G[200]}`,
      boxShadow: dark ? '0 4px 16px rgba(13,51,24,0.25)' : CARD_SHADOW,
      height: '100%',
      transition: 'transform 0.15s, box-shadow 0.15s',
      '&:hover': { transform: 'translateY(-2px)' }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" sx={{
              color: dark ? G[300] : G[600],
              fontWeight: 600,
              fontSize: '0.70rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'block',
              mb: 1
            }}>
              {label}
            </Typography>
            <Typography variant="h3" sx={{
              fontWeight: 700,
              color: dark ? '#ffffff' : G[800],
              fontSize: '2.2rem',
              lineHeight: 1,
            }}>
              {value}
            </Typography>
          </Box>
          <Avatar sx={{
            bgcolor: dark ? G[700] : G[100],
            width: 48,
            height: 48,
            borderRadius: 2,
          }}>
            <IconComponent sx={{ color: dark ? G[200] : G[600], fontSize: 24 }} />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

const AdminFees = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, paidAmount: 0, pendingAmount: 0 });
  const [tabValue, setTabValue] = useState(0);
  const [openAutoDialog, setOpenAutoDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  const [feeStructure, setFeeStructure] = useState({
    tuitionFee: 10000, 
    hostelFee: 5000, 
    messFee: 3000, 
    maintenanceFee: 1000,
    libraryFee: 500, 
    sportsFee: 500, 
    examFee: 1000, 
    otherFee: 0,
    feeType: 'monthly', 
    dueDayOfMonth: 10,
    finePerDay: 10, 
    fineType: 'per_day', 
    finePercentage: 2, 
    maxFine: 5000,
    enableAttendancePenalty: true, 
    attendanceThreshold: 75, 
    attendancePenaltyPercentage: 5,
    enableDiscount: true, 
    earlyPaymentDiscount: 5, 
    earlyPaymentDays: 5,
    scholarshipPercentage: 0, 
    autoGenerate: true
  });

  useEffect(() => {
    fetchFees();
    fetchFeeStructure();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllFees();
      console.log('Fees response:', response);
      
      if (response && response.success) {
        setFees(response.data || []);
        setSummary(response.summary || { totalAmount: 0, paidAmount: 0, pendingAmount: 0 });
      } else if (response && response.data && Array.isArray(response.data)) {
        setFees(response.data);
        const totalAmount = response.data.reduce((sum, f) => sum + (f.amount || 0), 0);
        const paidAmount = response.data.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
        setSummary({ totalAmount, paidAmount, pendingAmount: totalAmount - paidAmount });
      } else if (Array.isArray(response)) {
        setFees(response);
        const totalAmount = response.reduce((sum, f) => sum + (f.amount || 0), 0);
        const paidAmount = response.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
        setSummary({ totalAmount, paidAmount, pendingAmount: totalAmount - paidAmount });
      } else {
        setFees([]);
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
      toast.error('Failed to load fees');
      setFees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeeStructure = async () => {
    try {
      const response = await axios.get(`${API_URL}/auto-fee/structure`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success && response.data.data) {
        setFeeStructure(response.data.data);
      }
    } catch (error) {
      console.log('No existing fee structure or error fetching:', error.message);
    }
  };

  const handleSaveAutoStructure = async () => {
    setSaving(true);
    try {
      const response = await axios.post(`${API_URL}/auto-fee/structure`, feeStructure, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.data.success) {
        toast.success(response.data.message || 'Fee structure saved successfully');
        setOpenAutoDialog(false);
        fetchFees();
      } else {
        toast.error(response.data.message || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save fee structure');
    } finally {
      setSaving(false);
    }
  };

  const handleAutoGenerateFees = async () => {
    setGenerating(true);
    try {
      const response = await axios.post(`${API_URL}/auto-fee/generate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success(response.data.message || 'Fees generated successfully');
        fetchFees();
      } else {
        toast.error(response.data.message || 'Generation failed');
      }
    } catch (error) {
      console.error('Generate error:', error);
      toast.error(error.response?.data?.message || 'Fee generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteFee = async (feeId) => {
    if (!window.confirm('Are you sure you want to delete this fee record?')) return;
    try {
      const response = await adminService.deleteFee(feeId);
      if (response && response.success) {
        toast.success('Fee record deleted successfully');
        fetchFees();
      } else {
        toast.error(response?.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete fee record');
    }
  };

  const calculateTotal = () => {
    const total = (feeStructure.tuitionFee || 0) + (feeStructure.hostelFee || 0) + 
                  (feeStructure.messFee || 0) + (feeStructure.maintenanceFee || 0) + 
                  (feeStructure.libraryFee || 0) + (feeStructure.sportsFee || 0) + 
                  (feeStructure.examFee || 0) + (feeStructure.otherFee || 0);
    return total;
  };

  const pendingCount = fees.filter(f => f.status === 'pending' || f.status === 'overdue').length;

  if (loading) {
    return (
      <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading fee records...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: G[50], minHeight: '100vh' }}>
      {/* Top accent bar */}
      <Box sx={{ height: 4, bgcolor: G[600] }} />

      <Box sx={{ p: 3 }}>
        {/* ── Header Section (Same style as AdminHostels) ── */}
        <Paper elevation={0} sx={{
          p: 3, mb: 4, borderRadius: 3,
          bgcolor: '#ffffff', border: `1px solid ${G[200]}`,
          boxShadow: '0 2px 8px rgba(13,51,24,0.10)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: G[800], width: 46, height: 46, borderRadius: 2 }}>
              <MoneyIcon sx={{ color: G[200], fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
                Fee Management
              </Typography>
              <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
                Fully automatic fee management system
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: `${G[600]} !important` }} />}
              label={`${fees.length} fees`}
              size="small"
              sx={{ bgcolor: G[100], color: G[700], fontWeight: 600, fontSize: '0.72rem', border: `1px solid ${G[200]}` }}
            />
            <Button
              variant="contained"
              startIcon={<AutoIcon />}
              onClick={() => setOpenAutoDialog(true)}
              sx={{
                bgcolor: '#8B5CF6', color: '#ffffff', fontWeight: 600,
                borderRadius: 2, textTransform: 'none',
                boxShadow: '0 4px 12px rgba(139,92,246,0.30)',
                '&:hover': { bgcolor: '#7C3AED', boxShadow: '0 6px 16px rgba(139,92,246,0.40)' }
              }}
            >
              Auto Fee Settings
            </Button>
            <Button
              variant="contained"
              startIcon={<AutoIcon />}
              onClick={handleAutoGenerateFees}
              disabled={generating}
              sx={{
                bgcolor: '#f59e0b', color: '#ffffff', fontWeight: 600,
                borderRadius: 2, textTransform: 'none',
                boxShadow: '0 4px 12px rgba(245,158,11,0.30)',
                '&:hover': { bgcolor: '#d97706' }
              }}
            >
              {generating ? 'Generating...' : 'Generate Now'}
            </Button>
            <IconButton
              onClick={fetchFees}
              sx={{
                bgcolor: '#ffffff', borderRadius: 2,
                border: `1px solid ${G[200]}`, color: G[600],
                '&:hover': { bgcolor: G[100], borderColor: G[400] }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Paper>

        <Alert severity="info" sx={{ mb: 4, borderRadius: 2, bgcolor: G[50] }}>
          🤖 Fully Automatic: Fees auto-generated on 1st of every month with attendance penalties and late fines.
        </Alert>

        {/* ── Stat Cards (Same grid as AdminHostels) ── */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <StatCard label="Total Fees" value={`₹${(summary.totalAmount || 0).toLocaleString()}`} icon={MoneyIcon} dark />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard label="Collected" value={`₹${(summary.paidAmount || 0).toLocaleString()}`} icon={CheckCircleIcon} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard label="Pending" value={`₹${(summary.pendingAmount || 0).toLocaleString()}`} icon={WarningIcon} />
          </Grid>
        </Grid>

        {/* ── Tabs ── */}
        <Paper elevation={0} sx={{ mb: 3, borderRadius: 3, border: `1px solid ${G[200]}`, overflow: 'hidden' }}>
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
                '&.Mui-selected': {
                  color: G[600]
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: G[600],
                height: 3
              }
            }}
          >
            <Tab label={`All Fees (${fees.length})`} />
            <Tab label={`Pending/Overdue (${pendingCount})`} />
          </Tabs>
        </Paper>

        {/* ── Fees Table (Same style as AdminHostels table) ── */}
        <TableContainer 
          component={Paper} 
          variant="outlined"
          sx={{ 
            background: G[50],
            border: `1px solid ${G[200]}`,
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: G[100] }}>
                <TableCell sx={{ fontWeight: 700, color: G[700], fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${G[600]}` }}>
                  Student
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: G[700], fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${G[600]}` }}>
                  Title
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: G[700], fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${G[600]}` }}>
                  Amount
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: G[700], fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${G[600]}` }}>
                  Paid
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: G[700], fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${G[600]}` }}>
                  Pending
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: G[700], fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${G[600]}` }}>
                  Due Date
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: G[700], fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${G[600]}` }}>
                  Status
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: G[700], fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `2px solid ${G[600]}` }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(tabValue === 0 ? fees : fees.filter(f => f.status === 'pending' || f.status === 'overdue')).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography sx={{ color: G[400], mb: 2 }}>No fee records found</Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AutoIcon />}
                        onClick={handleAutoGenerateFees}
                        sx={{ borderColor: G[200], color: G[600] }}
                      >
                        Generate Fees
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                (tabValue === 0 ? fees : fees.filter(f => f.status === 'pending' || f.status === 'overdue')).map((fee) => (
                  <TableRow key={fee._id} hover sx={{ '&:hover': { bgcolor: G[50] } }}>
                    <TableCell sx={{ color: G[700] }}>{fee.studentName || fee.student?.name || 'Unknown'}</TableCell>
                    <TableCell sx={{ color: G[700] }}>{fee.title || 'Monthly Fee'}</TableCell>
                    <TableCell align="right" sx={{ color: G[700] }}>₹{(fee.amount || 0).toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ color: G[700] }}>₹{(fee.paidAmount || 0).toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ color: G[700] }}>₹{((fee.amount || 0) - (fee.paidAmount || 0)).toLocaleString()}</TableCell>
                    <TableCell sx={{ color: G[700] }}>{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={fee.status || 'pending'} 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha(
                            fee.status === 'paid' ? '#10b981' : 
                            fee.status === 'overdue' ? '#ef4444' : '#f59e0b', 0.1
                          ), 
                          color: fee.status === 'paid' ? '#10b981' : 
                                 fee.status === 'overdue' ? '#ef4444' : '#f59e0b',
                          fontWeight: 600,
                          fontSize: '0.72rem',
                          borderRadius: 1.5
                        }} 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        onClick={() => handleDeleteFee(fee._id)} 
                        size="small"
                        sx={{ 
                          bgcolor: '#fef2f2', 
                          borderRadius: 1.5, 
                          '&:hover': { bgcolor: '#fee2e2' },
                          color: '#ef4444'
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ── Auto Fee Configuration Dialog (Styled consistently) ── */}
        <Dialog 
          open={openAutoDialog} 
          onClose={() => setOpenAutoDialog(false)} 
          maxWidth="md" 
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
          <Box sx={{ height: 4, bgcolor: '#8B5CF6', borderRadius: '12px 12px 0 0' }} />
          
          <DialogTitle sx={{ pt: 2.5, pb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: '#8B5CF6', width: 38, height: 38, borderRadius: 1.5 }}>
                <AutoIcon sx={{ color: '#ffffff', fontSize: 18 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
                Fully Automatic Fee Configuration
              </Typography>
            </Box>
          </DialogTitle>

          <Divider sx={{ borderColor: G[100] }} />

          <DialogContent sx={{ pt: 3 }}>
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2, bgcolor: G[50] }}>
              Set once - Fees auto-generated for ALL students every month!
            </Alert>
            
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: G[800] }}>💰 Fee Components</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="Tuition Fee" 
                  type="number" 
                  value={feeStructure.tuitionFee} 
                  onChange={(e) => setFeeStructure({...feeStructure, tuitionFee: parseInt(e.target.value) || 0})} 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                      '&.Mui-focused fieldset': { borderColor: G[600] },
                    },
                    '& .MuiInputLabel-root': { color: G[600] },
                    '& .MuiInputLabel-root.Mui-focused': { color: G[700] },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="Hostel Fee" 
                  type="number" 
                  value={feeStructure.hostelFee} 
                  onChange={(e) => setFeeStructure({...feeStructure, hostelFee: parseInt(e.target.value) || 0})} 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                      '&.Mui-focused fieldset': { borderColor: G[600] },
                    },
                    '& .MuiInputLabel-root': { color: G[600] },
                    '& .MuiInputLabel-root.Mui-focused': { color: G[700] },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="Mess Fee" 
                  type="number" 
                  value={feeStructure.messFee} 
                  onChange={(e) => setFeeStructure({...feeStructure, messFee: parseInt(e.target.value) || 0})} 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                      '&.Mui-focused fieldset': { borderColor: G[600] },
                    },
                    '& .MuiInputLabel-root': { color: G[600] },
                    '& .MuiInputLabel-root.Mui-focused': { color: G[700] },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="Maintenance Fee" 
                  type="number" 
                  value={feeStructure.maintenanceFee} 
                  onChange={(e) => setFeeStructure({...feeStructure, maintenanceFee: parseInt(e.target.value) || 0})} 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                      '&.Mui-focused fieldset': { borderColor: G[600] },
                    },
                    '& .MuiInputLabel-root': { color: G[600] },
                    '& .MuiInputLabel-root.Mui-focused': { color: G[700] },
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2, borderColor: G[100] }} />
            
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: G[800] }}>⚠️ Late Fine Settings</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={4}>
                <TextField 
                  fullWidth 
                  label="Fine Per Day (₹)" 
                  type="number" 
                  value={feeStructure.finePerDay} 
                  onChange={(e) => setFeeStructure({...feeStructure, finePerDay: parseInt(e.target.value) || 10})} 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                      '&.Mui-focused fieldset': { borderColor: G[600] },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField 
                  select 
                  fullWidth 
                  label="Fine Type" 
                  value={feeStructure.fineType} 
                  onChange={(e) => setFeeStructure({...feeStructure, fineType: e.target.value})}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                      '&.Mui-focused fieldset': { borderColor: G[600] },
                    },
                  }}
                >
                  <MenuItem value="per_day">Per Day</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField 
                  fullWidth 
                  label="Max Fine (₹)" 
                  type="number" 
                  value={feeStructure.maxFine} 
                  onChange={(e) => setFeeStructure({...feeStructure, maxFine: parseInt(e.target.value) || 5000})} 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                      '&.Mui-focused fieldset': { borderColor: G[600] },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2, borderColor: G[100] }} />
            
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: G[800] }}>📊 Attendance Rules</Typography>
            <FormControlLabel 
              control={
                <Switch 
                  checked={feeStructure.enableAttendancePenalty} 
                  onChange={(e) => setFeeStructure({...feeStructure, enableAttendancePenalty: e.target.checked})} 
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                />
              } 
              label="Enable Attendance Penalty" 
            />
            {feeStructure.enableAttendancePenalty && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: G[600] }}>Threshold: {feeStructure.attendanceThreshold}%</Typography>
                  <Slider 
                    value={feeStructure.attendanceThreshold} 
                    onChange={(e, val) => setFeeStructure({...feeStructure, attendanceThreshold: val})} 
                    min={50} 
                    max={90} 
                    valueLabelDisplay="auto"
                    sx={{ color: G[600] }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth 
                    label="Penalty Percentage" 
                    type="number" 
                    value={feeStructure.attendancePenaltyPercentage} 
                    onChange={(e) => setFeeStructure({...feeStructure, attendancePenaltyPercentage: parseInt(e.target.value) || 5})}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: G[50],
                        '& fieldset': { borderColor: G[200] },
                        '&:hover fieldset': { borderColor: G[400] },
                        '&.Mui-focused fieldset': { borderColor: G[600] },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            )}

            <Divider sx={{ my: 2, borderColor: G[100] }} />
            
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: G[800] }}>🎁 Discount & Scholarship</Typography>
            <FormControlLabel 
              control={
                <Switch 
                  checked={feeStructure.enableDiscount} 
                  onChange={(e) => setFeeStructure({...feeStructure, enableDiscount: e.target.checked})} 
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                />
              } 
              label="Enable Early Payment Discount" 
            />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="Early Payment Discount (%)" 
                  type="number" 
                  value={feeStructure.earlyPaymentDiscount} 
                  onChange={(e) => setFeeStructure({...feeStructure, earlyPaymentDiscount: parseInt(e.target.value) || 5})}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                      '&.Mui-focused fieldset': { borderColor: G[600] },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="Early Payment Days" 
                  type="number" 
                  value={feeStructure.earlyPaymentDays} 
                  onChange={(e) => setFeeStructure({...feeStructure, earlyPaymentDays: parseInt(e.target.value) || 5})}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                      '&.Mui-focused fieldset': { borderColor: G[600] },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="Scholarship Percentage" 
                  type="number" 
                  value={feeStructure.scholarshipPercentage} 
                  onChange={(e) => setFeeStructure({...feeStructure, scholarshipPercentage: parseInt(e.target.value) || 0})}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                      '&.Mui-focused fieldset': { borderColor: G[600] },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2, borderColor: G[100] }} />
            
            <FormControlLabel 
              control={
                <Switch 
                  checked={feeStructure.autoGenerate} 
                  onChange={(e) => setFeeStructure({...feeStructure, autoGenerate: e.target.checked})} 
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: G[600] } }}
                />
              } 
              label="Auto Generate on 1st of Every Month" 
            />
            
            <Alert severity="success" sx={{ mt: 3, borderRadius: 2, bgcolor: G[50] }}>
              <strong>Total Monthly Fee per Student: ₹{calculateTotal().toLocaleString()}</strong>
            </Alert>
          </DialogContent>

          <Divider sx={{ borderColor: G[100] }} />

          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button 
              onClick={() => setOpenAutoDialog(false)} 
              sx={{
                color: G[600], borderRadius: 2, textTransform: 'none', fontWeight: 600,
                border: `1px solid ${G[200]}`, px: 3,
                '&:hover': { bgcolor: G[50] }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveAutoStructure} 
              variant="contained" 
              disabled={saving} 
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{
                bgcolor: '#8B5CF6', color: '#ffffff', fontWeight: 600,
                borderRadius: 2, textTransform: 'none', px: 3,
                boxShadow: '0 4px 12px rgba(139,92,246,0.30)',
                '&:hover': { bgcolor: '#7C3AED' }
              }}
            >
              {saving ? 'Saving...' : 'Save & Activate'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminFees;