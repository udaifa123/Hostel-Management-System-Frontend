import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageSquare,
  Building2,
  Clock,
  CheckCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  Globe,
  Headphones,
  Shield,
  Zap
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: "Phone Support",
      details: ["+1 (555) 123-4567", "+1 (555) 765-4321"],
      action: "Call us anytime",
      color: "#16a34a",
      bgColor: "#f0fdf4"
    },
    {
      icon: <Mail size={24} />,
      title: "Email Address",
      details: ["adminilham@gmail.com", "support@ilham.edu"],
      action: "Email us 24/7",
      color: "#15803d",
      bgColor: "#dcfce7"
    },
    {
      icon: <MapPin size={24} />,
      title: "Main Office",
      details: ["123 Campus Road", "Education City, EC 12345"],
      action: "Visit us",
      color: "#166534",
      bgColor: "#bbf7d0"
    },
    {
      icon: <Clock size={24} />,
      title: "Working Hours",
      details: ["Mon-Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
      action: "24/7 Support available",
      color: "#14532d",
      bgColor: "#f0fdf4"
    }
  ];

  const faqs = [
    {
      question: "How quickly can we implement the system?",
      answer: "Implementation typically takes 2-4 weeks depending on institution size and requirements. Our team works closely with you to ensure a smooth transition."
    },
    {
      question: "Do you provide training for staff?",
      answer: "Yes, we provide comprehensive training sessions for all staff members and administrators, including on-site workshops and online resources."
    },
    {
      question: "Is the system customizable?",
      answer: "Absolutely! We offer extensive customization options to match your specific needs, from branding to feature modifications."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We provide 24/7 technical support via phone, email, and live chat, plus a dedicated account manager for enterprise clients."
    }
  ];

  const stats = [
    { value: "500+", label: "Institutions", icon: <Building2 size={20} /> },
    { value: "24/7", label: "Support", icon: <Headphones size={20} /> },
    { value: "99.9%", label: "Uptime", icon: <Shield size={20} /> },
    { value: "< 2hrs", label: "Response Time", icon: <Zap size={20} /> }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-pattern"></div>
        <div className="hero-glow"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge-wrapper">
              <span className="hero-badge">
                <Globe size={16} />
                Get in Touch
              </span>
            </div>
            <h1 className="hero-title">
              Let's <span className="gradient-text">Transform</span> Your Campus Together
            </h1>
            <p className="hero-subtitle">
              Have questions about our smart campus management system? Our team of experts is ready to help you revolutionize your educational institution.
            </p>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-icon">{stat.icon}</div>
                  <div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="info-cards-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How Can We <span className="gradient-text">Help You?</span></h2>
            <p className="section-subtitle">Choose the best way to reach out to us</p>
          </div>
          <div className="info-cards-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="info-card" style={{ backgroundColor: info.bgColor }}>
                <div className="info-card-inner">
                  <div className="info-icon-wrapper" style={{ backgroundColor: info.color }}>
                    {info.icon}
                  </div>
                  <h3 className="info-title">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="info-detail">{detail}</p>
                  ))}
                  <div className="info-action" style={{ color: info.color }}>
                    {info.action}
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="form-section">
        <div className="container">
          <div className="form-wrapper">
            <div className="form-content">
              <div className="form-header">
                <h2 className="form-title">Send Us a Message</h2>
                <p className="form-subtitle">Fill out the form below and we'll get back to you within 24 hours</p>
              </div>

              {submitted && (
                <div className="success-message">
                  <CheckCircle size={20} />
                  <span>Thank you! Your message has been sent successfully. We'll respond shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="modern-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name"><User size={16} />Full Name</label>
                    <input
                      type="text" id="name" name="name"
                      value={formData.name} onChange={handleChange}
                      placeholder="name"
                      className={errors.name ? "error" : ""}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email"><Mail size={16} />Email Address</label>
                    <input
                      type="email" id="email" name="email"
                      value={formData.email} onChange={handleChange}
                      placeholder="you@gmail.com"
                      className={errors.email ? "error" : ""}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone"><Phone size={16} />Phone Number</label>
                    <input
                      type="tel" id="phone" name="phone"
                      value={formData.phone} onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject"><MessageSquare size={16} />Subject</label>
                    <input
                      type="text" id="subject" name="subject"
                      value={formData.subject} onChange={handleChange}
                      placeholder="How can we help?"
                      className={errors.subject ? "error" : ""}
                    />
                    {errors.subject && <span className="error-message">{errors.subject}</span>}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="message"><MessageSquare size={16} />Message</label>
                  <textarea
                    id="message" name="message"
                    value={formData.message} onChange={handleChange}
                    placeholder="Tell us about your requirements..."
                    rows="5"
                    className={errors.message ? "error" : ""}
                  />
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <><span className="spinner"></span>Sending...</>
                  ) : (
                    <>Send Message<Send size={18} /></>
                  )}
                </button>
              </form>
            </div>

            <div className="map-wrapper">
              <div className="map-content">
                <div className="map-badge">Visit Us</div>
                <h3 className="map-title">Our Campus Location</h3>
                <p className="map-address"><MapPin size={18} />123 Campus Road, Education City, EC 12345</p>
                <div className="map-hours">
                  <Clock size={16} />
                  <span>Open today: 9:00 AM - 6:00 PM</span>
                </div>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="map-button">
                  Get Directions<ArrowRight size={16} />
                </a>
                <div className="map-preview">
                  <div className="map-placeholder">
                    <Building2 size={48} />
                    <p>Interactive Map</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Frequently Asked <span className="gradient-text">Questions</span></h2>
            <p className="section-subtitle">Everything you need to know about our campus management system</p>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-card">
                <div className="faq-icon">?</div>
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="faq-cta">
            <p>Still have questions? We're here to help!</p>
            <Link to="/faq" className="faq-link">
              View all FAQs<ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Social Section */}
      <section className="social-section">
        <div className="container">
          <div className="social-content">
            <h2 className="social-title">Connect With Us</h2>
            <p className="social-text">Follow us on social media for the latest updates, news, and insights</p>
            <div className="social-grid">
              <a href="#" className="social-card facebook">
                <Facebook size={28} /><span>Facebook</span>
              </a>
              <a href="#" className="social-card twitter">
                <Twitter size={28} /><span>Twitter</span>
              </a>
              <a href="#" className="social-card linkedin">
                <Linkedin size={28} /><span>LinkedIn</span>
              </a>
              <a href="#" className="social-card instagram">
                <Instagram size={28} /><span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .contact-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          overflow-x: hidden;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .gradient-text {
          background: linear-gradient(135deg, #16a34a, #4ade80);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── HERO ── */
        .contact-hero {
          min-height: 80vh;
          display: flex;
          align-items: center;
          position: relative;
          background: linear-gradient(160deg, #052e16 0%, #14532d 40%, #166534 100%);
          overflow: hidden;
          padding: 6rem 2rem;
        }

        .hero-pattern {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 15% 25%, rgba(74, 222, 128, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 85% 75%, rgba(22, 163, 74, 0.15) 0%, transparent 45%);
        }

        .hero-glow {
          position: absolute;
          top: -30%;
          right: -10%;
          width: 70%;
          height: 160%;
          background: radial-gradient(circle, rgba(74, 222, 128, 0.08) 0%, transparent 70%);
          border-radius: 50%;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .hero-badge-wrapper { display: inline-block; margin-bottom: 2rem; }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.25);
          border-radius: 100px;
          color: #86efac;
          font-size: 0.95rem;
          font-weight: 500;
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          color: white;
          margin-bottom: 1.5rem;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: #bbf7d0;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto 3rem;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(74, 222, 128, 0.15);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .stat-item { display: flex; align-items: center; gap: 1rem; }

        .stat-icon {
          width: 40px;
          height: 40px;
          background: rgba(74, 222, 128, 0.15);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4ade80;
        }

        .stat-value { font-size: 1.5rem; font-weight: 700; color: white; line-height: 1.2; }
        .stat-label { font-size: 0.875rem; color: #86efac; }

        /* ── INFO CARDS ── */
        .info-cards-section {
          padding: 6rem 0;
          background: white;
        }

        .section-header { text-align: left; margin-bottom: 3rem; }
        .section-header.centered { text-align: center; }

        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #052e16;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .section-subtitle { font-size: 1.1rem; color: #64748b; max-width: 600px; }

        .info-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .info-card {
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(22, 163, 74, 0.1);
        }

        .info-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(22, 163, 74, 0.15);
          border-color: rgba(22, 163, 74, 0.3);
        }

        .info-card-inner { padding: 2rem; }

        .info-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: white;
        }

        .info-title { font-size: 1.25rem; font-weight: 600; color: #052e16; margin-bottom: 1rem; }
        .info-detail { font-size: 0.95rem; color: #64748b; margin-bottom: 0.25rem; }

        .info-action {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: default;
        }

        /* ── FORM SECTION ── */
        .form-section {
          padding: 4rem 0;
          background: #f0fdf4;
        }

        .form-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          background: white;
          border-radius: 32px;
          box-shadow: 0 25px 50px -12px rgba(22, 163, 74, 0.15);
          overflow: hidden;
          border: 1px solid rgba(22, 163, 74, 0.1);
        }

        .form-content { padding: 3rem; }

        .form-header { margin-bottom: 2rem; }

        .form-title { font-size: 2rem; font-weight: 700; color: #052e16; margin-bottom: 0.5rem; }
        .form-subtitle { font-size: 1rem; color: #64748b; }

        .success-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #dcfce7;
          border: 1px solid #86efac;
          border-radius: 12px;
          color: #166534;
          margin-bottom: 2rem;
        }

        .modern-form { display: flex; flex-direction: column; gap: 1.5rem; }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group.full-width { grid-column: 1 / -1; }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: #166534;
        }

        .form-group input,
        .form-group textarea {
          padding: 0.875rem 1rem;
          border: 2px solid #dcfce7;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s;
          background: #f9fefb;
          color: #052e16;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #94a3b8;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #16a34a;
          box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.1);
          background: white;
        }

        .form-group input.error,
        .form-group textarea.error {
          border-color: #ef4444;
          background: #fff5f5;
        }

        .error-message { font-size: 0.85rem; color: #ef4444; }

        .submit-btn {
          padding: 1rem;
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 1rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(22, 163, 74, 0.4);
          background: linear-gradient(135deg, #15803d, #14532d);
        }

        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── MAP WRAPPER ── */
        .map-wrapper {
          background: linear-gradient(160deg, #052e16 0%, #14532d 60%, #166534 100%);
          padding: 3rem;
          display: flex;
          align-items: center;
        }

        .map-content { width: 100%; }

        .map-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(74, 222, 128, 0.15);
          color: #4ade80;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(74, 222, 128, 0.2);
        }

        .map-title { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 1rem; }

        .map-address {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #bbf7d0;
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .map-hours {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #86efac;
          font-size: 0.95rem;
          margin-bottom: 2rem;
          padding: 0.75rem 1rem;
          background: rgba(74, 222, 128, 0.08);
          border-radius: 8px;
          border: 1px solid rgba(74, 222, 128, 0.15);
        }

        .map-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s;
          margin-bottom: 2rem;
        }

        .map-button:hover {
          transform: translateX(5px);
          box-shadow: 0 10px 20px rgba(22, 163, 74, 0.4);
        }

        .map-preview {
          background: rgba(74, 222, 128, 0.05);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(74, 222, 128, 0.15);
        }

        .map-placeholder {
          text-align: center;
          color: #86efac;
        }

        .map-placeholder svg {
          color: #4ade80;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        /* ── FAQ SECTION ── */
        .faq-section {
          padding: 6rem 0;
          background: white;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin: 3rem 0;
        }

        .faq-card {
          position: relative;
          padding: 2rem;
          background: #f0fdf4;
          border-radius: 20px;
          transition: all 0.3s;
          border: 1px solid transparent;
        }

        .faq-card:hover {
          border-color: #16a34a;
          background: white;
          box-shadow: 0 20px 40px rgba(22, 163, 74, 0.1);
        }

        .faq-icon {
          position: absolute;
          top: 2rem;
          right: 2rem;
          width: 32px;
          height: 32px;
          background: #dcfce7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #16a34a;
        }

        .faq-question {
          font-size: 1.1rem;
          font-weight: 600;
          color: #052e16;
          margin-bottom: 1rem;
          padding-right: 3rem;
        }

        .faq-answer { font-size: 0.95rem; color: #64748b; line-height: 1.6; }

        .faq-cta { text-align: center; }
        .faq-cta p { color: #64748b; margin-bottom: 1rem; }

        .faq-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #16a34a;
          text-decoration: none;
          font-weight: 500;
          transition: gap 0.3s;
        }

        .faq-link:hover { gap: 0.75rem; }

        /* ── SOCIAL SECTION ── */
        .social-section {
          padding: 4rem 0;
          background: #f0fdf4;
        }

        .social-content { text-align: center; }

        .social-title { font-size: 2rem; font-weight: 700; color: #052e16; margin-bottom: 1rem; }
        .social-text { font-size: 1.1rem; color: #64748b; margin-bottom: 3rem; }

        .social-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .social-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 2rem 1rem;
          background: white;
          border-radius: 16px;
          text-decoration: none;
          color: #052e16;
          transition: all 0.3s;
          border: 1px solid #dcfce7;
        }

        .social-card:hover { transform: translateY(-5px); box-shadow: 0 20px 30px rgba(22, 163, 74, 0.1); }
        .social-card.facebook:hover { background: #1877f2; color: white; border-color: #1877f2; }
        .social-card.twitter:hover { background: #1da1f2; color: white; border-color: #1da1f2; }
        .social-card.linkedin:hover { background: #0a66c2; color: white; border-color: #0a66c2; }
        .social-card.instagram:hover { background: #e4405f; color: white; border-color: #e4405f; }
        .social-card span { font-size: 0.9rem; font-weight: 500; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .info-cards-grid { grid-template-columns: repeat(2, 1fr); }
          .form-wrapper { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .hero-stats { flex-direction: column; gap: 1.5rem; }
          .info-cards-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .faq-grid { grid-template-columns: 1fr; }
          .social-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default Contact;