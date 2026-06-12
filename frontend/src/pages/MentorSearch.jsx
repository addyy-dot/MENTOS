import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Search, SlidersHorizontal, Star, Briefcase, Award, GraduationCap, X } from 'lucide-react';

const MentorSearch = () => {
  const { showToast } = useToast();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [company, setCompany] = useState('');
  const [expertise, setExpertise] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (skill) params.skill = skill;
      if (company) params.company = company;
      if (expertise) params.expertise = expertise;

      const response = await api.get('/api/mentors', { params });
      setMentors(response.data.mentors);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      showToast('Failed to fetch mentors list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMentors();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMentors();
  };

  const handleClearFilters = () => {
    setSearch('');
    setSkill('');
    setCompany('');
    setExpertise('');
    // We cannot immediately query since states don't update synchronously, 
    // so we trigger query inside a temporary fetch call.
    setTimeout(() => {
      api.get('/api/mentors').then((res) => setMentors(res.data.mentors));
    }, 50);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Search Mentors</h1>
        <p className="text-slate-400 font-semibold mt-1">Connect with seniors & alumni who cracked placements at top companies.</p>
      </div>

      {/* Main Search Container */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-extrabold text-slate-800 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                <SlidersHorizontal className="w-4.5 h-4.5" /> Filters
              </h2>
              <button 
                onClick={handleClearFilters}
                className="text-xs font-bold text-indigo-600 hover:underline hover:text-indigo-700"
              >
                Clear All
              </button>
            </div>

            {/* Skill Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 pl-0.5">
                By Skill
              </label>
              <input
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="e.g. React, Python"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 pl-0.5">
                By Company Cracked
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Microsoft, Google"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            {/* Expertise Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 pl-0.5">
                By Domain
              </label>
              <input
                type="text"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder="e.g. Frontend, System Design"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <button
              onClick={fetchMentors}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors text-sm"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Content Side */}
        <div className="flex-grow space-y-6">
          {/* Top Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="relative flex-grow">
              <Search className="absolute inset-y-0 left-4 w-5 h-5 text-slate-400 my-auto" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search mentors by name, biography, or department..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-150 hover:shadow-indigo-250 transition-all text-sm shrink-0"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden p-3.5 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 shrink-0"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </form>

          {/* Results Grid */}
          {loading ? (
            <div className="py-24 flex justify-center">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : mentors.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
              <Award className="w-16 h-16 text-slate-350 mx-auto mb-4" />
              <h3 className="text-base font-extrabold text-slate-700">No mentors match your search</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
                Try widening your search terms or clearing filters to locate other seniors in the platform.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentors.map((mentor) => (
                <div
                  key={mentor._id}
                  className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* User Intro & Rating */}
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-base uppercase shrink-0">
                          {mentor.fullName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-800 leading-snug hover:text-indigo-600">
                            <Link to={`/mentor/${mentor._id}`}>{mentor.fullName}</Link>
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold">{mentor.branch}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 text-amber-700 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {mentor.rating ? mentor.rating.toFixed(1) : '0.0'}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-500 mt-4 font-medium leading-relaxed line-clamp-2">
                      {mentor.bio || 'Placement mentor available for resume reviews and career prep.'}
                    </p>

                    {/* Tags section: Companies Cracked */}
                    {mentor.companiesCracked && mentor.companiesCracked.length > 0 && (
                      <div className="mt-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Placed at
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {mentor.companiesCracked.map((c, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                            >
                              <Award className="w-3 h-3" /> {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags section: Expertise */}
                    {mentor.expertise && mentor.expertise.length > 0 && (
                      <div className="mt-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Expertise
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {mentor.expertise.map((e, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                            >
                              <Briefcase className="w-3 h-3" /> {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" /> Alumni / Mentor
                    </span>
                    <Link
                      to={`/mentor/${mentor._id}`}
                      className="px-4 py-2 bg-slate-50 hover:bg-indigo-600 border border-slate-200 hover:border-indigo-600 hover:text-white text-slate-600 text-xs font-bold rounded-xl transition-all"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-80 bg-white h-full p-6 shadow-2xl flex flex-col justify-between animate-slide-in">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
                <h3 className="font-extrabold text-slate-800 text-base uppercase tracking-wider">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Skill Filter */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    By Skill
                  </label>
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    placeholder="e.g. React, Node"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                {/* Company Filter */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    By Company Cracked
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Microsoft"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                {/* Expertise Filter */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    By Domain
                  </label>
                  <input
                    type="text"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    placeholder="e.g. Frontend"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleClearFilters}
                className="flex-grow py-3 border border-slate-200 hover:border-slate-350 text-slate-500 font-bold rounded-xl text-xs uppercase"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  fetchMentors();
                  setShowMobileFilters(false);
                }}
                className="flex-grow py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorSearch;
