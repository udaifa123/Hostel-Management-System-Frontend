import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  LogOut,
  Bell,
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
  User,
  FileText,
  Camera,
  QrCode,
  ThumbsUp,
  ThumbsDown,
  FileCheck,
  FileX,
  Building2
} from 'lucide-react';
import { visitorAPI, studentAPI } from '../api/axios';
import toast from 'react-hot-toast';

const FrontOfficeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [pendingVisitors, setPendingVisitors] = useState([]);
  const [approvedVisitors, setApprovedVisitors] = useState([]);
  const [rejectedVisitors, setRejectedVisitors] = useState([]);
  const [todayVisitors, setTodayVisitors] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [stats, setStats] = useState({});
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showBlacklistModal, setShowBlacklistModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [blacklistReason, setBlacklistReason] = useState('');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchDashboardData();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending visitors (for front office verification)
      const pendingRes = await visitorAPI.getPendingOffice();
      setPendingVisitors(pendingRes.data.visitors || []);
      
      // Fetch approved visitors
      const approvedRes = await visitorAPI.getAllVisitors({ 
        status: 'approved',
        fromDate: dateRange.from,
        toDate: dateRange.to
      });
      setApprovedVisitors(approvedRes.data.visitors || []);
      
      // Fetch rejected visitors
      const rejectedRes = await visitorAPI.getAllVisitors({ 
        status: 'rejected',
        fromDate: dateRange.from,
        toDate: dateRange.to
      });
      setRejectedVisitors(rejectedRes.data.visitors || []);
      
      // Fetch today's visitors
      const todayRes = await visitorAPI.getToday();
      setTodayVisitors(todayRes.data.visitors || []);
      
      // Fetch blacklist
      const blacklistRes = await visitorAPI.getBlacklist();
      setBlacklist(blacklistRes.data.blacklist || []);
      
      // Fetch students for reference
      const studentsRes = await studentAPI.getAll({ limit: 100 });
      setStudents(studentsRes.data.students || []);
      
      // Calculate stats
      setStats({
        pending: pendingRes.data.visitors?.length || 0,
        approved: approvedRes.data.visitors?.length || 0,
        rejected: rejectedRes.data.visitors?.length || 0,
        today: todayRes.data.visitors?.length || 0,
        blacklisted: blacklistRes.data.blacklist?.length || 0
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVisitor = async (visitorId, action) => {
    try {
      setLoading(true);
      await visitorAPI.officeApprove(visitorId, { 
        action,
        remarks: verificationNotes,
        idVerified: true
      });
      
      toast.success(`Visitor ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      setShowVerifyModal(false);
      setSelectedVisitor(null);
      setVerificationNotes('');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} visitor`);
    } finally {
      setLoading(false);
    }
  };

  const handleBlacklist = async () => {
    if (!selectedVisitor) return;
    
    try {
      setLoading(true);
      await visitorAPI.blacklistVisitor(selectedVisitor._id, {
        reason: blacklistReason,
        isPermanent: true
      });
      
      toast.success('Visitor blacklisted successfully');
      setShowBlacklistModal(false);
      setSelectedVisitor(null);
      setBlacklistReason('');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to blacklist visitor');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBlacklist = async (id) => {
    try {
      await visitorAPI.removeBlacklist(id);
      toast.success('Visitor removed from blacklist');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to remove from blacklist');
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
            .office-stamp { text-align: center; margin-top: 20px; padding: 10px; background: #f1f5f9; border-radius: 8px; font-size: 12px; color: #1e293b; }
          </style>
        </head>
        <body>
          <div class="pass">
            <div class="header">
              <h2>ILHAM</h2>
              <p>Front Office Approved Visitor Pass</p>
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
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${visitor.phone}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ID Proof:</span>
                <span class="detail-value">${visitor.idProofType} - ${visitor.idProofNumber}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Entry Time:</span>
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
            <div class="office-stamp">
              ✓ VERIFIED BY FRONT OFFICE
            </div>
            ${visitor.qrCode ? `
            <div class="qr">
              <img src="${visitor.qrCode}" width="150" />
            </div>
            ` : ''}
            <div class="footer">
              <span class="badge">Valid ID Required</span>
              <p style="margin-top: 10px;">This pass is verified by front office</p>
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
      pending_office: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Verification' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      blacklisted: { color: 'bg-gray-900 text-white', label: 'Blacklisted' }
    };
    const config = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
  };

  return (
    <div className="frontoffice-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="profile">
            <div className="profile-icon">
              <Building2 size={24} />
            </div>
            <div>
              <h3>{user?.name || 'Front Office'}</h3>
              <p className="role-badge">Front Office • Verification Desk</p>
            </div>
          </div>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => { setActiveTab('pending'); setSidebarOpen(false); }}
          >
            <Clock size={20} /> Pending Verification
            {stats.pending > 0 && <span className="badge">{stats.pending}</span>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => { setActiveTab('approved'); setSidebarOpen(false); }}
          >
            <CheckCircle size={20} /> Approved
          </button>
          <button 
            className={`nav-item ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => { setActiveTab('rejected'); setSidebarOpen(false); }}
          >
            <XCircle size={20} /> Rejected
          </button>
          <button 
            className={`nav-item ${activeTab === 'blacklist' ? 'active' : ''}`}
            onClick={() => { setActiveTab('blacklist'); setSidebarOpen(false); }}
          >
            <Ban size={20} /> Blacklist
            {stats.blacklisted > 0 && <span className="badge alert">{stats.blacklisted}</span>}
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
          <h1>Front Office Dashboard</h1>
          <div className="header-actions">
            <button className="refresh-btn" onClick={fetchDashboardData}>
              <Download size={18} /> Refresh
            </button>
            <div className="office-info">
              <Building2 size={20} />
              <span>Verification Desk</span>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon yellow">
              <Clock size={24} />
            </div>
            <div className="stat-details">
              <h3>Pending Verification</h3>
              <p className="stat-value">{stats.pending || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <CheckCircle size={24} />
            </div>
            <div className="stat-details">
              <h3>Approved Today</h3>
              <p className="stat-value">{stats.approved || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">
              <XCircle size={24} />
            </div>
            <div className="stat-details">
              <h3>Rejected Today</h3>
              <p className="stat-value">{stats.rejected || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Users size={24} />
            </div>
            <div className="stat-details">
              <h3>Total Today</h3>
              <p className="stat-value">{stats.today || 0}</p>
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="date-filter">
          <div className="date-range">
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
              className="date-input"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
              className="date-input"
            />
          </div>
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search visitors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Pending Verification Tab */}
        {activeTab === 'pending' && (
          <div className="pending-tab">
            <h2>Visitors Awaiting Verification</h2>
            <div className="visitor-grid">
              {pendingVisitors
                .filter(v => 
                  v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  v.phone?.includes(searchTerm) ||
                  v.student?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(visitor => (
                <div key={visitor._id} className="visitor-card pending">
                  <div className="card-header">
                    <div className="visitor-avatar">
                      {visitor.name?.charAt(0) || 'V'}
                    </div>
                    <div className="visitor-info">
                      <h3>{visitor.name}</h3>
                      <p className="visitor-relation">{visitor.relationship}</p>
                    </div>
                    {getStatusBadge(visitor.status)}
                  </div>
                  
                  <div className="visitor-details">
                    <div className="detail-row">
                      <Phone size={14} />
                      <span>{visitor.phone}</span>
                    </div>
                    <div className="detail-row">
                      <User size={14} />
                      <span>Student: {visitor.student?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <MapPin size={14} />
                      <span>Room: {visitor.student?.roomNumber || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <FileText size={14} />
                      <span>{visitor.idProofType}: {visitor.idProofNumber}</span>
                    </div>
                    <div className="detail-row">
                      <Clock size={14} />
                      <span>Arrived: {new Date(visitor.entryTime).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="action-buttons">
                    <button 
                      className="btn-verify"
                      onClick={() => {
                        setSelectedVisitor(visitor);
                        setShowVerifyModal(true);
                      }}
                    >
                      <Eye size={16} /> Verify ID
                    </button>
                    <button 
                      className="btn-blacklist"
                      onClick={() => {
                        setSelectedVisitor(visitor);
                        setShowBlacklistModal(true);
                      }}
                    >
                      <Ban size={16} /> Blacklist
                    </button>
                  </div>
                </div>
              ))}
              {pendingVisitors.length === 0 && (
                <p className="no-data">No pending verifications</p>
              )}
            </div>
          </div>
        )}

        {/* Approved Tab */}
        {activeTab === 'approved' && (
          <div className="approved-tab">
            <h2>Approved Visitors</h2>
            <div className="table-container">
              <table className="visitors-table">
                <thead>
                  <tr>
                    <th>Visitor</th>
                    <th>Student</th>
                    <th>ID Proof</th>
                    <th>Entry Time</th>
                    <th>Verified By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedVisitors
                    .filter(v => 
                      v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      v.student?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(visitor => (
                    <tr key={visitor._id}>
                      <td>
                        <div className="visitor-cell">
                          <div className="avatar-small">{visitor.name?.charAt(0)}</div>
                          <div>
                            <div>{visitor.name}</div>
                            <div className="text-small">{visitor.relationship}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{visitor.student?.name}</div>
                          <div className="text-small">Room {visitor.student?.roomNumber}</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{visitor.idProofType}</div>
                          <div className="text-small">{visitor.idProofNumber}</div>
                        </div>
                      </td>
                      <td>{new Date(visitor.entryTime).toLocaleString()}</td>
                      <td>{visitor.frontOffice?.approvedBy?.name || 'Front Office'}</td>
                      <td>
                        <button 
                          className="btn-icon print"
                          onClick={() => handlePrintPass(visitor)}
                          title="Print Pass"
                        >
                          <Printer size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rejected Tab */}
        {activeTab === 'rejected' && (
          <div className="rejected-tab">
            <h2>Rejected Visitors</h2>
            <div className="table-container">
              <table className="visitors-table">
                <thead>
                  <tr>
                    <th>Visitor</th>
                    <th>Student</th>
                    <th>Reason</th>
                    <th>Rejected At</th>
                    <th>Rejected By</th>
                  </tr>
                </thead>
                <tbody>
                  {rejectedVisitors
                    .filter(v => 
                      v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      v.student?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(visitor => (
                    <tr key={visitor._id}>
                      <td>
                        <div>
                          <div>{visitor.name}</div>
                          <div className="text-small">{visitor.phone}</div>
                        </div>
                      </td>
                      <td>{visitor.student?.name}</td>
                      <td>{visitor.frontOffice?.remarks || 'No reason provided'}</td>
                      <td>{visitor.frontOffice?.approvedAt ? new Date(visitor.frontOffice.approvedAt).toLocaleString() : '-'}</td>
                      <td>{visitor.frontOffice?.approvedBy?.name || 'Front Office'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Blacklist Tab */}
        {activeTab === 'blacklist' && (
          <div className="blacklist-tab">
            <h2>Blacklisted Visitors</h2>
            <div className="blacklist-grid">
              {blacklist.map(item => (
                <div key={item._id} className="blacklist-card">
                  <div className="blacklist-header">
                    <Ban size={20} className="blacklist-icon" />
                    <h3>{item.name}</h3>
                  </div>
                  <div className="blacklist-details">
                    <p><Phone size={14} /> {item.phone}</p>
                    <p><FileText size={14} /> {item.idProofType}: {item.idProofNumber}</p>
                    <p className="reason"><AlertCircle size={14} /> Reason: {item.reason}</p>
                    <p className="date">Blocked: {new Date(item.blockedAt).toLocaleDateString()}</p>
                  </div>
                  <button 
                    className="btn-remove"
                    onClick={() => handleRemoveBlacklist(item._id)}
                  >
                    Remove from Blacklist
                  </button>
                </div>
              ))}
              {blacklist.length === 0 && (
                <p className="no-data">No blacklisted visitors</p>
              )}
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
                    <span className="stat-number">{stats.today}</span>
                  </div>
                  <div className="report-stat">
                    <span className="stat-label">Approved</span>
                    <span className="stat-number">{stats.approved}</span>
                  </div>
                  <div className="report-stat">
                    <span className="stat-label">Rejected</span>
                    <span className="stat-number">{stats.rejected}</span>
                  </div>
                </div>
              </div>
              
              <div className="report-card">
                <h3>Quick Actions</h3>
                <button className="export-btn">
                  <Download size={16} /> Export Today's Report
                </button>
                <button className="export-btn">
                  <Printer size={16} /> Print Summary
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verify Modal */}
      {showVerifyModal && selectedVisitor && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Verify Visitor ID</h2>
              <button onClick={() => setShowVerifyModal(false)}>×</button>
            </div>
            
            <div className="visitor-id-card">
              <div className="id-header">
                <h3>Visitor Details</h3>
              </div>
              <div className="id-details">
                <p><strong>Name:</strong> {selectedVisitor.name}</p>
                <p><strong>Phone:</strong> {selectedVisitor.phone}</p>
                <p><strong>Relationship:</strong> {selectedVisitor.relationship}</p>
                <p><strong>Student:</strong> {selectedVisitor.student?.name}</p>
                <p><strong>Room:</strong> {selectedVisitor.student?.roomNumber}</p>
                <p><strong>ID Proof:</strong> {selectedVisitor.idProofType} - {selectedVisitor.idProofNumber}</p>
                <p><strong>Purpose:</strong> {selectedVisitor.purpose}</p>
                <p><strong>Entry Time:</strong> {new Date(selectedVisitor.entryTime).toLocaleString()}</p>
              </div>

              {selectedVisitor.idProofImage && (
                <div className="id-image">
                  <img src={selectedVisitor.idProofImage} alt="ID Proof" />
                </div>
              )}

              <div className="verification-notes">
                <label>Verification Notes:</label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Add any verification notes..."
                  rows="3"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-reject"
                onClick={() => handleVerifyVisitor(selectedVisitor._id, 'reject')}
              >
                <XCircle size={16} /> Reject
              </button>
              <button 
                className="btn-approve"
                onClick={() => handleVerifyVisitor(selectedVisitor._id, 'approve')}
              >
                <CheckCircle size={16} /> Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blacklist Modal */}
      {showBlacklistModal && selectedVisitor && (
        <div className="modal">
          <div className="modal-content small">
            <h2>Blacklist Visitor</h2>
            <p>Are you sure you want to blacklist <strong>{selectedVisitor.name}</strong>?</p>
            
            <div className="form-group">
              <label>Reason for blacklisting:</label>
              <textarea
                value={blacklistReason}
                onChange={(e) => setBlacklistReason(e.target.value)}
                placeholder="Enter reason..."
                rows="3"
                required
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowBlacklistModal(false)}>Cancel</button>
              <button 
                className="btn-blacklist"
                onClick={handleBlacklist}
                disabled={!blacklistReason.trim()}
              >
                <Ban size={16} /> Blacklist
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .frontoffice-dashboard {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
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

        .profile {
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

        .profile h3 {
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
          margin-left: 280px;
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

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          color: #1e293b;
          font-size: 14px;
        }

        .office-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #eef2ff;
          border-radius: 20px;
          color: #3b82f6;
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

        .stat-icon.yellow { background: #fef9c3; color: #ca8a04; }
        .stat-icon.green { background: #dcfce7; color: #16a34a; }
        .stat-icon.red { background: #fee2e2; color: #dc2626; }
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

        /* Date Filter */
        .date-filter {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          background: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .date-range {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .date-input {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          width: 300px;
        }

        .search-box input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 14px;
        }

        /* Visitor Cards */
        .visitor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .visitor-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-left: 4px solid;
        }

        .visitor-card.pending {
          border-left-color: #eab308;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .visitor-avatar {
          width: 50px;
          height: 50px;
          background: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 20px;
        }

        .visitor-info {
          flex: 1;
        }

        .visitor-info h3 {
          margin: 0 0 4px;
          font-size: 16px;
        }

        .visitor-relation {
          margin: 0;
          font-size: 13px;
          color: #64748b;
        }

        .visitor-details {
          margin: 16px 0;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          font-size: 13px;
          color: #1e293b;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .btn-verify {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
        }

        .btn-blacklist {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
        }

        /* Table */
        .table-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow-x: auto;
        }

        .visitors-table {
          width: 100%;
          border-collapse: collapse;
        }

        .visitors-table th {
          text-align: left;
          padding: 12px;
          background: #f8fafc;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
        }

        .visitors-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
        }

        .visitor-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar-small {
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

        .text-small {
          font-size: 12px;
          color: #64748b;
        }

        .btn-icon {
          padding: 6px;
          background: none;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          color: #64748b;
        }

        .btn-icon.print:hover {
          background: #f1f5f9;
          color: #3b82f6;
        }

        /* Blacklist */
        .blacklist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .blacklist-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-left: 4px solid #ef4444;
        }

        .blacklist-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .blacklist-icon {
          color: #ef4444;
        }

        .blacklist-header h3 {
          margin: 0;
          font-size: 16px;
        }

        .blacklist-details p {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 8px 0;
          font-size: 13px;
          color: #1e293b;
        }

        .blacklist-details .reason {
          color: #ef4444;
          background: #fee2e2;
          padding: 8px;
          border-radius: 6px;
        }

        .blacklist-details .date {
          color: #64748b;
          font-size: 12px;
        }

        .btn-remove {
          width: 100%;
          padding: 10px;
          margin-top: 15px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          color: #1e293b;
          font-size: 13px;
        }

        .btn-remove:hover {
          background: #e2e8f0;
        }

        /* Reports */
        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .report-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .report-card h3 {
          margin: 0 0 15px;
          font-size: 16px;
        }

        .report-stats {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
        }

        .report-stat {
          text-align: center;
        }

        .report-stat .stat-label {
          display: block;
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .report-stat .stat-number {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
        }

        .export-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          margin-bottom: 10px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          color: #1e293b;
          font-size: 14px;
        }

        .export-btn:hover {
          background: #e2e8f0;
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
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content.small {
          max-width: 400px;
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

        .visitor-id-card {
          padding: 20px;
        }

        .id-header h3 {
          margin: 0 0 15px;
          color: #1e293b;
        }

        .id-details p {
          margin: 10px 0;
          padding: 8px;
          background: #f8fafc;
          border-radius: 6px;
        }

        .id-image {
          margin: 20px 0;
          text-align: center;
        }

        .id-image img {
          max-width: 100%;
          max-height: 200px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .verification-notes {
          margin: 20px 0;
        }

        .verification-notes label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .verification-notes textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          padding: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .modal-actions button {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-approve {
          background: #3b82f6;
          color: white;
        }

        .btn-reject {
          background: #ef4444;
          color: white;
        }

        .btn-blacklist {
          background: #1e293b;
          color: white;
        }

        .no-data {
          text-align: center;
          padding: 40px;
          color: #94a3b8;
          grid-column: 1 / -1;
        }
      `}</style>
    </div>
  );
};

export default FrontOfficeDashboard;