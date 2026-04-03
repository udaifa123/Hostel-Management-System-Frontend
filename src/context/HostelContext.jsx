import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import hostelService from '../services/hostelService';

const HostelContext = createContext();

export const useHostel = () => {
  const context = useContext(HostelContext);
  if (!context) {
    throw new Error('useHostel must be used within HostelProvider');
  }
  return context;
};

export const HostelProvider = ({ children }) => {
  const { user } = useAuth();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    pendingComplaints: 0,
    pendingLeaves: 0,
    todayAttendance: 0,
    presentToday: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    if (user?.hostelId) {
      fetchHostelData();
    }
  }, [user]);

  const fetchHostelData = async () => {
    try {
      setLoading(true);
      const data = await hostelService.getHostelById(user.hostelId);
      setHostel(data);
      
      const statsData = await hostelService.getHostelStats(user.hostelId);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching hostel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    hostel,
    stats,
    loading,
    refreshStats: fetchHostelData,
    hostelId: user?.hostelId,
    hostelName: hostel?.name,
    hostelCapacity: hostel?.capacity
  };

  return (
    <HostelContext.Provider value={value}>
      {children}
    </HostelContext.Provider>
  );
};