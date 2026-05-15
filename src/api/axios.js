import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Student API
export const studentAPI = {
  getDashboard: () => api.get('/student/dashboard'),
  getWardenChat: () => api.get('/student/chat/warden'),
  sendMessage: (data) => api.post('/student/chat/send', data),
  requestVisit: (data) => api.post('/student/visits', data),
  getVisits: () => api.get('/student/visits'),
  getNotifications: () => api.get('/student/notifications'),
  markNotificationRead: (id) => api.put(`/student/notifications/${id}/read`),
};

// Visitor API
export const visitorAPI = {
  bookVisit: (data) => api.post('/visits', data),
  getMyBookings: () => api.get('/visits/my-bookings'),
  getAll: (params) => api.get('/visits', { params }),
  getPending: () => api.get('/visits/pending'),
  approve: (id, data) => api.put(`/visits/${id}/approve`, data),
  reject: (id, data) => api.put(`/visits/${id}/reject`, data),
  getActive: () => api.get('/visits/active'),
};

// Parent API
export const parentAPI = {
  getDashboard: () => api.get('/parent/dashboard'),
  getChildDetails: (id) => api.get(`/parent/child/${id}`),
  getChildFees: (id) => api.get(`/parent/child/${id}/fees`),
  getChildAttendance: (id) => api.get(`/parent/child/${id}/attendance`),
  getChildComplaints: (id) => api.get(`/parent/child/${id}/complaints`),
  createVisit: (data) => api.post('/parent/visits', data),
  getVisits: () => api.get('/parent/visits'),
  cancelVisit: (id) => api.delete(`/parent/visits/${id}`),
  payFee: (feeId, data) => api.post(`/parent/pay-fee/${feeId}`, data),
};

// Warden API
export const wardenAPI = {
  getDashboard: () => api.get('/warden/dashboard'),
  getStudents: () => api.get('/warden/students'),
  markAttendance: (data) => api.post('/warden/attendance', data),
  getAttendanceReport: (params) => api.get('/warden/attendance/report', { params }),
  updateComplaintStatus: (id, data) => api.put(`/warden/complaints/${id}`, data),
  getPendingLeaves: () => api.get('/warden/leaves/pending'),
  approveLeave: (id, data) => api.put(`/warden/leaves/${id}/approve`, data),
  rejectLeave: (id, data) => api.put(`/warden/leaves/${id}/reject`, data),
  getPendingVisitors: () => api.get('/warden/visitors/pending'),
  approveVisitor: (id, data) => api.put(`/warden/visitors/${id}/approve`, data),
  rejectVisitor: (id, data) => api.put(`/warden/visitors/${id}/reject`, data),
  getActiveVisits: () => api.get('/warden/visitors/active'),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getHostels: () => api.get('/admin/hostels'),
  createHostel: (data) => api.post('/admin/hostels', data),
  getWardens: () => api.get('/admin/wardens'),
  createWarden: (data) => api.post('/admin/wardens', data),
  getStudents: () => api.get('/admin/students'),
  createStudent: (data) => api.post('/admin/students', data),
  getRooms: () => api.get('/admin/rooms'),
  createRoom: (data) => api.post('/admin/rooms', data),
  getFees: () => api.get('/admin/fees'),
  createFee: (data) => api.post('/admin/fees', data),
  getReports: (type) => api.get(`/admin/reports/${type}`),
};

// Attendance API
export const attendanceAPI = {
  getStudentAttendance: (studentId) => api.get(`/attendance/student/${studentId}`),
  markAttendance: (data) => api.post('/attendance', data),
  getReport: (params) => api.get('/attendance/report', { params }),
};

// Leave API
export const leaveAPI = {
  applyLeave: (data) => api.post('/leaves', data),
  getStudentLeaves: () => api.get('/leaves/my-leaves'),
  getAllLeaves: () => api.get('/leaves'),
  approveLeave: (id, data) => api.put(`/leaves/${id}/approve`, data),
  rejectLeave: (id, data) => api.put(`/leaves/${id}/reject`, data),
};

// Complaint API
export const complaintAPI = {
  createComplaint: (data) => api.post('/complaints', data),
  getStudentComplaints: () => api.get('/complaints/my-complaints'),
  getAllComplaints: () => api.get('/complaints'),
  updateStatus: (id, data) => api.put(`/complaints/${id}/status`, data),
};

// Notification API
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread/count'),
};

// Dormitory/Room API
export const dormAPI = {
  getAll: () => api.get('/dormitories'),
  getById: (id) => api.get(`/dormitories/${id}`),
  create: (data) => api.post('/dormitories', data),
  update: (id, data) => api.put(`/dormitories/${id}`, data),
  delete: (id) => api.delete(`/dormitories/${id}`),
};

// Room API
export const roomAPI = {
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
  allocate: (data) => api.post('/rooms/allocate', data),
};

// Messages API
export const messagesAPI = {
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  sendMessage: (data) => api.post('/messages', data),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
  getUnreadCount: () => api.get('/messages/unread/count'),
};

export default api;