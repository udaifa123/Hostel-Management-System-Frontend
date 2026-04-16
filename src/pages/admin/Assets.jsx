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
  IconButton,
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
  Avatar,
  LinearProgress,
  alpha,
  Tooltip,
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Green Design Tokens
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

const categories = ['Furniture', 'Electrical', 'Electronic', 'Sanitary', 'Kitchen', 'Sports', 'Other'];
const conditions = ['Good', 'Fair', 'Damaged', 'Under Maintenance'];

const Assets = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalQuantity: 0,
    availableQuantity: 0,
    usedQuantity: 0,
    damagedQuantity: 0
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    category: 'Furniture',
    quantity: '',
    condition: 'Good',
    description: '',
    manufacturer: '',
    modelNumber: '',
    purchaseDate: '',
    purchasePrice: '',
    warrantyExpiry: '',
    notes: ''
  });
  const [assignForm, setAssignForm] = useState({
    studentId: '',
    roomId: '',
    quantity: 1,
    assignmentType: 'common',
    remarks: ''
  });
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssets();
    fetchStats();
    fetchStudents();
    fetchRooms();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/assets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched assets from API:', response.data);
      
      if (response.data.success && response.data.data) {
        setAssets(response.data.data);
        updateStatsFromAssets(response.data.data);
      } else if (Array.isArray(response.data)) {
        setAssets(response.data);
        updateStatsFromAssets(response.data);
      } else {
        setAssets([]);
        updateStatsFromAssets([]);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      showSnackbar(error.response?.data?.message || 'Failed to load assets', 'error');
      setAssets([]);
      updateStatsFromAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatsFromAssets = (assetsList) => {
    const totalAssets = assetsList.length;
    const totalQuantity = assetsList.reduce((sum, asset) => sum + (asset.quantity || 0), 0);
    const availableQuantity = assetsList.reduce((sum, asset) => sum + (asset.availableQuantity || 0), 0);
    const usedQuantity = assetsList.reduce((sum, asset) => sum + (asset.usedQuantity || 0), 0);
    const damagedQuantity = assetsList.reduce((sum, asset) => sum + (asset.damagedQuantity || 0), 0);
    
    setStats({
      totalAssets,
      totalQuantity,
      availableQuantity,
      usedQuantity,
      damagedQuantity
    });
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/assets/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success && response.data.students) {
        setStudents(response.data.students);
      } else if (Array.isArray(response.data)) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/rooms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success && response.data.rooms) {
        setRooms(response.data.rooms);
      } else if (Array.isArray(response.data)) {
        setRooms(response.data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateAsset = async () => {
    if (!formData.name || !formData.quantity) {
      showSnackbar('Please fill required fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/assets`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Create asset response:', response.data);
      
      if (response.data.success) {
        showSnackbar('Asset created successfully', 'success');
        setOpenDialog(false);
        resetForm();
        fetchAssets(); // Refresh the list
        fetchStats();  // Refresh stats
      } else {
        showSnackbar(response.data.message || 'Failed to create asset', 'error');
      }
    } catch (error) {
      console.error('Error creating asset:', error);
      showSnackbar(error.response?.data?.message || 'Failed to create asset', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAsset = async () => {
    if (!selectedAsset) return;

    setSubmitting(true);
    try {
      const response = await axios.put(`${API_URL}/assets/${selectedAsset._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        showSnackbar('Asset updated successfully', 'success');
        setOpenDialog(false);
        resetForm();
        fetchAssets(); // Refresh the list
        fetchStats();  // Refresh stats
      } else {
        showSnackbar(response.data.message || 'Failed to update asset', 'error');
      }
    } catch (error) {
      console.error('Error updating asset:', error);
      showSnackbar(error.response?.data?.message || 'Failed to update asset', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAsset = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;

    try {
      const response = await axios.delete(`${API_URL}/assets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        showSnackbar('Asset deleted successfully', 'success');
        fetchAssets(); // Refresh the list
        fetchStats();  // Refresh stats
      } else {
        showSnackbar(response.data.message || 'Failed to delete asset', 'error');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      showSnackbar(error.response?.data?.message || 'Failed to delete asset', 'error');
    }
  };

  const handleAssignAsset = async () => {
    if (!selectedAsset) return;
    if (!assignForm.assignmentType) {
      showSnackbar('Please select assignment type', 'error');
      return;
    }

    if (assignForm.quantity > selectedAsset.availableQuantity) {
      showSnackbar(`Only ${selectedAsset.availableQuantity} items available`, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/assets/assign`, {
        assetId: selectedAsset._id,
        ...assignForm
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        showSnackbar('Asset assigned successfully', 'success');
        setOpenAssignDialog(false);
        resetAssignForm();
        fetchAssets(); // Refresh the list
        fetchStats();  // Refresh stats
      } else {
        showSnackbar(response.data.message || 'Failed to assign asset', 'error');
      }
    } catch (error) {
      console.error('Error assigning asset:', error);
      showSnackbar(error.response?.data?.message || 'Failed to assign asset', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkDamaged = async (id) => {
    if (!window.confirm('Mark this asset as damaged?')) return;

    try {
      const response = await axios.put(`${API_URL}/assets/damaged/${id}`, {
        remarks: 'Marked as damaged'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        showSnackbar('Asset marked as damaged', 'success');
        fetchAssets(); // Refresh the list
        fetchStats();  // Refresh stats
      } else {
        showSnackbar(response.data.message || 'Failed to mark as damaged', 'error');
      }
    } catch (error) {
      console.error('Error marking damaged:', error);
      showSnackbar(error.response?.data?.message || 'Failed to mark as damaged', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Furniture',
      quantity: '',
      condition: 'Good',
      description: '',
      manufacturer: '',
      modelNumber: '',
      purchaseDate: '',
      purchasePrice: '',
      warrantyExpiry: '',
      notes: ''
    });
    setSelectedAsset(null);
  };

  const resetAssignForm = () => {
    setAssignForm({
      studentId: '',
      roomId: '',
      quantity: 1,
      assignmentType: 'common',
      remarks: ''
    });
    setSelectedAsset(null);
  };

  const handleEdit = (asset) => {
    setSelectedAsset(asset);
    setFormData({
      name: asset.name,
      category: asset.category,
      quantity: asset.quantity,
      condition: asset.condition,
      description: asset.description || '',
      manufacturer: asset.manufacturer || '',
      modelNumber: asset.modelNumber || '',
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
      purchasePrice: asset.purchasePrice || '',
      warrantyExpiry: asset.warrantyExpiry ? asset.warrantyExpiry.split('T')[0] : '',
      notes: asset.notes || ''
    });
    setOpenDialog(true);
  };

  const handleAssign = (asset) => {
    setSelectedAsset(asset);
    setOpenAssignDialog(true);
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (asset.description && asset.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
    const matchesCondition = conditionFilter === 'all' || asset.condition === conditionFilter;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const statCards = [
    { title: 'Total Assets', value: stats.totalAssets, icon: <InventoryIcon />, color: G[600] },
    { title: 'Total Quantity', value: stats.totalQuantity, icon: <InventoryIcon />, color: '#3b82f6' },
    { title: 'Available', value: stats.availableQuantity, icon: <CheckCircleIcon />, color: '#10b981' },
    { title: 'In Use', value: stats.usedQuantity, icon: <AssignmentIcon />, color: '#f59e0b' },
    { title: 'Damaged', value: stats.damagedQuantity, icon: <WarningIcon />, color: '#ef4444' }
  ];

  if (loading) {
    return (
      <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading assets...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
      {/* Top accent bar */}
      <Box sx={{ height: 4, bgcolor: G[600], mb: 3, borderRadius: 2 }} />

      {/* Header */}
      <Paper elevation={0} sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        bgcolor: '#ffffff',
        border: `1px solid ${G[200]}`,
        boxShadow: '0 2px 8px rgba(13,51,24,0.10)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: G[800], width: 46, height: 46, borderRadius: 2 }}>
            <InventoryIcon sx={{ color: G[200], fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
              Asset Management
            </Typography>
            <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
              Manage hostel assets, track inventory, and assign items
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { resetForm(); setOpenDialog(true); }}
          disabled={submitting}
          sx={{
            bgcolor: G[700],
            color: '#ffffff',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
            '&:hover': { bgcolor: G[800] }
          }}
        >
          Add Asset
        </Button>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
                      {stat.title}
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: stat.color, fontSize: '2rem' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha(stat.color, 0.1), color: stat.color }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: G[400] }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Condition</InputLabel>
              <Select
                value={conditionFilter}
                label="Condition"
                onChange={(e) => setConditionFilter(e.target.value)}
              >
                <MenuItem value="all">All Conditions</MenuItem>
                {conditions.map(cond => (
                  <MenuItem key={cond} value={cond}>{cond}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="textSecondary" align="center">
              {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''} found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Assets Table */}
      <TableContainer component={Paper} elevation={0} sx={{
        borderRadius: 3,
        bgcolor: '#ffffff',
        border: `1px solid ${G[200]}`,
        boxShadow: '0 1px 4px rgba(30,122,53,0.10), 0 0 0 1px rgba(30,122,53,0.08)'
      }}>
        <Table>
          <TableHead sx={{ bgcolor: G[50] }}>
            <TableRow>
              <TableCell sx={{ color: G[700], fontWeight: 700 }}>Asset Name</TableCell>
              <TableCell sx={{ color: G[700], fontWeight: 700 }}>Category</TableCell>
              <TableCell align="center" sx={{ color: G[700], fontWeight: 700 }}>Total</TableCell>
              <TableCell align="center" sx={{ color: G[700], fontWeight: 700 }}>Available</TableCell>
              <TableCell align="center" sx={{ color: G[700], fontWeight: 700 }}>In Use</TableCell>
              <TableCell align="center" sx={{ color: G[700], fontWeight: 700 }}>Damaged</TableCell>
              <TableCell sx={{ color: G[700], fontWeight: 700 }}>Condition</TableCell>
              <TableCell align="center" sx={{ color: G[700], fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <InventoryIcon sx={{ fontSize: 48, color: G[400], mb: 1 }} />
                    <Typography sx={{ color: G[600] }}>No assets found</Typography>
                    <Button
                      variant="text"
                      startIcon={<AddIcon />}
                      onClick={() => { resetForm(); setOpenDialog(true); }}
                      sx={{ mt: 2, color: G[600] }}
                    >
                      Add Your First Asset
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredAssets.map((asset) => (
                <TableRow key={asset._id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: G[800] }}>
                      {asset.name}
                    </Typography>
                    {asset.description && (
                      <Typography variant="caption" sx={{ color: G[500] }}>
                        {asset.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={asset.category}
                      size="small"
                      sx={{ bgcolor: alpha(G[600], 0.1), color: G[600], fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 600, color: G[800] }}>{asset.quantity}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 600, color: '#10b981' }}>{asset.availableQuantity}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 600, color: '#f59e0b' }}>{asset.usedQuantity}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 600, color: '#ef4444' }}>{asset.damagedQuantity}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={asset.condition}
                      size="small"
                      sx={{ 
                        bgcolor: asset.condition === 'Good' ? alpha('#10b981', 0.1) : 
                                asset.condition === 'Damaged' ? alpha('#ef4444', 0.1) : alpha('#f59e0b', 0.1),
                        color: asset.condition === 'Good' ? '#10b981' : 
                               asset.condition === 'Damaged' ? '#ef4444' : '#f59e0b'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(asset)} 
                          sx={{ color: G[600], bgcolor: G[100], borderRadius: 1.5 }}
                          disabled={submitting}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Assign">
                        <IconButton 
                          size="small" 
                          onClick={() => handleAssign(asset)} 
                          sx={{ color: '#3b82f6', bgcolor: alpha('#3b82f6', 0.1), borderRadius: 1.5 }}
                          disabled={submitting}
                        >
                          <AssignmentIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {asset.condition !== 'Damaged' && asset.availableQuantity > 0 && (
                        <Tooltip title="Mark Damaged">
                          <IconButton 
                            size="small" 
                            onClick={() => handleMarkDamaged(asset._id)} 
                            sx={{ color: '#ef4444', bgcolor: alpha('#ef4444', 0.1), borderRadius: 1.5 }}
                            disabled={submitting}
                          >
                            <WarningIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteAsset(asset._id)} 
                          sx={{ color: '#ef4444', bgcolor: alpha('#ef4444', 0.1), borderRadius: 1.5 }}
                          disabled={submitting}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Asset Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => { setOpenDialog(false); resetForm(); }} 
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
        <Box sx={{ height: 4, bgcolor: G[600], borderRadius: '12px 12px 0 0' }} />
        <DialogTitle sx={{ bgcolor: G[50], borderBottom: `1px solid ${G[100]}` }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: G[800] }}>
            {selectedAsset ? 'Edit Asset' : 'Add New Asset'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Asset Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  label="Category"
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  label="Condition"
                >
                  {conditions.map(cond => (
                    <MenuItem key={cond} value={cond}>{cond}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Purchase Price"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Purchase Date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Warranty Expiry"
                value={formData.warrantyExpiry}
                onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model Number"
                value={formData.modelNumber}
                onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Box sx={{ height: 1, bgcolor: G[100], my: 2 }} />
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => { setOpenDialog(false); resetForm(); }} sx={{ color: G[600], border: `1px solid ${G[200]}`, px: 3 }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={selectedAsset ? handleUpdateAsset : handleCreateAsset}
            disabled={submitting}
            sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] }, px: 3 }}
          >
            {submitting ? 'Saving...' : (selectedAsset ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Asset Dialog */}
      <Dialog 
        open={openAssignDialog} 
        onClose={() => { setOpenAssignDialog(false); resetAssignForm(); }} 
        maxWidth="sm" 
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
        <Box sx={{ height: 4, bgcolor: G[600], borderRadius: '12px 12px 0 0' }} />
        <DialogTitle sx={{ bgcolor: G[50], borderBottom: `1px solid ${G[100]}` }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: G[800] }}>
            Assign Asset: {selectedAsset?.name}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            Available: <strong>{selectedAsset?.availableQuantity}</strong> items
          </Alert>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Assignment Type</InputLabel>
                <Select
                  value={assignForm.assignmentType}
                  onChange={(e) => setAssignForm({ ...assignForm, assignmentType: e.target.value })}
                  label="Assignment Type"
                >
                  <MenuItem value="room">Assign to Room</MenuItem>
                  <MenuItem value="student">Assign to Student</MenuItem>
                  <MenuItem value="common">Common Area</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {assignForm.assignmentType === 'room' && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Room</InputLabel>
                  <Select
                    value={assignForm.roomId}
                    onChange={(e) => setAssignForm({ ...assignForm, roomId: e.target.value })}
                    label="Select Room"
                  >
                    {rooms.map(room => (
                      <MenuItem key={room._id} value={room._id}>
                        Room {room.roomNumber} - Block {room.block}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            {assignForm.assignmentType === 'student' && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Student</InputLabel>
                  <Select
                    value={assignForm.studentId}
                    onChange={(e) => setAssignForm({ ...assignForm, studentId: e.target.value })}
                    label="Select Student"
                  >
                    {students.map(student => (
                      <MenuItem key={student._id} value={student._id}>
                        {student.name} - {student.rollNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={assignForm.quantity}
                onChange={(e) => setAssignForm({ ...assignForm, quantity: parseInt(e.target.value) })}
                inputProps={{ min: 1, max: selectedAsset?.availableQuantity }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                multiline
                rows={2}
                value={assignForm.remarks}
                onChange={(e) => setAssignForm({ ...assignForm, remarks: e.target.value })}
                placeholder="Optional remarks about the assignment"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Box sx={{ height: 1, bgcolor: G[100], my: 2 }} />
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => { setOpenAssignDialog(false); resetAssignForm(); }} sx={{ color: G[600], border: `1px solid ${G[200]}`, px: 3 }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAssignAsset}
            disabled={submitting || !selectedAsset?.availableQuantity}
            sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] }, px: 3 }}
          >
            {submitting ? 'Assigning...' : 'Assign Asset'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Assets;