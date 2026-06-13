import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">

          {/* Logo & Info column */}
          <div className="md:col-span-6 space-y-4">
            <Link to="/" className="inline-block" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Logo light={true} showTagline={true} iconSize="h-8 w-8" />
            </Link>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Connecting engineering students with seniors, alumni, and industry professionals through structured mentorship and meaningful career guidance.
            </p>
          </div>

          {/* Column 1: Platform */}
          <div className="md:col-span-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); handleScroll('how-it-works'); }} className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#mentors" onClick={(e) => { e.preventDefault(); handleScroll('mentors'); }} className="hover:text-white transition-colors">
                  Find Mentors
                </a>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Join as Student
                </Link>
              </li>
              <li>
                <Link to="/register?role=mentor" className="hover:text-white transition-colors">
                  Become a Mentor
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Contact */}
          <div className="md:col-span-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Army Institute of Technology, Dighi Hills, Pune - 411015</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <a href="mailto:adharshreddy1611@gmail.com" className="hover:text-white transition-colors">adharshreddy1611@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <a href="https://github.com/addyy-dot" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <a href="https://www.linkedin.com/in/adharsh-reddy-513aba288?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} MENTos. Built by Students, for Students. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

