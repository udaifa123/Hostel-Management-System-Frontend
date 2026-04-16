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
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

// ─── Green Design Tokens ───────────────────────────────────────────────────────
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
  50:  '#F4FBF5',
};

const CARD_SHADOW = '0 1px 4px rgba(30,122,53,0.10), 0 0 0 1px rgba(30,122,53,0.08)';

// ─── Stat Card ─────────────────────────────────────────────────────────────────
// FIXED: Changed prop name from 'icon: Icon' to 'icon' and using it correctly
const StatCard = ({ label, value, icon: IconComponent, dark = false, valueColor }) => (
  <Card elevation={0} sx={{
    borderRadius: 3,
    bgcolor: dark ? G[800] : '#ffffff',
    border: `1px solid ${dark ? G[700] : G[200]}`,
    boxShadow: dark ? '0 4px 16px rgba(13,51,24,0.25)' : CARD_SHADOW,
    height: '100%',
    transition: 'transform 0.15s',
    '&:hover': { transform: 'translateY(-2px)' }
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="caption" sx={{
            color: dark ? G[300] : G[600],
            fontWeight: 600, fontSize: '0.70rem',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            display: 'block', mb: 1
          }}>
            {label}
          </Typography>
          <Typography sx={{
            fontWeight: 700,
            color: valueColor || (dark ? '#ffffff' : G[800]),
            fontSize: '2.2rem', lineHeight: 1,
          }}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{
          bgcolor: dark ? G[700] : G[100],
          width: 48, height: 48, borderRadius: 2,
        }}>
          <IconComponent sx={{ color: dark ? G[200] : G[600], fontSize: 24 }} />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const AdminWardens = () => {
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWarden, setSelectedWarden] = useState(null);
  const [hostels, setHostels] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',  // ✅ ADDED: Password field for new warden
    hostelId: '',
    experience: '',
    joinedDate: '',
    status: 'active'
  });

  useEffect(() => {
    fetchWardens();
    fetchHostels();
  }, []);

  const fetchWardens = async () => {
    setLoading(true);
    try {
      const response = await adminService.getWardens();
      console.log('Wardens API Response:', response);
      
      let wardensData = [];
      if (response.success && response.wardens) {
        wardensData = response.wardens;
      } else if (response.data && response.data.wardens) {
        wardensData = response.data.wardens;
      } else if (response.data && Array.isArray(response.data)) {
        wardensData = response.data;
      } else if (Array.isArray(response)) {
        wardensData = response;
      }
      
      setWardens(wardensData);
    } catch (error) {
      console.error('Error fetching wardens:', error);
      toast.error('Failed to load wardens');
      setWardens([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHostels = async () => {
    try {
      const response = await adminService.getHostels();
      console.log('Hostels API Response:', response);
      
      let hostelsData = [];
      if (response.success && response.hostels) {
        hostelsData = response.hostels;
      } else if (response.data && response.data.hostels) {
        hostelsData = response.data.hostels;
      } else if (response.data && Array.isArray(response.data)) {
        hostelsData = response.data;
      } else if (Array.isArray(response)) {
        hostelsData = response;
      }
      
      setHostels(hostelsData);
    } catch (error) {
      console.error('Error fetching hostels:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenDialog = (warden = null) => {
    if (warden) {
      setSelectedWarden(warden);
      setFormData({
        name: warden.name || '',
        email: warden.email || '',
        phone: warden.phone || '',
        password: '', // Don't show password when editing
        hostelId: warden.hostel?._id || warden.hostelId || '',
        experience: warden.experience || '',
        joinedDate: warden.joinedDate ? new Date(warden.joinedDate).toISOString().split('T')[0] : '',
        status: warden.status || 'active'
      });
    } else {
      setSelectedWarden(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        hostelId: '',
        experience: '',
        joinedDate: '',
        status: 'active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWarden(null);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.email || !formData.phone) {
        toast.error('Please fill all required fields');
        return;
      }
      
      // For new warden, password is required
      if (!selectedWarden && !formData.password) {
        toast.error('Password is required for new warden');
        return;
      }

      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password || undefined,
        hostelId: formData.hostelId || undefined,
        experience: formData.experience,
        joinedDate: formData.joinedDate,
        status: formData.status
      };

      console.log('Submitting warden data:', submitData);
      console.log('Selected warden:', selectedWarden);

      let response;
      if (selectedWarden) {
        const wardenId = selectedWarden._id || selectedWarden.id;
        console.log('Updating warden with ID:', wardenId);
        
        try {
          response = await adminService.updateWarden(wardenId, submitData);
          if (response && response.success) {
            toast.success('Warden updated successfully');
            handleCloseDialog();
            await fetchWardens();
          } else {
            toast.error(response?.message || 'Failed to update warden');
          }
        } catch (updateError) {
          console.error('Update error:', updateError);
          if (updateError.response?.status === 404) {
            toast.error('Update endpoint not available. Please add the PUT route in backend.');
          } else {
            toast.error(updateError.response?.data?.message || 'Failed to update warden');
          }
        }
      } else {
        // CREATE NEW WARDEN
        response = await adminService.createWarden(submitData);
        console.log('Create response:', response);
        
        if (response && (response.success || response.status === 200 || response.status === 201)) {
          toast.success('Warden created successfully');
          handleCloseDialog();
          await fetchWardens();
        } else {
          toast.error(response?.message || 'Failed to create warden');
        }
      }
    } catch (error) {
      console.error('Error saving warden:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to save warden';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this warden?')) return;
    try {
      const response = await adminService.deleteWarden(id);
      if (response && response.success) {
        toast.success('Warden deleted successfully');
        await fetchWardens();
      } else {
        toast.error(response?.message || 'Failed to delete warden');
      }
    } catch (error) {
      console.error('Error deleting warden:', error);
      toast.error('Failed to delete warden');
    }
  };

  const filteredWardens = wardens.filter(w =>
    w.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.hostel?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.hostelName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: wardens.length,
    active: wardens.filter(w => w.status === 'active').length,
    inactive: wardens.filter(w => w.status === 'inactive').length,
  };

  const getHostelName = (warden) => {
    return warden.hostel?.name || warden.hostelName || 'Not Assigned';
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading wardens...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: G[50], minHeight: '100vh' }}>
      {/* Top accent bar */}
      <Box sx={{ height: 4, bgcolor: G[600] }} />

      <Box sx={{ p: 3 }}>

        {/* ── Header ── */}
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
              <PersonIcon sx={{ color: G[200], fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
                Warden Management
              </Typography>
              <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
                Manage all wardens in the system
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: `${G[600]} !important` }} />}
              label={`${stats.active} active`}
              size="small"
              sx={{ bgcolor: G[100], color: G[700], fontWeight: 600, fontSize: '0.72rem', border: `1px solid ${G[200]}` }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                bgcolor: G[700], color: '#ffffff', fontWeight: 600,
                borderRadius: 2, textTransform: 'none',
                boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
                '&:hover': { bgcolor: G[800] }
              }}
            >
              Add Warden
            </Button>
          </Box>
        </Paper>

        {/* ── Stat Cards ── */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard label="Total Wardens" value={stats.total} icon={PersonIcon} dark />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard label="Active" value={stats.active} icon={CheckCircleIcon} valueColor={G[600]} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard label="Inactive" value={stats.inactive} icon={CancelIcon} valueColor="#b45309" />
          </Grid>
        </Grid>

        {/* ── Search ── */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search wardens by name, email, or hostel…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: G[400], fontSize: 20 }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#ffffff', borderRadius: 2.5,
                '& fieldset': { borderColor: G[200] },
                '&:hover fieldset': { borderColor: G[400] },
                '&.Mui-focused fieldset': { borderColor: G[600] },
              },
              '& input': { color: G[800] },
              '& input::placeholder': { color: G[400] },
            }}
          />
          <IconButton 
            onClick={fetchWardens}
            sx={{
              bgcolor: '#ffffff', borderRadius: 2.5,
              border: `1px solid ${G[200]}`, color: G[600],
              '&:hover': { bgcolor: G[100], borderColor: G[400] }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* ── Table ── */}
        <TableContainer component={Paper} elevation={0} sx={{
          borderRadius: 3, bgcolor: '#ffffff',
          border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: G[50] }}>
                {['Warden', 'Contact', 'Hostel', 'Experience', 'Joined Date', 'Status', 'Actions'].map((col, i) => (
                  <TableCell key={col} align={i === 6 ? 'right' : 'left'} sx={{
                    color: G[700], fontWeight: 700, fontSize: '0.70rem',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    borderBottom: `2px solid ${G[200]}`, py: 1.75,
                  }}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredWardens.length > 0 ? (
                filteredWardens.map((warden) => (
                  <TableRow key={warden._id || warden.id} hover sx={{
                    '&:hover': { bgcolor: G[50] },
                    '& td': { borderBottom: `1px solid ${G[100]}`, py: 1.75 }
                  }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{
                          bgcolor: G[100], color: G[700],
                          width: 38, height: 38, fontWeight: 700, fontSize: '0.95rem',
                          border: `2px solid ${G[200]}`
                        }}>
                          {warden.name?.charAt(0) || 'W'}
                        </Avatar>
                        <Box>
                          <Typography sx={{ color: G[800], fontWeight: 600, fontSize: '0.875rem' }}>
                            {warden.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                            <EmailIcon sx={{ fontSize: 11, color: G[400] }} />
                            <Typography variant="caption" sx={{ color: G[500] }}>
                              {warden.email}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <PhoneIcon sx={{ fontSize: 14, color: G[400] }} />
                        <Typography sx={{ color: G[700], fontSize: '0.85rem' }}>{warden.phone}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Avatar sx={{ bgcolor: G[100], width: 26, height: 26, borderRadius: 1 }}>
                          <HomeIcon sx={{ color: G[500], fontSize: 14 }} />
                        </Avatar>
                        <Typography sx={{ color: G[800], fontSize: '0.85rem' }}>
                          {getHostelName(warden)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{
                        color: G[700], fontSize: '0.82rem', fontWeight: 600,
                        bgcolor: G[100], border: `1px solid ${G[200]}`,
                        px: 1.5, py: 0.4, borderRadius: 1.5, display: 'inline-block'
                      }}>
                        {warden.experience || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: G[600], fontSize: '0.85rem' }}>
                        {warden.joinedDate ? new Date(warden.joinedDate).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={warden.status === 'active' ? 'Active' : 'Inactive'}
                        size="small"
                        icon={warden.status === 'active'
                          ? <CheckCircleIcon sx={{ fontSize: '13px !important', color: `${G[600]} !important` }} />
                          : <CancelIcon sx={{ fontSize: '13px !important', color: '#b45309 !important' }} />
                        }
                        sx={{
                          bgcolor: warden.status === 'active' ? G[100] : '#fef3c7',
                          color: warden.status === 'active' ? G[700] : '#b45309',
                          border: `1px solid ${warden.status === 'active' ? G[200] : '#fde68a'}`,
                          fontWeight: 600, fontSize: '0.72rem',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(warden)} sx={{
                        color: G[600], bgcolor: G[100], borderRadius: 1.5, mr: 1,
                        border: `1px solid ${G[200]}`,
                        '&:hover': { bgcolor: G[200] }
                      }}>
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(warden._id || warden.id)} sx={{
                        color: '#c0392b', bgcolor: '#fef2f2', borderRadius: 1.5,
                        border: '1px solid #fecaca',
                        '&:hover': { bgcolor: '#fee2e2' }
                      }}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography sx={{ color: G[400], mb: 2 }}>No wardens found</Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{ borderColor: G[200], color: G[600] }}
                      >
                        Add your first warden
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ── Add/Edit Warden Dialog ── */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
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
          <DialogTitle sx={{ pt: 2.5, pb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: G[800], width: 38, height: 38, borderRadius: 1.5 }}>
                <PersonIcon sx={{ color: G[200], fontSize: 18 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
                {selectedWarden ? 'Edit Warden' : 'Add New Warden'}
              </Typography>
            </Box>
          </DialogTitle>
          <Divider sx={{ borderColor: G[100] }} />
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2, bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                      '&.Mui-focused fieldset': { borderColor: G[600] },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2, bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2, bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              {/* ✅ ADDED: Password field - only show for new warden */}
              {!selectedWarden && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2, bgcolor: G[50],
                        '& fieldset': { borderColor: G[200] },
                      },
                    }}
                  />
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2, bgcolor: G[50],
                    '& fieldset': { borderColor: G[200] },
                  },
                }}>
                  <InputLabel>Assign Hostel</InputLabel>
                  <Select
                    name="hostelId"
                    value={formData.hostelId}
                    onChange={handleInputChange}
                    label="Assign Hostel"
                  >
                    <MenuItem value="">None</MenuItem>
                    {hostels.map((hostel) => (
                      <MenuItem key={hostel._id || hostel.id} value={hostel._id || hostel.id}>
                        {hostel.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 years"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2, bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Joined Date"
                  name="joinedDate"
                  type="date"
                  value={formData.joinedDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2, bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2, bgcolor: G[50],
                    '& fieldset': { borderColor: G[200] },
                  },
                }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider sx={{ borderColor: G[100] }} />
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button onClick={handleCloseDialog} sx={{
              color: G[600], borderRadius: 2, textTransform: 'none', fontWeight: 600,
              border: `1px solid ${G[200]}`, px: 3,
              '&:hover': { bgcolor: G[50] }
            }}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              sx={{
                bgcolor: G[700], color: '#ffffff', fontWeight: 600,
                borderRadius: 2, textTransform: 'none', px: 3,
                boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
                '&:hover': { bgcolor: G[800] }
              }}
            >
              {selectedWarden ? 'Update' : 'Create'} Warden
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
};

export default AdminWardens;