import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatDate, formatTime } from '../utils/formatDate';
import { Calendar, Video, Star, MessageSquare, Clock, ShieldAlert, Award } from 'lucide-react';

const MyRequests = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/api/requests');
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error retrieving requests:', error);
      showToast('Could not load your requests list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-955 border-amber-800/40 text-amber-400';
      case 'Accepted':
        return 'bg-sky-955 border-sky-800/40 text-sky-400';
      case 'Scheduled':
        return 'bg-emerald-955 border-emerald-800/40 text-emerald-400';
      case 'Completed':
        return 'bg-indigo-955 border-indigo-800/40 text-indigo-400';
      case 'Rejected':
        return 'bg-rose-955 border-rose-800/40 text-rose-400';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">My Requests</h1>
        <p className="text-slate-400 font-semibold mt-1">Track the status of your mentorship requests and upcoming sessions.</p>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-[#1E293B] border border-slate-800 p-12 rounded-3xl text-center shadow-sm max-w-lg mx-auto">
          <Clock className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-base font-extrabold text-slate-300">No requests sent yet</h3>
          <p className="text-xs text-slate-400 mt-2">
            Once you request a prep session with a mentor, it will appear here. Find mentors to begin.
          </p>
          <Link
            to="/search"
            className="mt-6 inline-flex px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-black/25 transition-all"
          >
            Search Mentors
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-[#1E293B] border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm hover:border-slate-700 transition-all duration-350 flex flex-col md:flex-row justify-between gap-6"
            >
              {/* Request Main Content */}
              <div className="flex-grow space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-205">
                    {req.mentorId?.fullName || 'Deleted User'}
                  </h2>
                  <span className={`px-3 py-1 border rounded-lg text-xs font-bold uppercase tracking-wider ${getStatusStyle(req.status)}`}>
                    {req.status}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Sent on {formatDate(req.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-semibold">
                  {req.mentorId?.branch}
                  {(req.mentorId?.currentRole || req.mentorId?.currentCompany) ? (
                    ` • ${req.mentorId.currentRole || ''} ${req.mentorId.currentCompany ? `@ ${req.mentorId.currentCompany}` : ''}`
                  ) : (
                    req.mentorId?.companiesCracked?.length > 0 && ` • Placed at ${req.mentorId.companiesCracked.join(', ')}`
                  )}
                </p>

                {/* Message block */}
                <div className="bg-[#111827] border border-slate-800 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-1">
                    Your request message:
                  </span>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
                    "{req.requestMessage}"
                  </p>
                </div>

                {/* Scheduled details */}
                {req.status === 'Scheduled' && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-955 border border-emerald-800/40 px-4 py-2.5 rounded-xl">
                      <Calendar className="w-4 h-4" />
                      Session scheduled: {formatDate(req.sessionDate)} at {formatTime(req.sessionTime)}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Side */}
              <div className="flex flex-col justify-center shrink-0 min-w-[160px] md:border-l md:border-slate-800 md:pl-6 gap-3">
                {req.status === 'Scheduled' && req.googleMeetLink && (
                  <a
                    href={req.googleMeetLink.startsWith('http') ? req.googleMeetLink : `https://${req.googleMeetLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-center transition-all text-xs flex items-center justify-center gap-2"
                  >
                    <Video className="w-4.5 h-4.5" /> Join Meet
                  </a>
                )}

                {req.status === 'Completed' && (
                  <Link
                    to={`/feedback/${req._id}`}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-center transition-all text-xs flex items-center justify-center gap-2"
                  >
                    <Star className="w-4 h-4" /> Share Feedback
                  </Link>
                )}

                {req.status === 'Pending' && (
                  <div className="text-center py-2 text-xs font-semibold text-slate-450 flex items-center justify-center gap-1.5">
                    <Clock className="w-4 h-4" /> Waiting for response
                  </div>
                )}

                {req.status === 'Accepted' && (
                  <div className="text-center py-2 text-xs font-semibold text-sky-400 flex items-center justify-center gap-1.5">
                    <Clock className="w-4 h-4" /> Awaiting schedule slots
                  </div>
                )}

                {req.status === 'Rejected' && (
                  <div className="text-center py-2 text-xs font-semibold text-rose-400 flex items-center justify-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> Request rejected
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
