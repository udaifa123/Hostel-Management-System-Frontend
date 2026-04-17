import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Avatar,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
  useTheme,
  Zoom,
  Fade
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MeetingRoom as RoomIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  AcUnit as AcIcon,
  Whatshot as NonAcIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  CleaningServices as MaintenanceIcon,
  Block as OccupiedIcon,
  CheckCircleOutline as AvailableIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';


const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  VACANT: 'vacant',
  FULL: 'full'
};

const ROOM_STATUS_CONFIG = {
  [ROOM_STATUS.VACANT]: {
    label: 'Vacant',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    icon: <AvailableIcon />
  },
  [ROOM_STATUS.AVAILABLE]: {
    label: 'Available',
    color: '#10b981',
    bg: '#ecfdf5',
    icon: <CheckCircleIcon />
  },
  [ROOM_STATUS.OCCUPIED]: {
    label: 'Occupied',
    color: '#f97316',
    bg: '#fff7ed',
    icon: <OccupiedIcon />
  },
  [ROOM_STATUS.FULL]: {
    label: 'Full',
    color: '#ef4444',
    bg: '#fef2f2',
    icon: <WarningIcon />
  },
  [ROOM_STATUS.MAINTENANCE]: {
    label: 'Maintenance',
    color: '#6b7280',
    bg: '#f3f4f6',
    icon: <MaintenanceIcon />
  }
};

const StatusChip = ({ status, size = 'small' }) => {
  const config = ROOM_STATUS_CONFIG[status] || ROOM_STATUS_CONFIG[ROOM_STATUS.VACANT];
  
  return (
    <Chip
      label={config.label}
      size={size}
      icon={config.icon}
      sx={{
        bgcolor: config.bg,
        color: config.color,
        fontWeight: 600,
        border: `1px solid ${alpha(config.color, 0.2)}`,
        '& .MuiChip-icon': {
          color: config.color
        }
      }}
    />
  );
};

const RoomTypeChip = ({ type }) => (
  <Chip
    label={type}
    size="small"
    icon={type === 'AC' ? <AcIcon /> : <NonAcIcon />}
    sx={{
      bgcolor: type === 'AC' ? '#e0f2fe' : '#f1f5f9',
      color: type === 'AC' ? '#0369a1' : '#475569',
      fontWeight: 500
    }}
  />
);

const WardenRooms = () => {
  const theme = useTheme();
  const { token } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });


  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [formData, setFormData] = useState({
    roomNumber: '',
    block: 'A',
    floor: 1,
    capacity: 3,
    type: 'Non-AC',
    status: 'vacant'
  });


  const [stats, setStats] = useState({
    total: 0,
    vacant: 0,
    available: 0,
    occupied: 0,
    full: 0,
    maintenance: 0,
    totalCapacity: 0,
    totalOccupants: 0
  });

  
  const fetchRooms = async () => {
    try {
      setLoading(true);
      console.log('Fetching rooms...');
      
      const response = await axios.get(`${API_URL}/warden/rooms`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Rooms response:', response.data);
      
      const roomsData = response.data.data || [];
      setRooms(roomsData);
      setFilteredRooms(roomsData);
      
 
      const newStats = roomsData.reduce((acc, room) => {
        acc.total++;
        acc[room.status]++;
        acc.totalCapacity += room.capacity;
        acc.totalOccupants += room.occupants?.length || 0;
        return acc;
      }, {
        total: 0,
        vacant: 0,
        available: 0,
        occupied: 0,
        full: 0,
        maintenance: 0,
        totalCapacity: 0,
        totalOccupants: 0
      });
      
      setStats(newStats);
      
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to load rooms',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

 
  const handleCreateRoom = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post(
        `${API_URL}/warden/rooms`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Room created:', response.data);
      
      setSnackbar({
        open: true,
        message: 'Room created successfully',
        severity: 'success'
      });
      
      setOpenCreateDialog(false);
      fetchRooms();
      resetForm();
      
    } catch (error) {
      console.error('Error creating room:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to create room',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

 
  const handleDeleteRoom = async (room) => {
    if (room.occupants?.length > 0) {
      setSnackbar({
        open: true,
        message: 'Cannot delete room with occupants',
        severity: 'error'
      });
      handleMenuClose();
      return;
    }

    if (!window.confirm(`Are you sure you want to delete Room ${room.roomNumber}?`)) {
      handleMenuClose();
      return;
    }

    try {
      await axios.delete(`${API_URL}/warden/rooms/${room._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSnackbar({
        open: true,
        message: 'Room deleted successfully',
        severity: 'success'
      });
      
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to delete room',
        severity: 'error'
      });
    }
    handleMenuClose();
  };

  const resetForm = () => {
    setFormData({
      roomNumber: '',
      block: 'A',
      floor: 1,
      capacity: 3,
      type: 'Non-AC',
      status: 'vacant'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = rooms.filter(room =>
      room.roomNumber.toLowerCase().includes(term) ||
      room.block.toLowerCase().includes(term) ||
      room.status.toLowerCase().includes(term)
    );
    
    setFilteredRooms(filtered);
    setPage(0);
  };

  const handleMenuOpen = (event, room) => {
    setAnchorEl(event.currentTarget);
    setSelectedRoom(room);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRoom(null);
  };

  const paginatedRooms = filteredRooms.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    if (token) {
      fetchRooms();
    }
  }, [token]);

  const renderStats = () => (
    <Grid container spacing={3} mb={4}>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ borderRadius: 3, bgcolor: alpha('#3b82f6', 0.1) }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Rooms</Typography>
            <Typography variant="h3" fontWeight="bold" color="#3b82f6">{stats.total}</Typography>
            <Typography variant="caption" color="textSecondary">Capacity: {stats.totalCapacity} beds</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ borderRadius: 3, bgcolor: alpha('#8b5cf6', 0.1) }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Vacant</Typography>
            <Typography variant="h3" fontWeight="bold" color="#8b5cf6">{stats.vacant}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ borderRadius: 3, bgcolor: alpha('#10b981', 0.1) }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Available</Typography>
            <Typography variant="h3" fontWeight="bold" color="#10b981">{stats.available}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ borderRadius: 3, bgcolor: alpha('#f97316', 0.1) }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Occupied</Typography>
            <Typography variant="h3" fontWeight="bold" color="#f97316">{stats.occupied}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ borderRadius: 3, bgcolor: alpha('#ef4444', 0.1) }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Full</Typography>
            <Typography variant="h3" fontWeight="bold" color="#ef4444">{stats.full}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  if (loading && rooms.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Room Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage hostel rooms and occupancy
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{
            bgcolor: '#10b981',
            '&:hover': { bgcolor: '#059669' },
            borderRadius: 2,
            px: 4,
            py: 1.5
          }}
        >
          Create New Room
        </Button>
      </Box>

   
      {renderStats()}

      
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={handleSearch}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
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
      </Paper>

     
      {filteredRooms.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <RoomIcon sx={{ fontSize: 80, color: '#94a3b8', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="textSecondary">
            No Rooms Found
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {searchTerm ? 'Try adjusting your search' : 'Create your first room to get started'}
          </Typography>
          {!searchTerm && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateDialog(true)}
              sx={{ bgcolor: '#10b981' }}
            >
              Create First Room
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedRooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={room._id}>
                <Zoom in={true}>
                  <Card 
                    sx={{ 
                      borderRadius: 3,
                      position: 'relative',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8]
                      },
                      border: `1px solid ${alpha(ROOM_STATUS_CONFIG[room.status].color, 0.2)}`,
                      borderTop: `4px solid ${ROOM_STATUS_CONFIG[room.status].color}`
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ bgcolor: alpha(ROOM_STATUS_CONFIG[room.status].color, 0.1) }}>
                            <RoomIcon sx={{ color: ROOM_STATUS_CONFIG[room.status].color }} />
                          </Avatar>
                          <Box>
                            <Typography variant="h5" fontWeight="bold">
                              Room {room.roomNumber}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Block {room.block} • Floor {room.floor}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, room)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Box>

                      <Box display="flex" gap={1} mb={2}>
                        <RoomTypeChip type={room.type} />
                        <StatusChip status={room.status} />
                      </Box>

                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="textSecondary">
                          Capacity
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {room.occupants?.length || 0}/{room.capacity}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>

          <TablePagination
            component="div"
            count={filteredRooms.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50]}
          />
        </>
      )}

    
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Zoom}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Create New Room
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Room Number"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Block</InputLabel>
              <Select
                name="block"
                value={formData.block}
                label="Block"
                onChange={handleInputChange}
              >
                <MenuItem value="A">Block A</MenuItem>
                <MenuItem value="B">Block B</MenuItem>
                <MenuItem value="C">Block C</MenuItem>
                <MenuItem value="D">Block D</MenuItem>
                <MenuItem value="E">Block E</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Floor"
              name="floor"
              type="number"
              value={formData.floor}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 1, max: 10 }}
            />
            <TextField
              label="Capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 1, max: 6 }}
            />
            <FormControl fullWidth>
              <InputLabel>Room Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                label="Room Type"
                onChange={handleInputChange}
              >
                <MenuItem value="AC">AC</MenuItem>
                <MenuItem value="Non-AC">Non-AC</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleInputChange}
              >
                {Object.entries(ROOM_STATUS_CONFIG).map(([key, config]) => (
                  <MenuItem key={key} value={key}>{config.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateRoom}
            variant="contained"
            sx={{ bgcolor: '#10b981' }}
          >
            Create Room
          </Button>
        </DialogActions>
      </Dialog>

      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => handleDeleteRoom(selectedRoom)} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Delete Room</ListItemText>
        </MenuItem>
      </Menu>

    
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WardenRooms;