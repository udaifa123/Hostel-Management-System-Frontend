import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
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
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import parentService from '../../services/parentService';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

const ParentAttendance = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  const years = [2023, 2024, 2025];

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, selectedYear]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await parentService.getAttendance(selectedMonth, selectedYear);
      setAttendance(response.data.records || []);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return '#059669';
      case 'absent': return '#ef4444';
      case 'late':
      case 'half-day': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusBg = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return '#d1fae5';
      case 'absent': return '#fee2e2';
      case 'late':
      case 'half-day': return '#fef9c3';
      default: return '#f3f4f6';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#059669' }} thickness={5} />
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
          boxShadow: '0 4px 20px rgba(6,95,70,0.2)'
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/parent/dashboard')}
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Attendance Records
            </Typography>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: 4 }}>

      
        <Paper
          elevation={0}
          sx={{ p: 3, mb: 4, borderRadius: '16px', border: '1.5px solid #d1fae5', bgcolor: '#fff', boxShadow: '0 4px 16px rgba(6,95,70,0.07)' }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#059669', '&.Mui-focused': { color: '#059669' } }}>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  label="Month"
                  sx={{ borderRadius: '10px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d1fae5' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#059669' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#059669' } }}
                >
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#059669', '&.Mui-focused': { color: '#059669' } }}>Year</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  label="Year"
                  sx={{ borderRadius: '10px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d1fae5' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#059669' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#059669' } }}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

      
        {summary && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { label: 'Total Days', value: summary.totalDays, color: '#047857', bg: '#ecfdf5', border: '#a7f3d0' },
              { label: 'Present', value: summary.presentDays, color: '#059669', bg: '#d1fae5', border: '#6ee7b7' },
              { label: 'Absent', value: summary.absentDays, color: '#ef4444', bg: '#fee2e2', border: '#fca5a5' },
              { label: 'Attendance %', value: `${summary.attendancePercentage}%`, color: '#0284c7', bg: '#e0f2fe', border: '#7dd3fc' },
            ].map((s) => (
              <Grid item xs={6} sm={3} key={s.label}>
                <Card
                  elevation={0}
                  sx={{ borderRadius: '16px', border: `1.5px solid ${s.border}`, bgcolor: s.bg, boxShadow: 'none', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-3px)' } }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2.5, '&:last-child': { pb: 2.5 } }}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                      {s.label}
                    </Typography>
                    <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>
                      {s.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: '16px', border: '1.5px solid #d1fae5', overflow: 'hidden', boxShadow: '0 4px 16px rgba(6,95,70,0.07)' }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)' }}>
                {['Date', 'Day', 'Status', 'Remarks'].map((h) => (
                  <TableCell
                    key={h}
                    sx={{ color: '#fff', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: 'none' }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.map((record, idx) => (
                <TableRow
                  key={record._id}
                  sx={{
                    bgcolor: idx % 2 === 0 ? '#fff' : '#f0fdf4',
                    '&:hover': { bgcolor: '#ecfdf5' },
                    transition: 'background 0.15s'
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon fontSize="small" sx={{ color: '#059669' }} />
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>
                        {format(parseISO(record.date), 'dd MMM yyyy')}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: '#4b5563', fontSize: '0.9rem' }}>
                      {format(parseISO(record.date), 'EEEE')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.4,
                        borderRadius: '8px',
                        bgcolor: getStatusBg(record.status),
                        color: getStatusColor(record.status),
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        textTransform: 'capitalize'
                      }}
                    >
                      {record.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>
                      {record.remarks || '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default ParentAttendance;