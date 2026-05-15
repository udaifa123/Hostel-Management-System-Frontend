import api from './api';

const adminService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  },

  getHostels: async () => {
    try {
      const response = await api.get('/admin/hostels');
      return response.data;
    } catch (error) {
      console.error('Error fetching hostels:', error);
      throw error;
    }
  },

  createHostel: async (data) => {
    try {
      const response = await api.post('/admin/create-hostel', data);
      return response.data;
    } catch (error) {
      console.error('Error creating hostel:', error);
      throw error;
    }
  },

  updateHostel: async (id, data) => {
    try {
      const response = await api.put(`/admin/hostels/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating hostel:', error);
      throw error;
    }
  },

  deleteHostel: async (id) => {
    try {
      const response = await api.delete(`/admin/hostels/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting hostel:', error);
      throw error;
    }
  },

  getWardens: async () => {
    try {
      const response = await api.get('/admin/wardens');
      return response.data;
    } catch (error) {
      console.error('Error fetching wardens:', error);
      throw error;
    }
  },

  createWarden: async (data) => {
    try {
      const response = await api.post('/admin/create-warden', data);
      return response.data;
    } catch (error) {
      console.error('Error creating warden:', error);
      throw error;
    }
  },

  updateWarden: async (id, data) => {
    try {
      const response = await api.put(`/admin/wardens/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating warden:', error);
      throw error;
    }
  },

  deleteWarden: async (id) => {
    try {
      const response = await api.delete(`/admin/wardens/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting warden:', error);
      throw error;
    }
  },

  getStudents: async () => {
    try {
      const response = await api.get('/admin/students');
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  getStudentById: async (id) => {
    try {
      const response = await api.get(`/admin/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  },

  createStudent: async (data) => {
    try {
      const response = await api.post('/admin/students', data);
      return response.data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },

  updateStudent: async (id, data) => {
    try {
      const response = await api.put(`/admin/students/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  deleteStudent: async (id) => {
    try {
      const response = await api.delete(`/admin/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },

  getRooms: async () => {
    try {
      const response = await api.get('/admin/rooms');
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  createRoom: async (data) => {
    try {
      const response = await api.post('/admin/rooms', data);
      return response.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  updateRoom: async (id, data) => {
    try {
      const response = await api.put(`/admin/rooms/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  },

  deleteRoom: async (id) => {
    try {
      const response = await api.delete(`/admin/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  },

  getLeaves: async () => {
    try {
      const response = await api.get('/admin/leaves');
      return response.data;
    } catch (error) {
      console.error('Error fetching leaves:', error);
      throw error;
    }
  },

  updateLeaveStatus: async (id, status) => {
    try {
      const response = await api.put(`/admin/leaves/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating leave:', error);
      throw error;
    }
  },

  getComplaints: async () => {
    try {
      const response = await api.get('/admin/complaints');
      return response.data;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  },

  updateComplaintStatus: async (id, status) => {
    try {
      const response = await api.put(`/admin/complaints/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating complaint:', error);
      throw error;
    }
  },

getAllFees: async () => {
  try {
    const response = await api.get('/fees/admin/all-fees');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

generateFee: async (data) => {
  try {
    const response = await api.post('/fees/admin/generate-fee', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

generateAllFees: async (data) => {
  try {
    const response = await api.post('/fees/admin/generate-all-fees', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

deleteFee: async (feeId) => {
  try {
    const response = await api.delete(`/fees/admin/fees/${feeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

getFeeAnalytics: async (year) => {
  try {
    const response = await api.get(`/fees/admin/analytics?year=${year || new Date().getFullYear()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},
 

  getWeeklyAttendance: async () => {
    try {
      const response = await api.get('/admin/attendance/weekly');
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly attendance:', error);
      throw error;
    }
  },

  getAttendanceStats: async () => {
    try {
      const response = await api.get('/admin/attendance/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      throw error;
    }
  },

  getWeeklyVisitors: async () => {
    try {
      const response = await api.get('/admin/visitors/weekly');
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly visitors:', error);
      throw error;
    }
  },

  getVisitorStats: async () => {
    try {
      const response = await api.get('/admin/visitors/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      throw error;
    }
  },

  getRecentActivities: async () => {
    try {
      const response = await api.get('/admin/activities/recent');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },

  exportReport: async (type, format = 'pdf') => {
    try {
      const response = await api.get(`/admin/reports/export?type=${type}&format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/admin/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/admin/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  getSettings: async () => {
    try {
      const response = await api.get('/admin/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  updateSettings: async (data) => {
    try {
      const response = await api.put('/admin/settings', data);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
};

export default adminService;