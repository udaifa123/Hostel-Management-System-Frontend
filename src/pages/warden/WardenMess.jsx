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
  useTheme,
  Zoom,
  Fade,
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
  Print as PrintIcon,
  History as HistoryIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  EventNote as EventNoteIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

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
  { id: 'breakfast', label: 'Breakfast', icon: <BreakfastIcon />, time: '7:00 AM - 9:00 AM', color: '#4caf50' },
  { id: 'lunch', label: 'Lunch', icon: <LunchIcon />, time: '12:00 PM - 2:00 PM', color: '#2196f3' },
  { id: 'dinner', label: 'Dinner', icon: <DinnerIcon />, time: '7:00 PM - 9:00 PM', color: '#9c27b0' },
  { id: 'snacks', label: 'Evening Snacks', icon: <RestaurantIcon />, time: '5:00 PM - 6:00 PM', color: '#ff9800' }
];

const MESS_TIMINGS = {
  breakfast: { start: '07:00', end: '09:00' },
  lunch: { start: '12:00', end: '14:00' },
  snacks: { start: '17:00', end: '18:00' },
  dinner: { start: '19:00', end: '21:00' }
};

// ==================== Green & White Theme ====================
const theme = {
  // Background Colors
  bg: '#f0f7f0',           // Light mint background
  bgLight: '#ffffff',       // Pure white
  bgHover: '#e3f0e3',      // Light green hover
  
  // Card Colors
  cardBg: '#ffffff',        // White cards
  cardBorder: '#c5e0c5',    // Light green border
  
  // Primary Colors - Green
  primary: '#4caf50',       // Medium green
  primaryLight: '#81c784',  // Light green
  primaryDark: '#388e3c',   // Dark green
  primarySoft: '#e8f5e9',   // Very light green background
  
  // Status Colors
  success: '#66bb6a',       // Soft green
  successLight: '#e8f5e9',
  warning: '#ffb74d',       // Soft orange
  warningLight: '#fff3e0',
  error: '#ef5350',         // Soft red
  errorLight: '#ffebee',
  info: '#64b5f6',          // Soft blue
  infoLight: '#e3f2fd',
  
  // Text Colors
  textPrimary: '#1e3a1e',   // Dark green
  textSecondary: '#2e562e', // Medium green
  textMuted: '#558855',     // Light green-gray
  
  // Borders
  border: '#c5e0c5',        // Light green border
  borderLight: '#d8ebd8',   // Very light green border
  
  // Shadows
  cardShadow: '0 4px 12px rgba(76, 175, 80, 0.1)',
  hoverShadow: '0 8px 24px rgba(76, 175, 80, 0.15)',
  
  // Border Radius
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '24px'
  }
};

// ==================== Styled Components ====================
const MealCard = ({ meal, data, onEdit, icon, color }) => (
  <Card
    sx={{
      bgcolor: theme.bgLight,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.border}`,
      boxShadow: theme.cardShadow,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.hoverShadow,
        borderColor: theme.primary
      }
    }}
  >
    <CardContent>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar sx={{ bgcolor: alpha(theme.primary, 0.1), color: theme.primary }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ color: theme.textPrimary, fontWeight: 600 }}>
            {meal.label}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.textMuted }}>
            {meal.time}
          </Typography>
        </Box>
      </Box>

      <Typography variant="body1" sx={{ color: theme.textPrimary, mb: 2, minHeight: '60px' }}>
        {data || 'Not set'}
      </Typography>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={() => onEdit(meal.id)}
        sx={{
          color: theme.primary,
          borderColor: alpha(theme.primary, 0.3),
          '&:hover': {
            borderColor: theme.primary,
            bgcolor: alpha(theme.primary, 0.05)
          }
        }}
      >
        Edit {meal.label}
      </Button>
    </CardContent>
  </Card>
);

const DayCard = ({ day, menu, onEditDay, onCopyDay, onClearDay, stats }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const getMealCount = () => {
    let count = 0;
    MEAL_TYPES.forEach(meal => {
      if (menu[meal.id] && menu[meal.id] !== 'Not set' && menu[meal.id] !== '') count++;
    });
    return count;
  };

  return (
    <Card
      sx={{
        bgcolor: theme.bgLight,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.cardShadow,
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.hoverShadow,
          borderColor: theme.primary
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: alpha(theme.primary, 0.1), color: theme.primary }}>
              {day.icon}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ color: theme.textPrimary, fontWeight: 700 }}>
                {day.label}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.textMuted }}>
                {getMealCount()}/4 meals set
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <Badge badgeContent={stats?.special || 0} color="warning">
              <IconButton size="small" onClick={handleMenuOpen} sx={{ color: theme.textPrimary }}>
                <MoreVertIcon />
              </IconButton>
            </Badge>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {MEAL_TYPES.map((meal) => (
            <Grid item xs={12} key={meal.id}>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                p={1}
                sx={{
                  bgcolor: theme.bg,
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: theme.bgHover,
                    borderColor: theme.primary
                  }
                }}
                onClick={() => onEditDay(day.id, meal.id)}
              >
                <Avatar sx={{ bgcolor: alpha(meal.color, 0.1), color: meal.color, width: 32, height: 32 }}>
                  {meal.icon}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="body2" sx={{ color: theme.textPrimary, fontWeight: 500 }}>
                    {meal.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.textMuted }}>
                    {menu[meal.id] || 'Not set'}
                  </Typography>
                </Box>
                <Chip
                  label={meal.time.split(' ')[0]}
                  size="small"
                  sx={{
                    bgcolor: alpha(meal.color, 0.1),
                    color: meal.color,
                    fontSize: '0.65rem'
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" gap={1} mt={2}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<CopyDayIcon />}
            onClick={() => onCopyDay(day.id)}
            sx={{ 
              color: theme.info, 
              borderColor: alpha(theme.info, 0.3),
              '&:hover': {
                borderColor: theme.info,
                bgcolor: alpha(theme.info, 0.05)
              },
              flex: 1
            }}
          >
            Copy
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={() => onClearDay(day.id)}
            sx={{ 
              color: theme.error, 
              borderColor: alpha(theme.error, 0.3),
              '&:hover': {
                borderColor: theme.error,
                bgcolor: alpha(theme.error, 0.05)
              },
              flex: 1
            }}
          >
            Clear
          </Button>
        </Box>
      </CardContent>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleMenuClose(); onEditDay(day.id, 'all'); }}>
          <ListItemIcon><EditIcon fontSize="small" sx={{ color: theme.primary }} /></ListItemIcon>
          <ListItemText sx={{ color: theme.textPrimary }}>Edit All Meals</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); onCopyDay(day.id); }}>
          <ListItemIcon><CopyDayIcon fill={theme.info} /></ListItemIcon>
          <ListItemText sx={{ color: theme.textPrimary }}>Copy to Another Day</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleMenuClose(); onClearDay(day.id); }}>
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: theme.error }} /></ListItemIcon>
          <ListItemText sx={{ color: theme.error }}>Clear All Meals</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};

// Icons
const CopyDayIcon = ({ fill }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={fill || theme.info}>
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>
);

const ClearIcon = ({ fill }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={fill || theme.error}>
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

// ==================== Main Component ====================
const WardenMess = () => {
  const muiTheme = useTheme();
  const { token } = useAuth();
  
  // ==================== State ====================
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState({});
  const [menuHistory, setMenuHistory] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalMeals: 0,
    specialMeals: 0,
    upcomingChanges: 0,
    lastUpdated: null
  });

  // ==================== Fetch Data ====================
  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/mess/menu`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const menuData = response.data.data || response.data.menu || response.data;
      
      if (menuData && Object.keys(menuData).length > 0) {
        setMenu(menuData);
        calculateStats(menuData);
      } else {
        // Initialize with empty menu
        const initialMenu = {};
        DAYS.forEach(day => {
          initialMenu[day.id] = {};
          MEAL_TYPES.forEach(meal => {
            initialMenu[day.id][meal.id] = '';
          });
        });
        setMenu(initialMenu);
      }
      
      showSnackbar('Menu loaded successfully', 'success');
    } catch (error) {
      console.error('Error fetching menu:', error);
      showSnackbar(error.response?.data?.message || 'Failed to load menu', 'error');
      
      // Load dummy data for testing
      loadDummyData();
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchMenuHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/mess/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMenuHistory(response.data.data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  }, [token]);

  const loadDummyData = () => {
    const dummyMenu = {
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
    setMenu(dummyMenu);
    calculateStats(dummyMenu);
  };

  const calculateStats = (menuData) => {
    let total = 0;
    let special = 0;
    
    Object.values(menuData).forEach(day => {
      Object.values(day).forEach(meal => {
        if (meal && meal !== '') total++;
        if (meal && (meal.includes('Special') || meal.includes('Paneer'))) special++;
      });
    });

    setStats({
      totalMeals: total,
      specialMeals: special,
      upcomingChanges: 3,
      lastUpdated: new Date().toISOString()
    });
  };

  useEffect(() => {
    if (token) {
      fetchMenu();
      fetchMenuHistory();
    }
  }, [token, fetchMenu, fetchMenuHistory]);

  // ==================== Handlers ====================
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEditMeal = (dayId, mealId) => {
    setSelectedDay(dayId);
    setSelectedMeal(mealId);
    setEditForm({ value: menu[dayId]?.[mealId] || '' });
    setOpenDialog(true);
  };

  const handleEditDay = (dayId, mealId = 'all') => {
    if (mealId === 'all') {
      setSelectedDay(dayId);
      setSelectedMeal('all');
      setEditForm({ ...menu[dayId] });
    } else {
      handleEditMeal(dayId, mealId);
    }
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

      await axios.post(
        `${API_URL}/mess/update`,
        { day: selectedDay, meal: selectedMeal, value: editForm.value, menu: updatedMenu },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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

  const handleCopyConfirm = async (targetDay) => {
    try {
      const updatedMenu = { ...menu };
      updatedMenu[targetDay] = { ...menu[selectedDay] };

      await axios.post(
        `${API_URL}/mess/copy`,
        { sourceDay: selectedDay, targetDay },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMenu(updatedMenu);
      calculateStats(updatedMenu);
      showSnackbar(`Menu copied from ${selectedDay} to ${targetDay}`, 'success');
      setOpenCopyDialog(false);
      setSelectedDay(null);
    } catch (error) {
      console.error('Error copying menu:', error);
      showSnackbar(error.response?.data?.message || 'Failed to copy menu', 'error');
    }
  };

  const handleClearDay = async (dayId) => {
    if (!window.confirm(`Are you sure you want to clear all meals for ${dayId}?`)) return;

    try {
      const updatedMenu = { ...menu };
      updatedMenu[dayId] = {};
      MEAL_TYPES.forEach(meal => {
        updatedMenu[dayId][meal.id] = '';
      });

      await axios.post(
        `${API_URL}/mess/clear`,
        { day: dayId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMenu(updatedMenu);
      calculateStats(updatedMenu);
      showSnackbar(`Menu cleared for ${dayId}`, 'success');
    } catch (error) {
      console.error('Error clearing menu:', error);
      showSnackbar(error.response?.data?.message || 'Failed to clear menu', 'error');
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
  };

  // ==================== Render ====================
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: theme.primary }} />
        <Typography ml={2} sx={{ color: theme.textPrimary }}>Loading menu...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: theme.bg, minHeight: '100vh' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ color: theme.textPrimary, fontWeight: 800, mb: 1 }}>
            Mess Menu Management
          </Typography>
          <Typography variant="body1" sx={{ color: theme.textMuted }}>
            Update and manage weekly mess menu for students
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchMenu} sx={{ 
              color: theme.primary,
              bgcolor: alpha(theme.primary, 0.1),
              '&:hover': { bgcolor: alpha(theme.primary, 0.2) }
            }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export Menu">
            <IconButton onClick={handleExportMenu} sx={{ 
              color: theme.primary,
              bgcolor: alpha(theme.primary, 0.1),
              '&:hover': { bgcolor: alpha(theme.primary, 0.2) }
            }}>
              <ExportIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              bgcolor: theme.primary,
              color: 'white',
              '&:hover': { bgcolor: theme.primaryDark }
            }}
          >
            Publish Menu
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: theme.bgLight, borderRadius: theme.borderRadius.lg, boxShadow: theme.cardShadow }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: alpha(theme.primary, 0.1), color: theme.primary }}>
                  <RestaurantIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: theme.textMuted }}>Total Meals</Typography>
                  <Typography variant="h4" sx={{ color: theme.textPrimary, fontWeight: 700 }}>
                    {stats.totalMeals}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: theme.bgLight, borderRadius: theme.borderRadius.lg, boxShadow: theme.cardShadow }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: alpha(theme.warning, 0.1), color: theme.warning }}>
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: theme.textMuted }}>Special Meals</Typography>
                  <Typography variant="h4" sx={{ color: theme.textPrimary, fontWeight: 700 }}>
                    {stats.specialMeals}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: theme.bgLight, borderRadius: theme.borderRadius.lg, boxShadow: theme.cardShadow }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: alpha(theme.info, 0.1), color: theme.info }}>
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: theme.textMuted }}>Upcoming Changes</Typography>
                  <Typography variant="h4" sx={{ color: theme.textPrimary, fontWeight: 700 }}>
                    {stats.upcomingChanges}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: theme.bgLight, borderRadius: theme.borderRadius.lg, boxShadow: theme.cardShadow }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: alpha(theme.success, 0.1), color: theme.success }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: theme.textMuted }}>Last Updated</Typography>
                  <Typography variant="body2" sx={{ color: theme.textPrimary }}>
                    {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : 'Today'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        sx={{
          mb: 3,
          '& .MuiTab-root': { color: theme.textMuted },
          '& .Mui-selected': { color: theme.primary },
          '& .MuiTabs-indicator': { backgroundColor: theme.primary }
        }}
      >
        <Tab label="Weekly Menu" />
        <Tab label="Meal Times" />
        <Tab label="Special Requests" />
        <Tab label="History" />
      </Tabs>

      {/* Weekly Menu View */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {DAYS.map((day) => (
            <Grid item xs={12} md={6} lg={4} key={day.id}>
              <DayCard
                day={day}
                menu={menu[day.id] || {}}
                onEditDay={handleEditDay}
                onCopyDay={handleCopyDay}
                onClearDay={handleClearDay}
                stats={stats}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Meal Times View */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3, bgcolor: theme.bgLight, borderRadius: theme.borderRadius.lg }}>
          <Typography variant="h6" sx={{ color: theme.primary, mb: 3 }}>Mess Timings</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: theme.textPrimary }}>Meal</TableCell>
                  <TableCell sx={{ color: theme.textPrimary }}>Start Time</TableCell>
                  <TableCell sx={{ color: theme.textPrimary }}>End Time</TableCell>
                  <TableCell sx={{ color: theme.textPrimary }}>Duration</TableCell>
                  <TableCell align="right">Actions</TableCell>
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
                        <Typography sx={{ color: theme.textPrimary }}>{meal.label}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={MESS_TIMINGS[meal.id]?.start || '07:00'}
                        size="small"
                        sx={{ bgcolor: alpha(theme.success, 0.1), color: theme.success }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={MESS_TIMINGS[meal.id]?.end || '09:00'}
                        size="small"
                        sx={{ bgcolor: alpha(theme.error, 0.1), color: theme.error }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: theme.textPrimary }}>
                        {MESS_TIMINGS[meal.id] ? 
                          `${Math.abs(
                            parseInt(MESS_TIMINGS[meal.id].end.split(':')[0]) - 
                            parseInt(MESS_TIMINGS[meal.id].start.split(':')[0])
                          )} hours` : '2 hours'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" sx={{ color: theme.primary }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Special Requests View */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3, bgcolor: theme.bgLight, borderRadius: theme.borderRadius.lg }}>
          <Typography variant="h6" sx={{ color: theme.primary, mb: 3 }}>Special Meal Requests</Typography>
          <Typography sx={{ color: theme.textMuted, textAlign: 'center', py: 4 }}>
            No special requests pending
          </Typography>
        </Paper>
      )}

      {/* History View */}
      {tabValue === 3 && (
        <Paper sx={{ p: 3, bgcolor: theme.bgLight, borderRadius: theme.borderRadius.lg }}>
          <Typography variant="h6" sx={{ color: theme.primary, mb: 3 }}>Menu Change History</Typography>
          {menuHistory.length === 0 ? (
            <Typography sx={{ color: theme.textMuted, textAlign: 'center', py: 4 }}>
              No history available
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: theme.textPrimary }}>Date</TableCell>
                    <TableCell sx={{ color: theme.textPrimary }}>Day</TableCell>
                    <TableCell sx={{ color: theme.textPrimary }}>Meal</TableCell>
                    <TableCell sx={{ color: theme.textPrimary }}>Old Value</TableCell>
                    <TableCell sx={{ color: theme.textPrimary }}>New Value</TableCell>
                    <TableCell sx={{ color: theme.textPrimary }}>Changed By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menuHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography sx={{ color: theme.textPrimary }}>
                          {new Date(item.date).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: theme.textPrimary, textTransform: 'capitalize' }}>{item.day}</TableCell>
                      <TableCell sx={{ color: theme.textPrimary, textTransform: 'capitalize' }}>{item.meal}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.oldValue || 'Empty'}
                          size="small"
                          sx={{ bgcolor: alpha(theme.error, 0.1), color: theme.error }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.newValue || 'Empty'}
                          size="small"
                          sx={{ bgcolor: alpha(theme.success, 0.1), color: theme.success }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: theme.textPrimary }}>{item.changedBy || 'Warden'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Edit Meal Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            bgcolor: theme.bgLight,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.border}`
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ color: theme.textPrimary, textTransform: 'capitalize' }}>
            Edit {selectedDay} {selectedMeal !== 'all' ? selectedMeal : 'Menu'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {selectedMeal === 'all' ? (
              // Edit all meals for the day
              <>
                {MEAL_TYPES.map((meal) => (
                  <TextField
                    key={meal.id}
                    fullWidth
                    label={meal.label}
                    value={editForm[meal.id] || ''}
                    onChange={(e) => setEditForm({ ...editForm, [meal.id]: e.target.value })}
                    sx={{ mb: 2 }}
                    InputProps={{
                      sx: { color: theme.textPrimary }
                    }}
                    InputLabelProps={{ sx: { color: theme.textMuted } }}
                    multiline
                    rows={2}
                    placeholder={`Enter ${meal.label} menu...`}
                  />
                ))}
              </>
            ) : (
              // Edit single meal
              <TextField
                fullWidth
                label={selectedMeal}
                value={editForm.value || ''}
                onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                InputProps={{
                  sx: { color: theme.textPrimary }
                }}
                InputLabelProps={{ sx: { color: theme.textMuted } }}
                multiline
                rows={4}
                placeholder={`Enter ${selectedMeal} menu...`}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: theme.textMuted }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveMeal}
            sx={{ bgcolor: theme.primary, color: 'white', '&:hover': { bgcolor: theme.primaryDark } }}
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
            bgcolor: theme.bgLight,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.border}`
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ color: theme.textPrimary }}>
            Copy Menu to Another Day
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: theme.textMuted, mb: 2 }}>
            Copy menu from {selectedDay} to:
          </Typography>
          <Grid container spacing={2}>
            {DAYS.filter(day => day.id !== selectedDay).map((day) => (
              <Grid item xs={6} key={day.id}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleCopyConfirm(day.id)}
                  sx={{
                    color: theme.textPrimary,
                    borderColor: alpha(theme.primary, 0.3),
                    textTransform: 'capitalize',
                    '&:hover': {
                      borderColor: theme.primary,
                      bgcolor: alpha(theme.primary, 0.05)
                    }
                  }}
                >
                  {day.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCopyDialog(false)} sx={{ color: theme.textMuted }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Fade}
      >
        <Alert 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ 
            borderRadius: theme.borderRadius.md,
            bgcolor: snackbar.severity === 'success' ? theme.success : theme.error,
            color: 'white'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WardenMess;