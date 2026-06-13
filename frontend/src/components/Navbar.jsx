import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Menu, X, LogOut, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { getInitials } from '../utils/initials';


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const handleScrollTo = (id) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const linkClass = (active) =>
    `px-3.5 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
      active
        ? 'bg-blue-950/60 text-blue-400 font-bold'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/45'
    }`;

  const mobileLinkClass = (active) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-bold transition-all duration-200 ${
      active
        ? 'bg-blue-950/60 text-blue-400'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/45'
    }`;

  const renderGuestLinks = () => (
    <>
      <button
        onClick={() => handleScrollTo('hero')}
        className={linkClass(location.pathname === '/' && !location.hash)}
      >
        Home
      </button>
      <button
        onClick={() => handleScrollTo('how-it-works')}
        className={linkClass(false)}
      >
        How it Works
      </button>
      <button
        onClick={() => handleScrollTo('mentors')}
        className={linkClass(false)}
      >
        Mentors
      </button>
    </>
  );

  return (
    <div className="sticky top-0 z-50 w-full flex flex-col font-sans">


      {/* Main Sticky Navbar */}
      <nav
        className={`w-full bg-[#0F172A] border-b border-slate-800 transition-all duration-200 ${
          isScrolled ? 'shadow-lg shadow-black/10' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left Brand Logo */}
            <div className="flex items-center">
              <Link to="/">
                <Logo light={true} showTagline={true} iconSize="h-8 w-8" />
              </Link>
            </div>

            {/* Center Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center gap-1">
              {!user ? (
                renderGuestLinks()
              ) : (
                <>
                  {user.role === 'mentee' ? (
                    <>
                      <Link to="/mentee-dashboard" className={linkClass(isActive('/mentee-dashboard'))}>
                        Dashboard
                      </Link>
                      <Link to="/search" className={linkClass(isActive('/search'))}>
                        Find Mentors
                      </Link>
                      <Link to="/my-requests" className={linkClass(isActive('/my-requests'))}>
                        My Requests
                      </Link>
                    </>
                  ) : user.role === 'admin' ? (
                    <>
                      <Link to="/admin/dashboard" className={linkClass(isActive('/admin/dashboard'))}>
                        Admin Dashboard
                      </Link>
                      <Link to="/admin/users" className={linkClass(isActive('/admin/users'))}>
                        Manage Users
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/mentor-dashboard" className={linkClass(isActive('/mentor-dashboard'))}>
                        Dashboard
                      </Link>
                      <Link to="/incoming-requests" className={linkClass(isActive('/incoming-requests'))}>
                        Incoming Requests
                      </Link>
                    </>
                  )}
                  
                  {user.role !== 'admin' && (
                    <Link to="/profile/edit" className={linkClass(isActive('/profile/edit'))}>
                      Edit Profile
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Right CTAs (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-650 rounded-lg transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3 border-l border-slate-800 pl-3">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-bold text-slate-200 leading-none">{user.fullName}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-450 mt-1">{user.role}</span>
                  </div>
                  {/* User Avatar Circle */}
                  <div className="w-8 h-8 rounded-full bg-blue-955 text-blue-400 border border-blue-900/30 flex items-center justify-center font-bold text-sm uppercase overflow-hidden">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user.fullName)
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger menu */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors focus:outline-none"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#0F172A] px-4 pt-2 pb-6 space-y-1">
            {!user ? (
              <>
                <button
                  onClick={() => handleScrollTo('hero')}
                  className="w-full text-left flex items-center px-3 py-2.5 rounded-xl text-base font-semibold text-slate-300 hover:bg-slate-800/40"
                >
                  Home
                </button>
                <button
                  onClick={() => handleScrollTo('how-it-works')}
                  className="w-full text-left flex items-center px-3 py-2.5 rounded-xl text-base font-semibold text-slate-300 hover:bg-slate-800/40"
                >
                  How it Works
                </button>
                <button
                  onClick={() => handleScrollTo('mentors')}
                  className="w-full text-left flex items-center px-3 py-2.5 rounded-xl text-base font-semibold text-slate-300 hover:bg-slate-800/40"
                >
                  Mentors
                </button>
                
                <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block text-center w-full py-2.5 text-base font-semibold text-slate-305 border border-slate-700 rounded-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block text-center w-full py-2.5 text-base font-semibold text-white bg-blue-600 rounded-xl"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-3 py-3 border-b border-slate-800 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-950/60 text-blue-400 flex items-center justify-center font-bold text-base uppercase overflow-hidden">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user.fullName)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-slate-200 leading-tight">{user.fullName}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-405 mt-1">{user.role}</span>
                  </div>
                </div>

                {user.role === 'mentee' ? (
                  <>
                    <Link to="/mentee-dashboard" onClick={() => setIsOpen(false)} className={mobileLinkClass(isActive('/mentee-dashboard'))}>
                      Dashboard
                    </Link>
                    <Link to="/search" onClick={() => setIsOpen(false)} className={mobileLinkClass(isActive('/search'))}>
                      Find Mentors
                    </Link>
                    <Link to="/my-requests" onClick={() => setIsOpen(false)} className={mobileLinkClass(isActive('/my-requests'))}>
                      My Requests
                    </Link>
                  </>
                ) : user.role === 'admin' ? (
                  <>
                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className={mobileLinkClass(isActive('/admin/dashboard'))}>
                      Admin Dashboard
                    </Link>
                    <Link to="/admin/users" onClick={() => setIsOpen(false)} className={mobileLinkClass(isActive('/admin/users'))}>
                      Manage Users
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/mentor-dashboard" onClick={() => setIsOpen(false)} className={mobileLinkClass(isActive('/mentor-dashboard'))}>
                      Dashboard
                    </Link>
                    <Link to="/incoming-requests" onClick={() => setIsOpen(false)} className={mobileLinkClass(isActive('/incoming-requests'))}>
                      Incoming Requests
                    </Link>
                  </>
                )}
                
                {user.role !== 'admin' && (
                  <Link to="/profile/edit" onClick={() => setIsOpen(false)} className={mobileLinkClass(isActive('/profile/edit'))}>
                    Edit Profile
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-bold text-red-500 hover:bg-red-950/20 transition-colors"
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
