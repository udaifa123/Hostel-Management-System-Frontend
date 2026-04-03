import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin, Users, Star, ArrowRight, Phone, Mail,
  Calendar, BedDouble, CheckCircle, Building2,
  Shield, Clock, Search, X, Coffee, Dumbbell, 
  Car, Zap, Headphones, Heart, ChevronLeft
} from "lucide-react";

// The full 8-hostel dataset integrated for CampusFlow
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

const Hostels = () => {
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = selectedHostel ? 'hidden' : 'unset';
  }, [selectedHostel]);

  const filtered = HOSTELS_DATA.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || h.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || h.type.toLowerCase().includes(filter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* --- ELEGANT HERO --- */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
            CampusFlow Accommodation
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 font-serif tracking-tight leading-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Perfect Space</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Discover 8 premium hostels designed to provide comfort, security, and a vibrant student community.
          </p>
        </div>
      </section>

      {/* --- STICKY NAV FILTERS --- */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6">
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, location, or amenities..."
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full lg:w-auto">
            {['all', 'boys', 'girls'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`flex-1 lg:flex-none px-8 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                  filter === type ? 'bg-white text-emerald-700 shadow-md shadow-emerald-900/5' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- GRID LAYOUT --- */}
      <main className="max-w-7xl mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.length > 0 ? filtered.map((hostel) => (
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
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute top-5 left-5">
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-emerald-900 text-[10px] font-black uppercase tracking-tighter rounded-full shadow-sm">
                    {hostel.type}
                  </span>
                </div>
                <div className="absolute bottom-5 right-5 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Star size={14} className="text-amber-400 fill-amber-400" /> {hostel.rating}
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2 font-serif text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight">{hostel.name}</h3>
                <div className="flex items-center text-slate-400 text-sm gap-4 mb-8">
                  <span className="flex items-center gap-1.5"><MapPin size={16} className="text-emerald-500"/> {hostel.location}</span>
                </div>

                {/* Occupancy Indicator */}
                <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                    <span>Availability</span>
                    <span className={hostel.capacity - hostel.currentOccupancy < 15 ? 'text-rose-500' : 'text-emerald-600'}>
                      {hostel.capacity - hostel.currentOccupancy} Vacant
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${(hostel.currentOccupancy / hostel.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Starting</span>
                    <span className="text-xl font-black text-slate-900 leading-none">{hostel.priceRange.split(' - ')[0]}<small className="text-xs font-normal text-slate-400">/mo</small></span>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-emerald-600 transition-all duration-300">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center">
              <Building2 size={64} className="mx-auto text-slate-200 mb-4" />
              <h2 className="text-2xl font-bold text-slate-400 font-serif">No Hostels Found</h2>
              <p className="text-slate-400">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </main>

      {/* --- DETAILED MODAL --- */}
      {selectedHostel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 md:px-10">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setSelectedHostel(null)} />
          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/20">
            
            {/* BACK BUTTON */}
            <button 
              onClick={() => setSelectedHostel(null)}
              className="absolute top-8 left-8 z-50 flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full transition-all border border-white/20 text-sm font-bold backdrop-blur-md"
            >
              <ChevronLeft size={18} /> Back
            </button>

            {/* CLOSE BUTTON */}
            <button 
              onClick={() => setSelectedHostel(null)}
              className="absolute top-8 right-8 z-50 p-3 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full transition-all border border-white/20"
            >
              <X size={24} />
            </button>
            
            <div className="w-full md:w-1/2 h-80 md:h-auto overflow-hidden">
              <img
                src={selectedHostel.image}
                className="w-full h-full object-cover"
                alt={selectedHostel.name}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
            
            <div className="w-full md:w-1/2 p-10 md:p-14 overflow-y-auto">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-lg">Verified</span>
                <span className="text-slate-400 text-sm flex items-center gap-1 tracking-tight font-medium"><Clock size={14}/> {selectedHostel.distance} from Campus</span>
              </div>
              
              <h2 className="text-4xl font-bold mb-4 font-serif text-slate-900">{selectedHostel.name}</h2>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium">{selectedHostel.description}</p>
              
              <div className="grid grid-cols-2 gap-y-6 mb-10 border-y border-slate-100 py-8">
                <div>
                  <h4 className="text-[10px] uppercase font-black text-slate-400 mb-3 tracking-widest">Warden</h4>
                  <p className="font-bold flex items-center gap-2 text-slate-800"><Users size={18} className="text-emerald-500"/> {selectedHostel.warden}</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-slate-400 mb-3 tracking-widest">Contact</h4>
                  <p className="font-bold flex items-center gap-2 text-slate-800"><Phone size={18} className="text-emerald-500"/> {selectedHostel.contact}</p>
                </div>
              </div>

              <div className="mb-10">
                <h4 className="text-[10px] uppercase font-black text-slate-400 mb-4 tracking-widest">Available Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedHostel.amenities.map(a => (
                    <span key={a} className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
                      <CheckCircle size={14} className="text-emerald-500" /> {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* APPLY NOW BUTTON */}
              <div className="sticky bottom-0 bg-white pt-4">
                <button 
                  className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95"
                  onClick={() => navigate("/register", { state: { hostel: selectedHostel } })}
                >
                  Apply Now • {selectedHostel.priceRange.split(' - ')[0]}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hostels;