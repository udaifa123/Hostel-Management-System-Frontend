import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight, Mail, Phone, MapPin, Shield, Bell, Users,
  Clock, CheckCircle, ArrowRight, Star, Building2, BedDouble, Key,
  Award, TrendingUp, BookOpen, Coffee, Wifi, Calendar, Play,
  Facebook, Twitter, Instagram, Linkedin, Youtube, Menu, X,
  ChevronDown, Zap, Globe, Heart, Monitor, Smartphone, Tablet,
  Camera, Video, Gift, CreditCard, Headphones, Cpu, Database,
  Lock, UserCheck, FileText, BarChart, MessageCircle, Settings
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hostelFilter, setHostelFilter] = useState("All");
  const [hoveredHostel, setHoveredHostel] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const hostels = [
    {
      id: 1,
      name: "Green Valley Hostel",
      type: "Boys Hostel",
      location: "North Campus",
      capacity: 250,
      currentOccupancy: 210,
      warden: "Mr. John Smith",
      contact: "+1 234-567-8901",
      email: "greenvalley@campus.com",
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1774688863/boyshstl_ml6n8o.jpg",
      amenities: ["WiFi", "Mess", "Gym", "Laundry", "Common Room", "24/7 Security", "Study Room", "Cafeteria"],
      roomTypes: ["Single", "Double", "Triple"],
      priceRange: "$200 - $400/month",
      rating: 4.5,
      reviews: 128,
      distance: "0.5 km from main gate",
      established: "2015",
      description: "Modern hostel with state-of-the-art facilities, located in the heart of North Campus. Perfect for engineering students.",
      rooms: [
        { number: "101", type: "Single", capacity: 1, available: 2, price: 400, amenities: ["Attached Bath", "Study Table", "AC"] },
        { number: "102-105", type: "Double", capacity: 2, available: 5, price: 300, amenities: ["Shared Bath", "Study Table", "Fan"] },
        { number: "201-205", type: "Triple", capacity: 3, available: 3, price: 250, amenities: ["Common Bath", "Study Table", "Fan"] },
      ],
      reviews_list: [
        { user: "Rahul K.", rating: 5, comment: "Great facilities and friendly warden", date: "2024-02-15" },
        { user: "Amit S.", rating: 4, comment: "Good food in mess, WiFi is fast", date: "2024-02-10" }
      ],
      nearby: ["Library", "Sports Complex", "Medical Store", "Food Court"]
    },
    {
      id: 2,
      name: "Lakeside Residency",
      type: "Girls Hostel",
      location: "South Campus",
      capacity: 200,
      currentOccupancy: 185,
      warden: "Mrs. Sarah Johnson",
      contact: "+1 234-567-8902",
      email: "lakeside@campus.com",
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1774689390/grlshstl_cczd7a.jpg",
      amenities: ["WiFi", "Mess", "Library", "Common Room", "Security", "Parking", "Garden", "Yoga Room"],
      roomTypes: ["Single", "Double", "Dormitory"],
      priceRange: "$180 - $350/month",
      rating: 4.8,
      reviews: 156,
      distance: "0.8 km from academic block",
      established: "2018",
      description: "Beautiful hostel overlooking the lake. Safe and secure environment with 24/7 female security guards.",
      rooms: [
        { number: "A1-A5", type: "Single", capacity: 1, available: 3, price: 350, amenities: ["Attached Bath", "Study Table", "AC"] },
        { number: "B1-B10", type: "Double", capacity: 2, available: 4, price: 280, amenities: ["Attached Bath", "Study Table", "Fan"] },
        { number: "D1-D4", type: "Dormitory", capacity: 6, available: 1, price: 180, amenities: ["Common Bath", "Locker"] },
      ],
      reviews_list: [
        { user: "Priya M.", rating: 5, comment: "Best hostel for girls, very safe", date: "2024-02-18" },
        { user: "Neha R.", rating: 5, comment: "Beautiful location and great food", date: "2024-02-14" }
      ],
      nearby: ["Lake View", "Cafe", "Park", "Bus Stop"]
    },
    {
      id: 3,
      name: "Central Tower",
      type: "Boys Hostel",
      location: "Central Campus",
      capacity: 300,
      currentOccupancy: 278,
      warden: "Mr. David Wilson",
      contact: "+1 234-567-8903",
      email: "central@campus.com",
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1774691330/byshstl_zbtqf7.jpg",
      amenities: ["WiFi", "Mess", "Gym", "Study Room", "Common Room", "Cafeteria", "Rooftop", "Game Room"],
      roomTypes: ["Single", "Double", "Triple", "Suite"],
      priceRange: "$220 - $500/month",
      rating: 4.3,
      reviews: 203,
      distance: "0.2 km from central library",
      established: "2010",
      description: "High-rise hostel in the center of campus. Close to all academic buildings and main library.",
      rooms: [
        { number: "1001-1010", type: "Single", capacity: 1, available: 5, price: 450, amenities: ["Attached Bath", "Study Table", "AC", "Mini Fridge"] },
        { number: "2001-2020", type: "Double", capacity: 2, available: 8, price: 320, amenities: ["Attached Bath", "Study Table", "AC"] },
        { number: "3001-3015", type: "Suite", capacity: 2, available: 2, price: 500, amenities: ["Living Room", "Kitchen", "Attached Bath", "AC"] },
      ],
      reviews_list: [
        { user: "Vikram S.", rating: 4, comment: "Great location, modern rooms", date: "2024-02-12" },
        { user: "Raj P.", rating: 4.5, comment: "Excellent study rooms and gym", date: "2024-02-08" }
      ],
      nearby: ["Library", "Auditorium", "Food Court", "Bank"]
    },
    {
      id: 4,
      name: "Sunrise Hostel",
      type: "Girls Hostel",
      location: "East Campus",
      capacity: 150,
      currentOccupancy: 142,
      warden: "Mrs. Emily Brown",
      contact: "+1 234-567-8904",
      email: "sunrise@campus.com",
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1774691498/girlshstl_cq7bqn.jpg",
      amenities: ["WiFi", "Mess", "Garden", "Common Room", "Security", "Parking", "Meditation Room", "Laundry"],
      roomTypes: ["Double", "Triple"],
      priceRange: "$200 - $280/month",
      rating: 4.6,
      reviews: 89,
      distance: "1.2 km from academic block",
      established: "2020",
      description: "Cozy hostel with beautiful garden views. Known for its homely atmosphere and caring staff.",
      rooms: [
        { number: "101-120", type: "Double", capacity: 2, available: 6, price: 280, amenities: ["Attached Bath", "Study Table", "Fan"] },
        { number: "201-215", type: "Triple", capacity: 3, available: 4, price: 220, amenities: ["Common Bath", "Study Table", "Fan"] },
      ],
      reviews_list: [
        { user: "Anjali K.", rating: 5, comment: "Feels like home, staff is very caring", date: "2024-02-16" },
        { user: "Divya M.", rating: 4.5, comment: "Beautiful garden and peaceful environment", date: "2024-02-11" }
      ],
      nearby: ["Garden", "Temple", "Market", "Hospital"]
    },
    {
      id: 5,
      name: "Royal Heights",
      type: "Boys Hostel",
      location: "West Campus",
      capacity: 180,
      currentOccupancy: 145,
      warden: "Mr. Robert Brown",
      contact: "+1 234-567-8905",
      email: "royal@campus.com",
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1774753515/byshstl1_w3drtl.jpg",
      amenities: ["WiFi", "Mess", "Swimming Pool", "Tennis Court", "Common Room", "24/7 Security", "Study Room", "Cafeteria"],
      roomTypes: ["Single", "Double", "Suite"],
      priceRange: "$300 - $600/month",
      rating: 4.7,
      reviews: 92,
      distance: "0.3 km from sports complex",
      established: "2019",
      description: "Premium hostel with luxury amenities. Perfect for athletes and sports enthusiasts.",
      rooms: [
        { number: "501-510", type: "Single", capacity: 1, available: 4, price: 500, amenities: ["Attached Bath", "Study Table", "AC", "Mini Fridge", "TV"] },
        { number: "511-520", type: "Double", capacity: 2, available: 6, price: 400, amenities: ["Attached Bath", "Study Table", "AC", "TV"] },
        { number: "521-525", type: "Suite", capacity: 2, available: 2, price: 600, amenities: ["Living Room", "Kitchen", "Attached Bath", "AC", "TV"] },
      ],
      reviews_list: [
        { user: "Arjun K.", rating: 5, comment: "Best facilities, feels like a resort", date: "2024-02-20" },
        { user: "Rahul M.", rating: 4.5, comment: "Great swimming pool and gym", date: "2024-02-17" }
      ],
      nearby: ["Sports Complex", "Swimming Pool", "Tennis Court", "Cafe"]
    },
    {
      id: 6,
      name: "Serenity Girls Hostel",
      type: "Girls Hostel",
      location: "North Campus",
      capacity: 220,
      currentOccupancy: 198,
      warden: "Mrs. Jennifer Lee",
      contact: "+1 234-567-8906",
      email: "serenity@campus.com",
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1774753709/grlshstl1_acopz5.jpg",
      amenities: ["WiFi", "Mess", "Library", "Common Room", "Security", "Parking", "Beauty Salon", "Laundry"],
      roomTypes: ["Single", "Double", "Triple"],
      priceRange: "$190 - $320/month",
      rating: 4.9,
      reviews: 178,
      distance: "0.4 km from academic block",
      established: "2017",
      description: "Peaceful and secure environment with all modern amenities for girl students.",
      rooms: [
        { number: "101-110", type: "Single", capacity: 1, available: 5, price: 320, amenities: ["Attached Bath", "Study Table", "AC"] },
        { number: "111-130", type: "Double", capacity: 2, available: 8, price: 250, amenities: ["Attached Bath", "Study Table", "Fan"] },
        { number: "131-140", type: "Triple", capacity: 3, available: 4, price: 190, amenities: ["Common Bath", "Study Table", "Fan"] },
      ],
      reviews_list: [
        { user: "Meera S.", rating: 5, comment: "Very safe and peaceful environment", date: "2024-02-19" },
        { user: "Pooja R.", rating: 5, comment: "Beautiful rooms and caring staff", date: "2024-02-15" }
      ],
      nearby: ["Library", "Beauty Salon", "Cafe", "Park"]
    },
    {
      id: 7,
      name: "Heritage Men's Hostel",
      type: "Boys Hostel",
      location: "South Campus",
      capacity: 280,
      currentOccupancy: 245,
      warden: "Mr. Thomas Anderson",
      contact: "+1 234-567-8907",
      email: "heritage@campus.com",
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1774754020/byshstl2_dyicvw.jpg",
      amenities: ["WiFi", "Mess", "Gym", "Study Room", "Common Room", "Cafeteria", "Basketball Court", "Game Room"],
      roomTypes: ["Single", "Double", "Triple", "Dormitory"],
      priceRange: "$180 - $450/month",
      rating: 4.4,
      reviews: 167,
      distance: "0.6 km from engineering block",
      established: "2012",
      description: "Affordable yet comfortable hostel with excellent study facilities.",
      rooms: [
        { number: "G1-G20", type: "Dormitory", capacity: 8, available: 3, price: 180, amenities: ["Common Bath", "Locker", "Study Desk"] },
        { number: "101-120", type: "Triple", capacity: 3, available: 7, price: 250, amenities: ["Common Bath", "Study Table", "Fan"] },
        { number: "201-215", type: "Double", capacity: 2, available: 5, price: 320, amenities: ["Attached Bath", "Study Table", "AC"] },
        { number: "301-310", type: "Single", capacity: 1, available: 3, price: 450, amenities: ["Attached Bath", "Study Table", "AC", "Mini Fridge"] },
      ],
      reviews_list: [
        { user: "Suresh N.", rating: 4, comment: "Good value for money", date: "2024-02-13" },
        { user: "Arun P.", rating: 4.5, comment: "Great study rooms and library", date: "2024-02-09" }
      ],
      nearby: ["Library", "Basketball Court", "Canteen", "Stationery Shop"]
    },
    {
      id: 8,
      name: "Olive Residency",
      type: "Girls Hostel",
      location: "East Campus",
      capacity: 170,
      currentOccupancy: 152,
      warden: "Mrs. Maria Garcia",
      contact: "+1 234-567-8908",
      email: "olive@campus.com",
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1774754197/grlshstl2_d5p0jp.jpg",
      amenities: ["WiFi", "Mess", "Garden", "Common Room", "Security", "Parking", "Yoga Room", "Library"],
      roomTypes: ["Single", "Double"],
      priceRange: "$220 - $380/month",
      rating: 4.7,
      reviews: 112,
      distance: "0.3 km from medical college",
      established: "2021",
      description: "Modern hostel with eco-friendly design and organic food options.",
      rooms: [
        { number: "1-15", type: "Single", capacity: 1, available: 4, price: 380, amenities: ["Attached Bath", "Study Table", "AC", "Balcony"] },
        { number: "16-40", type: "Double", capacity: 2, available: 8, price: 280, amenities: ["Attached Bath", "Study Table", "AC"] },
      ],
      reviews_list: [
        { user: "Kavya M.", rating: 5, comment: "Eco-friendly and peaceful", date: "2024-02-21" },
        { user: "Sneha R.", rating: 4.5, comment: "Great organic food in mess", date: "2024-02-16" }
      ],
      nearby: ["Medical College", "Garden", "Yoga Center", "Organic Cafe"]
    }
  ];

  const features = [
    {
      icon: <Building2 size={26} />,
      title: "Smart Campus",
      desc: "Centralized management for students, staff, and campus operations",
      color: "#059669",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stats: "98% efficiency"
    },
    {
      icon: <BedDouble size={26} />,
      title: "Dormitory System",
      desc: "Secure hostel management with real-time monitoring",
      color: "#0d9488",
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1772706392/dorm4_v33tot.jpg",
      stats: "24/7 security"
    },
    {
      icon: <Bell size={26} />,
      title: "Parent Alerts",
      desc: "Instant notifications for attendance and emergencies",
      color: "#d97706",
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1774711904/study1_wgtmil.jpg",
      stats: "< 30 sec"
    },
    {
      icon: <Key size={26} />,
      title: "Access Control",
      desc: "Biometric and RFID-based secure entry systems",
      color: "#059669",
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1774711627/access_lpjqx4.jpg",
      stats: "100% secure"
    },
    {
      icon: <UserCheck size={26} />,
      title: "Attendance Tracking",
      desc: "Automated attendance with facial recognition",
      color: "#0d9488",
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1774691944/attendnce_idqhy1.jpg",
      stats: "99.9% accuracy"
    },
    {
      icon: <FileText size={26} />,
      title: "Digital Records",
      desc: "Paperless documentation and instant access",
      color: "#047857",
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1774691782/digital_pu3azx.jpg",
      stats: "Cloud-based"
    },
    {
      icon: <BarChart size={26} />,
      title: "Analytics",
      desc: "Real-time insights and predictive reports",
      color: "#d97706",
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1774711452/analytics1_q8talt.jpg",
      stats: "Live data"
    },
    {
      icon: <MessageCircle size={26} />,
      title: "Communication",
      desc: "Integrated messaging for staff and parents",
      color: "#0d9488",
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1774711755/commncation_zthwb7.jpg",
      stats: "Instant"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Register Institution",
      desc: "Quick onboarding process with dedicated support",
      color: "#059669",
      icon: <Building2 size={22} />,
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1772030140/regsiter_vwsvvt.jpg",
      duration: "30 min"
    },
    {
      number: "02",
      title: "Add Students & Staff",
      desc: "Import data or use our intuitive management system",
      color: "#0d9488",
      icon: <Users size={22} />,
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1772030300/student_staff_pxjmre.jpg",
      duration: "2 hours"
    },
    {
      number: "03",
      title: "Configure Access",
      desc: "Set up permissions, alerts, and notifications",
      color: "#d97706",
      icon: <Settings size={22} />,
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/q_auto/f_auto/v1776094870/configure_access1_rg858s.jpg",
      duration: "1 hour"
    },
    {
      number: "04",
      title: "Go Live",
      desc: "Launch with full support and training",
      color: "#059669",
      icon: <CheckCircle size={22} />,
      image: "https://res.cloudinary.com/dncdvsywu/image/upload/q_auto/f_auto/v1776095301/go_live_egaq5n.jpg",
      duration: "Instant"
    }
  ];

  const stats = [
    { value: "500+", label: "Institutions", icon: <Building2 size={22} />, color: "#059669" },
    { value: "50K+", label: "Students", icon: <Users size={22} />, color: "#0d9488" },
    { value: "98%", label: "Satisfaction", icon: <Star size={22} />, color: "#d97706" },
    { value: "24/7", label: "Support", icon: <Headphones size={22} />, color: "#059669" }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Principal, City University",
      content: "CampusFlow has transformed our institution. The parent communication feature alone has improved engagement by 200%. Highly recommended for any institution looking to modernize.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108777-296ef5a60d9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Michael Chen",
      role: "Parent Council Head",
      content: "As a parent, I love being able to track my children's attendance and activities in real-time. Peace of mind is priceless. This platform is a game changer.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Prof. Emily Williams",
      role: "Dean of Students",
      content: "The analytics and reporting are outstanding. We've reduced administrative work by 60% and improved security significantly across all our campuses.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "James Rodriguez",
      role: "IT Director",
      content: "Implementation was seamless. The API integration with our existing systems was smooth, and the support team is exceptional and always available.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    }
  ];

  const partnerNames = ["TechEdu", "LearnPro", "CampusTech", "EduSmart", "SmartLearn", "DigiCampus"];

  const faqs = [
    {
      question: "How quickly can we implement CampusFlow?",
      answer: "Most institutions are fully operational within 2-3 business days. Our dedicated onboarding team ensures a smooth transition with step-by-step guidance."
    },
    {
      question: "Is our data secure?",
      answer: "Absolutely. We use bank-level 256-bit encryption, regular security audits, and are fully GDPR compliant. Your data never leaves our secure servers."
    },
    {
      question: "Can parents access the system?",
      answer: "Yes, parents get a dedicated portal to monitor attendance, receive real-time alerts, and communicate directly with staff at any time."
    },
    {
      question: "What kind of support do you offer?",
      answer: "24/7 technical support, dedicated account manager, regular training sessions, and comprehensive documentation for all user levels."
    },
    {
      question: "Does it integrate with existing systems?",
      answer: "Yes, we offer API integration with most major educational software and can customize integrations to fit your specific infrastructure needs."
    },
    {
      question: "What's the pricing model?",
      answer: "Flexible pricing based on institution size. Contact us for a customized quote with no hidden fees, no surprises — ever."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$199",
      period: "/month",
      features: ["Up to 500 students", "Basic attendance", "Parent notifications", "Email support", "Basic reporting"],
      color: "#059669",
      popular: false,
      desc: "Perfect for small schools"
    },
    {
      name: "Professional",
      price: "$399",
      period: "/month",
      features: ["Up to 2000 students", "Advanced analytics", "API access", "Priority support", "Custom reports", "Biometric integration"],
      color: "#0d9488",
      popular: true,
      desc: "Most popular for mid-size campuses"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["Unlimited students", "Dedicated server", "Custom development", "24/7 phone support", "SLA guarantee", "White-label option"],
      color: "#d97706",
      popular: false,
      desc: "For large universities & chains"
    }
  ];

  const filterTypes = ["All", "Boys Hostel", "Girls Hostel"];
  const filteredHostels = hostelFilter === "All" ? hostels.slice(0, 4) : hostels.filter(h => h.type === hostelFilter).slice(0, 4);

  const amenityIcons = {
    "WiFi": "📶", "Mess": "🍽️", "Gym": "💪", "Laundry": "🧺",
    "Common Room": "🛋️", "24/7 Security": "🔒", "Study Room": "📚",
    "Cafeteria": "☕", "Library": "📖", "Garden": "🌿",
    "Swimming Pool": "🏊", "Parking": "🚗", "Yoga Room": "🧘"
  };

  return (
    <>
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

        html { scroll-behavior: smooth; }

        body {
          font-family: 'Nunito', sans-serif;
          background: var(--bg);
          color: var(--ink);
          line-height: 1.65;
          overflow-x: hidden;
        }

        h1,h2,h3,h4,h5 { font-family: 'Playfair Display', serif; font-weight: 800; line-height: 1.15; }

        img { display: block; max-width: 100%; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; cursor: pointer; }
        ul { list-style: none; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatY { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-18px); } }
        @keyframes pulse { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.12); opacity:.7; } }
        @keyframes marquee { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        @keyframes shimmer { 0% { background-position:-400px 0; } 100% { background-position:400px 0; } }
        @keyframes leafSpin { 0%,100% { transform: rotate(-8deg) scale(1); } 50% { transform: rotate(8deg) scale(1.05); } }
        @keyframes hCardRise { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmerSlide { 0% { left: -100%; } 100% { left: 200%; } }
        @keyframes occupancyFill { from { width: 0; } to { width: var(--fill-w); } }

        .fade-up { animation: fadeUp .7s ease both; }
        .delay-1 { animation-delay: .15s; }
        .delay-2 { animation-delay: .3s; }
        .delay-3 { animation-delay: .45s; }
        .delay-4 { animation-delay: .6s; }

        /* ── NAVBAR (unchanged) ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 999;
          height: var(--nav-h);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
          transition: background .3s, box-shadow .3s, border-color .3s;
          background: rgba(247,250,248,0.7);
          backdrop-filter: blur(20px) saturate(1.4);
          border-bottom: 1px solid transparent;
        }
        .nav.stuck {
          background: rgba(247,250,248,0.97);
          border-bottom-color: var(--border);
          box-shadow: 0 4px 24px rgba(5,150,105,0.08);
        }
        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-weight: 900; font-size: 22px; letter-spacing: -0.5px;
          background: var(--gv); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          cursor: pointer; flex-shrink: 0;
        }
        .nav-center { display: flex; gap: 4px; }
        .nav-link { padding: 8px 16px; border-radius: 8px; font-size: 14.5px; font-weight: 600; color: var(--muted-2); transition: color .2s, background .2s; }
        .nav-link:hover { color: var(--emerald-d); background: rgba(5,150,105,0.07); }
        .nav-right { display: flex; align-items: center; gap: 12px; }
        .btn-ghost { padding: 9px 20px; border-radius: 9px; font-size: 14px; font-weight: 700; color: var(--emerald-d); background: transparent; border: 1.5px solid var(--border-2); cursor: pointer; transition: all .2s; display: inline-flex; align-items: center; gap: 6px; }
        .btn-ghost:hover { border-color: var(--emerald); background: rgba(5,150,105,0.06); }
        .btn-pill { padding: 9px 22px; border-radius: 9px; font-size: 14px; font-weight: 700; color: var(--white); background: var(--gv); border: none; cursor: pointer; transition: all .2s; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(5,150,105,0.25); }
        .btn-pill:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(5,150,105,0.35); }
        .nav-hamburger { display: none; background: none; border: 1.5px solid var(--border-2); color: var(--emerald-d); cursor: pointer; width: 40px; height: 40px; border-radius: 8px; align-items: center; justify-content: center; }
        .mob-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(15,31,20,0.55); backdrop-filter: blur(4px); opacity: 0; pointer-events: none; transition: opacity .3s; }
        .mob-overlay.open { opacity: 1; pointer-events: all; }
        .mob-panel { position: fixed; top: 0; right: -320px; bottom: 0; width: 300px; z-index: 1001; background: var(--white); border-left: 1px solid var(--border); padding: 24px; transition: right .35s cubic-bezier(.4,0,.2,1); overflow-y: auto; }
        .mob-panel.open { right: 0; }
        .mob-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
        .mob-close { background: none; border: 1.5px solid var(--border); color: var(--emerald-d); width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .mob-links li { margin-bottom: 4px; }
        .mob-links a { display: block; padding: 12px 16px; border-radius: 10px; font-size: 16px; font-weight: 600; color: var(--muted-2); transition: all .2s; }
        .mob-links a:hover { color: var(--emerald-d); background: rgba(5,150,105,0.07); }
        .mob-btns { display: flex; flex-direction: column; gap: 10px; margin-top: 24px; }
        .mob-btns .btn-ghost, .mob-btns .btn-pill { justify-content: center; width: 100%; padding: 12px; }

        /* ── HERO (unchanged) ── */
        .hero { min-height: 100vh; display: flex; align-items: center; padding: calc(var(--nav-h) + 60px) 48px 80px; position: relative; overflow: hidden; background: linear-gradient(160deg, #f7faf8 0%, #edf5f0 50%, #e2ede6 100%); }
        .hero-mesh { position: absolute; inset: 0; z-index: 0; background: radial-gradient(ellipse 60% 50% at 15% 40%, rgba(5,150,105,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 60%, rgba(13,148,136,0.1) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 50% 100%, rgba(217,119,6,0.06) 0%, transparent 50%); }
        .hero-dots { position: absolute; inset: 0; z-index: 0; background-image: radial-gradient(rgba(5,150,105,0.15) 1px, transparent 1px); background-size: 32px 32px; mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%); }
        .hero-leaf-1 { position: absolute; top: 12%; right: 5%; z-index: 0; width: 200px; height: 200px; border-radius: 60% 40% 60% 40% / 50% 60% 40% 50%; background: rgba(5,150,105,0.06); animation: leafSpin 8s ease-in-out infinite; }
        .hero-leaf-2 { position: absolute; bottom: 10%; left: 3%; z-index: 0; width: 140px; height: 140px; border-radius: 40% 60% 40% 60% / 60% 40% 60% 40%; background: rgba(13,148,136,0.07); animation: leafSpin 10s ease-in-out infinite 2s; }
        .hero-inner { position: relative; z-index: 2; max-width: 1280px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px 6px 8px; border-radius: 100px; border: 1.5px solid rgba(5,150,105,0.25); background: rgba(5,150,105,0.07); margin-bottom: 28px; width: fit-content; }
        .hero-badge-chip { background: var(--gv); color: #fff; font-size: 11px; font-weight: 800; letter-spacing: .5px; padding: 3px 9px; border-radius: 100px; font-family: 'Nunito', sans-serif; }
        .hero-badge-txt { font-size: 13px; color: var(--emerald-d); font-weight: 700; }
        .hero-h1 { font-size: clamp(40px, 4.5vw, 64px); font-weight: 900; letter-spacing: -1px; margin-bottom: 22px; color: var(--ink); line-height: 1.1; }
        .hero-h1 .grad { background: var(--gv); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-sub { font-size: 17px; color: var(--muted); max-width: 520px; margin-bottom: 36px; line-height: 1.7; font-weight: 500; }
        .hero-actions { display: flex; gap: 14px; margin-bottom: 52px; flex-wrap: wrap; }
        .hero-cta { padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 800; background: var(--gv); color: #fff; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all .25s; box-shadow: 0 8px 24px rgba(5,150,105,0.3); font-family: 'Nunito', sans-serif; }
        .hero-cta:hover { transform: translateY(-2px); box-shadow: 0 16px 36px rgba(5,150,105,0.4); }
        .hero-demo { padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 800; background: transparent; color: var(--ink-2); border: 1.5px solid var(--border-2); cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all .25s; font-family: 'Nunito', sans-serif; }
        .hero-demo:hover { border-color: var(--emerald); background: rgba(5,150,105,0.05); }
        .hero-nums { display: flex; gap: 36px; }
        .hero-num-val { font-family:'Playfair Display',serif; font-size: 30px; font-weight: 800; color: var(--ink); }
        .hero-num-lbl { font-size: 13px; color: var(--muted); margin-top: 2px; font-weight: 600; }
        .hero-num-chg { font-size: 12px; color: var(--emerald); margin-top: 4px; font-weight: 700; }
        .hero-num-div { width: 1px; background: var(--border-2); }
        .hero-visual { position: relative; }
        .hero-img-wrap { border-radius: 24px; overflow: hidden; box-shadow: var(--shadow-xl); animation: floatY 7s ease-in-out infinite; position: relative; border: 2px solid rgba(5,150,105,0.15); }
        .hero-img-wrap img { width: 100%; aspect-ratio: 4/3; object-fit: cover; }
        .hero-img-tint { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(5,150,105,0.03) 0%, rgba(13,148,136,0.02) 100%); }
        .hero-chip { position: absolute; background: rgba(255,255,255,0.96); backdrop-filter: blur(16px); border: 1.5px solid rgba(5,150,105,0.15); border-radius: 14px; padding: 12px 16px; box-shadow: 0 8px 24px rgba(5,150,105,0.12); display: flex; align-items: center; gap: 10px; white-space: nowrap; }
        .hero-chip-1 { top: 24px; left: -32px; animation: floatY 5s ease-in-out infinite; }
        .hero-chip-2 { bottom: 32px; right: -32px; animation: floatY 6s ease-in-out infinite 1s; }
        .chip-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--gv); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .chip-label { font-size: 13px; font-weight: 800; color: var(--ink); }
        .chip-sub { font-size: 11px; color: var(--muted); margin-top: 1px; }

        /* ── TICKER (unchanged) ── */
        .ticker { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--white); padding: 20px 0; overflow: hidden; }
        .ticker-label { text-align: center; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: var(--muted); text-transform: uppercase; margin-bottom: 18px; }
        .ticker-row { display: flex; gap: 0; }
        .ticker-track { display: flex; gap: 48px; animation: marquee 25s linear infinite; flex-shrink: 0; }
        .ticker-item { display: flex; align-items: center; gap: 10px; font-family: 'Playfair Display', serif; font-weight: 700; font-size: 16px; color: var(--muted); white-space: nowrap; transition: color .3s; padding: 4px 0; }
        .ticker-item:hover { color: var(--emerald-d); }
        .ticker-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(5,150,105,0.2); }

        .section { padding: 96px 48px; }
        .section-inner { max-width: 1280px; margin: 0 auto; }
        .section-eyebrow { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 100px; background: rgba(5,150,105,0.08); border: 1.5px solid rgba(5,150,105,0.2); font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: var(--emerald-d); margin-bottom: 18px; font-family: 'Nunito', sans-serif; }
        .section-h2 { font-size: clamp(32px,3.5vw,48px); font-weight: 900; letter-spacing: -0.5px; color: var(--ink); margin-bottom: 14px; }
        .section-h2 .grad { background: var(--gv); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .section-p { font-size: 17px; color: var(--muted); max-width: 580px; font-weight: 500; }
        .section-head-center { text-align: center; }
        .section-head-center .section-p { margin: 0 auto; }
        .divider { height: 1px; background: var(--border); max-width: 1280px; margin: 0 auto; }

        /* ── FEATURES (unchanged) ── */
        .features-sec { background: var(--bg); }
        .feat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; margin-top: 52px; }
        .feat-card { background: var(--white); border: 1.5px solid var(--border); border-radius: var(--r-lg); overflow: hidden; transition: transform .3s, border-color .3s, box-shadow .3s; cursor: default; }
        .feat-card:hover { transform: translateY(-6px); border-color: rgba(5,150,105,0.4); box-shadow: 0 20px 40px rgba(164,186,179,0.12), 0 0 0 1px rgba(5,150,105,0.1); }
        .feat-img { position: relative; height: 160px; overflow: hidden; }
        .feat-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; display: block; }
        .feat-card:hover .feat-img img { transform: scale(1.08); }
        .feat-ico { position: absolute; bottom: 12px; left: 14px; z-index: 2; width: 40px; height: 40px; border-radius: 10px; background: var(--white); border: 2px solid rgba(5,150,105,0.2); display: flex; align-items: center; justify-content: center; color: var(--emerald); box-shadow: 0 2px 8px rgba(5,150,105,0.15); }
        .feat-body { padding: 20px 18px 20px; }
        .feat-title { font-size: 16px; font-weight: 800; color: var(--ink); margin-bottom: 6px; font-family: 'Playfair Display', serif; }
        .feat-desc { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 14px; }
        .feat-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; color: var(--emerald-d); background: rgba(5,150,105,0.08); border: 1px solid rgba(5,150,105,0.15); padding: 4px 10px; border-radius: 100px; }

        /* ── STATS BAND (unchanged) ── */
        .stats-band { padding: 72px 48px; background: linear-gradient(135deg, #0a1f14 0%, #0f2d1e 50%, #0a1f14 100%); border-top: 1px solid rgba(5,150,105,0.2); border-bottom: 1px solid rgba(5,150,105,0.2); position: relative; overflow: hidden; }
        .stats-band::before { content:''; position:absolute; inset:0; background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(5,150,105,0.15) 0%, transparent 70%); }
        .stats-band-inner { max-width: 1280px; margin: 0 auto; position: relative; z-index: 2; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; }
        .stat-box { text-align: center; padding: 32px 20px; border: 1px solid rgba(5,150,105,0.15); border-radius: var(--r-lg); background: rgba(5,150,105,0.04); transition: border-color .3s, background .3s; }
        .stat-box:hover { border-color: rgba(5,150,105,0.35); background: rgba(5,150,105,0.08); }
        .stat-ico-wrap { width: 52px; height: 52px; border-radius: 14px; background: rgba(5,150,105,0.12); border: 1px solid rgba(5,150,105,0.2); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; color: var(--emerald-l); }
        .stat-val { font-family:'Playfair Display',serif; font-size: 44px; font-weight: 900; color: var(--white); letter-spacing: -2px; line-height: 1; margin-bottom: 8px; }
        .stat-lbl { font-size: 14px; color: rgba(255,255,255,0.5); font-weight: 600; }

        /* ── PROCESS (unchanged) ── */
        .process-sec { background: var(--bg-2); }
        .proc-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; margin-top: 52px; }
        .proc-card { background: var(--white); border: 1.5px solid var(--border); border-radius: var(--r-xl); overflow: hidden; transition: transform .3s, border-color .3s, box-shadow .3s; position: relative; }
        .proc-card:hover { transform: translateY(-6px); border-color: rgba(5,150,105,0.3); box-shadow: var(--shadow-lg); }
        .proc-num { position: absolute; top: 16px; right: 18px; font-family: 'Playfair Display',serif; font-size: 40px; font-weight: 900; color: rgba(5,150,105,0.06); line-height: 1; z-index: 1; }
        .proc-img { height: 160px; overflow: hidden; }
        .proc-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; display: block; }
        .proc-card:hover .proc-img img { transform: scale(1.08); }
        .proc-body { padding: 22px 20px 22px; position: relative; z-index: 2; }
        .proc-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .proc-ico { width: 38px; height: 38px; border-radius: 10px; background: var(--gv); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; box-shadow: 0 4px 12px rgba(5,150,105,0.25); }
        .proc-title { font-size: 16px; font-weight: 800; color: var(--ink); font-family: 'Playfair Display', serif; }
        .proc-desc { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 14px; }
        .proc-time { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: var(--emerald-d); background: rgba(5,150,105,0.08); border: 1px solid rgba(5,150,105,0.15); padding: 4px 10px; border-radius: 100px; }

        /* ── PRICING (unchanged) ── */
        .pricing-sec { background: var(--bg); }
        .pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 52px; max-width: 960px; margin-left: auto; margin-right: auto; }
        .price-card { background: var(--white); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: 36px 32px; transition: transform .3s, border-color .3s, box-shadow .3s; position: relative; }
        .price-card.hot { border-color: rgba(5,150,105,0.45); background: linear-gradient(145deg, rgba(5,150,105,0.04), var(--white)); box-shadow: 0 0 0 1px rgba(5,150,105,0.15), var(--shadow-card); }
        .price-card:hover:not(.hot) { transform: translateY(-6px); border-color: rgba(5,150,105,0.25); box-shadow: var(--shadow-card); }
        .price-card.hot:hover { transform: translateY(-6px); }
        .hot-tag { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--gv); color: #fff; font-size: 11px; font-weight: 800; letter-spacing: .5px; text-transform: uppercase; padding: 5px 16px; border-radius: 100px; white-space: nowrap; box-shadow: 0 4px 14px rgba(5,150,105,0.35); font-family: 'Nunito', sans-serif; }
        .price-name { font-size: 16px; font-weight: 800; color: var(--muted-2); margin-bottom: 4px; font-family: 'Playfair Display', serif; }
        .price-desc-sm { font-size: 12px; color: var(--muted); margin-bottom: 24px; }
        .price-amount { font-family: 'Playfair Display',serif; font-size: 52px; font-weight: 900; color: var(--ink); letter-spacing: -2px; line-height: 1; }
        .price-period { font-size: 14px; color: var(--muted); font-weight: 600; }
        .price-divider { height: 1px; background: var(--border); margin: 24px 0; }
        .price-feats { margin-bottom: 28px; }
        .price-feat { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: 14px; color: var(--muted-2); border-bottom: 1px solid rgba(5,150,105,0.06); }
        .price-feat:last-child { border-bottom: none; }
        .pf-check { color: var(--emerald); flex-shrink: 0; }
        .price-btn { width: 100%; padding: 13px; border-radius: 10px; font-size: 15px; font-weight: 800; cursor: pointer; border: none; transition: all .25s; font-family: 'Nunito', sans-serif; }
        .price-btn-primary { background: var(--gv); color: #fff; box-shadow: 0 6px 18px rgba(5,150,105,0.28); }
        .price-btn-primary:hover { box-shadow: 0 10px 24px rgba(5,150,105,0.4); transform: translateY(-1px); }
        .price-btn-ghost { background: transparent; color: var(--ink-2); border: 1.5px solid var(--border-2); }
        .price-btn-ghost:hover { background: rgba(5,150,105,0.05); border-color: var(--emerald); }

        /* ── TESTIMONIALS (unchanged) ── */
        .testi-sec { background: var(--bg-2); }
        .testi-wrap { max-width: 800px; margin: 52px auto 0; position: relative; }
        .testi-slider { min-height: 280px; position: relative; }
        .testi-slide { position: absolute; inset: 0; opacity: 0; pointer-events: none; transition: opacity .5s; }
        .testi-slide.on { opacity: 1; pointer-events: all; }
        .testi-card { background: var(--white); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: 40px; position: relative; overflow: hidden; box-shadow: var(--shadow-card); }
        .testi-card::before { content: '"'; position: absolute; top: 8px; right: 28px; font-size: 120px; font-family: 'Playfair Display',serif; font-weight: 900; color: rgba(5,150,105,0.07); line-height: 1; }
        .testi-top { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .testi-ava { width: 60px; height: 60px; border-radius: 50%; overflow: hidden; border: 2.5px solid rgba(5,150,105,0.25); flex-shrink: 0; }
        .testi-ava img { width: 100%; height: 100%; object-fit: cover; }
        .testi-name { font-size: 17px; font-weight: 800; color: var(--ink); margin-bottom: 3px; font-family: 'Playfair Display', serif; }
        .testi-role { font-size: 13px; color: var(--muted); font-weight: 600; }
        .testi-stars { display: flex; gap: 3px; color: var(--amber); margin-top: 6px; }
        .testi-q { font-size: 16px; color: var(--ink-2); line-height: 1.75; font-style: italic; }
        .testi-dots { display: flex; gap: 8px; justify-content: center; margin-top: 24px; }
        .testi-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(5,150,105,0.15); border: none; cursor: pointer; transition: all .3s; }
        .testi-dot.on { background: var(--emerald); width: 24px; border-radius: 4px; }

        /* ── FAQ (unchanged) ── */
        .faq-sec { background: var(--bg-2); }
        .faq-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; margin-top: 52px; max-width: 1000px; margin-left: auto; margin-right: auto; }
        .faq-item { background: var(--white); border: 1.5px solid var(--border); border-radius: var(--r); padding: 20px 24px; cursor: pointer; transition: border-color .25s, background .25s; }
        .faq-item:hover { border-color: rgba(5,150,105,0.3); }
        .faq-item.open { border-color: rgba(5,150,105,0.4); background: rgba(5,150,105,0.02); }
        .faq-q { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .faq-q-txt { font-size: 15px; font-weight: 700; color: var(--ink); }
        .faq-chevron { color: var(--muted); transition: transform .3s; flex-shrink: 0; }
        .faq-item.open .faq-chevron { transform: rotate(180deg); color: var(--emerald); }
        .faq-ans { font-size: 14px; color: var(--muted-2); line-height: 1.7; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); }

        /* ── CTA BAND (unchanged) ── */
        .cta-band { padding: 96px 48px; background: linear-gradient(135deg, #062912 0%, #083d1c 50%, #062912 100%); border-top: 1px solid rgba(5,150,105,0.2); position: relative; overflow: hidden; }
        .cta-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(5,150,105,0.2) 0%, transparent 70%); }
        .cta-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 600px; height: 600px; border: 1px solid rgba(5,150,105,0.1); border-radius: 50%; }
        .cta-ring-2 { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 900px; height: 900px; border: 1px solid rgba(5,150,105,0.05); border-radius: 50%; }
        .cta-inner { position: relative; z-index: 2; text-align: center; max-width: 620px; margin: 0 auto; }
        .cta-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 100px; margin-bottom: 20px; background: rgba(5,150,105,0.12); border: 1px solid rgba(5,150,105,0.25); font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: var(--emerald-l); font-family: 'Nunito', sans-serif; }
        .cta-h { font-size: clamp(32px,3.5vw,48px); font-weight: 900; color: var(--white); letter-spacing: -0.5px; margin-bottom: 16px; }
        .cta-sub { font-size: 17px; color: rgba(255,255,255,0.55); margin-bottom: 32px; font-weight: 500; }
        .cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .cta-btn-p { padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 800; color: var(--ink); background: var(--emerald-l); border: none; cursor: pointer; transition: all .25s; font-family: 'Nunito', sans-serif; box-shadow: 0 8px 24px rgba(52,211,153,0.3); }
        .cta-btn-p:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(52,211,153,0.45); }
        .cta-btn-s { padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 800; color: rgba(255,255,255,0.85); background: transparent; border: 1.5px solid rgba(5,150,105,0.4); cursor: pointer; transition: all .25s; font-family: 'Nunito', sans-serif; }
        .cta-btn-s:hover { border-color: rgba(5,150,105,0.7); background: rgba(5,150,105,0.1); }

        /* ── CONTACT (unchanged) ── */
        .contact-sec { background: var(--bg); }
        .contact-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 52px; }
        .contact-card { background: var(--white); border: 1.5px solid var(--border); border-radius: var(--r-xl); padding: 36px 28px; text-align: center; transition: transform .3s, border-color .3s, box-shadow .3s; }
        .contact-card:hover { transform: translateY(-6px); border-color: rgba(5,150,105,0.3); box-shadow: var(--shadow-card); }
        .contact-ico-wrap { width: 60px; height: 60px; border-radius: 16px; background: rgba(5,150,105,0.08); border: 1.5px solid rgba(5,150,105,0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: var(--emerald); }
        .contact-ttl { font-size: 18px; font-weight: 800; color: var(--ink); margin-bottom: 8px; font-family: 'Playfair Display', serif; }
        .contact-val { font-size: 15px; color: var(--ink-2); margin-bottom: 4px; font-weight: 600; }
        .contact-note { font-size: 13px; color: var(--muted); }

        /* ── FOOTER (unchanged) ── */
        .footer { background: var(--ink); border-top: 1px solid rgba(5,150,105,0.15); padding: 64px 48px 32px; }
        .footer-inner { max-width: 1280px; margin: 0 auto; }
        .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 2fr; gap: 48px; margin-bottom: 48px; }
        .footer-logo { font-family:'Playfair Display',serif; font-weight: 900; font-size: 22px; letter-spacing: -0.5px; background: var(--gv); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom: 14px; }
        .footer-about-p { font-size: 14px; color: rgba(255,255,255,0.4); line-height: 1.7; margin-bottom: 20px; }
        .footer-socials { display: flex; gap: 10px; }
        .footer-social-btn { width: 36px; height: 36px; border-radius: 9px; background: rgba(5,150,105,0.08); border: 1px solid rgba(5,150,105,0.15); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.4); transition: all .2s; cursor: pointer; }
        .footer-social-btn:hover { color: var(--white); border-color: rgba(5,150,105,0.4); background: rgba(5,150,105,0.15); }
        .footer-col-title { font-size: 13px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 18px; font-family: 'Nunito', sans-serif; }
        .footer-col-links li { margin-bottom: 10px; }
        .footer-col-links a { font-size: 14px; color: rgba(255,255,255,0.45); transition: color .2s; }
        .footer-col-links a:hover { color: var(--emerald-l); }
        .footer-news-p { font-size: 14px; color: rgba(255,255,255,0.4); margin-bottom: 14px; line-height: 1.6; }
        .footer-form { display: flex; gap: 8px; }
        .footer-input { flex: 1; padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(5,150,105,0.2); background: rgba(5,150,105,0.06); color: var(--white); font-size: 14px; font-family: inherit; outline: none; transition: border-color .2s; }
        .footer-input::placeholder { color: rgba(255,255,255,0.25); }
        .footer-input:focus { border-color: var(--emerald); }
        .footer-sub-btn { padding: 10px 16px; border-radius: 8px; background: var(--gv); border: none; color: #fff; font-size: 13px; font-weight: 800; cursor: pointer; transition: opacity .2s; white-space: nowrap; font-family: 'Nunito', sans-serif; }
        .footer-sub-btn:hover { opacity: .85; }
        .footer-bottom { padding-top: 24px; border-top: 1px solid rgba(5,150,105,0.1); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .footer-copy { font-size: 13px; color: rgba(255,255,255,0.3); }
        .footer-bottom-links { display: flex; gap: 20px; }
        .footer-bottom-links a { font-size: 13px; color: rgba(255,255,255,0.3); transition: color .2s; }
        .footer-bottom-links a:hover { color: var(--emerald-l); }

        /* ══════════════════════════════════════════════
           ✦ HOSTEL SECTION — PROFESSIONAL LUXURY STYLE
           ══════════════════════════════════════════════ */

        .hostels-section {
          padding: 100px 48px;
          background: linear-gradient(175deg, #f7faf8 0%, #edf5f0 40%, #f7faf8 100%);
          position: relative;
          overflow: hidden;
        }

        /* Subtle background grid pattern */
        .hostels-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(5,150,105,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(5,150,105,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* Floating ambient orbs */
        .hostels-section::after {
          content: '';
          position: absolute;
          top: -120px; right: -120px;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(5,150,105,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .hostels-inner {
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        /* Section header with decorative line */
        .hostels-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px;
          gap: 24px;
          flex-wrap: wrap;
        }

        .hostels-head-left {}

        .hostels-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 100px;
          background: rgba(5,150,105,0.08);
          border: 1.5px solid rgba(5,150,105,0.2);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--emerald-d);
          margin-bottom: 20px;
          font-family: 'Nunito', sans-serif;
        }

        .hostels-kicker-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--emerald);
          animation: pulse 2s ease-in-out infinite;
        }

        .hostels-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(30px, 3vw, 44px);
          font-weight: 900;
          color: var(--ink);
          letter-spacing: -0.5px;
          line-height: 1.1;
          margin-bottom: 12px;
        }

        .hostels-title .grad {
          background: var(--gv);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hostels-subtitle {
          font-size: 16px;
          color: var(--muted);
          font-weight: 500;
          max-width: 480px;
          line-height: 1.65;
        }

        /* Filter tabs */
        .hostels-filters {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px;
          background: var(--white);
          border-radius: 14px;
          border: 1.5px solid var(--border);
          box-shadow: 0 2px 8px rgba(5,150,105,0.06);
        }

        .hf-tab {
          padding: 9px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Nunito', sans-serif;
          border: none;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--muted-2);
          background: transparent;
          white-space: nowrap;
        }

        .hf-tab:hover { color: var(--emerald-d); background: rgba(5,150,105,0.06); }

        .hf-tab.active {
          background: var(--gv);
          color: white;
          box-shadow: 0 4px 12px rgba(5,150,105,0.3);
        }

        /* ── HOSTEL CARD — luxury hotel style ── */
        .hostels-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
          margin-bottom: 48px;
        }

        .hcard {
          background: var(--white);
          border-radius: 22px;
          overflow: hidden;
          border: 1.5px solid var(--border);
          cursor: pointer;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s, box-shadow 0.35s;
          animation: hCardRise 0.6s ease both;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .hcard:nth-child(1) { animation-delay: 0s; }
        .hcard:nth-child(2) { animation-delay: 0.08s; }
        .hcard:nth-child(3) { animation-delay: 0.16s; }
        .hcard:nth-child(4) { animation-delay: 0.24s; }

        .hcard:hover {
          transform: translateY(-10px) scale(1.01);
          border-color: rgba(5,150,105,0.35);
          box-shadow:
            0 2px 4px rgba(5,150,105,0.06),
            0 12px 32px rgba(5,150,105,0.14),
            0 24px 48px rgba(5,150,105,0.08);
        }

        /* ── IMAGE ZONE ── */
        .hcard-img-zone {
          position: relative;
          height: 210px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .hcard-img-zone img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          display: block;
        }

        .hcard:hover .hcard-img-zone img { transform: scale(1.1); }

        /* Gradient overlay at bottom of image for text readability */
        .hcard-img-gradient {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 80px;
          background: linear-gradient(to top, rgba(10,20,14,0.6) 0%, transparent 100%);
          pointer-events: none;
        }

        /* Shimmer shine effect on hover */
        .hcard-img-zone::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 60%;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255,255,255,0.12) 50%,
            transparent 60%
          );
          left: -100%;
          transition: none;
        }

        .hcard:hover .hcard-img-zone::after {
          animation: shimmerSlide 0.7s ease forwards;
        }

        /* Type badge — top left */
        .hcard-type-badge {
          position: absolute;
          top: 14px; left: 14px;
          display: flex; align-items: center; gap: 5px;
          padding: 5px 11px;
          border-radius: 100px;
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.4px;
          font-family: 'Nunito', sans-serif;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.25);
          transition: transform 0.2s;
        }

        .hcard:hover .hcard-type-badge { transform: scale(1.05); }

        .hcard-type-badge.boys {
          background: rgba(5,150,105,0.85);
          color: white;
        }

        .hcard-type-badge.girls {
          background: rgba(217,119,6,0.85);
          color: white;
        }

        .hcard-type-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.8;
        }

        /* Rating — top right */
        .hcard-rating-badge {
          position: absolute;
          top: 14px; right: 14px;
          display: flex; align-items: center; gap: 4px;
          padding: 5px 10px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border-radius: 100px;
          font-size: 12px; font-weight: 800;
          color: var(--ink);
          border: 1px solid rgba(255,255,255,0.4);
          font-family: 'Nunito', sans-serif;
        }

        .hcard-rating-badge svg { color: #d97706; }

        /* Occupancy pill — bottom of image */
        .hcard-occ-pill {
          position: absolute;
          bottom: 12px; right: 12px;
          font-size: 11px; font-weight: 700;
          padding: 4px 10px;
          border-radius: 100px;
          background: rgba(10,20,14,0.7);
          color: rgba(255,255,255,0.9);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          font-family: 'Nunito', sans-serif;
        }

        /* ── CARD BODY ── */
        .hcard-body {
          padding: 20px 20px 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .hcard-name {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 6px;
          line-height: 1.2;
          transition: color 0.2s;
        }

        .hcard:hover .hcard-name { color: var(--emerald-d); }

        .hcard-loc {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; color: var(--muted);
          font-weight: 600;
          margin-bottom: 14px;
        }

        /* Amenity chips */
        .hcard-amenities {
          display: flex; flex-wrap: wrap; gap: 5px;
          margin-bottom: 16px;
        }

        .hcard-amenity {
          display: flex; align-items: center; gap: 4px;
          padding: 3px 9px;
          background: var(--bg-2);
          border-radius: 100px;
          font-size: 11px; font-weight: 600;
          color: var(--muted-2);
          border: 1px solid var(--border);
          transition: background 0.2s, border-color 0.2s;
        }

        .hcard:hover .hcard-amenity {
          background: rgba(5,150,105,0.06);
          border-color: rgba(5,150,105,0.18);
        }

        /* Occupancy bar */
        .hcard-occ-bar {
          margin-bottom: 16px;
        }

        .hcard-occ-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 6px;
        }

        .hcard-occ-label {
          font-size: 11px; font-weight: 700;
          color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.8px;
          font-family: 'Nunito', sans-serif;
        }

        .hcard-occ-num {
          font-size: 11px; font-weight: 800;
          color: var(--emerald-d);
          font-family: 'Nunito', sans-serif;
        }

        .hcard-occ-track {
          height: 5px;
          background: rgba(5,150,105,0.1);
          border-radius: 100px;
          overflow: hidden;
        }

        .hcard-occ-fill {
          height: 100%;
          background: var(--gv);
          border-radius: 100px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ── CARD FOOTER ── */
        .hcard-footer {
          padding: 14px 20px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          border-top: 1px solid var(--border);
        }

        .hcard-price-wrap {}
        .hcard-price-from {
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1px;
          color: var(--muted);
          font-family: 'Nunito', sans-serif;
        }
        .hcard-price {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 900;
          color: var(--ink);
          line-height: 1.1;
        }
        .hcard-price span {
          font-family: 'Nunito', sans-serif;
          font-size: 11px; font-weight: 600;
          color: var(--muted);
        }

        .hcard-cta {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 16px;
          border-radius: 10px;
          background: var(--gv);
          color: white;
          font-size: 12px; font-weight: 800;
          font-family: 'Nunito', sans-serif;
          border: none; cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 12px rgba(5,150,105,0.3);
          white-space: nowrap;
        }

        .hcard-cta:hover {
          transform: translateX(3px);
          box-shadow: 0 6px 18px rgba(5,150,105,0.45);
        }

        /* ── BOTTOM ROW ── */
        .hostels-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        /* Summary stats strip */
        .hostel-summary-strip {
          display: flex;
          align-items: center;
          gap: 0;
          background: var(--white);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(5,150,105,0.06);
        }

        .hss-item {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 22px;
          border-right: 1px solid var(--border);
        }

        .hss-item:last-child { border-right: none; }

        .hss-ico {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: rgba(5,150,105,0.08);
          display: flex; align-items: center; justify-content: center;
          color: var(--emerald);
          flex-shrink: 0;
        }

        .hss-val {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 900;
          color: var(--ink); line-height: 1;
          margin-bottom: 2px;
        }

        .hss-lbl {
          font-size: 11px; font-weight: 700;
          color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.8px;
          font-family: 'Nunito', sans-serif;
        }

        /* View all button */
        .hostels-view-all {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px;
          border-radius: 12px;
          background: var(--gv);
          color: white;
          font-size: 14px; font-weight: 800;
          font-family: 'Nunito', sans-serif;
          transition: all 0.25s;
          box-shadow: 0 6px 18px rgba(5,150,105,0.3);
          text-decoration: none;
        }

        .hostels-view-all:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(5,150,105,0.42);
        }

        .hostels-view-all-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 24px;
          border-radius: 12px;
          background: transparent;
          color: var(--emerald-d);
          font-size: 14px; font-weight: 800;
          font-family: 'Nunito', sans-serif;
          transition: all 0.25s;
          border: 1.5px solid var(--border-2);
          text-decoration: none;
        }

        .hostels-view-all-ghost:hover {
          border-color: var(--emerald);
          background: rgba(5,150,105,0.05);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1200px) {
          .feat-grid { grid-template-columns: repeat(2,1fr); }
          .hostels-grid { grid-template-columns: repeat(2,1fr); }
          .footer-top { grid-template-columns: repeat(3,1fr); }
        }
        @media (max-width: 1024px) {
          .proc-grid { grid-template-columns: repeat(2,1fr); }
          .hero-inner { grid-template-columns: 1fr; gap: 48px; text-align: center; }
          .hero-sub, .section-p { margin-left: auto; margin-right: auto; }
          .hero-actions, .hero-nums { justify-content: center; }
          .hero-visual { max-width: 560px; margin: 0 auto; }
          .hero-chip-1, .hero-chip-2 { display: none; }
          .nav-center { display: none; }
          .nav-hamburger { display: flex; }
          .hostels-head { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 768px) {
          .nav { padding: 0 24px; }
          .hero { padding: calc(var(--nav-h) + 40px) 24px 60px; }
          .section, .hostels-section { padding: 64px 24px; }
          .stats-band { padding: 48px 24px; }
          .stats-grid { grid-template-columns: repeat(2,1fr); }
          .feat-grid, .proc-grid, .pricing-grid, .contact-grid { grid-template-columns: 1fr; }
          .hostels-grid { grid-template-columns: 1fr; }
          .faq-grid { grid-template-columns: 1fr; }
          .footer-top { grid-template-columns: 1fr 1fr; gap: 32px; }
          .cta-band { padding: 64px 24px; }
          .footer { padding: 48px 24px 24px; }
          .footer-form { flex-direction: column; }
          .hero-nums { flex-direction: column; gap: 16px; align-items: center; }
          .hero-num-div { display: none; }
          .hostel-summary-strip { flex-wrap: wrap; }
          .hostels-bottom { flex-direction: column; align-items: stretch; }
          .hostels-bottom > * { width: 100%; justify-content: center; }
        }
      `}</style>

     
      <nav className={`nav ${scrollY > 40 ? 'stuck' : ''}`}>
        <div className="nav-logo">CampusFlow</div>
        <ul className="nav-center">
          {["Home","Features","How It Works","Pricing","Testimonials","Contact"].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase().replace(/\s+/g,'-').replace("'","")}`} className="nav-link">{item}</a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <Link to="/login" className="btn-ghost">Log In</Link>
          <Link to="/register" className="btn-pill">Sign Up <ArrowRight size={15}/></Link>
          <button className="nav-hamburger" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={20}/>
          </button>
        </div>
      </nav>

     
      <div className={`mob-overlay ${mobileMenuOpen ? 'open':''}`} onClick={() => setMobileMenuOpen(false)} />
      <div className={`mob-panel ${mobileMenuOpen ? 'open':''}`}>
        <div className="mob-head">
          <div className="nav-logo" style={{fontSize:'18px'}}>CampusFlow</div>
          <button className="mob-close" onClick={() => setMobileMenuOpen(false)}><X size={18}/></button>
        </div>
        <ul className="mob-links">
          {["Home","Features","How It Works","Pricing","Testimonials","Contact"].map((item) => (
            <li key={item}><a href={`#${item.toLowerCase().replace(/\s+/g,'-')}`} onClick={() => setMobileMenuOpen(false)}>{item}</a></li>
          ))}
        </ul>
        <div className="mob-btns">
          <Link to="/login" className="btn-ghost" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
          <Link to="/register" className="btn-pill" onClick={() => setMobileMenuOpen(false)}>Sign Up Free</Link>
        </div>
      </div>

      
      <section className="hero" id="home">
        <div className="hero-mesh"/>
        <div className="hero-dots"/>
        <div className="hero-leaf-1"/>
        <div className="hero-leaf-2"/>
        <div className="hero-inner">
          <div>
            <div className="hero-badge fade-up">
              <span className="hero-badge-chip">NEW</span>
              <span className="hero-badge-txt">Trusted by 500+ institutions worldwide</span>
            </div>
            <h1 className="hero-h1 fade-up delay-1">
              The Smarter Way to<br/>
              <span className="grad">Manage Your Campus</span>
            </h1>
            <p className="hero-sub fade-up delay-2">
              Streamline operations, enhance security, and improve communication between students, parents, and staff — all in one powerful platform.
            </p>
           <div className="hero-actions fade-up delay-3">
  <button onClick={() => navigate('/login')} className="hero-cta">
    Get Started Free <ArrowRight size={16}/>
  </button>
  <a href="#demo" className="hero-demo">
    <Play size={16}/> Watch Demo
  </a>
</div>
            <div className="hero-nums fade-up delay-4">
              {[["500+","Institutions","↑ 25%"],["50K+","Students","↑ 40%"],["98%","Satisfaction","↑ 5%"]].map(([v,l,c],i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div className="hero-num-div"/>}
                  <div>
                    <div className="hero-num-val">{v}</div>
                    <div className="hero-num-lbl">{l}</div>
                    <div className="hero-num-chg">{c}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="hero-visual fade-up delay-2">
            <div className="hero-img-wrap">
              <img src="https://res.cloudinary.com/dncdvsywu/image/upload/v1772031081/dormitory1_hwritv.png" alt="CampusFlow dashboard"/>
              <div className="hero-img-tint"/>
            </div>
            <div className="hero-chip hero-chip-1">
              <div className="chip-icon"><Users size={18}/></div>
              <div>
                <div className="chip-label">50K+ Students</div>
                <div className="chip-sub">Active users today</div>
              </div>
            </div>
            <div className="hero-chip hero-chip-2">
              <div className="chip-icon"><Shield size={18}/></div>
              <div>
                <div className="chip-label">24/7 Security</div>
                <div className="chip-sub">Real-time monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <div className="ticker">
        <div className="ticker-label">Trusted by leading institutions worldwide</div>
        <div className="ticker-row">
          {[1,2].map((_, ri) => (
            <div className="ticker-track" key={ri} aria-hidden={ri > 0}>
              {partnerNames.concat(partnerNames).map((name, i) => (
                <div className="ticker-item" key={i}>
                  <div className="ticker-dot"/>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      
      <section className="hostels-section" id="hostels">
        <div className="hostels-inner">

        
          <div className="hostels-head">
            <div className="hostels-head-left">
              <div className="hostels-kicker">
                <div className="hostels-kicker-dot"/>
                Our Residences
              </div>
              <h2 className="hostels-title">
                Choose Your<br/>
                <span className="grad">Perfect Stay</span>
              </h2>
              <p className="hostels-subtitle">
                Premium on-campus residences built for comfort, safety, and academic excellence.
              </p>
            </div>

          
            <div className="hostels-filters">
              {filterTypes.map(f => (
                <button
                  key={f}
                  className={`hf-tab ${hostelFilter === f ? 'active' : ''}`}
                  onClick={() => setHostelFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

        
          <div className="hostels-grid">
            {filteredHostels.map((hostel) => {
              const occPct = Math.round((hostel.currentOccupancy / hostel.capacity) * 100);
              const isBoys = hostel.type === "Boys Hostel";
              const topAmenities = hostel.amenities.slice(0, 3);

              return (
                <div
                  key={hostel.id}
                  className="hcard"
                  onClick={() => navigate('/hostels')}
                  onMouseEnter={() => setHoveredHostel(hostel.id)}
                  onMouseLeave={() => setHoveredHostel(null)}
                >
                 
                  <div className="hcard-img-zone">
                    <img src={hostel.image} alt={hostel.name} />
                    <div className="hcard-img-gradient" />

                   
                    <div className={`hcard-type-badge ${isBoys ? 'boys' : 'girls'}`}>
                      <div className="hcard-type-dot"/>
                      {hostel.type}
                    </div>

                   
                    <div className="hcard-rating-badge">
                      <Star size={11} fill="#d97706" color="#d97706"/>
                      {hostel.rating}
                      <span style={{fontSize:'10px', color:'#94a3b8', fontWeight:600}}>({hostel.reviews})</span>
                    </div>

                    
                    <div className="hcard-occ-pill">
                      {hostel.currentOccupancy}/{hostel.capacity} occupied
                    </div>
                  </div>

                
                  <div className="hcard-body">
                    <h3 className="hcard-name">{hostel.name}</h3>

                    <div className="hcard-loc">
                      <MapPin size={11}/>
                      {hostel.location} · {hostel.distance}
                    </div>

                  
                    <div className="hcard-amenities">
                      {topAmenities.map((a, i) => (
                        <div key={i} className="hcard-amenity">
                          <span style={{fontSize:'11px'}}>{amenityIcons[a] || '✓'}</span>
                          {a}
                        </div>
                      ))}
                      {hostel.amenities.length > 3 && (
                        <div className="hcard-amenity">
                          +{hostel.amenities.length - 3} more
                        </div>
                      )}
                    </div>

                    
                    <div className="hcard-occ-bar">
                      <div className="hcard-occ-header">
                        <span className="hcard-occ-label">Occupancy</span>
                        <span className="hcard-occ-num">{occPct}%</span>
                      </div>
                      <div className="hcard-occ-track">
                        <div
                          className="hcard-occ-fill"
                          style={{ width: `${occPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="hcard-footer">
                    <div className="hcard-price-wrap">
                      <div className="hcard-price-from">Starting from</div>
                      <div className="hcard-price">
                        {hostel.priceRange.split(' - ')[0]}
                        <span>/mo</span>
                      </div>
                    </div>
                    <button className="hcard-cta">
                      View Details
                      <ArrowRight size={13}/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          
          <div className="hostels-bottom">
            <div className="hostel-summary-strip">
              {[
                { icon: <Building2 size={16}/>, val: "8", lbl: "Residences" },
                { icon: <Users size={16}/>, val: "1,570+", lbl: "Capacity" },
                { icon: <Shield size={16}/>, val: "24/7", lbl: "Security" },
                { icon: <Star size={16}/>, val: "4.6★", lbl: "Avg Rating" },
              ].map((s, i) => (
                <div key={i} className="hss-item">
                  <div className="hss-ico">{s.icon}</div>
                  <div>
                    <div className="hss-val">{s.val}</div>
                    <div className="hss-lbl">{s.lbl}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/hostels" className="hostels-view-all-ghost">
                Compare All Hostels <ChevronRight size={15}/>
              </Link>
              <Link to="/hostels" className="hostels-view-all">
                Browse All 8 Hostels <ArrowRight size={15}/>
              </Link>
            </div>
          </div>

        </div>
      </section>

   
      <section className="section features-sec" id="features">
        <div className="section-inner">
          <div className="section-head-center">
            <div className="section-eyebrow">✦ Features</div>
            <h2 className="section-h2">Everything You Need to <span className="grad">Succeed</span></h2>
            <p className="section-p">Comprehensive solutions designed for modern educational institutions of every size.</p>
          </div>
          <div className="feat-grid">
            {features.map((f, i) => (
              <div className="feat-card" key={i}>
                <div className="feat-img">
                  <img src={f.image} alt={f.title}/>
                  <div className="feat-ico">{f.icon}</div>
                </div>
                <div className="feat-body">
                  <div className="feat-title">{f.title}</div>
                  <div className="feat-desc">{f.desc}</div>
                  <div className="feat-badge"><Zap size={11}/> {f.stats}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"/>

      
      <div className="stats-band">
        <div className="stats-band-inner">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div className="stat-box" key={i}>
                <div className="stat-ico-wrap">{s.icon}</div>
                <div className="stat-val">{s.value}</div>
                <div className="stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

     
      <section className="section process-sec" id="how-it-works">
        <div className="section-inner">
          <div className="section-head-center">
            <div className="section-eyebrow">⚡ How It Works</div>
            <h2 className="section-h2">Up & Running in <span className="grad">4 Simple Steps</span></h2>
            <p className="section-p">Get started in minutes with our intuitive onboarding workflow and dedicated support team.</p>
          </div>
          <div className="proc-grid">
            {steps.map((s, i) => (
              <div className="proc-card" key={i}>
                <div className="proc-num">{s.number}</div>
                <div className="proc-img">
                  <img src={s.image} alt={s.title}/>
                </div>
                <div className="proc-body">
                  <div className="proc-head">
                    <div className="proc-ico">{s.icon}</div>
                    <div className="proc-title">{s.title}</div>
                  </div>
                  <div className="proc-desc">{s.desc}</div>
                  <div className="proc-time"><Clock size={12}/> Takes {s.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"/>

     
      <section className="section pricing-sec" id="pricing">
        <div className="section-inner">
          <div className="section-head-center">
            <div className="section-eyebrow">💎 Pricing</div>
            <h2 className="section-h2">Choose the <span className="grad">Right Plan</span></h2>
            <p className="section-p">Flexible, transparent pricing for institutions of all sizes. No hidden fees, ever.</p>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((p, i) => (
              <div className={`price-card ${p.popular ? 'hot' : ''}`} key={i}>
                {p.popular && <div className="hot-tag">Most Popular</div>}
                <div className="price-name">{p.name}</div>
                <div className="price-desc-sm">{p.desc}</div>
                <div>
                  <span className="price-amount">{p.price}</span>
                  <span className="price-period">{p.period}</span>
                </div>
                <div className="price-divider"/>
                <div className="price-feats">
                  {p.features.map((feat, fi) => (
                    <div className="price-feat" key={fi}>
                      <CheckCircle size={15} className="pf-check"/>
                      {feat}
                    </div>
                  ))}
                </div>
                <button className={`price-btn ${p.popular ? 'price-btn-primary' : 'price-btn-ghost'}`}>
                  {p.price === "Custom" ? "Contact Sales" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="section testi-sec" id="testimonials">
        <div className="section-inner">
          <div className="section-head-center">
            <div className="section-eyebrow">💬 Testimonials</div>
            <h2 className="section-h2">Loved by <span className="grad">Institutions Worldwide</span></h2>
            <p className="section-p">Hear from principals, parents, and IT directors who've transformed their campuses.</p>
          </div>
          <div className="testi-wrap">
            <div className="testi-slider">
              {testimonials.map((t, i) => (
                <div className={`testi-slide ${i === activeTestimonial ? 'on' : ''}`} key={i}>
                  <div className="testi-card">
                    <div className="testi-top">
                      <div className="testi-ava"><img src={t.image} alt={t.name}/></div>
                      <div>
                        <div className="testi-name">{t.name}</div>
                        <div className="testi-role">{t.role}</div>
                        <div className="testi-stars">
                          {Array(t.rating).fill(0).map((_,si) => <Star key={si} size={14} fill="currentColor"/>)}
                        </div>
                      </div>
                    </div>
                    <p className="testi-q">"{t.content}"</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="testi-dots">
              {testimonials.map((_,i) => (
                <button className={`testi-dot ${i===activeTestimonial?'on':''}`} key={i} onClick={() => setActiveTestimonial(i)}/>
              ))}
            </div>
          </div>
        </div>
      </section>

     
      <section className="section faq-sec" id="faq">
        <div className="section-inner">
          <div className="section-head-center">
            <div className="section-eyebrow">❓ FAQ</div>
            <h2 className="section-h2">Frequently Asked <span className="grad">Questions</span></h2>
            <p className="section-p">Everything you need to know about CampusFlow before getting started.</p>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, i) => (
              <div className={`faq-item ${activeFaq === i ? 'open' : ''}`} key={i} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <div className="faq-q">
                  <span className="faq-q-txt">{faq.question}</span>
                  <ChevronDown size={18} className="faq-chevron"/>
                </div>
                {activeFaq === i && <div className="faq-ans">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <div className="cta-band">
        <div className="cta-glow"/>
        <div className="cta-ring"/><div className="cta-ring-2"/>
        <div className="cta-inner">
          <div className="cta-badge">🚀 Get Started Today</div>
          <h2 className="cta-h">Ready to Transform Your Campus?</h2>
          <p className="cta-sub">Join 500+ institutions already using CampusFlow to streamline operations and improve communication.</p>
          <div className="cta-btns">
  <button onClick={() => navigate('/login')} className="cta-btn-p">
    Start Free Trial
  </button>
  <button onClick={() => navigate('/contact')} className="cta-btn-s">
    Contact Sales
  </button>
</div>
        </div>
      </div>

     
      <section className="section contact-sec" id="contact">
        <div className="section-inner">
          <div className="section-head-center">
            <div className="section-eyebrow">📞 Contact</div>
            <h2 className="section-h2">We're Here to <span className="grad">Help</span></h2>
            <p className="section-p">Questions, demos, or support — our team is ready around the clock.</p>
          </div>
          <div className="contact-grid">
            {[
              { icon: <Mail size={22}/>, title: "Email Us", val: "hello@campusflow.com", note: "24/7 response" },
              { icon: <Phone size={22}/>, title: "Call Us", val: "+1 (555) 123-4567", note: "Mon–Fri, 9am–6pm EST" },
              { icon: <MapPin size={22}/>, title: "Visit Us", val: "123 Campus Road", note: "Silicon Valley, CA 94025" },
            ].map((c, i) => (
              <div className="contact-card" key={i}>
                <div className="contact-ico-wrap">{c.icon}</div>
                <div className="contact-ttl">{c.title}</div>
                <div className="contact-val">{c.val}</div>
                <div className="contact-note">{c.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;