import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Camera,
  QrCode,
  Download,
  Filter,
  Search,
  UserPlus,
  LogOut,
  RefreshCw,
  Bell,
  Shield,
  FileText,
  Calendar,
  MapPin,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash2,
  Mail,
  MessageSquare,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import { visitorAPI, studentAPI } from '../api/axios';
import toast from 'react-hot-toast';

// Simple date formatting function without date-fns
const formatDate = (dateString, format = 'datetime') => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  if (format === 'date') {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } else if (format === 'time') {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } else {
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
};

const Visitors = () => {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [students, setStudents] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });

  // Form state for new visitor
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
    timeLimit: 60
  });

  useEffect(() => {
    fetchVisitors();
    fetchStudents();
  }, [filter, dateRange]);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const params = {
        status: filter !== 'all' ? filter : undefined,
        fromDate: dateRange.from,
        toDate: dateRange.to
      };
      const response = await visitorAPI.getAllVisitors(params);
      setVisitors(response.data.visitors || []);
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Error fetching visitors:', error);
      toast.error('Failed to fetch visitors');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll({ limit: 100 });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAddVisitor = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.keys(newVisitor).forEach(key => {
      formData.append(key, newVisitor[key]);
    });

    // Add photos if selected
    if (photoFile) formData.append('visitorPhoto', photoFile);
    if (idFile) formData.append('idProofImage', idFile);

    try {
      const response = await visitorAPI.addVisitor(formData);
      toast.success('Visitor entry added successfully');
      setShowAddModal(false);
      fetchVisitors();
      
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
        timeLimit: 60
      });
      setPhotoFile(null);
      setIdFile(null);
      
      // Show QR code if available
      if (response.data.qrCode) {
        showQRCode(response.data.qrCode);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add visitor');
    }
  };

  const handleApprove = async (id, role) => {
    try {
      const endpoint = role === 'office' ? visitorAPI.officeApprove : visitorAPI.wardenApprove;
      await endpoint(id, { action: 'approve' });
      toast.success('Visitor approved');
      fetchVisitors();
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id, role) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      const endpoint = role === 'office' ? visitorAPI.officeApprove : visitorAPI.wardenApprove;
      await endpoint(id, { action: 'reject', remarks: reason });
      toast.success('Visitor rejected');
      fetchVisitors();
    } catch (error) {
      toast.error('Failed to reject');
    }
  };

  const handleMarkExit = async (id) => {
    if (!confirm('Mark this visitor as exited?')) return;
    
    try {
      await visitorAPI.markExit(id);
      toast.success('Exit marked successfully');
      fetchVisitors();
    } catch (error) {
      toast.error('Failed to mark exit');
    }
  };

  const handleBlacklist = async (id) => {
    const reason = prompt('Enter blacklist reason:');
    if (!reason) return;
    
    try {
      await visitorAPI.blacklistVisitor(id, { reason });
      toast.success('Visitor blacklisted');
      fetchVisitors();
    } catch (error) {
      toast.error('Failed to blacklist');
    }
  };

  const showQRCode = (qrCode) => {
    const win = window.open();
    win.document.write(`<img src="${qrCode}" style="width:100%;max-width:300px;"/>`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_security: { color: 'bg-yellow-100 text-yellow-800', label: 'Security Pending' },
      pending_office: { color: 'bg-orange-100 text-orange-800', label: 'Office Pending' },
      pending_warden: { color: 'bg-purple-100 text-purple-800', label: 'Warden Pending' },
      pending_student: { color: 'bg-blue-100 text-blue-800', label: 'Student Pending' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      checked_in: { color: 'bg-indigo-100 text-indigo-800', label: 'Checked In' },
      checked_out: { color: 'bg-gray-100 text-gray-800', label: 'Checked Out' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      overstay: { color: 'bg-red-200 text-red-900', label: 'Overstay' },
      blacklisted: { color: 'bg-black text-white', label: 'Blacklisted' }
    };
    const config = statusConfig[status] || statusConfig.pending_office;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getRoleBasedActions = (visitor) => {
    const role = user?.role;
    
    switch(role) {
      case 'security':
        if (visitor.status === 'checked_in') {
          return (
            <button
              onClick={() => handleMarkExit(visitor._id)}
              className="action-btn exit"
            >
              <LogOut size={16} /> Mark Exit
            </button>
          );
        }
        break;
        
      case 'admin':
        if (visitor.status !== 'blacklisted' && visitor.status !== 'checked_out') {
          return (
            <button
              onClick={() => handleBlacklist(visitor._id)}
              className="action-btn blacklist"
            >
              <Shield size={16} /> Blacklist
            </button>
          );
        }
        break;
        
      case 'warden':
        if (visitor.status === 'pending_warden') {
          return (
            <div className="action-group">
              <button
                onClick={() => handleApprove(visitor._id, 'warden')}
                className="action-btn approve"
              >
                <CheckCircle size={16} /> Approve
              </button>
              <button
                onClick={() => handleReject(visitor._id, 'warden')}
                className="action-btn reject"
              >
                <XCircle size={16} /> Reject
              </button>
            </div>
          );
        }
        break;
        
      default:
        return null;
    }
  };

  const filteredVisitors = visitors.filter(v => 
    v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.phone?.includes(searchTerm) ||
    v.student?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="visitor-management">
      {/* Header */}
      <div className="page-header">
        <h1>Visitor Management</h1>
        <div className="header-actions">
          <button
            className="btn-refresh"
            onClick={fetchVisitors}
          >
            <RefreshCw size={18} />
          </button>
          {(user?.role === 'security' || user?.role === 'admin') && (
            <button
              className="btn-add"
              onClick={() => setShowAddModal(true)}
            >
              <UserPlus size={18} />
              Add Visitor
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Today's Visitors</h3>
            <p className="stat-value">{stats.today || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-value">{stats.pending || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Checked In</h3>
            <p className="stat-value">{stats.checkedIn || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Overstay</h3>
            <p className="stat-value">{stats.overstay || 0}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search visitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button
            className={`filter-btn ${filter === 'checked_in' ? 'active' : ''}`}
            onClick={() => setFilter('checked_in')}
          >
            Checked In
          </button>
          <button
            className={`filter-btn ${filter === 'checked_out' ? 'active' : ''}`}
            onClick={() => setFilter('checked_out')}
          >
            Checked Out
          </button>
        </div>

        <div className="date-filters">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
          />
        </div>

        <div className="export-buttons">
          <button className="btn-export">
            <FileSpreadsheet size={16} /> CSV
          </button>
          <button className="btn-export">
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* Visitors Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <table className="visitors-table">
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Student</th>
                <th>Entry Time</th>
                <th>Status</th>
                <th>Location</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.length > 0 ? (
                filteredVisitors.map(visitor => (
                  <tr key={visitor._id}>
                    <td>
                      <div className="visitor-info">
                        <div className="visitor-avatar">
                          {visitor.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="visitor-name">{visitor.name}</div>
                          <div className="visitor-phone">{visitor.phone}</div>
                          <div className="visitor-relation">{visitor.relationship}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="student-info">
                        <div>{visitor.student?.name}</div>
                        <div className="student-room">Room: {visitor.student?.roomNumber || 'N/A'}</div>
                      </div>
                    </td>
                    <td>
                      <div className="time-info">
                        <div>{visitor.entryTime ? formatDate(visitor.entryTime, 'date') : '-'}</div>
                        <div className="time">{visitor.entryTime ? formatDate(visitor.entryTime, 'time') : '-'}</div>
                      </div>
                    </td>
                    <td>{getStatusBadge(visitor.status)}</td>
                    <td>
                      <div className="location-info">
                        <MapPin size={14} />
                        <span className="capitalize">{visitor.meetingLocation || 'gate'}</span>
                      </div>
                    </td>
                    <td>
                      {visitor.duration ? (
                        <span>{visitor.duration} min</span>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          onClick={() => {
                            setSelectedVisitor(visitor);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                        {getRoleBasedActions(visitor)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No visitors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Visitor Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Visitor</h2>
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
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={newVisitor.phone}
                    onChange={(e) => setNewVisitor({...newVisitor, phone: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newVisitor.email}
                    onChange={(e) => setNewVisitor({...newVisitor, email: e.target.value})}
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
                    <option value="">Select a student</option>
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
                    rows="3"
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
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>ID Proof Number *</label>
                  <input
                    type="text"
                    value={newVisitor.idProofNumber}
                    onChange={(e) => setNewVisitor({...newVisitor, idProofNumber: e.target.value})}
                    required
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
                    <option value="dormitory">Dormitory</option>
                    <option value="canteen">Canteen</option>
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
                    max="480"
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
                <button type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Visitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visitor Details Modal */}
      {showDetailsModal && selectedVisitor && (
        <div className="modal">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>Visitor Details</h2>
              <button onClick={() => setShowDetailsModal(false)}>×</button>
            </div>
            
            <div className="visitor-details">
              <div className="details-section">
                <h3>Basic Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Name</label>
                    <p>{selectedVisitor.name}</p>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <p>{selectedVisitor.phone}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <p>{selectedVisitor.email || 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Relationship</label>
                    <p className="capitalize">{selectedVisitor.relationship}</p>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Student Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Name</label>
                    <p>{selectedVisitor.student?.name}</p>
                  </div>
                  <div className="detail-item">
                    <label>Roll Number</label>
                    <p>{selectedVisitor.student?.rollNumber}</p>
                  </div>
                  <div className="detail-item">
                    <label>Room</label>
                    <p>{selectedVisitor.student?.roomNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Visit Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Purpose</label>
                    <p>{selectedVisitor.purpose}</p>
                  </div>
                  <div className="detail-item">
                    <label>Location</label>
                    <p className="capitalize">{selectedVisitor.meetingLocation || 'gate'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Entry Time</label>
                    <p>{selectedVisitor.entryTime ? formatDate(selectedVisitor.entryTime) : '-'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Exit Time</label>
                    <p>{selectedVisitor.exitTime ? formatDate(selectedVisitor.exitTime) : 'Not exited'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Duration</label>
                    <p>{selectedVisitor.duration ? `${selectedVisitor.duration} minutes` : 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <p>{getStatusBadge(selectedVisitor.status)}</p>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>ID Proof</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Type</label>
                    <p className="capitalize">{selectedVisitor.idProofType}</p>
                  </div>
                  <div className="detail-item">
                    <label>Number</label>
                    <p>{selectedVisitor.idProofNumber}</p>
                  </div>
                </div>
              </div>

              {selectedVisitor.qrCode && (
                <div className="qr-section">
                  <h3>QR Code</h3>
                  <img src={selectedVisitor.qrCode} alt="Visitor QR Code" />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
              {selectedVisitor.status === 'checked_in' && (user?.role === 'security' || user?.role === 'admin') && (
                <button 
                  className="btn-primary"
                  onClick={() => {
                    handleMarkExit(selectedVisitor._id);
                    setShowDetailsModal(false);
                  }}
                >
                  <LogOut size={16} /> Mark Exit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .visitor-management {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .page-header h1 {
          margin: 0;
          font-size: 28px;
          color: #1e293b;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .btn-refresh, .btn-add {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .btn-refresh {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
        }

        .btn-refresh:hover {
          background: #f1f5f9;
        }

        .btn-add {
          background: #3b82f6;
          color: white;
        }

        .btn-add:hover {
          background: #2563eb;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
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
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.blue { background: #e3f2fd; color: #1976d2; }
        .stat-icon.yellow { background: #fff3e0; color: #f57c00; }
        .stat-icon.green { background: #e8f5e8; color: #388e3c; }
        .stat-icon.red { background: #ffebee; color: #d32f2f; }

        .stat-content h3 {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: #64748b;
        }

        .stat-value {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .filters-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          align-items: center;
        }

        .search-box {
          flex: 1;
          min-width: 250px;
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 12px;
        }

        .search-box svg {
          color: #94a3b8;
          margin-right: 8px;
        }

        .search-box input {
          border: none;
          background: none;
          outline: none;
          width: 100%;
          font-size: 14px;
        }

        .filter-tabs {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 6px 12px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 20px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .filter-btn:hover {
          background: #f8fafc;
        }

        .filter-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .date-filters {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .date-filters input {
          padding: 6px 10px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 13px;
        }

        .export-buttons {
          display: flex;
          gap: 8px;
          margin-left: auto;
        }

        .btn-export {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
        }

        .btn-export:hover {
          background: #f1f5f9;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          overflow-x: auto;
        }

        .visitors-table {
          width: 100%;
          border-collapse: collapse;
        }

        .visitors-table th {
          text-align: left;
          padding: 15px;
          background: #f8fafc;
          font-weight: 600;
          font-size: 13px;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
        }

        .visitors-table td {
          padding: 15px;
          border-bottom: 1px solid #e2e8f0;
        }

        .visitor-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .visitor-avatar {
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

        .visitor-name {
          font-weight: 500;
          color: #1e293b;
        }

        .visitor-phone, .visitor-relation {
          font-size: 12px;
          color: #64748b;
        }

        .student-info {
          font-size: 14px;
        }

        .student-room {
          font-size: 12px;
          color: #64748b;
        }

        .time-info {
          font-size: 13px;
        }

        .time {
          font-size: 12px;
          color: #64748b;
        }

        .location-info {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #64748b;
          font-size: 13px;
        }

        .capitalize {
          text-transform: capitalize;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-group {
          display: flex;
          gap: 4px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .action-btn.view {
          background: #e3f2fd;
          color: #1976d2;
        }

        .action-btn.view:hover {
          background: #bbdefb;
        }

        .action-btn.approve {
          background: #d1fae5;
          color: #10b981;
        }

        .action-btn.approve:hover {
          background: #a7f3d0;
        }

        .action-btn.reject {
          background: #fee2e2;
          color: #ef4444;
        }

        .action-btn.reject:hover {
          background: #fecaca;
        }

        .action-btn.exit {
          background: #e0f2fe;
          color: #0284c7;
        }

        .action-btn.blacklist {
          background: #1e293b;
          color: white;
        }

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
          border-radius: 16px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
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
          position: sticky;
          top: 0;
          background: white;
          border-radius: 16px 16px 0 0;
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
          color: #1e293b;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-group.checkbox {
          display: flex;
          align-items: center;
        }

        .form-group.checkbox label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
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
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .modal-footer .btn-primary {
          background: #3b82f6;
          color: white;
          border: none;
        }

        .visitor-details {
          padding: 20px;
        }

        .details-section {
          margin-bottom: 25px;
        }

        .details-section h3 {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: #1e293b;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 8px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .detail-item label {
          display: block;
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .detail-item p {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
          color: #1e293b;
        }

        .qr-section {
          text-align: center;
          margin-top: 20px;
        }

        .qr-section img {
          max-width: 200px;
          border: 1px solid #e2e8f0;
          padding: 10px;
          border-radius: 8px;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .no-data {
          text-align: center;
          padding: 40px;
          color: #64748b;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default Visitors;