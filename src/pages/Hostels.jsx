import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
import {
  MapPin, Users, Star, ArrowRight, Phone, Mail,
  Calendar, BedDouble, CheckCircle, Building2,
  Shield, Clock, Search, X, Coffee, Dumbbell,
  Car, Zap, Headphones, Heart, ChevronLeft,
  Wifi, UtensilsCrossed, BookOpen, Waves,
  Trophy, TreePine, Sparkles, ChevronRight,
  Eye, TrendingUp, Award, Grid3X3
} from "lucide-react";

const HOSTELS_DATA = [
  {
    id: 1,
    name: "Oakwood Hostel",
    type: "Boys Hostel",
    location: "North Campus",
    capacity: 250,
    currentOccupancy: 210,
    warden: "Mr. John Smith",
    contact: "2345678901",
    email: "Oakwood@campus.com",
    image: "https://res.cloudinary.com/dncdvsywu/image/upload/v1774688863/boyshstl_ml6n8o.jpg",
    amenities: ["WiFi", "Mess", "Gym", "Laundry"],
    priceRange: "$200 - $400",
    rating: 4.5,
    reviews: 128,
    distance: "0.5 km",
    description: "Modern hostel with state-of-the-art facilities, located in the heart of North Campus."
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
    amenities: ["WiFi", "Mess", "Library", "Garden"],
    priceRange: "$180 - $350",
    rating: 4.8,
    reviews: 156,
    distance: "0.8 km",
    description: "Beautiful hostel overlooking the lake. Safe and secure environment with 24/7 security."
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
    amenities: ["WiFi", "Gym", "Study Room", "Game Room"],
    priceRange: "$220 - $500",
    rating: 4.3,
    reviews: 203,
    distance: "0.2 km",
    description: "High-rise hostel in the center of campus. Close to all academic buildings."
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
    amenities: ["WiFi", "Mess", "Garden", "Laundry"],
    priceRange: "$200 - $280",
    rating: 4.6,
    reviews: 89,
    distance: "1.2 km",
    description: "Cozy hostel with beautiful garden views. Homely atmosphere and caring staff."
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
    amenities: ["Swimming Pool", "Tennis Court", "WiFi", "Gym"],
    priceRange: "$300 - $600",
    rating: 4.7,
    reviews: 92,
    distance: "0.3 km",
    description: "Premium hostel with luxury amenities. Perfect for athletes and sports enthusiasts."
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
    amenities: ["WiFi", "Beauty Salon", "Library", "Mess"],
    priceRange: "$190 - $320",
    rating: 4.9,
    reviews: 178,
    distance: "0.4 km",
    description: "Peaceful and secure environment with all modern amenities for girl students."
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
    amenities: ["Basketball Court", "WiFi", "Mess", "Game Room"],
    priceRange: "$180 - $450",
    rating: 4.4,
    reviews: 167,
    distance: "0.6 km",
    description: "Affordable yet comfortable hostel with excellent study facilities."
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
    amenities: ["Organic Food", "Yoga Room", "WiFi", "Garden"],
    priceRange: "$220 - $380",
    rating: 4.7,
    reviews: 112,
    distance: "0.3 km",
    description: "Modern hostel with eco-friendly design and organic food options."
  }
];

const ACTIVITIES = [
  {
    id: 1,
    title: "Gym & Fitness",
    description: "State-of-the-art equipment, personal training sessions, and daily fitness classes.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    tag: "Health",
    tagColor: "emerald",
    hours: "5AM – 11PM",
    icon: "💪"
  },
  {
    id: 2,
    title: "Swimming Pool",
    description: "Olympic-size heated pool with lane swimming, aqua aerobics, and casual open swim.",
    image: "https://res.cloudinary.com/dncdvsywu/image/upload/q_auto/f_auto/v1776321940/pool_lra16j.webp",
    tag: "Sports",
    tagColor: "blue",
    hours: "6AM – 10PM",
    icon: "🏊"
  },
  {
    id: 3,
    title: "Basketball Court",
    description: "Full-size indoor courts for pickup games, tournaments, and practice sessions.",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
    tag: "Sports",
    tagColor: "blue",
    hours: "7AM – 10PM",
    icon: "🏀"
  },
  {
    id: 4,
    title: "Tennis Courts",
    description: "4 floodlit courts available for booking. Coaching available on weekends.",
    image: "https://res.cloudinary.com/dncdvsywu/image/upload/q_auto/f_auto/v1776322367/tennis_sgbmdb.jpg",
    tag: "Sports",
    tagColor: "blue",
    hours: "6AM – 9PM",
    icon: "🎾"
  },
  {
    id: 5,
    title: "Library & Study Rooms",
    description: "24/7 silent study zones, group discussion rooms, and a vast collection of resources.",
    image: "https://res.cloudinary.com/dncdvsywu/image/upload/q_auto/f_auto/v1776322431/library_adbj35.webp",
    tag: "Academics",
    tagColor: "violet",
    hours: "24/7",
    icon: "📚"
  },
  {
    id: 6,
    title: "Cafeteria & Mess",
    description: "Nutritious multi-cuisine meals, vegetarian & non-veg options, and special diet menus.",
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=800&q=80",
    tag: "Dining",
    tagColor: "amber",
    hours: "6AM – 10:30PM",
    icon: "🍽️"
  },
  {
    id: 7,
    title: "Yoga & Meditation",
    description: "Dedicated yoga studio with guided morning sessions, wellness programs, and mindfulness classes.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    tag: "Wellness",
    tagColor: "teal",
    hours: "5:30AM – 8PM",
    icon: "🧘"
  },
  {
    id: 8,
    title: "Game Room",
    description: "Table tennis, carrom, pool, foosball, and gaming consoles for recreational fun.",
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=800&q=80",
    tag: "Recreation",
    tagColor: "rose",
    hours: "10AM – 11PM",
    icon: "🎮"
  }
];

const AMENITY_ICONS = {
  "WiFi": { icon: <Wifi size={14} />, bg: "bg-blue-50 text-blue-700 border-blue-100" },
  "Mess": { icon: <UtensilsCrossed size={14} />, bg: "bg-amber-50 text-amber-700 border-amber-100" },
  "Gym": { icon: <Dumbbell size={14} />, bg: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  "Laundry": { icon: <Sparkles size={14} />, bg: "bg-violet-50 text-violet-700 border-violet-100" },
  "Library": { icon: <BookOpen size={14} />, bg: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  "Garden": { icon: <TreePine size={14} />, bg: "bg-green-50 text-green-700 border-green-100" },
  "Study Room": { icon: <BookOpen size={14} />, bg: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  "Game Room": { icon: <Trophy size={14} />, bg: "bg-rose-50 text-rose-700 border-rose-100" },
  "Swimming Pool": { icon: <Waves size={14} />, bg: "bg-cyan-50 text-cyan-700 border-cyan-100" },
  "Tennis Court": { icon: <Award size={14} />, bg: "bg-orange-50 text-orange-700 border-orange-100" },
  "Beauty Salon": { icon: <Sparkles size={14} />, bg: "bg-pink-50 text-pink-700 border-pink-100" },
  "Basketball Court": { icon: <Trophy size={14} />, bg: "bg-orange-50 text-orange-700 border-orange-100" },
  "Organic Food": { icon: <UtensilsCrossed size={14} />, bg: "bg-green-50 text-green-700 border-green-100" },
  "Yoga Room": { icon: <Heart size={14} />, bg: "bg-teal-50 text-teal-700 border-teal-100" },
};

const getAmenityStyle = (amenity) =>
  AMENITY_ICONS[amenity] || { icon: <CheckCircle size={14} />, bg: "bg-slate-50 text-slate-600 border-slate-100" };

const TAG_COLORS = {
  emerald: "bg-emerald-100 text-emerald-800",
  blue: "bg-blue-100 text-blue-800",
  violet: "bg-violet-100 text-violet-800",
  amber: "bg-amber-100 text-amber-800",
  teal: "bg-teal-100 text-teal-800",
  rose: "bg-rose-100 text-rose-800",
};

const StatsBar = () => (
  <section className="bg-white border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        { label: "Total Hostels", value: "8", icon: <Building2 size={22} className="text-emerald-500" />, sub: "Boys & Girls" },
        { label: "Total Capacity", value: "1,570", icon: <Users size={22} className="text-blue-500" />, sub: "Beds available" },
        { label: "Avg. Rating", value: "4.6★", icon: <Star size={22} className="text-amber-500" />, sub: "Student reviews" },
        { label: "Activities", value: "8+", icon: <Trophy size={22} className="text-violet-500" />, sub: "Sports & wellness" },
      ].map((s) => (
        <div key={s.label} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            {s.icon}
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-none">{s.value}</p>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const ActivitiesSection = () => {
  const [activeActivity, setActiveActivity] = useState(null);

  return (
    <section className="max-w-7xl mx-auto px-6 mt-20 mb-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-black text-emerald-500 mb-2 block">Campus Life</span>
          <h2 className="text-4xl font-black font-serif text-slate-900 tracking-tight leading-tight">
            World-Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Activities</span>
          </h2>
          <p className="text-slate-500 mt-2 max-w-md">Everything you need for a balanced student life — sports, wellness, dining, and more.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
          <Grid3X3 size={16} />
          <span>{ACTIVITIES.length} facilities on campus</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ACTIVITIES.map((activity) => (
          <div
            key={activity.id}
            onClick={() => setActiveActivity(activity)}
            className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-[0_20px_40px_-10px_rgba(5,150,105,0.15)] hover:border-emerald-200 transition-all duration-300 cursor-pointer"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${TAG_COLORS[activity.tagColor] || 'bg-slate-100 text-slate-700'}`}>
                  {activity.tag}
                </span>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="text-2xl">{activity.icon}</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                <Clock size={10} /> {activity.hours}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-emerald-700 transition-colors">{activity.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{activity.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                  <Eye size={12} /> View Details
                </span>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveActivity(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative h-60">
              <img src={activeActivity.image} alt={activeActivity.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
              <button
                onClick={() => setActiveActivity(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full transition-all backdrop-blur-md"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-4 left-5">
                <span className="text-3xl">{activeActivity.icon}</span>
                <h3 className="text-white text-2xl font-bold mt-1">{activeActivity.title}</h3>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${TAG_COLORS[activeActivity.tagColor] || 'bg-slate-100 text-slate-700'}`}>
                  {activeActivity.tag}
                </span>
                <span className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                  <Clock size={14} className="text-emerald-500" /> {activeActivity.hours}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{activeActivity.description}</p>
              <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-emerald-800 text-xs font-bold uppercase tracking-widest mb-1">Availability</p>
                <p className="text-emerald-700 text-sm font-medium">Open to all registered hostel residents. No advance booking required for most facilities.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const HostelModal = ({ hostel, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const occupancyPct = Math.round((hostel.currentOccupancy / hostel.capacity) * 100);
  const vacant = hostel.capacity - hostel.currentOccupancy;
  const isAlmostFull = vacant < 15;

  const tabs = ["overview", "amenities", "contact"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 md:px-10">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[3rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/20">

        <button onClick={onClose} className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full transition-all border border-white/20 text-sm font-bold backdrop-blur-md">
          <ChevronLeft size={16} /> Back
        </button>
        <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2.5 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full transition-all border border-white/20 backdrop-blur-md">
          <X size={22} />
        </button>

        <div className="w-full md:w-[45%] flex flex-col">
          <div className="relative h-72 md:h-80 overflow-hidden">
            <img src={hostel.image} className="w-full h-full object-cover" alt={hostel.name}
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"; }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
              <div>
                <span className="block text-white/80 text-xs font-bold uppercase tracking-wider">{hostel.type}</span>
                <span className="text-white text-xl font-black font-serif">{hostel.name}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5">
                <Star size={14} className="text-amber-400 fill-amber-400" /> {hostel.rating}
                <span className="text-white/60 text-xs">({hostel.reviews})</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-5 bg-slate-50 border-t border-slate-100 flex-1">
            {[
              { label: "Total Beds", value: hostel.capacity, icon: <BedDouble size={18} className="text-emerald-500" /> },
              { label: "Occupied", value: hostel.currentOccupancy, icon: <Users size={18} className="text-blue-500" /> },
              { label: "Vacant Now", value: vacant, icon: <TrendingUp size={18} className={isAlmostFull ? "text-rose-500" : "text-emerald-500"} /> },
              { label: "Distance", value: hostel.distance, icon: <MapPin size={18} className="text-violet-500" /> },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">{s.icon}</div>
                <div>
                  <p className="text-lg font-black text-slate-900 leading-none">{s.value}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 pb-5 bg-slate-50">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              <span>Occupancy</span>
              <span className={isAlmostFull ? "text-rose-500" : "text-emerald-600"}>{occupancyPct}% Filled</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isAlmostFull ? "bg-rose-400" : "bg-emerald-500"}`}
                style={{ width: `${occupancyPct}%` }}
              />
            </div>
            {isAlmostFull && (
              <p className="text-rose-500 text-xs font-bold mt-2 flex items-center gap-1">
                <Zap size={12} /> Only {vacant} spots left — Apply soon!
              </p>
            )}
          </div>
        </div>

        <div className="w-full md:w-[55%] flex flex-col">
          <div className="flex gap-1 p-5 pb-0 border-b border-slate-100">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-t-xl text-xs font-black uppercase tracking-widest transition-all capitalize ${
                  activeTab === tab
                    ? "bg-white border border-slate-100 border-b-white text-emerald-700 -mb-px"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8 md:p-10 overflow-y-auto flex-1">

            {activeTab === "overview" && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-lg flex items-center gap-1.5">
                    <Shield size={12} /> Verified Hostel
                  </span>
                  <span className="text-slate-400 text-sm flex items-center gap-1.5 font-medium">
                    <Clock size={14} className="text-slate-400" /> {hostel.distance} from Campus
                  </span>
                </div>

                <h2 className="text-3xl font-bold mb-3 font-serif text-slate-900">{hostel.name}</h2>
                <p className="text-slate-500 leading-relaxed mb-6">{hostel.description}</p>

                <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 mb-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Monthly Fee Range</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-emerald-700">{hostel.priceRange.split(' - ')[0]}</span>
                    <span className="text-slate-400 text-sm">to</span>
                    <span className="text-2xl font-black text-slate-700">{hostel.priceRange.split(' - ')[1]}</span>
                    <span className="text-slate-400 text-sm">/ month</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-lg">
                    {hostel.warden.split(' ').pop()[0]}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Warden</p>
                    <p className="font-bold text-slate-900">{hostel.warden}</p>
                    <p className="text-xs text-slate-400">{hostel.type} • {hostel.location}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "amenities" && (
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">Available Amenities</h3>
                <p className="text-slate-400 text-sm mb-6">All facilities included in your monthly fee.</p>
                <div className="grid grid-cols-2 gap-3">
                  {hostel.amenities.map((a) => {
                    const style = getAmenityStyle(a);
                    return (
                      <div key={a} className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-sm font-bold ${style.bg}`}>
                        <span className="shrink-0">{style.icon}</span>
                        {a}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Also Available On Campus</p>
                  <div className="flex flex-wrap gap-2">
                    {["24/7 Security", "CCTV Surveillance", "Hot Water", "Power Backup", "Medical Room", "Parking"].map((f) => (
                      <span key={f} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle size={11} className="text-emerald-500" /> {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-900 mb-6">Contact & Info</h3>
                <div className="space-y-4">
                  {[
                    { label: "Warden Name", value: hostel.warden, icon: <Users size={18} className="text-emerald-500" /> },
                    { label: "Phone Number", value: hostel.contact, icon: <Phone size={18} className="text-blue-500" /> },
                    { label: "Email Address", value: hostel.email, icon: <Mail size={18} className="text-violet-500" /> },
                    { label: "Location", value: hostel.location, icon: <MapPin size={18} className="text-rose-500" /> },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{item.label}</p>
                        <p className="font-bold text-slate-800 text-sm">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1">Office Hours</p>
                  <p className="text-emerald-800 text-sm font-medium">Monday – Saturday: 9:00 AM – 6:00 PM</p>
                  <p className="text-emerald-600 text-xs mt-1">For urgent queries, call the warden directly.</p>
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white p-5 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              Close
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Hostels = () => {
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  // const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = selectedHostel ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedHostel]);

  let filtered = HOSTELS_DATA.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.amenities.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === "all" || h.type.toLowerCase().includes(filter);
    return matchesSearch && matchesFilter;
  });

  if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else if (sortBy === "price") filtered = [...filtered].sort((a, b) => parseInt(a.priceRange) - parseInt(b.priceRange));
  else if (sortBy === "vacancy") filtered = [...filtered].sort((a, b) => (b.capacity - b.currentOccupancy) - (a.capacity - a.currentOccupancy));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">

      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
            CampusFlow Accommodation
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 font-serif tracking-tight leading-tight">
            Find Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Perfect Space
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Discover 8 premium hostels designed to provide comfort, security, and a vibrant student community.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {["8 Hostels", "1,570 Beds", "4.6★ Avg Rating", "24/7 Security"].map((s) => (
              <div key={s} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-white/80 backdrop-blur-md">
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatsBar />

      <ActivitiesSection />

      <div className="max-w-7xl mx-auto px-6 mt-16 mb-4">
        <div className="border-t border-slate-200" />
      </div>

      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-4">
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, location, or amenity..."
              className="w-full pl-11 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl">
            {["all", "boys", "girls"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                  filter === type ? "bg-white text-emerald-700 shadow-md" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="rating">Sort: Top Rated</option>
            <option value="vacancy">Sort: Most Vacant</option>
            <option value="price">Sort: Lowest Price</option>
          </select>

          <span className="text-slate-400 text-sm font-bold whitespace-nowrap">
            {filtered.length} hostel{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <div className="mb-6">
          <h2 className="text-3xl font-black font-serif text-slate-900 tracking-tight">
            Browse Hostels
          </h2>
          <p className="text-slate-400 text-sm mt-1">Click any hostel to view full details, amenities, and apply.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.length > 0 ? filtered.map((hostel) => {
            const vacant = hostel.capacity - hostel.currentOccupancy;
            const isAlmostFull = vacant < 15;
            return (
              <div
                key={hostel.id}
                onClick={() => setSelectedHostel(hostel)}
                className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(5,150,105,0.15)] hover:border-emerald-500/20 transition-all duration-500 cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={hostel.image}
                    alt={hostel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                  <div className="absolute top-5 left-5 flex gap-2">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-emerald-900 text-[10px] font-black uppercase tracking-tighter rounded-full shadow-sm">
                      {hostel.type}
                    </span>
                    {isAlmostFull && (
                      <span className="px-3 py-1.5 bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-tighter rounded-full shadow-sm">
                        Almost Full
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-5 right-5 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <Star size={12} className="text-amber-400 fill-amber-400" /> {hostel.rating}
                    <span className="text-white/60">({hostel.reviews})</span>
                  </div>
                </div>

                <div className="p-7">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold font-serif text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight leading-tight">
                      {hostel.name}
                    </h3>
                  </div>
                  <div className="flex items-center text-slate-400 text-xs gap-3 mb-5">
                    <span className="flex items-center gap-1"><MapPin size={13} className="text-emerald-500" /> {hostel.location}</span>
                    <span className="flex items-center gap-1"><Clock size={13} /> {hostel.distance}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {hostel.amenities.slice(0, 3).map((a) => {
                      const style = getAmenityStyle(a);
                      return (
                        <span key={a} className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold border ${style.bg}`}>
                          {style.icon} {a}
                        </span>
                      );
                    })}
                    {hostel.amenities.length > 3 && (
                      <span className="flex items-center px-2.5 py-1 rounded-xl text-[10px] font-bold border bg-slate-50 text-slate-500 border-slate-100">
                        +{hostel.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-1.5 tracking-widest">
                      <span>Availability</span>
                      <span className={isAlmostFull ? "text-rose-500" : "text-emerald-600"}>
                        {vacant} Vacant
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isAlmostFull ? "bg-rose-400" : "bg-emerald-500"}`}
                        style={{ width: `${(hostel.currentOccupancy / hostel.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Starting</span>
                      <span className="text-xl font-black text-slate-900 leading-none">
                        {hostel.priceRange.split(" - ")[0]}
                        <small className="text-xs font-normal text-slate-400">/mo</small>
                      </span>
                    </div>
                    <div className="h-11 w-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-emerald-600 transition-all duration-300">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full py-20 text-center">
              <Building2 size={64} className="mx-auto text-slate-200 mb-4" />
              <h2 className="text-2xl font-bold text-slate-400 font-serif">No Hostels Found</h2>
              <p className="text-slate-400 text-sm">Try adjusting your search or filters.</p>
              <button onClick={() => { setSearchTerm(""); setFilter("all"); setSortBy("default"); }}
                className="mt-4 px-6 py-2.5 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-colors">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {selectedHostel && (
        <HostelModal
          hostel={selectedHostel}
          onClose={() => setSelectedHostel(null)}
        />
      )}
    </div>
  );
};

export default Hostels;