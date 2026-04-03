import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, Building2, Users, Home, LogIn, AlertCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    // Check for saved credentials
    const savedEmail = localStorage.getItem('adminEmail');
    const savedRemember = localStorage.getItem('adminRemember');
    if (savedRemember === 'true' && savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        role: 'admin'
      });
      
      if (result && result.success) {
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('adminEmail', formData.email);
          localStorage.setItem('adminRemember', 'true');
        } else {
          localStorage.removeItem('adminEmail');
          localStorage.removeItem('adminRemember');
        }
        
        toast.success('Welcome back, Admin!', {
          icon: '👑',
          style: {
            borderRadius: '10px',
            background: '#1A5C2A',
            color: '#fff',
          },
        });
        navigate('/admin/dashboard');
      } else {
        const errorMsg = result?.message || 'Invalid admin credentials';
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'admin@hostel.com',
      password: 'admin123'
    });
    setErrorMessage('');
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        {/* Left Panel - Branding */}
        <div className="login-left-panel">
          <div className="brand-content">
            <div className="brand-logo">
              <Shield size={32} />
              <span>HostelManager</span>
            </div>
            
            <div className="hero-section">
              <h1>Admin Dashboard</h1>
              <p>Complete control over your hostel management system</p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <Building2 size={20} />
                </div>
                <div>
                  <h4>Multi-Hostel Management</h4>
                  <p>Manage all hostels from a single dashboard</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Users size={20} />
                </div>
                <div>
                  <h4>Student Analytics</h4>
                  <p>Track attendance, fees, and performance</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Home size={20} />
                </div>
                <div>
                  <h4>Room Allocation</h4>
                  <p>Efficient room management system</p>
                </div>
              </div>
            </div>

            <div className="stats-banner">
              <div className="stat">
                <span className="stat-number">5+</span>
                <span className="stat-label">Hostels</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">200+</span>
                <span className="stat-label">Rooms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="login-right-panel">
          <div className="login-form-container">
            <div className="form-header">
              <div className="header-badge">
                <Shield size={18} />
                <span>Admin Access</span>
              </div>
              <h2>Welcome Back</h2>
              <p>Sign in to manage your hostel ecosystem</p>
            </div>

            {errorMessage && (
              <div className="error-alert">
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className={`input-field ${focusedField === 'email' ? 'focused' : ''}`}>
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="field-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="admin@hostel.com"
                    required
                  />
                </div>
              </div>

              <div className={`input-field ${focusedField === 'password' ? 'focused' : ''}`}>
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="field-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <ChevronRight size={18} />
                  </>
                )}
              </button>

              <div className="demo-section">
                <p className="demo-note">Demo Credentials</p>
                <div className="demo-credentials">
                  <code>admin@hostel.com</code>
                  <code>admin123</code>
                </div>
                <button 
                  type="button" 
                  onClick={handleDemoLogin}
                  className="demo-button"
                >
                  Use Demo Credentials
                </button>
              </div>

              <div className="back-link">
                <Link to="/login">
                  ← Back to User Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-login-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #F4FBF5 0%, #E8F3EA 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .admin-login-container {
          min-height: 100vh;
          display: flex;
          max-width: 1400px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.05);
        }

        /* Left Panel Styles */
        .login-left-panel {
          flex: 1.2;
          background: linear-gradient(135deg, #1A5C2A 0%, #0D3318 100%);
          padding: 48px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .login-left-panel::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: rotate 30s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .brand-content {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 80px;
        }

        .brand-logo svg {
          color: #8FD9A0;
        }

        .brand-logo span {
          font-size: 20px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
        }

        .hero-section {
          margin-bottom: 60px;
        }

        .hero-section h1 {
          font-size: 42px;
          font-weight: 700;
          color: white;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .hero-section p {
          font-size: 16px;
          color: rgba(255,255,255,0.8);
          line-height: 1.5;
        }

        .features-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 60px;
        }

        .feature-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          background: rgba(255,255,255,0.08);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          background: rgba(255,255,255,0.12);
          transform: translateX(8px);
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          background: rgba(143,217,160,0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-icon svg {
          color: #8FD9A0;
        }

        .feature-card h4 {
          color: white;
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .feature-card p {
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          line-height: 1.4;
        }

        .stats-banner {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-top: auto;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.2);
        }

        /* Right Panel Styles */
        .login-right-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          background: white;
        }

        .login-form-container {
          width: 100%;
          max-width: 420px;
        }

        .form-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: #E8F3EA;
          border-radius: 30px;
          margin-bottom: 24px;
        }

        .header-badge svg {
          color: #2E9142;
        }

        .header-badge span {
          font-size: 12px;
          font-weight: 600;
          color: #1A5C2A;
        }

        .form-header h2 {
          font-size: 32px;
          font-weight: 700;
          color: #1A5C2A;
          margin-bottom: 8px;
        }

        .form-header p {
          font-size: 14px;
          color: #6B7280;
        }

        .error-alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .error-alert svg {
          color: #EF4444;
          flex-shrink: 0;
        }

        .error-alert span {
          font-size: 13px;
          color: #991B1B;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-field label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.3px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          color: #9CA3AF;
          transition: color 0.2s ease;
        }

        .input-field.focused .field-icon {
          color: #2E9142;
        }

        .input-wrapper input {
          width: 100%;
          padding: 12px 12px 12px 42px;
          background: #F9FAFB;
          border: 1.5px solid #E5E7EB;
          border-radius: 12px;
          font-size: 14px;
          color: #111827;
          transition: all 0.2s ease;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #2E9142;
          background: white;
          box-shadow: 0 0 0 3px rgba(46,145,66,0.1);
        }

        .input-wrapper input::placeholder {
          color: #9CA3AF;
        }

        .toggle-password {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #9CA3AF;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .toggle-password:hover {
          color: #2E9142;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .checkbox input {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: #2E9142;
        }

        .checkbox span {
          font-size: 13px;
          color: #4B5563;
        }

        .forgot-link {
          font-size: 13px;
          color: #2E9142;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .forgot-link:hover {
          color: #1A5C2A;
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #2E9142, #1A5C2A);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(46,145,66,0.3);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .demo-section {
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }

        .demo-note {
          font-size: 12px;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .demo-credentials {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }

        .demo-credentials code {
          background: #F3F4F6;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          color: #1F2937;
          font-family: monospace;
        }

        .demo-button {
          width: 100%;
          padding: 10px;
          background: transparent;
          border: 1.5px solid #2E9142;
          border-radius: 8px;
          color: #2E9142;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .demo-button:hover {
          background: rgba(46,145,66,0.05);
          border-color: #1A5C2A;
        }

        .back-link {
          text-align: center;
          margin-top: 24px;
        }

        .back-link a {
          font-size: 13px;
          color: #6B7280;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .back-link a:hover {
          color: #2E9142;
        }

        /* Responsive Design */
        @media (max-width: 968px) {
          .admin-login-container {
            flex-direction: column;
          }

          .login-left-panel {
            display: none;
          }

          .login-right-panel {
            padding: 32px 24px;
          }

          .login-form-container {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;