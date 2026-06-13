import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">

          {/* Logo & Info column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Logo light={true} showTagline={true} iconSize="h-8 w-8" />
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Connecting engineering students with seniors, alumni, and industry professionals through structured mentorship and meaningful career guidance.
            </p>
          </div>

          {/* Column 1: Platform */}
          <div>
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
                <Link to="/register" className="hover:text-white transition-colors">
                  Become a Mentor
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Community */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">Success Stories</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Army Institute of Technolgy, Dighi Hills, Pune - 411015</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <a href="mailto:adharshreddy1611@gmail.com" className="hover:text-white transition-colors">adharshreddy1611@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>+91-8328645801</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>© MENTos. Built by Students, for Students.</span>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link to="/" className="hover:text-slate-400 transition-colors">Privacy Settings</Link>
            <Link to="/" className="hover:text-slate-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

