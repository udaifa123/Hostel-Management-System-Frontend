import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  AccessTime as LateIcon,
  CalendarToday as CalendarIcon,
  EventBusy as HolidayIcon,
  FreeBreakfast as HalfDayIcon,
  BeachAccess as LeaveIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Timeline as TimelineIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import studentService from "../../services/studentService";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, parseISO } from 'date-fns';


const theme = {
  bg: '#f8fafc',           
  bgLight: '#ffffff',       
  bgHover: '#f1f5f9',      
  
  cardBg: '#ffffff',        
  cardBorder: '#e2e8f0',   
  

  primary: '#059669',       
  primaryDark: '#047857',  
  primarySoft: '#ecfdf5',  
  
 
  present: '#10b981',       
  presentLight: '#d1fae5',
  absent: '#ef4444',        
  absentLight: '#fee2e2',
  late: '#f59e0b',          
  lateLight: '#fef3c7',
  halfDay: '#3b82f6',      
  halfDayLight: '#dbeafe',
  holiday: '#8b5cf6',       
  holidayLight: '#ede9fe',
  leave: '#ec4899',        
  leaveLight: '#fce7f3',
  

  textPrimary: '#0f172a',   
  textSecondary: '#475569', 
  textMuted: '#64748b',     

  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  
 
  primaryGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  successGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  warningGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  errorGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  
 
  cardShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  hoverShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  
 
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  },
  

  fontPrimary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSecondary: "'SF Pro Display', 'Inter', 'Segoe UI', sans-serif",
};


const StyledPaper = styled(Paper)(({ theme: muiTheme }) => ({
  padding: muiTheme.spacing(3),
  margin: muiTheme.spacing(2),
  background: theme.cardBg,
  borderRadius: theme.borderRadius.xl,
  border: `1px solid ${theme.border}`,
  boxShadow: theme.cardShadow,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.hoverShadow,
    borderColor: theme.primaryLight
  }
}));

const StatCard = styled(Card)(({ gradient }) => ({
  height: '100%',
  background: gradient || theme.primaryGradient,
  borderRadius: theme.borderRadius.xl,
  border: `1px solid ${theme.border}`,
  boxShadow: theme.cardShadow,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.8), transparent 50%)',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.hoverShadow,
    '&::before': {
      opacity: 1
    }
  }
}));

const StatusChip = styled(Chip)(({ statuscolor }) => ({
  background: alpha(statuscolor, 0.1),
  color: statuscolor,
  border: `1px solid ${alpha(statuscolor, 0.2)}`,
  fontWeight: 600,
  fontSize: '0.75rem',
  borderRadius: theme.borderRadius.md,
  '& .MuiChip-icon': {
    color: statuscolor
  },
  '&:hover': {
    background: alpha(statuscolor, 0.15)
  }
}));

const TableHeaderCell = styled(TableCell)({
  backgroundColor: theme.bgLight,
  color: theme.textPrimary,
  fontWeight: 700,
  fontSize: '0.85rem',
  borderBottom: `2px solid ${theme.primary}`,
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
});

const TableBodyCell = styled(TableCell)({
  color: theme.textSecondary,
  borderBottom: `1px solid ${theme.borderLight}`,
  fontSize: '0.9rem'
});

const GradientButton = styled(Button)(({ gradient = theme.primaryGradient }) => ({
  background: gradient,
  color: 'white',
  borderRadius: theme.borderRadius.lg,
  padding: '8px 20px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.9rem',
  boxShadow: '0 4px 6px -1px rgba(5,150,105,0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgba(5,150,105,0.3)',
    filter: 'brightness(1.05)'
  },
  '&:active': {
    transform: 'translateY(0)'
  }
}));

const CalendarCell = styled(Box)(({ statuscolor, iscurrentmonth }) => ({
  padding: '8px',
  textAlign: 'center',
  background: statuscolor ? alpha(statuscolor, 0.1) : 'transparent',
  borderRadius: theme.borderRadius.lg,
  border: statuscolor ? `1px solid ${alpha(statuscolor, 0.2)}` : '1px solid transparent',
  opacity: iscurrentmonth ? 1 : 0.5,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 4px 12px ${alpha(statuscolor || theme.textMuted, 0.2)}`,
    background: statuscolor ? alpha(statuscolor, 0.15) : theme.bgHover
  }
}));


const generateMockAttendance = (month, year) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const records = [];

  const statuses = [
    'present','present','present','present','present',
    'late','absent','half-day','holiday','leave'
  ];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);

    if (date > new Date()) continue;

    const status = statuses[Math.floor(Math.random() * statuses.length)];

    records.push({
      date: date.toISOString(),
      status,
      remarks:
        status === 'present' ? 'On time' :
        status === 'late' ? 'Late' :
        status === 'absent' ? 'Absent' :
        status === 'half-day' ? 'Half Day' :
        status === 'holiday' ? 'Holiday' :
        status === 'leave' ? 'Leave' : '',
      markedBy: { name: 'Faculty' }
    });
  }

  return records;
};

const StudentAttendance = () => {
  const muiTheme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
  if (availableMonths.length > 0) {
    setSelectedMonth(availableMonths[availableMonths.length - 1]);
  }
}, [availableMonths]);
  
  
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    holiday: 0,
    leave: 0,
    percentage: 0
  });

  useEffect(() => {
  generateAvailableMonths();
  fetchAttendanceData();
}, []);

 useEffect(() => {
  fetchAttendanceData();
}, [selectedMonth]);

  const generateAvailableMonths = () => {
    const months = [];
    const currentDate = new Date();
    
   
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push(date);
    }
    
    setAvailableMonths(months);
  };

  const loadMockData = () => {
    setLoading(true);
    
    
    setTimeout(() => {
      try {
        const month = selectedMonth.getMonth();
        const year = selectedMonth.getFullYear();
        
        console.log(`Loading mock attendance for ${format(selectedMonth, 'MMMM yyyy')}...`);
        
        
        const mockData = generateMockAttendance(month, year);
        
        processAttendanceData(mockData);
        setError(null);
      } catch (err) {
        console.error('Error loading mock data:', err);
        setError('Failed to load attendance data');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, 800);
  };

const fetchAttendanceData = async () => {
  try {
    setRefreshing(true);
    setError(null);

    
    const month = selectedMonth.getMonth() + 1;
    const year = selectedMonth.getFullYear();

    const data = await studentService.getAttendance(month, year);

    console.log("Attendance API:", data);

    if (!data || data.length === 0) {
    
      const mock = generateMockAttendance(month - 1, year);
      processAttendanceData(mock);
    } else {
      processAttendanceData(data);
    }

  } catch (err) {
    console.error(err);

    const mock = generateMockAttendance(
      selectedMonth.getMonth(),
      selectedMonth.getFullYear()
    );
    processAttendanceData(mock);

    setError("Using demo data (API failed)");
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  const processAttendanceData = (data) => {
    let records = [];
    
    if (Array.isArray(data)) {
      records = data;
    } else if (data?.records) {
      records = data.records;
    } else if (data?.data) {
      records = data.data;
    }

    setAttendanceRecords(records);
    calculateStats(records);
  };

  const calculateStats = (records) => {
    const stats = {
      totalDays: records.length,
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      holiday: 0,
      leave: 0,
      percentage: 0
    };

    records.forEach(record => {
      const status = record.status?.toLowerCase();
      switch(status) {
        case 'present': stats.present++; break;
        case 'absent': stats.absent++; break;
        case 'late': stats.late++; break;
        case 'half-day': stats.halfDay++; break;
        case 'holiday': stats.holiday++; break;
        case 'leave': stats.leave++; break;
        default: break;
      }
    });

    const workingDays = records.filter(r => 
      !['holiday', 'leave'].includes(r.status?.toLowerCase())
    ).length;
    
    const presentDays = stats.present + (stats.halfDay * 0.5);
    stats.percentage = workingDays > 0 
      ? Math.round((presentDays / workingDays) * 100) 
      : 0;

    setAttendanceStats(stats);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(new Date(event.target.value));
  };

  const handleRefresh = () => {
    fetchAttendanceData();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return theme.present;
      case 'absent': return theme.absent;
      case 'late': return theme.late;
      case 'half-day': return theme.halfDay;
      case 'holiday': return theme.holiday;
      case 'leave': return theme.leave;
      default: return theme.textMuted;
    }
  };

  const getStatusIcon = (status) => {
    const color = getStatusColor(status);
    switch (status?.toLowerCase()) {
      case 'present':
        return <PresentIcon sx={{ color, fontSize: 16 }} />;
      case 'absent':
        return <AbsentIcon sx={{ color, fontSize: 16 }} />;
      case 'late':
        return <LateIcon sx={{ color, fontSize: 16 }} />;
      case 'half-day':
        return <HalfDayIcon sx={{ color, fontSize: 16 }} />;
      case 'holiday':
        return <HolidayIcon sx={{ color, fontSize: 16 }} />;
      case 'leave':
        return <LeaveIcon sx={{ color, fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
  try {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid';
    return format(date, 'dd MMM yyyy');
  } catch {
    return 'Invalid';
  }
};

  const formatDay = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      return format(date, 'EEEE');
    } catch {
      return dateString;
    }
  };

 const getMonthDays = () => {
  const start = startOfMonth(selectedMonth);
  const end = endOfMonth(selectedMonth);

  const days = eachDayOfInterval({ start, end });

  const startDay = start.getDay();
 
  const blanks = Array(startDay).fill(null);

  return [...blanks, ...days];
};
  const getAttendanceForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return attendanceRecords.find(record => {
      const recordDate = record.date 
        ? format(typeof record.date === 'string' ? parseISO(record.date) : new Date(record.date), 'yyyy-MM-dd')
        : null;
      return recordDate === dateStr;
    });
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: theme.bg }}
      >
        <Card sx={{ 
          p: 5, 
          textAlign: 'center', 
          maxWidth: 400,
          background: theme.cardBg,
          borderRadius: theme.borderRadius.xl,
          border: `1px solid ${theme.border}`
        }}>
          <CircularProgress size={60} thickness={4} sx={{ color: theme.primary, mb: 3 }} />
          <Typography variant="h6" sx={{ color: theme.textPrimary, fontWeight: 600, mb: 2 }}>
            Loading Attendance Data
          </Typography>
          <LinearProgress 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              background: alpha(theme.primary, 0.1),
              '& .MuiLinearProgress-bar': {
                background: theme.primaryGradient,
                borderRadius: 3
              }
            }} 
          />
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.bg,
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>

      <StyledPaper elevation={0}>
        {/* Header */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={4}
          className="fade-in"
        >
          <Box>
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.primary,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                mb: 1,
                display: 'block'
              }}
            >
              Attendance Management
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: theme.textPrimary,
                fontFamily: theme.fontSecondary
              }}
            >
              Attendance Overview
            </Typography>
            <Typography variant="body2" sx={{ color: theme.textMuted, mt: 0.5 }}>
              Track your daily attendance and performance
            </Typography>
          </Box>
          
          <Box display="flex" gap={2} alignItems="center">
            <FormControl 
              sx={{ 
                minWidth: 220,
                '& .MuiOutlinedInput-root': {
                  color: theme.textPrimary,
                  '& fieldset': {
                    borderColor: theme.border
                  },
                  '&:hover fieldset': {
                    borderColor: theme.primary
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.primary
                  }
                },
                '& .MuiInputLabel-root': {
                  color: theme.textMuted
                },
                '& .MuiSvgIcon-root': {
                  color: theme.textMuted
                }
              }}
              size="small"
            >
              <InputLabel>Select Month</InputLabel>
              <Select
                value={selectedMonth.toISOString()}
                onChange={handleMonthChange}
                label="Select Month"
                startAdornment={
                  <CalendarIcon sx={{ mr: 1, color: theme.primary }} />
                }
              >
                {availableMonths.map((month) => (
                  <MenuItem key={month.toISOString()} value={month.toISOString()}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <DateRangeIcon fontSize="small" sx={{ color: theme.primary }} />
                      {format(month, 'MMMM yyyy')}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Tooltip title="Refresh" arrow>
              <IconButton 
                onClick={handleRefresh} 
                disabled={refreshing}
                sx={{
                  bgcolor: theme.bgLight,
                  border: `1px solid ${theme.border}`,
                  color: theme.textMuted,
                  width: 45,
                  height: 45,
                  '&:hover': {
                    borderColor: theme.primary,
                    color: theme.primary,
                    transform: 'rotate(180deg)'
                  },
                  transition: 'all 0.5s ease'
                }}
              >
                <RefreshIcon sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

       
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: theme.borderRadius.lg,
              background: alpha(theme.absent, 0.1),
              color: theme.absent,
              border: `1px solid ${alpha(theme.absent, 0.2)}`,
              '& .MuiAlert-icon': {
                color: theme.absent
              }
            }}
            onClose={() => setError(null)}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={loadMockData}
                sx={{ color: theme.absent }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

      
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard gradient="linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)">
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" sx={{ color: theme.textMuted, fontWeight: 500 }}>
                      Total Days
                    </Typography>
                    <CalendarIcon sx={{ color: theme.primary }} />
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="700" sx={{ color: theme.textPrimary }}>
                    {attendanceStats.totalDays}
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.textMuted, mt: 1, display: 'block' }}>
                    in {format(selectedMonth, 'MMMM yyyy')}
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)">
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" sx={{ color: alpha(theme.bgLight, 0.9), fontWeight: 500 }}>
                      Present
                    </Typography>
                    <PresentIcon sx={{ color: theme.bgLight }} />
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="700" sx={{ color: theme.bgLight }}>
                    {attendanceStats.present}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <TrendingUpIcon sx={{ color: alpha(theme.bgLight, 0.9), fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: alpha(theme.bgLight, 0.9) }}>
                      {attendanceStats.present > 0 ? `${Math.round((attendanceStats.present / attendanceStats.totalDays) * 100)}%` : '0%'}
                    </Typography>
                  </Box>
                </CardContent>
              </StatCard>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" sx={{ color: alpha(theme.bgLight, 0.9), fontWeight: 500 }}>
                      Absent
                    </Typography>
                    <AbsentIcon sx={{ color: theme.bgLight }} />
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="700" sx={{ color: theme.bgLight }}>
                    {attendanceStats.absent}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <WarningIcon sx={{ color: alpha(theme.bgLight, 0.9), fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: alpha(theme.bgLight, 0.9) }}>
                      {attendanceStats.absent > 0 ? `${Math.round((attendanceStats.absent / attendanceStats.totalDays) * 100)}%` : '0%'}
                    </Typography>
                  </Box>
                </CardContent>
              </StatCard>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" sx={{ color: alpha(theme.bgLight, 0.9), fontWeight: 500 }}>
                      Late/Others
                    </Typography>
                    <LateIcon sx={{ color: theme.bgLight }} />
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="700" sx={{ color: theme.bgLight }}>
                    {attendanceStats.late + attendanceStats.halfDay + attendanceStats.leave}
                  </Typography>
                  <Typography variant="caption" sx={{ color: alpha(theme.bgLight, 0.9), mt: 1, display: 'block' }}>
                    Late: {attendanceStats.late} • Half: {attendanceStats.halfDay} • Leave: {attendanceStats.leave}
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
          </Grid>
        </Box>

       
        <Box sx={{ mb: 4 }}>
          <Paper sx={{ 
            p: 4, 
            background: theme.bgLight,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.borderRadius.xl
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" alignItems="center" gap={2}>
                <TimelineIcon sx={{ color: theme.primary, fontSize: 28 }} />
                <Typography variant="h6" sx={{ color: theme.textPrimary, fontWeight: 600 }}>
                  Attendance Percentage
                </Typography>
              </Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  color: attendanceStats.percentage >= 75 ? theme.present : theme.late,
                  fontWeight: 700,
                  fontFamily: theme.fontSecondary
                }}
              >
                {attendanceStats.percentage}%
              </Typography>
            </Box>
            
            <Box sx={{ width: '100%' }}>
              <LinearProgress 
                variant="determinate" 
                value={attendanceStats.percentage} 
                sx={{ 
                  height: 12, 
                  borderRadius: 6,
                  bgcolor: alpha(theme.textMuted, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 6,
                    background: attendanceStats.percentage >= 75 
                      ? `linear-gradient(90deg, ${theme.present}, ${alpha(theme.present, 0.8)})`
                      : `linear-gradient(90deg, ${theme.late}, ${alpha(theme.late, 0.8)})`
                  }
                }}
              />
            </Box>
            
            {attendanceStats.percentage < 75 ? (
              <Alert 
                severity="warning" 
                sx={{ 
                  mt: 3,
                  background: alpha(theme.late, 0.1),
                  color: theme.late,
                  border: `1px solid ${alpha(theme.late, 0.2)}`,
                  '& .MuiAlert-icon': {
                    color: theme.late
                  }
                }}
                icon={<WarningIcon />}
              >
                <Typography variant="body2" fontWeight="500">
                  Warning: Your attendance is below the minimum requirement of 75%. 
                  Please ensure regular attendance to avoid penalties.
                </Typography>
              </Alert>
            ) : (
              <Alert 
                severity="success" 
                sx={{ 
                  mt: 3,
                  background: alpha(theme.present, 0.1),
                  color: theme.present,
                  border: `1px solid ${alpha(theme.present, 0.2)}`,
                  '& .MuiAlert-icon': {
                    color: theme.present
                  }
                }}
                icon={<CheckCircleOutlineIcon />}
              >
                <Typography variant="body2" fontWeight="500">
                  Excellent! Your attendance meets the minimum requirement. Keep up the good work!
                </Typography>
              </Alert>
            )}
          </Paper>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.textPrimary, 
              fontWeight: 600,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <CalendarIcon sx={{ color: theme.primary }} />
            Monthly Calendar - {format(selectedMonth, 'MMMM yyyy')}
          </Typography>
          
          <Paper sx={{ 
            p: 3, 
            background: theme.bgLight,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.borderRadius.xl
          }}>
            <Grid container spacing={1}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Grid size={{ xs: 12/7 }} key={day}>
                  <Typography 
                    variant="body2" 
                    align="center" 
                    sx={{ 
                      color: theme.primary,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {day}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            
            <Grid container spacing={1} sx={{ mt: 2 }}>
              {getMonthDays().map((date, index) => {

  if (!date) {
    return <Grid key={index} size={{ xs: 12/7 }} />;
  }
                const attendance = getAttendanceForDate(date);
                const isCurrentMonth = isSameMonth(date, selectedMonth);
                const statusColor = attendance ? getStatusColor(attendance.status) : null;
                
                return (
                  <Grid size={{ xs: 12/7 }} key={index}>
                    <Tooltip 
                      title={attendance ? `${attendance.status} - ${attendance.remarks || 'No remarks'}` : 'No record'}
                      arrow
                    >
                      <CalendarCell
                        statuscolor={statusColor}
                        iscurrentmonth={isCurrentMonth ? 1 : 0}
                      >
                        <Typography 
                          variant="body2" 
                          align="center"
                          sx={{ 
                            fontWeight: attendance ? 'bold' : 'normal',
                            color: attendance ? statusColor : theme.textMuted
                          }}
                        >
                          {format(date, 'd')}
                        </Typography>
                        {attendance && (
                          <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'center' }}>
                            {getStatusIcon(attendance.status)}
                          </Box>
                        )}
                      </CalendarCell>
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Box>

        
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.textPrimary, 
              fontWeight: 600,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <TimelineIcon sx={{ color: theme.primary }} />
            Detailed Attendance Records
          </Typography>
          
          {attendanceRecords.length > 0 ? (
            <TableContainer 
              component={Paper} 
              variant="outlined"
              sx={{ 
                background: theme.bgLight,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.borderRadius.xl,
                overflow: 'hidden'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>Day</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Remarks</TableHeaderCell>
                    <TableHeaderCell>Marked By</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceRecords
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((record, index) => {
                      const statusColor = getStatusColor(record.status);
                      return (
                        <TableRow 
                          key={index} 
                          hover
                          sx={{
                            '&:hover': {
                              backgroundColor: theme.bgHover
                            }
                          }}
                        >
                          <TableBodyCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CalendarIcon sx={{ color: theme.primary, fontSize: 16 }} />
                              {formatDate(record.date)}
                            </Box>
                          </TableBodyCell>
                          <TableBodyCell>{formatDay(record.date)}</TableBodyCell>
                          <TableBodyCell>
                            <StatusChip
                              label={record.status}
                              statuscolor={statusColor}
                              size="small"
                              icon={getStatusIcon(record.status)}
                            />
                          </TableBodyCell>
                          <TableBodyCell>{record.remarks || '-'}</TableBodyCell>
                          <TableBodyCell>
                            {record.markedBy ? (
                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar 
                                  sx={{ 
                                    width: 28, 
                                    height: 28, 
                                    fontSize: '0.8rem',
                                    background: theme.primary,
                                    color: theme.bgLight
                                  }}
                                >
                                  {record.markedBy.name?.charAt(0) || 'F'}
                                </Avatar>
                                <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                                  {record.markedBy.name || 'Faculty'}
                                </Typography>
                              </Box>
                            ) : '-'}
                          </TableBodyCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper sx={{ 
              p: 6, 
              textAlign: 'center',
              background: theme.bgLight,
              border: `1px solid ${theme.border}`,
              borderRadius: theme.borderRadius.xl
            }}>
              <CalendarIcon sx={{ fontSize: 60, color: alpha(theme.primary, 0.3), mb: 2 }} />
              <Typography variant="h6" sx={{ color: theme.textPrimary, mb: 1 }}>
                No Attendance Records Found
              </Typography>
              <Typography variant="body2" sx={{ color: theme.textMuted }}>
                No records available for {format(selectedMonth, 'MMMM yyyy')}
              </Typography>
            </Paper>
          )}
        </Box>

        
        <Box sx={{ 
          mt: 4, 
          p: 3,
          background: theme.bgLight,
          border: `1px solid ${theme.border}`,
          borderRadius: theme.borderRadius.xl
        }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: theme.primary,
              mb: 2,
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          >
            Status Legend
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
            {[
              { status: 'present', label: 'Present', color: theme.present },
              { status: 'absent', label: 'Absent', color: theme.absent },
              { status: 'late', label: 'Late', color: theme.late },
              { status: 'half-day', label: 'Half Day', color: theme.halfDay },
              { status: 'holiday', label: 'Holiday', color: theme.holiday },
              { status: 'leave', label: 'Leave', color: theme.leave }
            ].map(item => (
              <Box key={item.status} display="flex" alignItems="center" gap={1}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '3px',
                  background: item.color
                }} />
                <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default StudentAttendance;