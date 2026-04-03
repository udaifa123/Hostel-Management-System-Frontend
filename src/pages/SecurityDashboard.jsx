import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  LogOut,
  Bell,
  Camera,
  QrCode,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  UserPlus,
  LogIn,
  LogOut as ExitIcon,
  Download,
  Printer,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ChevronRight,
  Menu,
  X,
  Home,
  History,
  Ban,
  AlertTriangle,
  User
} from 'lucide-react';
import { visitorAPI, studentAPI } from '../api/axios';
import toast from 'react-hot-toast';

const SecurityDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [activeVisitors, setActiveVisitors] = useState([]);
  const [stats, setStats] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // New visitor form
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: 'father',
    studentId: '',
    purpose: '',
    idProofType: 'aadhar',
    idProofNumber: '',
    meetingLocation: 'gate',
    isEmergency: false,
    timeLimit: 30
  });

  useEffect(() => {
    fetchDashboardData();
    checkOverstayAlerts();
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
      checkOverstayAlerts();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch today's visitors
      const visitorsRes = await visitorAPI.getAllVisitors({ 
        fromDate: new Date().toISOString().split('T')[0] 
      });
      setVisitors(visitorsRes.data.visitors || []);
      
      // Fetch active visitors
      const activeRes = await visitorAPI.getActiveVisits();
      setActiveVisitors(activeRes.data.visitors || []);
      
      // Fetch students for dropdown
      const studentsRes = await studentAPI.getAll({ limit: 100 });
      setStudents(studentsRes.data.students || []);
      
      // Calculate stats
      const todayVisitors = visitorsRes.data.visitors?.length || 0;
      const activeCount = activeRes.data.visitors?.length || 0;
      const pendingCount = visitorsRes.data.visitors?.filter(v => 
        v.status === 'pending' || v.status === 'pending_office'
      ).length || 0;
      const completedCount = visitorsRes.data.visitors?.filter(v => 
        v.status === 'checked_out' || v.status === 'completed'
      ).length || 0;
      
      setStats({
        todayVisitors,
        activeVisits: activeCount,
        pendingApprovals: pendingCount,
        completedVisits: completedCount
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const checkOverstayAlerts = async () => {
    try {
      const activeVisits = await visitorAPI.getActiveVisits();
      const overstays = activeVisits.data.visitors?.filter(v => 
        v.expectedExitTime && new Date() > new Date(v.expectedExitTime)
      ) || [];
      
      if (overstays.length > 0) {
        setAlerts(overstays.map(v => ({
          id: v._id,
          message: `${v.name} has overstayed!`,
          visitor: v
        })));
        
        // Show toast for each overstay
        overstays.forEach(v => {
          toast.error(`${v.name} has exceeded visit time!`, {
            icon: '⚠️',
            duration: 5000
          });
        });
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error('Error checking overstays:', error);
    }
  };

  const handleAddVisitor = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.keys(newVisitor).forEach(key => {
      formData.append(key, newVisitor[key]);
    });

    if (photoFile) formData.append('visitorPhoto', photoFile);
    if (idFile) formData.append('idProofImage', idFile);

    try {
      setLoading(true);
      const response = await visitorAPI.addVisitor(formData);
      toast.success('Visitor entry added successfully!');
      setShowAddModal(false);
      fetchDashboardData();
      
      // Reset form
      setNewVisitor({
        name: '',
        phone: '',
        email: '',
        relationship: 'father',
        studentId: '',
        purpose: '',
        idProofType: 'aadhar',
        idProofNumber: '',
        meetingLocation: 'gate',
        isEmergency: false,
        timeLimit: 30
      });
      setPhotoFile(null);
      setIdFile(null);
      
      // Show QR code if available
      if (response.data.qrCode) {
        window.open(response.data.qrCode, '_blank');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add visitor');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkExit = async (visitorId) => {
    try {
      await visitorAPI.markExit(visitorId);
      toast.success('Exit marked successfully');
      setShowExitModal(false);
      setSelectedVisitor(null);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to mark exit');
    }
  };

  const handleApproveVisitor = async (visitorId) => {
    try {
      await visitorAPI.approve(visitorId, { status: 'approved' });
      toast.success('Visitor approved successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to approve visitor');
    }
  };

  const handlePrintPass = (visitor) => {
    const passWindow = window.open('', '_blank');
    passWindow.document.write(`
      <html>
        <head>
          <title>Visitor Pass - ${visitor.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .pass { max-width: 400px; margin: 0 auto; background: white; border-radius: 12px; padding: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
            .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px; }
            .header h2 { color: #1e293b; margin: 0; font-size: 24px; }
            .header p { color: #64748b; margin: 5px 0 0; }
            .details { margin: 20px 0; }
            .detail-row { display: flex; margin-bottom: 10px; padding: 5px 0; border-bottom: 1px dashed #e2e8f0; }
            .detail-label { width: 100px; font-weight: 600; color: #475569; }
            .detail-value { flex: 1; color: #1e293b; }
            .qr { text-align: center; margin: 25px 0; padding: 15px; background: #f8fafc; border-radius: 8px; }
            .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0; }
            .badge { background: #3b82f6; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="pass">
            <div class="header">
              <h2>ILHAM</h2>
              <p>Visitor Pass</p>
            </div>
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${visitor.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Student:</span>
                <span class="detail-value">${visitor.student?.name || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Room:</span>
                <span class="detail-value">${visitor.student?.roomNumber || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Entry:</span>
                <span class="detail-value">${new Date(visitor.entryTime).toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Valid Until:</span>
                <span class="detail-value">${visitor.expectedExitTime ? new Date(visitor.expectedExitTime).toLocaleString() : 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Purpose:</span>
                <span class="detail-value">${visitor.purpose || 'Visit'}</span>
              </div>
            </div>
            ${visitor.qrCode ? `
            <div class="qr">
              <img src="${visitor.qrCode}" width="150" />
            </div>
            ` : ''}
            <div class="footer">
              <span class="badge">Valid ID Required</span>
              <p style="margin-top: 10px;">This pass is valid only with original ID proof</p>
            </div>
          </div>
        </body>
      </html>
    `);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      pending_office: { color: 'bg-orange-100 text-orange-800', label: 'Pending' },
      pending_warden: { color: 'bg-purple-100 text-purple-800', label: 'Pending' },
      pending_student: { color: 'bg-blue-100 text-blue-800', label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      checked_in: { color: 'bg-indigo-100 text-indigo-800', label: 'Checked In' },
      checked_out: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
      completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
      overstay: { color: 'bg-red-100 text-red-800', label: 'Overstay' }
    };
    const config = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
  };

  return (
    <div className="security-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="security-profile">
            <div className="profile-icon">
              <Shield size={24} />
            </div>
            <div>
              <h3>{user?.name || 'Security'}</h3>
              <p className="role-badge">Security Officer • Gate 1</p>
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
            className={`nav-item ${activeTab === 'visitors' ? 'active' : ''}`}
            onClick={() => { setActiveTab('visitors'); setSidebarOpen(false); }}
          >
            <Users size={20} /> All Visitors
          </button>
          <button 
            className={`nav-item ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => { setActiveTab('active'); setSidebarOpen(false); }}
          >
            <LogIn size={20} /> Active Visits
            {activeVisitors.length > 0 && (
              <span className="badge">{activeVisitors.length}</span>
            )}
          </button>
          <button 
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
          >
            <History size={20} /> Reports
          </button>
          <button 
            className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => { setActiveTab('alerts'); setSidebarOpen(false); }}
          >
            <AlertTriangle size={20} /> Alerts
            {alerts.length > 0 && (
              <span className="badge alert">{alerts.length}</span>
            )}
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
          <h1>Visitor Management</h1>
          <div className="header-actions">
            <button className="action-btn" onClick={fetchDashboardData}>
              <Bell size={20} />
              {alerts.length > 0 && <span className="alert-badge">{alerts.length}</span>}
            </button>
            <div className="security-info">
              <Shield size={20} />
              <span>Gate 1</span>
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
              <h3>Today's Visitors</h3>
              <p className="stat-value">{stats.todayVisitors || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <LogIn size={24} />
            </div>
            <div className="stat-details">
              <h3>Active Visits</h3>
              <p className="stat-value">{stats.activeVisits || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow">
              <Clock size={24} />
            </div>
            <div className="stat-details">
              <h3>Pending</h3>
              <p className="stat-value">{stats.pendingApprovals || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <ExitIcon size={24} />
            </div>
            <div className="stat-details">
              <h3>Completed</h3>
              <p className="stat-value">{stats.completedVisits || 0}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn primary" onClick={() => setShowAddModal(true)}>
            <UserPlus size={20} />
            <span>New Visitor Entry</span>
          </button>
          <button className="quick-action-btn" onClick={() => setActiveTab('active')}>
            <Eye size={20} />
            <span>View Active</span>
          </button>
          <button className="quick-action-btn" onClick={fetchDashboardData}>
            <Download size={20} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Visitors Table - Matches your design */}
        {activeTab === 'visitors' || activeTab === 'dashboard' ? (
          <div className="visitors-section">
            <h2>All Visitors</h2>
            <div className="search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search visitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="table-container">
              <table className="visitors-table">
                <thead>
                  <tr>
                    <th>VISITOR NAME</th>
                    <th>PHONE</th>
                    <th>STUDENT</th>
                    <th>ROOM</th>
                    <th>ENTRY TIME</th>
                    <th>EXIT TIME</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors
                    .filter(v => 
                      v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      v.phone?.includes(searchTerm) ||
                      v.student?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(visitor => (
                      <tr key={visitor._id}>
                        <td>
                          <div className="visitor-name-cell">
                            <div className="visitor-avatar-small">
                              {visitor.name?.charAt(0) || 'V'}
                            </div>
                            {visitor.name}
                          </div>
                        </td>
                        <td>{visitor.phone}</td>
                        <td>{visitor.student?.name || 'N/A'}</td>
                        <td>{visitor.student?.roomNumber || 'N/A'}</td>
                        <td>{visitor.entryTime ? new Date(visitor.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                        <td>{visitor.exitTime ? new Date(visitor.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                        <td>{getStatusBadge(visitor.status)}</td>
                        <td>
                          <div className="action-buttons">
                            {visitor.status === 'pending' && (
                              <button 
                                className="action-btn approve"
                                onClick={() => handleApproveVisitor(visitor._id)}
                                title="Approve"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            {visitor.status === 'approved' || visitor.status === 'checked_in' ? (
                              <button 
                                className="action-btn exit"
                                onClick={() => {
                                  setSelectedVisitor(visitor);
                                  setShowExitModal(true);
                                }}
                                title="Mark Exit"
                              >
                                <ExitIcon size={16} />
                              </button>
                            ) : null}
                            <button 
                              className="action-btn print"
                              onClick={() => handlePrintPass(visitor)}
                              title="Print Pass"
                            >
                              <Printer size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {visitors.length === 0 && (
                <p className="no-data">No visitors found</p>
              )}
            </div>
          </div>
        ) : null}

        {/* Active Tab */}
        {activeTab === 'active' && (
          <div className="active-tab">
            <h2>Active Visitors ({activeVisitors.length})</h2>
            <div className="visitor-grid full">
              {activeVisitors.map(visitor => (
                <div key={visitor._id} className="visitor-card large">
                  <div className="card-header">
                    <div className="visitor-avatar large">
                      {visitor.name?.charAt(0) || 'V'}
                    </div>
                    <div>
                      <h3>{visitor.name}</h3>
                      <p className="visitor-relation">{visitor.relationship}</p>
                    </div>
                    {getStatusBadge(visitor.status)}
                  </div>
                  <div className="card-details-grid">
                    <div className="detail-item">
                      <User size={16} />
                      <div>
                        <label>Student</label>
                        <p>{visitor.student?.name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Phone size={16} />
                      <div>
                        <label>Phone</label>
                        <p>{visitor.phone}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <MapPin size={16} />
                      <div>
                        <label>Location</label>
                        <p className="capitalize">{visitor.meetingLocation || 'Gate'}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Clock size={16} />
                      <div>
                        <label>Entry Time</label>
                        <p>{new Date(visitor.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <AlertCircle size={16} />
                      <div>
                        <label>Exit By</label>
                        <p className={new Date() > new Date(visitor.expectedExitTime) ? 'text-red-600' : ''}>
                          {visitor.expectedExitTime ? new Date(visitor.expectedExitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} />
                      <div>
                        <label>Purpose</label>
                        <p>{visitor.purpose || 'Visit'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-actions full">
                    <button 
                      className="btn-exit large"
                      onClick={() => {
                        setSelectedVisitor(visitor);
                        setShowExitModal(true);
                      }}
                    >
                      <ExitIcon size={18} /> Mark Exit
                    </button>
                    <button 
                      className="btn-print large"
                      onClick={() => handlePrintPass(visitor)}
                    >
                      <Printer size={18} /> Print Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="reports-tab">
            <h2>Visitor Reports</h2>
            <div className="reports-grid">
              <div className="report-card">
                <h3>Today's Summary</h3>
                <div className="report-stats">
                  <div className="report-stat">
                    <span className="stat-label">Total</span>
                    <span className="stat-number">{stats.todayVisitors}</span>
                  </div>
                  <div className="report-stat">
                    <span className="stat-label">Active</span>
                    <span className="stat-number">{stats.activeVisits}</span>
                  </div>
                  <div className="report-stat">
                    <span className="stat-label">Completed</span>
                    <span className="stat-number">{stats.completedVisits}</span>
                  </div>
                </div>
              </div>
              <div className="report-card">
                <h3>Quick Export</h3>
                <button className="export-btn">
                  <Download size={16} /> Download CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="alerts-tab">
            <h2>Security Alerts</h2>
            {alerts.length > 0 ? (
              <div className="alerts-list">
                {alerts.map(alert => (
                  <div key={alert.id} className="alert-card warning">
                    <AlertTriangle size={24} className="alert-icon" />
                    <div className="alert-content">
                      <h3>Overstay Alert</h3>
                      <p>{alert.message}</p>
                      <div className="alert-details">
                        <p>Student: {alert.visitor.student?.name || 'N/A'}</p>
                        <p>Entry: {new Date(alert.visitor.entryTime).toLocaleTimeString()}</p>
                        <p>Expected Exit: {alert.visitor.expectedExitTime ? new Date(alert.visitor.expectedExitTime).toLocaleTimeString() : 'N/A'}</p>
                      </div>
                    </div>
                    <button 
                      className="btn-action"
                      onClick={() => {
                        setSelectedVisitor(alert.visitor);
                        setShowExitModal(true);
                      }}
                    >
                      Mark Exit
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-alerts">No active alerts</p>
            )}
          </div>
        )}
      </div>

      {/* Add Visitor Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>New Visitor Entry</h2>
              <button onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddVisitor}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Visitor Name *</label>
                  <input
                    type="text"
                    value={newVisitor.name}
                    onChange={(e) => setNewVisitor({...newVisitor, name: e.target.value})}
                    required
                    placeholder="Full name"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={newVisitor.phone}
                    onChange={(e) => setNewVisitor({...newVisitor, phone: e.target.value})}
                    required
                    placeholder="10 digit mobile"
                  />
                </div>
                <div className="form-group">
                  <label>Email (Optional)</label>
                  <input
                    type="email"
                    value={newVisitor.email}
                    onChange={(e) => setNewVisitor({...newVisitor, email: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Relationship *</label>
                  <select
                    value={newVisitor.relationship}
                    onChange={(e) => setNewVisitor({...newVisitor, relationship: e.target.value})}
                    required
                  >
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="brother">Brother</option>
                    <option value="sister">Sister</option>
                    <option value="guardian">Guardian</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Select Student *</label>
                  <select
                    value={newVisitor.studentId}
                    onChange={(e) => setNewVisitor({...newVisitor, studentId: e.target.value})}
                    required
                  >
                    <option value="">Select a student...</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} - {student.rollNumber} (Room: {student.roomNumber || 'N/A'})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Purpose of Visit *</label>
                  <textarea
                    value={newVisitor.purpose}
                    onChange={(e) => setNewVisitor({...newVisitor, purpose: e.target.value})}
                    required
                    rows="2"
                    placeholder="Reason for visit"
                  />
                </div>
                <div className="form-group">
                  <label>ID Proof Type *</label>
                  <select
                    value={newVisitor.idProofType}
                    onChange={(e) => setNewVisitor({...newVisitor, idProofType: e.target.value})}
                    required
                  >
                    <option value="aadhar">Aadhar Card</option>
                    <option value="voter_id">Voter ID</option>
                    <option value="driving_license">Driving License</option>
                    <option value="passport">Passport</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>ID Proof Number *</label>
                  <input
                    type="text"
                    value={newVisitor.idProofNumber}
                    onChange={(e) => setNewVisitor({...newVisitor, idProofNumber: e.target.value})}
                    required
                    placeholder="ID number"
                  />
                </div>
                <div className="form-group">
                  <label>Meeting Location</label>
                  <select
                    value={newVisitor.meetingLocation}
                    onChange={(e) => setNewVisitor({...newVisitor, meetingLocation: e.target.value})}
                  >
                    <option value="gate">Main Gate</option>
                    <option value="office">Front Office</option>
                    <option value="visitor_room">Visitor Room</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Time Limit (minutes)</label>
                  <input
                    type="number"
                    value={newVisitor.timeLimit}
                    onChange={(e) => setNewVisitor({...newVisitor, timeLimit: e.target.value})}
                    min="15"
                    max="120"
                  />
                </div>
                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={newVisitor.isEmergency}
                      onChange={(e) => setNewVisitor({...newVisitor, isEmergency: e.target.checked})}
                    />
                    Emergency Visit
                  </label>
                </div>
                <div className="form-group">
                  <label>Visitor Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhotoFile(e.target.files[0])}
                  />
                  <small>Optional but recommended</small>
                </div>
                <div className="form-group">
                  <label>ID Proof Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setIdFile(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Visitor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Exit Modal */}
      {showExitModal && selectedVisitor && (
        <div className="modal">
          <div className="modal-content small">
            <h2>Mark Exit</h2>
            <p>Confirm exit for <strong>{selectedVisitor.name}</strong>?</p>
            <div className="visit-summary">
              <p>Entry: {new Date(selectedVisitor.entryTime).toLocaleTimeString()}</p>
              <p>Student: {selectedVisitor.student?.name || 'N/A'}</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowExitModal(false)}>Cancel</button>
              <button 
                className="btn-exit"
                onClick={() => handleMarkExit(selectedVisitor._id)}
              >
                Confirm Exit
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .security-dashboard {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Sidebar Styles */
        .sidebar {
          width: 260px;
          background: white;
          border-right: 1px solid #e2e8f0;
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
          padding: 24px 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .security-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .profile-icon {
          width: 48px;
          height: 48px;
          background: #3b82f6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .security-profile h3 {
          margin: 0;
          font-size: 16px;
          color: #1e293b;
        }

        .role-badge {
          margin: 4px 0 0;
          font-size: 12px;
          color: #64748b;
        }

        .close-sidebar {
          display: none;
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: #64748b;
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
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          margin-bottom: 4px;
          background: none;
          border: none;
          color: #64748b;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .nav-item:hover {
          background: #f1f5f9;
          color: #1e293b;
        }

        .nav-item.active {
          background: #eef2ff;
          color: #3b82f6;
          font-weight: 500;
        }

        .badge {
          margin-left: auto;
          background: #3b82f6;
          color: white;
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 11px;
        }

        .badge.alert {
          background: #ef4444;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: #fee2e2;
          border: none;
          color: #ef4444;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .logout-btn:hover {
          background: #fecaca;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 260px;
          padding: 24px;
          transition: margin-left 0.3s;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
          }
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #1e293b;
        }

        @media (max-width: 768px) {
          .menu-btn {
            display: block;
          }
        }

        .dashboard-header h1 {
          margin: 0;
          font-size: 24px;
          color: #1e293b;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .action-btn {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
        }

        .alert-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          padding: 2px 5px;
          border-radius: 10px;
        }

        .security-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #f1f5f9;
          border-radius: 20px;
          color: #1e293b;
          font-size: 14px;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.blue { background: #e0f2fe; color: #0284c7; }
        .stat-icon.green { background: #dcfce7; color: #16a34a; }
        .stat-icon.yellow { background: #fef9c3; color: #ca8a04; }
        .stat-icon.purple { background: #f3e8ff; color: #9333ea; }

        .stat-details h3 {
          margin: 0 0 4px;
          font-size: 14px;
          color: #64748b;
        }

        .stat-value {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
        }

        /* Quick Actions */
        .quick-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: #1e293b;
          font-size: 14px;
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

        /* Visitors Section */
        .visitors-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .visitors-section h2 {
          margin: 0 0 20px;
          font-size: 18px;
          color: #1e293b;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .search-bar input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 14px;
        }

        .table-container {
          overflow-x: auto;
        }

        .visitors-table {
          width: 100%;
          border-collapse: collapse;
        }

        .visitors-table th {
          text-align: left;
          padding: 12px 16px;
          background: #f8fafc;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          border-bottom: 1px solid #e2e8f0;
        }

        .visitors-table td {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
        }

        .visitor-name-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .visitor-avatar-small {
          width: 32px;
          height: 32px;
          background: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 6px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.approve {
          background: #dcfce7;
          color: #16a34a;
        }

        .action-btn.approve:hover {
          background: #bbf7d0;
        }

        .action-btn.exit {
          background: #fee2e2;
          color: #ef4444;
        }

        .action-btn.exit:hover {
          background: #fecaca;
        }

        .action-btn.print {
          background: #f1f5f9;
          color: #64748b;
        }

        .action-btn.print:hover {
          background: #e2e8f0;
        }

        .no-data {
          text-align: center;
          padding: 40px;
          color: #94a3b8;
        }

        /* Active Visitors Grid */
        .active-tab {
          margin-top: 20px;
        }

        .active-tab h2 {
          margin: 0 0 20px;
          font-size: 18px;
        }

        .visitor-grid.full {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        .visitor-card.large {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .visitor-avatar.large {
          width: 60px;
          height: 60px;
          background: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 24px;
        }

        .card-header h3 {
          margin: 0;
          font-size: 18px;
        }

        .visitor-relation {
          margin: 4px 0 0;
          font-size: 13px;
          color: #64748b;
        }

        .card-details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin: 20px 0;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .detail-item label {
          display: block;
          font-size: 11px;
          color: #64748b;
          margin-bottom: 2px;
        }

        .detail-item p {
          margin: 0;
          font-size: 13px;
          font-weight: 500;
        }

        .card-actions.full {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .btn-exit.large {
          flex: 1;
          padding: 12px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-print.large {
          flex: 1;
          padding: 12px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .text-red-600 {
          color: #dc2626;
          font-weight: 600;
        }

        .capitalize {
          text-transform: capitalize;
        }

        /* Modal Styles */
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
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content.small {
          max-width: 400px;
        }

        .modal-content.large {
          max-width: 1000px;
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

        .form-grid {
          padding: 20px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .form-group.full-width {
          grid-column: span 2;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-size: 13px;
          font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-group.checkbox label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .form-group small {
          display: block;
          margin-top: 5px;
          color: #94a3b8;
          font-size: 11px;
        }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .modal-footer button {
          padding: 10px 20px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          cursor: pointer;
        }

        .modal-footer .btn-primary {
          background: #3b82f6;
          color: white;
          border: none;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .modal-actions button {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .modal-actions .btn-exit {
          background: #ef4444;
          color: white;
        }

        .visit-summary {
          margin: 20px 0;
          padding: 15px;
          background: #f8fafc;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default SecurityDashboard;