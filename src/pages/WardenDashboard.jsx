import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Calendar,
  Clock,
  Bell,
  LogOut,
  Menu,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  DoorOpen,
  MessageCircle,
  FileText,
  Settings,
  Download,
  Filter,
  Search,
  ChevronRight,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Award,
  BookOpen,
  PieChart,
  TrendingUp,
  Activity,
  Shield,
  Eye,
  Edit,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Clock as ClockIcon
} from 'lucide-react';
import { 
  attendanceAPI, 
  leaveAPI, 
  visitorAPI, 
  studentAPI,
  roomAPI,
  notificationAPI 
} from '../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const WardenDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [pendingVisitors, setPendingVisitors] = useState([]);
  const [activeVisits, setActiveVisits] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: format(new Date().setDate(1), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd')
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    fetchDashboardData();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all required data in parallel
      const [
        studentsRes,
        attendanceRes,
        leavesRes,
        visitorsRes,
        activeVisitsRes,
        complaintsRes,
        roomsRes,
        notificationsRes
      ] = await Promise.all([
        studentAPI.getAll({ assignedTo: user?._id, limit: 100 }),
        attendanceAPI.getMonthlyReport({ 
          from: dateRange.from, 
          to: dateRange.to 
        }),
        leaveAPI.getAll({ status: 'pending' }),
        visitorAPI.getAll({ status: 'pending_warden' }),
        visitorAPI.getActive(),
        studentAPI.getAllComplaints({ assignedTo: user?._id }),
        roomAPI.getAll({ warden: user?._id }),
        notificationAPI.getUnread()
      ]);

      setStudents(studentsRes.data.students || []);
      setAttendance(attendanceRes.data || []);
      setPendingLeaves(leavesRes.data.leaves || []);
      setPendingVisitors(visitorsRes.data.visitors || []);
      setActiveVisits(activeVisitsRes.data.visitors || []);
      setComplaints(complaintsRes.data.complaints || []);
      setRooms(roomsRes.data.rooms || []);
      setNotifications(notificationsRes.data.notifications || []);

      // Calculate statistics
      calculateStats(studentsRes.data, attendanceRes.data, leavesRes.data, roomsRes.data);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (studentsData, attendanceData, leavesData, roomsData) => {
    const totalStudents = studentsData?.students?.length || 0;
    const presentToday = attendanceData?.summary?.present || 0;
    const absentToday = attendanceData?.summary?.absent || 0;
    const pendingLeavesCount = leavesData?.leaves?.filter(l => l.status === 'pending').length || 0;
    const totalRooms = roomsData?.rooms?.length || 0;
    const occupiedRooms = roomsData?.rooms?.filter(r => r.status === 'occupied').length || 0;
    const availableRooms = totalRooms - occupiedRooms;

    setStats({
      totalStudents,
      presentToday,
      absentToday,
      attendanceRate: totalStudents > 0 ? ((presentToday / totalStudents) * 100).toFixed(1) : 0,
      pendingLeaves: pendingLeavesCount,
      pendingVisitors: pendingVisitors.length,
      activeVisits: activeVisits.length,
      totalRooms,
      occupiedRooms,
      availableRooms,
      occupancyRate: totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0,
      pendingComplaints: complaints.filter(c => c.status === 'pending').length
    });
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      await leaveAPI.wardenApprove(leaveId, { 
        status: 'approved',
        remarks: 'Approved by warden'
      });
      toast.success('Leave approved successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to approve leave');
    }
  };

  const handleRejectLeave = async (leaveId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await leaveAPI.wardenApprove(leaveId, { 
        status: 'rejected',
        remarks: reason
      });
      toast.success('Leave rejected');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to reject leave');
    }
  };

  const handleApproveVisitor = async (visitorId) => {
    try {
      await visitorAPI.approve(visitorId, {
        meetingLocation: 'visitor_room',
        timeLimit: 30
      });
      toast.success('Visitor approved');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to approve visitor');
    }
  };

  const handleRejectVisitor = async (visitorId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await visitorAPI.reject(visitorId, { remarks: reason });
      toast.success('Visitor rejected');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to reject visitor');
    }
  };

  const handleCallStudent = (studentId, studentName) => {
    // Implement call functionality (could be WebRTC or just phone call)
    toast.success(`Calling ${studentName}...`);
    // You can integrate with a calling service here
  };

  const handleMarkAttendance = () => {
    navigate('/attendance/mark');
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    const badges = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      checked_in: 'bg-blue-100 text-blue-800',
      checked_out: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="warden-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="warden-profile">
            <div className="profile-icon">
              <Shield size={32} />
            </div>
            <div>
              <h3>{user?.name || 'Warden'}</h3>
              <p className="role-badge">Hostel Warden</p>
            </div>
          </div>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
          >
            <Home size={20} /> Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => { setActiveTab('students'); setSidebarOpen(false); }}
          >
            <Users size={20} /> My Students
            <span className="badge">{stats.totalStudents}</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => { setActiveTab('attendance'); setSidebarOpen(false); }}
          >
            <Calendar size={20} /> Attendance
          </button>
          <button 
            className={`nav-item ${activeTab === 'leaves' ? 'active' : ''}`}
            onClick={() => { setActiveTab('leaves'); setSidebarOpen(false); }}
          >
            <Clock size={20} /> Leave Requests
            {stats.pendingLeaves > 0 && (
              <span className="badge alert">{stats.pendingLeaves}</span>
            )}
          </button>
          <button 
            className={`nav-item ${activeTab === 'visitors' ? 'active' : ''}`}
            onClick={() => { setActiveTab('visitors'); setSidebarOpen(false); }}
          >
            <DoorOpen size={20} /> Visitor Approvals
            {stats.pendingVisitors > 0 && (
              <span className="badge alert">{stats.pendingVisitors}</span>
            )}
          </button>
          <button 
            className={`nav-item ${activeTab === 'active-visits' ? 'active' : ''}`}
            onClick={() => { setActiveTab('active-visits'); setSidebarOpen(false); }}
          >
            <Activity size={20} /> Active Visits
            {stats.activeVisits > 0 && (
              <span className="badge">{stats.activeVisits}</span>
            )}
          </button>
          <button 
            className={`nav-item ${activeTab === 'complaints' ? 'active' : ''}`}
            onClick={() => { setActiveTab('complaints'); setSidebarOpen(false); }}
          >
            <AlertCircle size={20} /> Complaints
            {stats.pendingComplaints > 0 && (
              <span className="badge alert">{stats.pendingComplaints}</span>
            )}
          </button>
          <button 
            className={`nav-item ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => { setActiveTab('rooms'); setSidebarOpen(false); }}
          >
            <Home size={20} /> Rooms
          </button>
          <button 
            className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => { setActiveTab('messages'); setSidebarOpen(false); }}
          >
            <MessageCircle size={20} /> Messages
          </button>
          <button 
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
          >
            <FileText size={20} /> Reports
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h1>Warden Dashboard</h1>
          <div className="header-actions">
            <button className="notification-btn">
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
            <button className="refresh-btn" onClick={fetchDashboardData}>
              <Download size={18} />
            </button>
            <div className="warden-info">
              <span className="warden-name">{user?.name?.split(' ')[0]}</span>
              <div className="warden-avatar">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Users size={24} />
            </div>
            <div className="stat-details">
              <h3>Total Students</h3>
              <p className="stat-value">{stats.totalStudents || 0}</p>
              <span className="stat-label">Under your care</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <UserCheck size={24} />
            </div>
            <div className="stat-details">
              <h3>Present Today</h3>
              <p className="stat-value">{stats.presentToday || 0}</p>
              <span className="stat-label">{stats.attendanceRate}% attendance</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow">
              <Clock size={24} />
            </div>
            <div className="stat-details">
              <h3>Pending Leaves</h3>
              <p className="stat-value">{stats.pendingLeaves || 0}</p>
              <span className="stat-label">Awaiting approval</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <DoorOpen size={24} />
            </div>
            <div className="stat-details">
              <h3>Room Occupancy</h3>
              <p className="stat-value">{stats.occupiedRooms || 0}/{stats.totalRooms || 0}</p>
              <span className="stat-label">{stats.occupancyRate}% full</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Activity size={24} />
            </div>
            <div className="stat-details">
              <h3>Active Visits</h3>
              <p className="stat-value">{stats.activeVisits || 0}</p>
              <span className="stat-label">Currently inside</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">
              <AlertCircle size={24} />
            </div>
            <div className="stat-details">
              <h3>Complaints</h3>
              <p className="stat-value">{stats.pendingComplaints || 0}</p>
              <span className="stat-label">Pending resolution</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn primary" onClick={handleMarkAttendance}>
            <Calendar size={18} /> Mark Attendance
          </button>
          <button className="quick-action-btn" onClick={() => setActiveTab('leaves')}>
            <Clock size={18} /> Review Leaves
          </button>
          <button className="quick-action-btn" onClick={() => setActiveTab('visitors')}>
            <DoorOpen size={18} /> Approve Visitors
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/messages')}>
            <MessageCircle size={18} /> Messages
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-tab">
            {/* Charts Row */}
            <div className="charts-row">
              <div className="chart-card">
                <h3>Attendance Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="present" stroke="#3b82f6" />
                    <Line type="monotone" dataKey="absent" stroke="#ef4444" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Room Occupancy</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={[
                        { name: 'Occupied', value: stats.occupiedRooms },
                        { name: 'Available', value: stats.availableRooms }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={entry => entry.name}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1].map((index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pending Approvals Section */}
            <div className="approvals-section">
              <h2>Pending Approvals</h2>
              
              <div className="approvals-grid">
                {/* Pending Leaves */}
                <div className="approval-card">
                  <div className="approval-header">
                    <Clock size={20} />
                    <h3>Leave Requests</h3>
                    <span className="count">{pendingLeaves.length}</span>
                  </div>
                  <div className="approval-list">
                    {pendingLeaves.slice(0, 3).map(leave => (
                      <div key={leave._id} className="approval-item">
                        <div className="item-info">
                          <p className="item-title">{leave.student?.name}</p>
                          <p className="item-subtitle">
                            {format(new Date(leave.fromDate), 'dd MMM')} - {format(new Date(leave.toDate), 'dd MMM')}
                          </p>
                        </div>
                        <div className="item-actions">
                          <button 
                            className="btn-approve"
                            onClick={() => handleApproveLeave(leave._id)}
                          >
                            <ThumbsUp size={16} />
                          </button>
                          <button 
                            className="btn-reject"
                            onClick={() => handleRejectLeave(leave._id)}
                          >
                            <ThumbsDown size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {pendingLeaves.length > 3 && (
                    <button 
                      className="view-all"
                      onClick={() => setActiveTab('leaves')}
                    >
                      View All <ChevronRight size={16} />
                    </button>
                  )}
                </div>

                {/* Pending Visitors */}
                <div className="approval-card">
                  <div className="approval-header">
                    <DoorOpen size={20} />
                    <h3>Visitor Approvals</h3>
                    <span className="count">{pendingVisitors.length}</span>
                  </div>
                  <div className="approval-list">
                    {pendingVisitors.slice(0, 3).map(visitor => (
                      <div key={visitor._id} className="approval-item">
                        <div className="item-info">
                          <p className="item-title">{visitor.name}</p>
                          <p className="item-subtitle">
                            Meeting {visitor.student?.name}
                          </p>
                        </div>
                        <div className="item-actions">
                          <button 
                            className="btn-approve"
                            onClick={() => handleApproveVisitor(visitor._id)}
                          >
                            <ThumbsUp size={16} />
                          </button>
                          <button 
                            className="btn-reject"
                            onClick={() => handleRejectVisitor(visitor._id)}
                          >
                            <ThumbsDown size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {pendingVisitors.length > 3 && (
                    <button 
                      className="view-all"
                      onClick={() => setActiveTab('visitors')}
                    >
                      View All <ChevronRight size={16} />
                    </button>
                  )}
                </div>

                {/* Active Visits */}
                <div className="approval-card">
                  <div className="approval-header">
                    <Activity size={20} />
                    <h3>Active Visits</h3>
                    <span className="count">{activeVisits.length}</span>
                  </div>
                  <div className="approval-list">
                    {activeVisits.slice(0, 3).map(visit => (
                      <div key={visit._id} className="approval-item">
                        <div className="item-info">
                          <p className="item-title">{visit.name}</p>
                          <p className="item-subtitle">
                            with {visit.student?.name}
                          </p>
                        </div>
                        <span className={`status-badge ${getStatusBadge(visit.status)}`}>
                          {visit.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  {activeVisits.length > 3 && (
                    <button 
                      className="view-all"
                      onClick={() => setActiveTab('active-visits')}
                    >
                      View All <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {complaints.slice(0, 5).map(complaint => (
                  <div key={complaint._id} className="activity-item">
                    <AlertCircle size={16} className="activity-icon" />
                    <div className="activity-content">
                      <p>
                        <strong>{complaint.student?.name}</strong> raised a complaint: {complaint.title}
                      </p>
                      <span className="activity-time">
                        {format(new Date(complaint.createdAt), 'hh:mm a')}
                      </span>
                    </div>
                    <span className={`status-badge ${getStatusBadge(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="students-tab">
            <div className="tab-header">
              <h2>My Students ({stats.totalStudents})</h2>
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="students-grid">
              {students
                .filter(s => 
                  s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(student => (
                  <div key={student._id} className="student-card">
                    <div className="student-avatar">
                      {student.name.charAt(0)}
                    </div>
                    <div className="student-info">
                      <h3>{student.name}</h3>
                      <p className="roll-number">{student.rollNumber}</p>
                      <div className="student-details">
                        <span><BookOpen size={14} /> {student.course}</span>
                        <span><Home size={14} /> Room {student.roomNumber}</span>
                      </div>
                    </div>
                    <div className="student-actions">
                      <button 
                        className="btn-icon"
                        onClick={() => handleCallStudent(student._id, student.name)}
                      >
                        <Phone size={16} />
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={() => handleViewStudent(student)}
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Leaves Tab */}
        {activeTab === 'leaves' && (
          <div className="leaves-tab">
            <h2>Leave Requests</h2>
            <div className="leaves-list">
              {pendingLeaves.map(leave => (
                <div key={leave._id} className="leave-card">
                  <div className="leave-header">
                    <div className="student-info">
                      <div className="student-avatar small">
                        {leave.student?.name?.charAt(0)}
                      </div>
                      <div>
                        <h3>{leave.student?.name}</h3>
                        <p className="roll-number">{leave.student?.rollNumber}</p>
                      </div>
                    </div>
                    <span className={`status-badge ${getStatusBadge(leave.status)}`}>
                      {leave.status}
                    </span>
                  </div>

                  <div className="leave-details">
                    <div className="detail-row">
                      <Calendar size={16} />
                      <span>
                        {format(new Date(leave.fromDate), 'dd MMM yyyy')} - {format(new Date(leave.toDate), 'dd MMM yyyy')}
                      </span>
                    </div>
                    <div className="detail-row">
                      <ClockIcon size={16} />
                      <span>{leave.leaveDays} days</span>
                    </div>
                    <div className="detail-row">
                      <FileText size={16} />
                      <span>{leave.reason}</span>
                    </div>
                  </div>

                  {leave.status === 'pending' && (
                    <div className="leave-actions">
                      <button 
                        className="btn-approve large"
                        onClick={() => handleApproveLeave(leave._id)}
                      >
                        <ThumbsUp size={18} /> Approve
                      </button>
                      <button 
                        className="btn-reject large"
                        onClick={() => handleRejectLeave(leave._id)}
                      >
                        <ThumbsDown size={18} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visitors Tab */}
        {activeTab === 'visitors' && (
          <div className="visitors-tab">
            <h2>Pending Visitor Approvals</h2>
            <div className="visitors-list">
              {pendingVisitors.map(visitor => (
                <div key={visitor._id} className="visitor-card">
                  <div className="visitor-header">
                    <div className="visitor-avatar large">
                      {visitor.name.charAt(0)}
                    </div>
                    <div>
                      <h3>{visitor.name}</h3>
                      <p className="relationship">{visitor.relationship}</p>
                    </div>
                  </div>

                  <div className="visitor-details">
                    <div className="detail-row">
                      <Users size={16} />
                      <span>Meeting: {visitor.student?.name}</span>
                    </div>
                    <div className="detail-row">
                      <Phone size={16} />
                      <span>{visitor.phone}</span>
                    </div>
                    <div className="detail-row">
                      <ClockIcon size={16} />
                      <span>Arrived: {format(new Date(visitor.entryTime), 'hh:mm a')}</span>
                    </div>
                  </div>

                  <div className="visitor-actions">
                    <button 
                      className="btn-approve large"
                      onClick={() => handleApproveVisitor(visitor._id)}
                    >
                      <ThumbsUp size={18} /> Approve Visit
                    </button>
                    <button 
                      className="btn-reject large"
                      onClick={() => handleRejectVisitor(visitor._id)}
                    >
                      <ThumbsDown size={18} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Visits Tab */}
        {activeTab === 'active-visits' && (
          <div className="active-visits-tab">
            <h2>Active Visits ({activeVisits.length})</h2>
            <div className="visits-grid">
              {activeVisits.map(visit => (
                <div key={visit._id} className="visit-card">
                  <div className="visit-header">
                    <h3>{visit.name}</h3>
                    <span className={`status-badge ${getStatusBadge(visit.status)}`}>
                      {visit.status}
                    </span>
                  </div>
                  <div className="visit-details">
                    <p><Users size={14} /> Student: {visit.student?.name}</p>
                    <p><ClockIcon size={14} /> Entry: {format(new Date(visit.entryTime), 'hh:mm a')}</p>
                    <p><ClockIcon size={14} /> Expected Exit: {format(new Date(visit.expectedExitTime), 'hh:mm a')}</p>
                    <p><MapPin size={14} /> Location: {visit.meetingLocation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {showStudentModal && selectedStudent && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Student Details</h2>
              <button onClick={() => setShowStudentModal(false)}>×</button>
            </div>
            <div className="student-details-modal">
              <div className="profile-section">
                <div className="profile-avatar large">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3>{selectedStudent.name}</h3>
                  <p>{selectedStudent.rollNumber}</p>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <label>Course</label>
                  <p>{selectedStudent.course}</p>
                </div>
                <div className="detail-item">
                  <label>Semester</label>
                  <p>{selectedStudent.semester}</p>
                </div>
                <div className="detail-item">
                  <label>Room</label>
                  <p>{selectedStudent.roomNumber}</p>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <p>{selectedStudent.phone}</p>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <p>{selectedStudent.email}</p>
                </div>
                <div className="detail-item">
                  <label>Blood Group</label>
                  <p>{selectedStudent.bloodGroup}</p>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-call"
                  onClick={() => handleCallStudent(selectedStudent._id, selectedStudent.name)}
                >
                  <Phone size={16} /> Call Student
                </button>
                <button 
                  className="btn-close"
                  onClick={() => setShowStudentModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .warden-dashboard {
          display: flex;
          min-height: 100vh;
          background: #f0f2f5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Sidebar Styles */
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          transition: transform 0.3s;
          z-index: 1000;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
        }

        .sidebar-header {
          padding: 30px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .warden-profile {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .profile-icon {
          width: 50px;
          height: 50px;
          background: #3b82f6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .warden-profile h3 {
          margin: 0;
          font-size: 18px;
        }

        .role-badge {
          margin: 5px 0 0;
          font-size: 12px;
          opacity: 0.7;
        }

        .close-sidebar {
          display: none;
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .close-sidebar {
            display: block;
          }
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 5px;
          background: none;
          border: none;
          color: rgba(255,255,255,0.8);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .nav-item.active {
          background: #3b82f6;
          color: white;
        }

        .badge {
          margin-left: auto;
          background: #3b82f6;
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 11px;
        }

        .badge.alert {
          background: #ef4444;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px;
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .logout-btn:hover {
          background: #ef4444;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: 20px;
          transition: margin-left 0.3s;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
          }
        }

        .dashboard-header {
          background: white;
          padding: 20px 25px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .menu-btn {
            display: block;
          }
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .notification-btn {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          padding: 2px 5px;
          border-radius: 10px;
        }

        .refresh-btn {
          padding: 8px;
          background: #f1f5f9;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: #64748b;
        }

        .warden-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .warden-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.blue { background: #e3f2fd; color: #1976d2; }
        .stat-icon.green { background: #e8f5e8; color: #388e3c; }
        .stat-icon.yellow { background: #fff3e0; color: #f57c00; }
        .stat-icon.purple { background: #f3e5f5; color: #7b1fa2; }
        .stat-icon.orange { background: #fff3e0; color: #f57c00; }
        .stat-icon.red { background: #ffebee; color: #d32f2f; }

        .stat-details h3 {
          margin: 0 0 5px;
          font-size: 14px;
          color: #64748b;
        }

        .stat-value {
          margin: 0 0 5px;
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-label {
          font-size: 12px;
          color: #94a3b8;
        }

        /* Quick Actions */
        .quick-actions {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
        }

        .quick-action-btn.primary {
          background: #3b82f6;
          color: white;
          border: none;
        }

        .quick-action-btn.primary:hover {
          background: #2563eb;
        }

        .quick-action-btn:hover {
          background: #f8fafc;
        }

        /* Charts */
        .charts-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .chart-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .chart-card h3 {
          margin: 0 0 20px;
          font-size: 16px;
          color: #1e293b;
        }

        /* Approvals Section */
        .approvals-section {
          margin-bottom: 30px;
        }

        .approvals-section h2 {
          margin: 0 0 20px;
          font-size: 18px;
          color: #1e293b;
        }

        .approvals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }

        .approval-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .approval-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }

        .approval-header h3 {
          margin: 0;
          font-size: 16px;
          flex: 1;
        }

        .count {
          background: #e2e8f0;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .approval-list {
          margin-bottom: 15px;
        }

        .approval-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          border-bottom: 1px solid #f1f5f9;
        }

        .item-info {
          flex: 1;
        }

        .item-title {
          margin: 0 0 4px;
          font-weight: 500;
        }

        .item-subtitle {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }

        .item-actions {
          display: flex;
          gap: 5px;
        }

        .btn-approve {
          padding: 6px;
          background: #d1fae5;
          border: none;
          border-radius: 6px;
          color: #10b981;
          cursor: pointer;
        }

        .btn-approve.large {
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-reject {
          padding: 6px;
          background: #fee2e2;
          border: none;
          border-radius: 6px;
          color: #ef4444;
          cursor: pointer;
        }

        .btn-reject.large {
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .view-all {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          font-size: 13px;
          margin-top: 10px;
        }

        /* Recent Activity */
        .recent-activity {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .recent-activity h2 {
          margin: 0 0 20px;
          font-size: 18px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .activity-icon {
          color: #f59e0b;
        }

        .activity-content {
          flex: 1;
        }

        .activity-content p {
          margin: 0 0 4px;
        }

        .activity-time {
          font-size: 11px;
          color: #94a3b8;
        }

        /* Students Grid */
        .students-tab {
          background: white;
          border-radius: 12px;
          padding: 20px;
        }

        .tab-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f1f5f9;
          border-radius: 8px;
          padding: 8px 15px;
          width: 300px;
        }

        .search-box input {
          border: none;
          background: none;
          outline: none;
          width: 100%;
        }

        .students-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
        }

        .student-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .student-card:hover {
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .student-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 20px;
        }

        .student-avatar.small {
          width: 35px;
          height: 35px;
          font-size: 14px;
        }

        .student-info {
          flex: 1;
        }

        .student-info h3 {
          margin: 0 0 4px;
          font-size: 16px;
        }

        .roll-number {
          margin: 0 0 4px;
          font-size: 12px;
          color: #64748b;
        }

        .student-details {
          display: flex;
          gap: 10px;
          font-size: 11px;
          color: #94a3b8;
        }

        .student-details span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .student-actions {
          display: flex;
          gap: 5px;
        }

        .btn-icon {
          padding: 6px;
          background: #f1f5f9;
          border: none;
          border-radius: 6px;
          color: #64748b;
          cursor: pointer;
        }

        .btn-icon:hover {
          background: #e2e8f0;
        }

        /* Leave Cards */
        .leaves-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        .leave-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .leave-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .student-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .leave-details {
          margin: 15px 0;
          padding: 15px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          color: #1e293b;
          font-size: 14px;
        }

        .leave-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        /* Visitor Cards */
        .visitors-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        .visitor-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .visitor-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .visitor-avatar.large {
          width: 60px;
          height: 60px;
          font-size: 24px;
        }

        .relationship {
          color: #64748b;
          font-size: 13px;
          margin: 4px 0 0;
        }

        .visitor-details {
          margin: 15px 0;
          padding: 15px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .visitor-actions {
          display: flex;
          gap: 10px;
        }

        /* Active Visits */
        .visits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .visit-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .visit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .visit-header h3 {
          margin: 0;
          font-size: 16px;
        }

        .visit-details p {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 8px 0;
          color: #64748b;
        }

        /* Modal */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .modal-header button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #64748b;
        }

        .student-details-modal {
          padding: 20px;
        }

        .profile-section {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .profile-avatar.large {
          width: 80px;
          height: 80px;
          font-size: 32px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .detail-item label {
          display: block;
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .detail-item p {
          margin: 0;
          font-weight: 500;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-call {
          flex: 1;
          padding: 12px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-close {
          padding: 12px 24px;
          background: #f1f5f9;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .status-badge.bg-green-100 { background: #d1fae5; color: #10b981; }
        .status-badge.bg-red-100 { background: #fee2e2; color: #ef4444; }
        .status-badge.bg-yellow-100 { background: #fef3c7; color: #f59e0b; }
        .status-badge.bg-blue-100 { background: #dbeafe; color: #3b82f6; }

        /* Responsive */
        @media (max-width: 768px) {
          .charts-row {
            grid-template-columns: 1fr;
          }
          
          .approvals-grid {
            grid-template-columns: 1fr;
          }
          
          .students-grid {
            grid-template-columns: 1fr;
          }
          
          .leaves-list {
            grid-template-columns: 1fr;
          }
          
          .visitors-list {
            grid-template-columns: 1fr;
          }
          
          .visits-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default WardenDashboard;