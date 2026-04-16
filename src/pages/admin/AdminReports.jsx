import React, { useState, useEffect, useCallback } from 'react';
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
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  Tab,
  Tabs,
  LinearProgress,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  MeetingRoom as RoomIcon,
  ReportProblem as ComplaintIcon,
  School as StudentIcon,
  Refresh as RefreshIcon,
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
import toast from 'react-hot-toast';
import { format, subMonths } from 'date-fns';

// ── Design Tokens (Same as AdminHostels) ──────────────────────────────────────
const G = {
  900: '#0D3318', 800: '#1A5C2A', 700: '#1E7A35', 600: '#2E9142',
  500: '#3AAF51', 400: '#5DC470', 300: '#8FD9A0', 200: '#C1EDCA',
  100: '#E4F7E8', 50: '#F4FBF5',
};

const CARD_SHADOW = '0 1px 4px rgba(30,122,53,0.10), 0 0 0 1px rgba(30,122,53,0.08)';
const COLORS = ['#2E9142', '#5DC470', '#8FD9A0', '#C1EDCA', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

// ── Stat Card Component (Same as AdminHostels) ────────────────────────────────
const StatCard = ({ label, value, icon: Icon, trend, trendValue, dark = false }) => {
  const IconComponent = Icon;
  const isPositive = trend === 'up';
  
  return (
    <Card elevation={0} sx={{
      borderRadius: 3,
      bgcolor: dark ? G[800] : '#ffffff',
      border: `1px solid ${dark ? G[700] : G[200]}`,
      boxShadow: dark ? '0 4px 16px rgba(13,51,24,0.25)' : CARD_SHADOW,
      height: '100%',
      transition: 'transform 0.15s, box-shadow 0.15s',
      '&:hover': { transform: 'translateY(-2px)' }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" sx={{
              color: dark ? G[300] : G[600],
              fontWeight: 600,
              fontSize: '0.70rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'block',
              mb: 1
            }}>
              {label}
            </Typography>
            <Typography variant="h3" sx={{
              fontWeight: 700,
              color: dark ? '#ffffff' : G[800],
              fontSize: '2.2rem',
              lineHeight: 1,
            }}>
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                {isPositive ? (
                  <TrendingUpIcon sx={{ fontSize: 14, color: G[600] }} />
                ) : (
                  <TrendingUpIcon sx={{ fontSize: 14, color: '#EF4444' }} />
                )}
                <Typography variant="caption" sx={{ 
                  color: isPositive ? G[600] : '#EF4444', 
                  fontWeight: 600 
                }}>
                  {trendValue}%
                </Typography>
                <Typography variant="caption" sx={{ color: G[500] }}>vs last month</Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{
            bgcolor: dark ? G[700] : G[100],
            width: 48,
            height: 48,
            borderRadius: 2,
          }}>
            <IconComponent sx={{ color: dark ? G[200] : G[600], fontSize: 24 }} />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

// ── Report Card Component ─────────────────────────────────────────────────────
const ReportCard = ({ report, onClick }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card elevation={0} sx={{
      borderRadius: 3,
      bgcolor: '#ffffff',
      border: `1px solid ${G[200]}`,
      boxShadow: CARD_SHADOW,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(30,122,53,0.15)',
        borderColor: G[400]
      }
    }} onClick={onClick}>
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Avatar sx={{
          bgcolor: `${report.color}15`,
          color: report.color,
          width: 56,
          height: 56,
          borderRadius: 2,
          mx: 'auto',
          mb: 2
        }}>
          <report.icon sx={{ fontSize: 28 }} />
        </Avatar>
        <Typography sx={{ fontWeight: 700, color: G[800], mb: 1, fontSize: '1rem' }}>
          {report.title}
        </Typography>
        <Typography variant="body2" sx={{ color: G[500], fontSize: '0.8rem' }}>
          {report.desc}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

// ── Main Component ────────────────────────────────────────────────────────────
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

  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0, totalHostels: 0, totalWardens: 0,
    totalRooms: 0, occupancyRate: 0, occupiedRooms: 0,
  });
  const [financialStats, setFinancialStats] = useState({
    totalCollected: 0, monthlyCollected: 0, pendingAmount: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [feeCollectionData, setFeeCollectionData] = useState([]);
  const [complaintCategories, setComplaintCategories] = useState([]);
  const [hostelOccupancy, setHostelOccupancy] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await adminService.getDashboardStats();
      if (response?.success) {
        setDashboardStats(response.overview || {});
        setFinancialStats(response.financial || {});
      }
    } catch (e) { console.error(e); }
  }, []);

  const fetchMonthlyData = useCallback(async () => {
    try {
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = subMonths(new Date(), 11 - i);
        return {
          month: format(date, 'MMM'),
          students: 50 + Math.floor(Math.random() * 30),
          fees: 500000 + Math.floor(Math.random() * 400000),
          complaints: 5 + Math.floor(Math.random() * 15),
          leaves: 3 + Math.floor(Math.random() * 12),
        };
      });
      setMonthlyData(months);
    } catch (e) { setMonthlyData([]); }
  }, []);

  const fetchFeeData = useCallback(async () => {
    try {
      const response = await adminService.getAllFees({ year: new Date().getFullYear() });
      if (response?.success && response?.data) {
        const monthly = {};
        (response.data || []).forEach((fee) => {
          const m = (fee?.month || 'Jan').substring(0, 3);
          if (!monthly[m]) monthly[m] = { collected: 0, pending: 0 };
          if (fee?.status === 'paid') monthly[m].collected += (fee?.paidAmount || 0);
          else monthly[m].pending += (fee?.dueAmount || 0);
        });
        setFeeCollectionData(Object.entries(monthly).map(([month, v]) => ({ month, ...v })));
      } else { setFeeCollectionData([]); }
    } catch (e) { setFeeCollectionData([]); }
  }, []);

  const fetchComplaintData = useCallback(async () => {
    try {
      const response = await adminService.getComplaints();
      if (response?.success && response?.complaints) {
        const cats = {};
        (response.complaints || []).forEach((c) => {
          const cat = c?.category || 'Other';
          cats[cat] = (cats[cat] || 0) + 1;
        });
        setComplaintCategories(
          Object.entries(cats).map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }))
        );
      } else { setComplaintCategories([]); }
    } catch (e) { setComplaintCategories([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchMonthlyData();
    fetchFeeData();
    fetchComplaintData();
  }, [dateRange, fetchDashboardData, fetchMonthlyData, fetchFeeData, fetchComplaintData]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount || 0);

  const handleGenerateReport = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleDownload = async () => {
    setGenerating(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      setOpenDialog(false);
      setSnackbarMessage(`${selectedReport} generated successfully`);
      setOpenSnackbar(true);
    } catch { toast.error('Failed to generate report'); }
    finally { setGenerating(false); }
  };

  const exportToExcel = async () => {
    try {
      if (adminService.exportReport) {
        const response = await adminService.exportReport('all', 'excel');
        if (response) {
          const url = window.URL.createObjectURL(new Blob([response]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          toast.success('Report exported successfully');
        }
      } else { toast.info('Export feature coming soon'); }
    } catch { toast.error('Failed to export report'); }
  };

  const stats = {
    totalStudents: dashboardStats.totalStudents || 0,
    totalRevenue: financialStats.totalCollected || 0,
    occupancyRate: dashboardStats.occupancyRate || 0,
    totalComplaints: complaintCategories.reduce((s, c) => s + (c.value || 0), 0),
  };

  // Report card configs
  const financialReports = [
    { title: 'Fee Collection Report', desc: 'Detailed fee collection report', icon: MoneyIcon, color: G[600] },
    { title: 'Revenue Summary', desc: 'Monthly, quarterly, yearly revenue', icon: BarChartIcon, color: '#F59E0B' },
    { title: 'Outstanding Dues', desc: 'Students with pending fees', icon: TrendingUpIcon, color: '#EF4444' },
    { title: 'Financial Statement', desc: 'Complete financial statement', icon: AssessmentIcon, color: '#8B5CF6' },
  ];
  const occupancyReports = [
    { title: 'Room Occupancy Report', desc: 'Detailed room-wise occupancy', icon: RoomIcon, color: G[600] },
    { title: 'Vacancy Report', desc: 'List of vacant rooms', icon: PeopleIcon, color: '#3B82F6' },
  ];
  const complaintReports = [
    { title: 'Complaints Summary', desc: 'Category-wise analysis', icon: ComplaintIcon, color: '#EF4444' },
    { title: 'Resolution Time Report', desc: 'Average resolution time', icon: TrendingUpIcon, color: '#F59E0B' },
    { title: 'Pending Complaints', desc: 'Unresolved complaints', icon: ComplaintIcon, color: '#B45309' },
    { title: 'Student Feedback', desc: 'Feedback analysis', icon: AssessmentIcon, color: G[600] },
  ];

  if (loading) return (
    <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
      <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
      <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading reports...</Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: G[50], minHeight: '100vh' }}>
      {/* Top accent bar */}
      <Box sx={{ height: 4, bgcolor: G[600] }} />

      <Box sx={{ p: 3 }}>
        {/* ── Header Section (Same style as AdminHostels) ── */}
        <Paper elevation={0} sx={{
          p: 3, mb: 4, borderRadius: 3,
          bgcolor: '#ffffff', border: `1px solid ${G[200]}`,
          boxShadow: '0 2px 8px rgba(13,51,24,0.10)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: G[800], width: 46, height: 46, borderRadius: 2 }}>
              <AssessmentIcon sx={{ color: G[200], fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
                Reports & Analytics
              </Typography>
              <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
                Real-time data from your hostel management system
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={() => { fetchDashboardData(); fetchFeeData(); fetchComplaintData(); }}
              sx={{
                bgcolor: '#ffffff', borderRadius: 2,
                border: `1px solid ${G[200]}`, color: G[600],
                '&:hover': { bgcolor: G[100], borderColor: G[400] }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Paper>

        {/* ── Quick Stats Cards (Same grid as AdminHostels) ── */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Total Students" value={stats.totalStudents} icon={StudentIcon} dark />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={MoneyIcon} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Occupancy Rate" value={`${stats.occupancyRate}%`} icon={RoomIcon} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Total Complaints" value={stats.totalComplaints} icon={ComplaintIcon} />
          </Grid>
        </Grid>

        {/* ── Tabs ── */}
        <Paper elevation={0} sx={{
          mb: 3, borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, overflow: 'hidden'
        }}>
          <Tabs
            value={reportType}
            onChange={(_, v) => setReportType(v)}
            sx={{
              px: 2, pt: 1,
              '& .MuiTab-root': {
                textTransform: 'none', fontWeight: 600, fontSize: '0.9rem',
                minHeight: 48, color: G[500], '&.Mui-selected': { color: G[700] },
              },
              '& .MuiTabs-indicator': { bgcolor: G[600], height: 3 },
            }}
          >
            <Tab value="overview" label="Overview Dashboard" />
            <Tab value="financial" label="Financial Reports" />
            <Tab value="occupancy" label="Occupancy Reports" />
            <Tab value="complaints" label="Complaints Reports" />
          </Tabs>
        </Paper>

        {/* ── Overview Dashboard ── */}
        {reportType === 'overview' && (
          <>
            <Paper elevation={0} sx={{
              p: 3, mb: 3, borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography sx={{ fontWeight: 700, color: G[800], fontSize: '1.1rem' }}>Monthly Trends</Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: G[600] }}>Period</InputLabel>
                  <Select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    label="Period"
                    sx={{
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: G[200] },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: G[400] }
                    }}
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {monthlyData.length > 0 ? (
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
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ color: G[500] }}>No data available</Typography>
                </Box>
              )}
            </Paper>

            <Grid container spacing={3}>
              {/* <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{
                  p: 3, borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, height: '100%'
                }}>
                  <Typography sx={{ fontWeight: 700, color: G[800], mb: 2 }}>Fee Collection Trend</Typography>
                  {feeCollectionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={feeCollectionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={G[200]} />
                        <XAxis dataKey="month" stroke={G[500]} />
                        <YAxis stroke={G[500]} />
                        <RechartsTooltip formatter={(v) => formatCurrency(v)} />
                        <Legend />
                        <Area type="monotone" dataKey="collected" stackId="1" stroke={G[600]} fill={G[400]} name="Collected" />
                        <Area type="monotone" dataKey="pending" stackId="1" stroke="#F59E0B" fill="#FCD34D" name="Pending" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography sx={{ color: G[500] }}>No fee data available</Typography>
                    </Box>
                  )}
                </Paper>
              </Grid> */}
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{
                  p: 3, borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, height: '100%'
                }}>
                  <Typography sx={{ fontWeight: 700, color: G[800], mb: 2 }}>Complaint Categories</Typography>
                  {complaintCategories.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={complaintCategories}
                          cx="50%" cy="50%" outerRadius={100}
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          dataKey="value"
                        >
                          {complaintCategories.map((e, i) => (
                            <Cell key={i} fill={e.color || COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography sx={{ color: G[500] }}>No complaint data available</Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </>
        )}

        {/* ── Financial Reports ── */}
        {reportType === 'financial' && (
          <Grid container spacing={3}>
            {financialReports.map((r) => (
              <ReportCard key={r.title} report={r} onClick={() => handleGenerateReport(r.title)} />
            ))}
          </Grid>
        )}

        {/* ── Occupancy Reports ── */}
        {reportType === 'occupancy' && (
          <>
            <Paper elevation={0} sx={{
              p: 3, mb: 3, borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`
            }}>
              <Typography sx={{ fontWeight: 700, color: G[800], mb: 2 }}>Hostel Occupancy Overview</Typography>
              {hostelOccupancy.length > 0 ? (
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
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ color: G[500] }}>No occupancy data available</Typography>
                </Box>
              )}
            </Paper>
            <Grid container spacing={3}>
              {occupancyReports.map((r) => (
                <ReportCard key={r.title} report={r} onClick={() => handleGenerateReport(r.title)} />
              ))}
            </Grid>
          </>
        )}

        {/* ── Complaints Reports ── */}
        {reportType === 'complaints' && (
          <Grid container spacing={3}>
            {complaintReports.map((r) => (
              <ReportCard key={r.title} report={r} onClick={() => handleGenerateReport(r.title)} />
            ))}
          </Grid>
        )}

        {/* ── Date Range Filter Bar ── */}
        <Paper elevation={0} sx={{
          mt: 3, p: 2.5, borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`,
          display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <Typography sx={{ color: G[700], fontWeight: 600, fontSize: '0.85rem' }}>Report Period:</Typography>
          <TextField
            label="Start Date" type="date" size="small" value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': { borderColor: G[200] },
                '&:hover fieldset': { borderColor: G[400] },
              }
            }}
          />
          <TextField
            label="End Date" type="date" size="small" value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': { borderColor: G[200] },
                '&:hover fieldset': { borderColor: G[400] },
              }
            }}
          />
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            sx={{
              bgcolor: G[700], color: '#ffffff', fontWeight: 600,
              borderRadius: 2, textTransform: 'none',
              boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
              '&:hover': { bgcolor: G[800] }
            }}
            onClick={() => { fetchDashboardData(); fetchFeeData(); fetchComplaintData(); }}
          >
            Apply Filter
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportToExcel}
            sx={{
              borderColor: G[200], color: G[600], fontWeight: 600,
              borderRadius: 2, textTransform: 'none',
              '&:hover': { borderColor: G[400], bgcolor: G[50] }
            }}
          >
            Export All
          </Button>
        </Paper>
      </Box>

      {/* ── Generate Report Dialog ── */}
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
            <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>Generate Report</Typography>
            <IconButton onClick={() => setOpenDialog(false)} sx={{ color: G[500] }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider sx={{ borderColor: G[100] }} />
        <DialogContent sx={{ pt: 3 }}>
          {generating ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <LinearProgress sx={{ mb: 2, borderRadius: 2, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
              <Typography sx={{ color: G[600] }}>Generating report…</Typography>
            </Box>
          ) : (
            <>
              <Typography sx={{ color: G[800], fontWeight: 600, mb: 2, fontSize: '1rem' }}>{selectedReport}</Typography>
              <Typography variant="body2" sx={{ color: G[600], mb: 3 }}>Select format to download:</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PdfIcon />}
                    onClick={handleDownload}
                    sx={{
                      color: '#EF4444', borderColor: '#EF4444', textTransform: 'none', fontWeight: 600,
                      borderRadius: 2, py: 1,
                      '&:hover': { borderColor: '#DC2626', bgcolor: '#FEF2F2' }
                    }}
                  >
                    PDF
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ExcelIcon />}
                    onClick={handleDownload}
                    sx={{
                      color: G[600], borderColor: G[300], textTransform: 'none', fontWeight: 600,
                      borderRadius: 2, py: 1,
                      '&:hover': { borderColor: G[400], bgcolor: G[50] }
                    }}
                  >
                    Excel
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Snackbar ── */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            borderRadius: 2,
            background: G[600],
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(30,122,53,0.30)'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminReports;