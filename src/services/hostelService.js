import api from './api';

const hostelService = {
  getHostelById: async (hostelId) => {
    try {
      const response = await api.get(`/hostels/${hostelId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hostel:', error);
      
      return {
        id: hostelId,
        name: 'Boys Hostel A',
        capacity: 200,
        warden: 'John Doe',
        address: 'Main Campus, University Road',
        contact: '+91 9876543210'
      };
    }
  },

  getHostelStats: async (hostelId) => {
    try {
      const response = await api.get(`/hostels/${hostelId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hostel stats:', error);
      
      return {
        totalStudents: 156,
        totalRooms: 80,
        occupiedRooms: 72,
        availableRooms: 8,
        pendingComplaints: 5,
        pendingLeaves: 3,
        todayAttendance: 85
      };
    }
  },

  getAllHostels: async () => {
    try {
      const response = await api.get('/hostels');
      return response.data;
    } catch (error) {
      console.error('Error fetching hostels:', error);
      return [];
    }
  },

  updateHostel: async (hostelId, data) => {
    try {
      const response = await api.put(`/hostels/${hostelId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating hostel:', error);
      throw error;
    }
  }
};

export default hostelService;