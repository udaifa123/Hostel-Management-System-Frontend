import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Mail, Phone, MapPin, Send, User, MessageSquare, Building2,
  Clock, CheckCircle, Facebook, Twitter, Linkedin, Instagram,
  ArrowRight, Globe, Headphones, Shield, Zap, ChevronDown,
  AlertCircle, Copy, Check
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", subject: "", message: "", inquiry: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [copied, setCopied] = useState("");
  const formRef = useRef(null);

  const MAX_MSG = 500;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > MAX_MSG) return;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "name" && !value.trim()) error = "Full name is required";
    if (name === "email") {
      if (!value.trim()) error = "Email address is required";
      else if (!/\S+@\S+\.\S+/.test(value)) error = "Please enter a valid email";
    }
    if (name === "subject" && !value.trim()) error = "Subject is required";
    if (name === "message" && !value.trim()) error = "Message is required";
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    const fields = ["name", "email", "subject", "message"];
    const newErrors = {};
    const newTouched = {};
    let valid = true;
    fields.forEach(f => {
      newTouched[f] = true;
      const value = formData[f];
      let error = "";
      if (f === "name" && !value.trim()) error = "Full name is required";
      if (f === "email") {
        if (!value.trim()) error = "Email address is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Please enter a valid email";
      }
      if (f === "subject" && !value.trim()) error = "Subject is required";
      if (f === "message" && !value.trim()) error = "Message is required";
      if (error) { newErrors[f] = error; valid = false; }
    });
    setErrors(newErrors);
    setTouched(newTouched);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1800));
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "", inquiry: "" });
      setTouched({});
      setErrors({});
      setTimeout(() => setSubmitted(false), 6000);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const contactInfo = [
    {
      icon: <Phone size={22} />,
      title: "Phone Support",
      details: ["+1 (555) 123-4567", "+1 (555) 765-4321"],
      copyKey: "phone",
      copyValue: "+1 (555) 123-4567",
      action: "Call us anytime",
      color: "#16a34a", bgColor: "#f0fdf4"
    },
    {
      icon: <Mail size={22} />,
      title: "Email Address",
      details: ["adminilham@gmail.com", "support@ilham.edu"],
      copyKey: "email",
      copyValue: "adminilham@gmail.com",
      action: "Email us 24/7",
      color: "#15803d", bgColor: "#dcfce7"
    },
    {
      icon: <MapPin size={22} />,
      title: "Main Office",
      details: ["123 Campus Road", "Education City, EC 12345"],
      copyKey: "address",
      copyValue: "123 Campus Road, Education City, EC 12345",
      action: "Visit us",
      color: "#166534", bgColor: "#bbf7d0"
    },
    {
      icon: <Clock size={22} />,
      title: "Working Hours",
      details: ["Mon–Fri: 9:00 AM – 6:00 PM", "Sat: 10:00 AM – 4:00 PM"],
      action: "24/7 Support available",
      color: "#14532d", bgColor: "#f0fdf4"
    }
  ];

  const faqs = [
    {
      question: "How quickly can we implement the system?",
      answer: "Implementation typically takes 2–4 weeks depending on institution size and requirements. Our team works closely with you to ensure a smooth transition with minimal disruption."
    },
    {
      question: "Do you provide training for staff?",
      answer: "Yes, we provide comprehensive training sessions for all staff members and administrators, including on-site workshops, live webinars, and a full library of video tutorials."
    },
    {
      question: "Is the system customizable?",
      answer: "Absolutely! We offer extensive customization options to match your specific needs — from branding and UI themes to feature sets and workflow automation rules."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We provide 24/7 technical support via phone, email, and live chat. Enterprise clients also receive a dedicated account manager and priority escalation queue."
    },
    {
      question: "Is our data secure and GDPR compliant?",
      answer: "Yes. All data is encrypted at rest and in transit. We are fully GDPR, FERPA, and ISO 27001 compliant, with regular third-party security audits conducted annually."
    },
    {
      question: "Can the system integrate with existing tools?",
      answer: "Yes. We offer native integrations with Google Workspace, Microsoft 365, Zoom, Canvas, Moodle, and 50+ other platforms via our REST API and webhook system."
    }
  ];

  const stats = [
    { value: "500+", label: "Institutions", icon: <Building2 size={18} /> },
    { value: "24/7", label: "Support", icon: <Headphones size={18} /> },
    { value: "99.9%", label: "Uptime", icon: <Shield size={18} /> },
    { value: "< 2hrs", label: "Response", icon: <Zap size={18} /> }
  ];

  const inquiryTypes = [
    "General Inquiry", "Product Demo", "Pricing & Plans",
    "Technical Support", "Partnership", "Other"
  ];

  const inputClass = (field) =>
    `fi-input ${touched[field] && errors[field] ? "fi-error" : ""} ${touched[field] && !errors[field] && formData[field] ? "fi-valid" : ""}`;

  return (
    <div className="contact-page">

      {/* ── HERO ── */}
      <section className="contact-hero">
        <div className="hero-pattern" />
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge"><Globe size={14} />Get in Touch</span>
            <h1 className="hero-title">
              Let's <span className="gradient-text">Transform</span> Your Campus Together
            </h1>
            <p className="hero-subtitle">
              Have questions about our smart campus management system? Our experts are ready to help you revolutionize your institution.
            </p>
            <div className="hero-stats">
              {stats.map((s, i) => (
                <div key={i} className="stat-item">
                  <div className="stat-icon">{s.icon}</div>
                  <div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INFO CARDS ── */}
      <section className="info-cards-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How Can We <span className="gradient-text">Help You?</span></h2>
            <p className="section-subtitle">Choose the best way to reach out to us</p>
          </div>
          <div className="info-cards-grid">
            {contactInfo.map((info, i) => (
              <div key={i} className="info-card" style={{ backgroundColor: info.bgColor }}>
                <div className="info-card-inner">
                  <div className="info-icon-wrapper" style={{ backgroundColor: info.color }}>
                    {info.icon}
                  </div>
                  <h3 className="info-title">{info.title}</h3>
                  {info.details.map((d, j) => (
                    <p key={j} className="info-detail">{d}</p>
                  ))}
                  <div className="info-footer">
                    <div className="info-action" style={{ color: info.color }}>
                      {info.action}<ArrowRight size={14} />
                    </div>
                    {info.copyValue && (
                      <button
                        className="copy-btn"
                        style={{ color: info.color }}
                        onClick={() => handleCopy(info.copyValue, info.copyKey)}
                      >
                        {copied === info.copyKey ? <Check size={14} /> : <Copy size={14} />}
                        {copied === info.copyKey ? "Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM + MAP ── */}
      <section className="form-section">
        <div className="container">
          <div className="form-wrapper">

            {/* Form */}
            <div className="form-content" ref={formRef}>
              <div className="form-header">
                <h2 className="form-title">Send Us a Message</h2>
                <p className="form-subtitle">We'll get back to you within 24 hours</p>
              </div>

              {submitted && (
                <div className="success-message">
                  <CheckCircle size={20} />
                  <div>
                    <strong>Message sent successfully!</strong>
                    <p>We'll respond to your inquiry within 24 hours.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="modern-form" noValidate>

                {/* Inquiry type */}
                <div className="form-group full-width">
                  <label className="fi-label">Inquiry Type</label>
                  <div className="inquiry-grid">
                    {inquiryTypes.map(t => (
                      <label key={t} className={`inquiry-chip ${formData.inquiry === t ? "active" : ""}`}>
                        <input
                          type="radio" name="inquiry" value={t}
                          checked={formData.inquiry === t}
                          onChange={handleChange}
                          style={{ display: "none" }}
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="fi-label">
                      <User size={14} />Full Name <span className="req">*</span>
                    </label>
                    <div className="fi-wrapper">
                      <input
                        type="text" id="name" name="name"
                        value={formData.name} onChange={handleChange} onBlur={handleBlur}
                        placeholder="Enter your name"
                        className={inputClass("name")}
                      />
                      {touched.name && errors.name && <AlertCircle size={16} className="fi-icon-err" />}
                      {touched.name && !errors.name && formData.name && <CheckCircle size={16} className="fi-icon-ok" />}
                    </div>
                    {touched.name && errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="fi-label">
                      <Mail size={14} />Email Address <span className="req">*</span>
                    </label>
                    <div className="fi-wrapper">
                      <input
                        type="email" id="email" name="email"
                        value={formData.email} onChange={handleChange} onBlur={handleBlur}
                        placeholder="you@gmail.com"
                        className={inputClass("email")}
                      />
                      {touched.email && errors.email && <AlertCircle size={16} className="fi-icon-err" />}
                      {touched.email && !errors.email && formData.email && <CheckCircle size={16} className="fi-icon-ok" />}
                    </div>
                    {touched.email && errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone" className="fi-label">
                      <Phone size={14} />Phone Number
                    </label>
                    <input
                      type="tel" id="phone" name="phone"
                      value={formData.phone} onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="fi-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject" className="fi-label">
                      <MessageSquare size={14} />Subject <span className="req">*</span>
                    </label>
                    <div className="fi-wrapper">
                      <input
                        type="text" id="subject" name="subject"
                        value={formData.subject} onChange={handleChange} onBlur={handleBlur}
                        placeholder="How can we help?"
                        className={inputClass("subject")}
                      />
                      {touched.subject && errors.subject && <AlertCircle size={16} className="fi-icon-err" />}
                      {touched.subject && !errors.subject && formData.subject && <CheckCircle size={16} className="fi-icon-ok" />}
                    </div>
                    {touched.subject && errors.subject && <span className="error-message">{errors.subject}</span>}
                  </div>
                </div>

                <div className="form-group full-width">
                  <div className="msg-label-row">
                    <label htmlFor="message" className="fi-label">
                      <MessageSquare size={14} />Message <span className="req">*</span>
                    </label>
                    <span className={`char-count ${formData.message.length > MAX_MSG * 0.9 ? "warn" : ""}`}>
                      {formData.message.length}/{MAX_MSG}
                    </span>
                  </div>
                  <div className="fi-wrapper">
                    <textarea
                      id="message" name="message"
                      value={formData.message} onChange={handleChange} onBlur={handleBlur}
                      placeholder="Tell us about your requirements and how we can help..."
                      rows="5"
                      className={inputClass("message")}
                    />
                    <div className="char-bar">
                      <div
                        className="char-bar-fill"
                        style={{ width: `${(formData.message.length / MAX_MSG) * 100}%` }}
                      />
                    </div>
                  </div>
                  {touched.message && errors.message && <span className="error-message">{errors.message}</span>}
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <><span className="spinner" />Sending your message...</>
                  ) : (
                    <>Send Message<Send size={16} /></>
                  )}
                </button>

                <p className="form-note">
                  <Shield size={12} />
                  Your data is encrypted and never shared with third parties.
                </p>
              </form>
            </div>

            {/* Map side */}
            <div className="map-wrapper">
              <div className="map-top">
                <span className="map-badge">Visit Us</span>
                <h3 className="map-title">Our Campus Location</h3>
                <p className="map-address"><MapPin size={16} />123 Campus Road, Education City, EC 12345</p>
                <div className="map-hours">
                  <Clock size={14} />
                  <span>Open today: 9:00 AM – 6:00 PM</span>
                  <span className="open-dot" />
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-button"
                >
                  Get Directions<ArrowRight size={14} />
                </a>
              </div>
              <div className="map-embed">
                <iframe
                  title="Campus Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzA5LjkiVw!5e0!3m2!1sen!2sus!4v1"
                  width="100%"
                  height="240"
                  style={{ border: 0, borderRadius: "12px" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="quick-contacts">
                <a href="tel:+15551234567" className="qc-item">
                  <Phone size={16} />+1 (555) 123-4567
                </a>
                <a href="mailto:adminilham@gmail.com" className="qc-item">
                  <Mail size={16} />adminilham@gmail.com
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Frequently Asked <span className="gradient-text">Questions</span></h2>
            <p className="section-subtitle">Everything you need to know about our campus management system</p>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`}>
                <button className="faq-trigger" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.question}</span>
                  <ChevronDown size={18} className="faq-chevron" />
                </button>
                <div className="faq-body">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="faq-cta">
            <p>Still have questions? We're here to help!</p>
            {/* <Link to="/faq" className="faq-link">View all FAQs<ArrowRight size={14} /></Link> */}
          </div>
        </div>
      </section>

      {/* ── SOCIAL ── */}
      <section className="social-section">
        <div className="container">
          <div className="social-content">
            <h2 className="social-title">Connect With Us</h2>
            <p className="social-text">Follow us for the latest updates, news, and insights</p>
            <div className="social-grid">
              <a href="#" className="social-card facebook"><Facebook size={26} /><span>Facebook</span></a>
              <a href="#" className="social-card twitter"><Twitter size={26} /><span>Twitter</span></a>
              <a href="#" className="social-card linkedin"><Linkedin size={26} /><span>LinkedIn</span></a>
              <a href="#" className="social-card instagram"><Instagram size={26} /><span>Instagram</span></a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        .contact-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow-x: hidden;
          color: #0f172a;
        }

        .container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }

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
          background: linear-gradient(160deg, #052e16 0%, #14532d 45%, #166534 100%);
          overflow: hidden;
          padding: 6rem 2rem;
        }
        .hero-pattern {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 15% 25%, rgba(74,222,128,0.12) 0%, transparent 45%),
            radial-gradient(circle at 85% 75%, rgba(22,163,74,0.15) 0%, transparent 45%);
        }
        .hero-content { max-width: 780px; margin: 0 auto; text-align: center; position: relative; z-index: 2; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0.6rem 1.25rem;
          background: rgba(74,222,128,0.1);
          border: 1px solid rgba(74,222,128,0.25);
          border-radius: 100px; color: #86efac;
          font-size: 0.875rem; font-weight: 500;
          backdrop-filter: blur(10px); margin-bottom: 1.75rem;
        }
        .hero-title {
          font-size: clamp(2.2rem,5vw,3.75rem); font-weight: 800;
          line-height: 1.1; color: white; margin-bottom: 1.25rem;
        }
        .hero-subtitle { font-size: 1.05rem; color: #bbf7d0; line-height: 1.65; max-width: 580px; margin: 0 auto 2.5rem; }
        .hero-stats {
          display: flex; justify-content: center; gap: 2.5rem;
          padding: 1.75rem 2rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(74,222,128,0.15);
          border-radius: 18px; backdrop-filter: blur(10px);
          flex-wrap: wrap;
        }
        .stat-item { display: flex; align-items: center; gap: 0.75rem; }
        .stat-icon {
          width: 38px; height: 38px;
          background: rgba(74,222,128,0.15); border-radius: 10px;
          display: flex; align-items: center; justify-content: center; color: #4ade80;
        }
        .stat-value { font-size: 1.4rem; font-weight: 700; color: white; line-height: 1.2; }
        .stat-label { font-size: 0.8rem; color: #86efac; }

        /* ── INFO CARDS ── */
        .info-cards-section { padding: 5rem 0; background: white; }
        .section-header { text-align: left; margin-bottom: 2.5rem; }
        .section-header.centered { text-align: center; }
        .section-title { font-size: 2.25rem; font-weight: 800; color: #052e16; margin-bottom: 0.75rem; line-height: 1.2; }
        .section-subtitle { font-size: 1rem; color: #64748b; max-width: 560px; }
        .info-cards-grid {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem;
        }
        .info-card {
          border-radius: 20px; overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
          border: 1px solid rgba(22,163,74,0.1);
        }
        .info-card:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(22,163,74,0.14); border-color: rgba(22,163,74,0.3); }
        .info-card-inner { padding: 1.75rem; }
        .info-icon-wrapper {
          width: 50px; height: 50px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.25rem; color: white;
        }
        .info-title { font-size: 1.1rem; font-weight: 600; color: #052e16; margin-bottom: 0.75rem; }
        .info-detail { font-size: 0.9rem; color: #64748b; margin-bottom: 0.2rem; }
        .info-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 1.25rem; }
        .info-action { display: inline-flex; align-items: center; gap: 5px; font-size: 0.875rem; font-weight: 500; }
        .copy-btn {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.8rem; font-weight: 500; background: none; border: none;
          cursor: pointer; padding: 4px 8px;
          border-radius: 6px; background: rgba(22,163,74,0.08);
          transition: background 0.2s;
        }
        .copy-btn:hover { background: rgba(22,163,74,0.15); }

        /* ── FORM SECTION ── */
        .form-section { padding: 4rem 0; background: #f0fdf4; }
        .form-wrapper {
          display: grid; grid-template-columns: 1.1fr 0.9fr;
          background: white; border-radius: 28px;
          box-shadow: 0 20px 48px -12px rgba(22,163,74,0.12);
          overflow: hidden; border: 1px solid rgba(22,163,74,0.1);
        }
        .form-content { padding: 2.5rem; }
        .form-header { margin-bottom: 1.75rem; }
        .form-title { font-size: 1.75rem; font-weight: 700; color: #052e16; margin-bottom: 0.35rem; }
        .form-subtitle { font-size: 0.95rem; color: #64748b; }
        .success-message {
          display: flex; align-items: flex-start; gap: 1rem;
          padding: 1rem 1.25rem;
          background: #dcfce7; border: 1px solid #86efac;
          border-radius: 12px; color: #166534;
          margin-bottom: 1.75rem;
        }
        .success-message strong { display: block; font-weight: 600; margin-bottom: 0.2rem; }
        .success-message p { font-size: 0.875rem; color: #15803d; margin: 0; }
        .modern-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group.full-width {}
        .fi-label {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.85rem; font-weight: 500; color: #166534;
        }
        .req { color: #ef4444; }

        /* Inquiry chips */
        .inquiry-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.25rem; }
        .inquiry-chip {
          padding: 0.4rem 1rem; border-radius: 100px; font-size: 0.82rem;
          border: 1.5px solid #dcfce7; background: #f9fefb; color: #166534;
          cursor: pointer; transition: all 0.2s; user-select: none;
        }
        .inquiry-chip:hover { border-color: #16a34a; background: #f0fdf4; }
        .inquiry-chip.active { background: #16a34a; border-color: #16a34a; color: white; }

        /* Inputs */
        .fi-wrapper { position: relative; }
        .fi-input {
          width: 100%; padding: 0.8rem 2.5rem 0.8rem 0.9rem;
          border: 1.5px solid #dcfce7; border-radius: 10px;
          font-size: 0.9rem; background: #f9fefb; color: #052e16;
          transition: border-color 0.25s, box-shadow 0.25s;
          outline: none;
        }
        .fi-input::placeholder { color: #94a3b8; }
        .fi-input:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.12); background: white; }
        .fi-input.fi-error { border-color: #ef4444; background: #fff5f5; }
        .fi-input.fi-error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
        .fi-input.fi-valid { border-color: #16a34a; }
        .fi-icon-err { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #ef4444; pointer-events: none; }
        .fi-icon-ok { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #16a34a; pointer-events: none; }
        textarea.fi-input { resize: vertical; padding-right: 0.9rem; }
        .error-message { font-size: 0.8rem; color: #ef4444; display: flex; align-items: center; gap: 4px; }

        /* Message counter + progress bar */
        .msg-label-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem; }
        .char-count { font-size: 0.78rem; color: #94a3b8; transition: color 0.2s; }
        .char-count.warn { color: #f59e0b; }
        .char-bar { height: 3px; background: #dcfce7; border-radius: 2px; margin-top: 5px; overflow: hidden; }
        .char-bar-fill { height: 100%; background: #16a34a; border-radius: 2px; transition: width 0.2s; }

        .submit-btn {
          padding: 0.9rem; background: linear-gradient(135deg, #16a34a, #15803d);
          color: white; border: none; border-radius: 10px;
          font-size: 0.95rem; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 0.6rem;
          cursor: pointer; transition: all 0.3s; margin-top: 0.5rem;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(22,163,74,0.35); background: linear-gradient(135deg, #15803d, #14532d); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: spin 0.75s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .form-note {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.78rem; color: #94a3b8; justify-content: center;
        }

        /* ── MAP SIDE ── */
        .map-wrapper {
          background: linear-gradient(160deg, #052e16 0%, #14532d 60%, #166534 100%);
          padding: 2.5rem; display: flex; flex-direction: column; gap: 1.5rem;
        }
        .map-badge {
          display: inline-block; padding: 0.4rem 1rem;
          background: rgba(74,222,128,0.15); color: #4ade80;
          border-radius: 100px; font-size: 0.8rem; font-weight: 600;
          border: 1px solid rgba(74,222,128,0.2);
        }
        .map-title { font-size: 1.6rem; font-weight: 700; color: white; margin-top: 0.5rem; }
        .map-address { display: flex; align-items: center; gap: 6px; color: #bbf7d0; font-size: 0.9rem; }
        .map-hours {
          display: flex; align-items: center; gap: 6px; color: #86efac;
          font-size: 0.875rem; padding: 0.6rem 0.9rem;
          background: rgba(74,222,128,0.08); border-radius: 8px;
          border: 1px solid rgba(74,222,128,0.15);
        }
        .open-dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; margin-left: auto; box-shadow: 0 0 0 3px rgba(74,222,128,0.25); }
        .map-button {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0.75rem 1.75rem;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          color: white; text-decoration: none; border-radius: 9px;
          font-weight: 600; font-size: 0.9rem;
          transition: transform 0.25s, box-shadow 0.25s;
          width: fit-content;
        }
        .map-button:hover { transform: translateX(4px); box-shadow: 0 8px 18px rgba(22,163,74,0.35); }
        .map-embed { border-radius: 14px; overflow: hidden; flex-shrink: 0; }
        .quick-contacts { display: flex; flex-direction: column; gap: 0.5rem; }
        .qc-item {
          display: flex; align-items: center; gap: 8px;
          color: #bbf7d0; font-size: 0.875rem; text-decoration: none;
          padding: 0.6rem 0.9rem; border-radius: 8px;
          background: rgba(74,222,128,0.06);
          transition: background 0.2s;
        }
        .qc-item:hover { background: rgba(74,222,128,0.14); color: #4ade80; }

        /* ── FAQ ── */
        .faq-section { padding: 5rem 0; background: white; }
        .faq-list { display: flex; flex-direction: column; gap: 0.75rem; margin: 2.5rem 0; max-width: 860px; margin-left: auto; margin-right: auto; }
        .faq-item {
          border: 1.5px solid #e2e8f0; border-radius: 14px;
          overflow: hidden; transition: border-color 0.25s;
        }
        .faq-item.open { border-color: #16a34a; }
        .faq-trigger {
          width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 1.1rem 1.5rem; background: none; border: none; cursor: pointer;
          font-size: 0.975rem; font-weight: 600; color: #052e16; text-align: left;
          transition: background 0.2s;
        }
        .faq-trigger:hover { background: #f0fdf4; }
        .faq-item.open .faq-trigger { background: #f0fdf4; color: #16a34a; }
        .faq-chevron { flex-shrink: 0; color: #94a3b8; transition: transform 0.3s; }
        .faq-item.open .faq-chevron { transform: rotate(180deg); color: #16a34a; }
        .faq-body {
          max-height: 0; overflow: hidden;
          transition: max-height 0.35s ease, padding 0.35s ease;
          padding: 0 1.5rem;
        }
        .faq-item.open .faq-body { max-height: 300px; padding: 0 1.5rem 1.25rem; }
        .faq-body p { font-size: 0.9rem; color: #64748b; line-height: 1.65; }
        .faq-cta { text-align: center; }
        .faq-cta p { color: #64748b; margin-bottom: 0.75rem; font-size: 0.95rem; }
        .faq-link { display: inline-flex; align-items: center; gap: 5px; color: #16a34a; text-decoration: none; font-weight: 500; font-size: 0.95rem; transition: gap 0.25s; }
        .faq-link:hover { gap: 8px; }

        /* ── SOCIAL ── */
        .social-section { padding: 4rem 0; background: #f0fdf4; }
        .social-content { text-align: center; }
        .social-title { font-size: 1.85rem; font-weight: 700; color: #052e16; margin-bottom: 0.75rem; }
        .social-text { font-size: 1rem; color: #64748b; margin-bottom: 2.5rem; }
        .social-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.25rem; max-width: 560px; margin: 0 auto; }
        .social-card {
          display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
          padding: 1.75rem 1rem; background: white; border-radius: 14px;
          text-decoration: none; color: #052e16;
          transition: transform 0.25s, box-shadow 0.25s;
          border: 1px solid #dcfce7;
        }
        .social-card:hover { transform: translateY(-4px); box-shadow: 0 14px 24px rgba(22,163,74,0.1); }
        .social-card.facebook:hover { background: #1877f2; color: white; border-color: #1877f2; }
        .social-card.twitter:hover { background: #1da1f2; color: white; border-color: #1da1f2; }
        .social-card.linkedin:hover { background: #0a66c2; color: white; border-color: #0a66c2; }
        .social-card.instagram:hover { background: #e4405f; color: white; border-color: #e4405f; }
        .social-card span { font-size: 0.85rem; font-weight: 500; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .info-cards-grid { grid-template-columns: repeat(2,1fr); }
          .form-wrapper { grid-template-columns: 1fr; }
          .map-wrapper { padding: 2.5rem; }
        }
        @media (max-width: 768px) {
          .hero-stats { flex-wrap: wrap; gap: 1.25rem; }
          .info-cards-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .social-grid { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>
    </div>
  );
};

export default Contact;