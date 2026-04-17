import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, Users, Shield, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const roles = [
    { id: 'student', label: 'Student', icon: GraduationCap, color: '#059669', bgColor: 'rgba(5,150,105,0.1)' },
    { id: 'parent', label: 'Parent', icon: Users, color: '#0d9488', bgColor: 'rgba(13,148,136,0.1)' },
    { id: 'warden', label: 'Warden', icon: Shield, color: '#d97706', bgColor: 'rgba(217,119,6,0.1)' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Login attempt:', { email: formData.email, password: formData.password });
      
      const result = await login({
        email: formData.email,
        password: formData.password,
        role: selectedRole
      });
      
      console.log('Login result:', result);
      
      if (result && result.success) {
        toast.success(`Welcome back, ${result.user.name || 'User'}!`);
        
        switch(result.user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'parent':
            navigate('/parent/dashboard');
            break;
          case 'warden':
            console.log('✅ Redirecting to /warden/dashboard');
            navigate('/warden/dashboard');
            break;
          default:
            navigate('/login');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const getDashboardPreview = () => {
    switch(selectedRole) {
      case 'student':
        return 'View attendance, fees, complaints & room details';
      case 'parent':
        return 'Monitor child\'s progress, fees & complaints';
      case 'warden':
        return 'Manage hostel, rooms, attendance & complaints';
      default:
        return '';
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="login-container">
        <div className="login-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-chip">🏠</span>
              <span className="hero-badge-txt">Welcome to ILHAM</span>
            </div>
            <h1 className="hero-title">Smart Campus<br/><span className="grad">Management</span></h1>
            <p className="hero-subtitle">Streamline operations, enhance security, and improve communication</p>
            
            <div className="hero-features">
              <div className="hero-feature">
                <span className="feature-icon">🏢</span>
                <div className="feature-text">
                  <h3>Multi-Hostel Support</h3>
                  <p>Manage multiple hostels seamlessly</p>
                </div>
              </div>
              <div className="hero-feature">
                <span className="feature-icon">👥</span>
                <div className="feature-text">
                  <h3>3 Role Access</h3>
                  <p>Students, Parents & Wardens</p>
                </div>
              </div>
              <div className="hero-feature">
                <span className="feature-icon">⚡</span>
                <div className="feature-text">
                  <h3>Real-time Updates</h3>
                  <p>Instant notifications & tracking</p>
                </div>
              </div>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">500+</span>
                <span className="stat-label">Institutions</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">50K+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <div className="form-card">
            <div className="form-header">
              <h2>Welcome Back!</h2>
              <p>Please select your role and login</p>
            </div>

            <div className="role-selector">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className={`role-btn ${selectedRole === role.id ? 'active' : ''}`}
                  onClick={() => setSelectedRole(role.id)}
                  style={{
                    backgroundColor: selectedRole === role.id ? role.color : 'transparent',
                    borderColor: role.color,
                    color: selectedRole === role.id ? '#fff' : role.color
                  }}
                >
                  <role.icon 
                    size={24} 
                    color={selectedRole === role.id ? '#fff' : role.color} 
                  />
                  <span>{role.label}</span>
                </button>
              ))}
            </div>

            <div className="role-preview" style={{ backgroundColor: roles.find(r => r.id === selectedRole)?.bgColor }}>
              <p>{getDashboardPreview()}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
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
                className="login-btn"
                disabled={loading}
                style={{ background: `linear-gradient(135deg, ${roles.find(r => r.id === selectedRole)?.color}, ${selectedRole === 'student' ? '#0d9488' : selectedRole === 'parent' ? '#059669' : '#f59e0b'})` }}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* <div className="register-prompt">
                <p>Don't have an account? <Link to="/register">Create Account</Link></p>
              </div> */}

              <div className="admin-redirect">
                <Link to="/admin/login" className="admin-link">
                  <Shield size={16} />
                  Admin Login
                </Link>
              </div>
            </form>

            {/* Demo Credentials - UPDATED with actual working credentials */}
            {/* <div className="demo-credentials">
              <p className="demo-title">Demo Credentials:</p>
              <div className="demo-grid">
                <div className="demo-item">
                  <span className="demo-role">Student:</span>
                  <code>student@example.com / student123</code>
                </div>
                <div className="demo-item">
                  <span className="demo-role">Parent:</span>
                  <code>parent@example.com / parent123</code>
                </div>
                <div className="demo-item">
                  <span className="demo-role">Warden:</span>
                  <code>fathima@gmail.com / fathima123</code>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=Nunito:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --bg:        #f7faf8;
          --bg-2:      #edf5f0;
          --bg-3:      #ffffff;
          --bg-4:      #e2ede6;
          --ink:       #0f1f14;
          --ink-2:     #1a3322;
          --ink-3:     #284d38;
          --muted:     #6b8f78;
          --muted-2:   #4a7060;
          --border:    rgba(5,150,105,0.12);
          --border-2:  rgba(5,150,105,0.22);
          --white:     #ffffff;
          --off-white: #f0f7f3;
          --emerald:   #059669;
          --emerald-d: #047857;
          --emerald-l: #34d399;
          --teal:      #0d9488;
          --teal-l:    #2dd4bf;
          --amber:     #d97706;
          --amber-l:   #fbbf24;
          --rose:      #e11d48;
          --gv:        linear-gradient(135deg, #059669, #0d9488);
          --ga:        linear-gradient(135deg, #d97706, #f59e0b);
          --ge:        linear-gradient(135deg, #047857, #059669);
          --shadow-card: 0 1px 4px rgba(5,150,105,0.08), 0 8px 24px rgba(5,150,105,0.08);
          --shadow-lg:   0 4px 8px rgba(5,150,105,0.1), 0 20px 40px rgba(5,150,105,0.1);
          --shadow-xl:   0 8px 16px rgba(5,150,105,0.12), 0 40px 80px rgba(5,150,105,0.12);
          --r:    12px;
          --r-lg: 20px;
          --r-xl: 28px;
          --nav-h: 72px;
        }

        .login-wrapper {
          min-height: 100vh;
          background: var(--bg);
          position: relative;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
        }

        .login-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }

        .bg-shape {
          position: absolute;
          background: rgba(5,150,105,0.05);
          border-radius: 50%;
          animation: float 20s infinite;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          right: -100px;
          background: radial-gradient(circle, rgba(5,150,105,0.1) 0%, transparent 70%);
        }

        .shape-2 {
          width: 400px;
          height: 400px;
          bottom: -150px;
          left: -150px;
          animation-delay: -5s;
          background: radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%);
        }

        .shape-3 {
          width: 200px;
          height: 200px;
          top: 50%;
          left: 30%;
          animation-delay: -10s;
          background: radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 70%);
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, 20px) rotate(5deg); }
          50% { transform: translate(-20px, 10px) rotate(-5deg); }
          75% { transform: translate(-10px, -20px) rotate(3deg); }
        }

        .login-container {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          backdrop-filter: blur(10px);
        }

        .login-hero {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: linear-gradient(160deg, #f7faf8 0%, #edf5f0 50%, #e2ede6 100%);
        }

        .hero-content {
          max-width: 500px;
          color: var(--ink);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px 6px 8px;
          border-radius: 100px;
          border: 1.5px solid rgba(5,150,105,0.25);
          background: rgba(5,150,105,0.07);
          margin-bottom: 28px;
        }

        .hero-badge-chip {
          background: var(--gv);
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 100px;
        }

        .hero-badge-txt {
          font-size: 13px;
          color: var(--emerald-d);
          font-weight: 700;
        }

        .hero-title {
          font-size: clamp(40px, 4.5vw, 56px);
          font-weight: 900;
          margin-bottom: 22px;
          line-height: 1.1;
          font-family: 'Playfair Display', serif;
        }

        .grad {
          background: var(--gv);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 17px;
          color: var(--muted);
          margin-bottom: 40px;
          max-width: 500px;
          font-weight: 500;
        }

        .hero-features {
          margin-bottom: 40px;
        }

        .hero-feature {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          padding: 15px;
          background: rgba(255,255,255,0.8);
          border: 1px solid var(--border);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .feature-icon {
          font-size: 32px;
        }

        .feature-text h3 {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 5px;
          color: var(--ink);
          font-family: 'Playfair Display', serif;
        }

        .feature-text p {
          font-size: 14px;
          color: var(--muted);
        }

        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          background: rgba(255,255,255,0.8);
          border: 1px solid var(--border);
          border-radius: 12px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: 800;
          color: var(--emerald-d);
          font-family: 'Playfair Display', serif;
        }

        .stat-label {
          font-size: 12px;
          color: var(--muted);
        }

        .stat-divider {
          width: 1px;
          height: 30px;
          background: var(--border);
        }

        .login-form-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: var(--white);
        }

        .form-card {
          width: 100%;
          max-width: 450px;
          background: var(--white);
          border-radius: 30px;
          padding: 40px;
          box-shadow: var(--shadow-lg);
        }

        .form-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .form-header h2 {
          font-size: 28px;
          color: var(--ink);
          margin-bottom: 10px;
          font-family: 'Playfair Display', serif;
        }

        .form-header p {
          color: var(--muted);
          font-size: 14px;
        }

        .role-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 15px;
        }

        .role-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 12px 8px;
          border: 2px solid;
          border-radius: 12px;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s;
        }

        .role-btn span {
          font-size: 14px;
          font-weight: 600;
        }

        .role-btn.active {
          color: white;
        }

        .role-preview {
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 25px;
          font-size: 14px;
          color: var(--ink);
          border: 1px solid var(--border);
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-group label {
          display: block;
          color: var(--ink);
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          color: var(--muted);
        }

        .input-wrapper input {
          width: 100%;
          padding: 15px 15px 15px 45px;
          border: 2px solid var(--border);
          border-radius: 12px;
          font-size: 15px;
          transition: all 0.3s;
          color: var(--ink);
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: var(--emerald);
          box-shadow: 0 0 0 3px rgba(5,150,105,0.1);
        }

        .input-wrapper input::placeholder {
          color: var(--muted-2);
        }

        .password-toggle {
          position: absolute;
          right: 15px;
          background: none;
          border: none;
          color: var(--muted);
          cursor: pointer;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 20px 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--muted-2);
          font-size: 14px;
          cursor: pointer;
        }

        .checkbox-label input {
          width: 16px;
          height: 16px;
          accent-color: var(--emerald);
        }

        .forgot-link {
          color: var(--emerald);
          text-decoration: none;
          font-size: 14px;
        }

        .forgot-link:hover {
          color: var(--emerald-d);
        }

        .login-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(5,150,105,0.3);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .register-prompt {
          text-align: center;
          margin: 20px 0;
        }

        .register-prompt p {
          color: var(--muted-2);
        }

        .register-prompt a {
          color: var(--emerald);
          text-decoration: none;
          font-weight: 600;
        }

        .register-prompt a:hover {
          color: var(--emerald-d);
        }

        .admin-redirect {
          text-align: center;
          padding-top: 15px;
          border-top: 1px solid var(--border);
        }

        .admin-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
        }

        .admin-link:hover {
          color: var(--emerald);
        }

        .demo-credentials {
          margin-top: 25px;
          padding: 20px;
          background: var(--bg-2);
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .demo-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 10px;
        }

        .demo-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .demo-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
        }

        .demo-role {
          min-width: 70px;
          font-weight: 600;
          color: var(--emerald);
        }

        .demo-item code {
          background: var(--white);
          padding: 4px 8px;
          border-radius: 6px;
          color: var(--ink);
          border: 1px solid var(--border);
        }

        @media (max-width: 968px) {
          .login-container {
            flex-direction: column;
          }
          
          .login-hero {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;