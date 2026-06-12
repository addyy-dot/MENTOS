import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, ShieldCheck, Calendar, Users, Award, BookOpen } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 sm:pt-24 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold mb-6 animate-float">
              <Award className="w-4 h-4" /> Connect with Verified Alumni & Seniors
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Bridge the Gap Between{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Preparation
              </span>{' '}
              and{' '}
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Placement
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              MentorBridge links students with verified seniors and alumni working in top companies. Get Mock Interviews, Resume Reviews, and real-time Placement Guidance.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Join as Student <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-2xl shadow-sm hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Become a Mentor
              </Link>
            </div>
          </div>

          {/* Feature Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
            {[
              { num: '500+', label: 'Verified Mentors', color: 'indigo' },
              { num: '2000+', label: 'Sessions Completed', color: 'violet' },
              { num: '98%', label: 'Success Rate', color: 'emerald' },
              { num: '50+', label: 'Partner Companies', color: 'fuchsia' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center">
                <div className="text-3xl font-extrabold text-slate-800">{stat.num}</div>
                <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How MentorBridge Works</h2>
            <p className="mt-4 text-slate-500 font-medium">Simple 4-step process to connect and crack your dream placements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Register Profile',
                desc: 'Sign up as a mentee or mentor. Provide your domain skills, branch, target companies, or work experience.',
                icon: <Users className="w-6 h-6 text-indigo-600" />,
              },
              {
                step: '02',
                title: 'Search & Connect',
                desc: 'Mentees search mentors by company, expertise, or stack and submit a session prep request.',
                icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
              },
              {
                step: '03',
                title: 'Schedule Session',
                desc: 'Once a mentor accepts, they set a session slot and provide a direct Google Meet link.',
                icon: <Calendar className="w-6 h-6 text-indigo-600" />,
              },
              {
                step: '04',
                title: 'Conduct & Review',
                desc: 'Conduct the placement guidance slot, mark it completed, and share feedback ratings.',
                icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
              },
            ].map((item, idx) => (
              <div key={idx} className="relative group bg-slate-50 border border-slate-100 hover:border-indigo-100 p-8 rounded-3xl shadow-sm transition-all duration-300">
                <div className="absolute top-6 right-8 text-4xl font-black text-slate-200/50 group-hover:text-indigo-200/50 transition-colors">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md mb-6">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
