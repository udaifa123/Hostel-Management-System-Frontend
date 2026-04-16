import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Download as DownloadIcon,
  Assessment as ReportIcon,
  People as PeopleIcon,
  MeetingRoom as RoomIcon,
  ReportProblem as ComplaintIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  School as StudentIcon,
  Description as LeaveIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import wardenService from '../../services/wardenService';
import toast from 'react-hot-toast';

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

const WardenReports = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    pendingComplaints: 0,
    pendingLeaves: 0,
    attendanceRate: 0,
    occupancyRate: 0,
    feesCollected: 0
  });
  const [reportsLoading, setReportsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [format, setFormat] = useState('pdf');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch dashboard stats on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await wardenService.getDashboardStats();
      console.log('Dashboard stats:', response);
      
      if (response.success && response.data) {
        const data = response.data;
        setDashboardStats({
          totalStudents: data.stats?.totalStudents || 0,
          totalRooms: data.stats?.totalRooms || 0,
          occupiedRooms: data.stats?.occupiedRooms || 0,
          pendingComplaints: data.stats?.pendingComplaints || 0,
          pendingLeaves: data.stats?.pendingLeaves || 0,
          attendanceRate: calculateAttendanceRate(data.stats),
          occupancyRate: data.stats?.totalRooms > 0 
            ? Math.round((data.stats.occupiedRooms / data.stats.totalRooms) * 100) 
            : 0,
          feesCollected: data.stats?.totalFeesCollected || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendanceRate = (stats) => {
    const total = (stats?.todayPresent || 0) + (stats?.todayAbsent || 0);
    if (total === 0) return 0;
    return Math.round((stats?.todayPresent || 0) / total * 100);
  };

  const reports = [
    { 
      id: 'students',
      title: 'Student List', 
      icon: <PeopleIcon />, 
      color: G[600],
      bg: alpha(G[600], 0.1),
      description: 'Complete list of all students with details',
      hasDateRange: false,
      apiEndpoint: '/warden/reports/students'
    },
    { 
      id: 'attendance',
      title: 'Attendance Report', 
      icon: <TrendingUpIcon />, 
      color: G[500],
      bg: alpha(G[500], 0.1),
      description: 'Daily, weekly and monthly attendance summary',
      hasDateRange: true,
      apiEndpoint: '/warden/reports/attendance'
    },
    { 
      id: 'rooms',
      title: 'Room Occupancy', 
      icon: <RoomIcon />, 
      color: '#F59E0B',
      bg: alpha('#F59E0B', 0.1),
      description: 'Room-wise occupancy status and availability',
      hasDateRange: false,
      apiEndpoint: '/warden/reports/rooms'
    },
    { 
      id: 'complaints',
      title: 'Complaint Analysis', 
      icon: <ComplaintIcon />, 
      color: '#EF4444',
      bg: alpha('#EF4444', 0.1),
      description: 'Category-wise complaint statistics',
      hasDateRange: true,
      apiEndpoint: '/warden/reports/complaints'
    },
    { 
      id: 'leaves',
      title: 'Leave Summary', 
      icon: <LeaveIcon />, 
      color: '#8B5CF6',
      bg: alpha('#8B5CF6', 0.1),
      description: 'Leave applications and approvals summary',
      hasDateRange: true,
      apiEndpoint: '/warden/reports/leaves'
    },
    { 
      id: 'fees',
      title: 'Fee Collection', 
      icon: <MoneyIcon />, 
      color: G[400],
      bg: alpha(G[400], 0.1),
      description: 'Fee payment and collection status',
      hasDateRange: true,
      apiEndpoint: '/warden/reports/fees'
    }
  ];

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleGenerateReport = async (report) => {
    setSelectedReport(report);
    
    if (report.hasDateRange) {
      setOpenDialog(true);
    } else {
      await generateReport(report, {});
    }
  };

  const generateReport = async (report, options) => {
    setReportsLoading(true);
    try {
      const params = new URLSearchParams();
      if (options.startDate) params.append('startDate', options.startDate.toISOString().split('T')[0]);
      if (options.endDate) params.append('endDate', options.endDate.toISOString().split('T')[0]);
      if (options.format) params.append('format', options.format);
      
      const response = await wardenService.generateReport(report.id, options.format || format, {
        startDate: options.startDate,
        endDate: options.endDate
      });
      
      console.log(`Generated ${report.title} report:`, response);
      
      // Handle blob response for file download
      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.title.toLowerCase().replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.${options.format || format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showSnackbar(`${report.title} downloaded successfully!`, 'success');
      } else {
        showSnackbar(`${report.title} generated successfully!`, 'success');
      }
      
    } catch (error) {
      console.error('Error generating report:', error);
      showSnackbar(error.response?.data?.message || 'Failed to generate report', 'error');
    } finally {
      setReportsLoading(false);
      setOpenDialog(false);
      setDateRange({ startDate: null, endDate: null });
    }
  };

  const handleDownload = () => {
    generateReport(selectedReport, {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      format
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ bgcolor: G[50], minHeight: '100vh' }}>
        {/* Top accent bar */}
        <Box sx={{ height: 4, bgcolor: G[600] }} />

        <Box sx={{ p: 3 }}>
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
              <Box sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                bgcolor: G[800],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ReportIcon sx={{ color: G[200], fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
                  Reports & Analytics
                </Typography>
                <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
                  Generate and download hostel management reports
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={<CalendarIcon sx={{ fontSize: '14px !important', color: `${G[600]} !important` }} />}
              label={`Last updated: ${new Date().toLocaleDateString()}`}
              size="small"
              sx={{ bgcolor: G[100], color: G[700], fontWeight: 600, border: `1px solid ${G[200]}` }}
            />
          </Paper>

          {/* Quick Stats - Fixed Grid Implementation */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ borderRadius: 3, bgcolor: G[800], border: `1px solid ${G[700]}`, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ color: G[300], fontSize: '0.75rem', textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                    Total Students
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#ffffff', fontSize: '2.5rem' }}>
                    {dashboardStats.totalStudents}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ color: G[600], fontSize: '0.75rem', textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                    Total Rooms
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: G[600], fontSize: '2.5rem' }}>
                    {dashboardStats.totalRooms}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ color: G[600], fontSize: '0.75rem', textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                    Occupancy Rate
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: G[600], fontSize: '2.5rem' }}>
                    {dashboardStats.occupancyRate}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ color: G[600], fontSize: '0.75rem', textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                    Pending Complaints
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#EF4444', fontSize: '2.5rem' }}>
                    {dashboardStats.pendingComplaints}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ color: G[600], fontSize: '0.75rem', textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                    Attendance Rate
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: G[600], fontSize: '2.5rem' }}>
                    {dashboardStats.attendanceRate}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Reports Grid - Fixed Implementation */}
          <Typography variant="h6" sx={{ fontWeight: 700, color: G[800], mb: 2 }}>
            Available Reports
          </Typography>
          
          <Grid container spacing={3}>
            {reports.map((report) => (
              <Grid item xs={12} sm={6} md={4} key={report.id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    bgcolor: '#ffffff',
                    border: `1px solid ${G[200]}`,
                    boxShadow: CARD_SHADOW,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 24px ${alpha(G[600], 0.12)}`,
                      borderColor: G[300]
                    }
                  }}
                  onClick={() => handleGenerateReport(report)}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: report.bg,
                        color: report.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      {report.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: G[800], mb: 1 }}>
                      {report.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: G[500], display: 'block', mb: 2 }}>
                      {report.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Download PDF">
                        <IconButton 
                          size="small" 
                          sx={{ 
                            color: G[600], 
                            bgcolor: G[100], 
                            borderRadius: 1.5,
                            '&:hover': { bgcolor: G[200] }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormat('pdf');
                            handleGenerateReport(report);
                          }}
                        >
                          <PdfIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Excel">
                        <IconButton 
                          size="small" 
                          sx={{ 
                            color: G[600], 
                            bgcolor: G[100], 
                            borderRadius: 1.5,
                            '&:hover': { bgcolor: G[200] }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormat('excel');
                            handleGenerateReport(report);
                          }}
                        >
                          <ExcelIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Report Generation Dialog */}
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
            <DialogTitle sx={{ pt: 2.5, pb: 1.5 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 1.5,
                    bgcolor: selectedReport?.bg || G[100],
                    color: selectedReport?.color || G[600],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {selectedReport?.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
                    Generate {selectedReport?.title}
                  </Typography>
                </Box>
                <IconButton onClick={() => setOpenDialog(false)} sx={{ color: G[400] }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <Divider sx={{ borderColor: G[100] }} />
            <DialogContent sx={{ pt: 3 }}>
              <Typography variant="body2" sx={{ color: G[600], mb: 3 }}>
                Select date range and format to generate the report
              </Typography>
              
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Start Date"
                    value={dateRange.startDate}
                    onChange={(newValue) => setDateRange({ ...dateRange, startDate: newValue })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: G[50],
                            '& fieldset': { borderColor: G[200] },
                          },
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="End Date"
                    value={dateRange.endDate}
                    onChange={(newValue) => setDateRange({ ...dateRange, endDate: newValue })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: G[50],
                            '& fieldset': { borderColor: G[200] },
                          },
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Format</InputLabel>
                    <Select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      label="Format"
                      sx={{
                        borderRadius: 2,
                        bgcolor: G[50],
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: G[200] },
                      }}
                    >
                      <MenuItem value="pdf">PDF Document</MenuItem>
                      <MenuItem value="excel">Excel Spreadsheet</MenuItem>
                      <MenuItem value="csv">CSV File</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider sx={{ borderColor: G[100] }} />
            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
              <Button 
                onClick={() => setOpenDialog(false)} 
                sx={{ color: G[600], border: `1px solid ${G[200]}`, px: 3 }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleDownload}
                disabled={reportsLoading}
                sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] }, px: 3 }}
              >
                {reportsLoading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : 'Generate Report'}
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
      </Box>
    </LocalizationProvider>
  );
};

export default WardenReports;