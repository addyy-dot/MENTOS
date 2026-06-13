import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Video, Calendar, ShieldCheck, Star, GitPullRequest } from 'lucide-react';

const Home = () => {
  const mentors = [
    {
      id: 1,
      name: 'Yashwanth Reddy',
      role: 'Associate Prodduct Manager',
      company: 'UKG',
      alumniContext: 'AIT Pune Alumni',
      academicDetails: 'B.E. Computer Science • 2026 Graduate',
      experience: '1 Year',
      sessions: 2,
      rating: 4.4,
      skills: ['Product Management', 'Agile & Scrum', 'Software Development Lifecycle (SDLC)', 'Amazon Web Services (AWS)']
    },
    {
      id: 2,
      name: 'Aman Kumar',
      role: 'Software Developer-I',
      company: 'Matercard',
      alumniContext: 'AIT Pune Alumni',
      academicDetails: 'B.E. Information Technology • 2026 Graduate',
      experience: '2 Years',
      sessions: 4,
      rating: 4.5,
      skills: ['DSA', 'Java', 'REST APIs', 'React', 'OOP', 'System Design']
    },
    {
      id: 3,
      name: 'Khushi Shah',
      role: 'Business Technology Solutions Associate',
      company: 'ZS Associates',
      alumniContext: 'AIT Pune Alumni',
      academicDetails: 'B.E. Computer Science • 2025 Graduate',
      experience: '2 Years',
      sessions: 7,
      rating: 4.8,
      skills: ['Python', 'SQL', 'Excel', 'OOP', 'System Design']
    },
    {
      id: 4,
      name: 'Abhishek Kumar',
      role: 'Software Developer-I',
      company: 'UBS',
      alumniContext: 'AIT Pune Alumni',
      academicDetails: 'B.E. Computer Science • 2026 Graduate',
      experience: '1 Year',
      sessions: 3,
      rating: 4.3,
      skills: ['Backend Development', 'C++', 'Data Structures', 'Operating Systems', 'Git', 'Linux', 'CI/CD']
    }
  ];

  return (
    <div className="w-full bg-[#0F172A] text-slate-300 font-sans">

      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-blue-950/20 to-[#0F172A] pt-16 pb-20 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-950/60 border border-blue-900/40 rounded-full text-blue-400 text-xs font-semibold mb-6">
            <span>Engineering Mentorship Network</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-3xl mx-auto">
            Find the Right Mentor for Your{' '}
            <span className="text-blue-500 font-extrabold">
              Career Journey
            </span>
          </h1>

          <p className="text-lg text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            Whether you're aiming for a specific tech stack, preparing for placements, or targeting your dream company, MENTos helps you discover and connect with seniors, alumni, and professionals who have already achieved what you're working towards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              Find Mentors <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 bg-[#1E293B] border border-slate-750 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center"
            >
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-[#111827] border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white">How MENTos works?</h2>
            <p className="mt-3 text-slate-450 text-sm">
              Get started with MENTos in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
            <div className="bg-[#1E293B] border border-slate-800/60 rounded-xl p-6 relative hover:shadow-md transition-all">
              <div className="text-3xl font-extrabold text-blue-500 mb-3">1</div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Create Account</h3>
              <p className="text-sm text-slate-400">Build your profile with your skills, interests, and career aspirations.</p>
            </div>

            <div className="bg-[#1E293B] border border-slate-800/60 rounded-xl p-6 relative hover:shadow-md transition-all">
              <div className="text-3xl font-extrabold text-blue-500 mb-3">2</div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Discover Mentors</h3>
              <p className="text-sm text-slate-400">Browse seniors, alumni, and professionals based on expertise and experience.</p>
            </div>

            <div className="bg-[#1E293B] border border-slate-800/60 rounded-xl p-6 relative hover:shadow-md transition-all">
              <div className="text-3xl font-extrabold text-blue-500 mb-3">3</div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Schedule & Connect</h3>
              <p className="text-sm text-slate-400">Mentors approve requests, schedule sessions, and share Google Meet links for structured mentorship.</p>
            </div>

            <div className="bg-[#1E293B] border border-slate-800/60 rounded-xl p-6 relative hover:shadow-md transition-all">
              <div className="text-3xl font-extrabold text-blue-500 mb-3">4</div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Learn & Contribute</h3>
              <p className="text-sm text-slate-400">Attend the scheduled session, gain valuable guidance from your mentor, and share feedback to help improve the mentorship experience.</p>
            </div>
          </div>
        </div>
      </section>
      <section id="mentors" className="py-20 bg-[#0F172A] border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white">Discover Mentors</h2>
            <p className="mt-3 text-slate-400 text-sm">
              Connect with seniors, alumni, and professionals who can guide you through your learning and career journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-[#1E293B] border border-slate-800/60 rounded-xl p-5 shadow-sm flex flex-col hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col flex-grow">
                  {/* Avatar & Rating Row */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-955 text-blue-405 border border-blue-900/30 flex items-center justify-center font-bold text-lg">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex items-center gap-1 bg-amber-955 px-2.5 py-0.5 rounded-lg border border-amber-800/40 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{mentor.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* 1. Name */}
                  <h3 className="font-extrabold text-slate-100 text-base tracking-tight leading-snug">{mentor.name}</h3>

                  {/* 2. Verification Badge */}
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-955 border border-emerald-900/40 text-[9px]">✓</span>
                    <span>Verified Mentor</span>
                  </div>

                  {/* Alumni Context */}
                  <p className="text-xs font-semibold text-slate-400 mt-2">
                    {mentor.alumniContext}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-500">
                    {mentor.academicDetails}
                  </p>

                  {/* 3. Current Role */}
                  <p className="text-xs font-bold text-blue-400 mt-2">
                    {mentor.role} @ {mentor.company}
                  </p>

                  {/* 4. Specializations */}
                  <div className="mt-4 pt-3.5 border-t border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block mb-2">
                      Specializes In:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[9px] font-semibold bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 5. Experience & 6. Availability */}
                  <div className="mt-auto pt-3.5 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Experience:</span>
                      <span className="font-bold text-slate-200">{mentor.experience}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sessions Completed:</span>
                      <span className="font-bold text-slate-200">{mentor.sessions}</span>
                    </div>
                  </div>
                </div>

                {/* 8. Request Button */}
                <Link
                  to="/register"
                  className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl text-center transition-all block cursor-pointer"
                >
                  Request Mentorship
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. KEY FEATURES */}
      <section className="py-20 bg-[#111827]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white">Key Features</h2>
            <p className="mt-3 text-slate-450 text-sm">
              Core platform features designed to simplify mentor discovery, session management, and career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-[#1E293B] border border-slate-800/60 rounded-xl p-6 flex flex-col hover:shadow-lg hover:border-slate-750/80 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-100 text-base">Mentor Discovery</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Discover mentors based on skills, expertise, technology stacks, career goals, and professional experience.
              </p>
            </div>

            <div className="bg-[#1E293B] border border-slate-800/60 rounded-xl p-6 flex flex-col hover:shadow-lg hover:border-slate-750/80 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-100 text-base">Session Coordination</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Mentors manage scheduling by setting the session date, time, and Google Meet link directly through the platform.
              </p>
            </div>

            <div className="bg-[#1E293B] border border-slate-800/60 rounded-xl p-6 flex flex-col hover:shadow-lg hover:border-slate-750/80 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-100 text-base">Role-Based Access</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Dedicated dashboards for mentees, mentors, and administrators with features tailored to each role.
              </p>
            </div>

            <div className="bg-[#1E293B] border border-slate-800/60 rounded-xl p-6 flex flex-col hover:shadow-lg hover:border-slate-750/80 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 flex-shrink-0">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-100 text-base">Structured Workflow</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Track mentorship requests through approval, scheduling, session completion, and feedback sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
