import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { formatDate, formatTime } from '../utils/formatDate';
import { FileText, Calendar, CheckCircle2, User, Star, Clock, Video, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { getInitials } from '../utils/initials';


const MentorDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/api/requests');
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      showToast('Failed to load received session requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleMarkComplete = async (requestId) => {
    if (!window.confirm('Are you sure you want to mark this mentorship session as completed?')) return;

    try {
      await api.patch(`/api/requests/${requestId}/status`, { status: 'Completed' });
      showToast('Session marked as completed successfully.', 'success');
      fetchRequests(); // reload requests
    } catch (error) {
      console.error('Error marking complete:', error);
      const msg = error.response?.data?.message || 'Failed to update session status.';
      showToast(msg, 'error');
    }
  };

  const statPending = requests.filter(r => r.status === 'Pending').length;
  const statScheduled = requests.filter(r => r.status === 'Scheduled').length;
  const statCompleted = requests.filter(r => r.status === 'Completed').length;

  const upcomingSessions = requests.filter(r => r.status === 'Scheduled');

  const isProfileComplete = !!(
    user?.bio &&
    user?.currentCompany &&
    user?.currentRole &&
    user?.linkedinProfile &&
    user?.companiesCracked &&
    user?.companiesCracked.length > 0 &&
    user?.expertise &&
    user?.expertise.length > 0
  );

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header and Call to Action */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Mentor Dashboard</h1>
          <p className="text-slate-400 font-semibold mt-1">Welcome back, {user.fullName}! Track student requests and slots.</p>
        </div>
        <Link
          to="/incoming-requests"
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-black/25 hover:shadow-black/35 transition-all"
        >
          <FileText className="w-5 h-5" /> Manage Incoming Requests ({statPending})
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Received', count: requests.length, icon: <FileText className="w-5 h-5 text-blue-400" />, bg: 'bg-blue-955' },
          { label: 'Incoming Pending', count: statPending, icon: <Clock className="w-5 h-5 text-amber-400" />, bg: 'bg-amber-955' },
          { label: 'Upcoming Scheduled', count: statScheduled, icon: <Calendar className="w-5 h-5 text-emerald-400" />, bg: 'bg-emerald-955' },
          { label: 'Completed Slots', count: statCompleted, icon: <CheckCircle2 className="w-5 h-5 text-violet-400" />, bg: 'bg-violet-955' },
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

      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Details Sidebar */}
        <div className="bg-[#1E293B] border border-slate-800 p-6 rounded-3xl shadow-sm h-fit space-y-6">
          <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800">
            <div className="w-20 h-20 bg-blue-955/65 text-blue-400 border border-blue-900/30 rounded-3xl flex items-center justify-center font-bold text-2xl uppercase mb-4 shadow-inner overflow-hidden">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                getInitials(user.fullName)
              )}
            </div>
            <h2 className="text-lg font-bold text-white">{user.fullName}</h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5 capitalize">{user.role}</p>
            
            {/* Verification Badge */}
            {user.isVerified ? (
              <div className="mt-2 flex items-center justify-center gap-1.5 text-emerald-500 text-sm font-bold">
                <CheckCircle className="w-4 h-4" /> Verified Mentor
              </div>
            ) : user.verificationStatus === 'pending' ? (
              <div className="mt-2 flex items-center justify-center gap-1.5 text-amber-500 text-sm font-bold">
                <Clock className="w-4 h-4 animate-pulse" /> Verification Pending
              </div>
            ) : user.verificationStatus === 'rejected' ? (
              <div className="mt-2 flex items-center justify-center gap-1.5 text-rose-500 text-sm font-bold">
                <AlertCircle className="w-4 h-4" /> Verification Required
              </div>
            ) : null}

            {(user.currentRole || user.currentCompany) && (
              <p className="text-xs font-bold text-blue-400 mt-2.5">
                {user.currentRole} {user.currentCompany ? `@ ${user.currentCompany}` : ''}
              </p>
            )}

            {user.collegeName && (
              <p className="text-xs font-semibold text-slate-400 mt-1">
                {user.collegeName}
              </p>
            )}

            <div className="flex items-center gap-1.5 bg-amber-955 px-2.5 py-1 rounded-xl border border-amber-800/40 text-amber-400 text-xs font-bold mt-3">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {user.rating ? user.rating.toFixed(1) : '0.0'}
            </div>
            {user.bio && (
              <p className="text-xs text-slate-400 mt-4 leading-relaxed font-medium line-clamp-3 px-2">"{user.bio}"</p>
            )}
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Placements Cracked</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {user.companiesCracked && user.companiesCracked.length > 0 ? (
                  user.companiesCracked.map((c, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-emerald-955 border border-emerald-900 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-1">
                      <Award className="w-3 h-3" /> {c}
                    </span>
                  ))
                ) : (
                  <span className="text-xs italic text-slate-400">None listed</span>
                )}
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Expertise Domains</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {user.expertise && user.expertise.length > 0 ? (
                  user.expertise.map((e, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-blue-955 border border-blue-900 text-blue-400 text-xs font-semibold rounded-lg">
                      {e}
                    </span>
                  ))
                ) : (
                  <span className="text-xs italic text-slate-400">None listed</span>
                )}
              </div>
            </div>



            <Link
              to="/profile/edit"
              className="block text-center w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all duration-200"
            >
              {isProfileComplete ? 'Update Profile' : 'Complete Profile'}
            </Link>
          </div>
        </div>

        {/* Upcoming Scheduled Slots */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1E293B] border border-slate-800 p-6 rounded-3xl shadow-sm">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4 mb-6">Upcoming Scheduled Sessions</h2>

            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : upcomingSessions.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-300">No upcoming sessions</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  When you accept and schedule sessions with students, they will display here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session._id}
                    className="p-5 border border-slate-800 rounded-3xl hover:border-slate-700 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-205">
                        {session.menteeId?.fullName || 'Deleted Student'}
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">
                        {session.menteeId?.collegeName && `${session.menteeId.collegeName} • `}
                        {session.menteeId?.branch} • {session.menteeId?.year}
                        {session.menteeId?.targetRole && session.menteeId.targetRole.length > 0 && ` • Target: ${session.menteeId.targetRole.join(', ')}`}
                      </p>
                      
                      <div className="mt-2.5 flex flex-wrap gap-2 text-xs font-bold text-slate-400">
                        <span className="px-2.5 py-1 bg-blue-955 text-blue-400 rounded-lg">
                          Date: {formatDate(session.sessionDate)}
                        </span>
                        <span className="px-2.5 py-1 bg-violet-955 text-violet-400 rounded-lg">
                          Time: {formatTime(session.sessionTime)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 w-full sm:w-auto">
                      {session.googleMeetLink && (
                        <a
                          href={session.googleMeetLink.startsWith('http') ? session.googleMeetLink : `https://${session.googleMeetLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-grow sm:flex-none px-4 py-2 bg-emerald-950/40 hover:bg-emerald-600 border border-emerald-800/40 hover:border-emerald-600 text-emerald-400 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5" /> Join Meet
                        </a>
                      )}
                      
                      <button
                        onClick={() => handleMarkComplete(session._id)}
                        className="flex-grow sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
                      >
                        Complete
                      </button>
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

export default MentorDashboard;
