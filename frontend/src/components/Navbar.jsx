import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Menu, X, GraduationCap, LogOut, User, Compass, FileText, LayoutDashboard, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => 
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive(path) 
        ? 'bg-indigo-50 text-indigo-600' 
        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
    }`;

  const mobileLinkClass = (path) =>
    `flex items-center gap-2.5 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
      isActive(path)
        ? 'bg-indigo-50 text-indigo-600'
        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 transition-transform group-hover:scale-105">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                MentorBridge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {!user ? (
              <>
                <Link to="/" className={linkClass('/')}>Home</Link>
                <Link to="/login" className={linkClass('/login')}>Login</Link>
                <Link 
                  to="/register" 
                  className="ml-2 px-4.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {user.role === 'mentee' ? (
                  <>
                    <Link to="/mentee-dashboard" className={linkClass('/mentee-dashboard')}>
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/search" className={linkClass('/search')}>
                      <Compass className="w-4 h-4" /> Find Mentors
                    </Link>
                    <Link to="/my-requests" className={linkClass('/my-requests')}>
                      <FileText className="w-4 h-4" /> My Requests
                    </Link>
                  </>
                ) : user.role === 'admin' ? (
                  <>
                    <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
                      <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                    </Link>
                    <Link to="/admin/users" className={linkClass('/admin/users')}>
                      <FileText className="w-4 h-4" /> Manage Users
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/mentor-dashboard" className={linkClass('/mentor-dashboard')}>
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/incoming-requests" className={linkClass('/incoming-requests')}>
                      <FileText className="w-4 h-4" /> Incoming Requests
                    </Link>
                  </>
                )}
                
                {user.role !== 'admin' && (
                  <Link to="/profile/edit" className={linkClass('/profile/edit')}>
                    <Settings className="w-4 h-4" /> Edit Profile
                  </Link>
                )}

                <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>

                <div className="flex items-center gap-3 pl-2">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-bold text-slate-800 leading-none">{user.fullName}</span>
                    <span className="text-[11px] font-semibold text-slate-400 capitalize">{user.role}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm uppercase">
                    {user.fullName.charAt(0)}
                  </div>
                  <button 
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-6 space-y-2 animate-slide-in">
          {!user ? (
            <>
              <Link to="/" onClick={() => setIsOpen(false)} className={mobileLinkClass('/')}>Home</Link>
              <Link to="/login" onClick={() => setIsOpen(false)} className={mobileLinkClass('/login')}>Login</Link>
              <Link 
                to="/register" 
                onClick={() => setIsOpen(false)}
                className="block text-center mt-4 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-xl shadow-md transition-colors"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 mb-2">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base uppercase">
                  {user.fullName.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-slate-800 leading-tight">{user.fullName}</span>
                  <span className="text-xs font-semibold text-slate-400 capitalize">{user.role}</span>
                </div>
              </div>

              {user.role === 'mentee' ? (
                <>
                  <Link to="/mentee-dashboard" onClick={() => setIsOpen(false)} className={mobileLinkClass('/mentee-dashboard')}>
                    <LayoutDashboard className="w-5 h-5 mr-1" /> Dashboard
                  </Link>
                  <Link to="/search" onClick={() => setIsOpen(false)} className={mobileLinkClass('/search')}>
                    <Compass className="w-5 h-5 mr-1" /> Find Mentors
                  </Link>
                  <Link to="/my-requests" onClick={() => setIsOpen(false)} className={mobileLinkClass('/my-requests')}>
                    <FileText className="w-5 h-5 mr-1" /> My Requests
                  </Link>
                </>
              ) : user.role === 'admin' ? (
                <>
                  <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className={mobileLinkClass('/admin/dashboard')}>
                    <LayoutDashboard className="w-5 h-5 mr-1" /> Admin Dashboard
                  </Link>
                  <Link to="/admin/users" onClick={() => setIsOpen(false)} className={mobileLinkClass('/admin/users')}>
                    <FileText className="w-5 h-5 mr-1" /> Manage Users
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/mentor-dashboard" onClick={() => setIsOpen(false)} className={mobileLinkClass('/mentor-dashboard')}>
                    <LayoutDashboard className="w-5 h-5 mr-1" /> Dashboard
                  </Link>
                  <Link to="/incoming-requests" onClick={() => setIsOpen(false)} className={mobileLinkClass('/incoming-requests')}>
                    <FileText className="w-5 h-5 mr-1" /> Incoming Requests
                  </Link>
                </>
              )}
              
              {user.role !== 'admin' && (
                <Link to="/profile/edit" onClick={() => setIsOpen(false)} className={mobileLinkClass('/profile/edit')}>
                  <Settings className="w-5 h-5 mr-1" /> Edit Profile
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-base font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-1" /> Log Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
