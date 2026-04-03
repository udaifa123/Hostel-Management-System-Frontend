import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const steps = ['Personal Information', 'Academic Details', 'Hostel Assignment', 'Review'];

const WardenAddStudent = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    parentPhone: '',
    address: '',
    
    // Academic Details
    registrationNumber: '',
    rollNumber: '',
    course: '',
    branch: '',
    year: 1,
    semester: 1,
    batch: new Date().getFullYear().toString(),
    
    // Hostel Assignment
    roomNumber: '',
    block: 'A'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.phone) newErrors.phone = 'Phone number is required';
    }
    
    if (step === 1) {
      if (!formData.course) newErrors.course = 'Course is required';
      if (!formData.branch) newErrors.branch = 'Branch is required';
      if (!formData.year) newErrors.year = 'Year is required';
      if (!formData.semester) newErrors.semester = 'Semester is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;
    
    setLoading(true);
    try {
      console.log('📝 Creating student:', formData);
      
      const response = await axios.post(
        `${API_URL}/warden/students`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          parentPhone: formData.parentPhone,
          address: formData.address,
          registrationNumber: formData.registrationNumber,
          rollNumber: formData.rollNumber,
          course: formData.course,
          branch: formData.branch,
          year: parseInt(formData.year),
          semester: parseInt(formData.semester),
          batch: formData.batch,
          roomNumber: formData.roomNumber,
          block: formData.block
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Student created:', response.data);
      
      setSnackbar({
        open: true,
        message: 'Student created successfully!',
        severity: 'success'
      });
      
      setTimeout(() => {
        navigate('/warden/students');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error:', error.response?.data || error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to create student',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#10b981' }}>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password *"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm Password *"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number *"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Parent Phone"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
        
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#10b981' }}>
                Academic Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Registration Number"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="Auto-generated if empty"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Roll Number"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="Auto-generated if empty"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.course}>
                <InputLabel>Course *</InputLabel>
                <Select
                  name="course"
                  value={formData.course}
                  label="Course *"
                  onChange={handleChange}
                >
                  <MenuItem value="BCA">BCA</MenuItem>
                  <MenuItem value="BBA">BBA</MenuItem>
                  <MenuItem value="B.Tech">B.Tech</MenuItem>
                  <MenuItem value="B.Com">B.Com</MenuItem>
                  <MenuItem value="MCA">MCA</MenuItem>
                  <MenuItem value="MBA">MBA</MenuItem>
                </Select>
                {errors.course && <Typography color="error" variant="caption">{errors.course}</Typography>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Branch/Specialization *"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                error={!!errors.branch}
                helperText={errors.branch}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Year *"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                error={!!errors.year}
                helperText={errors.year}
                required
                inputProps={{ min: 1, max: 4 }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Semester *"
                name="semester"
                type="number"
                value={formData.semester}
                onChange={handleChange}
                error={!!errors.semester}
                helperText={errors.semester}
                required
                inputProps={{ min: 1, max: 8 }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Batch"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                placeholder="e.g., 2024-2027"
              />
            </Grid>
          </Grid>
        );
        
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#10b981' }}>
                Hostel Assignment
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Room Number"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="Leave empty to assign later"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Block</InputLabel>
                <Select
                  name="block"
                  value={formData.block}
                  label="Block"
                  onChange={handleChange}
                >
                  <MenuItem value="A">Block A</MenuItem>
                  <MenuItem value="B">Block B</MenuItem>
                  <MenuItem value="C">Block C</MenuItem>
                  <MenuItem value="D">Block D</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Alert severity="info">
                Room assignment is optional. You can assign a room later.
              </Alert>
            </Grid>
          </Grid>
        );
        
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#10b981' }}>
                Review Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Card sx={{ mb: 3, bgcolor: '#f8fafc' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Personal Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}><Typography color="textSecondary">Name:</Typography></Grid>
                    <Grid item xs={8}><Typography fontWeight="bold">{formData.name}</Typography></Grid>
                    <Grid item xs={4}><Typography color="textSecondary">Email:</Typography></Grid>
                    <Grid item xs={8}><Typography fontWeight="bold">{formData.email}</Typography></Grid>
                    <Grid item xs={4}><Typography color="textSecondary">Phone:</Typography></Grid>
                    <Grid item xs={8}><Typography fontWeight="bold">{formData.phone}</Typography></Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Card sx={{ mb: 3, bgcolor: '#f8fafc' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Academic Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}><Typography color="textSecondary">Course:</Typography></Grid>
                    <Grid item xs={8}><Typography fontWeight="bold">{formData.course}</Typography></Grid>
                    <Grid item xs={4}><Typography color="textSecondary">Branch:</Typography></Grid>
                    <Grid item xs={8}><Typography fontWeight="bold">{formData.branch}</Typography></Grid>
                    <Grid item xs={4}><Typography color="textSecondary">Year/Sem:</Typography></Grid>
                    <Grid item xs={8}><Typography fontWeight="bold">Year {formData.year} / Sem {formData.semester}</Typography></Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Card sx={{ bgcolor: '#f8fafc' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Hostel Assignment
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}><Typography color="textSecondary">Room:</Typography></Grid>
                    <Grid item xs={8}><Typography fontWeight="bold">{formData.roomNumber || 'Not assigned'}</Typography></Grid>
                    <Grid item xs={4}><Typography color="textSecondary">Block:</Typography></Grid>
                    <Grid item xs={8}><Typography fontWeight="bold">Block {formData.block}</Typography></Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/warden/students')}
        >
          Back to Students
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Add New Student
        </Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
              >
                {loading ? 'Creating...' : 'Create Student'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default WardenAddStudent;