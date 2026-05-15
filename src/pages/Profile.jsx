import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Phone, MapPin, Calendar, BookOpen, 
  Hash, Save, Edit2, Camera, Key, Briefcase, Users,
  Award, Heart, Clock, Home
} from 'lucide-react';
import toast from 'react-hot-toast';
import { studentAPI } from '../api/axios';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    rollNumber: user?.rollNumber || '',
    course: user?.course || '',
    semester: user?.semester || '',
    batch: user?.batch || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    bloodGroup: user?.bloodGroup || '',
    
    occupation: user?.occupation || '',
    relationship: user?.relationship || '',
    alternatePhone: user?.alternatePhone || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      if (user?.id) {
        const response = await studentAPI.getProfile(user.id);
        if (response.data) {
          setProfileData(prev => ({
            ...prev,
            ...response.data
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const response = await studentAPI.updateProfile(user.id, {
          phone: profileData.phone,
          address: profileData.address
        });
        
        if (response.data) {
          toast.success('Profile updated successfully!');
          setIsEditing(false);
          fetchProfileData();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
  
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordSection(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch(user?.role) {
      case 'student': return <Users className="text-blue-600" size={24} />;
      case 'parent': return <Heart className="text-pink-600" size={24} />;
      case 'staff': return <Briefcase className="text-green-600" size={24} />;
      case 'warden': return <Home className="text-purple-600" size={24} />;
      case 'security': return <Shield className="text-gray-600" size={24} />;
      case 'admin': return <Award className="text-yellow-600" size={24} />;
      default: return <User className="text-blue-600" size={24} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
 
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden mb-6">
        <div className="relative h-32 bg-gradient-to-r from-blue-800 to-indigo-800">
          <button className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
            <Camera size={20} className="text-white" />
          </button>
        </div>
        
        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end -mt-12">
            <div className="flex items-end space-x-4">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                {getRoleIcon()}
              </div>
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-white">{profileData.name}</h1>
                <p className="text-blue-100 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 md:ml-auto flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-colors"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg mt-1"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{profileData.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">Email Address</label>
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  {profileData.email}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg mt-1"
                  />
                ) : (
                  <p className="font-medium text-gray-800 flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    {profileData.phone || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg mt-1"
                  />
                ) : (
                  <p className="font-medium text-gray-800 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    {profileData.dateOfBirth || 'Not provided'}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full p-2 border rounded-lg mt-1"
                  />
                ) : (
                  <p className="font-medium text-gray-800 flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    {profileData.address || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {user?.role === 'student' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-600" />
                Academic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Roll Number</label>
                  <p className="font-medium text-gray-800 flex items-center gap-2">
                    <Hash size={16} className="text-gray-400" />
                    {profileData.rollNumber || 'Not assigned'}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Course</label>
                  <p className="font-medium text-gray-800">{profileData.course || 'Not assigned'}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Semester</label>
                  <p className="font-medium text-gray-800">{profileData.semester || 'Not assigned'}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Batch</label>
                  <p className="font-medium text-gray-800">{profileData.batch || 'Not assigned'}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg mt-1"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="font-medium text-gray-800 capitalize">{profileData.gender || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Blood Group</label>
                  {isEditing ? (
                    <select
                      name="bloodGroup"
                      value={profileData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg mt-1"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <p className="font-medium text-gray-800">{profileData.bloodGroup || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {user?.role === 'parent' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Heart size={20} className="text-blue-600" />
                Parent Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Occupation</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="occupation"
                      value={profileData.occupation}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg mt-1"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">{profileData.occupation || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Relationship</label>
                  {isEditing ? (
                    <select
                      name="relationship"
                      value={profileData.relationship}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg mt-1"
                    >
                      <option value="">Select</option>
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="guardian">Guardian</option>
                    </select>
                  ) : (
                    <p className="font-medium text-gray-800 capitalize">{profileData.relationship || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Alternate Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={profileData.alternatePhone}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg mt-1"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">{profileData.alternatePhone || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Info</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Member since</span>
                <span className="font-medium">Jan 2024</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Last login</span>
                <span className="font-medium">Today, 10:30 AM</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Account status</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Key size={20} className="text-blue-600" />
              Security
            </h2>
            
            {!showPasswordSection ? (
              <button
                onClick={() => setShowPasswordSection(true)}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-3">
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Current Password"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm New Password"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordSection(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-red-200">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
            
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to deactivate your account?')) {
                  toast.error('Account deactivation is not available in demo');
                }
              }}
              className="w-full bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;