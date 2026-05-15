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
  Avatar,
  LinearProgress,
  alpha,
  Tooltip,
  Snackbar,
  Alert,
  InputAdornment,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

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

const WardenAssets = () => {
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
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchAssets();
    fetchStats();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/assets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched assets:', response.data);
      
      if (response.data.success && response.data.data) {
        setAssets(response.data.data);
        updateStatsFromAssets(response.data.data);
      } else {
        setAssets([]);
        updateStatsFromAssets([]);
        showSnackbar('No assets found', 'info');
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

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleViewDetails = (asset) => {
    setSelectedAsset(asset);
    setOpenViewDialog(true);
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
    { title: 'In Use', value: stats.usedQuantity, icon: <InventoryIcon />, color: '#f59e0b' },
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
     
      <Box sx={{ height: 4, bgcolor: G[600], mb: 3, borderRadius: 2 }} />

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
              Hostel Assets
            </Typography>
            <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
              View all hostel assets and their status
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchAssets}
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
          Refresh
        </Button>
      </Paper>

    
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
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewDetails(asset)} 
                        sx={{ color: G[600], bgcolor: G[100], borderRadius: 1.5 }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      
      <Dialog 
        open={openViewDialog} 
        onClose={() => setOpenViewDialog(false)} 
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
            Asset Details
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedAsset && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: G[600], width: 48, height: 48 }}>
                    <InventoryIcon sx={{ color: '#fff' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: G[800] }}>
                      {selectedAsset.name}
                    </Typography>
                    <Chip 
                      label={selectedAsset.category}
                      size="small"
                      sx={{ bgcolor: alpha(G[600], 0.1), color: G[600] }}
                    />
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: G[500] }}>Total Quantity</Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ color: G[800] }}>
                  {selectedAsset.quantity}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: G[500] }}>Condition</Typography>
                <Chip 
                  label={selectedAsset.condition}
                  size="small"
                  sx={{ 
                    bgcolor: selectedAsset.condition === 'Good' ? alpha('#10b981', 0.1) : 
                            selectedAsset.condition === 'Damaged' ? alpha('#ef4444', 0.1) : alpha('#f59e0b', 0.1),
                    color: selectedAsset.condition === 'Good' ? '#10b981' : 
                           selectedAsset.condition === 'Damaged' ? '#ef4444' : '#f59e0b'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: G[500] }}>Available Quantity</Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#10b981' }}>
                  {selectedAsset.availableQuantity}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: G[500] }}>In Use</Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#f59e0b' }}>
                  {selectedAsset.usedQuantity}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: G[500] }}>Damaged</Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#ef4444' }}>
                  {selectedAsset.damagedQuantity}
                </Typography>
              </Grid>
              
              {selectedAsset.manufacturer && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: G[500] }}>Manufacturer</Typography>
                  <Typography variant="body1" sx={{ color: G[700] }}>
                    {selectedAsset.manufacturer}
                  </Typography>
                </Grid>
              )}
              
              {selectedAsset.modelNumber && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: G[500] }}>Model Number</Typography>
                  <Typography variant="body1" sx={{ color: G[700] }}>
                    {selectedAsset.modelNumber}
                  </Typography>
                </Grid>
              )}
              
              {selectedAsset.purchaseDate && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: G[500] }}>Purchase Date</Typography>
                  <Typography variant="body1" sx={{ color: G[700] }}>
                    {new Date(selectedAsset.purchaseDate).toLocaleDateString()}
                  </Typography>
                </Grid>
              )}
              
              {selectedAsset.purchasePrice && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: G[500] }}>Purchase Price</Typography>
                  <Typography variant="body1" sx={{ color: G[700] }}>
                    ₹{selectedAsset.purchasePrice}
                  </Typography>
                </Grid>
              )}
              
              {selectedAsset.description && (
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: G[500] }}>Description</Typography>
                  <Paper sx={{ p: 2, bgcolor: G[50], mt: 1, borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: G[700] }}>
                      {selectedAsset.description}
                    </Typography>
                  </Paper>
                </Grid>
              )}
              
              {selectedAsset.notes && (
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: G[500] }}>Notes</Typography>
                  <Typography variant="body2" sx={{ color: G[700] }}>
                    {selectedAsset.notes}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <Box sx={{ height: 1, bgcolor: G[100], my: 2 }} />
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenViewDialog(false)} sx={{ color: G[600], border: `1px solid ${G[200]}`, px: 3, borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

     
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

export default WardenAssets;