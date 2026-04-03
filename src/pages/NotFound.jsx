import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, AlertCircle, ArrowLeft, Search, Frown } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 leading-none animate-pulse">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Frown size={80} className="text-indigo-600 opacity-20" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <AlertCircle size={60} className="text-indigo-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
        </div>

        {/* Search Suggestions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-md mx-auto">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
            <Search size={18} />
            Looking for something?
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            <Link 
              to="/dashboard" 
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm hover:bg-blue-200 transition"
            >
              Dashboard
            </Link>
            <Link 
              to="/attendance" 
              className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm hover:bg-green-200 transition"
            >
              Attendance
            </Link>
            <Link 
              to="/leaves" 
              className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm hover:bg-yellow-200 transition"
            >
              Leaves
            </Link>
            <Link 
              to="/messages" 
              className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm hover:bg-purple-200 transition"
            >
              Messages
            </Link>
            <Link 
              to="/profile" 
              className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm hover:bg-pink-200 transition"
            >
              Profile
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>

        {/* Fun Facts */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Fun fact: This error page has been visited 404 times! 😄</p>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default NotFound;