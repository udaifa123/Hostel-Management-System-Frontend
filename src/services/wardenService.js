// src/services/wardenService.js
import api from './api';

const wardenService = {
  // Dashboard
  getDashboardStats: async () => {
    try {
      const response = await api.get('/warden/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  getRecentActivities: async (limit = 10) => {
    try {
      const response = await api.get(`/warden/activities?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  getPendingItems: async () => {
    try {
      const response = await api.get('/warden/pending-items');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending items:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/warden/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/warden/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  uploadProfileImage: async (formData) => {
    try {
      const response = await api.post('/warden/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/warden/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  getSettings: async () => {
    try {
      const response = await api.get('/warden/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  updateSettings: async (data) => {
    try {
      const response = await api.put('/warden/settings', data);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  getStudents: async (params) => {
    try {
      const response = await api.get('/warden/students', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  createStudent: async (studentData) => {
    try {
      const response = await api.post('/warden/students', studentData);
      return response.data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },

  getStudentById: async (id) => {
    try {
      const response = await api.get(`/warden/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  },

  assignRoom: async (studentId, roomNo) => {
    try {
      const response = await api.post('/warden/students/assign-room', { studentId, roomNo });
      return response.data;
    } catch (error) {
      console.error('Error assigning room:', error);
      throw error;
    }
  },

  removeStudent: async (studentId) => {
    try {
      const response = await api.delete(`/warden/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing student:', error);
      throw error;
    }
  },

  getTodayAttendance: async () => {
    try {
      const response = await api.get('/warden/attendance/today');
      return response.data;
    } catch (error) {
      console.error('Error fetching today attendance:', error);
      throw error;
    }
  },

  getAttendanceByDate: async (date) => {
    try {
      const response = await api.get(`/warden/attendance?date=${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance by date:', error);
      throw error;
    }
  },

  markAttendance: async (data) => {
    try {
      const response = await api.post('/warden/attendance', data);
      return response.data;
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  },

  bulkMarkAttendance: async (data) => {
    try {
      const response = await api.post('/warden/attendance/bulk-mark', data);
      return response.data;
    } catch (error) {
      console.error('Error bulk marking attendance:', error);
      throw error;
    }
  },

  getLeaveRequests: async () => {
    try {
      const response = await api.get('/warden/leaves/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      throw error;
    }
  },

  approveLeave: async (id, remarks) => {
    try {
      const response = await api.put(`/warden/leaves/${id}/approve`, { remarks });
      return response.data;
    } catch (error) {
      console.error('Error approving leave:', error);
      throw error;
    }
  },

  rejectLeave: async (id, remarks) => {
    try {
      const response = await api.put(`/warden/leaves/${id}/reject`, { remarks });
      return response.data;
    } catch (error) {
      console.error('Error rejecting leave:', error);
      throw error;
    }
  },

  getComplaints: async () => {
    try {
      console.log('Fetching complaints for warden...');
      const response = await api.get('/warden/complaints');
      console.log('Complaints response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  },

  updateComplaintStatus: async (id, status, reply) => {
    try {
      const response = await api.put(`/warden/complaints/${id}`, { status, response: reply });
      return response.data;
    } catch (error) {
      console.error('Error updating complaint:', error);
      throw error;
    }
  },

  getVisitRequests: async () => {
    try {
      console.log('Fetching visit requests for warden...');
      const response = await api.get('/warden/visitors/pending');
      console.log('Visit requests response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching visit requests:', error);
      throw error;
    }
  },

  getActiveVisits: async () => {
    try {
      const response = await api.get('/warden/visitors/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active visits:', error);
      throw error;
    }
  },

  approveVisit: async (id, data) => {
    try {
      const response = await api.put(`/warden/visitors/${id}/approve`, data);
      return response.data;
    } catch (error) {
      console.error('Error approving visit:', error);
      throw error;
    }
  },

  rejectVisit: async (id, remarks) => {
    try {
      const response = await api.put(`/warden/visitors/${id}/reject`, { remarks });
      return response.data;
    } catch (error) {
      console.error('Error rejecting visit:', error);
      throw error;
    }
  },

  markVisitCheckedIn: async (id) => {
    try {
      const response = await api.put(`/warden/visitors/${id}/checkin`);
      return response.data;
    } catch (error) {
      console.error('Error marking visit checked in:', error);
      throw error;
    }
  },

  markVisitCheckedOut: async (id) => {
    try {
      const response = await api.put(`/warden/visitors/${id}/checkout`);
      return response.data;
    } catch (error) {
      console.error('Error marking visit checked out:', error);
      throw error;
    }
  },

  getRooms: async () => {
    try {
      const response = await api.get('/warden/rooms');
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  getRoomById: async (id) => {
    try {
      const response = await api.get(`/warden/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  },

  addRoom: async (roomData) => {
    try {
      const response = await api.post('/warden/rooms', roomData);
      return response.data;
    } catch (error) {
      console.error('Error adding room:', error);
      throw error;
    }
  },

  updateRoom: async (id, roomData) => {
    try {
      const response = await api.put(`/warden/rooms/${id}`, roomData);
      return response.data;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  },

  deleteRoom: async (id) => {
    try {
      const response = await api.delete(`/warden/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  },

  updateRoomOccupants: async (id, occupants) => {
    try {
      const response = await api.put(`/warden/rooms/${id}/occupants`, { occupants });
      return response.data;
    } catch (error) {
      console.error('Error updating room occupants:', error);
      throw error;
    }
  },

  removeOccupant: async (roomId, studentId) => {
    try {
      const response = await api.delete(`/warden/rooms/${roomId}/occupants/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing occupant:', error);
      throw error;
    }
  },

  getNotices: async () => {
    try {
      const response = await api.get('/warden/notices');
      return response.data;
    } catch (error) {
      console.error('Error fetching notices:', error);
      throw error;
    }
  },

  createNotice: async (noticeData) => {
    try {
      const response = await api.post('/warden/notices', noticeData);
      return response.data;
    } catch (error) {
      console.error('Error creating notice:', error);
      throw error;
    }
  },

  updateNotice: async (id, noticeData) => {
    try {
      const response = await api.put(`/warden/notices/${id}`, noticeData);
      return response.data;
    } catch (error) {
      console.error('Error updating notice:', error);
      throw error;
    }
  },

  deleteNotice: async (id) => {
    try {
      const response = await api.delete(`/warden/notices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notice:', error);
      throw error;
    }
  },

  pinNotice: async (id, pinned) => {
    try {
      const response = await api.patch(`/warden/notices/${id}/pin`, { pinned });
      return response.data;
    } catch (error) {
      console.error('Error pinning notice:', error);
      throw error;
    }
  },

  getNoticeById: async (id) => {
    try {
      const response = await api.get(`/warden/notices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notice:', error);
      throw error;
    }
  },

  getVisitors: async () => {
    try {
      const response = await api.get('/warden/visitors');
      return response.data;
    } catch (error) {
      console.error('Error fetching visitors:', error);
      throw error;
    }
  },

  registerVisitor: async (visitorData) => {
    try {
      const response = await api.post('/warden/visitors', visitorData);
      return response.data;
    } catch (error) {
      console.error('Error registering visitor:', error);
      throw error;
    }
  },

  checkoutVisitor: async (id) => {
    try {
      const response = await api.put(`/warden/visitors/${id}/checkout`);
      return response.data;
    } catch (error) {
      console.error('Error checking out visitor:', error);
      throw error;
    }
  },

  getMessMenu: async () => {
    try {
      const response = await api.get('/warden/mess-menu');
      return response.data;
    } catch (error) {
      console.error('Error fetching mess menu:', error);
      throw error;
    }
  },

  updateMessMenu: async (day, menuData) => {
    try {
      const response = await api.put(`/warden/mess-menu/${day}`, menuData);
      return response.data;
    } catch (error) {
      console.error('Error updating mess menu:', error);
      throw error;
    }
  },

  getStudentMessages: async () => {
    try {
      const response = await api.get('/warden/messages/students');
      return response.data;
    } catch (error) {
      console.error('Error fetching student messages:', error);
      throw error;
    }
  },

  sendMessageToStudent: async (studentId, content, attachments = []) => {
    try {
      const response = await api.post('/warden/messages/send', { studentId, content, attachments });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

 
getHostelFees: async () => {
  try {
    const response = await api.get('/fees/warden/hostel-fees');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

manualPayment: async (data) => {
  try {
    const response = await api.post('/fees/warden/manual-payment', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

addFine: async (data) => {
  try {
    const response = await api.post('/fees/warden/add-fine', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

sendFeeReminder: async (feeId) => {
  try {
    const response = await api.post(`/fees/warden/send-reminder/${feeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

  generateReport: async (type, format) => {
    try {
      const response = await api.get(`/warden/reports/${type}`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
};



export default wardenService;