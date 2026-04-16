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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MeetingRoom as RoomIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Bed as BedIcon,
  People as PeopleIcon,
  GridView as GridIcon
} from '@mui/icons-material';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

// ─── Green Design Tokens ───────────────────────────────────────────────
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

// ─── Stat Card Component ───────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, dark = false, valueColor }) => (
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
          <Icon sx={{ color: dark ? G[200] : G[600], fontSize: 24 }} />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterHostel, setFilterHostel] = useState('all');
  const [formData, setFormData] = useState({
    roomNumber: '',
    hostelId: '',
    floor: '',
    roomType: 'Non-AC',
    capacity: '',
    rent: '',
    status: 'available'
  });

  useEffect(() => {
    fetchRooms();
    fetchHostels();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await adminService.getRooms();
      console.log('Rooms API Response:', response);
      
      let roomsData = [];
      if (response.success && response.rooms) {
        roomsData = response.rooms;
      } else if (response.data && response.data.rooms) {
        roomsData = response.data.rooms;
      } else if (response.data && Array.isArray(response.data)) {
        roomsData = response.data;
      } else if (Array.isArray(response)) {
        roomsData = response;
      }
      
      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
      // Use mock data as fallback
      const mockRoomsData = [
        { _id: '1', roomNumber: '101', hostelId: 'hostel1', hostelName: 'Boys Hostel A', floor: 1, capacity: 4, currentOccupancy: 3, status: 'occupied', roomType: 'AC', rent: 4500 },
        { _id: '2', roomNumber: '102', hostelId: 'hostel1', hostelName: 'Boys Hostel A', floor: 1, capacity: 2, currentOccupancy: 2, status: 'full', roomType: 'Non-AC', rent: 3500 },
        { _id: '3', roomNumber: '103', hostelId: 'hostel1', hostelName: 'Boys Hostel A', floor: 1, capacity: 4, currentOccupancy: 2, status: 'occupied', roomType: 'AC', rent: 4500 },
        { _id: '4', roomNumber: '201', hostelId: 'hostel2', hostelName: 'Boys Hostel B', floor: 2, capacity: 3, currentOccupancy: 3, status: 'full', roomType: 'Non-AC', rent: 3800 },
        { _id: '5', roomNumber: '202', hostelId: 'hostel2', hostelName: 'Boys Hostel B', floor: 2, capacity: 4, currentOccupancy: 1, status: 'available', roomType: 'AC', rent: 4700 }
      ];
      setRooms(mockRoomsData);
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
      // Mock hostels data
      setHostels([
        { _id: 'hostel1', name: 'Boys Hostel A' },
        { _id: 'hostel2', name: 'Boys Hostel B' },
        { _id: 'hostel3', name: 'Girls Hostel' },
        { _id: 'hostel4', name: 'International Hostel' }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenDialog = (room = null) => {
    if (room) {
      setSelectedRoom(room);
      setFormData({
        roomNumber: room.roomNumber || '',
        hostelId: room.hostelId || '',
        floor: room.floor || '',
        roomType: room.roomType || 'Non-AC',
        capacity: room.capacity || '',
        rent: room.rent || '',
        status: room.status || 'available'
      });
    } else {
      setSelectedRoom(null);
      setFormData({
        roomNumber: '',
        hostelId: '',
        floor: '',
        roomType: 'Non-AC',
        capacity: '',
        rent: '',
        status: 'available'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.roomNumber || !formData.hostelId || !formData.capacity || !formData.rent) {
        toast.error('Please fill all required fields');
        return;
      }

      const submitData = {
        roomNumber: formData.roomNumber,
        hostelId: formData.hostelId,
        floor: parseInt(formData.floor) || 1,
        roomType: formData.roomType,
        capacity: parseInt(formData.capacity),
        rent: parseInt(formData.rent),
        status: formData.status
      };

      console.log('Submitting room data:', submitData);

      let response;
      if (selectedRoom) {
        const roomId = selectedRoom._id || selectedRoom.id;
        response = await adminService.updateRoom(roomId, submitData);
        if (response && response.success) {
          toast.success('Room updated successfully');
          handleCloseDialog();
          await fetchRooms();
        } else {
          toast.error(response?.message || 'Failed to update room');
        }
      } else {
        response = await adminService.createRoom(submitData);
        if (response && response.success) {
          toast.success('Room created successfully');
          handleCloseDialog();
          await fetchRooms();
        } else {
          toast.error(response?.message || 'Failed to create room');
        }
      }
    } catch (error) {
      console.error('Error saving room:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to save room';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      const response = await adminService.deleteRoom(id);
      if (response && response.success) {
        toast.success('Room deleted successfully');
        await fetchRooms();
      } else {
        toast.error(response?.message || 'Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room');
    }
  };

  const filteredRooms = rooms.filter(room => {
    const hostelName = room.hostelName || room.hostel?.name || '';
    const matchesSearch = 
      room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hostelName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHostel = filterHostel === 'all' || 
      room.hostelId === filterHostel || 
      hostelName === filterHostel;
    
    return matchesSearch && matchesHostel;
  });

  const stats = {
    total: rooms.length,
    totalBeds: rooms.reduce((sum, room) => sum + (room.capacity || 0), 0),
    occupiedBeds: rooms.reduce((sum, room) => sum + (room.currentOccupancy || room.occupied || 0), 0),
    available: rooms.filter(r => r.status === 'available').length,
    vacant: rooms.filter(r => r.status === 'vacant').length,
    full: rooms.filter(r => r.status === 'full').length,
    occupied: rooms.filter(r => r.status === 'occupied').length
  };

  const occupancyRate = stats.totalBeds > 0 
    ? ((stats.occupiedBeds / stats.totalBeds) * 100).toFixed(1) 
    : 0;

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'available': return { bg: G[100], color: G[600], text: 'Available', icon: <CheckCircleIcon sx={{ fontSize: '13px' }} /> };
      case 'occupied': return { bg: '#FEF3C7', color: '#B45309', text: 'Occupied', icon: <PeopleIcon sx={{ fontSize: '13px' }} /> };
      case 'full': return { bg: '#FEF2F2', color: '#EF4444', text: 'Full', icon: <CancelIcon sx={{ fontSize: '13px' }} /> };
      case 'vacant': return { bg: '#E0F2FE', color: '#0284C7', text: 'Vacant', icon: <CancelIcon sx={{ fontSize: '13px' }} /> };
      default: return { bg: G[100], color: G[600], text: status || 'N/A', icon: null };
    }
  };

  const getRoomTypeColor = (type) => {
    switch(type) {
      case 'AC': return { bg: '#FEF3C7', color: '#B45309' };
      case 'Non-AC': return { bg: G[100], color: G[600] };
      case 'Premium AC': return { bg: '#F3E8FF', color: '#7C3AED' };
      default: return { bg: G[100], color: G[600] };
    }
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading rooms...</Typography>
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
              <RoomIcon sx={{ color: G[200], fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
                Room Management
              </Typography>
              <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
                Manage hostel rooms, occupancy, and allocations
              </Typography>
            </Box>
          </Box>
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
            Add Room
          </Button>
        </Paper>

        {/* ── Stat Cards - FIXED GAP ── */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard label="Total Rooms" value={stats.total} icon={RoomIcon} dark />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard label="Total Beds" value={stats.totalBeds} icon={BedIcon} />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard label="Occupied Beds" value={stats.occupiedBeds} icon={PeopleIcon} valueColor={G[600]} />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard label="Available Rooms" value={stats.available} icon={CheckCircleIcon} valueColor={G[600]} />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard label="Vacant Rooms" value={stats.vacant} icon={CancelIcon} valueColor="#0284C7" />
          </Grid>
        </Grid>

        {/* Occupancy Overview Card */}
        <Card elevation={0} sx={{
          mb: 3, borderRadius: 3, bgcolor: '#ffffff',
          border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontWeight: 600, color: G[800] }}>Overall Occupancy Rate</Typography>
              <Typography sx={{ fontWeight: 700, color: G[600], fontSize: '1.5rem' }}>{occupancyRate}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={occupancyRate}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: G[200],
                '& .MuiLinearProgress-bar': {
                  bgcolor: G[600],
                  borderRadius: 5,
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" sx={{ color: G[500] }}>{stats.occupiedBeds} occupied</Typography>
              <Typography variant="caption" sx={{ color: G[500] }}>{stats.totalBeds - stats.occupiedBeds} available</Typography>
            </Box>
          </CardContent>
        </Card>

        {/* ── Search and Filter ── */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            placeholder="Search rooms by room number or hostel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }}
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
            }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: G[600] }}>Filter by Hostel</InputLabel>
            <Select
              value={filterHostel}
              onChange={(e) => setFilterHostel(e.target.value)}
              label="Filter by Hostel"
              sx={{
                bgcolor: '#ffffff', borderRadius: 2.5,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: G[200] },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: G[400] },
              }}
            >
              <MenuItem value="all">All Hostels</MenuItem>
              {hostels.map((hostel) => (
                <MenuItem key={hostel._id || hostel.id} value={hostel._id || hostel.id || hostel.name}>
                  {hostel.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton 
            onClick={fetchRooms}
            sx={{
              bgcolor: '#ffffff', borderRadius: 2.5,
              border: `1px solid ${G[200]}`, color: G[600],
              '&:hover': { bgcolor: G[100], borderColor: G[400] }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* ── Rooms Table ── */}
        <TableContainer component={Paper} elevation={0} sx={{
          borderRadius: 3, bgcolor: '#ffffff',
          border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: G[50] }}>
                {['Room No.', 'Hostel', 'Floor', 'Type', 'Capacity', 'Occupancy', 'Rent (₹)', 'Status', 'Actions'].map((col, i) => (
                  <TableCell key={col} align={i === 8 ? 'right' : 'left'} sx={{
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
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => {
                  const statusInfo = getStatusColor(room.status);
                  const typeInfo = getRoomTypeColor(room.roomType);
                  const currentOccupancy = room.currentOccupancy || room.occupied || 0;
                  const capacity = room.capacity || 1;
                  const occupancyPercentage = (currentOccupancy / capacity) * 100;
                  const hostelName = room.hostelName || room.hostel?.name || 'N/A';
                  
                  return (
                    <TableRow key={room._id || room.id} hover sx={{
                      '&:hover': { bgcolor: G[50] },
                      '& td': { borderBottom: `1px solid ${G[100]}`, py: 1.75 }
                    }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{
                            bgcolor: G[100], color: G[700],
                            width: 38, height: 38, borderRadius: 2,
                            border: `2px solid ${G[200]}`
                          }}>
                            <RoomIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Typography sx={{ color: G[800], fontWeight: 600, fontSize: '0.95rem' }}>
                            {room.roomNumber}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <HomeIcon sx={{ fontSize: 14, color: G[400] }} />
                          <Typography sx={{ color: G[700], fontSize: '0.85rem' }}>
                            {hostelName}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ color: G[700], fontSize: '0.85rem' }}>
                          Floor {room.floor || 1}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={room.roomType}
                          size="small"
                          sx={{
                            bgcolor: typeInfo.bg,
                            color: typeInfo.color,
                            fontWeight: 600, fontSize: '0.72rem',
                            border: `1px solid ${typeInfo.color}40`
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ color: G[700], fontSize: '0.85rem' }}>
                          {capacity} beds
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography sx={{ color: G[800], fontSize: '0.85rem', fontWeight: 500 }}>
                              {currentOccupancy}/{capacity}
                            </Typography>
                            <Typography variant="caption" sx={{ color: G[500] }}>
                              ({occupancyPercentage.toFixed(0)}%)
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={occupancyPercentage}
                            sx={{
                              width: 80,
                              height: 4,
                              borderRadius: 2,
                              bgcolor: G[200],
                              '& .MuiLinearProgress-bar': {
                                bgcolor: occupancyPercentage === 100 ? '#EF4444' : G[600],
                                borderRadius: 2,
                              }
                            }}
                          />
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ color: G[700], fontSize: '0.85rem', fontWeight: 600 }}>
                          ₹{room.rent}/month
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={statusInfo.text}
                          size="small"
                          icon={statusInfo.icon}
                          sx={{
                            bgcolor: statusInfo.bg,
                            color: statusInfo.color,
                            border: `1px solid ${statusInfo.color}40`,
                            fontWeight: 600, fontSize: '0.72rem',
                          }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="Edit Room">
                          <IconButton size="small" onClick={() => handleOpenDialog(room)} sx={{
                            color: G[600], bgcolor: G[100], borderRadius: 1.5, mr: 1,
                            border: `1px solid ${G[200]}`,
                            '&:hover': { bgcolor: G[200] }
                          }}>
                            <EditIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Room">
                          <IconButton size="small" onClick={() => handleDelete(room._id || room.id)} sx={{
                            color: '#c0392b', bgcolor: '#fef2f2', borderRadius: 1.5,
                            border: '1px solid #fecaca',
                            '&:hover': { bgcolor: '#fee2e2' }
                          }}>
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography sx={{ color: G[400], mb: 2 }}>No rooms found</Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{ borderColor: G[200], color: G[600] }}
                      >
                        Add your first room
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ── Add/Edit Room Dialog ── */}
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
                <RoomIcon sx={{ color: G[200], fontSize: 18 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
                {selectedRoom ? 'Edit Room' : 'Add New Room'}
              </Typography>
            </Box>
          </DialogTitle>
          <Divider sx={{ borderColor: G[100] }} />
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Room Number"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2, bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Hostel</InputLabel>
                  <Select
                    name="hostelId"
                    value={formData.hostelId}
                    onChange={handleInputChange}
                    label="Hostel"
                    sx={{
                      borderRadius: 2, bgcolor: G[50],
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: G[200] },
                    }}
                  >
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
                  label="Floor"
                  name="floor"
                  type="number"
                  value={formData.floor}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2, bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Room Type</InputLabel>
                  <Select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    label="Room Type"
                    sx={{
                      borderRadius: 2, bgcolor: G[50],
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: G[200] },
                    }}
                  >
                    <MenuItem value="Non-AC">Non-AC</MenuItem>
                    <MenuItem value="AC">AC</MenuItem>
                    <MenuItem value="Premium AC">Premium AC</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Capacity (Beds)"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
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
                  label="Rent (₹ per month)"
                  name="rent"
                  type="number"
                  value={formData.rent}
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
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Status"
                    sx={{
                      borderRadius: 2, bgcolor: G[50],
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: G[200] },
                    }}
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="occupied">Occupied</MenuItem>
                    <MenuItem value="vacant">Vacant</MenuItem>
                    <MenuItem value="full">Full</MenuItem>
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
              {selectedRoom ? 'Update' : 'Create'} Room
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
};

export default AdminRooms;