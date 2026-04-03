import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  QrCodeScanner as QrScannerIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import QrReader from 'react-qr-scanner';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const QRScanner = () => {
  const { token } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [qrConfig, setQrConfig] = useState({
    expiryMinutes: 30,
    sessionName: `Attendance - ${new Date().toLocaleDateString()}`,
    roomId: ''
  });
  
  const videoRef = useRef(null);

  useEffect(() => {
    fetchStudents();
    fetchQRHistory();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/warden/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchQRHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/qr/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data.data || []);
    } catch (error) {
      console.error('Error fetching QR history:', error);
    }
  };

  const generateQR = async () => {
    setGenerating(true);
    try {
      const response = await axios.post(`${API_URL}/qr/generate`, qrConfig, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setQrImage(response.data.data.qrCode);
        setQrData(response.data.data);
        toast.success('QR Code generated successfully!');
      }
    } catch (error) {
      console.error('Error generating QR:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setGenerating(false);
    }
  };

  const handleScan = async (data) => {
    if (data && data.text && scanning) {
      setScanning(false);
      
      if (!selectedStudent) {
        toast.error('Please select a student first');
        setScanning(false);
        return;
      }

      try {
        const response = await axios.post(`${API_URL}/qr/scan`, {
          qrCode: data.text,
          studentId: selectedStudent
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setScanResult({
            success: true,
            message: 'Attendance marked successfully!',
            data: response.data.data
          });
          toast.success('Attendance marked successfully!');
          fetchQRHistory();
        }
      } catch (error) {
        setScanResult({
          success: false,
          message: error.response?.data?.message || 'Failed to mark attendance',
          data: null
        });
        toast.error(error.response?.data?.message || 'Failed to mark attendance');
      }

      setTimeout(() => setScanResult(null), 5000);
    }
  };

  const handleError = (err) => {
    console.error('QR scan error:', err);
    toast.error('Camera error. Please check permissions.');
    setScanning(false);
  };

  const startScanning = () => {
    setScanning(true);
    setScanResult(null);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  const previewStyle = {
    height: 400,
    width: '100%',
    objectFit: 'cover',
    borderRadius: '12px'
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#047857' }}>
        QR Scanner
      </Typography>

      <Grid container spacing={3}>
        {/* Generate QR Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#047857' }}>
              Generate Attendance QR
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Session Name"
                  value={qrConfig.sessionName}
                  onChange={(e) => setQrConfig({ ...qrConfig, sessionName: e.target.value })}
                  placeholder="e.g., Morning Attendance - March 25"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Expiry (Minutes)"
                  value={qrConfig.expiryMinutes}
                  onChange={(e) => setQrConfig({ ...qrConfig, expiryMinutes: parseInt(e.target.value) })}
                  InputProps={{ inputProps: { min: 5, max: 120 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={generateQR}
                  disabled={generating}
                  sx={{ bgcolor: '#047857', '&:hover': { bgcolor: '#059669' }, py: 1.5 }}
                >
                  {generating ? <CircularProgress size={24} /> : 'Generate QR Code'}
                </Button>
              </Grid>
            </Grid>

            {qrImage && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <img src={qrImage} alt="QR Code" style={{ maxWidth: '100%', borderRadius: '12px' }} />
                <Typography variant="caption" display="block" sx={{ mt: 1, color: '#666' }}>
                  Expires: {new Date(qrData?.expiresAt).toLocaleString()}
                </Typography>
                <Button
                  size="small"
                  onClick={() => window.open(qrImage, '_blank')}
                  sx={{ mt: 1 }}
                >
                  Download QR Code
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Scan QR Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#047857' }}>
              Scan QR for Attendance
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Student</InputLabel>
              <Select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                label="Select Student"
              >
                {students.map((student) => (
                  <MenuItem key={student._id} value={student._id}>
                    {student.name} - {student.registrationNumber}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {!scanning ? (
              <Button
                fullWidth
                variant="contained"
                startIcon={<QrScannerIcon />}
                onClick={startScanning}
                disabled={!selectedStudent}
                sx={{ bgcolor: '#047857', '&:hover': { bgcolor: '#059669' }, py: 1.5 }}
              >
                Start Scanning
              </Button>
            ) : (
              <Box>
                <QrReader
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={previewStyle}
                  constraints={{ video: { facingMode: 'environment' } }}
                />
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={stopScanning}
                  sx={{ mt: 2 }}
                >
                  Stop Scanning
                </Button>
              </Box>
            )}

            {scanResult && (
              <Alert 
                severity={scanResult.success ? 'success' : 'error'} 
                sx={{ mt: 2 }}
              >
                {scanResult.message}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* QR History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#047857' }}>
                QR Code History
              </Typography>
              <Button
                startIcon={<RefreshIcon />}
                onClick={fetchQRHistory}
                size="small"
              >
                Refresh
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell>Session Name</TableCell>
                    <TableCell>Generated</TableCell>
                    <TableCell>Expires</TableCell>
                    <TableCell>Used By</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((qr) => (
                    <TableRow key={qr._id}>
                      <TableCell>{qr.sessionName}</TableCell>
                      <TableCell>{new Date(qr.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{new Date(qr.expiresAt).toLocaleString()}</TableCell>
                      <TableCell>{qr.usedBy?.length || 0}</TableCell>
                      <TableCell>
                        <Chip 
                          label={qr.isActive && new Date(qr.expiresAt) > new Date() ? 'Active' : 'Expired'}
                          size="small"
                          color={qr.isActive && new Date(qr.expiresAt) > new Date() ? 'success' : 'default'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QRScanner;