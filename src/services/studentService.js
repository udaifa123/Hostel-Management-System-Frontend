import api from './api';

const studentService = {
  getDashboardStats: async () => {
    try {
      console.log('Fetching dashboard stats...');
      const response = await api.get('/student/dashboard');
      console.log('Dashboard stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getDashboardStats:', error.response?.data || error.message);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      console.log('Fetching profile...');
      const response = await api.get('/student/profile');
      console.log('Profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getProfile:', error.response?.data || error.message);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      console.log('Updating profile...', profileData);
      const response = await api.put('/student/profile', profileData);
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in updateProfile:', error.response?.data || error.message);
      throw error;
    }
  },

  getLeaves: async () => {
    try {
      console.log('Fetching leaves...');
      const response = await api.get('/student/leaves');
      console.log('Leaves response:', response.data);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error in getLeaves:', error.response?.data || error.message);
      throw error;
    }
  },

  applyLeave: async (leaveData) => {
    try {
      console.log('Applying for leave...', leaveData);
      const response = await api.post('/student/leaves', leaveData);
      console.log('Apply leave response:', response.data);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error in applyLeave:', error.response?.data || error.message);
      throw error;
    }
  },

  getLeaveDetails: async (id) => {
    try {
      console.log(`Fetching leave details for ID: ${id}`);
      const response = await api.get(`/student/leaves/${id}`);
      console.log('Leave details response:', response.data);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error in getLeaveDetails:', error.response?.data || error.message);
      throw error;
    }
  },

  cancelLeave: async (id) => {
    try {
      console.log(`Cancelling leave with ID: ${id}`);
      const response = await api.delete(`/student/leaves/${id}`);
      console.log('Cancel leave response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in cancelLeave:', error.response?.data || error.message);
      throw error;
    }
  },

  

getComplaints: async () => {
  try {
    console.log('Fetching complaints...');
    const response = await api.get('/student/complaints');
    console.log('Complaints response:', response.data);
    
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Error in getComplaints:', error);
    throw error;
  }
},

createComplaint: async (complaintData) => {
  try {
    console.log('Creating complaint:', complaintData);
    const response = await api.post('/student/complaints', complaintData);
    console.log('Complaint created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating complaint:', error);
    throw error;
  }
},

  getNotifications: async () => {
    try {
      console.log('Fetching notifications...');
      const response = await api.get('/student/notifications');
      console.log('Notifications response:', response.data);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data && response.data.notifications) {
        return response.data.notifications;
      }
      return [];
    } catch (error) {
      console.error('Error in getNotifications:', error.response?.data || error.message);
      return [];
    }
  },

  markNotificationAsRead: async (id) => {
    try {
      console.log(`Marking notification ${id} as read...`);
      const response = await api.put(`/student/notifications/${id}/read`);
      console.log('Mark read response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in markNotificationAsRead:', error.response?.data || error.message);
      throw error;
    }
  },


markAllNotificationsAsRead: async () => {
  try {
    console.log('Marking all notifications as read...');
    const response = await api.put('/student/notifications/read-all');
    console.log('Mark all read response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in markAllNotificationsAsRead:', error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || 'Failed to mark all as read' };
  }
},

  deleteNotification: async (id) => {
    try {
      console.log(`Deleting notification ${id}...`);
      const response = await api.delete(`/student/notifications/${id}`);
      console.log('Delete notification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in deleteNotification:', error.response?.data || error.message);
      throw error;
    }
  },

  getUnreadNotificationsCount: async () => {
    try {
      const notifications = await studentService.getNotifications();
      if (Array.isArray(notifications)) {
        return notifications.filter(n => !n.read && !n.isRead).length;
      }
      return 0;
    } catch (error) {
      console.error('Error in getUnreadNotificationsCount:', error);
      return 0;
    }
  },

 
getVisits: async () => {
  try {
    console.log('Fetching visits...');
    const response = await api.get('/student/visits');
    console.log('Visits response:', response.data);
    
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error in getVisits:', error.response?.data || error.message);
    throw error;
  }
},

requestVisit: async (visitData) => {
  try {
    console.log('Requesting visit...', visitData);
    const response = await api.post('/student/visits', visitData);
    console.log('Request visit response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in requestVisit:', error.response?.data || error.message);
    throw error;
  }
},

cancelVisit: async (id) => {
  try {
    console.log(`Cancelling visit with ID: ${id}`);
    const response = await api.delete(`/student/visits/${id}`);
    console.log('Cancel visit response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in cancelVisit:', error.response?.data || error.message);
    throw error;
  }
},
  getMessages: async () => {
    try {
      console.log('Fetching chat messages...');
      const response = await api.get('/student/chat/warden');
      console.log('Messages response:', response.data);
      
      if (response.data && response.data.messages) {
        return response.data.messages;
      } else if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error in getMessages:', error.response?.data || error.message);
      throw error;
    }
  },

  sendMessage: async (messageData) => {
    try {
      console.log('Sending message...', messageData);
      const response = await api.post('/student/chat/send', messageData);
      console.log('Send message response:', response.data);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error in sendMessage:', error.response?.data || error.message);
      throw error;
    }
  },

  getWardenInfo: async () => {
    try {
      console.log('Fetching warden info...');
      const response = await api.get('/student/chat/warden');
      console.log('Warden info response:', response.data);
      
      if (response.data && response.data.warden) {
        return response.data.warden;
      }
      return null;
    } catch (error) {
      console.error('Error in getWardenInfo:', error.response?.data || error.message);
      throw error;
    }
  },

  getAttendance: async (month, year) => {
    try {
      console.log(`Fetching attendance for ${month} ${year}...`);
      const params = new URLSearchParams();
      if (month) params.append('month', month);
      if (year) params.append('year', year);
      
      const response = await api.get(`/student/attendance?${params.toString()}`);
      console.log('Attendance response:', response.data);
      
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data && response.data.records) {
        return response.data.records;
      }
      return response.data;
    } catch (error) {
      console.error('Error in getAttendance:', error.response?.data || error.message);
      throw error;
    }
  },

  getAttendanceSummary: async () => {
    try {
      console.log('Fetching attendance summary...');
      const response = await api.get('/student/attendance/summary');
      console.log('Attendance summary response:', response.data);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error in getAttendanceSummary:', error.response?.data || error.message);
      return null;
    }
  },

  getSubjectAttendance: async () => {
    try {
      console.log('Fetching subject-wise attendance...');
      const response = await api.get('/student/attendance/subjects');
      console.log('Subject attendance response:', response.data);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error in getSubjectAttendance:', error.response?.data || error.message);
      return [];
    }
  },

  getAttendanceCalendar: async (month, year) => {
    try {
      console.log(`Fetching attendance calendar for ${month} ${year}...`);
      const params = new URLSearchParams();
      if (month) params.append('month', month);
      if (year) params.append('year', year);
      
      const response = await api.get(`/student/attendance/calendar?${params.toString()}`);
      console.log('Attendance calendar response:', response.data);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error in getAttendanceCalendar:', error.response?.data || error.message);
      return [];
    }
  },



getMyFees: async () => {
  try {
    console.log('📡 Calling getMyFees API...');
    const response = await api.get('/fees/student/my-fees');
    console.log('📡 getMyFees response status:', response.status);
    console.log('📡 getMyFees response data:', response.data);
    
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data || { fees: [], summary: {} }
      };
    }
    
    return {
      success: false,
      data: { fees: [], summary: {} }
    };
  } catch (error) {
    console.error('❌ Error in getMyFees:', error);
    console.error('❌ Error response:', error.response?.data);
    return {
      success: false,
      data: { fees: [], summary: {} }
    };
  }
},

processPayment: async (paymentData) => {
  try {
    const response = await api.post('/fees/student/pay', paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

createPayPalOrder: async (data) => {
  try {
    const response = await api.post('/fees/student/create-paypal-order', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

capturePayPalPayment: async (data) => {
  try {
    const response = await api.post('/fees/student/capture-paypal-payment', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

getReceipt: async (feeId) => {
  try {
    console.log(`Fetching receipt for fee ID: ${feeId}`);
    const response = await api.get(`/fees/receipt/${feeId}`);
    console.log('Receipt response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getReceipt:', error);
    throw error.response?.data || { success: false, message: error.message };
  }
},

getPaymentHistory: async (feeId) => {
  try {
    console.log(`Fetching payment history for fee ID: ${feeId}`);
    const response = await api.get(`/fees/payment-history/${feeId}`);
    return response.data;
  } catch (error) {
    console.error('Error in getPaymentHistory:', error);
    throw error.response?.data || error.message;
  }
},
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      console.log('Health check response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: 'API not reachable' };
    }
  },

  handleError: (error) => {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || 'Server error occurred',
        data: error.response.data
      };
    } else if (error.request) {
      return {
        status: 503,
        message: 'Network error - please check your connection',
        data: null
      };
    } else {
      return {
        status: 500,
        message: error.message || 'An unexpected error occurred',
        data: null
      };
    }
  }
};

export default studentService;