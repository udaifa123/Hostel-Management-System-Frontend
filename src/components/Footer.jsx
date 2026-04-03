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
  Heart
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/features" },
    { label: "How It Works", path: "/how-it-works" },
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
    { icon: <Facebook size={18} />, url: "https://facebook.com", label: "Facebook" },
    { icon: <Twitter size={18} />, url: "https://twitter.com", label: "Twitter" },
    { icon: <Linkedin size={18} />, url: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Instagram size={18} />, url: "https://instagram.com", label: "Instagram" },
  ];

  const contactInfo = [
    { icon: <MapPin size={18} />, text: "123 Campus Road, Education City, EC 12345" },
    { icon: <Phone size={18} />, text: "+1 (555) 123-4567" },
    { icon: <Mail size={18} />, text: "ilham@gmail.com" },
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
            <h3>Join our community</h3>
            <p>Get the latest updates on campus management tools and features.</p>
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
              <div className="logo-box">
                <Building2 size={28} color="#fff" />
              </div>
              <span className="logo-text">
                Ilh<span>am</span>
              </span>
            </div>
            <p className="brand-desc">
              Simplifying campus life with intelligent dormitory and data management solutions. 
              Built for the next generation of educational institutions.
            </p>
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
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-legal">
          <p>
            © {currentYear} Ilham System. Made with <Heart size={14} className="heart-beat" /> for Campus Excellence.
          </p>
          <div className="legal-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background-color: #0f172a;
          color: #f8fafc;
          padding-top: 4rem;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          position: relative;
          overflow: hidden;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem 2rem;
        }

        /* --- Newsletter Card --- */
        .newsletter-card {
          background: linear-gradient(135deg, #046f21ff 0%, #046f21ff 100%);
          border-radius: 24px;
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
          transform: translateY(-20px);
        }

        .newsletter-content h3 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
        .newsletter-content p { color: #e2e8f0; opacity: 0.9; }

        .newsletter-form { display: flex; gap: 0.75rem; width: 100%; max-width: 450px; }
        .newsletter-form input {
          flex: 1;
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.1);
          color: white;
          outline: none;
        }
        .newsletter-form input::placeholder { color: #cbd5e1; }
        .newsletter-form button {
          padding: 0.875rem 1.5rem;
          background: #fff;
          color: #068528ff;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
        }
        .newsletter-form button:hover { background: #f1f5f9; transform: scale(1.02); }

        /* --- Grid --- */
        .footer-main-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 4rem;
          padding-bottom: 4rem;
        }

        /* --- Brand Section --- */
        .brand-logo { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
        .logo-box { 
          background: #046f21ff; 
          padding: 0.5rem; 
          border-radius: 10px; 
          display: flex; 
          align-items: center; 
        }
        .logo-text { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.5px; }
        .logo-text span { color: #046f21ff; }
        .brand-desc { color: #94a3b8; line-height: 1.6; font-size: 0.95rem; margin-bottom: 2rem; }

        .social-group { display: flex; gap: 1rem; }
        .social-group a {
          width: 38px; height: 38px;
          background: #1e293b;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; color: #94a3b8; transition: 0.3s;
        }
        .social-group a:hover { background: #3b82f6; color: white; transform: translateY(-3px); }

        /* --- Nav & Contact --- */
        h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem; color: #f1f5f9; }
        ul { list-style: none; padding: 0; }
        li { margin-bottom: 0.75rem; }
        .footer-nav a {
          color: #94a3b8; text-decoration: none; 
          display: flex; align-items: center; gap: 0.5rem;
          transition: 0.3s; font-size: 0.95rem;
        }
        .footer-nav a:hover { color: #3b82f6; padding-left: 5px; }

        .contact-list { display: flex; flex-direction: column; gap: 1rem; }
        .contact-row { display: flex; gap: 0.75rem; color: #94a3b8; font-size: 0.9rem; }
        .contact-icon { color: #3b82f6; }

        /* --- Bottom Bar --- */
        .footer-legal {
          border-top: 1px solid #1e293b;
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #64748b;
          font-size: 0.875rem;
        }
        .legal-links { display: flex; gap: 1.5rem; }
        .legal-links a { color: #64748b; text-decoration: none; }
        .legal-links a:hover { color: #3b82f6; }

        .heart-beat { color: #ef4444; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }

        /* --- Responsive --- */
        @media (max-width: 992px) {
          .newsletter-card { flex-direction: column; text-align: center; gap: 2rem; }
          .footer-main-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
        @media (max-width: 600px) {
          .footer-main-grid { grid-template-columns: 1fr; }
          .footer-legal { flex-direction: column; gap: 1rem; text-align: center; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;