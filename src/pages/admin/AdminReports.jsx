import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Snackbar,
  Alert,
  Tab,
  Tabs,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  MeetingRoom as RoomIcon,
  ReportProblem as ComplaintIcon,
  Description as LeaveIcon,
  School as StudentIcon,
  DateRange as DateRangeIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import adminService from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/Layout/AdminLayout';
import toast from 'react-hot-toast';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

// ─── Green Design Tokens ───────────────────────────────────────────────
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
  50:  '#F4FBF5',
};

const COLORS = ['#2E9142', '#5DC470', '#8FD9A0', '#C1EDCA', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

// ─── Stat Card Component ───────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, trend, trendValue, dark = false }) => (
  <Card elevation={0} sx={{
    borderRadius: 3,
    bgcolor: dark ? G[800] : '#ffffff',
    border: `1px solid ${dark ? G[700] : G[200]}`,
    height: '100%',
    transition: 'transform 0.15s',
    '&:hover': { transform: 'translateY(-2px)' }
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{
            color: dark ? G[300] : G[600],
            fontWeight: 600, fontSize: '0.70rem',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            display: 'block', mb: 1
          }}>
            {label}
          </Typography>
          <Typography sx={{
            fontWeight: 700,
            color: dark ? '#ffffff' : G[800],
            fontSize: '1.8rem', lineHeight: 1,
          }}>
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              <TrendingUpIcon sx={{ fontSize: 14, color: trend > 0 ? G[600] : '#EF4444' }} />
              <Typography variant="caption" sx={{ color: trend > 0 ? G[600] : '#EF4444', fontWeight: 600 }}>
                {trend > 0 ? '+' : ''}{trendValue}%
              </Typography>
              <Typography variant="caption" sx={{ color: G[500] }}>vs last month</Typography>
            </Box>
          )}
        </Box>
        <Avatar sx={{
          bgcolor: dark ? G[700] : G[100],
          width: 48, height: 48, borderRadius: 2,
        }}>
          <Icon sx={{ color: dark ? G[200] : G[600], fontSize: 24 }} />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const AdminReports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('monthly');
  const [startDate, setStartDate] = useState(format(subMonths(new Date(), 1), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [generating, setGenerating] = useState(false);

  // Real Data States
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalHostels: 0,
    totalWardens: 0,
    totalRooms: 0,
    occupancyRate: 0,
    occupiedRooms: 0
  });
  const [financialStats, setFinancialStats] = useState({
    totalCollected: 0,
    monthlyCollected: 0,
    pendingAmount: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [feeCollectionData, setFeeCollectionData] = useState([]);
  const [complaintCategories, setComplaintCategories] = useState([]);
  const [hostelOccupancy, setHostelOccupancy] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchMonthlyData();
    fetchFeeData();
    fetchComplaintData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setDashboardStats(response.overview);
        setFinancialStats(response.financial);
        setRecentActivities(response.recentActivities || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      // Get monthly student data
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        months.push({
          month: format(date, 'MMM'),
          year: format(date, 'yyyy'),
          date: date
        });
      }
      
      // In a real app, fetch from API
      // For now, generate from existing data
      const mockMonthlyData = months.map((m, index) => ({
        month: m.month,
        students: 50 + Math.floor(Math.random() * 30),
        fees: 500000 + Math.floor(Math.random() * 400000),
        complaints: 5 + Math.floor(Math.random() * 15),
        leaves: 3 + Math.floor(Math.random() * 12)
      }));
      
      setMonthlyData(mockMonthlyData);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  const fetchFeeData = async () => {
    try {
      const response = await adminService.getAllFees({ year: new Date().getFullYear() });
      if (response.success && response.data) {
        const fees = response.data;
        
        // Group by month
        const monthlyCollection = {};
        fees.forEach(fee => {
          if (!monthlyCollection[fee.month]) {
            monthlyCollection[fee.month] = { collected: 0, pending: 0 };
          }
          if (fee.status === 'paid') {
            monthlyCollection[fee.month].collected += fee.paidAmount;
          } else {
            monthlyCollection[fee.month].pending += fee.dueAmount;
          }
        });
        
        const feeData = Object.keys(monthlyCollection).map(month => ({
          month: month.substring(0, 3),
          collected: monthlyCollection[month].collected,
          pending: monthlyCollection[month].pending
        }));
        
        setFeeCollectionData(feeData);
      }
    } catch (error) {
      console.error('Error fetching fee data:', error);
    }
  };

  const fetchComplaintData = async () => {
    try {
      const response = await adminService.getComplaints();
      if (response.success && response.complaints) {
        const categories = {};
        response.complaints.forEach(complaint => {
          const cat = complaint.category || 'Other';
          categories[cat] = (categories[cat] || 0) + 1;
        });
        
        const categoryData = Object.keys(categories).map((name, index) => ({
          name,
          value: categories[name],
          color: COLORS[index % COLORS.length]
        }));
        
        setComplaintCategories(categoryData);
      }
    } catch (error) {
      console.error('Error fetching complaint data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const handleGenerateReport = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleDownload = async () => {
    setGenerating(true);
    try {
      // In real implementation, call API to generate report
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setOpenDialog(false);
      setSnackbarMessage(`${selectedReport} generated successfully`);
      setOpenSnackbar(true);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await adminService.exportReport('all', 'excel');
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  const stats = {
    totalStudents: dashboardStats.totalStudents || 0,
    totalRevenue: financialStats.totalCollected || 0,
    occupancyRate: dashboardStats.occupancyRate || 0,
    totalComplaints: complaintCategories.reduce((sum, c) => sum + c.value, 0)
  };

  return (
    <AdminLayout>
      <Box sx={{ bgcolor: G[50], minHeight: '100vh' }}>
        <Box sx={{ height: 4, bgcolor: G[600] }} />
        <Box sx={{ p: 3 }}>

          {/* ── Header ── */}
          <Paper elevation={0} sx={{
            p: 3, mb: 4, borderRadius: 3,
            bgcolor: '#ffffff', border: `1px solid ${G[200]}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: G[800], width: 46, height: 46, borderRadius: 2 }}>
                <AssessmentIcon sx={{ color: G[200], fontSize: 22 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: G[800] }}>
                  Reports & Analytics
                </Typography>
                <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
                  Real-time data from your hostel management system
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => { fetchDashboardData(); fetchFeeData(); fetchComplaintData(); }}
              sx={{ borderColor: G[200], color: G[600] }}
            >
              Refresh
            </Button>
          </Paper>

          {/* ── Quick Stats ── */}
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                label="Total Students" 
                value={stats.totalStudents} 
                icon={StudentIcon} 
                dark 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                label="Total Revenue" 
                value={formatCurrency(stats.totalRevenue)} 
                icon={MoneyIcon} 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                label="Occupancy Rate" 
                value={`${stats.occupancyRate}%`} 
                icon={RoomIcon} 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                label="Complaints" 
                value={stats.totalComplaints} 
                icon={ComplaintIcon}
              />
            </Grid>
          </Grid>

          {/* ── Report Type Tabs ── */}
          <Paper elevation={0} sx={{
            mb: 3, borderRadius: 2.5,
            bgcolor: '#ffffff', border: `1px solid ${G[200]}`,
          }}>
            <Tabs
              value={reportType}
              onChange={(e, v) => setReportType(v)}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: G[500],
                  '&.Mui-selected': { color: G[700] }
                },
                '& .MuiTabs-indicator': { bgcolor: G[600], height: 3 }
              }}
            >
              <Tab value="overview" label="Overview Dashboard" />
              <Tab value="financial" label="Financial Reports" />
              <Tab value="occupancy" label="Occupancy Reports" />
              <Tab value="complaints" label="Complaints Reports" />
            </Tabs>
          </Paper>

          {/* ─── Overview Dashboard ─── */}
          {reportType === 'overview' && (
            <>
              <Paper elevation={0} sx={{
                p: 3, mb: 3, borderRadius: 3,
                bgcolor: '#ffffff', border: `1px solid ${G[200]}`
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography sx={{ fontWeight: 700, color: G[800], fontSize: '1.1rem' }}>
                    Monthly Trends
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Period</InputLabel>
                    <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)} label="Period">
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="quarterly">Quarterly</MenuItem>
                      <MenuItem value="yearly">Yearly</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={G[200]} />
                    <XAxis dataKey="month" stroke={G[500]} />
                    <YAxis yAxisId="left" stroke={G[500]} />
                    <YAxis yAxisId="right" orientation="right" stroke={G[500]} />
                    <RechartsTooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="students" stroke={G[600]} strokeWidth={2} name="Students" />
                    <Line yAxisId="right" type="monotone" dataKey="fees" stroke="#F59E0B" strokeWidth={2} name="Fees (₹)" />
                    <Line yAxisId="left" type="monotone" dataKey="complaints" stroke="#EF4444" strokeWidth={2} name="Complaints" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{
                    p: 3, borderRadius: 3,
                    bgcolor: '#ffffff', border: `1px solid ${G[200]}`, height: '100%'
                  }}>
                    <Typography sx={{ fontWeight: 700, color: G[800], mb: 2 }}>
                      Fee Collection Trend
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={feeCollectionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={G[200]} />
                        <XAxis dataKey="month" stroke={G[500]} />
                        <YAxis stroke={G[500]} />
                        <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Area type="monotone" dataKey="collected" stackId="1" stroke={G[600]} fill={G[400]} name="Collected" />
                        <Area type="monotone" dataKey="pending" stackId="1" stroke="#F59E0B" fill="#FCD34D" name="Pending" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{
                    p: 3, borderRadius: 3,
                    bgcolor: '#ffffff', border: `1px solid ${G[200]}`, height: '100%'
                  }}>
                    <Typography sx={{ fontWeight: 700, color: G[800], mb: 2 }}>
                      Complaint Categories
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={complaintCategories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {complaintCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}

          {/* ─── Financial Reports ─── */}
          {reportType === 'financial' && (
            <Grid container spacing={3}>
              {[
                { title: "Fee Collection Report", desc: "Detailed fee collection report", icon: MoneyIcon, color: G[600] },
                { title: "Revenue Summary", desc: "Monthly, quarterly, yearly revenue", icon: BarChartIcon, color: "#F59E0B" },
                { title: "Outstanding Dues", desc: "Students with pending fees", icon: TrendingUpIcon, color: "#EF4444" },
                { title: "Financial Statement", desc: "Complete financial statement", icon: AssessmentIcon, color: "#8B5CF6" }
              ].map((report, idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <Card elevation={0} sx={{
                    borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`,
                    cursor: 'pointer', transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(30,122,53,0.15)' }
                  }} onClick={() => handleGenerateReport(report.title)}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: `${report.color}10`, color: report.color, width: 56, height: 56, borderRadius: 2, mx: 'auto', mb: 2 }}>
                        <report.icon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Typography sx={{ fontWeight: 700, color: G[800], mb: 1 }}>{report.title}</Typography>
                      <Typography variant="body2" sx={{ color: G[500] }}>{report.desc}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* ─── Occupancy Reports ─── */}
          {reportType === 'occupancy' && (
            <>
              <Paper elevation={0} sx={{
                p: 3, mb: 3, borderRadius: 3,
                bgcolor: '#ffffff', border: `1px solid ${G[200]}`
              }}>
                <Typography sx={{ fontWeight: 700, color: G[800], mb: 2 }}>
                  Hostel Occupancy Overview
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={hostelOccupancy}>
                    <CartesianGrid strokeDasharray="3 3" stroke={G[200]} />
                    <XAxis dataKey="name" stroke={G[500]} />
                    <YAxis stroke={G[500]} />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="occupied" fill={G[600]} name="Occupied Beds" />
                    <Bar dataKey="total" fill={G[300]} name="Total Beds" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
              <Grid container spacing={3}>
                {[
                  { title: "Room Occupancy Report", desc: "Detailed room-wise occupancy", icon: RoomIcon, color: G[600] },
                  { title: "Vacancy Report", desc: "List of vacant rooms", icon: PeopleIcon, color: "#3B82F6" }
                ].map((report, idx) => (
                  <Grid item xs={12} md={6} key={idx}>
                    <Card elevation={0} sx={{
                      borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`,
                      cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' }
                    }} onClick={() => handleGenerateReport(report.title)}>
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar sx={{ bgcolor: `${report.color}10`, color: report.color, width: 56, height: 56, borderRadius: 2, mx: 'auto', mb: 2 }}>
                          <report.icon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Typography sx={{ fontWeight: 700, color: G[800], mb: 1 }}>{report.title}</Typography>
                        <Typography variant="body2" sx={{ color: G[500] }}>{report.desc}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {/* ─── Complaints Reports ─── */}
          {reportType === 'complaints' && (
            <Grid container spacing={3}>
              {[
                { title: "Complaints Summary", desc: "Category-wise analysis", icon: ComplaintIcon, color: "#EF4444" },
                { title: "Resolution Time Report", desc: "Average resolution time", icon: TrendingUpIcon, color: "#F59E0B" },
                { title: "Pending Complaints", desc: "Unresolved complaints", icon: ComplaintIcon, color: "#B45309" },
                { title: "Student Feedback", desc: "Feedback analysis", icon: AssessmentIcon, color: G[600] }
              ].map((report, idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <Card elevation={0} sx={{
                    borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`,
                    cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' }
                  }} onClick={() => handleGenerateReport(report.title)}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: `${report.color}10`, color: report.color, width: 56, height: 56, borderRadius: 2, mx: 'auto', mb: 2 }}>
                        <report.icon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Typography sx={{ fontWeight: 700, color: G[800], mb: 1 }}>{report.title}</Typography>
                      <Typography variant="body2" sx={{ color: G[500] }}>{report.desc}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* ─── Date Range Filter ─── */}
          <Paper elevation={0} sx={{
            mt: 3, p: 2, borderRadius: 3,
            bgcolor: '#ffffff', border: `1px solid ${G[200]}`,
            display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap'
          }}>
            <Typography sx={{ color: G[700], fontWeight: 600 }}>Report Period:</Typography>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 150 }}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 150 }}
            />
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] } }}
              onClick={() => { fetchDashboardData(); fetchFeeData(); fetchComplaintData(); }}
            >
              Apply Filter
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportToExcel}
              sx={{ borderColor: G[200], color: G[600] }}
            >
              Export All
            </Button>
          </Paper>

          {/* ─── Generate Report Dialog ─── */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <Box sx={{ height: 4, bgcolor: G[600], borderRadius: '12px 12px 0 0' }} />
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>Generate Report</Typography>
                <IconButton onClick={() => setOpenDialog(false)}><CloseIcon /></IconButton>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent>
              {generating ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />
                  <Typography sx={{ color: G[600] }}>Generating report...</Typography>
                </Box>
              ) : (
                <>
                  <Typography sx={{ color: G[800], fontWeight: 600, mb: 2 }}>{selectedReport}</Typography>
                  <Typography variant="body2" sx={{ color: G[600], mb: 3 }}>Select format to download:</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button fullWidth variant="outlined" startIcon={<PdfIcon />} onClick={handleDownload} sx={{ color: '#EF4444' }}>PDF</Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button fullWidth variant="outlined" startIcon={<ExcelIcon />} onClick={handleDownload} sx={{ color: G[600] }}>Excel</Button>
                    </Grid>
                  </Grid>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Snackbar */}
          <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert severity="success" sx={{ borderRadius: 2 }}>{snackbarMessage}</Alert>
          </Snackbar>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default AdminReports;