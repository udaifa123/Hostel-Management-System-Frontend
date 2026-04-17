import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ClockIcon,
  EnvelopeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ sidebarOpen, setSidebarOpen, userRole }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, roles: ['admin', 'staff', 'warden', 'student', 'parent'] },
    { name: 'Students', href: '/students', icon: UsersIcon, roles: ['admin', 'staff', 'warden'] },
    { name: 'Dormitories', href: '/dormitories', icon: BuildingOfficeIcon, roles: ['admin', 'staff', 'warden', 'student'] },
    { name: 'Attendance', href: '/attendance', icon: CalendarIcon, roles: ['admin', 'staff', 'warden', 'student', 'parent'] },
    { name: 'Leaves', href: '/leaves', icon: ClockIcon, roles: ['admin', 'staff', 'warden', 'student', 'parent'] },
    { name: 'Visitors', href: '/visitors', icon: UserGroupIcon, roles: ['admin', 'security', 'warden'] },
    { name: 'Messages', href: '/messages', icon: EnvelopeIcon, roles: ['admin', 'staff', 'warden', 'student', 'parent'] },
    { name: 'Parent Portal', href: '/parent', icon: UsersIcon, roles: ['parent'] },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon, roles: ['admin', 'staff', 'warden'] },
  ];

  const filteredNav = navigation.filter(item => item.roles.includes(userRole));

  return (
    <>
     
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

     
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {filteredNav.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      isActive ? 'bg-primary-50 text-primary-600' : ''
                    }`
                  }
                  end={item.href === '/'}
                >
                  <item.icon className={`w-5 h-5 transition duration-75 ${
                    ({ isActive }) => isActive ? 'text-primary-600' : 'text-gray-500'
                  }`} />
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;