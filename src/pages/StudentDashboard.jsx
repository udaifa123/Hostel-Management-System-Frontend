import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  User, LogOut, Calendar, Clock, Home, Bell,
  MessageCircle, Edit3, CheckCircle, XCircle,
  AlertCircle, Menu, X, ChevronRight, BookOpen,
  Phone, MapPin, Mail, Key, Send, Download,
  Users, Moon, Sun, Eye, EyeOff, Award, Heart,
  Shield, Wifi, Coffee, Thermometer
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Mock Data - Replace with API calls
  const [studentData, setStudentData] = useState({
    name: user?.name || 'Rahul Kumar',
    id: 'CS2024001',
    rollNumber: '2024CS001',
    roomNumber: 'A-203',
    hostelName: 'Boys Block A',
    floor: '2nd Floor',
    warden: 'Mr. Sharma',
    wardenPhone: '+91 9876543210',
    course: 'B.Tech Computer Science',
    semester: 4,
    batch: '2024',
    email: user?.email || 'rahul@example.com',
    phone: user?.phone || '+91 9876543210',
    address: 'Room A-203, Boys Hostel, Campus',
    bloodGroup: 'B+',
    dateOfBirth: '2003-05-15',
    gender: 'Male'
  });

  const [attendance, setAttendance] = useState({
    today: 'present',
    percentage: 92,
    totalPresent: 46,
    totalDays: 50,
    weeklyData: [
      { day: 'Mon', status: 'present' },
      { day: 'Tue', status: 'present' },
      { day: 'Wed', status: 'present' },
      { day: 'Thu', status: 'absent' },
      { day: 'Fri', status: 'present' },
      { day: 'Sat', status: 'present' }
    ],
    monthlyData: [
      { date: '2024-03-01', status: 'present' },
      { date: '2024-03-02', status: 'present' },
      { date: '2024-03-03', status: 'absent' }
    ]
  });

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, fromDate: '2024-03-20', toDate: '2024-03-22', reason: 'Family function', status: 'approved', type: 'vacation' },
    { id: 2, fromDate: '2024-03-25', toDate: '2024-03-26', reason: 'Sick', status: 'pending', type: 'sick' }
  ]);

  const [newLeave, setNewLeave] = useState({
    fromDate: '',
    toDate: '',
    reason: '',
    type: 'sick'
  });

  const [roommates, setRoommates] = useState([
    { id: 1, name: 'Amit Kumar', rollNo: 'CS2024002', department: 'CSE', phone: '+91 9876543211' },
    { id: 2, name: 'Rajesh Singh', rollNo: 'CS2024003', department: 'CSE', phone: '+91 9876543212' },
    { id: 3, name: 'Suresh Patel', rollNo: 'CS2024004', department: 'CSE', phone: '+91 9876543213' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your leave request for March 20-22 has been approved', type: 'success', read: false, date: '2024-03-19' },
    { id: 2, message: 'Attendance below 75% warning', type: 'warning', read: false, date: '2024-03-18' },
    { id: 3, message: 'New message from warden', type: 'info', read: true, date: '2024-03-17' },
    { id: 4, message: 'Parent meeting scheduled for March 25', type: 'info', read: false, date: '2024-03-16' }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, from: 'Warden', content: 'Please submit your leave application', time: '10:30 AM', unread: true },
    { id: 2, from: 'Parent', content: 'Call me when you are free', time: '09:15 AM', unread: false }
  ]);

  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatWith, setChatWith] = useState('warden');
  const [chatHistory, setChatHistory] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...studentData });

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!newLeave.fromDate || !newLeave.toDate || !newLeave.reason) {
      toast.error('Please fill all fields');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const newRequest = {
        id: leaveRequests.length + 1,
        ...newLeave,
        status: 'pending'
      };
      setLeaveRequests([newRequest, ...leaveRequests]);
      toast.success('Leave application submitted successfully!');
      setNewLeave({ fromDate: '', toDate: '', reason: '', type: 'sick' });
      setShowLeaveForm(false);
      setLoading(false);
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      from: 'You',
      content: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true
    };
    setChatHistory([...chatHistory, newMsg]);
    setChatMessage('');
    toast.success('Message sent');
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setStudentData(editedProfile);
      setEditMode(false);
      toast.success('Profile updated successfully!');
      setLoading(false);
    }, 1000);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-gradient-to-b from-blue-600 to-indigo-700 text-white transition-transform duration-300 ease-in-out z-30 lg:translate-x-0 shadow-xl`}>
        <div className="p-4">
          {/* Close button for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 text-white"
          >
            <X size={24} />
          </button>

          {/* Student Profile in Sidebar */}
          <div className="text-center mb-8 mt-8 lg:mt-0">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
              <User size={40} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-lg">{studentData.name}</h3>
            <p className="text-blue-200 text-sm">{studentData.rollNumber}</p>
            <div className="mt-2 bg-blue-500 bg-opacity-30 rounded-lg p-2">
              <p className="text-sm">Room: {studentData.roomNumber}</p>
              <p className="text-sm">{studentData.hostelName}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                activeTab === 'overview' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              <Home size={18} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => { setActiveTab('attendance'); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                activeTab === 'attendance' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              <Calendar size={18} />
              <span>Attendance</span>
            </button>

            <button
              onClick={() => { setActiveTab('leave'); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                activeTab === 'leave' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              <Clock size={18} />
              <span>Leave Requests</span>
            </button>

            <button
              onClick={() => { setActiveTab('room'); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                activeTab === 'room' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              <Home size={18} />
              <span>Room Details</span>
            </button>

            <button
              onClick={() => { setActiveTab('chat'); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                activeTab === 'chat' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              <MessageCircle size={18} />
              <span>Messages</span>
              {messages.filter(m => m.unread).length > 0 && (
                <span className="bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                  {messages.filter(m => m.unread).length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              <User size={18} />
              <span>Profile</span>
            </button>
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="absolute bottom-4 left-4 right-4 bg-red-600 text-white p-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm p-4 sticky top-0 z-10`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu size={24} className={darkMode ? 'text-white' : 'text-gray-800'} />
              </button>
              <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Student Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <Bell size={20} className={darkMode ? 'text-white' : 'text-gray-600'} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  {studentData.name.charAt(0)}
                </div>
                <span className={`hidden md:block ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {studentData.name}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Welcome back, {studentData.name}! 👋
                    </h2>
                    <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className={`mt-4 md:mt-0 p-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Room: {studentData.roomNumber}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {studentData.hostelName} • Floor {studentData.floor}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Attendance</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {attendance.percentage}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="text-green-600" size={24} />
                    </div>
                  </div>
                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {attendance.totalPresent}/{attendance.totalDays} days
                  </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Today's Status</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {attendance.today === 'present' ? 'Present' : 'Absent'}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${
                      attendance.today === 'present' ? 'bg-green-100' : 'bg-red-100'
                    } rounded-full flex items-center justify-center`}>
                      {attendance.today === 'present' ? (
                        <CheckCircle className="text-green-600" size={24} />
                      ) : (
                        <XCircle className="text-red-600" size={24} />
                      )}
                    </div>
                  </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Leave Balance</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>12</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="text-yellow-600" size={24} />
                    </div>
                  </div>
                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {leaveRequests.filter(l => l.status === 'pending').length} pending
                  </p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Unread Messages</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {messages.filter(m => m.unread).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setShowLeaveForm(true)}
                    className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Clock className="text-blue-600 mx-auto mb-2" size={24} />
                    <span className="text-sm text-blue-600">Apply Leave</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Calendar className="text-green-600 mx-auto mb-2" size={24} />
                    <span className="text-sm text-green-600">View Attendance</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('chat')}
                    className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <MessageCircle className="text-purple-600 mx-auto mb-2" size={24} />
                    <span className="text-sm text-purple-600">Chat</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    <User className="text-yellow-600 mx-auto mb-2" size={24} />
                    <span className="text-sm text-yellow-600">Profile</span>
                  </button>
                </div>
              </div>

              {/* Recent Notifications */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center justify-between ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Recent Notifications
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        !notif.read 
                          ? `${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-blue-500` 
                          : darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {notif.type === 'success' && <CheckCircle size={18} className="text-green-500 mt-1" />}
                        {notif.type === 'warning' && <AlertCircle size={18} className="text-yellow-500 mt-1" />}
                        {notif.type === 'info' && <Bell size={18} className="text-blue-500 mt-1" />}
                        <div className="flex-1">
                          <p className={darkMode ? 'text-white' : 'text-gray-800'}>{notif.message}</p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notif.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Attendance Overview
                </h2>
                
                {/* Today's Status */}
                <div className="mb-6">
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Today's Status
                  </h3>
                  <div className={`p-4 rounded-lg ${
                    attendance.today === 'present' 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {attendance.today === 'present' ? (
                          <CheckCircle className="text-green-600" size={24} />
                        ) : (
                          <XCircle className="text-red-600" size={24} />
                        )}
                        <span className={`font-semibold ${
                          attendance.today === 'present' ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {attendance.today === 'present' ? 'Present' : 'Absent'}
                        </span>
                      </div>
                      <span className={`text-sm ${
                        attendance.today === 'present' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Weekly Overview */}
                <div className="mb-6">
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    This Week
                  </h3>
                  <div className="flex justify-between">
                    {attendance.weeklyData.map((day, index) => (
                      <div key={index} className="text-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                          day.status === 'present' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {day.status === 'present' ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <XCircle size={16} className="text-red-600" />
                          )}
                        </div>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {day.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {attendance.totalPresent}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Present</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {attendance.totalDays - attendance.totalPresent}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Absent</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {attendance.percentage}%
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Percentage</p>
                  </div>
                </div>

                <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Download Full Report
                </button>
              </div>
            </div>
          )}

          {/* Leave Tab */}
          {activeTab === 'leave' && (
            <div className="space-y-6">
              {/* Apply Leave Button */}
              {!showLeaveForm && (
                <button
                  onClick={() => setShowLeaveForm(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Clock size={20} />
                  <span>Apply for Leave</span>
                </button>
              )}

              {/* Leave Application Form */}
              {showLeaveForm && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Apply for Leave
                  </h3>
                  <form onSubmit={handleApplyLeave}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          From Date
                        </label>
                        <input
                          type="date"
                          value={newLeave.fromDate}
                          onChange={(e) => setNewLeave({...newLeave, fromDate: e.target.value})}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full p-2 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300'
                          }`}
                          required
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          To Date
                        </label>
                        <input
                          type="date"
                          value={newLeave.toDate}
                          onChange={(e) => setNewLeave({...newLeave, toDate: e.target.value})}
                          min={newLeave.fromDate}
                          className={`w-full p-2 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300'
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Leave Type
                      </label>
                      <select
                        value={newLeave.type}
                        onChange={(e) => setNewLeave({...newLeave, type: e.target.value})}
                        className={`w-full p-2 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        <option value="sick">Sick Leave</option>
                        <option value="emergency">Emergency</option>
                        <option value="vacation">Vacation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Reason
                      </label>
                      <textarea
                        value={newLeave.reason}
                        onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                        rows="3"
                        placeholder="Enter reason for leave..."
                        className={`w-full p-2 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                        required
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Submitting...' : 'Submit'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowLeaveForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Leave History */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Leave History
                </h3>
                <div className="space-y-3">
                  {leaveRequests.map(leave => (
                    <div
                      key={leave.id}
                      className={`p-4 rounded-lg border ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {leave.fromDate} to {leave.toDate}
                          </p>
                          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {leave.reason}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                          {leave.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Room Details Tab */}
          {activeTab === 'room' && (
            <div className="space-y-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Room Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
                      <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Room Information
                      </h3>
                      <div className="space-y-2">
                        <p className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span>Room Number:</span>
                          <span className="font-semibold">{studentData.roomNumber}</span>
                        </p>
                        <p className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span>Floor:</span>
                          <span className="font-semibold">{studentData.floor}</span>
                        </p>
                        <p className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span>Block:</span>
                          <span className="font-semibold">{studentData.hostelName}</span>
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Warden Details
                      </h3>
                      <div className="space-y-2">
                        <p className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span>Name:</span>
                          <span className="font-semibold">{studentData.warden}</span>
                        </p>
                        <p className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span>Contact:</span>
                          <span className="font-semibold">{studentData.wardenPhone}</span>
                        </p>
                      </div>
                      <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Contact Warden
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Roommates ({roommates.length})
                      </h3>
                      <div className="space-y-3">
                        {roommates.map(roommate => (
                          <div
                            key={roommate.id}
                            className={`p-3 rounded-lg ${
                              darkMode ? 'bg-gray-600' : 'bg-white'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                {roommate.name.charAt(0)}
                              </div>
                              <div>
                                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                  {roommate.name}
                                </p>
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {roommate.rollNo} • {roommate.department}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
              <div className="p-4 border-b border-gray-200">
                <select
                  value={chatWith}
                  onChange={(e) => setChatWith(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="warden">Chat with Warden</option>
                  <option value="parent">Chat with Parent</option>
                  <option value="staff">Chat with Staff</option>
                </select>
              </div>

              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {chatHistory.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        msg.sent
                          ? 'bg-blue-600 text-white'
                          : darkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sent ? 'text-blue-200' : darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message..."
                    className={`flex-1 p-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  My Profile
                </h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit3 size={18} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {editMode ? (
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                        className={`w-full p-2 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Address
                      </label>
                      <textarea
                        value={editedProfile.address}
                        onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                        rows="2"
                        className={`w-full p-2 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className={`font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Personal Information
                    </h3>
                    <div className="space-y-2">
                      <p className={`flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <User size={16} />
                        <span className="font-medium text-gray-800 dark:text-white mr-2">Name:</span>
                        {studentData.name}
                      </p>
                      <p className={`flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Mail size={16} />
                        <span className="font-medium text-gray-800 dark:text-white mr-2">Email:</span>
                        {studentData.email}
                      </p>
                      <p className={`flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Phone size={16} />
                        <span className="font-medium text-gray-800 dark:text-white mr-2">Phone:</span>
                        {studentData.phone}
                      </p>
                      <p className={`flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <MapPin size={16} />
                        <span className="font-medium text-gray-800 dark:text-white mr-2">Address:</span>
                        {studentData.address}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className={`font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Academic Information
                    </h3>
                    <div className="space-y-2">
                      <p className={`flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <BookOpen size={16} />
                        <span className="font-medium text-gray-800 dark:text-white mr-2">Roll No:</span>
                        {studentData.rollNumber}
                      </p>
                      <p className={`flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <BookOpen size={16} />
                        <span className="font-medium text-gray-800 dark:text-white mr-2">Course:</span>
                        {studentData.course}
                      </p>
                      <p className={`flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Calendar size={16} />
                        <span className="font-medium text-gray-800 dark:text-white mr-2">Semester:</span>
                        {studentData.semester}
                      </p>
                      <p className={`flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Heart size={16} />
                        <span className="font-medium text-gray-800 dark:text-white mr-2">Blood Group:</span>
                        {studentData.bloodGroup}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Leave Form Modal (for quick access) */}
      {showLeaveForm && activeTab !== 'leave' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 max-w-md w-full`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Apply for Leave
            </h3>
            <form onSubmit={handleApplyLeave}>
              {/* Same form fields as above */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="date"
                  value={newLeave.fromDate}
                  onChange={(e) => setNewLeave({...newLeave, fromDate: e.target.value})}
                  className={`p-2 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  required
                />
                <input
                  type="date"
                  value={newLeave.toDate}
                  onChange={(e) => setNewLeave({...newLeave, toDate: e.target.value})}
                  className={`p-2 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>
              <textarea
                value={newLeave.reason}
                onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                placeholder="Reason"
                rows="3"
                className={`w-full p-2 rounded-lg border mb-4 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
                required
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeaveForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;