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
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Delete as DeleteIcon,
  FamilyRestroom as FamilyIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const steps = ['Personal Information', 'Academic Details', 'Hostel Assignment', 'Parent/Guardian', 'Review'];

const WardenAddStudent = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openParentDialog, setOpenParentDialog] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    registrationNumber: '',
    rollNumber: '',
    course: '',
    branch: '',
    year: 1,
    semester: 1,
    batch: new Date().getFullYear().toString(),
    roomNumber: '',
    block: 'A',
    parents: []
  });

  const [parentForm, setParentForm] = useState({
    name: '',
    relation: '',
    phone: '',
    email: '',
    password: '', // ✅ ADDED: Password field for parent
    occupation: '',
    address: '',
    isPrimary: false,
    emergencyContact: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleParentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParentForm({
      ...parentForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addParent = () => {
    // Validate parent form
    if (!parentForm.name) {
      setSnackbar({ open: true, message: 'Parent name is required', severity: 'error' });
      return;
    }
    if (!parentForm.relation) {
      setSnackbar({ open: true, message: 'Relation is required', severity: 'error' });
      return;
    }
    if (!parentForm.phone) {
      setSnackbar({ open: true, message: 'Phone number is required', severity: 'error' });
      return;
    }
    if (!parentForm.email) {
      setSnackbar({ open: true, message: 'Email is required for parent login', severity: 'error' });
      return;
    }
    // ✅ ADDED: Password validation
    if (!parentForm.password) {
      setSnackbar({ open: true, message: 'Password is required for parent login', severity: 'error' });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(parentForm.email)) {
      setSnackbar({ open: true, message: 'Please enter a valid email address', severity: 'error' });
      return;
    }

    if (editingParent !== null) {
      const updatedParents = [...formData.parents];
      updatedParents[editingParent] = { ...parentForm, id: Date.now() };
      setFormData({ ...formData, parents: updatedParents });
      setSnackbar({ open: true, message: 'Parent updated successfully', severity: 'success' });
    } else {
      setFormData({
        ...formData,
        parents: [...formData.parents, { ...parentForm, id: Date.now() }]
      });
      setSnackbar({ open: true, message: 'Parent added successfully', severity: 'success' });
    }
    
    setParentForm({
      name: '',
      relation: '',
      phone: '',
      email: '',
      password: '', // Reset password field
      occupation: '',
      address: '',
      isPrimary: false,
      emergencyContact: false
    });
    setEditingParent(null);
    setOpenParentDialog(false);
  };

  const editParent = (index) => {
    setParentForm(formData.parents[index]);
    setEditingParent(index);
    setOpenParentDialog(true);
  };

  const removeParent = (index) => {
    const updatedParents = formData.parents.filter((_, i) => i !== index);
    setFormData({ ...formData, parents: updatedParents });
    setSnackbar({ open: true, message: 'Parent removed successfully', severity: 'success' });
  };

  const setPrimaryParent = (index) => {
    const updatedParents = formData.parents.map((parent, i) => ({
      ...parent,
      isPrimary: i === index
    }));
    setFormData({ ...formData, parents: updatedParents });
    setSnackbar({ open: true, message: 'Primary parent updated', severity: 'success' });
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
    
    if (step === 3) {
      if (formData.parents.length === 0) {
        newErrors.parents = 'At least one parent/guardian is required';
      }
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
      const response = await axios.post(
        `${API_URL}/warden/students`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          registrationNumber: formData.registrationNumber,
          rollNumber: formData.rollNumber,
          course: formData.course,
          branch: formData.branch,
          year: parseInt(formData.year),
          semester: parseInt(formData.semester),
          batch: formData.batch,
          roomNumber: formData.roomNumber,
          block: formData.block,
          parents: formData.parents.map(parent => ({
            name: parent.name,
            email: parent.email,
            phone: parent.phone,
            password: parent.password, // ✅ ADDED: Send password to backend
            relation: parent.relation,
            occupation: parent.occupation,
            address: parent.address,
            isPrimary: parent.isPrimary,
            emergencyContact: parent.emergencyContact
          }))
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Build parent login message
      let parentMessage = '';
      if (response.data.parentLogins && response.data.parentLogins.length > 0) {
        parentMessage = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        parentMessage += '📋 PARENT LOGIN CREDENTIALS:\n';
        parentMessage += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        response.data.parentLogins.forEach((p) => {
          parentMessage += `\n👤 ${p.name} (${p.relation})\n`;
          parentMessage += `   📧 Email: ${p.email}\n`;
          parentMessage += `   🔐 Password: ${p.password}\n`;
          if (p.phone) parentMessage += `   📞 Phone: ${p.phone}\n`;
        });
        parentMessage += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        parentMessage += '⚠️ Please save these credentials and share with parents!\n';
        parentMessage += 'Parents can login using their Email and Password';
      }
      
      // Show alert with credentials
      alert(`✅ Student Created Successfully!${parentMessage}`);
      
      setSnackbar({
        open: true,
        message: `✅ Student created successfully! ${response.data.parentLogins?.length || 0} parent(s) linked.`,
        severity: 'success'
      });
      
      setTimeout(() => {
        navigate('/warden/students');
      }, 3000);
      
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
              <Typography variant="h6" gutterBottom sx={{ color: '#10b981' }}>Personal Information</Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Full Name *" name="name" value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email *" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Password *" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} required InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Confirm Password *" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Phone Number *" name="phone" value={formData.phone} onChange={handleChange} error={!!errors.phone} helperText={errors.phone} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Address" name="address" multiline rows={2} value={formData.address} onChange={handleChange} />
            </Grid>
          </Grid>
        );
        
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#10b981' }}>Academic Details</Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="Auto-generated if empty" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Roll Number" name="rollNumber" value={formData.rollNumber} onChange={handleChange} placeholder="Auto-generated if empty" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.course}>
                <InputLabel>Course *</InputLabel>
                <Select name="course" value={formData.course} label="Course *" onChange={handleChange}>
                  <MenuItem value="BCA">BCA</MenuItem>
                  <MenuItem value="BBA">BBA</MenuItem>
                  <MenuItem value="B.Tech">B.Tech</MenuItem>
                  <MenuItem value="B.Com">B.Com</MenuItem>
                  <MenuItem value="MCA">MCA</MenuItem>
                  <MenuItem value="MBA">MBA</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Branch/Specialization *" name="branch" value={formData.branch} onChange={handleChange} error={!!errors.branch} helperText={errors.branch} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Year *" name="year" type="number" value={formData.year} onChange={handleChange} error={!!errors.year} helperText={errors.year} required inputProps={{ min: 1, max: 4 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Semester *" name="semester" type="number" value={formData.semester} onChange={handleChange} error={!!errors.semester} helperText={errors.semester} required inputProps={{ min: 1, max: 8 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Batch" name="batch" value={formData.batch} onChange={handleChange} placeholder="e.g., 2024-2027" />
            </Grid>
          </Grid>
        );
        
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#10b981' }}>Hostel Assignment</Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Room Number" name="roomNumber" value={formData.roomNumber} onChange={handleChange} placeholder="Leave empty to assign later" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Block</InputLabel>
                <Select name="block" value={formData.block} label="Block" onChange={handleChange}>
                  <MenuItem value="A">Block A</MenuItem>
                  <MenuItem value="B">Block B</MenuItem>
                  <MenuItem value="C">Block C</MenuItem>
                  <MenuItem value="D">Block D</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">Room assignment is optional. You can assign a room later.</Alert>
            </Grid>
          </Grid>
        );
        
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" gutterBottom sx={{ color: '#10b981' }}>Parent/Guardian Information</Typography>
                <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => { setEditingParent(null); setParentForm({ name: '', relation: '', phone: '', email: '', password: '', occupation: '', address: '', isPrimary: formData.parents.length === 0, emergencyContact: false }); setOpenParentDialog(true); }} sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>Add Parent/Guardian</Button>
              </Box>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            <Grid item xs={12}>
              {formData.parents.length === 0 ? (
                <Alert severity="warning">No parents/guardians added. Please add at least one parent/guardian.</Alert>
              ) : (
                <List>
                  {formData.parents.map((parent, index) => (
                    <Card key={parent.id || index} sx={{ mb: 2, bgcolor: parent.isPrimary ? '#f0fdf4' : '#ffffff' }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box flex={1}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Typography variant="h6" fontWeight="bold">{parent.name}</Typography>
                              {parent.isPrimary && <Chip label="Primary" size="small" color="success" />}
                              {parent.emergencyContact && <Chip label="Emergency Contact" size="small" color="error" />}
                            </Box>
                            <Typography variant="body2" color="textSecondary"><strong>Relation:</strong> {parent.relation}</Typography>
                            <Typography variant="body2" color="textSecondary"><PhoneIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />{parent.phone}</Typography>
                            {parent.email && <Typography variant="body2" color="textSecondary"><EmailIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />{parent.email}</Typography>}
                            {parent.occupation && <Typography variant="body2" color="textSecondary"><strong>Occupation:</strong> {parent.occupation}</Typography>}
                          </Box>
                          <Box>
                            <Tooltip title="Set as Primary"><IconButton onClick={() => setPrimaryParent(index)} color="success"><FamilyIcon /></IconButton></Tooltip>
                            <Tooltip title="Edit"><IconButton onClick={() => editParent(index)} color="primary"><EditIcon /></IconButton></Tooltip>
                            <Tooltip title="Remove"><IconButton onClick={() => removeParent(index)} color="error"><DeleteIcon /></IconButton></Tooltip>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </List>
              )}
              {errors.parents && <Alert severity="error" sx={{ mt: 2 }}>{errors.parents}</Alert>}
            </Grid>
          </Grid>
        );
        
      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#10b981' }}>Review Information</Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ mb: 3, bgcolor: '#f8fafc' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Personal Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}><Typography color="textSecondary">Name:</Typography></Grid><Grid item xs={8}><Typography fontWeight="bold">{formData.name}</Typography></Grid>
                    <Grid item xs={4}><Typography color="textSecondary">Email:</Typography></Grid><Grid item xs={8}><Typography fontWeight="bold">{formData.email}</Typography></Grid>
                    <Grid item xs={4}><Typography color="textSecondary">Phone:</Typography></Grid><Grid item xs={8}><Typography fontWeight="bold">{formData.phone}</Typography></Grid>
                    <Grid item xs={4}><Typography color="textSecondary">Address:</Typography></Grid><Grid item xs={8}><Typography fontWeight="bold">{formData.address || 'Not provided'}</Typography></Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Card sx={{ mb: 3, bgcolor: '#f8fafc' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Academic Details</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}><Typography color="textSecondary">Course:</Typography></Grid><Grid item xs={8}><Typography fontWeight="bold">{formData.course}</Typography></Grid>
                    <Grid item xs={4}><Typography color="textSecondary">Branch:</Typography></Grid><Grid item xs={8}><Typography fontWeight="bold">{formData.branch}</Typography></Grid>
                    <Grid item xs={4}><Typography color="textSecondary">Year/Sem:</Typography></Grid><Grid item xs={8}><Typography fontWeight="bold">Year {formData.year} / Sem {formData.semester}</Typography></Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Card sx={{ mb: 3, bgcolor: '#f8fafc' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Hostel Assignment</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}><Typography color="textSecondary">Room:</Typography></Grid><Grid item xs={8}><Typography fontWeight="bold">{formData.roomNumber || 'Not assigned'}</Typography></Grid>
                    <Grid item xs={4}><Typography color="textSecondary">Block:</Typography></Grid><Grid item xs={8}><Typography fontWeight="bold">Block {formData.block}</Typography></Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Card sx={{ bgcolor: '#f8fafc' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Parent/Guardian Information ({formData.parents.length} linked)</Typography>
                  {formData.parents.map((parent, idx) => (
                    <Box key={idx} sx={{ mb: 2, p: 2, bgcolor: '#ffffff', borderRadius: 2 }}>
                      <Typography fontWeight="bold">{parent.name} {parent.isPrimary && '(Primary)'} {parent.emergencyContact && '(Emergency Contact)'}</Typography>
                      <Typography variant="body2">Relation: {parent.relation}</Typography>
                      <Typography variant="body2">Phone: {parent.phone}</Typography>
                      {parent.email && <Typography variant="body2">Email: {parent.email}</Typography>}
                      {parent.occupation && <Typography variant="body2">Occupation: {parent.occupation}</Typography>}
                    </Box>
                  ))}
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
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/warden/students')}>Back to Students</Button>
        <Typography variant="h4" fontWeight="bold">Add New Student</Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />} onClick={handleSubmit} disabled={loading} sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>
                {loading ? 'Creating...' : 'Create Student'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext} sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>Next</Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Parent/Guardian Dialog */}
      <Dialog open={openParentDialog} onClose={() => setOpenParentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingParent !== null ? 'Edit Parent/Guardian' : 'Add Parent/Guardian'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Full Name *" name="name" value={parentForm.name} onChange={handleParentChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Relation *" name="relation" value={parentForm.relation} onChange={handleParentChange} placeholder="e.g., Father, Mother, Guardian" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Phone Number *" name="phone" value={parentForm.phone} onChange={handleParentChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email *" name="email" type="email" value={parentForm.email} onChange={handleParentChange} required />
            </Grid>
            {/* ✅ ADDED: Password field in dialog */}
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Password *" 
                name="password" 
                type="password" 
                value={parentForm.password} 
                onChange={handleParentChange} 
                required 
                helperText="Password for parent login"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Occupation" name="occupation" value={parentForm.occupation} onChange={handleParentChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Address" name="address" multiline rows={2} value={parentForm.address} onChange={handleParentChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Primary Contact</InputLabel>
                <Select name="isPrimary" value={parentForm.isPrimary} onChange={handleParentChange} label="Primary Contact">
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Emergency Contact</InputLabel>
                <Select name="emergencyContact" value={parentForm.emergencyContact} onChange={handleParentChange} label="Emergency Contact">
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenParentDialog(false)}>Cancel</Button>
          <Button onClick={addParent} variant="contained" sx={{ bgcolor: '#10b981' }}>{editingParent !== null ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default WardenAddStudent;