// import React, { Fragment } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Menu, Transition } from '@headlessui/react';
// import { 
//   Bars3Icon, 
//   BellIcon, 
//   UserCircleIcon,
//   ArrowRightOnRectangleIcon,
//   Cog6ToothIcon
// } from '@heroicons/react/24/outline';
// import { useAuth } from '../../context/AuthContext';

// const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
//       <div className="px-3 py-3 lg:px-5 lg:pl-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center justify-start">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
//             >
//               <Bars3Icon className="w-6 h-6" />
//             </button>
//             <Link to="/" className="flex ml-2 md:mr-24">
//               <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-primary-600">
//                 CampusFlow
//               </span>
//             </Link>
//           </div>

//           <div className="flex items-center gap-3">
//             {/* Notifications */}
//             <button className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100">
//               <BellIcon className="w-6 h-6" />
//             </button>

//             {/* Profile dropdown */}
//             <Menu as="div" className="relative">
//               <Menu.Button className="flex items-center text-sm rounded-full focus:ring-4 focus:ring-gray-200">
//                 <span className="sr-only">Open user menu</span>
//                 <div className="flex items-center gap-2">
//                   <UserCircleIcon className="w-8 h-8 text-gray-600" />
//                   <span className="hidden lg:block text-gray-700">{user?.name}</span>
//                 </div>
//               </Menu.Button>

//               <Transition
//                 as={Fragment}
//                 enter="transition ease-out duration-100"
//                 enterFrom="transform opacity-0 scale-95"
//                 enterTo="transform opacity-100 scale-100"
//                 leave="transition ease-in duration-75"
//                 leaveFrom="transform opacity-100 scale-100"
//                 leaveTo="transform opacity-0 scale-95"
//               >
//                 <Menu.Items className="absolute right-0 z-50 w-48 mt-2 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
//                   <Menu.Item>
//                     {({ active }) => (
//                       <Link
//                         to="/profile"
//                         className={`${
//                           active ? 'bg-gray-100' : ''
//                         } block px-4 py-2 text-sm text-gray-700`}
//                       >
//                         <UserCircleIcon className="w-5 h-5 inline mr-2" />
//                         Profile
//                       </Link>
//                     )}
//                   </Menu.Item>
//                   <Menu.Item>
//                     {({ active }) => (
//                       <Link
//                         to="/settings"
//                         className={`${
//                           active ? 'bg-gray-100' : ''
//                         } block px-4 py-2 text-sm text-gray-700`}
//                       >
//                         <Cog6ToothIcon className="w-5 h-5 inline mr-2" />
//                         Settings
//                       </Link>
//                     )}
//                   </Menu.Item>
//                   <Menu.Item>
//                     {({ active }) => (
//                       <button
//                         onClick={handleLogout}
//                         className={`${
//                           active ? 'bg-gray-100' : ''
//                         } block w-full text-left px-4 py-2 text-sm text-gray-700`}
//                       >
//                         <ArrowRightOnRectangleIcon className="w-5 h-5 inline mr-2" />
//                         Sign out
//                       </button>
//                     )}
//                   </Menu.Item>
//                 </Menu.Items>
//               </Transition>
//             </Menu>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;