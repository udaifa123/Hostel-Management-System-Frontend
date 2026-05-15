import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Paper,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  alpha,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  MeetingRoom as RoomIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const ParentStudents = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/parent/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Children
      </Typography>

      {students.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No students linked to your account
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {students.map((student) => (
            <Grid item xs={12} md={6} key={student._id}>
              <Card sx={{ 
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: '#10b981' }}>
                      {student.user?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {student.user?.name}
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip
                          size="small"
                          icon={<SchoolIcon />}
                          label={student.course}
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          icon={<RoomIcon />}
                          label={`Room ${student.room?.roomNumber}`}
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <List dense>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: alpha('#3b82f6', 0.1), width: 32, height: 32 }}>
                          <EmailIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Email"
                        secondary={student.user?.email}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: alpha('#10b981', 0.1), width: 32, height: 32 }}>
                          <PhoneIcon sx={{ fontSize: 16, color: '#10b981' }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Phone"
                        secondary={student.phone || 'N/A'}
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: alpha('#8b5cf6', 0.1), width: 32, height: 32 }}>
                          <SchoolIcon sx={{ fontSize: 16, color: '#8b5cf6' }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Year / Semester"
                        secondary={`Year ${student.year} • Semester ${student.semester}`}
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: alpha('#f97316', 0.1), width: 32, height: 32 }}>
                          <RoomIcon sx={{ fontSize: 16, color: '#f97316' }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Hostel"
                        secondary={student.hostel?.name || 'Not Assigned'}
                      />
                    </ListItem>
                  </List>

                  <Box display="flex" gap={2} mt={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(`/parent/student/${student._id}`)}
                      sx={{ bgcolor: '#10b981' }}
                    >
                      View Details
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate(`/parent/attendance/${student._id}`)}
                    >
                      Attendance
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ParentStudents;