import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
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
  Zoom
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  FreeBreakfast as BreakfastIcon,
  LunchDining as LunchIcon,
  DinnerDining as DinnerIcon,
  Today as TodayIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon
} from '@mui/icons-material';
import parentService from '../../services/parentService';
import toast from 'react-hot-toast';
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';

const G = {
  900: '#064e3b',
  800: '#065f46',
  700: '#047857',
  600: '#059669',
  500: '#10b981',
  400: '#34d399',
  300: '#6ee7b7',
  200: '#bbf7d0',
  100: '#d1fae5',
  50: '#ecfdf5',
};

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: <BreakfastIcon />, defaultTime: '7:00 AM - 9:00 AM', color: G[600] },
  { id: 'lunch', label: 'Lunch', icon: <LunchIcon />, defaultTime: '12:00 PM - 2:00 PM', color: '#2196f3' },
  { id: 'snacks', label: 'Evening Snacks', icon: <RestaurantIcon />, defaultTime: '4:00 PM - 5:00 PM', color: '#f59e0b' },
  { id: 'dinner', label: 'Dinner', icon: <DinnerIcon />, defaultTime: '7:00 PM - 9:00 PM', color: '#9c27b0' }
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ParentMessMenu = () => {
  const navigate = useNavigate();
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
        
        let formattedMenu = {};
        
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f0fdf4' }}>
        <CircularProgress sx={{ color: G[600] }} thickness={5} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0fdf4' }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
          color: 'white',
          py: 2,
          px: 3,
          boxShadow: '0 4px 20px rgba(6,95,70,0.2)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/parent/dashboard')}
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Mess Menu
            </Typography>
          </Box>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={refreshing} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      <Box sx={{ p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: '16px',
            border: '1.5px solid #d1fae5',
            bgcolor: '#fff',
            boxShadow: '0 4px 16px rgba(6,95,70,0.07)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: G[100],
                color: G[600],
                fontSize: '1.6rem',
                fontWeight: 700,
                border: `2px solid ${G[300]}`
              }}
            >
              <RestaurantIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" sx={{ color: G[600], letterSpacing: '0.12em', fontSize: '0.7rem', fontWeight: 600 }}>
                Weekly Schedule
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: G[800], lineHeight: 1.2, mb: 0.5 }}>
                Mess Menu
              </Typography>
              <Typography sx={{ color: G[500], fontSize: '0.85rem', mt: 0.3 }}>
                Weekly meal schedule for your ward
              </Typography>
            </Box>
          </Box>
        </Paper>

        {!hasMenuData && (
          <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3, borderRadius: '16px' }}>
            <Typography variant="body1" fontWeight={600}>No menu available</Typography>
            <Typography variant="body2">The mess menu hasn't been set up yet. Please contact the warden.</Typography>
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Button 
            startIcon={<PrevIcon />} 
            onClick={goToPreviousWeek} 
            sx={{ 
              color: G[600], 
              textTransform: 'none',
              borderRadius: '10px',
              '&:hover': { bgcolor: G[50] }
            }}
          >
            Previous Week
          </Button>
          <Typography variant="subtitle1" sx={{ color: G[700], fontWeight: 500 }}>
            {format(currentWeekStart, 'dd MMM yyyy')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'dd MMM yyyy')}
            {isCurrentWeek() && <Chip label="Current Week" size="small" sx={{ ml: 1, bgcolor: G[100], color: G[600], fontSize: '0.7rem' }} />}
          </Typography>
          <Button 
            endIcon={<NextIcon />} 
            onClick={goToNextWeek} 
            disabled={!isCurrentWeek()} 
            sx={{ 
              color: G[600], 
              textTransform: 'none',
              borderRadius: '10px',
              '&:hover': { bgcolor: G[50] }
            }}
          >
            Next Week
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: '16px',
            bgcolor: '#fff',
            border: '1.5px solid #d1fae5',
            boxShadow: '0 4px 16px rgba(6,95,70,0.07)'
          }}
        >
          <Grid container spacing={1}>
            {DAYS.map((day) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={day}>
                <Button
                  fullWidth
                  variant={selectedDay === day ? 'contained' : 'outlined'}
                  onClick={() => setSelectedDay(day)}
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    ...(selectedDay === day ? {
                      bgcolor: G[600],
                      '&:hover': { bgcolor: G[700] }
                    } : {
                      borderColor: G[200],
                      color: G[700],
                      '&:hover': { borderColor: G[400], bgcolor: G[50] }
                    })
                  }}
                >
                  {day}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                bgcolor: '#fff',
                border: '1.5px solid #d1fae5',
                boxShadow: '0 4px 16px rgba(6,95,70,0.07)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TodayIcon sx={{ color: G[600] }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: G[800] }}>{selectedDay}</Typography>
              </Box>

              <Grid container spacing={2}>
                {MEAL_TYPES.map((meal) => (
                  <Grid item xs={12} sm={6} key={meal.id}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: '16px',
                        border: '1px solid #d1fae5',
                        bgcolor: '#fff',
                        height: '100%',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-3px)', borderColor: G[400] }
                      }}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Avatar sx={{ bgcolor: G[100], color: meal.color }}>
                            {meal.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: G[800] }}>{meal.label}</Typography>
                            <Typography variant="caption" sx={{ color: G[500] }}>{getMealTime(meal.id)}</Typography>
                          </Box>
                        </Box>
                        <Typography variant="body1" sx={{ color: G[700], lineHeight: 1.6 }}>
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
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                bgcolor: '#fff',
                border: '1.5px solid #d1fae5',
                boxShadow: '0 4px 16px rgba(6,95,70,0.07)'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: G[800], mb: 2 }}>Mess Timings</Typography>
              <Divider sx={{ mb: 2, borderColor: G[100] }} />
              {MEAL_TYPES.map((meal) => (
                <Box key={meal.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: `1px solid ${G[100]}` }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ bgcolor: alpha(meal.color, 0.1), width: 28, height: 28 }}>
                      {meal.icon}
                    </Avatar>
                    <Typography variant="body2" sx={{ color: G[800], fontWeight: 500 }}>{meal.label}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: G[600] }}>{getMealTime(meal.id)}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: 2,
            bgcolor: G[50],
            borderRadius: '16px',
            border: '1px solid #d1fae5'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon sx={{ color: G[600], fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: G[600] }}>
              Menu is updated weekly. Timings may vary during holidays and special events.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ParentMessMenu;