import api from './api';

const parentService = {
  getDashboard: async () => {
    try {
      const response = await api.get('/parent/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getStudentProfile: async () => {
    try {
      const response = await api.get('/parent/student-profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateStudentProfile: async (profileData) => {
    try {
      const response = await api.put('/parent/student-profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAttendance: async (month = null, year = null) => {
    try {
      let url = '/parent/attendance';
      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getLeaves: async () => {
    try {
      const response = await api.get('/parent/leaves');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getComplaints: async () => {
    try {
      const response = await api.get('/parent/complaints');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getNotices: async () => {
    try {
      console.log('Fetching notices for parent...');
      const response = await api.get('/parent/notices');
      console.log('Notices response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching notices:', error);
      throw error.response?.data || error.message;
    }
  },

  getFees: async () => {
    try {
      const response = await api.get('/parent/fees');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


getChildrenFees: async () => {
  try {
    const response = await api.get('/fees/parent/children-fees');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

payChildFee: async (paymentData) => {
  try {
    const response = await api.post('/fees/parent/pay-child-fee', paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},
  getNotifications: async () => {
    try {
      const response = await api.get('/parent/notifications');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/parent/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  markAllNotificationsAsRead: async () => {
    try {
      const response = await api.put('/parent/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

 getMessMenu: async () => {
    try {
      const response = await api.get('/mess/parent/menu');
      console.log('getMessMenu response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching mess menu:', error);
      throw error.response?.data || error.message;
    }
  },

  getMessTimings: async () => {
    try {
      const response = await api.get('/mess/parent/timings');
      console.log('getMessTimings response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching mess timings:', error);
      throw error.response?.data || error.message;
    }
  },


 
getVisitRequests: async () => {
  try {
    const response = await api.get('/parent/visits');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

createVisitRequest: async (visitData) => {
  try {
    const response = await api.post('/parent/visits', visitData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

cancelVisit: async (id) => {
  try {
    const response = await api.delete(`/parent/visits/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

deleteVisit: async (id) => {
  try {
    const response = await api.delete(`/parent/visits/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting visit:', error);
    throw error.response?.data || error.message;
  }
},

  getWardens: async () => {
    try {
      const response = await api.get('/parent/wardens');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getChatHistory: async (wardenId) => {
    try {
      const response = await api.get(`/parent/chat/${wardenId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  sendMessage: async (receiverId, content) => {
    try {
      const response = await api.post('/parent/chat/send', { receiverId, content });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default parentService;