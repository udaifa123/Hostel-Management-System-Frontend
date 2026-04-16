// // src/App.jsx
// import React, { useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import { SocketProvider } from "./context/SocketContext";
// import Layout from "./components/Layout/Layout";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import AdminLogin from "./pages/AdminLogin";
// import Register from "./pages/Register";
// import Contact from "./pages/Contact";
// import Features from "./components/Features";
// import HowItWorks from "./components/HowItWorks";

// import Dashboard from "./pages/Dashboard";
// import StudentDashboard from "./pages/StudentDashboard";
// import AdminDashboard from "./pages/AdminDashboard";
// import ParentPortal from "./pages/ParentPortal";
// import WardenDashboard from "./pages/WardenDashboard";
// import SecurityDashboard from "./pages/SecurityDashboard";
// import FrontOfficeDashboard from "./pages/FrontOfficeDashboard";

// import Students from "./pages/Students";
// import StudentDetails from "./pages/StudentDetails";
// import AddStudent from "./pages/AddStudent";
// import Dormitories from "./pages/Dormitories";
// import DormitoryDetails from "./pages/DormitoryDetails";
// import Attendance from "./pages/Attendance";
// import MarkAttendance from "./pages/MarkAttendance";
// import Leaves from "./pages/Leaves";
// import ApplyLeave from "./pages/ApplyLeave";
// import Visitors from "./pages/Visitors";
// import Messages from "./pages/Messages";
// import Reports from "./pages/Reports";
// import Profile from "./pages/Profile";
// import Settings from "./pages/Settings";
// import NotFound from "./pages/NotFound";

// // ================= ROLE REDIRECT =================
// const getDashboardByRole = (role) => {
//   switch (role) {
//     case "admin": return "/admin-dashboard";
//     case "parent": return "/parent";
//     case "warden": return "/warden-dashboard";
//     case "security": return "/security-dashboard";
//     case "front_office": return "/front-office";
//     case "student": return "/dashboard";
//     default: return "/login";
//   }
// };

// // ================= PAGE TITLE UPDATER =================
// const PageTitleUpdater = ({ children }) => {
//   const location = useLocation();

//   useEffect(() => {
//     const path = location.pathname;
//     let title = "ILHAM - Smart Campus";

//     const titleMap = {
//       "/": "Home - ILHAM",
//       "/login": "Login - ILHAM",
//       "/admin/login": "Admin Login - ILHAM",
//       "/register": "Register - ILHAM",
//       "/dashboard": "Student Dashboard - ILHAM",
//       "/admin-dashboard": "Admin Dashboard - ILHAM",
//       "/parent": "Parent Portal - ILHAM",
//       "/warden-dashboard": "Warden Dashboard - ILHAM",
//       "/security-dashboard": "Security Dashboard - ILHAM",
//       "/front-office": "Front Office - ILHAM"
//     };

//     for (const key in titleMap) {
//       if (path === key || path.includes(key)) {
//         title = titleMap[key];
//       }
//     }

//     document.title = title;
//   }, [location]);

//   return children;
// };

// // ================= PROTECTED ROUTE =================
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user, isAuthenticated, loading } = useAuth();
//   const location = useLocation();

//   if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

//   if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

//   if (allowedRoles && !allowedRoles.includes(user?.role)) {
//     return <Navigate to={getDashboardByRole(user?.role)} replace />;
//   }

//   return children;
// };

// // ================= PUBLIC ROUTE =================
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated, user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

//   if (isAuthenticated && (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/admin/login")) {
//     return <Navigate to={getDashboardByRole(user?.role)} replace />;
//   }

//   return children;
// };

// // ================= APP CONTENT =================
// const AppContent = () => {
//   return (
//     <PageTitleUpdater>
//       <Navbar />
//       <Routes>
//         {/* PUBLIC */}
//         <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
//         <Route path="/features" element={<Features />} />
//         <Route path="/how-it-works" element={<HowItWorks />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
//         <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
//         <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />

//         {/* STUDENT */}
//         <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["student"]}><Layout><StudentDashboard /></Layout></ProtectedRoute>} />

//         {/* WARDEN */}
//         <Route path="/warden-dashboard" element={<ProtectedRoute allowedRoles={["warden"]}><Layout><WardenDashboard /></Layout></ProtectedRoute>} />

//         {/* SECURITY */}
//         <Route path="/security-dashboard" element={<ProtectedRoute allowedRoles={["security"]}><Layout><SecurityDashboard /></Layout></ProtectedRoute>} />

//         {/* FRONT OFFICE */}
//         <Route path="/front-office" element={<ProtectedRoute allowedRoles={["admin","front_office"]}><Layout><FrontOfficeDashboard /></Layout></ProtectedRoute>} />

//         {/* ADMIN */}
//         <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><Layout><AdminDashboard /></Layout></ProtectedRoute>} />

//         {/* PARENT */}
//         <Route path="/parent" element={<ProtectedRoute allowedRoles={["parent"]}><Layout><ParentPortal /></Layout></ProtectedRoute>} />

//         {/* STUDENT MANAGEMENT */}
//         <Route path="/students" element={<ProtectedRoute allowedRoles={["admin","warden"]}><Layout><Students /></Layout></ProtectedRoute>} />
//         <Route path="/students/add" element={<ProtectedRoute allowedRoles={["admin"]}><Layout><AddStudent /></Layout></ProtectedRoute>} />
//         <Route path="/students/:id" element={<ProtectedRoute allowedRoles={["admin","warden"]}><Layout><StudentDetails /></Layout></ProtectedRoute>} />

//         {/* DORMITORIES */}
//         <Route path="/dormitories" element={<ProtectedRoute allowedRoles={["admin","warden"]}><Layout><Dormitories /></Layout></ProtectedRoute>} />
//         <Route path="/dormitories/:id" element={<ProtectedRoute allowedRoles={["admin","warden"]}><Layout><DormitoryDetails /></Layout></ProtectedRoute>} />

//         {/* ATTENDANCE */}
//         <Route path="/attendance" element={<ProtectedRoute allowedRoles={["admin","student","warden"]}><Layout><Attendance /></Layout></ProtectedRoute>} />
//         <Route path="/attendance/mark" element={<ProtectedRoute allowedRoles={["admin"]}><Layout><MarkAttendance /></Layout></ProtectedRoute>} />

//         {/* LEAVES */}
//         <Route path="/leaves" element={<ProtectedRoute allowedRoles={["admin","student","warden","parent"]}><Layout><Leaves /></Layout></ProtectedRoute>} />
//         <Route path="/leaves/apply" element={<ProtectedRoute allowedRoles={["student"]}><Layout><ApplyLeave /></Layout></ProtectedRoute>} />

//         {/* VISITORS */}
//         <Route path="/visitors" element={<ProtectedRoute allowedRoles={["security","admin","warden","front_office"]}><Layout><Visitors /></Layout></ProtectedRoute>} />

//         {/* MESSAGES */}
//         <Route path="/messages" element={<ProtectedRoute allowedRoles={["admin","student","parent","warden","security","front_office"]}><Layout><Messages /></Layout></ProtectedRoute>} />

//         {/* REPORTS */}
//         <Route path="/reports" element={<ProtectedRoute allowedRoles={["admin","warden"]}><Layout><Reports /></Layout></ProtectedRoute>} />

//         {/* PROFILE / SETTINGS */}
//         <Route path="/profile" element={<ProtectedRoute allowedRoles={["admin","student","parent","warden","security","front_office"]}><Layout><Profile /></Layout></ProtectedRoute>} />
//         <Route path="/settings" element={<ProtectedRoute allowedRoles={["admin","student","parent","warden","security","front_office"]}><Layout><Settings /></Layout></ProtectedRoute>} />

//         {/* 404 */}
//         <Route path="/404" element={<NotFound />} />
//         <Route path="*" element={<Navigate to="/404" replace />} />
//       </Routes>
//       <Footer />
//     </PageTitleUpdater>
//   );
// };

// // ================= MAIN APP =================
// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <SocketProvider>
//           <Toaster
//             position="top-right"
//             toastOptions={{
//               duration: 4000,
//               style: { background: '#363636', color: '#fff', borderRadius: '8px' },
//               success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
//               error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } }
//             }}
//           />
//           <AppContent />
//         </SocketProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;








import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Toolbar } from '@mui/material';

import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { CallProvider } from "./context/CallContext";
import { HostelProvider } from "./context/HostelContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StudentSidebar from "./components/StudentSidebar";
import ParentSidebar from "./components/ParentSidebar";
import AdminSidebar from "./components/AdminSidebar";
import WardenSidebar from "./components/WardenSidebar";
import PayPalPayment from "./components/PayPalPayment";
// import NotificationBell from "./components/NotificationBell";
// Layout Components
import ParentLayout from "./components/Layout/ParentLayout";
import AdminLayout from "./components/Layout/AdminLayout";
import WardenLayout from "./components/Layout/WardenLayout";

// Public Pages
import Home from "./pages/Home";
import Hostels from "./pages/Hostels";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
// import Register from "./pages/Register";
import Contact from "./pages/Contact";

// Student Dashboard Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentChat from "./pages/student/StudentChat";
import StudentVisits from "./pages/student/StudentVisits";
import StudentLeaves from "./pages/student/StudentLeaves";
import StudentComplaints from "./pages/student/StudentComplaints";
import StudentFees from "./pages/student/StudentFees";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentNotifications from "./pages/student/StudentNotifications";
import StudentSettings from './pages/student/StudentSettings';
import StudentHelp from './pages/student/StudentHelp';

// Warden Dashboard Pages
import WardenDashboard from "./pages/warden/WardenDashboard";
import WardenStudents from "./pages/warden/WardenStudents";
import WardenAddStudent from "./pages/warden/WardenAddStudent";
import WardenRooms from "./pages/warden/WardenRooms";
import WardenAttendance from "./pages/warden/WardenAttendance";
import WardenLeaves from "./pages/warden/WardenLeaves";
import WardenComplaints from "./pages/warden/WardenComplaints";
import WardenChat from "./pages/warden/WardenChat";
import WardenFees from "./pages/warden/WardenFees";
import WardenNotices from "./pages/warden/WardenNotices";
import WardenVisitors from "./pages/warden/WardenVisitors";
import WardenMess from "./pages/warden/WardenMess";
import WardenReports from "./pages/warden/WardenReports";
import WardenProfile from "./pages/warden/WardenProfile";
import WardenQRScanner from "./pages/warden/WardenQRScanner";
import WardenMaintenance from "./pages/warden/WardenMaintenance";
import WardenSettings from "./pages/warden/WardenSettings";


// Admin Dashboard Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHostels from "./pages/admin/AdminHostels";
import AdminWardens from "./pages/admin/AdminWardens";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminFees from "./pages/admin/AdminFees";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import Assets from "./pages/admin/Assets";
import WardenAssets from './pages/warden/WardenAssets';


// Parent Dashboard Pages
import ParentLogin from "./pages/parent/ParentLogin";
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentStudentProfile from "./pages/parent/ParentStudentProfile";
import ParentAttendance from "./pages/parent/ParentAttendance";
import ParentLeaves from "./pages/parent/ParentLeaves";
import ParentComplaints from "./pages/parent/ParentComplaints";
import ParentNotices from "./pages/parent/ParentNotices";
import ParentFees from "./pages/parent/ParentFees";
import ParentNotifications from "./pages/parent/ParentNotifications";
import ParentMessMenu from "./pages/parent/ParentMessMenu";
import ParentVisitRequests from "./pages/parent/ParentVisitRequests";
import ParentChat from "./pages/parent/ParentChat";

// Other pages
import NotFound from "./pages/NotFound";

// Role redirect
const getDashboardByRole = (role) => {
  switch (role) {
    case "admin": return "/admin/dashboard";
    case "parent": return "/parent/dashboard";
    case "warden": return "/warden/dashboard";
    case "student": return "/student/dashboard";
    default: return "/login";
  }
};

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getDashboardByRole(user?.role)} replace />;
  }

  return children;
};

// Public Route
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated && (
    location.pathname === "/login" || 
    location.pathname === "/register" || 
    location.pathname === "/admin/login"
  )) {
    return <Navigate to={getDashboardByRole(user?.role)} replace />;
  }

  return children;
};

// Layout with Navbar only
const NavbarOnlyLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px - 300px)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
};

// Layout with Sidebar for Student
const StudentSidebarLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <StudentSidebar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          minHeight: '100vh',
          ml: '10px',
          width: 'calc(100% - 300px)'
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

// App Content
const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <PublicRoute>
          <NavbarOnlyLayout>
            <Home />
          </NavbarOnlyLayout>
        </PublicRoute>
      } />
      
      <Route path="/hostels" element={
        <NavbarOnlyLayout>
          <Hostels />
        </NavbarOnlyLayout>
      } />
      
      <Route path="/contact" element={
        <NavbarOnlyLayout>
          <Contact />
        </NavbarOnlyLayout>
      } />
      
      <Route path="/login" element={
        <PublicRoute>
          <NavbarOnlyLayout>
            <Login />
          </NavbarOnlyLayout>
        </PublicRoute>
      } />
      
      <Route path="/admin/login" element={
        <PublicRoute>
          <NavbarOnlyLayout>
            <AdminLogin />
          </NavbarOnlyLayout>
        </PublicRoute>
      } />
      
      {/* <Route path="/register" element={
        <PublicRoute>
          <NavbarOnlyLayout>
            <Register />
          </NavbarOnlyLayout>
        </PublicRoute>
      } /> */}

      {/* Student Routes */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentSidebarLayout>
            <StudentDashboard />
          </StudentSidebarLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/student/profile" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentSidebarLayout>
            <StudentProfile />
          </StudentSidebarLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/student/chat" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentSidebarLayout>
            <StudentChat />
          </StudentSidebarLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/student/visits" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentSidebarLayout>
            <StudentVisits />
          </StudentSidebarLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/student/leaves" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentSidebarLayout>
            <StudentLeaves />
          </StudentSidebarLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/student/complaints" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentSidebarLayout>
            <StudentComplaints />
          </StudentSidebarLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/student/fees" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentSidebarLayout>
            <StudentFees />
          </StudentSidebarLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/student/attendance" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentSidebarLayout>
            <StudentAttendance />
          </StudentSidebarLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/student/notifications" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentSidebarLayout>
            <StudentNotifications />
          </StudentSidebarLayout>
        </ProtectedRoute>
      } />

      <Route path="/student/settings" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentSidebarLayout>
            <StudentSettings />
          </StudentSidebarLayout>
        </ProtectedRoute>
      } />

      <Route path="/student/help" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentSidebarLayout>
            <StudentHelp />
          </StudentSidebarLayout>
        </ProtectedRoute>
      } />

      {/* Warden Routes */}
      <Route path="/warden/dashboard" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenDashboard />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/warden/students" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenStudents />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/warden/students/add" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenAddStudent />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/warden/rooms" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenRooms />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/warden/attendance" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenAttendance />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />
      


      <Route path="/warden/assets" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenAssets />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />

      <Route path="/warden/leaves" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenLeaves />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/warden/complaints" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenComplaints />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/warden/chat" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenChat />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />

      <Route path="/warden/fees" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenFees />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/warden/notices" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenNotices />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/warden/visitors" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenVisitors />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/warden/mess" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenMess />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/warden/reports" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenReports />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/warden/profile" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenProfile />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/warden/qr-scanner" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenQRScanner />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/warden/maintenance" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenMaintenance />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />


       <Route path="/warden/settings" element={
        <ProtectedRoute allowedRoles={["warden"]}>
          <HostelProvider>
            <WardenLayout>
              <WardenSettings />
            </WardenLayout>
          </HostelProvider>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/hostels" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout>
            <AdminHostels />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/wardens" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout>
            <AdminWardens />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/students" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout>
            <AdminStudents />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/rooms" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout>
            <AdminRooms />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/complaints" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout>
            <AdminComplaints />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/fees" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout>
            <AdminFees />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout>
            <AdminReports />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/settings" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout>
            <AdminSettings />
          </AdminLayout>
        </ProtectedRoute>
      } />


      <Route path="/admin/assets" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout>
            <Assets />
          </AdminLayout>
        </ProtectedRoute>
      } />


      {/* Parent Routes */}
      <Route path="/parent/login" element={
        <PublicRoute>
          <NavbarOnlyLayout>
            <ParentLogin />
          </NavbarOnlyLayout>
        </PublicRoute>
      } />
      
      <Route path="/parent/dashboard" element={
        <ProtectedRoute allowedRoles={["parent"]}>
          <ParentLayout>
            <ParentDashboard />
          </ParentLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/parent/profile" element={
        <ProtectedRoute allowedRoles={["parent"]}>
          <ParentLayout>
            <ParentStudentProfile />
          </ParentLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/parent/attendance" element={
        <ProtectedRoute allowedRoles={["parent"]}>
          <ParentLayout>
            <ParentAttendance />
          </ParentLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/parent/leaves" element={
        <ProtectedRoute allowedRoles={["parent"]}>
          <ParentLayout>
            <ParentLeaves />
          </ParentLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/parent/complaints" element={
        <ProtectedRoute allowedRoles={["parent"]}>
          <ParentLayout>
            <ParentComplaints />
          </ParentLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/parent/notices" element={
        <ProtectedRoute allowedRoles={["parent"]}>
          <ParentLayout>
            <ParentNotices />
          </ParentLayout>
        </ProtectedRoute>
      } />

      <Route path="/parent/fees" element={
        <ProtectedRoute allowedRoles={["parent"]}>
          <ParentLayout>
            <ParentFees />
          </ParentLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/parent/notifications" element={
        <ProtectedRoute allowedRoles={["parent"]}>
          <ParentLayout>
            <ParentNotifications />
          </ParentLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/parent/mess" element={
        <ProtectedRoute allowedRoles={["parent"]}>
          <ParentLayout>
            <ParentMessMenu />
          </ParentLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/parent/visits" element={
        <ProtectedRoute allowedRoles={["parent"]}>
          <ParentLayout>
            <ParentVisitRequests />
          </ParentLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/parent/chat" element={
        <ProtectedRoute allowedRoles={["parent"]}>
          <ParentLayout>
            <ParentChat />
          </ParentLayout>
        </ProtectedRoute>
      } />

      {/* Redirects */}
      <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="/warden-dashboard" element={<Navigate to="/warden/dashboard" replace />} />
      <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/parent" element={<Navigate to="/parent/dashboard" replace />} />

      {/* 404 */}
      <Route path="/404" element={
        <NavbarOnlyLayout>
          <NotFound />
        </NavbarOnlyLayout>
      } />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

// Main App
function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <CallProvider>
            <CssBaseline />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: { 
                  background: '#363636', 
                  color: '#fff', 
                  borderRadius: '8px' 
                },
              }}
            />
            <AppContent />
          </CallProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;