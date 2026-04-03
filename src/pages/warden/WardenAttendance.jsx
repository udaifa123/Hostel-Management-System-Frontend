import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Card,
  CardContent,
  Tooltip,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  alpha
} from '@mui/material';
import {
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  Schedule as LateIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  Room as RoomIcon,
  AccessTime as AccessTimeIcon,
  MoreVert as MoreVertIcon,
  Event as EventIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// ==================== Constants ====================
const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half-day',
  HOLIDAY: 'holiday'
};

const ATTENDANCE_CONFIG = {
  [ATTENDANCE_STATUS.PRESENT]: {
    label: 'Present',
    color: '#10b981',
    bg: '#ecfdf5',
    icon: <PresentIcon />,
    short: 'P'
  },
  [ATTENDANCE_STATUS.ABSENT]: {
    label: 'Absent',
    color: '#ef4444',
    bg: '#fef2f2',
    icon: <AbsentIcon />,
    short: 'A'
  },
  [ATTENDANCE_STATUS.LATE]: {
    label: 'Late',
    color: '#f97316',
    bg: '#fff7ed',
    icon: <LateIcon />,
    short: 'L'
  },
  [ATTENDANCE_STATUS.HALF_DAY]: {
    label: 'Half Day',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    icon: <AccessTimeIcon />,
    short: 'H'
  },
  [ATTENDANCE_STATUS.HOLIDAY]: {
    label: 'Holiday',
    color: '#6b7280',
    bg: '#f3f4f6',
    icon: <EventIcon />,
    short: 'HD'
  }
};

// ==================== Styled Components ====================
const StatusChip = ({ status, size = 'small' }) => {
  const config = ATTENDANCE_CONFIG[status] || ATTENDANCE_CONFIG[ATTENDANCE_STATUS.ABSENT];
  
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

// ==================== Main Component ====================
const WardenAttendance = () => {
  const { token } = useAuth();
  
  // ==================== State Management ====================
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    holiday: 0,
    percentage: 0
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Filters
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // ==================== Data Fetching ====================
  const fetchStudents = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/warden/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const studentsData = response.data.data || response.data.students || response.data;
      
      if (Array.isArray(studentsData)) {
        const transformedStudents = studentsData.map(student => ({
          id: student._id,
          _id: student._id,
          name: student.user?.name || student.name || 'Unknown',
          rollNo: student.registrationNumber || student.rollNumber || 'N/A',
          email: student.user?.email || student.email || '',
          phone: student.phone || student.user?.phone || '',
          room: student.room?.roomNumber || 'Not Assigned',
          block: student.room?.block || student.block || 'A',
          floor: student.room?.floor || student.floor || 1,
          course: student.course || 'Not Assigned',
          year: student.year || 1,
          semester: student.semester || 1,
          avatar: student.user?.avatar || null,
          isActive: student.isActive !== undefined ? student.isActive : true
        }));
        
        setStudents(transformedStudents);
        await fetchAttendance(transformedStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      showSnackbar(error.response?.data?.message || 'Failed to load students', 'error');
      loadDummyData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  const fetchAttendance = async (studentsList = students) => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const response = await axios.get(`${API_URL}/attendance/${formattedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const attendanceData = response.data.data || response.data.attendance || [];
      
      const attendanceMap = {};
      attendanceData.forEach(record => {
        attendanceMap[record.student] = {
          status: record.status,
          timeIn: record.timeIn,
          timeOut: record.timeOut,
          remarks: record.remarks
        };
      });

      const updatedStudents = studentsList.map(student => ({
        ...student,
        attendance: attendanceMap[student.id]?.status || 'present',
        timeIn: attendanceMap[student.id]?.timeIn || null,
        timeOut: attendanceMap[student.id]?.timeOut || null,
        remarks: attendanceMap[student.id]?.remarks || ''
      }));

      setAttendance(updatedStudents);
      setFilteredStudents(updatedStudents);
      calculateStats(updatedStudents);
      
    } catch (error) {
      console.error('Error fetching attendance:', error);
      const updatedStudents = studentsList.map(student => ({
        ...student,
       attendance: 'present',
        timeIn: null,
        timeOut: null,
        remarks: ''
      }));
      setAttendance(updatedStudents);
      setFilteredStudents(updatedStudents);
      calculateStats(updatedStudents);
    }
  };

  const fetchAttendanceHistory = async (studentId) => {
    try {
      const response = await axios.get(`${API_URL}/attendance/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const historyData = response.data.data || response.data.attendance || [];
      setAttendanceHistory(historyData);
      setOpenHistoryDialog(true);
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      showSnackbar('Failed to load attendance history', 'error');
    }
  };

  const loadDummyData = () => {
    const dummyStudents = [
      { id: 1, name: 'Rahul Sharma', rollNo: 'STU001', room: '201', block: 'A', floor: 2, course: 'BCA', year: 3, semester: 6 },
      { id: 2, name: 'Anjali Patel', rollNo: 'STU002', room: '202', block: 'A', floor: 2, course: 'BBA', year: 2, semester: 4 },
      { id: 3, name: 'Amit Kumar', rollNo: 'STU003', room: '203', block: 'A', floor: 2, course: 'B.Tech', year: 3, semester: 6 },
      { id: 4, name: 'Priya Singh', rollNo: 'STU004', room: '204', block: 'A', floor: 2, course: 'BCA', year: 1, semester: 2 },
      { id: 5, name: 'Rohan Mehta', rollNo: 'STU005', room: '301', block: 'B', floor: 3, course: 'B.Com', year: 2, semester: 4 },
      { id: 6, name: 'Sneha Gupta', rollNo: 'STU006', room: '302', block: 'B', floor: 3, course: 'BBA', year: 3, semester: 6 },
      { id: 7, name: 'Rajesh Kumar', rollNo: 'STU007', room: '303', block: 'B', floor: 3, course: 'BCA', year: 2, semester: 4 },
      { id: 8, name: 'Pooja Sharma', rollNo: 'STU008', room: '304', block: 'B', floor: 3, course: 'B.Tech', year: 1, semester: 2 },
    ];
    
    const updatedStudents = dummyStudents.map(student => ({
      ...student,
      attendance: 'absent',
      timeIn: null
    }));
    
    setStudents(updatedStudents);
    setAttendance(updatedStudents);
    setFilteredStudents(updatedStudents);
    calculateStats(updatedStudents);
    setLoading(false);
  };

  // Refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    showSnackbar('Data refreshed successfully!', 'success');
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchStudents();
    }
  }, [token]);

  useEffect(() => {
    if (students.length > 0) {
      fetchAttendance(students);
    }
  }, [selectedDate]);

  // ==================== Filtering ====================
  useEffect(() => {
    let filtered = [...attendance];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.name?.toLowerCase().includes(term) ||
        s.rollNo?.toLowerCase().includes(term) ||
        s.room?.toLowerCase().includes(term)
      );
    }

    if (selectedBlock !== 'all') {
      filtered = filtered.filter(s => s.block === selectedBlock);
    }

    if (selectedFloor !== 'all') {
      filtered = filtered.filter(s => s.floor === parseInt(selectedFloor));
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.attendance === selectedStatus);
    }

    if (tabValue === 1) {
      filtered = filtered.filter(s => s.attendance === 'present');
    } else if (tabValue === 2) {
      filtered = filtered.filter(s => s.attendance === 'absent');
    } else if (tabValue === 3) {
      filtered = filtered.filter(s => s.attendance === 'late');
    }

    setFilteredStudents(filtered);
  }, [attendance, searchTerm, selectedBlock, selectedFloor, selectedStatus, tabValue]);

  // ==================== Statistics Calculation ====================
  const calculateStats = (studentsList) => {
    const stats = {
      total: studentsList.length,
      present: studentsList.filter(s => s.attendance === 'present').length,
      absent: studentsList.filter(s => s.attendance === 'absent').length,
      late: studentsList.filter(s => s.attendance === 'late').length,
      halfDay: studentsList.filter(s => s.attendance === 'half-day').length,
      holiday: studentsList.filter(s => s.attendance === 'holiday').length,
      percentage: 0
    };

    stats.percentage = stats.total > 0 
      ? Math.round(((stats.present + stats.late) / stats.total) * 100) 
      : 0;

    setAttendanceStats(stats);
  };

  // ==================== Handlers ====================
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAttendanceChange = (studentId, status) => {
    const updatedAttendance = attendance.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          attendance: status,
          timeIn: status === 'present' || status === 'late' 
            ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
            : null
        };
      }
      return s;
    });

    setAttendance(updatedAttendance);
    calculateStats(updatedAttendance);
    setFilteredStudents(updatedAttendance);
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      
      const attendanceData = attendance.map(student => ({
        studentId: student.id,
        status: student.attendance,
        date: selectedDate.toISOString().split('T')[0],
        timeIn: student.timeIn,
        remarks: student.remarks || ''
      }));

      await axios.post(
        `${API_URL}/attendance/mark`,
        { attendance: attendanceData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showSnackbar('Attendance saved successfully!', 'success');
      // Refresh data after save
      await fetchStudents();
    } catch (error) {
      console.error('Error saving attendance:', error);
      showSnackbar(error.response?.data?.message || 'Failed to save attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAllPresent = () => {
    const updatedAttendance = attendance.map(s => ({
      ...s,
      attendance: 'present',
      timeIn: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }));
    setAttendance(updatedAttendance);
    calculateStats(updatedAttendance);
    setFilteredStudents(updatedAttendance);
    showSnackbar('All students marked present', 'success');
  };

  const handleMarkAllAbsent = () => {
    const updatedAttendance = attendance.map(s => ({
      ...s,
      attendance: 'absent',
      timeIn: null
    }));
    setAttendance(updatedAttendance);
    calculateStats(updatedAttendance);
    setFilteredStudents(updatedAttendance);
    showSnackbar('All students marked absent', 'success');
  };

  const handleExportData = () => {
    const exportData = filteredStudents.map(s => ({
      'Name': s.name,
      'Roll No': s.rollNo,
      'Room': s.room,
      'Block': s.block,
      'Floor': s.floor,
      'Status': s.attendance,
      'Time In': s.timeIn || '-',
      'Course': s.course,
      'Year': s.year,
      'Semester': s.semester
    }));

    const headers = Object.keys(exportData[0]).join(',');
    const rows = exportData.map(row => Object.values(row).map(val => `"${val}"`).join(','));
    const csvContent = [headers, ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate.toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleMenuOpen = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const handleViewHistory = () => {
    if (selectedStudent) {
      fetchAttendanceHistory(selectedStudent.id);
    }
    handleMenuClose();
  };

  // ==================== Computed Values ====================
  const uniqueBlocks = [...new Set(students.map(s => s.block))].sort();
  const uniqueFloors = [...new Set(students.map(s => s.floor))].sort((a, b) => a - b);

  // ==================== Render ====================
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography ml={2}>Loading attendance data...</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Attendance Management
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Mark and manage student attendance
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={refreshing ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{ bgcolor: '#6b7280', '&:hover': { bgcolor: '#4b5563' } }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleSaveAttendance}
              disabled={saving}
              sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
            >
              {saving ? 'Saving...' : 'Save Attendance'}
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card sx={{ borderRadius: 2, bgcolor: alpha('#3b82f6', 0.1) }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Students</Typography>
                <Typography variant="h3" fontWeight="bold" color="#3b82f6">
                  {attendanceStats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card sx={{ borderRadius: 2, bgcolor: alpha('#10b981', 0.1) }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Present</Typography>
                <Typography variant="h3" fontWeight="bold" color="#10b981">
                  {attendanceStats.present}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(attendanceStats.present / attendanceStats.total) * 100 || 0} 
                  sx={{ mt: 1, height: 4, borderRadius: 2, bgcolor: alpha('#10b981', 0.2) }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card sx={{ borderRadius: 2, bgcolor: alpha('#ef4444', 0.1) }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Absent</Typography>
                <Typography variant="h3" fontWeight="bold" color="#ef4444">
                  {attendanceStats.absent}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(attendanceStats.absent / attendanceStats.total) * 100 || 0} 
                  sx={{ mt: 1, height: 4, borderRadius: 2, bgcolor: alpha('#ef4444', 0.2) }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card sx={{ borderRadius: 2, bgcolor: alpha('#f97316', 0.1) }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Late</Typography>
                <Typography variant="h3" fontWeight="bold" color="#f97316">
                  {attendanceStats.late}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(attendanceStats.late / attendanceStats.total) * 100 || 0} 
                  sx={{ mt: 1, height: 4, borderRadius: 2, bgcolor: alpha('#f97316', 0.2) }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card sx={{ borderRadius: 2, bgcolor: alpha('#8b5cf6', 0.1) }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Attendance %</Typography>
                <Typography variant="h3" fontWeight="bold" color="#8b5cf6">
                  {attendanceStats.percentage}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={attendanceStats.percentage} 
                  sx={{ mt: 1, height: 4, borderRadius: 2, bgcolor: alpha('#8b5cf6', 0.2) }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 2 }}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small"
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 1.5 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Block</InputLabel>
                <Select
                  value={selectedBlock}
                  label="Block"
                  onChange={(e) => setSelectedBlock(e.target.value)}
                >
                  <MenuItem value="all">All Blocks</MenuItem>
                  {uniqueBlocks.map(block => (
                    <MenuItem key={block} value={block}>Block {block}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 1.5 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Floor</InputLabel>
                <Select
                  value={selectedFloor}
                  label="Floor"
                  onChange={(e) => setSelectedFloor(e.target.value)}
                >
                  <MenuItem value="all">All Floors</MenuItem>
                  {uniqueFloors.map(floor => (
                    <MenuItem key={floor} value={floor}>Floor {floor}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 1.5 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  {Object.entries(ATTENDANCE_CONFIG).map(([key, config]) => (
                    <MenuItem key={key} value={key}>{config.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 1.5 }}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedBlock('all');
                  setSelectedFloor('all');
                  setSelectedStatus('all');
                  setTabValue(0);
                }}
              >
                Reset
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Box display="flex" gap={1}>
                <Tooltip title="Mark All Present">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleMarkAllPresent}
                    sx={{ bgcolor: '#10b981', flex: 1 }}
                  >
                    All Present
                  </Button>
                </Tooltip>
                <Tooltip title="Mark All Absent">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleMarkAllAbsent}
                    sx={{ bgcolor: '#ef4444', flex: 1 }}
                  >
                    All Absent
                  </Button>
                </Tooltip>
                <Tooltip title="Export Data">
                  <IconButton onClick={handleExportData} color="primary">
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={(e, v) => setTabValue(v)}
              sx={{
                '& .MuiTab-root': { minWidth: 120 },
                '& .Mui-selected': { color: '#10b981' },
                '& .MuiTabs-indicator': { backgroundColor: '#10b981' }
              }}
            >
              <Tab 
                label={
                  <Badge badgeContent={attendanceStats.total} color="primary" max={999}>
                    All Students
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={attendanceStats.present} color="success">
                    Present
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={attendanceStats.absent} color="error">
                    Absent
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={attendanceStats.late} color="warning">
                    Late
                  </Badge>
                } 
              />
            </Tabs>
          </Box>
        </Paper>

        {/* Attendance Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Roll No.</TableCell>
                <TableCell>Room/Block</TableCell>
                <TableCell>Course/Year</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time In</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">No students found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar 
                          src={student.avatar}
                          sx={{ 
                            bgcolor: student.attendance === 'present' ? '#10b981' :
                                    student.attendance === 'absent' ? '#ef4444' : '#f97316'
                          }}
                        >
                          {student.name?.charAt(0) || 'S'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {student.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {student.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {student.rollNo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<RoomIcon />}
                        label={`${student.room} (${student.block})`}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{student.course}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Year {student.year} | Sem {student.semester}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={student.attendance} />
                    </TableCell>
                    <TableCell>
                      {student.timeIn ? (
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={student.timeIn}
                          size="small"
                          sx={{ bgcolor: alpha('#10b981', 0.1), color: '#10b981' }}
                        />
                      ) : (
                        <Typography variant="caption" color="textSecondary">—</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <Tooltip title="Mark Present">
                          <IconButton
                            size="small"
                            onClick={() => handleAttendanceChange(student.id, 'present')}
                            sx={{ 
                              color: student.attendance === 'present' ? '#10b981' : '#94a3b8',
                              bgcolor: student.attendance === 'present' ? alpha('#10b981', 0.1) : 'transparent'
                            }}
                          >
                            <PresentIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Mark Late">
                          <IconButton
                            size="small"
                            onClick={() => handleAttendanceChange(student.id, 'late')}
                            sx={{ 
                              color: student.attendance === 'late' ? '#f97316' : '#94a3b8',
                              bgcolor: student.attendance === 'late' ? alpha('#f97316', 0.1) : 'transparent'
                            }}
                          >
                            <LateIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Mark Absent">
                          <IconButton
                            size="small"
                            onClick={() => handleAttendanceChange(student.id, 'absent')}
                            sx={{ 
                              color: student.attendance === 'absent' ? '#ef4444' : '#94a3b8',
                              bgcolor: student.attendance === 'absent' ? alpha('#ef4444', 0.1) : 'transparent'
                            }}
                          >
                            <AbsentIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View History">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, student)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Student Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleViewHistory}>
            <ListItemIcon><HistoryIcon fontSize="small" /></ListItemIcon>
            <ListItemText>View Attendance History</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><ViewIcon fontSize="small" /></ListItemIcon>
            <ListItemText>View Student Details</ListItemText>
          </MenuItem>
        </Menu>

        {/* Attendance History Dialog */}
        <Dialog
          open={openHistoryDialog}
          onClose={() => setOpenHistoryDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              Attendance History - {selectedStudent?.name}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Time In</TableCell>
                    <TableCell>Time Out</TableCell>
                    <TableCell>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No attendance history found
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendanceHistory.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <StatusChip status={record.status} size="small" />
                        </TableCell>
                        <TableCell>{record.timeIn || '—'}</TableCell>
                        <TableCell>{record.timeOut || '—'}</TableCell>
                        <TableCell>{record.remarks || '—'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenHistoryDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default WardenAttendance;