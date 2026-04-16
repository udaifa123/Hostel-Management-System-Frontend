import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Divider,
  InputAdornment,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Zoom,
  Fade
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  History as HistoryIcon,
  Download as DownloadIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  ContentPaste as PasteIcon,
  QrCode as QrCodeIcon,
  CameraAlt as CameraIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Print as PrintIcon,
  Close as CloseIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Green Design Tokens
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

const WardenQRScanner = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [qrHistory, setQrHistory] = useState([]);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [manualQrCode, setManualQrCode] = useState('');
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [qrConfig, setQrConfig] = useState({
    sessionName: `Attendance - ${new Date().toLocaleDateString()}`,
    expiryMinutes: 30
  });
  
  const html5QrCodeRef = useRef(null);
  const [cameraError, setCameraError] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(true);
  const [cameraStarted, setCameraStarted] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchQRHistory();
    
    return () => {
      stopScanner();
    };
  }, []);

  const fetchStudents = async () => {
    setFetchingStudents(true);
    try {
      const response = await axios.get(`${API_URL}/warden/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Students API Response:', response.data);
      
      let studentsArray = [];
      
      if (response.data && response.data.success && response.data.students) {
        studentsArray = response.data.students;
      } else if (response.data && response.data.data && response.data.data.students) {
        studentsArray = response.data.data.students;
      } else if (response.data && Array.isArray(response.data)) {
        studentsArray = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        studentsArray = response.data.data;
      }
      
      const transformedStudents = studentsArray.map(student => {
        let name = 'Unknown Student';
        if (student.user?.name) name = student.user.name;
        else if (student.name) name = student.name;
        else if (student.studentName) name = student.studentName;
        else if (student.fullName) name = student.fullName;
        
        let rollNo = 'N/A';
        if (student.rollNumber) rollNo = student.rollNumber;
        else if (student.registrationNumber) rollNo = student.registrationNumber;
        else if (student.enrollmentNumber) rollNo = student.enrollmentNumber;
        else if (student.studentId) rollNo = student.studentId;
        
        let email = '';
        if (student.user?.email) email = student.user.email;
        else if (student.email) email = student.email;
        
        return {
          id: student._id || student.id,
          name: name,
          rollNumber: rollNo,
          email: email,
          phone: student.user?.phone || student.phone || ''
        };
      }).filter(student => student.id);
      
      console.log('Transformed students:', transformedStudents);
      setStudents(transformedStudents);
      
      if (transformedStudents.length === 0) {
        toast.error('No students found. Please add students first.');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setFetchingStudents(false);
    }
  };

  const fetchQRHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/qr/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('QR History response:', response.data);
      
      let historyData = [];
      if (response.data && response.data.success && response.data.data) {
        historyData = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        historyData = response.data;
      }
      
      setQrHistory(historyData);
    } catch (error) {
      console.error('Error fetching QR history:', error);
    }
  };

  const generateQR = async () => {
    if (!qrConfig.sessionName) {
      toast.error('Please enter a session name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/qr/generate`, qrConfig, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('QR Generation response:', response.data);
      
      if (response.data && response.data.success) {
        setQrCodeData(response.data.data);
        toast.success('QR Code generated successfully!');
        fetchQRHistory();
      } else {
        toast.error(response.data?.message || 'Failed to generate QR code');
      }
    } catch (error) {
      console.error('Error generating QR:', error);
      toast.error(error.response?.data?.message || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const startScanner = async () => {
    if (!selectedStudent) {
      toast.error('Please select a student first');
      return;
    }

    await stopScanner();

    setScanning(true);
    setScanResult(null);
    setCameraError(false);
    setCameraStarted(false);
    
    setTimeout(async () => {
      try {
        const scannerContainer = document.getElementById('qr-reader-container');
        if (!scannerContainer) {
          throw new Error('Scanner container not found');
        }
        
        scannerContainer.innerHTML = '';
        
        const html5QrCode = new Html5Qrcode("qr-reader-container");
        html5QrCodeRef.current = html5QrCode;
        
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        };
        
        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            if (errorMessage && !errorMessage.includes('No MultiFormat Readers')) {
              console.log("Scan attempt:", errorMessage);
            }
          }
        );
        
        setCameraStarted(true);
        toast.success('Camera started. Point at QR code.');
        
      } catch (err) {
        console.error("Error starting scanner:", err);
        
        try {
          if (html5QrCodeRef.current) {
            await html5QrCodeRef.current.stop();
          }
          
          const html5QrCode = new Html5Qrcode("qr-reader-container");
          html5QrCodeRef.current = html5QrCode;
          
          await html5QrCode.start(
            { facingMode: "user" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => onScanSuccess(decodedText),
            (errorMessage) => console.log("Scan error:", errorMessage)
          );
          
          setCameraStarted(true);
          toast.success('Camera started with front camera.');
        } catch (fallbackErr) {
          console.error("Fallback camera also failed:", fallbackErr);
          toast.error("Could not start camera. Please check camera permissions.");
          setScanning(false);
          setCameraError(true);
        }
      }
    }, 100);
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.log("Error stopping scanner:", err);
      }
      html5QrCodeRef.current = null;
    }
    setScanning(false);
    setCameraStarted(false);
  };

  const onScanSuccess = async (decodedText) => {
    if (!scanning) return;
    
    await stopScanner();
    
    try {
      const response = await axios.post(`${API_URL}/qr/scan`, {
        qrCode: decodedText,
        studentId: selectedStudent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Scan response:', response.data);

      if (response.data && response.data.success) {
        setScanResult({
          success: true,
          message: '✅ Attendance marked successfully!',
          data: response.data.data
        });
        toast.success('Attendance marked successfully!');
        fetchQRHistory();
      } else {
        setScanResult({
          success: false,
          message: response.data?.message || 'Failed to mark attendance',
          data: null
        });
        toast.error(response.data?.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Scan error:', error);
      setScanResult({
        success: false,
        message: error.response?.data?.message || 'Failed to mark attendance',
        data: null
      });
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    }

    setTimeout(() => setScanResult(null), 5000);
  };

  const handleManualQR = async () => {
    if (!selectedStudent) {
      toast.error('Please select a student first');
      return;
    }
    if (!manualQrCode.trim()) {
      toast.error('Please enter QR code data');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/qr/scan`, {
        qrCode: manualQrCode,
        studentId: selectedStudent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Manual scan response:', response.data);

      if (response.data && response.data.success) {
        setScanResult({
          success: true,
          message: '✅ Attendance marked successfully!',
          data: response.data.data
        });
        toast.success('Attendance marked successfully!');
        setManualQrCode('');
        fetchQRHistory();
      } else {
        setScanResult({
          success: false,
          message: response.data?.message || 'Failed to mark attendance',
          data: null
        });
        toast.error(response.data?.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Manual scan error:', error);
      setScanResult({
        success: false,
        message: error.response?.data?.message || 'Failed to mark attendance',
        data: null
      });
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    }

    setTimeout(() => setScanResult(null), 5000);
  };

  const downloadQR = () => {
    if (qrCodeData?.qrCode) {
      const link = document.createElement('a');
      link.href = qrCodeData.qrCode;
      link.download = `qr_${qrCodeData.sessionName.replace(/[^a-z0-9]/gi, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR Code downloaded!');
    } else {
      toast.error('No QR code to download');
    }
  };

  const printQR = () => {
    if (qrCodeData?.qrCode) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${qrCodeData.sessionName}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
              .container { max-width: 400px; margin: 0 auto; }
              img { max-width: 100%; margin: 20px 0; }
              .info { margin-top: 20px; color: #666; }
              h2 { color: #1A5C2A; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Attendance QR Code</h2>
              <img src="${qrCodeData.qrCode}" alt="QR Code" />
              <div class="info">
                <p><strong>Session:</strong> ${qrCodeData.sessionName}</p>
                <p><strong>Expires:</strong> ${new Date(qrCodeData.expiresAt).toLocaleString()}</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleViewDetails = (qr) => {
    setSelectedQR(qr);
    setOpenQRDialog(true);
  };

  const getStatusColor = (status, expiresAt) => {
    const isActive = status === 'active' && new Date(expiresAt) > new Date();
    if (isActive) {
      return { bg: G[100], color: G[600], label: 'Active' };
    } else {
      return { bg: '#FEF2F2', color: '#EF4444', label: 'Expired' };
    }
  };

  if (fetchingStudents) {
    return (
      <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>
          Loading students...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
      {/* Top accent bar */}
      <Box sx={{ height: 4, bgcolor: G[600], mb: 3, borderRadius: 2 }} />

      {/* Header */}
      <Fade in timeout={500}>
        <Paper elevation={0} sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          bgcolor: '#ffffff',
          border: `1px solid ${G[200]}`,
          boxShadow: '0 2px 8px rgba(13,51,24,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: G[800], width: 46, height: 46, borderRadius: 2 }}>
              <QrCodeIcon sx={{ color: G[200], fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
                QR Attendance Scanner
              </Typography>
              <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
                Generate QR codes and scan to mark student attendance
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchQRHistory}
            sx={{
              bgcolor: G[700],
              color: '#ffffff',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
              '&:hover': { bgcolor: G[800] }
            }}
          >
            Refresh History
          </Button>
        </Paper>
      </Fade>

      <Grid container spacing={3}>
        {/* Generate QR Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Zoom in timeout={300}>
            <Paper elevation={0} sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
              boxShadow: CARD_SHADOW,
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: G[800], mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <QrCodeIcon sx={{ color: G[600] }} />
                Generate Attendance QR Code
              </Typography>

              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Session Name"
                    value={qrConfig.sessionName}
                    onChange={(e) => setQrConfig({ ...qrConfig, sessionName: e.target.value })}
                    placeholder="e.g., Morning Attendance - March 25"
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
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Expiry (Minutes)"
                    value={qrConfig.expiryMinutes}
                    onChange={(e) => setQrConfig({ ...qrConfig, expiryMinutes: parseInt(e.target.value) })}
                    InputProps={{ inputProps: { min: 5, max: 120 } }}
                    helperText="QR code will expire after this many minutes"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: G[50],
                        '& fieldset': { borderColor: G[200] },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={generateQR}
                    disabled={loading}
                    sx={{
                      bgcolor: G[700],
                      color: '#ffffff',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      py: 1.5,
                      '&:hover': { bgcolor: G[800] }
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate QR Code'}
                  </Button>
                </Grid>
              </Grid>

              {qrCodeData && (
                <Fade in timeout={500}>
                  <Box sx={{ mt: 3, p: 3, bgcolor: G[50], borderRadius: 2, textAlign: 'center' }}>
                    <img 
                      src={qrCodeData.qrCode} 
                      alt="QR Code" 
                      style={{ maxWidth: '200px', margin: '0 auto', display: 'block' }} 
                    />
                    <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold', color: G[800] }}>
                      {qrCodeData.sessionName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: G[500], display: 'block' }}>
                      Expires: {new Date(qrCodeData.expiresAt).toLocaleString()}
                    </Typography>
                    <Box display="flex" gap={1} justifyContent="center" sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={downloadQR}
                        size="small"
                        sx={{ borderColor: G[200], color: G[600] }}
                      >
                        Download
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        onClick={printQR}
                        size="small"
                        sx={{ borderColor: G[200], color: G[600] }}
                      >
                        Print
                      </Button>
                    </Box>
                  </Box>
                </Fade>
              )}
            </Paper>
          </Zoom>
        </Grid>

        {/* Scan QR Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Zoom in timeout={300}>
            <Paper elevation={0} sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
              boxShadow: CARD_SHADOW,
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: G[800], mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CameraIcon sx={{ color: G[600] }} />
                Scan QR to Mark Attendance
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select Student</InputLabel>
                <Select
                  value={selectedStudent || ''}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  label="Select Student"
                  sx={{
                    borderRadius: 2,
                    bgcolor: G[50],
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: G[200] },
                  }}
                  renderValue={(selected) => {
                    if (!selected) return 'Select Student';
                    const student = students.find(s => s.id === selected);
                    if (!student) return 'Select Student';
                    return `${student.name} - ${student.rollNumber}`;
                  }}
                >
                  {students.length === 0 ? (
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary">
                        No students available
                      </Typography>
                    </MenuItem>
                  ) : (
                    students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: G[100], width: 32, height: 32 }}>
                            <PersonIcon sx={{ color: G[600], fontSize: 18 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {student.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Roll: {student.rollNumber}
                              {student.email && ` | ${student.email}`}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              {/* Scanner Container */}
              <Box 
                id="qr-reader-container"
                sx={{ 
                  width: '100%',
                  minHeight: scanning ? 350 : 0,
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: '#000',
                  display: scanning ? 'block' : 'none',
                  position: 'relative',
                  '& video': {
                    width: '100% !important',
                    height: 'auto !important',
                    objectFit: 'cover'
                  }
                }} 
              />

              {!scanning ? (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CameraIcon />}
                  onClick={startScanner}
                  disabled={!selectedStudent}
                  sx={{
                    bgcolor: G[700],
                    color: '#ffffff',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    py: 1.5,
                    '&:hover': { bgcolor: G[800] }
                  }}
                >
                  Start Camera Scanner
                </Button>
              ) : (
                <>
                  {!cameraStarted && !cameraError && (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <CircularProgress size={30} sx={{ color: G[600] }} />
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: G[600] }}>
                        Starting camera...
                      </Typography>
                    </Box>
                  )}
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={stopScanner}
                    sx={{ mt: 2, borderColor: G[200], color: G[600] }}
                  >
                    Stop Scanning
                  </Button>
                </>
              )}

              {cameraError && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  <strong>Camera Error:</strong> Could not access camera.
                  <ul style={{ marginTop: 8, marginBottom: 0 }}>
                    <li>Check if camera is not in use by another app</li>
                    <li>Allow camera permission in browser settings</li>
                    <li>Refresh the page and try again</li>
                    <li>Use the manual entry option below</li>
                  </ul>
                </Alert>
              )}

              {scanResult && (
                <Alert 
                  severity={scanResult.success ? 'success' : 'error'} 
                  sx={{ mt: 2, borderRadius: 2 }}
                  icon={scanResult.success ? <CheckCircleIcon /> : <ErrorIcon />}
                >
                  {scanResult.message}
                </Alert>
              )}

              <Divider sx={{ my: 3, borderColor: G[100] }} />

              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: G[800] }}>
                Or Enter QR Code Manually
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Paste QR code data here..."
                  value={manualQrCode}
                  onChange={(e) => setManualQrCode(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PasteIcon sx={{ color: G[400] }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleManualQR}
                  disabled={!selectedStudent || !manualQrCode.trim()}
                  sx={{ bgcolor: G[600], '&:hover': { bgcolor: G[700] } }}
                >
                  Submit
                </Button>
              </Box>
            </Paper>
          </Zoom>
        </Grid>

        {/* QR History Section */}
        <Grid size={{ xs: 12 }}>
          <Fade in timeout={500}>
            <Paper elevation={0} sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
              boxShadow: CARD_SHADOW
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: G[800], display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HistoryIcon sx={{ color: G[600] }} />
                  QR Code History
                </Typography>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={fetchQRHistory}
                  size="small"
                  sx={{ color: G[600] }}
                >
                  Refresh
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: G[50] }}>
                    <TableRow>
                      <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Session Name</TableCell>
                      <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Generated</TableCell>
                      <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Expires</TableCell>
                      <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Used By</TableCell>
                      <TableCell sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Status</TableCell>
                      <TableCell align="right" sx={{ color: G[700], fontWeight: 700, fontSize: '0.7rem' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {qrHistory.map((qr) => {
                      const statusConfig = getStatusColor(qr.status, qr.expiresAt);
                      return (
                        <TableRow key={qr._id} hover sx={{ '&:hover': { bgcolor: G[50] } }}>
                          <TableCell sx={{ color: G[800] }}>{qr.sessionName}</TableCell>
                          <TableCell sx={{ color: G[600] }}>{new Date(qr.createdAt).toLocaleString()}</TableCell>
                          <TableCell sx={{ color: G[600] }}>{new Date(qr.expiresAt).toLocaleString()}</TableCell>
                          <TableCell sx={{ color: G[600] }}>{qr.usedBy?.length || 0} students</TableCell>
                          <TableCell>
                            <Chip 
                              label={statusConfig.label}
                              size="small"
                              sx={{ bgcolor: statusConfig.bg, color: statusConfig.color, fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewDetails(qr)} 
                                sx={{ color: G[600], bgcolor: G[100], borderRadius: 1.5 }}
                              >
                                <VisibilityIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {qrHistory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <QrCodeIcon sx={{ fontSize: 48, color: G[400], mb: 1 }} />
                            <Typography sx={{ color: G[600] }}>No QR codes generated yet</Typography>
                            <Button
                              variant="text"
                              startIcon={<QrCodeIcon />}
                              onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              sx={{ mt: 1, color: G[600] }}
                            >
                              Generate your first QR code
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Fade>
        </Grid>
      </Grid>

      {/* QR Details Dialog */}
      <Dialog 
        open={openQRDialog} 
        onClose={() => setOpenQRDialog(false)} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Zoom}
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
        <DialogTitle sx={{ bgcolor: G[50], borderBottom: `1px solid ${G[100]}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700} sx={{ color: G[800] }}>
              QR Code Details
            </Typography>
            <IconButton onClick={() => setOpenQRDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedQR && (
            <Box>
              <Box textAlign="center" mb={3}>
                <img 
                  src={selectedQR.qrCode} 
                  alt="QR Code" 
                  style={{ maxWidth: '180px', margin: '0 auto', display: 'block' }} 
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: G[500] }}>Session Name</Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ color: G[800] }}>
                    {selectedQR.sessionName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ color: G[500] }}>Generated At</Typography>
                  <Typography variant="body2" sx={{ color: G[600] }}>
                    {new Date(selectedQR.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ color: G[500] }}>Expires At</Typography>
                  <Typography variant="body2" sx={{ color: G[600] }}>
                    {new Date(selectedQR.expiresAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: G[500] }}>Used By Students</Typography>
                  <Box sx={{ mt: 1 }}>
                    {selectedQR.usedBy && selectedQR.usedBy.length > 0 ? (
                      selectedQR.usedBy.map((student, idx) => (
                        <Chip 
                          key={idx}
                          label={student.name || student.studentName || `Student ${idx + 1}`}
                          size="small"
                          sx={{ m: 0.5, bgcolor: G[100], color: G[700] }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ color: G[500] }}>No students have used this QR code yet</Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <Divider sx={{ borderColor: G[100] }} />
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenQRDialog(false)} sx={{ color: G[600], border: `1px solid ${G[200]}`, px: 3 }}>
            Close
          </Button>
          {selectedQR?.qrCode && (
            <Button 
              variant="contained" 
              startIcon={<DownloadIcon />}
              onClick={() => {
                const link = document.createElement('a');
                link.href = selectedQR.qrCode;
                link.download = `qr_${selectedQR.sessionName.replace(/[^a-z0-9]/gi, '_')}.png`;
                link.click();
                toast.success('QR Code downloaded');
              }}
              sx={{ bgcolor: G[700], '&:hover': { bgcolor: G[800] }, px: 3 }}
            >
              Download QR
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WardenQRScanner;