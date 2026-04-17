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
  LinearProgress,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import AdminLayout from '../../components/Layout/AdminLayout';
import toast from 'react-hot-toast';


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
              fontWeight: 600, fontSize: '0.70rem',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              display: 'block', mb: 1
            }}>
              {label}
            </Typography>
            <Typography variant="h3" sx={{
              fontWeight: 700,
              color: dark ? '#ffffff' : G[800],
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
};


const dialogField = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: G[50],
    '& fieldset': { borderColor: G[200] },
    '&:hover fieldset': { borderColor: G[400] },
    '&.Mui-focused fieldset': { borderColor: G[600] },
  },
  '& .MuiInputLabel-root': { color: G[600] },
  '& .MuiInputLabel-root.Mui-focused': { color: G[700] },
  '& input': { color: G[800] },
};


const AdminHostels = () => {
  
  const [loading, setLoading] = useState(true);
  const [hostels, setHostels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [wardens, setWardens] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Boys',
    location: '',
    capacity: '',
    contact: { phone: '', email: '' },
    wardenId: ''
  });

  useEffect(() => {
    fetchHostels();
    fetchWardens();
  }, []);

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const response = await adminService.getHostels();
      console.log('Fetch hostels response:', response);
      
      
      if (response.success && response.hostels) {
        setHostels(response.hostels);
        console.log('Hostels loaded:', response.hostels.length);
      } else if (response.data && response.data.hostels) {
        setHostels(response.data.hostels);
        console.log('Hostels loaded from data:', response.data.hostels.length);
      } else if (Array.isArray(response)) {
        setHostels(response);
        console.log('Hostels loaded as array:', response.length);
      } else {
        console.error('Unexpected response structure:', response);
        setHostels([]);
      }
    } catch (error) {
      console.error('Error fetching hostels:', error);
      toast.error('Failed to load hostels');
      setHostels([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWardens = async () => {
    try {
      const response = await adminService.getWardens();
      if (response.success && response.wardens) {
        setWardens(response.wardens);
      }
    } catch (error) {
      console.error('Error fetching wardens:', error);
    }
  };

  const handleOpenDialog = (hostel = null) => {
    if (hostel) {
      setSelectedHostel(hostel);
      setFormData({
        name: hostel.name || '',
        code: hostel.code || '',
        type: hostel.type || 'Boys',
        location: hostel.location || '',
        capacity: hostel.capacity || '',
        contact: {
          phone: hostel.contact?.phone || '',
          email: hostel.contact?.email || ''
        },
        wardenId: hostel.wardenId?._id || hostel.wardenId || ''
      });
    } else {
      setSelectedHostel(null);
      setFormData({
        name: '', code: '', type: 'Boys', location: '', capacity: '',
        contact: { phone: '', email: '' }, wardenId: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedHostel(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const field = name.split('.')[1];
      setFormData({ ...formData, contact: { ...formData.contact, [field]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const getTypeForBackend = (typeValue) => {
    return typeValue.toLowerCase();
  };

  const handleSubmit = async () => {
    try {
      
      if (!formData.name || !formData.code || !formData.location || !formData.capacity) {
        toast.error('Please fill all required fields');
        return;
      }

      
      const convertedType = getTypeForBackend(formData.type);
      
      console.log('Original type:', formData.type);
      console.log('Converted type:', convertedType);
      
     
      const submitData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        type: convertedType,
        location: formData.location.trim(),
        capacity: parseInt(formData.capacity),
        contact: {
          phone: formData.contact.phone,
          email: formData.contact.email
        },
        wardenId: formData.wardenId || undefined
      };
      
      console.log('Submitting hostel data:', submitData);
      
      let response;
      if (selectedHostel) {
        response = await adminService.updateHostel(selectedHostel._id, submitData);
        if (response.success) {
          toast.success('Hostel updated successfully');
          handleCloseDialog();
          await fetchHostels();
        } else {
          toast.error(response.message || 'Failed to update hostel');
        }
      } else {
        response = await adminService.createHostel(submitData);
        if (response.success) {
          toast.success('Hostel created successfully');
          handleCloseDialog();
          await fetchHostels();
        } else {
          toast.error(response.message || 'Failed to create hostel');
        }
      }
    } catch (error) {
      console.error('Error saving hostel:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to save hostel';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hostel?')) return;
    try {
      const response = await adminService.deleteHostel(id);
      if (response.success) {
        toast.success('Hostel deleted successfully');
        await fetchHostels();
      } else {
        toast.error(response.message || 'Failed to delete hostel');
      }
    } catch (error) {
      console.error('Error deleting hostel:', error);
      toast.error('Failed to delete hostel');
    }
  };

  const filteredHostels = hostels.filter(h =>
    h.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRooms    = hostels.reduce((s, h) => s + (h.stats?.totalRooms || 0), 0);
  const totalStudents = hostels.reduce((s, h) => s + (h.stats?.totalStudents || 0), 0);
  const occupiedRooms = hostels.reduce((s, h) => s + (h.stats?.occupiedRooms || 0), 0);
  const avgOccupancy  = Math.round((occupiedRooms / (totalRooms || 1)) * 100);

  if (loading) return (
    <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
      <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
      <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading hostels...</Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: G[50], minHeight: '100vh' }}>
      
      <Box sx={{ height: 4, bgcolor: G[600] }} />

      <Box sx={{ p: 3 }}>
        
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
              <HomeIcon sx={{ color: G[200], fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
                Hostel Management
              </Typography>
              <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
                Manage all hostels in the system
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: `${G[600]} !important` }} />}
              label={`${hostels.length} hostels`}
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
                '&:hover': { bgcolor: G[800], boxShadow: '0 6px 16px rgba(30,122,53,0.40)' }
              }}
            >
              Add Hostel
            </Button>
          </Box>
        </Paper>

       
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Total Hostels"   value={hostels.length}  icon={HomeIcon}   dark />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Total Rooms"     value={totalRooms}      icon={PeopleIcon} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Total Students"  value={totalStudents}   icon={PersonIcon} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Avg Occupancy"   value={`${avgOccupancy}%`} icon={CheckCircleIcon} />
          </Grid>
        </Grid>

     
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by name, code, or location…"
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
            onClick={() => fetchHostels()}
            sx={{
              bgcolor: '#ffffff', borderRadius: 2.5,
              border: `1px solid ${G[200]}`, color: G[600],
              '&:hover': { bgcolor: G[100], borderColor: G[400] }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{
          borderRadius: 3, bgcolor: '#ffffff',
          border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: G[50] }}>
                {['Hostel', 'Code', 'Location', 'Capacity', 'Occupancy', 'Warden', 'Contact', 'Actions'].map((col, i) => (
                  <TableCell key={col} align={i === 7 ? 'right' : 'left'} sx={{
                    color: G[700], fontWeight: 700, fontSize: '0.72rem',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    borderBottom: `2px solid ${G[200]}`, py: 1.75,
                  }}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHostels.length > 0 ? (
                filteredHostels.map((hostel) => {
                  const occ = Math.round(((hostel.stats?.occupiedRooms || 0) / (hostel.stats?.totalRooms || 1)) * 100);
                  
                  
                  const typeMap = {
                    girls: 'Girls',
                    boys: 'Boys',
                    'co-ed': 'Co-ed'
                  };
                  const hostelType = (hostel.type || '').toLowerCase();
                  const displayType = typeMap[hostelType] || 'Boys';
                  
                  return (
                    <TableRow key={hostel._id || hostel.id} hover sx={{
                      '&:hover': { bgcolor: G[50] },
                      '& td': { borderBottom: `1px solid ${G[100]}`, py: 1.75 }
                    }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: G[100], width: 36, height: 36, borderRadius: 1.5 }}>
                            <HomeIcon sx={{ color: G[600], fontSize: 18 }} />
                          </Avatar>
                          <Box>
                            <Typography sx={{ color: G[800], fontWeight: 600, fontSize: '0.875rem' }}>
                              {hostel.name}
                            </Typography>
                            <Chip label={displayType} size="small" sx={{
                              height: 18, fontSize: '0.65rem', fontWeight: 600,
                              bgcolor: G[100], color: G[700], border: `1px solid ${G[200]}`,
                              mt: 0.25
                            }} />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{
                          color: G[700], fontWeight: 700, fontSize: '0.82rem',
                          bgcolor: G[100], border: `1px solid ${G[200]}`,
                          px: 1.5, py: 0.4, borderRadius: 1.5, display: 'inline-block'
                        }}>
                          {hostel.code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationIcon sx={{ color: G[400], fontSize: 14 }} />
                          <Typography sx={{ color: G[700], fontSize: '0.85rem' }}>{hostel.location}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: G[800], fontWeight: 600 }}>{hostel.capacity}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography sx={{ color: G[600], fontSize: '0.75rem', fontWeight: 600 }}>
                              {hostel.stats?.occupiedRooms || 0}/{hostel.stats?.totalRooms || 0}
                            </Typography>
                            <Typography sx={{ color: G[700], fontSize: '0.75rem', fontWeight: 700 }}>
                              {occ}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={occ}
                            sx={{
                              width: 80, height: 6, borderRadius: 3,
                              bgcolor: G[100],
                              '& .MuiLinearProgress-bar': {
                                bgcolor: occ > 80 ? '#e74c3c' : occ > 60 ? G[500] : G[600],
                                borderRadius: 3
                              }
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: G[100], fontSize: '0.7rem', color: G[700] }}>
                            {(hostel.wardenId?.name || 'N')[0]}
                          </Avatar>
                          <Typography sx={{ color: G[800], fontSize: '0.85rem' }}>
                            {hostel.wardenId?.name || 'Not Assigned'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <PhoneIcon sx={{ fontSize: 12, color: G[400] }} />
                            <Typography variant="caption" sx={{ color: G[600] }}>
                              {hostel.contact?.phone || 'N/A'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EmailIcon sx={{ fontSize: 12, color: G[400] }} />
                            <Typography variant="caption" sx={{ color: G[600] }}>
                              {hostel.contact?.email || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpenDialog(hostel)} sx={{
                          color: G[600], bgcolor: G[100], borderRadius: 1.5, mr: 1,
                          border: `1px solid ${G[200]}`,
                          '&:hover': { bgcolor: G[200] }
                        }}>
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(hostel._id || hostel.id)} sx={{
                          color: '#c0392b', bgcolor: '#fef2f2', borderRadius: 1.5,
                          border: '1px solid #fecaca',
                          '&:hover': { bgcolor: '#fee2e2' }
                        }}>
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography sx={{ color: G[400], mb: 2 }}>No hostels found</Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{ borderColor: G[200], color: G[600] }}
                      >
                        Add your first hostel
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
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

          <DialogTitle sx={{ pt: 2.5, pb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: G[800], width: 38, height: 38, borderRadius: 1.5 }}>
                <HomeIcon sx={{ color: G[200], fontSize: 18 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
                {selectedHostel ? 'Edit Hostel' : 'Add New Hostel'}
              </Typography>
            </Box>
          </DialogTitle>

          <Divider sx={{ borderColor: G[100] }} />

          <DialogContent sx={{ pt: 3 }}>
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2, bgcolor: G[50] }}>
              <strong>Note:</strong> Hostel type will be saved in lowercase format (e.g., "girls" instead of "Girls").
            </Alert>
            
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Hostel Name" 
                  name="name"
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  sx={dialogField} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Hostel Code" 
                  name="code"
                  value={formData.code} 
                  onChange={handleInputChange} 
                  required 
                  sx={dialogField} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={dialogField}>
                  <InputLabel>Type</InputLabel>
                  <Select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleInputChange} 
                    label="Type"
                    sx={{ color: G[800], bgcolor: G[50], borderRadius: 2 }}>
                    <MenuItem value="Boys">Boys Hostel</MenuItem>
                    <MenuItem value="Girls">Girls Hostel</MenuItem>
                    <MenuItem value="Co-ed">Co-ed Hostel</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Location" 
                  name="location"
                  value={formData.location} 
                  onChange={handleInputChange} 
                  required 
                  sx={dialogField} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Capacity" 
                  name="capacity" 
                  type="number"
                  value={formData.capacity} 
                  onChange={handleInputChange} 
                  required 
                  sx={dialogField} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={dialogField}>
                  <InputLabel>Assign Warden</InputLabel>
                  <Select 
                    name="wardenId" 
                    value={formData.wardenId} 
                    onChange={handleInputChange}
                    label="Assign Warden" 
                    sx={{ color: G[800], bgcolor: G[50], borderRadius: 2 }}>
                    <MenuItem value="">None</MenuItem>
                    {wardens.map((w) => (
                      <MenuItem key={w._id} value={w._id}>
                        {w.name} {w.hostel ? '(Already Assigned)' : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Contact Phone" 
                  name="contact.phone"
                  value={formData.contact.phone} 
                  onChange={handleInputChange} 
                  sx={dialogField}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: G[400], fontSize: 18 }} /></InputAdornment> }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Contact Email" 
                  name="contact.email" 
                  type="email"
                  value={formData.contact.email} 
                  onChange={handleInputChange} 
                  sx={dialogField}
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: G[400], fontSize: 18 }} /></InputAdornment> }} 
                />
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
            <Button onClick={handleSubmit} variant="contained" sx={{
              bgcolor: G[700], color: '#ffffff', fontWeight: 600,
              borderRadius: 2, textTransform: 'none', px: 3,
              boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
              '&:hover': { bgcolor: G[800] }
            }}>
              {selectedHostel ? 'Update' : 'Create'} Hostel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminHostels;