import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Bell, ChevronDown, Building2 } from "lucide-react";
import logo from "../assets/Elegant ILHAM logo design.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="nav-container">
          {/* Logo with Image */}
          <Link to="/" className="logo">
            <img 
              src={logo} 
              alt="Ilham Logo" 
              className="logo-image"
            />
          </Link>

          {/* Desktop Menu - Updated with Hostels */}
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/hostels" className="nav-link">
              <Building2 size={16} style={{ marginRight: '4px' }} />
              Hostels
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="nav-actions">
            {!isAuthenticated ? (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">
                  Login In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="user-menu">
                <button className="notification-btn">
                  <Bell size={20} />
                  <span className="notification-badge">3</span>
                </button>

                <div className="profile-dropdown">
                  <button
                    className="profile-btn"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <div className="avatar">
                      <User size={18} />
                    </div>
                   <span className="user-name">{user?.name}</span>  
                    <ChevronDown size={16} className={`chevron ${profileOpen ? "open" : ""}`} />
                  </button>

                  {profileOpen && (
                    <div className="dropdown-menu">
                      <Link to="/dashboard" className="dropdown-item">
                        <User size={16} />
                        Dashboard
                      </Link>
                      <button onClick={logout} className="dropdown-item logout">
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="menu-icon"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu - Updated with Hostels */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/hostels" onClick={() => setMenuOpen(false)}>
            <Building2 size={16} style={{ marginRight: '4px' }} />
            Hostels
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>

          <div className="mobile-divider"></div>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="mobile-btn" onClick={() => setMenuOpen(false)}>
                Login In
              </Link>
              <Link to="/register" className="mobile-btn mobile-btn-primary" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="mobile-btn" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <button onClick={logout} className="mobile-btn mobile-btn-logout">
                Sign Out
              </button>
            </>
          )}
        </div>
      </nav>

      {/* CSS */}
      <style>{`
        :root {
          --primary: #3b82f6;
          --primary-dark: #2563eb;
          --primary-light: #60a5fa;
          --secondary: #8b5cf6;
          --success: #10b981;
          --danger: #ef4444;
          --warning: #f59e0b;
          --dark: #0f172a;
          --dark-2: #1e293b;
          --dark-3: #334155;
          --light: #f8fafc;
          --light-2: #f1f5f9;
          --light-3: #e2e8f0;
          --gray: #64748b;
          --gray-light: #94a3b8;
          
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }

        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid transparent;
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar-scrolled {
          background: rgba(255, 255, 255, 0.98);
          border-bottom-color: var(--light-3);
          box-shadow: var(--shadow-md);
        }

        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.875rem 2rem;
          height:100px
        }

        /* Logo with Image */
        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: transform 0.2s;
        }

        .logo:hover {
          transform: scale(1.02);
        }

        .logo-image {
          height: 120px;
          width: auto;
          max-width: 200px;
          object-fit: contain;
        }

        /* Navigation Links */
        .nav-links {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .nav-link {
          position: relative;
          padding: 0.5rem 1rem;
          text-decoration: none;
          color: var(--dark-2);
          font-weight: 500;
          font-size: 0.95rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-link:hover {
          color: var(--primary);
          background: var(--light-2);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 20px;
          height: 2px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 2px;
          transition: transform 0.2s;
        }

        .nav-link:hover::after {
          transform: translateX(-50%) scaleX(1);
        }

        /* Actions */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .auth-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn {
          padding: 0.5rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-outline {
          background: transparent;
          color: var(--dark-2);
          border: 1px solid var(--light-3);
        }

        .btn-outline:hover {
          background: var(--light-2);
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-1px);
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        /* User Menu */
        .user-menu {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .notification-btn {
          position: relative;
          padding: 0.5rem;
          background: transparent;
          border: none;
          border-radius: 0.5rem;
          color: var(--gray);
          cursor: pointer;
          transition: all 0.2s;
        }

        .notification-btn:hover {
          background: var(--light-2);
          color: var(--primary);
        }

        .notification-badge {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          width: 1.25rem;
          height: 1.25rem;
          background: linear-gradient(135deg, var(--danger), #f87171);
          border: 2px solid white;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
          color: white;
        }

        .profile-dropdown {
          position: relative;
        }

        .profile-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.5rem 0.25rem 0.25rem;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 2rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-btn:hover {
          background: var(--light-2);
          border-color: var(--light-3);
        }

        .avatar {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--dark-2);
        }

        .chevron {
          color: var(--gray);
          transition: transform 0.2s;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          width: 200px;
          background: white;
          border: 1px solid var(--light-3);
          border-radius: 0.75rem;
          box-shadow: var(--shadow-lg);
          padding: 0.5rem;
          z-index: 100;
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: var(--dark-2);
          font-size: 0.9rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
          width: 100%;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background: var(--light-2);
          color: var(--primary);
        }

        .dropdown-item.logout:hover {
          background: #fef2f2;
          color: var(--danger);
        }

        /* Mobile */
        .menu-icon {
          display: none;
          background: transparent;
          border: 1px solid var(--light-3);
          border-radius: 0.5rem;
          padding: 0.5rem;
          cursor: pointer;
          color: var(--dark-2);
          transition: all 0.2s;
        }

        .menu-icon:hover {
          background: var(--light-2);
          color: var(--primary);
        }

        .mobile-menu {
          display: none;
          flex-direction: column;
          padding: 1rem 2rem;
          background: white;
          border-top: 1px solid var(--light-3);
          transform: translateY(-100%);
          opacity: 0;
          transition: all 0.3s;
        }

        .mobile-menu.open {
          transform: translateY(0);
          opacity: 1;
        }

        .mobile-menu a,
        .mobile-menu button {
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: var(--dark-2);
          font-weight: 500;
          border-radius: 0.5rem;
          transition: all 0.2s;
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .mobile-menu a:hover,
        .mobile-menu button:hover {
          background: var(--light-2);
          color: var(--primary);
        }

        .mobile-divider {
          height: 1px;
          background: var(--light-3);
          margin: 0.5rem 0;
        }

        .mobile-btn {
          border: 1px solid var(--light-3) !important;
          text-align: center !important;
          justify-content: center !important;
        }

        .mobile-btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--secondary)) !important;
          color: white !important;
          border: none !important;
        }

        .mobile-btn-primary:hover {
          opacity: 0.9;
          color: white !important;
        }

        .mobile-btn-logout {
          border: 1px solid var(--danger) !important;
          color: var(--danger) !important;
        }

        .mobile-btn-logout:hover {
          background: #fef2f2 !important;
          color: var(--danger) !important;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-container {
            padding: 0.75rem 1rem;
          }

          .nav-links,
          .nav-actions {
            display: none;
          }

          .menu-icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-menu {
            display: flex;
          }

          .logo-image {
            height: 40px;
            max-width: 150px;
          }
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nav-link, .btn, .profile-btn {
          animation: fadeIn 0.5s ease;
        }
      `}</style>
    </>
  );
};

export default Navbar;