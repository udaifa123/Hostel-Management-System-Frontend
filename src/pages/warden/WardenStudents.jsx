import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MeetingRoom as RoomIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const WardenStudents = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [apiError, setApiError] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    course: 'all',
    year: 'all',
    status: 'all'
  });

  useEffect(() => {
    if (token) {
      fetchStudents();
    }
  }, [token]);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, filters, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      console.log('🔍 Fetching students...');
      
      const response = await axios.get(`${API_URL}/warden/students`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Students response:', response.data);
      
      // Handle the actual response structure from your backend
      let studentsData = [];
      
      if (response.data.students && Array.isArray(response.data.students)) {
        // Your backend sends { success: true, students: [...], count: 3 }
        studentsData = response.data.students;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        studentsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        studentsData = response.data;
      }
      
      console.log('📊 Processed students data:', studentsData);
      
      if (!studentsData || studentsData.length === 0) {
        setStudents([]);
        setFilteredStudents([]);
      } else {
        // Transform data for display - handle nested user object
        const transformed = studentsData.map(s => ({
          _id: s._id,
          name: s.user?.name || s.name || 'N/A',
          email: s.user?.email || s.email || 'N/A',
          phone: s.phone || s.user?.phone || 'N/A',
          rollNumber: s.registrationNumber || s.rollNumber || 'N/A',
          course: s.course || 'Not Assigned',
          branch: s.branch || 'Not Assigned',
          year: s.year || 1,
          semester: s.semester || 1,
          room: s.room?.roomNumber || s.roomNumber || 'Not Assigned',
          block: s.block || 'A',
          isActive: s.isActive !== undefined ? s.isActive : true,
          status: s.isActive ? 'active' : 'inactive',
          address: s.address || 'N/A',
          parentPhone: s.parentPhone || 'N/A',
          registrationNumber: s.registrationNumber || 'N/A',
          enrollmentNumber: s.enrollmentNumber || 'N/A'
        }));
        
        console.log('✅ Transformed students:', transformed);
        setStudents(transformed);
        setFilteredStudents(transformed);
      }
      
    } catch (error) {
      console.error('❌ Error:', error);
      setApiError(error.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.room.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.course !== 'all') {
      filtered = filtered.filter(s => s.course === filters.course);
    }

    if (filters.year !== 'all') {
      filtered = filtered.filter(s => s.year.toString() === filters.year);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(s => s.status === filters.status);
    }

    setFilteredStudents(filtered);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setOpenViewDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenViewDialog(false);
    setSelectedStudent(null);
  };

  const courses = [...new Set(students.map(s => s.course).filter(Boolean))];
  const years = [...new Set(students.map(s => s.year.toString()).filter(Boolean))];

  const stats = {
    total: students.length,
    active: students.filter(s => s.isActive).length,
    inactive: students.filter(s => !s.isActive).length,
    assignedRooms: students.filter(s => s.room !== 'Not Assigned').length
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography ml={2}>Loading students...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Add Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Student Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/warden/students/add')}
            sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
          >
            Add New Student
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchStudents}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: '#eff6ff' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Students</Typography>
              <Typography variant="h3" fontWeight="bold" color="#3b82f6">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: '#ecfdf5' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Active Students</Typography>
              <Typography variant="h3" fontWeight="bold" color="#10b981">{stats.active}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: '#fef2f2' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Inactive</Typography>
              <Typography variant="h3" fontWeight="bold" color="#ef4444">{stats.inactive}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: '#fef3c7' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Rooms Assigned</Typography>
              <Typography variant="h3" fontWeight="bold" color="#f59e0b">{stats.assignedRooms}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by name, roll no, email, room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Course</InputLabel>
              <Select
                value={filters.course}
                label="Course"
                onChange={(e) => setFilters({ ...filters, course: e.target.value })}
              >
                <MenuItem value="all">All Courses</MenuItem>
                {courses.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Year</InputLabel>
              <Select
                value={filters.year}
                label="Year"
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              >
                <MenuItem value="all">All Years</MenuItem>
                {years.map(y => <MenuItem key={y} value={y}>Year {y}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <SchoolIcon sx={{ fontSize: 60, color: '#9ca3af', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Students Found
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {students.length === 0 
              ? 'No student records in database. Click "Add New Student" to get started.'
              : 'No students match your search criteria.'}
          </Typography>
          {students.length === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/warden/students/add')}
              sx={{ bgcolor: '#10b981', mt: 2 }}
            >
              Add Your First Student
            </Button>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Roll No.</TableCell>
                <TableCell>Room/Block</TableCell>
                <TableCell>Course & Year</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: '#10b981' }}>
                        {student.name.charAt(0)}
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
                      {student.rollNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      icon={<HomeIcon />}
                      label={`${student.room} (${student.block})`}
                      size="small"
                      sx={{ bgcolor: '#e0f2fe', color: '#0369a1' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{student.course}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Year {student.year} | Sem {student.semester}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PhoneIcon fontSize="small" sx={{ color: '#64748b' }} />
                      <Typography variant="body2">{student.phone}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={student.status}
                      size="small"
                      sx={{ 
                        bgcolor: student.isActive ? '#dcfce7' : '#fee2e2',
                        color: student.isActive ? '#059669' : '#dc2626'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        color="info" 
                        onClick={() => handleViewStudent(student)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
            <Typography variant="body2" color="textSecondary">
              Showing {filteredStudents.length} of {students.length} students
            </Typography>
          </Box>
        </TableContainer>
      )}

      {/* View Student Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedStudent && (
          <>
            <DialogTitle sx={{ bgcolor: '#f8fafc' }}>
              <Typography variant="h6" fontWeight="bold">
                Student Details
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} display="flex" justifyContent="center" mb={2}>
                  <Avatar sx={{ width: 100, height: 100, bgcolor: '#10b981', fontSize: '3rem' }}>
                    {selectedStudent.name.charAt(0)}
                  </Avatar>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h5" fontWeight="bold" align="center">
                    {selectedStudent.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    {selectedStudent.email}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: '#f8fafc' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}><Typography color="textSecondary">Roll Number:</Typography></Grid>
                      <Grid item xs={6}><Typography fontWeight="bold">{selectedStudent.rollNumber}</Typography></Grid>
                      
                      <Grid item xs={6}><Typography color="textSecondary">Registration No:</Typography></Grid>
                      <Grid item xs={6}><Typography fontWeight="bold">{selectedStudent.registrationNumber}</Typography></Grid>
                      
                      <Grid item xs={6}><Typography color="textSecondary">Course:</Typography></Grid>
                      <Grid item xs={6}><Typography fontWeight="bold">{selectedStudent.course}</Typography></Grid>
                      
                      <Grid item xs={6}><Typography color="textSecondary">Branch:</Typography></Grid>
                      <Grid item xs={6}><Typography fontWeight="bold">{selectedStudent.branch}</Typography></Grid>
                      
                      <Grid item xs={6}><Typography color="textSecondary">Year/Semester:</Typography></Grid>
                      <Grid item xs={6}><Typography fontWeight="bold">Year {selectedStudent.year} / Sem {selectedStudent.semester}</Typography></Grid>
                      
                      <Grid item xs={6}><Typography color="textSecondary">Room:</Typography></Grid>
                      <Grid item xs={6}><Typography fontWeight="bold">{selectedStudent.room}</Typography></Grid>
                      
                      <Grid item xs={6}><Typography color="textSecondary">Block:</Typography></Grid>
                      <Grid item xs={6}><Typography fontWeight="bold">{selectedStudent.block}</Typography></Grid>
                      
                      <Grid item xs={6}><Typography color="textSecondary">Phone:</Typography></Grid>
                      <Grid item xs={6}><Typography fontWeight="bold">{selectedStudent.phone}</Typography></Grid>
                      
                      <Grid item xs={6}><Typography color="textSecondary">Parent Phone:</Typography></Grid>
                      <Grid item xs={6}><Typography fontWeight="bold">{selectedStudent.parentPhone}</Typography></Grid>
                      
                      <Grid item xs={6}><Typography color="textSecondary">Address:</Typography></Grid>
                      <Grid item xs={6}><Typography fontWeight="bold">{selectedStudent.address}</Typography></Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseDialog} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default WardenStudents;