import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatDate';
import { Compass, FileText, User, HelpCircle, CheckCircle, Clock, Calendar } from 'lucide-react';
import { getInitials } from '../utils/initials';


const MenteeDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/api/requests');
        setRequests(response.data.requests);
      } catch (error) {
        console.error('Error fetching requests:', error);
        showToast('Failed to load session requests.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [showToast]);

  // Calculations for Stats
  const statPending = requests.filter(r => r.status === 'Pending').length;
  const statScheduled = requests.filter(r => r.status === 'Scheduled').length;
  const statCompleted = requests.filter(r => r.status === 'Completed').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-1 bg-amber-950/40 border border-amber-800/40 text-amber-400 text-xs font-bold rounded-lg uppercase tracking-wide">Pending</span>;
      case 'Accepted':
        return <span className="px-2.5 py-1 bg-sky-950/40 border border-sky-800/40 text-sky-400 text-xs font-bold rounded-lg uppercase tracking-wide">Accepted</span>;
      case 'Scheduled':
        return <span className="px-2.5 py-1 bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-bold rounded-lg uppercase tracking-wide">Scheduled</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 bg-indigo-950/40 border border-indigo-800/40 text-indigo-400 text-xs font-bold rounded-lg uppercase tracking-wide">Completed</span>;
      case 'Rejected':
        return <span className="px-2.5 py-1 bg-rose-950/40 border border-rose-800/40 text-rose-400 text-xs font-bold rounded-lg uppercase tracking-wide">Rejected</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg uppercase tracking-wide">{status}</span>;
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome & Search Bar CTA */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Student Dashboard</h1>
          <p className="text-slate-400 font-semibold mt-1">Welcome back, {user.fullName}! Keep track of your placement preparations.</p>
        </div>
        <Link
          to="/search"
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-black/25 hover:shadow-black/35 transition-all duration-200"
        >
          <Compass className="w-5 h-5" /> Find placement mentors
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Requests', count: requests.length, icon: <FileText className="w-5 h-5 text-blue-400" />, bg: 'bg-blue-955' },
          { label: 'Pending', count: statPending, icon: <Clock className="w-5 h-5 text-amber-400" />, bg: 'bg-amber-955' },
          { label: 'Scheduled', count: statScheduled, icon: <Calendar className="w-5 h-5 text-emerald-400" />, bg: 'bg-emerald-955' },
          { label: 'Completed', count: statCompleted, icon: <CheckCircle className="w-5 h-5 text-violet-400" />, bg: 'bg-violet-955' },
        ].map((item, idx) => (
          <div key={idx} className="bg-[#1E293B] border border-slate-800 p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">{item.label}</div>
              <div className="text-2xl font-black text-white mt-1">{item.count}</div>
            </div>
            <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-[#1E293B] border border-slate-800 p-6 rounded-3xl shadow-sm h-fit">
          <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800">
            <div className="w-20 h-20 bg-blue-950/65 text-blue-400 border border-blue-900/30 rounded-3xl flex items-center justify-center font-bold text-2xl uppercase mb-4 shadow-inner overflow-hidden">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                getInitials(user.fullName)
              )}
            </div>
            <h2 className="text-lg font-bold text-white">{user.fullName}</h2>
            <p className="text-xs font-semibold text-slate-400 capitalize mt-0.5">{user.role}</p>
            {user.bio ? (
              <p className="text-xs text-slate-400 mt-3 font-medium line-clamp-3 leading-relaxed px-2">"{user.bio}"</p>
            ) : (
              <p className="text-xs italic text-slate-400 mt-3">No bio added. Update your profile to add one.</p>
            )}
          </div>

          <div className="pt-6 space-y-4">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Academic Info</span>
              <span className="text-sm font-semibold text-slate-300 block mt-1">
                {user.branch || 'Branch unspecified'} • {user.year || 'Year unspecified'}
              </span>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Skills</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs italic text-slate-400">No skills listed</span>
                )}
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Target Companies</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {user.targetCompanies && user.targetCompanies.length > 0 ? (
                  user.targetCompanies.map((company, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-blue-950 border border-blue-900 text-blue-400 text-xs font-semibold rounded-lg">
                      {company}
                    </span>
                  ))
                ) : (
                  <span className="text-xs italic text-slate-400">No target companies listed</span>
                )}
              </div>
            </div>

            <Link
              to="/profile/edit"
              className="block text-center w-full py-2.5 border border-slate-700 hover:border-blue-600 hover:text-blue-500 text-slate-400 text-xs font-bold rounded-xl transition-all"
            >
              Update Profile Details
            </Link>
          </div>
        </div>

        {/* Recent Requests Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1E293B] border border-slate-800 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Recent Session Requests</h2>
              <Link to="/my-requests" className="text-xs font-bold text-blue-400 hover:underline">
                View all requests
              </Link>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-300">No requests sent yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Find a senior/alum working at your target company and submit a placement prep request.
                </p>
                <Link
                  to="/search"
                  className="inline-flex mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                >
                  Start Searching
                </Link>
              </div>
            ) : (
              <div className="space-y-4.5">
                {requests.slice(0, 5).map((req) => (
                  <div
                    key={req._id}
                    className="p-4 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-205">
                          {req.mentorId?.fullName || 'Deleted User'}
                        </h4>
                        {getStatusBadge(req.status)}
                      </div>
                      <p className="text-xs text-slate-400 font-semibold mt-1">
                        {req.mentorId?.branch} {req.mentorId?.companiesCracked?.length > 0 && `• Cracker at ${req.mentorId.companiesCracked.join(', ')}`}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 bg-[#111827] border border-slate-800 p-2 rounded-lg italic line-clamp-1 font-medium">
                        "{req.requestMessage}"
                      </p>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[10px] font-bold text-slate-400">{formatDate(req.createdAt)}</span>
                      {req.status === 'Scheduled' && (
                        <span className="text-xs font-bold text-emerald-400 mt-1">
                          Slot: {req.sessionDate} at {req.sessionTime}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeDashboard;
