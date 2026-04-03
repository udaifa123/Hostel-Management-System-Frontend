// import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   Chip,
//   IconButton,
//   TextField,
//   InputAdornment,
//   Grid,
//   Card,
//   CardContent,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Avatar,
//   Divider,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Tooltip,
//   Tab,
//   Tabs,
//   Alert,
//   Snackbar
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Search as SearchIcon,
//   Refresh as RefreshIcon,
//   Description as DescriptionIcon,
//   Today as TodayIcon,
//   CheckCircle as CheckCircleIcon,
//   Cancel as CancelIcon,
//   Pending as PendingIcon,
//   Visibility as ViewIcon,
//   Check as ApproveIcon,
//   Close as RejectIcon,
//   CalendarToday as CalendarIcon
// } from '@mui/icons-material';

// // ─── Green Design Tokens ───────────────────────────────────────────────
// const G = {
//   900: '#0D3318',
//   800: '#1A5C2A',
//   700: '#1E7A35',
//   600: '#2E9142',
//   500: '#3AAF51',
//   400: '#5DC470',
//   300: '#8FD9A0',
//   200: '#C1EDCA',
//   100: '#E4F7E8',
//   50:  '#F4FBF5',
// };

// const CARD_SHADOW = '0 1px 4px rgba(30,122,53,0.10), 0 0 0 1px rgba(30,122,53,0.08)';

// // ─── Mock Data ─────────────────────────────────────────────────────────────────
// const mockLeaves = [
//   { 
//     id: 1, 
//     studentName: 'Amina Khan', 
//     studentId: 'STU001',
//     hostel: 'Girls Hostel', 
//     roomNo: '203',
//     leaveType: 'Casual Leave',
//     fromDate: '2024-03-15',
//     toDate: '2024-03-17',
//     days: 3,
//     reason: 'Family function',
//     status: 'pending',
//     appliedDate: '2024-03-10',
//     contactNumber: '+91 9876543210'
//   },
//   { 
//     id: 2, 
//     studentName: 'Rahul Sharma', 
//     studentId: 'STU002',
//     hostel: 'Boys Hostel A', 
//     roomNo: '105',
//     leaveType: 'Medical Leave',
//     fromDate: '2024-03-18',
//     toDate: '2024-03-20',
//     days: 3,
//     reason: 'Medical checkup and treatment',
//     status: 'approved',
//     appliedDate: '2024-03-12',
//     contactNumber: '+91 9876543211'
//   },
//   { 
//     id: 3, 
//     studentName: 'Priya Patel', 
//     studentId: 'STU003',
//     hostel: 'Girls Hostel', 
//     roomNo: '205',
//     leaveType: 'Emergency Leave',
//     fromDate: '2024-03-16',
//     toDate: '2024-03-18',
//     days: 3,
//     reason: 'Urgent family matter',
//     status: 'pending',
//     appliedDate: '2024-03-14',
//     contactNumber: '+91 9876543212'
//   },
//   { 
//     id: 4, 
//     studentName: 'John Doe', 
//     studentId: 'STU004',
//     hostel: 'Boys Hostel B', 
//     roomNo: '302',
//     leaveType: 'Casual Leave',
//     fromDate: '2024-03-10',
//     toDate: '2024-03-12',
//     days: 3,
//     reason: 'Going home for festival',
//     status: 'rejected',
//     appliedDate: '2024-03-05',
//     contactNumber: '+91 9876543213',
//     rejectionReason: 'High attendance shortage'
//   },
//   { 
//     id: 5, 
//     studentName: 'Sarah Ahmed', 
//     studentId: 'STU005',
//     hostel: 'Girls Hostel', 
//     roomNo: '207',
//     leaveType: 'Medical Leave',
//     fromDate: '2024-03-20',
//     toDate: '2024-03-22',
//     days: 3,
//     reason: 'Fever and cold',
//     status: 'approved',
//     appliedDate: '2024-03-15',
//     contactNumber: '+91 9876543214'
//   }
// ];

// // ─── Stat Card Component ───────────────────────────────────────────────────────
// const StatCard = ({ label, value, icon: Icon, dark = false, valueColor }) => (
//   <Card elevation={0} sx={{
//     borderRadius: 3,
//     bgcolor: dark ? G[800] : '#ffffff',
//     border: `1px solid ${dark ? G[700] : G[200]}`,
//     boxShadow: dark ? '0 4px 16px rgba(13,51,24,0.25)' : CARD_SHADOW,
//     height: '100%',
//     transition: 'transform 0.15s',
//     '&:hover': { transform: 'translateY(-2px)' }
//   }}>
//     <CardContent sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//         <Box>
//           <Typography variant="caption" sx={{
//             color: dark ? G[300] : G[600],
//             fontWeight: 600, fontSize: '0.70rem',
//             letterSpacing: '0.08em', textTransform: 'uppercase',
//             display: 'block', mb: 1
//           }}>
//             {label}
//           </Typography>
//           <Typography sx={{
//             fontWeight: 700,
//             color: valueColor || (dark ? '#ffffff' : G[800]),
//             fontSize: '2.2rem', lineHeight: 1,
//           }}>
//             {value}
//           </Typography>
//         </Box>
//         <Avatar sx={{
//           bgcolor: dark ? G[700] : G[100],
//           width: 48, height: 48, borderRadius: 2,
//         }}>
//           <Icon sx={{ color: dark ? G[200] : G[600], fontSize: 24 }} />
//         </Avatar>
//       </Box>
//     </CardContent>
//   </Card>
// );

// // ─── Main Component ────────────────────────────────────────────────────────────
// const AdminLeaves = () => {
//   const [leaves, setLeaves] = useState(mockLeaves);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedLeave, setSelectedLeave] = useState(null);
//   const [tabValue, setTabValue] = useState(0);
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarSeverity, setSnackbarSeverity] = useState('success');

//   // Form state for new leave
//   const [newLeave, setNewLeave] = useState({
//     studentName: '',
//     studentId: '',
//     hostel: '',
//     roomNo: '',
//     leaveType: '',
//     fromDate: '',
//     toDate: '',
//     reason: '',
//     contactNumber: ''
//   });

//   const filteredLeaves = leaves.filter(leave =>
//     leave.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     leave.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     leave.hostel.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getFilteredByStatus = () => {
//     if (tabValue === 0) return filteredLeaves;
//     if (tabValue === 1) return filteredLeaves.filter(l => l.status === 'pending');
//     if (tabValue === 2) return filteredLeaves.filter(l => l.status === 'approved');
//     if (tabValue === 3) return filteredLeaves.filter(l => l.status === 'rejected');
//     return filteredLeaves;
//   };

//   const displayedLeaves = getFilteredByStatus();

//   const stats = {
//     total: leaves.length,
//     pending: leaves.filter(l => l.status === 'pending').length,
//     approved: leaves.filter(l => l.status === 'approved').length,
//     rejected: leaves.filter(l => l.status === 'rejected').length,
//     totalDays: leaves.reduce((sum, l) => sum + l.days, 0)
//   };

//   const handleApprove = (leave) => {
//     setLeaves(leaves.map(l => 
//       l.id === leave.id ? { ...l, status: 'approved' } : l
//     ));
//     setSnackbarMessage(`Leave request from ${leave.studentName} approved successfully`);
//     setSnackbarSeverity('success');
//     setOpenSnackbar(true);
//   };

//   const handleReject = (leave) => {
//     setLeaves(leaves.map(l => 
//       l.id === leave.id ? { ...l, status: 'rejected' } : l
//     ));
//     setSnackbarMessage(`Leave request from ${leave.studentName} rejected`);
//     setSnackbarSeverity('error');
//     setOpenSnackbar(true);
//   };

//   const handleSubmitLeave = () => {
//     const days = calculateDays(newLeave.fromDate, newLeave.toDate);
//     const newLeaveData = {
//       id: leaves.length + 1,
//       ...newLeave,
//       days: days,
//       appliedDate: new Date().toISOString().split('T')[0],
//       status: 'pending'
//     };
//     setLeaves([...leaves, newLeaveData]);
//     setOpenDialog(false);
//     setNewLeave({
//       studentName: '',
//       studentId: '',
//       hostel: '',
//       roomNo: '',
//       leaveType: '',
//       fromDate: '',
//       toDate: '',
//       reason: '',
//       contactNumber: ''
//     });
//     setSnackbarMessage('Leave application submitted successfully');
//     setSnackbarSeverity('success');
//     setOpenSnackbar(true);
//   };

//   const calculateDays = (from, to) => {
//     if (!from || !to) return 0;
//     const fromDate = new Date(from);
//     const toDate = new Date(to);
//     const diffTime = Math.abs(toDate - fromDate);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//     return diffDays;
//   };

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'pending': return { bg: '#FEF3C7', color: '#B45309', icon: <PendingIcon sx={{ fontSize: '13px' }} />, text: 'Pending' };
//       case 'approved': return { bg: G[100], color: G[600], icon: <CheckCircleIcon sx={{ fontSize: '13px' }} />, text: 'Approved' };
//       case 'rejected': return { bg: '#FEF2F2', color: '#EF4444', icon: <CancelIcon sx={{ fontSize: '13px' }} />, text: 'Rejected' };
//       default: return { bg: G[100], color: G[600], text: status };
//     }
//   };

//   const getLeaveTypeColor = (type) => {
//     switch(type) {
//       case 'Casual Leave': return { bg: G[100], color: G[600] };
//       case 'Medical Leave': return { bg: '#E0F2FE', color: '#0284C7' };
//       case 'Emergency Leave': return { bg: '#FEF3C7', color: '#B45309' };
//       default: return { bg: G[100], color: G[600] };
//     }
//   };

//   return (
//     <Box sx={{ bgcolor: G[50], minHeight: '100vh' }}>
//       {/* Top accent bar */}
//       <Box sx={{ height: 4, bgcolor: G[600] }} />

//       <Box sx={{ p: 3 }}>

//         {/* ── Header ── */}
//         <Paper elevation={0} sx={{
//           p: 3, mb: 4, borderRadius: 3,
//           bgcolor: '#ffffff', border: `1px solid ${G[200]}`,
//           boxShadow: '0 2px 8px rgba(13,51,24,0.10)',
//           display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//         }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <Avatar sx={{ bgcolor: G[800], width: 46, height: 46, borderRadius: 2 }}>
//               <DescriptionIcon sx={{ color: G[200], fontSize: 22 }} />
//             </Avatar>
//             <Box>
//               <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
//                 Leave Management
//               </Typography>
//               <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
//                 Manage student leave applications and approvals
//               </Typography>
//             </Box>
//           </Box>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => { setSelectedLeave(null); setOpenDialog(true); }}
//             sx={{
//               bgcolor: G[700], color: '#ffffff', fontWeight: 600,
//               borderRadius: 2, textTransform: 'none',
//               boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
//               '&:hover': { bgcolor: G[800] }
//             }}
//           >
//             Apply Leave
//           </Button>
//         </Paper>

//         {/* ── Stat Cards ── */}
//         <Grid container spacing={2.5} sx={{ mb: 3 }}>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard label="Total Applications" value={stats.total} icon={DescriptionIcon} dark />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard label="Pending" value={stats.pending} icon={PendingIcon} valueColor="#B45309" />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard label="Approved" value={stats.approved} icon={CheckCircleIcon} valueColor={G[600]} />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard label="Total Leave Days" value={stats.totalDays} icon={CalendarIcon} valueColor={G[600]} />
//           </Grid>
//         </Grid>

//         {/* ── Search and Tabs ── */}
//         <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
//           <TextField
//             fullWidth
//             placeholder="Search leaves by student name, ID, hostel, or leave type..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             sx={{ flex: 1 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ color: G[400], fontSize: 20 }} />
//                 </InputAdornment>
//               )
//             }}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 bgcolor: '#ffffff', borderRadius: 2.5,
//                 '& fieldset': { borderColor: G[200] },
//                 '&:hover fieldset': { borderColor: G[400] },
//                 '&.Mui-focused fieldset': { borderColor: G[600] },
//               },
//             }}
//           />
//           <IconButton sx={{
//             bgcolor: '#ffffff', borderRadius: 2.5,
//             border: `1px solid ${G[200]}`, color: G[600],
//             '&:hover': { bgcolor: G[100], borderColor: G[400] }
//           }}>
//             <RefreshIcon />
//           </IconButton>
//         </Box>

//         {/* Status Tabs */}
//         <Paper elevation={0} sx={{
//           mb: 3, borderRadius: 2.5,
//           bgcolor: '#ffffff', border: `1px solid ${G[200]}`,
//         }}>
//           <Tabs
//             value={tabValue}
//             onChange={(e, v) => setTabValue(v)}
//             sx={{
//               '& .MuiTab-root': {
//                 textTransform: 'none',
//                 fontWeight: 600,
//                 fontSize: '0.9rem',
//                 color: G[500],
//                 '&.Mui-selected': {
//                   color: G[700],
//                 }
//               },
//               '& .MuiTabs-indicator': {
//                 bgcolor: G[600],
//                 height: 3,
//               }
//             }}
//           >
//             <Tab label={`All (${stats.total})`} />
//             <Tab label={`Pending (${stats.pending})`} />
//             <Tab label={`Approved (${stats.approved})`} />
//             <Tab label={`Rejected (${stats.rejected})`} />
//           </Tabs>
//         </Paper>

//         {/* ── Leaves Table ── */}
//         <TableContainer component={Paper} elevation={0} sx={{
//           borderRadius: 3, bgcolor: '#ffffff',
//           border: `1px solid ${G[200]}`, boxShadow: CARD_SHADOW,
//         }}>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ bgcolor: G[50] }}>
//                 {['Student', 'Leave Details', 'Duration', 'Reason', 'Applied On', 'Status', 'Actions'].map((col, i) => (
//                   <TableCell key={col} align={i === 6 ? 'right' : 'left'} sx={{
//                     color: G[700], fontWeight: 700, fontSize: '0.70rem',
//                     letterSpacing: '0.06em', textTransform: 'uppercase',
//                     borderBottom: `2px solid ${G[200]}`, py: 1.75,
//                   }}>
//                     {col}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {displayedLeaves.map((leave) => {
//                 const statusInfo = getStatusColor(leave.status);
//                 const leaveTypeInfo = getLeaveTypeColor(leave.leaveType);
                
//                 return (
//                   <TableRow key={leave.id} hover sx={{
//                     '&:hover': { bgcolor: G[50] },
//                     '& td': { borderBottom: `1px solid ${G[100]}`, py: 1.75 }
//                   }}>
//                     {/* Student Info */}
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                         <Avatar sx={{
//                           bgcolor: G[100], color: G[700],
//                           width: 38, height: 38,
//                           border: `2px solid ${G[200]}`
//                         }}>
//                           {leave.studentName.charAt(0)}
//                         </Avatar>
//                         <Box>
//                           <Typography sx={{ color: G[800], fontWeight: 600, fontSize: '0.875rem' }}>
//                             {leave.studentName}
//                           </Typography>
//                           <Typography variant="caption" sx={{ color: G[500] }}>
//                             ID: {leave.studentId} • Room: {leave.roomNo}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </TableCell>

//                     {/* Leave Details */}
//                     <TableCell>
//                       <Box>
//                         <Chip
//                           label={leave.leaveType}
//                           size="small"
//                           sx={{
//                             bgcolor: leaveTypeInfo.bg,
//                             color: leaveTypeInfo.color,
//                             fontWeight: 600, fontSize: '0.72rem',
//                             mb: 0.5
//                           }}
//                         />
//                         <Typography variant="caption" sx={{ color: G[500], display: 'block' }}>
//                           {leave.hostel}
//                         </Typography>
//                       </Box>
//                     </TableCell>

//                     {/* Duration */}
//                     <TableCell>
//                       <Box>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
//                           <TodayIcon sx={{ fontSize: 12, color: G[400] }} />
//                           <Typography sx={{ color: G[700], fontSize: '0.8rem' }}>
//                             {leave.fromDate}
//                           </Typography>
//                         </Box>
//                         <Typography variant="caption" sx={{ color: G[500] }}>
//                           to {leave.toDate}
//                         </Typography>
//                         <Chip
//                           label={`${leave.days} day${leave.days > 1 ? 's' : ''}`}
//                           size="small"
//                           sx={{
//                             mt: 0.5,
//                             bgcolor: G[100],
//                             color: G[600],
//                             fontSize: '0.65rem',
//                             height: 20
//                           }}
//                         />
//                       </Box>
//                     </TableCell>

//                     {/* Reason */}
//                     <TableCell>
//                       <Tooltip title={leave.reason}>
//                         <Typography sx={{
//                           color: G[700], fontSize: '0.85rem',
//                           maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
//                         }}>
//                           {leave.reason}
//                         </Typography>
//                       </Tooltip>
//                       {leave.rejectionReason && (
//                         <Typography variant="caption" sx={{ color: '#EF4444', display: 'block', mt: 0.5 }}>
//                           Rejected: {leave.rejectionReason}
//                         </Typography>
//                       )}
//                     </TableCell>

//                     {/* Applied On */}
//                     <TableCell>
//                       <Typography sx={{ color: G[600], fontSize: '0.85rem' }}>
//                         {leave.appliedDate}
//                       </Typography>
//                     </TableCell>

//                     {/* Status */}
//                     <TableCell>
//                       <Chip
//                         label={statusInfo.text}
//                         size="small"
//                         icon={statusInfo.icon}
//                         sx={{
//                           bgcolor: statusInfo.bg,
//                           color: statusInfo.color,
//                           border: `1px solid ${statusInfo.color}40`,
//                           fontWeight: 600, fontSize: '0.72rem',
//                         }}
//                       />
//                     </TableCell>

//                     {/* Actions */}
//                     <TableCell align="right">
//                       {leave.status === 'pending' && (
//                         <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
//                           <Tooltip title="Approve">
//                             <IconButton
//                               size="small"
//                               onClick={() => handleApprove(leave)}
//                               sx={{
//                                 color: G[600], bgcolor: G[100],
//                                 borderRadius: 1.5,
//                                 border: `1px solid ${G[200]}`,
//                                 '&:hover': { bgcolor: G[200] }
//                               }}
//                             >
//                               <ApproveIcon sx={{ fontSize: 16 }} />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Reject">
//                             <IconButton
//                               size="small"
//                               onClick={() => handleReject(leave)}
//                               sx={{
//                                 color: '#c0392b', bgcolor: '#fef2f2',
//                                 borderRadius: 1.5,
//                                 border: '1px solid #fecaca',
//                                 '&:hover': { bgcolor: '#fee2e2' }
//                               }}
//                             >
//                               <RejectIcon sx={{ fontSize: 16 }} />
//                             </IconButton>
//                           </Tooltip>
//                         </Box>
//                       )}
//                       {leave.status !== 'pending' && (
//                         <Tooltip title="View Details">
//                           <IconButton
//                             size="small"
//                             onClick={() => { setSelectedLeave(leave); setOpenDialog(true); }}
//                             sx={{
//                               color: G[600], bgcolor: G[100],
//                               borderRadius: 1.5,
//                               border: `1px solid ${G[200]}`,
//                             }}
//                           >
//                             <ViewIcon sx={{ fontSize: 16 }} />
//                           </IconButton>
//                         </Tooltip>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}

//               {displayedLeaves.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center" sx={{ py: 6, color: G[400] }}>
//                     No leave applications found
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* ── Apply/View Leave Dialog ── */}
//         <Dialog
//           open={openDialog}
//           onClose={() => setOpenDialog(false)}
//           maxWidth="md"
//           fullWidth
//           PaperProps={{
//             sx: {
//               borderRadius: 3,
//               bgcolor: '#ffffff',
//               border: `1px solid ${G[200]}`,
//               boxShadow: '0 24px 48px rgba(13,51,24,0.15)',
//             }
//           }}
//         >
//           <Box sx={{ height: 4, bgcolor: G[600], borderRadius: '12px 12px 0 0' }} />
//           <DialogTitle sx={{ pt: 2.5, pb: 1.5 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//               <Avatar sx={{ bgcolor: G[800], width: 38, height: 38, borderRadius: 1.5 }}>
//                 <DescriptionIcon sx={{ color: G[200], fontSize: 18 }} />
//               </Avatar>
//               <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
//                 {selectedLeave ? 'Leave Application Details' : 'Apply for Leave'}
//               </Typography>
//             </Box>
//           </DialogTitle>
//           <Divider sx={{ borderColor: G[100] }} />
//           <DialogContent sx={{ pt: 3 }}>
//             {selectedLeave ? (
//               // View Details Mode
//               <Grid container spacing={2.5}>
//                 <Grid item xs={12} md={6}>
//                   <Typography variant="caption" sx={{ color: G[500], fontWeight: 600 }}>Student Name</Typography>
//                   <Typography sx={{ color: G[800], fontWeight: 500, mb: 1 }}>{selectedLeave.studentName}</Typography>
                  
//                   <Typography variant="caption" sx={{ color: G[500], fontWeight: 600, mt: 1 }}>Student ID</Typography>
//                   <Typography sx={{ color: G[800], fontWeight: 500, mb: 1 }}>{selectedLeave.studentId}</Typography>
                  
//                   <Typography variant="caption" sx={{ color: G[500], fontWeight: 600, mt: 1 }}>Hostel & Room</Typography>
//                   <Typography sx={{ color: G[800], fontWeight: 500, mb: 1 }}>{selectedLeave.hostel} - Room {selectedLeave.roomNo}</Typography>
                  
//                   <Typography variant="caption" sx={{ color: G[500], fontWeight: 600, mt: 1 }}>Contact Number</Typography>
//                   <Typography sx={{ color: G[800], fontWeight: 500 }}>{selectedLeave.contactNumber}</Typography>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Typography variant="caption" sx={{ color: G[500], fontWeight: 600 }}>Leave Type</Typography>
//                   <Typography sx={{ color: G[800], fontWeight: 500, mb: 1 }}>{selectedLeave.leaveType}</Typography>
                  
//                   <Typography variant="caption" sx={{ color: G[500], fontWeight: 600, mt: 1 }}>Duration</Typography>
//                   <Typography sx={{ color: G[800], fontWeight: 500, mb: 1 }}>
//                     {selectedLeave.fromDate} to {selectedLeave.toDate} ({selectedLeave.days} days)
//                   </Typography>
                  
//                   <Typography variant="caption" sx={{ color: G[500], fontWeight: 600, mt: 1 }}>Applied On</Typography>
//                   <Typography sx={{ color: G[800], fontWeight: 500, mb: 1 }}>{selectedLeave.appliedDate}</Typography>
                  
//                   <Typography variant="caption" sx={{ color: G[500], fontWeight: 600, mt: 1 }}>Status</Typography>
//                   <Chip
//                     label={getStatusColor(selectedLeave.status).text}
//                     size="small"
//                     sx={{
//                       bgcolor: getStatusColor(selectedLeave.status).bg,
//                       color: getStatusColor(selectedLeave.status).color,
//                       mt: 0.5
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="caption" sx={{ color: G[500], fontWeight: 600 }}>Reason for Leave</Typography>
//                   <Paper sx={{ p: 2, bgcolor: G[50], mt: 0.5, borderRadius: 2 }}>
//                     <Typography sx={{ color: G[700] }}>{selectedLeave.reason}</Typography>
//                   </Paper>
//                 </Grid>
//                 {selectedLeave.rejectionReason && (
//                   <Grid item xs={12}>
//                     <Alert severity="error" sx={{ borderRadius: 2 }}>
//                       <Typography variant="subtitle2" fontWeight={600}>Rejection Reason:</Typography>
//                       <Typography>{selectedLeave.rejectionReason}</Typography>
//                     </Alert>
//                   </Grid>
//                 )}
//               </Grid>
//             ) : (
//               // Apply Leave Mode
//               <Grid container spacing={2.5}>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="Student Name"
//                     value={newLeave.studentName}
//                     onChange={(e) => setNewLeave({...newLeave, studentName: e.target.value})}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 2, bgcolor: G[50],
//                         '& fieldset': { borderColor: G[200] },
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="Student ID"
//                     value={newLeave.studentId}
//                     onChange={(e) => setNewLeave({...newLeave, studentId: e.target.value})}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 2, bgcolor: G[50],
//                         '& fieldset': { borderColor: G[200] },
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <FormControl fullWidth>
//                     <InputLabel>Leave Type</InputLabel>
//                     <Select
//                       label="Leave Type"
//                       value={newLeave.leaveType}
//                       onChange={(e) => setNewLeave({...newLeave, leaveType: e.target.value})}
//                       sx={{
//                         borderRadius: 2, bgcolor: G[50],
//                         '& .MuiOutlinedInput-notchedOutline': { borderColor: G[200] },
//                       }}
//                     >
//                       <MenuItem value="Casual Leave">Casual Leave</MenuItem>
//                       <MenuItem value="Medical Leave">Medical Leave</MenuItem>
//                       <MenuItem value="Emergency Leave">Emergency Leave</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="Hostel"
//                     value={newLeave.hostel}
//                     onChange={(e) => setNewLeave({...newLeave, hostel: e.target.value})}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 2, bgcolor: G[50],
//                         '& fieldset': { borderColor: G[200] },
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="Room Number"
//                     value={newLeave.roomNo}
//                     onChange={(e) => setNewLeave({...newLeave, roomNo: e.target.value})}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 2, bgcolor: G[50],
//                         '& fieldset': { borderColor: G[200] },
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="Contact Number"
//                     value={newLeave.contactNumber}
//                     onChange={(e) => setNewLeave({...newLeave, contactNumber: e.target.value})}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 2, bgcolor: G[50],
//                         '& fieldset': { borderColor: G[200] },
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="From Date"
//                     type="date"
//                     value={newLeave.fromDate}
//                     onChange={(e) => setNewLeave({...newLeave, fromDate: e.target.value})}
//                     InputLabelProps={{ shrink: true }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 2, bgcolor: G[50],
//                         '& fieldset': { borderColor: G[200] },
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="To Date"
//                     type="date"
//                     value={newLeave.toDate}
//                     onChange={(e) => setNewLeave({...newLeave, toDate: e.target.value})}
//                     InputLabelProps={{ shrink: true }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 2, bgcolor: G[50],
//                         '& fieldset': { borderColor: G[200] },
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Reason for Leave"
//                     multiline
//                     rows={3}
//                     value={newLeave.reason}
//                     onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 2, bgcolor: G[50],
//                         '& fieldset': { borderColor: G[200] },
//                       },
//                     }}
//                   />
//                 </Grid>
//               </Grid>
//             )}
//           </DialogContent>
//           <Divider sx={{ borderColor: G[100] }} />
//           <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
//             <Button onClick={() => setOpenDialog(false)} sx={{
//               color: G[600], borderRadius: 2, textTransform: 'none', fontWeight: 600,
//               border: `1px solid ${G[200]}`, px: 3,
//               '&:hover': { bgcolor: G[50] }
//             }}>
//               Close
//             </Button>
//             {!selectedLeave && (
//               <Button 
//                 variant="contained" 
//                 onClick={handleSubmitLeave}
//                 sx={{
//                   bgcolor: G[700], color: '#ffffff', fontWeight: 600,
//                   borderRadius: 2, textTransform: 'none', px: 3,
//                   boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
//                   '&:hover': { bgcolor: G[800] }
//                 }}
//               >
//                 Submit Application
//               </Button>
//             )}
//           </DialogActions>
//         </Dialog>

//         {/* Snackbar for notifications */}
//         <Snackbar
//           open={openSnackbar}
//           autoHideDuration={4000}
//           onClose={() => setOpenSnackbar(false)}
//           anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//         >
//           <Alert severity={snackbarSeverity} sx={{ borderRadius: 2 }}>
//             {snackbarMessage}
//           </Alert>
//         </Snackbar>

//       </Box>
//     </Box>
//   );
// };

// export default AdminLeaves;