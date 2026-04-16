import React from "react";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  ChevronRight,
  Heart,
  GraduationCap,
  School,
  BookOpen,
  Users,
  Award,
  Globe
} from "lucide-react";
import logo from "../assets/ilhamlogo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Hostels", path: "/hostels" },
    { label: "Contact", path: "/contact" },
  ];

  const resources = [
    { label: "Blog", path: "/blog" },
    { label: "Help Center", path: "/help" },
    { label: "FAQs", path: "/faqs" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
  ];

  const socialLinks = [
    { icon: <Facebook size={18} />, url: "https://facebook.com", label: "Facebook", color: "#1877f2" },
    { icon: <Twitter size={18} />, url: "https://twitter.com", label: "Twitter", color: "#1da1f2" },
    { icon: <Linkedin size={18} />, url: "https://linkedin.com", label: "LinkedIn", color: "#0a66c2" },
    { icon: <Instagram size={18} />, url: "https://instagram.com", label: "Instagram", color: "#e4405f" },
  ];

  const contactInfo = [
    { icon: <MapPin size={18} />, text: "123 Campus Road, Education City, EC 12345" },
    { icon: <Phone size={18} />, text: "+1 (555) 123-4567" },
    { icon: <Mail size={18} />, text: "hello@ilham.com" },
  ];

  const achievements = [
    { icon: <Award size={16} />, text: "Best Campus Solution 2024" },
    { icon: <Users size={16} />, text: "50,000+ Active Users" },
    { icon: <Globe size={16} />, text: "500+ Institutions" },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to our updates!");
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        {/* Newsletter Banner - Positioned Top */}
        <div className="newsletter-card">
          <div className="newsletter-content">
            <div className="newsletter-badge">✨ Exclusive Updates</div>
            <h3>Join Our Community</h3>
            <p>Get the latest updates on campus management tools and features delivered straight to your inbox.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Your professional email"
              required
            />
            <button type="submit">Subscribe Now</button>
          </form>
        </div>

        <div className="footer-main-grid">
          {/* Brand Identity */}
          <div className="footer-brand">
            <div className="brand-logo">
              <img src={logo} alt="Ilham Logo" className="brand-logo-img" />
              {/* <div className="logo-text">
                Ilh<span>am</span>
              </div> */}
            </div>
            <p className="brand-desc">
              Simplifying campus life with intelligent dormitory and data management solutions. 
              Built for the next generation of educational institutions.
            </p>
            
            <div className="brand-stats">
              {achievements.map((item, i) => (
                <div key={i} className="stat-item">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="social-group">
              {socialLinks.map((social, i) => (
                <a key={i} href={social.url} aria-label={social.label} target="_blank" rel="noreferrer">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer-nav">
            <h4>Quick Navigation</h4>
            <ul>
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path}><ChevronRight size={14} /> {link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-nav">
            <h4>Support & Legal</h4>
            <ul>
              {resources.map((res, i) => (
                <li key={i}>
                  <Link to={res.path}><ChevronRight size={14} /> {res.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="footer-contact">
            <h4>Get In Touch</h4>
            <div className="contact-list">
              {contactInfo.map((item, i) => (
                <div key={i} className="contact-row">
                  <span className="contact-icon">{item.icon}</span>
                  <span className="contact-text">{item.text}</span>
                </div>
              ))}
            </div>
            
            <div className="support-hours">
              <h5>Support Hours</h5>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-legal">
          <p>
            © {currentYear} Ilham System. Made with <Heart size={14} className="heart-beat" /> for Campus Excellence.
          </p>
          <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Settings</Link>
            <Link to="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background: linear-gradient(180deg, #0a0f1a 0%, #0f172a 100%);
          color: #f8fafc;
          padding-top: 4rem;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Animated background pattern */
        .footer-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle at 20% 80%, rgba(4, 111, 33, 0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem 2rem;
          position: relative;
          z-index: 2;
        }

        /* --- Newsletter Card --- */
        .newsletter-card {
          background: linear-gradient(135deg, #046f21 0%, #068528 50%, #0a9a35 100%);
          border-radius: 24px;
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5rem;
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.3);
          transform: translateY(-20px);
          position: relative;
          overflow: hidden;
        }

        .newsletter-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          opacity: 0.5;
        }

        .newsletter-badge {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
          backdrop-filter: blur(4px);
        }

        .newsletter-content h3 { 
          font-size: 1.75rem; 
          font-weight: 700; 
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
        }
        .newsletter-content p { 
          color: #e2e8f0; 
          opacity: 0.9;
          max-width: 400px;
        }

        .newsletter-form { 
          display: flex; 
          gap: 0.75rem; 
          width: 100%; 
          max-width: 450px;
        }
        .newsletter-form input {
          flex: 1;
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.1);
          color: white;
          outline: none;
          font-size: 0.9rem;
          transition: all 0.3s;
        }
        .newsletter-form input:focus {
          border-color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.15);
        }
        .newsletter-form input::placeholder { color: #cbd5e1; }
        .newsletter-form button {
          padding: 0.875rem 1.5rem;
          background: #fff;
          color: #046f21;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9rem;
        }
        .newsletter-form button:hover { 
          background: #f1f5f9; 
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        /* --- Grid --- */
        .footer-main-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 4rem;
          padding-bottom: 4rem;
        }

        /* --- Brand Section --- */
        .brand-logo { 
          display: flex; 
          align-items: center; 
          gap: 0; 
          margin-bottom: 1.5rem;
        }

        .brand-logo-img {
          width: 260px;
          height: 260px;
          object-fit: contain;
          border-radius: 12px;
          transition: transform 0.3s ease;
          margin-right: 0;
        }

        .brand-logo-img:hover {
          transform: scale(1.05);
        }

        .logo-text { 
          font-size: 1.5rem; 
          font-weight: 800; 
          letter-spacing: -1px;
          background: linear-gradient(135deg, #fff 0%, #e2e8f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-left: 0;
        }
        .logo-text span { 
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .brand-desc { 
          color: #94a3b8; 
          line-height: 1.6; 
          font-size: 0.95rem; 
          margin-bottom: 1.5rem;
        }

        .brand-stats {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding: 1rem 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
          color: #cbd5e1;
        }

        .stat-item svg {
          color: #10b981;
        }

        .social-group { 
          display: flex; 
          gap: 0.75rem; 
        }
        .social-group a {
          width: 38px; 
          height: 38px;
          background: rgba(255,255,255,0.05);
          display: flex; 
          align-items: center; 
          justify-content: center;
          border-radius: 50%; 
          color: #94a3b8; 
          transition: all 0.3s;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .social-group a:hover { 
          background: #046f21; 
          color: white; 
          transform: translateY(-3px);
          border-color: #046f21;
        }

        /* --- Nav & Contact --- */
        h4 { 
          font-size: 1.1rem; 
          font-weight: 700; 
          margin-bottom: 1.5rem; 
          color: #f1f5f9;
          position: relative;
          display: inline-block;
        }
        h4::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, #10b981, transparent);
          border-radius: 2px;
        }
        ul { list-style: none; padding: 0; }
        li { margin-bottom: 0.75rem; }
        .footer-nav a {
          color: #94a3b8; 
          text-decoration: none; 
          display: flex; 
          align-items: center; 
          gap: 0.5rem;
          transition: all 0.3s; 
          font-size: 0.9rem;
        }
        .footer-nav a:hover { 
          color: #10b981; 
          padding-left: 5px;
        }

        .contact-list { 
          display: flex; 
          flex-direction: column; 
          gap: 1rem; 
          margin-bottom: 1.5rem;
        }
        .contact-row { 
          display: flex; 
          gap: 0.75rem; 
          color: #94a3b8; 
          font-size: 0.9rem;
          align-items: center;
        }
        .contact-icon { 
          color: #10b981;
          flex-shrink: 0;
        }

        .support-hours {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .support-hours h5 {
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #e2e8f0;
        }

        .support-hours p {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-bottom: 0.25rem;
        }

        /* --- Bottom Bar --- */
        .footer-legal {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #64748b;
          font-size: 0.875rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .legal-links { 
          display: flex; 
          gap: 1.5rem; 
          flex-wrap: wrap;
        }
        .legal-links a { 
          color: #64748b; 
          text-decoration: none;
          transition: color 0.3s;
        }
        .legal-links a:hover { color: #10b981; }

        .heart-beat { 
          color: #ef4444; 
          animation: pulse 1.5s ease infinite;
          display: inline-block;
          vertical-align: middle;
        }
        @keyframes pulse { 
          0%, 100% { transform: scale(1); } 
          50% { transform: scale(1.2); } 
        }

        /* --- Responsive --- */
        @media (max-width: 1024px) {
          .footer-main-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .newsletter-card { flex-direction: column; text-align: center; gap: 2rem; }
          .newsletter-content p { max-width: 100%; }
          .newsletter-form { width: 100%; }
        }
        @media (max-width: 768px) {
          .footer-main-grid { grid-template-columns: 1fr; }
          .footer-legal { flex-direction: column; text-align: center; }
          .legal-links { justify-content: center; }
          .newsletter-card { padding: 2rem; }
          .brand-logo { justify-content: center; }
          .brand-desc { text-align: center; }
          .brand-stats { align-items: center; }
          .social-group { justify-content: center; }
          h4::after { left: 50%; transform: translateX(-50%); width: 60px; }
          .footer-nav h4, .footer-contact h4 { text-align: center; display: block; }
          .footer-nav ul { text-align: center; }
          .footer-nav a { justify-content: center; }
          .contact-row { justify-content: center; }
          .support-hours { text-align: center; }
        }
        @media (max-width: 480px) {
          .newsletter-form { flex-direction: column; }
          .newsletter-form button { width: 100%; }
          .brand-logo-img { width: 40px; height: 40px; }
          .logo-text { font-size: 1.2rem; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;