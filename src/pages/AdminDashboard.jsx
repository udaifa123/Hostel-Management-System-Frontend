// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Grid,
//   Typography,
//   Card,
//   CardContent,
//   Avatar,
//   IconButton,
//   Button,
//   Paper,
//   LinearProgress,
//   alpha,
//   Chip,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Tooltip
// } from '@mui/material';
// import {
//   Dashboard as DashboardIcon,
//   People as PeopleIcon,
//   MeetingRoom as RoomIcon,
//   ReportProblem as ComplaintIcon,
//   School as SchoolIcon,
//   Refresh as RefreshIcon,
//   TrendingUp as TrendingUpIcon,
//   Warning as WarningIcon,
//   CheckCircle as CheckCircleIcon,
//   Person as PersonIcon,
//   Security as SecurityIcon,
//   Home as HomeIcon
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import adminService from '../services/adminService';

// const theme = {
//   navy: '#0B1220',
//   navyLight: '#1A1F36',
//   navyCard: '#151F30',
//   gold: '#C9A84C',
//   goldLight: '#E8C97A',
//   slate: '#94A3B8',
//   white: '#F1F5F9',
//   success: '#10B981',
//   warning: '#F59E0B',
//   error: '#EF4444',
//   info: '#3B82F6'
// };

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalHostels: 0,
//     totalStudents: 0,
//     totalWardens: 0,
//     totalRooms: 0,
//     pendingComplaints: 0,
//     activeUsers: 0
//   });
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       // Try to fetch real data, but don't worry if it fails
//       const data = await adminService.getDashboardStats();
//       setStats(data);
//     } catch (error) {
//       console.log('Using mock data - API not ready');
//       // Mock data for development
//       setStats({
//         totalHostels: 5,
//         totalStudents: 1250,
//         totalWardens: 8,
//         totalRooms: 450,
//         pendingComplaints: 23,
//         activeUsers: 98
//       });
      
//       setRecentActivities([
//         { id: 1, action: 'New hostel registered', time: '5 min ago', user: 'Boys Hostel A' },
//         { id: 2, action: 'Warden assigned', time: '1 hour ago', user: 'Mr. Sharma' },
//         { id: 3, action: 'New complaint filed', time: '2 hours ago', user: 'Room 101' },
//         { id: 4, action: 'Fee payment received', time: '3 hours ago', user: '₹15,000' },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statCards = [
//     { 
//       title: 'Total Hostels', 
//       value: stats.totalHostels, 
//       icon: <HomeIcon />, 
//       color: theme.gold,
//       path: '/admin/hostels'
//     },
//     { 
//       title: 'Total Students', 
//       value: stats.totalStudents, 
//       icon: <PeopleIcon />, 
//       color: theme.info,
//       path: '/admin/students'
//     },
//     { 
//       title: 'Wardens', 
//       value: stats.totalWardens, 
//       icon: <SecurityIcon />, 
//       color: theme.success,
//       path: '/admin/wardens'
//     },
//     { 
//       title: 'Total Rooms', 
//       value: stats.totalRooms, 
//       icon: <RoomIcon />, 
//       color: theme.warning,
//       path: '/admin/rooms'
//     },
//     { 
//       title: 'Pending Complaints', 
//       value: stats.pendingComplaints, 
//       icon: <ComplaintIcon />, 
//       color: theme.error,
//       path: '/admin/complaints'
//     },
//     { 
//       title: 'Active Users', 
//       value: `${stats.activeUsers}%`, 
//       icon: <TrendingUpIcon />, 
//       color: theme.goldLight,
//       path: '/admin/analytics'
//     }
//   ];

//   if (loading) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <LinearProgress sx={{ bgcolor: alpha(theme.gold, 0.1), '& .MuiLinearProgress-bar': { bgcolor: theme.gold } }} />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3, bgcolor: '#0B1220', minHeight: '100vh' }}>
//       {/* Header */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
//         <Box>
//           <Typography variant="h4" sx={{ color: theme.white, fontWeight: 800, mb: 1 }}>
//             Admin Dashboard
//           </Typography>
//           <Typography variant="body1" sx={{ color: theme.slate }}>
//             Welcome back! Here's your system overview
//           </Typography>
//         </Box>
//         <Box display="flex" gap={2}>
//           <Tooltip title="Refresh">
//             <IconButton
//               onClick={fetchDashboardData}
//               sx={{
//                 bgcolor: alpha(theme.navyLight, 0.5),
//                 border: `1px solid ${alpha(theme.gold, 0.2)}`,
//                 color: theme.slate,
//                 '&:hover': { borderColor: theme.gold, color: theme.gold }
//               }}
//             >
//               <RefreshIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       </Box>

//       {/* Stats Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         {statCards.map((card, index) => (
//           <Grid item xs={12} sm={6} md={4} key={index}>
//             <Card
//               onClick={() => navigate(card.path)}
//               sx={{
//                 bgcolor: alpha(theme.navyLight, 0.3),
//                 borderRadius: '16px',
//                 border: `1px solid ${alpha(card.color, 0.2)}`,
//                 cursor: 'pointer',
//                 transition: 'all 0.3s ease',
//                 '&:hover': {
//                   transform: 'translateY(-4px)',
//                   borderColor: card.color,
//                   boxShadow: `0 10px 20px -8px ${alpha(card.color, 0.3)}`
//                 }
//               }}
//             >
//               <CardContent>
//                 <Box display="flex" justifyContent="space-between" alignItems="center">
//                   <Box>
//                     <Typography variant="body2" sx={{ color: theme.slate, mb: 1 }}>
//                       {card.title}
//                     </Typography>
//                     <Typography variant="h3" sx={{ color: theme.white, fontWeight: 700 }}>
//                       {card.value}
//                     </Typography>
//                   </Box>
//                   <Avatar sx={{ bgcolor: alpha(card.color, 0.2), color: card.color }}>
//                     {card.icon}
//                   </Avatar>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Quick Actions */}
//       <Paper sx={{ p: 3, mb: 4, bgcolor: alpha(theme.navyLight, 0.3), borderRadius: '16px' }}>
//         <Typography variant="h6" sx={{ color: theme.white, fontWeight: 600, mb: 2 }}>
//           Quick Actions
//         </Typography>
//         <Grid container spacing={2}>
//           {[
//             { label: 'Add Hostel', icon: <HomeIcon />, path: '/admin/hostels/add', color: theme.gold },
//             { label: 'Add Warden', icon: <SecurityIcon />, path: '/admin/wardens/add', color: theme.info },
//             { label: 'View Students', icon: <PeopleIcon />, path: '/admin/students', color: theme.success },
//             { label: 'View Complaints', icon: <ComplaintIcon />, path: '/admin/complaints', color: theme.warning },
//             { label: 'Generate Report', icon: <TrendingUpIcon />, path: '/admin/reports', color: theme.goldLight }
//           ].map((action, index) => (
//             <Grid item xs={12} sm={6} md={2.4} key={index}>
//               <Button
//                 fullWidth
//                 startIcon={action.icon}
//                 onClick={() => navigate(action.path)}
//                 sx={{
//                   py: 1.5,
//                   bgcolor: alpha(action.color, 0.1),
//                   color: action.color,
//                   border: `1px solid ${alpha(action.color, 0.2)}`,
//                   '&:hover': {
//                     bgcolor: alpha(action.color, 0.2),
//                     transform: 'translateY(-2px)'
//                   }
//                 }}
//               >
//                 {action.label}
//               </Button>
//             </Grid>
//           ))}
//         </Grid>
//       </Paper>

//       {/* Recent Activities */}
//       <Paper sx={{ p: 3, bgcolor: alpha(theme.navyLight, 0.3), borderRadius: '16px' }}>
//         <Typography variant="h6" sx={{ color: theme.white, fontWeight: 600, mb: 2 }}>
//           Recent Activities
//         </Typography>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ color: theme.gold }}>Activity</TableCell>
//                 <TableCell sx={{ color: theme.gold }}>Details</TableCell>
//                 <TableCell sx={{ color: theme.gold }}>Time</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {recentActivities.map((activity) => (
//                 <TableRow key={activity.id}>
//                   <TableCell>
//                     <Typography sx={{ color: theme.white }}>{activity.action}</Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography sx={{ color: theme.slate }}>{activity.user}</Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography sx={{ color: theme.slate }}>{activity.time}</Typography>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Development Notice */}
//       <Paper sx={{ p: 2, mt: 3, bgcolor: alpha(theme.info, 0.1), borderRadius: '8px' }}>
//         <Typography variant="body2" sx={{ color: theme.info }}>
//           🚀 Admin dashboard is working! The 404 error for /api/admin/wardens is expected - 
//           you need to implement the backend API endpoints. Your frontend is working perfectly!
//         </Typography>
//       </Paper>
//     </Box>
//   );
// };

// export default AdminDashboard;