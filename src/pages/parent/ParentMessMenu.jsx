// pages/parent/ParentMessMenu.jsx (Complete working version)
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Avatar,
  Alert,
  Skeleton,
  Button,
  alpha,
  IconButton,
  Tooltip,
  Zoom,
  Fade
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  FreeBreakfast as BreakfastIcon,
  LunchDining as LunchIcon,
  DinnerDining as DinnerIcon,
  Schedule as ScheduleIcon,
  Today as TodayIcon,
  AccessTime as TimeIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import parentService from '../../services/parentService';
import ParentLayout from '../../components/Layout/ParentLayout';
import toast from 'react-hot-toast';
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';

const greenTheme = {
  primary: '#4caf50',
  primaryLight: '#81c784',
  primaryDark: '#388e3c',
  primarySoft: '#e8f5e9',
  textPrimary: '#1e3a1e',
  textSecondary: '#2e562e',
  textMuted: '#558855',
  bg: '#f0f7f0',
  bgLight: '#ffffff',
  border: '#c5e0c5',
  cardShadow: '0 4px 12px rgba(76, 175, 80, 0.1)',
  hoverShadow: '0 8px 24px rgba(76, 175, 80, 0.15)'
};

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: <BreakfastIcon />, defaultTime: '7:00 AM - 9:00 AM', color: '#4caf50' },
  { id: 'lunch', label: 'Lunch', icon: <LunchIcon />, defaultTime: '12:00 PM - 2:00 PM', color: '#2196f3' },
  { id: 'snacks', label: 'Evening Snacks', icon: <RestaurantIcon />, defaultTime: '4:00 PM - 5:00 PM', color: '#ff9800' },
  { id: 'dinner', label: 'Dinner', icon: <DinnerIcon />, defaultTime: '7:00 PM - 9:00 PM', color: '#9c27b0' }
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ParentMessMenu = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menu, setMenu] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [timings, setTimings] = useState({});
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [hasMenuData, setHasMenuData] = useState(true);

  const getEmptyMenu = () => {
    const empty = {};
    DAYS.forEach(day => {
      empty[day.toLowerCase()] = {
        breakfast: 'Not available',
        lunch: 'Not available',
        snacks: 'Not available',
        dinner: 'Not available'
      };
    });
    return empty;
  };

  const fetchMessMenu = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    try {
      const response = await parentService.getMessMenu();
      console.log('Menu response:', response);
      
      if (response.success) {
        const menuData = response.data;
        console.log('Menu data type:', Array.isArray(menuData) ? 'ARRAY' : 'OBJECT');
        
        let formattedMenu = {};
        
        // ✅ FIX: Convert array to object if needed
        if (Array.isArray(menuData) && menuData.length > 0) {
          menuData.forEach(item => {
            const dayKey = item.day?.toLowerCase();
            if (dayKey && item.meals) {
              formattedMenu[dayKey] = {
                breakfast: item.meals.breakfast || 'Not set',
                lunch: item.meals.lunch || 'Not set',
                snacks: item.meals.snacks || 'Not set',
                dinner: item.meals.dinner || 'Not set'
              };
            }
          });
          console.log('✅ Converted array to object:', formattedMenu);
          setHasMenuData(Object.keys(formattedMenu).length > 0);
          setMenu(formattedMenu);
        } 
        else if (menuData && typeof menuData === 'object' && !Array.isArray(menuData)) {
          const hasData = Object.keys(menuData).length > 0;
          setHasMenuData(hasData);
          setMenu(hasData ? menuData : getEmptyMenu());
        }
        else {
          setHasMenuData(false);
          setMenu(getEmptyMenu());
        }
        
        if (response.timings) {
          setTimings(response.timings);
        }
        
        if (!selectedDay) {
          const todayIndex = new Date().getDay();
          const dayIndex = todayIndex === 0 ? 6 : todayIndex - 1;
          setSelectedDay(DAYS[dayIndex]);
        }
      } else {
        throw new Error(response.message || 'Failed to load menu');
      }
    } catch (error) {
      console.error('Error fetching mess menu:', error);
      toast.error(error.message || 'Failed to load mess menu');
      setHasMenuData(false);
      setMenu(getEmptyMenu());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDay]);

  useEffect(() => {
    fetchMessMenu();
  }, [fetchMessMenu]);

  const handleRefresh = () => {
    fetchMessMenu(false);
    toast.success('Refreshing menu...');
  };

  const getMealContent = (day, mealType) => {
    const dayKey = day?.toLowerCase();
    const dayMenu = menu[dayKey];
    if (!dayMenu) return 'Not available';
    const meal = dayMenu[mealType];
    return meal && meal !== 'Not set' ? meal : 'Not available';
  };

  const getMealTime = (mealId) => {
    if (timings[mealId]) {
      return `${timings[mealId].start} - ${timings[mealId].end}`;
    }
    const meal = MEAL_TYPES.find(m => m.id === mealId);
    return meal ? meal.defaultTime : 'Not set';
  };

  const goToPreviousWeek = () => setCurrentWeekStart(subDays(currentWeekStart, 7));
  const goToNextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const isCurrentWeek = () => {
    const thisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    return currentWeekStart.toDateString() === thisWeek.toDateString();
  };

  if (loading) {
    return (
      <ParentLayout>
        <Container maxWidth="xl">
          <Box sx={{ py: 4 }}>
            <Skeleton variant="rectangular" height={100} sx={{ mb: 3, borderRadius: 2 }} />
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <Box sx={{ minHeight: '100vh', bgcolor: greenTheme.bg }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Zoom in timeout={500}>
            <Paper sx={{ p: 3, mb: 4, borderRadius: '24px', background: `linear-gradient(135deg, ${greenTheme.primaryDark} 0%, ${greenTheme.primary} 100%)`, color: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <RestaurantIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>Mess Menu</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Weekly meal schedule for your ward</Typography>
                  </Box>
                </Box>
                <Tooltip title="Refresh">
                  <IconButton onClick={handleRefresh} disabled={refreshing} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          </Zoom>

          {!hasMenuData && (
            <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3, borderRadius: '16px' }}>
              <Typography variant="body1" fontWeight={600}>No menu available</Typography>
              <Typography variant="body2">The mess menu hasn't been set up yet. Please contact the warden.</Typography>
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Button startIcon={<PrevIcon />} onClick={goToPreviousWeek} sx={{ color: greenTheme.primary }}>Previous Week</Button>
            <Typography variant="subtitle1" sx={{ color: greenTheme.textSecondary, fontWeight: 500 }}>
              {format(currentWeekStart, 'dd MMM yyyy')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'dd MMM yyyy')}
              {isCurrentWeek() && <Chip label="Current Week" size="small" sx={{ ml: 1, bgcolor: greenTheme.primarySoft, color: greenTheme.primary }} />}
            </Typography>
            <Button endIcon={<NextIcon />} onClick={goToNextWeek} disabled={!isCurrentWeek()} sx={{ color: greenTheme.primary }}>Next Week</Button>
          </Box>

          <Paper sx={{ p: 2, mb: 4, borderRadius: '16px', bgcolor: greenTheme.bgLight, border: `1px solid ${greenTheme.border}` }}>
            <Grid container spacing={1}>
              {DAYS.map((day) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={day}>
                  <Button fullWidth variant={selectedDay === day ? 'contained' : 'outlined'} onClick={() => setSelectedDay(day)} sx={{ py: 1.5, borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}>
                    {day}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: '20px', bgcolor: greenTheme.bgLight, border: `1px solid ${greenTheme.border}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <TodayIcon sx={{ color: greenTheme.primary }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: greenTheme.textPrimary }}>{selectedDay}</Typography>
                </Box>

                <Grid container spacing={2}>
                  {MEAL_TYPES.map((meal) => (
                    <Grid item xs={12} sm={6} key={meal.id}>
                      <Card sx={{ borderRadius: '16px', border: `1px solid ${greenTheme.border}`, height: '100%' }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar sx={{ bgcolor: greenTheme.primarySoft, color: meal.color }}>{meal.icon}</Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: greenTheme.textPrimary }}>{meal.label}</Typography>
                              <Typography variant="caption" sx={{ color: greenTheme.textMuted }}>{getMealTime(meal.id)}</Typography>
                            </Box>
                          </Box>
                          <Typography variant="body1" sx={{ color: greenTheme.textSecondary, lineHeight: 1.6 }}>
                            {getMealContent(selectedDay, meal.id)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: '20px', bgcolor: greenTheme.bgLight, border: `1px solid ${greenTheme.border}` }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: greenTheme.textPrimary, mb: 2 }}>Mess Timings</Typography>
                <Divider sx={{ mb: 2 }} />
                {MEAL_TYPES.map((meal) => (
                  <Box key={meal.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ bgcolor: alpha(meal.color, 0.1), width: 28, height: 28 }}>{meal.icon}</Avatar>
                      <Typography variant="body2" sx={{ color: greenTheme.textPrimary }}>{meal.label}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: greenTheme.textMuted }}>{getMealTime(meal.id)}</Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ mt: 3, p: 2, bgcolor: greenTheme.primarySoft, borderRadius: '16px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon sx={{ color: greenTheme.primary }} />
              <Typography variant="body2" sx={{ color: greenTheme.textSecondary }}>
                Menu is updated weekly. Timings may vary during holidays and special events.
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ParentLayout>
  );
};

export default ParentMessMenu;