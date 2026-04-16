import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  alpha,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Tooltip,
  Avatar,
  Badge,
  LinearProgress,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Restaurant as RestaurantIcon,
  FreeBreakfast as BreakfastIcon,
  LunchDining as LunchIcon,
  DinnerDining as DinnerIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
  EventNote as EventNoteIcon,
  ContentCopy as ContentCopyIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// ==================== Green Design Tokens ====================
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

// ==================== Constants ====================
const DAYS = [
  { id: 'monday', label: 'Monday', icon: <EventNoteIcon /> },
  { id: 'tuesday', label: 'Tuesday', icon: <EventNoteIcon /> },
  { id: 'wednesday', label: 'Wednesday', icon: <EventNoteIcon /> },
  { id: 'thursday', label: 'Thursday', icon: <EventNoteIcon /> },
  { id: 'friday', label: 'Friday', icon: <EventNoteIcon /> },
  { id: 'saturday', label: 'Saturday', icon: <EventNoteIcon /> },
  { id: 'sunday', label: 'Sunday', icon: <EventNoteIcon /> }
];

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: <BreakfastIcon />, time: '7:00 AM - 9:00 AM', color: G[600] },
  { id: 'lunch', label: 'Lunch', icon: <LunchIcon />, time: '12:00 PM - 2:00 PM', color: '#2196f3' },
  { id: 'snacks', label: 'Evening Snacks', icon: <RestaurantIcon />, time: '5:00 PM - 6:00 PM', color: '#ff9800' },
  { id: 'dinner', label: 'Dinner', icon: <DinnerIcon />, time: '7:00 PM - 9:00 PM', color: '#9c27b0' }
];

// Demo data for when backend is not available
const DEMO_MENU = {
  monday: { 
    breakfast: 'Poha, Tea, Banana', 
    lunch: 'Rice, Dal, Mixed Veg, Salad', 
    snacks: 'Samosa, Tea', 
    dinner: 'Chapati, Paneer Butter Masala, Rice' 
  },
  tuesday: { 
    breakfast: 'Upma, Coffee, Apple', 
    lunch: 'Biryani, Raita, Boondi', 
    snacks: 'Pakora, Coffee', 
    dinner: 'Chapati, Dal Makhani, Jeera Rice' 
  },
  wednesday: { 
    breakfast: 'Sandwich, Tea, Orange', 
    lunch: 'Rajma Chawal, Salad', 
    snacks: 'Biscuit, Tea', 
    dinner: 'Chapati, Mix Veg, Rice' 
  },
  thursday: { 
    breakfast: 'Paratha, Curd, Banana', 
    lunch: 'Kadhi Chawal, Papad', 
    snacks: 'Vada Pav, Tea', 
    dinner: 'Chapati, Chole, Rice' 
  },
  friday: { 
    breakfast: 'Puri Bhaji, Tea', 
    lunch: 'Veg Pulao, Raita, Salad', 
    snacks: 'Bhel Puri, Coffee', 
    dinner: 'Chapati, Dal Fry, Rice' 
  },
  saturday: { 
    breakfast: 'Idli Sambhar, Coconut Chutney', 
    lunch: 'Fried Rice, Noodles, Manchurian', 
    snacks: 'Pizza, Coke', 
    dinner: 'Chapati, Matar Paneer, Rice' 
  },
  sunday: { 
    breakfast: 'Chole Bhature, Tea', 
    lunch: 'Veg Biryani, Boondi Raita, Salad', 
    snacks: 'Pastry, Coffee', 
    dinner: 'Chapati, Special Sabji, Rice, Ice Cream' 
  }
};

// ==================== Main Component ====================
const WardenMess = () => {
  const { token } = useAuth();
  
  // State
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);
  const [copyTargetDay, setCopyTargetDay] = useState('');
  const [editForm, setEditForm] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionDay, setActionDay] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stats, setStats] = useState({
    totalMeals: 0,
    specialMeals: 0,
    upcomingChanges: 0,
    lastUpdated: null
  });

  // Calculate stats
  const calculateStats = (menuData) => {
    let total = 0;
    let special = 0;
    
    Object.values(menuData).forEach(day => {
      if (day && typeof day === 'object') {
        Object.values(day).forEach(meal => {
          if (meal && meal !== '') total++;
          if (meal && (meal.toLowerCase().includes('special') || meal.toLowerCase().includes('paneer'))) special++;
        });
      }
    });

    setStats({
      totalMeals: total,
      specialMeals: special,
      upcomingChanges: 3,
      lastUpdated: new Date()
    });
  };

  // Fetch menu data
  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      
      try {
        const response = await axios.get(`${API_URL}/mess/menu`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        let menuData = response.data?.data || response.data?.menu || response.data;
        
        if (menuData && Object.keys(menuData).length > 0) {
          setMenu(menuData);
          calculateStats(menuData);
        } else {
          // Use demo data
          setMenu(DEMO_MENU);
          calculateStats(DEMO_MENU);
          showSnackbar('Using demo menu data', 'info');
        }
      } catch (err) {
        console.log('Backend not available, using demo data');
        setMenu(DEMO_MENU);
        calculateStats(DEMO_MENU);
        showSnackbar('Using demo menu data - Backend API not available', 'info');
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      setMenu(DEMO_MENU);
      calculateStats(DEMO_MENU);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchMenu();
    }
  }, [token, fetchMenu]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEditMeal = (dayId, mealId) => {
    setSelectedDay(dayId);
    setSelectedMeal(mealId);
    setEditForm({ value: menu[dayId]?.[mealId] || '' });
    setOpenDialog(true);
  };

  const handleEditDay = (dayId) => {
    setSelectedDay(dayId);
    setSelectedMeal('all');
    setEditForm({ ...menu[dayId] });
    setOpenDialog(true);
  };

  const handleSaveMeal = async () => {
    try {
      const updatedMenu = { ...menu };
      
      if (selectedMeal === 'all') {
        // Update all meals for the day
        updatedMenu[selectedDay] = { ...editForm };
      } else {
        // Update single meal
        if (!updatedMenu[selectedDay]) updatedMenu[selectedDay] = {};
        updatedMenu[selectedDay][selectedMeal] = editForm.value;
      }

      setMenu(updatedMenu);
      calculateStats(updatedMenu);
      showSnackbar('Menu updated successfully', 'success');
      setOpenDialog(false);
      setSelectedDay(null);
      setSelectedMeal(null);
      
    } catch (error) {
      console.error('Error saving menu:', error);
      showSnackbar(error.response?.data?.message || 'Failed to update menu', 'error');
    }
  };

  const handleCopyDay = (sourceDay) => {
    setSelectedDay(sourceDay);
    setOpenCopyDialog(true);
  };

  const handleCopyConfirm = async () => {
    if (!copyTargetDay || copyTargetDay === selectedDay) {
      showSnackbar('Please select a valid target day', 'error');
      return;
    }

    try {
      const updatedMenu = { ...menu };
      updatedMenu[copyTargetDay] = { ...menu[selectedDay] };

      setMenu(updatedMenu);
      calculateStats(updatedMenu);
      showSnackbar(`Menu copied from ${selectedDay} to ${copyTargetDay}`, 'success');
      setOpenCopyDialog(false);
      setSelectedDay(null);
      setCopyTargetDay('');
    } catch (error) {
      console.error('Error copying menu:', error);
      showSnackbar('Failed to copy menu', 'error');
    }
  };

  const handleClearDay = async (dayId) => {
    try {
      const updatedMenu = { ...menu };
      updatedMenu[dayId] = {
        breakfast: '',
        lunch: '',
        snacks: '',
        dinner: ''
      };

      setMenu(updatedMenu);
      calculateStats(updatedMenu);
      showSnackbar(`Menu cleared for ${dayId}`, 'success');
      setAnchorEl(null);
    } catch (error) {
      console.error('Error clearing menu:', error);
      showSnackbar('Failed to clear menu', 'error');
    }
  };

  const handleExportMenu = () => {
    const exportData = [];
    
    DAYS.forEach(day => {
      const dayMenu = menu[day.id] || {};
      exportData.push({
        Day: day.label,
        Breakfast: dayMenu.breakfast || '',
        Lunch: dayMenu.lunch || '',
        Snacks: dayMenu.snacks || '',
        Dinner: dayMenu.dinner || ''
      });
    });

    const csvContent = [
      ['Day', 'Breakfast', 'Lunch', 'Snacks', 'Dinner'].join(','),
      ...exportData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mess_menu_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showSnackbar('Menu exported successfully', 'success');
  };

  const handleMenuOpen = (event, day) => {
    setAnchorEl(event.currentTarget);
    setActionDay(day);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActionDay(null);
  };

  const getMealCountForDay = (dayMenu) => {
    if (!dayMenu) return 0;
    let count = 0;
    MEAL_TYPES.forEach(meal => {
      if (dayMenu[meal.id] && dayMenu[meal.id] !== '') count++;
    });
    return count;
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading menu...</Typography>
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
            <RestaurantIcon sx={{ color: G[200], fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
              Mess Menu Management
            </Typography>
            <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
              Update and manage weekly mess menu for students
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={2}>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchMenu} sx={{ 
              color: G[600], bgcolor: G[100], borderRadius: 1.5,
              '&:hover': { bgcolor: G[200] }
            }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export Menu">
            <IconButton onClick={handleExportMenu} sx={{ 
              color: G[600], bgcolor: G[100], borderRadius: 1.5,
              '&:hover': { bgcolor: G[200] }
            }}>
              <ExportIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => showSnackbar('Menu published successfully!', 'success')}
            sx={{
              bgcolor: G[700],
              color: '#ffffff',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': { bgcolor: G[800] }
            }}
          >
            Publish Menu
          </Button>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: G[800], border: `1px solid ${G[700]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: alpha('#ffffff', 0.1), color: '#ffffff' }}>
                  <RestaurantIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ color: G[300], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    Total Meals
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#ffffff', fontSize: '2rem' }}>
                    {stats.totalMeals}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b' }}>
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    Special Meals
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#f59e0b', fontSize: '2rem' }}>
                    {stats.specialMeals}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6' }}>
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    Upcoming Changes
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#3b82f6', fontSize: '2rem' }}>
                    {stats.upcomingChanges}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: alpha(G[600], 0.1), color: G[600] }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    Last Updated
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: G[600], fontSize: '0.9rem' }}>
                    {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : 'Today'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper elevation={0} sx={{ mb: 3, borderRadius: 2.5, border: `1px solid ${G[200]}` }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              color: G[500],
              '&.Mui-selected': { color: G[700] }
            },
            '& .MuiTabs-indicator': { bgcolor: G[600], height: 3 }
          }}
        >
          <Tab label="Weekly Menu" />
          <Tab label="Meal Times" />
          <Tab label="History" />
        </Tabs>
      </Paper>

      {/* Weekly Menu View */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {DAYS.map((day) => {
            const dayMenu = menu[day.id] || {};
            const mealCount = getMealCountForDay(dayMenu);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={day.id}>
                <Card sx={{ 
                  borderRadius: 3, 
                  border: `1px solid ${G[200]}`, 
                  boxShadow: CARD_SHADOW,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ bgcolor: G[100], color: G[600] }}>
                          {day.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
                            {day.label}
                          </Typography>
                          <Typography variant="caption" sx={{ color: G[500] }}>
                            {mealCount}/4 meals set
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, day.id)} sx={{ color: G[600] }}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    <Grid container spacing={1.5}>
                      {MEAL_TYPES.map((meal) => (
                        <Grid item xs={12} key={meal.id}>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: G[50],
                              border: `1px solid ${G[200]}`,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: G[100],
                                borderColor: G[400]
                              }
                            }}
                            onClick={() => handleEditMeal(day.id, meal.id)}
                          >
                            <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
                              <Avatar sx={{ bgcolor: alpha(meal.color, 0.1), color: meal.color, width: 28, height: 28 }}>
                                {meal.icon}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: G[800] }}>
                                {meal.label}
                              </Typography>
                              <Chip
                                label={meal.time.split(' - ')[0]}
                                size="small"
                                sx={{ 
                                  bgcolor: alpha(meal.color, 0.1), 
                                  color: meal.color,
                                  height: 20,
                                  fontSize: '0.65rem'
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ color: G[600], ml: 4.5 }}>
                              {dayMenu[meal.id] || 'Not set'}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    <Box display="flex" gap={1} mt={2}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ContentCopyIcon />}
                        onClick={() => handleCopyDay(day.id)}
                        sx={{ 
                          flex: 1,
                          color: G[600], 
                          borderColor: G[200],
                          borderRadius: 1.5,
                          '&:hover': { borderColor: G[600], bgcolor: G[50] }
                        }}
                      >
                        Copy
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        onClick={() => handleClearDay(day.id)}
                        sx={{ 
                          flex: 1,
                          color: '#ef4444', 
                          borderColor: G[200],
                          borderRadius: 1.5,
                          '&:hover': { borderColor: '#ef4444', bgcolor: alpha('#ef4444', 0.05) }
                        }}
                      >
                        Clear
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Meal Times View */}
      {tabValue === 1 && (
        <TableContainer component={Paper} elevation={0} sx={{
          borderRadius: 3,
          bgcolor: '#ffffff',
          border: `1px solid ${G[200]}`
        }}>
          <Table>
            <TableHead sx={{ bgcolor: G[50] }}>
              <TableRow>
                <TableCell sx={{ color: G[700], fontWeight: 700 }}>Meal</TableCell>
                <TableCell sx={{ color: G[700], fontWeight: 700 }}>Time</TableCell>
                <TableCell sx={{ color: G[700], fontWeight: 700 }}>Duration</TableCell>
                <TableCell sx={{ color: G[700], fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MEAL_TYPES.map((meal) => (
                <TableRow key={meal.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ bgcolor: alpha(meal.color, 0.1), color: meal.color, width: 32, height: 32 }}>
                        {meal.icon}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600, color: G[800] }}>{meal.label}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: G[600] }}>{meal.time}</TableCell>
                  <TableCell>
                    <Chip 
                      label={meal.time.includes('AM') ? 'Morning' : meal.time.includes('PM') ? 'Evening' : 'Regular'}
                      size="small"
                      sx={{ bgcolor: alpha(meal.color, 0.1), color: meal.color }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label="Active"
                      size="small"
                      sx={{ bgcolor: alpha(G[600], 0.1), color: G[600] }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* History View */}
      {tabValue === 2 && (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: `1px solid ${G[200]}` }}>
          <HistoryIcon sx={{ fontSize: 64, color: G[400], mb: 2 }} />
          <Typography variant="h6" sx={{ color: G[600], mb: 1 }}>No History Available</Typography>
          <Typography variant="body2" sx={{ color: G[500] }}>
            Menu change history will appear here once updates are made
          </Typography>
        </Paper>
      )}

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleMenuClose(); handleEditDay(actionDay); }}>
          <ListItemIcon><EditIcon fontSize="small" sx={{ color: G[600] }} /></ListItemIcon>
          <ListItemText primary="Edit All Meals" />
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); handleCopyDay(actionDay); }}>
          <ListItemIcon><ContentCopyIcon fontSize="small" sx={{ color: G[600] }} /></ListItemIcon>
          <ListItemText primary="Copy to Another Day" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleMenuClose(); handleClearDay(actionDay); }}>
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
          <ListItemText primary="Clear All Meals" sx={{ color: '#ef4444' }} />
        </MenuItem>
      </Menu>

      {/* Edit Meal Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
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
            Edit {selectedDay} {selectedMeal !== 'all' ? selectedMeal : 'Menu'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedMeal === 'all' ? (
            <>
              {MEAL_TYPES.map((meal) => (
                <TextField
                  key={meal.id}
                  fullWidth
                  label={meal.label}
                  value={editForm[meal.id] || ''}
                  onChange={(e) => setEditForm({ ...editForm, [meal.id]: e.target.value })}
                  sx={{ mb: 2 }}
                  multiline
                  rows={2}
                  placeholder={`Enter ${meal.label} menu...`}
                  InputProps={{ sx: { borderRadius: 2, '& fieldset': { borderColor: G[200] } } }}
                  InputLabelProps={{ sx: { color: G[600] } }}
                />
              ))}
            </>
          ) : (
            <TextField
              fullWidth
              label={selectedMeal}
              value={editForm.value || ''}
              onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
              multiline
              rows={4}
              placeholder={`Enter ${selectedMeal} menu...`}
              InputProps={{ sx: { borderRadius: 2, '& fieldset': { borderColor: G[200] } } }}
              InputLabelProps={{ sx: { color: G[600] } }}
            />
          )}
        </DialogContent>
        <Divider sx={{ borderColor: G[100] }} />
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: G[600], border: `1px solid ${G[200]}`, px: 3, borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />}
            onClick={handleSaveMeal}
            sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] }, px: 3, borderRadius: 2 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Copy Day Dialog */}
      <Dialog 
        open={openCopyDialog} 
        onClose={() => setOpenCopyDialog(false)} 
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
            Copy Menu to Another Day
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography sx={{ color: G[600], mb: 2 }}>
            Copy menu from <strong>{selectedDay}</strong> to:
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Select Day</InputLabel>
            <Select
              value={copyTargetDay}
              onChange={(e) => setCopyTargetDay(e.target.value)}
              label="Select Day"
              sx={{ borderRadius: 2 }}
            >
              {DAYS.filter(day => day.id !== selectedDay).map((day) => (
                <MenuItem key={day.id} value={day.id}>{day.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <Divider sx={{ borderColor: G[100] }} />
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenCopyDialog(false)} sx={{ color: G[600], border: `1px solid ${G[200]}`, px: 3, borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCopyConfirm}
            sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] }, px: 3, borderRadius: 2 }}
          >
            Copy Menu
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

// History icon component
const HistoryIcon = ({ sx }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={sx}>
    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
  </svg>
);

export default WardenMess;