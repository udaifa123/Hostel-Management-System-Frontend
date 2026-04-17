import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  IconButton,
  Avatar,
  LinearProgress,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Tooltip,
  alpha,
  Stack,
  Rating
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Build as BuildIcon,
  ElectricalServices as ElectricalIcon,
  Plumbing as PlumbingIcon,
  CleaningServices as CleaningIcon,
  AcUnit as AcIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Comment as CommentIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

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

const ProgressBar = ({ value, label, color, total }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" sx={{ color: G[600], fontWeight: 500 }}>{label}</Typography>
        <Typography variant="caption" sx={{ color: G[600], fontWeight: 600 }}>{percentage.toFixed(1)}%</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: G[100],
          '& .MuiLinearProgress-bar': {
            bgcolor: color || G[600],
            borderRadius: 4,
          }
        }}
      />
    </Box>
  );
};

const StatsCard = ({ title, value, total, color, icon, subtitle }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <Card sx={{ borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, overflow: 'hidden' }}>
      <Box sx={{ height: 4, bgcolor: color || G[600] }} />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography sx={{ color: G[600], fontSize: '0.7rem', textTransform: 'uppercase', mb: 0.5 }}>
              {title}
            </Typography>
            <Typography sx={{ fontWeight: 700, color: G[800], fontSize: '2rem', lineHeight: 1 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: G[500], mt: 0.5, display: 'block' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: alpha(color || G[600], 0.1), color: color || G[600] }}>
            {icon}
          </Avatar>
        </Box>
        {total > 0 && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: G[100],
                '& .MuiLinearProgress-bar': { bgcolor: color || G[600], borderRadius: 3 }
              }}
            />
            <Typography variant="caption" sx={{ color: G[500], mt: 0.5, display: 'block', textAlign: 'right' }}>
              {percentage.toFixed(1)}% of total
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const WardenMaintenance = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [note, setNote] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'electrical',
    priority: 'medium',
    roomId: '',
    reportedBy: '',
    contactNumber: ''
  });
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [completionRate, setCompletionRate] = useState(0);
  const [avgResolutionTime, setAvgResolutionTime] = useState(0);

  useEffect(() => {
    fetchData();
    fetchRooms();
    fetchStudents();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [requestsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/maintenance`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/maintenance/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      let requestsData = [];
      if (requestsRes.data.success && requestsRes.data.data) {
        requestsData = requestsRes.data.data;
      } else if (Array.isArray(requestsRes.data)) {
        requestsData = requestsRes.data;
      }
      
      let statsData = null;
      if (statsRes.data.success && statsRes.data.data) {
        statsData = statsRes.data.data;
      } else if (statsRes.data) {
        statsData = statsRes.data;
      }
      
      setRequests(requestsData);
      setStats(statsData);
      
      const total = requestsData.length;
      const completed = requestsData.filter(r => r.status === 'completed').length;
      const rate = total > 0 ? (completed / total) * 100 : 0;
      setCompletionRate(rate);
      
      const completedRequests = requestsData.filter(r => r.status === 'completed' && r.startedAt && r.completedAt);
      if (completedRequests.length > 0) {
        const totalTime = completedRequests.reduce((sum, r) => {
          const start = new Date(r.startedAt);
          const end = new Date(r.completedAt);
          return sum + (end - start);
        }, 0);
        const avgHours = totalTime / completedRequests.length / (1000 * 60 * 60);
        setAvgResolutionTime(avgHours);
      }
      
    } catch (error) {
      console.error('Error fetching maintenance data:', error);
      toast.error('Failed to load maintenance data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/warden/rooms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let roomsData = [];
      if (response.data.success && response.data.data) {
        roomsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        roomsData = response.data;
      } else if (response.data.rooms && Array.isArray(response.data.rooms)) {
        roomsData = response.data.rooms;
      }
      
      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/warden/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let studentsData = [];
      if (response.data.success && response.data.students) {
        studentsData = response.data.students;
      } else if (Array.isArray(response.data)) {
        studentsData = response.data;
      }
      
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleCreateRequest = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill title and description');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/maintenance`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Maintenance request created successfully');
        setOpenDialog(false);
        setFormData({
          title: '',
          description: '',
          type: 'electrical',
          priority: 'medium',
          roomId: '',
          reportedBy: '',
          contactNumber: ''
        });
        fetchData();
      } else {
        toast.error(response.data.message || 'Failed to create request');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error(error.response?.data?.message || 'Failed to create request');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await axios.put(`${API_URL}/maintenance/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(`Maintenance ${status === 'in-progress' ? 'started' : status}`);
        fetchData();
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/maintenance/${selectedRequest._id}/notes`, { note }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Note added successfully');
        setOpenNoteDialog(false);
        setNote('');
        fetchData();
      } else {
        toast.error(response.data.message || 'Failed to add note');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return { bg: G[100], color: G[600], label: 'Completed' };
      case 'in-progress': return { bg: '#EFF6FF', color: '#3B82F6', label: 'In Progress' };
      case 'assigned': return { bg: '#FEF3C7', color: '#F59E0B', label: 'Assigned' };
      case 'pending': return { bg: '#FEF2F2', color: '#EF4444', label: 'Pending' };
      default: return { bg: '#F3F4F6', color: '#6B7280', label: status };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return { bg: '#FEF2F2', color: '#EF4444', label: 'Urgent' };
      case 'high': return { bg: '#FEF3C7', color: '#F59E0B', label: 'High' };
      case 'medium': return { bg: '#EFF6FF', color: '#3B82F6', label: 'Medium' };
      case 'low': return { bg: G[100], color: G[600], label: 'Low' };
      default: return { bg: '#F3F4F6', color: '#6B7280', label: priority };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'electrical': return <ElectricalIcon sx={{ fontSize: 20 }} />;
      case 'plumbing': return <PlumbingIcon sx={{ fontSize: 20 }} />;
      case 'cleaning': return <CleaningIcon sx={{ fontSize: 20 }} />;
      case 'ac': return <AcIcon sx={{ fontSize: 20 }} />;
      default: return <BuildIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'electrical': return 'Electrical';
      case 'plumbing': return 'Plumbing';
      case 'cleaning': return 'Cleaning';
      case 'ac': return 'AC';
      case 'carpentry': return 'Carpentry';
      case 'furniture': return 'Furniture';
      default: return type;
    }
  };

  const filteredRequests = requests.filter(req => {
    if (tabValue === 0) return req.status !== 'completed';
    if (tabValue === 1) return req.status === 'in-progress' || req.status === 'assigned';
    if (tabValue === 2) return req.status === 'pending';
    if (tabValue === 3) return req.status === 'completed';
    return true;
  });

  const getPriorityStats = () => {
    const priorities = ['urgent', 'high', 'medium', 'low'];
    return priorities.map(priority => {
      const total = requests.filter(r => r.priority === priority).length;
      const completed = requests.filter(r => r.priority === priority && r.status === 'completed').length;
      const percentage = total > 0 ? (completed / total) * 100 : 0;
      return { priority, total, completed, percentage };
    });
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>
          Loading maintenance requests...
        </Typography>
      </Box>
    );
  }

  const priorityStats = getPriorityStats();
  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.status === 'completed').length;

  return (
    <Box sx={{ bgcolor: G[50], minHeight: '100vh' }}>
      <Box sx={{ height: 4, bgcolor: G[600] }} />

      <Container maxWidth="xl" sx={{ py: 4 }}>
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
            <Avatar sx={{ bgcolor: G[800], width: 46, height: 46, borderRadius: 2 }}>
              <BuildIcon sx={{ color: G[200], fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
                Maintenance Management
              </Typography>
              <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
                Track and manage maintenance requests
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              bgcolor: G[700],
              color: '#ffffff',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': { bgcolor: G[800] }
            }}
          >
            New Request
          </Button>
        </Paper>

        <Card sx={{ mb: 4, borderRadius: 3, bgcolor: '#ffffff', border: `1px solid ${G[200]}`, overflow: 'hidden' }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SpeedIcon sx={{ color: G[600] }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
                Overall Maintenance Progress
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: G[600], fontWeight: 500 }}>
                      Completion Rate
                    </Typography>
                    <Typography variant="body2" sx={{ color: G[600], fontWeight: 700 }}>
                      {completionRate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={completionRate}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      bgcolor: G[100],
                      '& .MuiLinearProgress-bar': {
                        bgcolor: G[600],
                        borderRadius: 6,
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography variant="caption" sx={{ color: G[500] }}>Total Requests</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: G[800] }}>{totalRequests}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography variant="caption" sx={{ color: G[500] }}>Completed</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: G[600] }}>{completedRequests}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography variant="caption" sx={{ color: G[500] }}>Pending</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#EF4444' }}>{totalRequests - completedRequests}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ bgcolor: G[50], p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: G[600], mb: 1.5 }}>Priority Breakdown</Typography>
                  {priorityStats.map((stat) => (
                    <ProgressBar
                      key={stat.priority}
                      value={stat.completed}
                      total={stat.total}
                      label={stat.priority.charAt(0).toUpperCase() + stat.priority.slice(1)}
                      color={
                        stat.priority === 'urgent' ? '#EF4444' :
                        stat.priority === 'high' ? '#F59E0B' :
                        stat.priority === 'medium' ? '#3B82F6' : G[600]
                      }
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
            
            {avgResolutionTime > 0 && (
              <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${G[100]}`, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: G[600] }} />
                <Typography variant="caption" sx={{ color: G[600] }}>
                  Average resolution time: {avgResolutionTime.toFixed(1)} hours
                </Typography>
              </Box>
            )}
          </Box>
        </Card>

        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Pending"
              value={stats?.pending || 0}
              total={totalRequests}
              color="#EF4444"
              icon={<PendingIcon />}
              subtitle="Awaiting action"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="In Progress"
              value={stats?.inProgress || 0}
              total={totalRequests}
              color="#3B82F6"
              icon={<AssignmentIcon />}
              subtitle="Currently working"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Completed"
              value={stats?.completed || 0}
              total={totalRequests}
              color={G[600]}
              icon={<CheckCircleIcon />}
              subtitle="Successfully resolved"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Urgent"
              value={stats?.urgent || 0}
              total={totalRequests}
              color="#EF4444"
              icon={<SpeedIcon />}
              subtitle="High priority"
            />
          </Grid>
        </Grid>

        <Paper elevation={0} sx={{ mb: 3, borderRadius: 2.5, border: `1px solid ${G[200]}` }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                color: G[500],
                '&.Mui-selected': { color: G[700] }
              },
              '& .MuiTabs-indicator': { bgcolor: G[600], height: 3 }
            }}
          >
            <Tab label={`Active (${requests.filter(r => r.status !== 'completed').length})`} />
            <Tab label={`In Progress (${requests.filter(r => r.status === 'in-progress').length})`} />
            <Tab label={`Pending (${requests.filter(r => r.status === 'pending').length})`} />
            <Tab label={`Completed (${requests.filter(r => r.status === 'completed').length})`} />
          </Tabs>
        </Paper>

        <TableContainer component={Paper} elevation={0} sx={{
          borderRadius: 3,
          bgcolor: '#ffffff',
          border: `1px solid ${G[200]}`,
          boxShadow: CARD_SHADOW
        }}>
          <Table>
            <TableHead sx={{ bgcolor: G[50] }}>
              <TableRow>
                <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Request #</TableCell>
                <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Title/Type</TableCell>
                <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Room/Location</TableCell>
                <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Priority</TableCell>
                <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Status</TableCell>
                <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Progress</TableCell>
                <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Reported By</TableCell>
                <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Date</TableCell>
                <TableCell align="center" sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.map((req) => {
                const statusConfig = getStatusColor(req.status);
                const priorityConfig = getPriorityColor(req.priority);
                const roomName = req.roomId?.roomNumber ? `Room ${req.roomId.roomNumber}` : (req.roomNumber || 'N/A');
                const blockName = req.roomId?.block ? `Block ${req.roomId.block}` : '';
                const studentName = req.reportedBy?.name || req.studentName || 'Unknown';
                
                let progressValue = 0;
                if (req.status === 'pending') progressValue = 20;
                else if (req.status === 'assigned') progressValue = 40;
                else if (req.status === 'in-progress') progressValue = 70;
                else if (req.status === 'completed') progressValue = 100;
                
                return (
                  <TableRow key={req._id} hover sx={{ '&:hover': { bgcolor: G[50] } }}>
                    <TableCell sx={{ color: G[800], fontWeight: 600 }}>{req.requestNumber}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ bgcolor: alpha(G[600], 0.1), color: G[600], width: 32, height: 32 }}>
                          {getTypeIcon(req.type)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: G[800] }}>{req.title}</Typography>
                          <Typography variant="caption" sx={{ color: G[500], textTransform: 'capitalize' }}>
                            {getTypeLabel(req.type)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: G[700] }}>
                        {roomName} {blockName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={priorityConfig.label}
                        size="small"
                        sx={{ bgcolor: priorityConfig.bg, color: priorityConfig.color, fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={statusConfig.label}
                        size="small"
                        sx={{ bgcolor: statusConfig.bg, color: statusConfig.color, fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={progressValue}
                          sx={{
                            flex: 1,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: G[100],
                            '& .MuiLinearProgress-bar': {
                              bgcolor: req.status === 'completed' ? G[600] : 
                                      req.status === 'in-progress' ? '#3B82F6' : '#F59E0B',
                              borderRadius: 3,
                            }
                          }}
                        />
                        <Typography variant="caption" sx={{ color: G[600], fontWeight: 500, minWidth: 35 }}>
                          {progressValue}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: G[100], fontSize: '0.7rem', color: G[700] }}>
                          {studentName.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ color: G[700] }}>{studentName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: G[600] }}>
                        {new Date(req.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Add Note">
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            setSelectedRequest(req);
                            setOpenNoteDialog(true);
                          }}
                          sx={{ color: G[600], bgcolor: G[100], borderRadius: 1.5, mr: 1 }}
                        >
                          <CommentIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      {req.status === 'pending' && (
                        <Tooltip title="Start Work">
                          <IconButton 
                            size="small" 
                            onClick={() => handleUpdateStatus(req._id, 'in-progress')}
                            sx={{ color: '#3B82F6', bgcolor: '#EFF6FF', borderRadius: 1.5 }}
                          >
                            <AssignmentIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                      {req.status === 'in-progress' && (
                        <Tooltip title="Mark Complete">
                          <IconButton 
                            size="small" 
                            onClick={() => handleUpdateStatus(req._id, 'completed')}
                            sx={{ color: G[600], bgcolor: G[100], borderRadius: 1.5 }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <BuildIcon sx={{ fontSize: 48, color: G[400], mb: 1 }} />
                      <Typography sx={{ color: G[600] }}>No maintenance requests found</Typography>
                      <Button
                        variant="text"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                        sx={{ mt: 1, color: G[600] }}
                      >
                        Create New Request
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

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
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar sx={{ bgcolor: G[800], width: 38, height: 38, borderRadius: 1.5 }}>
                <BuildIcon sx={{ color: G[200], fontSize: 18 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
                New Maintenance Request
              </Typography>
            </Box>
          </DialogTitle>
          <Divider sx={{ borderColor: G[100] }} />
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: G[50] } }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    label="Type"
                  >
                    <MenuItem value="electrical">Electrical</MenuItem>
                    <MenuItem value="plumbing">Plumbing</MenuItem>
                    <MenuItem value="carpentry">Carpentry</MenuItem>
                    <MenuItem value="cleaning">Cleaning</MenuItem>
                    <MenuItem value="ac">AC</MenuItem>
                    <MenuItem value="furniture">Furniture</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: G[50] } }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: G[50] } }}>
                  <InputLabel>Room</InputLabel>
                  <Select
                    value={formData.roomId}
                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                    label="Room"
                  >
                    {rooms.map((room) => (
                      <MenuItem key={room._id} value={room._id}>
                        Room {room.roomNumber} {room.block ? `- Block ${room.block}` : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: G[50] } }}>
                  <InputLabel>Reported By</InputLabel>
                  <Select
                    value={formData.reportedBy}
                    onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                    label="Reported By"
                  >
                    {students.map((student) => (
                      <MenuItem key={student._id} value={student._id}>
                        {student.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <Divider sx={{ borderColor: G[100] }} />
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ color: G[600], border: `1px solid ${G[200]}`, px: 3 }}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleCreateRequest}
              sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] }, px: 3 }}
            >
              Create Request
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={openNoteDialog} 
          onClose={() => setOpenNoteDialog(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
            }
          }}
        >
          <Box sx={{ height: 4, bgcolor: G[600], borderRadius: '12px 12px 0 0' }} />
          <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
              Add Note
            </Typography>
          </DialogTitle>
          <Divider sx={{ borderColor: G[100] }} />
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add your remarks, updates, or notes..."
              sx={{ mt: 2 }}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  bgcolor: G[50],
                  '& fieldset': { borderColor: G[200] },
                }
              }}
            />
          </DialogContent>
          <Divider sx={{ borderColor: G[100] }} />
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button onClick={() => setOpenNoteDialog(false)} sx={{ color: G[600], border: `1px solid ${G[200]}`, px: 3 }}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleAddNote}
              sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] }, px: 3 }}
            >
              Add Note
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default WardenMaintenance;