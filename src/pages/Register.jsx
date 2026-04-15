// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   User, Mail, Lock, Eye, EyeOff, ArrowRight, Building2, 
//   Phone, MapPin, Calendar, BookOpen, Hash, Users, GraduationCap,
//   Shield, Briefcase, Heart, Github, Twitter, Facebook, Headphones, Star, Zap
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import toast from 'react-hot-toast';

// const Register = () => {
//   const navigate = useNavigate();
//   const { register, login } = useAuth();
//   const [step, setStep] = useState(1);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'student',
//     phone: '',
//     address: '',
//     parentEmail: '',
//     rollNumber: '',
//     course: '',
//     semester: '',
//     batch: '',
//     dateOfBirth: '',
//     gender: '',
//     bloodGroup: '',
//     occupation: '',
//     relationship: '',
//     alternatePhone: '',
//     childrenCount: '',
//     employeeId: '',
//     department: '',
//     experience: '',
//     qualification: '',
//     joinedDate: ''
//   });

//   const roles = [
//     { 
//       id: 'student', 
//       label: 'Student', 
//       icon: GraduationCap, 
//       color: '#059669',
//       gradient: 'linear-gradient(135deg, #059669, #0d9488)',
//       description: 'Access attendance, fees, complaints & room details',
//       fields: ['rollNumber', 'course', 'semester', 'batch', 'dateOfBirth', 'gender', 'bloodGroup', 'parentEmail']
//     },
//     { 
//       id: 'parent', 
//       label: 'Parent', 
//       icon: Users, 
//       color: '#0d9488',
//       gradient: 'linear-gradient(135deg, #0d9488, #059669)',
//       description: 'Monitor your child\'s progress and communicate with staff',
//       fields: ['occupation', 'relationship', 'alternatePhone', 'childrenCount']
//     },
//     { 
//       id: 'warden', 
//       label: 'Warden', 
//       icon: Shield, 
//       color: '#d97706',
//       gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
//       description: 'Manage hostel, rooms, attendance & complaints',
//       fields: ['employeeId', 'department', 'experience', 'qualification', 'joinedDate']
//     }
//   ];

//   const courses = [
//     'B.Tech Computer Science',
//     'B.Tech Information Technology',
//     'B.Tech Electronics',
//     'B.Tech Mechanical',
//     'B.Tech Civil',
//     'M.Tech Computer Science',
//     'BCA',
//     'MCA',
//     'BBA',
//     'MBA',
//     'B.Sc Computer Science',
//     'M.Sc Computer Science'
//   ];

//   const departments = [
//     'Computer Science',
//     'Information Technology',
//     'Electronics',
//     'Mechanical',
//     'Civil',
//     'Administration',
//     'Security',
//     'Maintenance'
//   ];

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const validateStep1 = () => {
//     if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.address) {
//       toast.error('Please fill in all required fields');
//       return false;
//     }

//     if (formData.password.length < 6) {
//       toast.error('Password must be at least 6 characters');
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error('Please enter a valid email address');
//       return false;
//     }

//     const phoneRegex = /^\d{10}$/;
//     if (!phoneRegex.test(formData.phone)) {
//       toast.error('Please enter a valid 10-digit phone number');
//       return false;
//     }

//     return true;
//   };

//   const validateStep2 = () => {
//     const currentRole = roles.find(r => r.id === formData.role);

//     for (const field of currentRole.fields) {
//       if (!formData[field]) {
//         toast.error(`Please fill in ${field}`);
//         return false;
//       }
//     }

//     if (formData.role === "student" && !formData.parentEmail) {
//       toast.error("Please enter parent email");
//       return false;
//     }

//     return true;
//   };

//   const handleNext = () => {
//     if (step === 1 && validateStep1()) {
//       setStep(2);
//     }
//   };

//   const handlePrevious = () => {
//     setStep(step - 1);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (step === 1) {
//       handleNext();
//       return;
//     }

//     if (step === 2 && !validateStep2()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const registrationData = {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         role: formData.role,
//         phone: formData.phone,
//         address: formData.address
//       };

//       if (formData.role === 'student') {
//         registrationData.rollNumber = formData.rollNumber;
//         registrationData.course = formData.course;
//         registrationData.semester = Number(formData.semester);
//         registrationData.batch = formData.batch;
//         registrationData.dateOfBirth = formData.dateOfBirth;
//         registrationData.gender = formData.gender;
//         registrationData.bloodGroup = formData.bloodGroup;
//         registrationData.parentEmail = formData.parentEmail;
//       }
//       else if (formData.role === 'parent') {
//         registrationData.occupation = formData.occupation;
//         registrationData.relationship = formData.relationship;
//         registrationData.alternatePhone = formData.alternatePhone;
//         registrationData.childrenCount = formData.childrenCount;
//       }
//       else if (formData.role === 'warden') {
//         registrationData.employeeId = formData.employeeId;
//         registrationData.department = formData.department;
//         registrationData.experience = Number(formData.experience);
//         registrationData.qualification = formData.qualification;
//         registrationData.joinedDate = formData.joinedDate;
//       }

//       console.log('Registration data:', registrationData);

//       const registerResult = await register(registrationData);

//       if (registerResult && registerResult.success) {
//         toast.success('Registration successful! Logging you in...');
        
//         const loginResult = await login({
//           email: formData.email,
//           password: formData.password
//         });

//         if (loginResult && loginResult.success) {
//           toast.success(`Welcome, ${loginResult.user.name}!`);
          
//           switch(loginResult.user.role) {
//             case 'student':
//               navigate('/student/dashboard');
//               break;
//             case 'parent':
//               navigate('/parent/dashboard');
//               break;
//             case 'warden':
//               navigate('/warden/dashboard');
//               break;
//             case 'admin':
//               navigate('/admin/dashboard');
//               break;
//             default:
//               navigate('/dashboard');
//           }
//         } else {
//           toast.error('Auto-login failed. Please login manually.');
//           navigate('/login');
//         }
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
//       toast.error('Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const currentRole = roles.find(r => r.id === formData.role);

//   const renderStep1 = () => (
//     <div className="step step-1">
//       <h3 className="step-title">Basic Information</h3>
      
//       {/* Role Selection */}
//       <div className="role-grid">
//         {roles.map((role) => (
//           <button
//             key={role.id}
//             type="button"
//             className={`role-card ${formData.role === role.id ? 'active' : ''}`}
//             onClick={() => setFormData({ ...formData, role: role.id })}
//             style={{ borderColor: role.color }}
//           >
//             <div className="role-icon-wrapper" style={{ background: role.gradient }}>
//               <role.icon size={24} color="white" />
//             </div>
//             <h4>{role.label}</h4>
//             <p>{role.description}</p>
//           </button>
//         ))}
//       </div>

//       <div className="form-grid">
//         <div className="form-group">
//           <label>Full Name *</label>
//           <div className="input-wrapper">
//             <User size={18} className="input-icon" />
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter your full name"
//               required
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Email Address *</label>
//           <div className="input-wrapper">
//             <Mail size={18} className="input-icon" />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               required
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Phone Number *</label>
//           <div className="input-wrapper">
//             <Phone size={18} className="input-icon" />
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="10-digit phone number"
//               maxLength="10"
//               required
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Password *</label>
//           <div className="input-wrapper">
//             <Lock size={18} className="input-icon" />
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Min 6 characters"
//               required
//             />
//             <button
//               type="button"
//               className="password-toggle"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//         </div>

//         <div className="form-group full-width">
//           <label>Address *</label>
//           <div className="input-wrapper">
//             <MapPin size={18} className="input-icon" />
//             <input
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Enter your full address"
//               required
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderStudentFields = () => (
//     <div className="role-fields">
//       <h3 className="step-title">Student Details</h3>
//       <div className="form-grid">
//         <div className="form-group">
//           <label>Roll Number *</label>
//           <div className="input-wrapper">
//             <Hash size={18} className="input-icon" />
//             <input
//               type="text"
//               name="rollNumber"
//               value={formData.rollNumber}
//               onChange={handleChange}
//               placeholder="Enter roll number"
//               required
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Parent Email *</label>
//           <div className="input-wrapper">
//             <Mail size={18} className="input-icon" />
//             <input
//               type="email"
//               name="parentEmail"
//               value={formData.parentEmail}
//               onChange={handleChange}
//               placeholder="Enter parent email"
//               required
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Course *</label>
//           <div className="input-wrapper">
//             <BookOpen size={18} className="input-icon" />
//             <select
//               name="course"
//               value={formData.course}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Course</option>
//               {courses.map(course => (
//                 <option key={course} value={course}>{course}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Semester *</label>
//           <input
//             type="number"
//             name="semester"
//             value={formData.semester}
//             onChange={handleChange}
//             placeholder="1-8"
//             min="1"
//             max="8"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Batch *</label>
//           <input
//             type="text"
//             name="batch"
//             value={formData.batch}
//             onChange={handleChange}
//             placeholder="e.g., 2024-2028"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Date of Birth *</label>
//           <div className="input-wrapper">
//             <Calendar size={18} className="input-icon" />
//             <input
//               type="date"
//               name="dateOfBirth"
//               value={formData.dateOfBirth}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Gender *</label>
//           <select
//             name="gender"
//             value={formData.gender}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Blood Group</label>
//           <div className="input-wrapper">
//             <Heart size={18} className="input-icon" />
//             <select
//               name="bloodGroup"
//               value={formData.bloodGroup}
//               onChange={handleChange}
//             >
//               <option value="">Select Blood Group</option>
//               <option value="A+">A+</option>
//               <option value="A-">A-</option>
//               <option value="B+">B+</option>
//               <option value="B-">B-</option>
//               <option value="AB+">AB+</option>
//               <option value="AB-">AB-</option>
//               <option value="O+">O+</option>
//               <option value="O-">O-</option>
//             </select>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderParentFields = () => (
//     <div className="role-fields">
//       <h3 className="step-title">Parent Details</h3>
//       <div className="form-grid">
//         <div className="form-group">
//           <label>Occupation *</label>
//           <input
//             type="text"
//             name="occupation"
//             value={formData.occupation}
//             onChange={handleChange}
//             placeholder="Your occupation"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Relationship *</label>
//           <select
//             name="relationship"
//             value={formData.relationship}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Relationship</option>
//             <option value="father">Father</option>
//             <option value="mother">Mother</option>
//             <option value="guardian">Guardian</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Alternate Phone</label>
//           <div className="input-wrapper">
//             <Phone size={18} className="input-icon" />
//             <input
//               type="tel"
//               name="alternatePhone"
//               value={formData.alternatePhone}
//               onChange={handleChange}
//               placeholder="Alternate contact"
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Number of Children</label>
//           <input
//             type="number"
//             name="childrenCount"
//             value={formData.childrenCount}
//             onChange={handleChange}
//             placeholder="e.g., 2"
//             min="1"
//           />
//         </div>
//       </div>
//     </div>
//   );

//   const renderWardenFields = () => (
//     <div className="role-fields">
//       <h3 className="step-title">Warden Details</h3>
//       <div className="form-grid">
//         <div className="form-group">
//           <label>Employee ID *</label>
//           <input
//             type="text"
//             name="employeeId"
//             value={formData.employeeId}
//             onChange={handleChange}
//             placeholder="Enter employee ID"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Department *</label>
//           <select
//             name="department"
//             value={formData.department}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Department</option>
//             {departments.map(dept => (
//               <option key={dept} value={dept}>{dept}</option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Experience (years) *</label>
//           <input
//             type="number"
//             name="experience"
//             value={formData.experience}
//             onChange={handleChange}
//             placeholder="Years of experience"
//             min="0"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Qualification *</label>
//           <input
//             type="text"
//             name="qualification"
//             value={formData.qualification}
//             onChange={handleChange}
//             placeholder="e.g., M.Sc, B.Ed"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Joined Date *</label>
//           <div className="input-wrapper">
//             <Calendar size={18} className="input-icon" />
//             <input
//               type="date"
//               name="joinedDate"
//               value={formData.joinedDate}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="register-wrapper">
//       {/* Decorative Elements */}
//       <div className="register-bg">
//         <div className="bg-shape shape-1"></div>
//         <div className="bg-shape shape-2"></div>
//         <div className="bg-shape shape-3"></div>
//       </div>

//       <div className="register-container">
//         {/* Progress Bar */}
//         <div className="progress-bar">
//           <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
//             <span className="step-number">1</span>
//             <span className="step-label">Basic Info</span>
//           </div>
//           <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
//           <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
//             <span className="step-number">2</span>
//             <span className="step-label">Role Details</span>
//           </div>
//         </div>

//         {/* Main Form Card */}
//         <div className="form-card">
//           <div className="form-header">
//             <div className="hero-badge">
//               <span className="hero-badge-chip">✨</span>
//               <span className="hero-badge-txt">Join ILHAM Family</span>
//             </div>
//             <h2>Create Your Account</h2>
//             <p>Join our smart campus management system</p>
//             {step === 2 && currentRole && (
//               <div className="role-badge" style={{ background: currentRole.gradient }}>
//                 <currentRole.icon size={18} color="white" />
//                 <span>Registering as {currentRole.label}</span>
//               </div>
//             )}
//           </div>

//           <form onSubmit={handleSubmit} className="register-form">
//             {step === 1 && renderStep1()}
            
//             {step === 2 && (
//               <div className="step step-2">
//                 {formData.role === 'student' && renderStudentFields()}
//                 {formData.role === 'parent' && renderParentFields()}
//                 {formData.role === 'warden' && renderWardenFields()}
//               </div>
//             )}

//             <div className="form-actions">
//               {step > 1 && (
//                 <button
//                   type="button"
//                   onClick={handlePrevious}
//                   className="btn btn-secondary"
//                 >
//                   Back
//                 </button>
//               )}
              
//               <button
//                 type="submit"
//                 className="btn btn-primary"
//                 disabled={loading}
//                 style={{ background: currentRole?.gradient }}
//               >
//                 {loading ? (
//                   <>
//                     <span className="spinner"></span>
//                     Processing...
//                   </>
//                 ) : step === 1 ? (
//                   <>
//                     Next Step
//                     <ArrowRight size={18} />
//                   </>
//                 ) : (
//                   'Complete Registration'
//                 )}
//               </button>
//             </div>
//           </form>

//           <div className="form-footer">
//             <p>
//               Already have an account? <Link to="/login">Sign in</Link>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Styles remain the same */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=Nunito:wght@300;400;500;600;700;800&display=swap');

//         *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

//         :root {
//           --bg:        #f7faf8;
//           --bg-2:      #edf5f0;
//           --bg-3:      #ffffff;
//           --bg-4:      #e2ede6;
//           --ink:       #0f1f14;
//           --ink-2:     #1a3322;
//           --ink-3:     #284d38;
//           --muted:     #6b8f78;
//           --muted-2:   #4a7060;
//           --border:    rgba(5,150,105,0.12);
//           --border-2:  rgba(5,150,105,0.22);
//           --white:     #ffffff;
//           --off-white: #f0f7f3;
//           --emerald:   #059669;
//           --emerald-d: #047857;
//           --emerald-l: #34d399;
//           --teal:      #0d9488;
//           --teal-l:    #2dd4bf;
//           --amber:     #d97706;
//           --amber-l:   #fbbf24;
//           --rose:      #e11d48;
//           --gv:        linear-gradient(135deg, #059669, #0d9488);
//           --ga:        linear-gradient(135deg, #d97706, #f59e0b);
//           --ge:        linear-gradient(135deg, #047857, #059669);
//           --shadow-card: 0 1px 4px rgba(5,150,105,0.08), 0 8px 24px rgba(5,150,105,0.08);
//           --shadow-lg:   0 4px 8px rgba(5,150,105,0.1), 0 20px 40px rgba(5,150,105,0.1);
//           --shadow-xl:   0 8px 16px rgba(5,150,105,0.12), 0 40px 80px rgba(5,150,105,0.12);
//           --r:    12px;
//           --r-lg: 20px;
//           --r-xl: 28px;
//           --nav-h: 72px;
//         }

//         .register-wrapper {
//           min-height: 100vh;
//           background: var(--bg);
//           position: relative;
//           overflow: hidden;
//           padding: 40px 20px;
//           font-family: 'Nunito', sans-serif;
//         }

//         .register-bg {
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           z-index: 1;
//         }

//         .bg-shape {
//           position: absolute;
//           background: rgba(5,150,105,0.05);
//           border-radius: 50%;
//           animation: float 20s infinite;
//         }

//         .shape-1 {
//           width: 300px;
//           height: 300px;
//           top: -100px;
//           right: -100px;
//           background: radial-gradient(circle, rgba(5,150,105,0.1) 0%, transparent 70%);
//         }

//         .shape-2 {
//           width: 400px;
//           height: 400px;
//           bottom: -150px;
//           left: -150px;
//           animation-delay: -5s;
//           background: radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%);
//         }

//         .shape-3 {
//           width: 200px;
//           height: 200px;
//           top: 50%;
//           left: 30%;
//           animation-delay: -10s;
//           background: radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 70%);
//         }

//         @keyframes float {
//           0%, 100% { transform: translate(0, 0) rotate(0deg); }
//           25% { transform: translate(20px, 20px) rotate(5deg); }
//           50% { transform: translate(-20px, 10px) rotate(-5deg); }
//           75% { transform: translate(-10px, -20px) rotate(3deg); }
//         }

//         .register-container {
//           position: relative;
//           z-index: 10;
//           max-width: 800px;
//           margin: 0 auto;
//         }

//         .progress-bar {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-bottom: 40px;
//         }

//         .progress-step {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 8px;
//         }

//         .step-number {
//           width: 40px;
//           height: 40px;
//           background: rgba(5,150,105,0.2);
//           border: 2px solid rgba(5,150,105,0.3);
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: var(--emerald-d);
//           font-weight: 600;
//           transition: all 0.3s;
//         }

//         .progress-step.active .step-number {
//           background: var(--gv);
//           border-color: transparent;
//           color: white;
//         }

//         .step-label {
//           color: var(--ink);
//           font-size: 12px;
//           font-weight: 500;
//         }

//         .progress-line {
//           width: 100px;
//           height: 2px;
//           background: var(--border);
//           margin: 0 15px;
//           transition: all 0.3s;
//         }

//         .progress-line.active {
//           background: var(--gv);
//         }

//         .form-card {
//           background: var(--white);
//           border-radius: 30px;
//           padding: 40px;
//           box-shadow: var(--shadow-lg);
//         }

//         .form-header {
//           text-align: center;
//           margin-bottom: 30px;
//         }

//         .hero-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 6px 14px 6px 8px;
//           border-radius: 100px;
//           border: 1.5px solid var(--border);
//           background: rgba(5,150,105,0.07);
//           margin-bottom: 20px;
//         }

//         .hero-badge-chip {
//           background: var(--gv);
//           color: #fff;
//           font-size: 11px;
//           font-weight: 800;
//           padding: 3px 9px;
//           border-radius: 100px;
//         }

//         .hero-badge-txt {
//           font-size: 13px;
//           color: var(--emerald-d);
//           font-weight: 700;
//         }

//         .form-header h2 {
//           font-size: 32px;
//           color: var(--ink);
//           margin-bottom: 10px;
//           font-family: 'Playfair Display', serif;
//         }

//         .form-header p {
//           color: var(--muted);
//           font-size: 14px;
//         }

//         .role-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 8px 16px;
//           border-radius: 30px;
//           margin-top: 15px;
//           font-size: 14px;
//           font-weight: 500;
//           color: white;
//         }

//         .role-grid {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 15px;
//           margin-bottom: 30px;
//         }

//         .role-card {
//           padding: 20px;
//           border: 2px solid var(--border);
//           border-radius: 16px;
//           background: var(--white);
//           cursor: pointer;
//           transition: all 0.3s;
//           text-align: left;
//         }

//         .role-card:hover {
//           transform: translateY(-5px);
//           border-color: var(--emerald);
//           box-shadow: var(--shadow-lg);
//         }

//         .role-card.active {
//           border-color: var(--emerald);
//           background: rgba(5,150,105,0.02);
//         }

//         .role-icon-wrapper {
//           width: 48px;
//           height: 48px;
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-bottom: 15px;
//         }

//         .role-card h4 {
//           margin-bottom: 5px;
//           font-size: 16px;
//           font-weight: 700;
//           color: var(--ink);
//           font-family: 'Playfair Display', serif;
//         }

//         .role-card p {
//           font-size: 12px;
//           color: var(--muted);
//           line-height: 1.5;
//         }

//         .step-title {
//           font-size: 18px;
//           font-weight: 700;
//           color: var(--ink);
//           margin-bottom: 20px;
//           padding-bottom: 10px;
//           border-bottom: 2px solid var(--border);
//           font-family: 'Playfair Display', serif;
//         }

//         .form-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 20px;
//         }

//         .form-group.full-width {
//           grid-column: span 2;
//         }

//         .form-group label {
//           display: block;
//           margin-bottom: 8px;
//           font-size: 14px;
//           font-weight: 500;
//           color: var(--ink-2);
//         }

//         .input-wrapper {
//           position: relative;
//           display: flex;
//           align-items: center;
//         }

//         .input-icon {
//           position: absolute;
//           left: 12px;
//           color: var(--muted);
//         }

//         .input-wrapper input,
//         .input-wrapper select {
//           width: 100%;
//           padding: 12px 12px 12px 40px;
//           border: 2px solid var(--border);
//           border-radius: 10px;
//           font-size: 14px;
//           transition: all 0.3s;
//           background: var(--white);
//           color: var(--ink);
//         }

//         .input-wrapper input:focus,
//         .input-wrapper select:focus {
//           outline: none;
//           border-color: var(--emerald);
//           box-shadow: 0 0 0 3px rgba(5,150,105,0.1);
//         }

//         .input-wrapper input::placeholder {
//           color: var(--muted-2);
//         }

//         .password-toggle {
//           position: absolute;
//           right: 12px;
//           background: none;
//           border: none;
//           color: var(--muted);
//           cursor: pointer;
//         }

//         .role-fields {
//           animation: slideIn 0.3s ease;
//         }

//         @keyframes slideIn {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .form-actions {
//           display: flex;
//           gap: 15px;
//           margin-top: 30px;
//         }

//         .btn {
//           flex: 1;
//           padding: 14px;
//           border: none;
//           border-radius: 12px;
//           font-size: 16px;
//           font-weight: 600;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//           transition: all 0.3s;
//           font-family: 'Nunito', sans-serif;
//         }

//         .btn-primary {
//           color: white;
//         }

//         .btn-primary:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 10px 30px rgba(5,150,105,0.3);
//         }

//         .btn-secondary {
//           background: var(--bg-2);
//           color: var(--ink-2);
//           border: 1px solid var(--border);
//         }

//         .btn-secondary:hover {
//           background: var(--bg-4);
//         }

//         .btn:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//         }

//         .spinner {
//           width: 20px;
//           height: 20px;
//           border: 2px solid rgba(255,255,255,0.3);
//           border-top-color: white;
//           border-radius: 50%;
//           animation: spin 0.8s linear infinite;
//         }

//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }

//         .form-footer {
//           margin-top: 30px;
//           padding-top: 20px;
//           border-top: 1px solid var(--border);
//           text-align: center;
//         }

//         .form-footer p {
//           color: var(--muted-2);
//         }

//         .form-footer a {
//           color: var(--emerald);
//           text-decoration: none;
//           font-weight: 600;
//         }

//         .form-footer a:hover {
//           color: var(--emerald-d);
//         }

//         @media (max-width: 768px) {
//           .form-grid {
//             grid-template-columns: 1fr;
//           }
          
//           .form-group.full-width {
//             grid-column: span 1;
//           }
          
//           .role-grid {
//             grid-template-columns: 1fr;
//           }
          
//           .form-actions {
//             flex-direction: column;
//           }

//           .progress-line {
//             width: 50px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Register;