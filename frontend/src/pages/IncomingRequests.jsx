import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatDate';
import { Check, X, Calendar, MessageSquare, Clock, HelpCircle } from 'lucide-react';

const IncomingRequests = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncomingRequests = async () => {
    try {
      const response = await api.get('/api/requests');
      // Filter out rejected and completed ones to focus on actionable requests (Pending & Accepted)
      const actionable = response.data.requests.filter(
        (r) => r.status === 'Pending' || r.status === 'Accepted' || r.status === 'Scheduled'
      );
      setRequests(actionable);
    } catch (error) {
      console.error('Error fetching incoming requests:', error);
      showToast('Could not load incoming requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomingRequests();
  }, []);

  const [confirmState, setConfirmState] = useState({ id: null, status: null });
  const [confirmTimeout, setConfirmTimeout] = useState(null);

  const handleStatusUpdate = (requestId, newStatus) => {
    if (confirmState.id === requestId && confirmState.status === newStatus) {
      if (confirmTimeout) clearTimeout(confirmTimeout);
      setConfirmState({ id: null, status: null });
      performStatusUpdate(requestId, newStatus);
    } else {
      if (confirmTimeout) clearTimeout(confirmTimeout);
      setConfirmState({ id: requestId, status: newStatus });
      
      const timeout = setTimeout(() => {
        setConfirmState({ id: null, status: null });
      }, 4000);
      setConfirmTimeout(timeout);
    }
  };

  const performStatusUpdate = async (requestId, newStatus) => {
    try {
      await api.patch(`/api/requests/${requestId}/status`, { status: newStatus });
      showToast(`Request was ${newStatus.toLowerCase()} successfully.`, 'success');
      fetchIncomingRequests(); // refresh list
    } catch (error) {
      console.error(`Error transitioning status to ${newStatus}:`, error);
      const msg = error.response?.data?.message || 'Failed to update request status.';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Incoming Requests</h1>
        <p className="text-slate-400 font-semibold mt-1">Review placement guidance queries sent by students and schedule slots.</p>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-[#1E293B] border border-slate-800 p-12 rounded-3xl text-center shadow-sm max-w-lg mx-auto">
          <Clock className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-sm font-extrabold text-slate-350">No active incoming requests</h3>
          <p className="text-xs text-slate-400 mt-2">
            Mentees who send request messages for career guidance will appear in this folder.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-[#1E293B] border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm hover:border-slate-700 transition-all duration-350 flex flex-col md:flex-row justify-between gap-6"
            >
              {/* Mentee info & message */}
              <div className="flex-grow space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-205">
                    {req.menteeId?.fullName || 'Deleted Student'}
                  </h2>
                  <span className={`px-2.5 py-0.5 border rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                    req.status === 'Pending' 
                      ? 'bg-amber-955 border-amber-800/40 text-amber-400' 
                      : req.status === 'Accepted'
                      ? 'bg-sky-955 border-sky-800/40 text-sky-400'
                      : 'bg-emerald-955 border-emerald-800/40 text-emerald-400'
                  }`}>
                    {req.status}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Received on {formatDate(req.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-slate-450 font-semibold leading-relaxed">
                  {req.menteeId?.collegeName && `${req.menteeId.collegeName} • `}
                  {req.menteeId?.branch} • {req.menteeId?.year}
                </p>

                {/* Structured Profile Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
                  {/* Current Profile Card */}
                  <div className="bg-[#111827]/30 border border-slate-800 p-4.5 rounded-2xl space-y-3.5">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-800/50 pb-1.5">Student Info</h3>
                    {req.menteeId?.skills?.length > 0 ? (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Current Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                          {req.menteeId.skills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-indigo-950/40 border border-indigo-900/30 text-indigo-400 text-[10px] font-semibold rounded-md">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs italic text-slate-500">No skills listed</span>
                    )}
                  </div>

                  {/* Target Profile Card */}
                  <div className="bg-[#111827]/30 border border-slate-800 p-4.5 rounded-2xl space-y-3.5">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-800/50 pb-1.5">Target Career Goal</h3>
                    <div className="space-y-3">
                      {req.menteeId?.targetRole?.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Roles</span>
                          <div className="flex flex-wrap gap-1.5">
                            {req.menteeId.targetRole.map((role, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-violet-950/40 border border-violet-900/30 text-violet-400 text-[10px] font-semibold rounded-md">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {req.menteeId?.targetCompanies?.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Companies</span>
                          <div className="flex flex-wrap gap-1.5">
                            {req.menteeId.targetCompanies.map((company, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-emerald-955 border border-emerald-900/30 text-emerald-400 text-[10px] font-semibold rounded-md">
                                {company}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {req.menteeId?.targetSkills?.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            {req.menteeId.targetSkills.map((tskill, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-rose-955 border border-rose-900/30 text-rose-400 text-[10px] font-semibold rounded-md">
                                {tskill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message detail */}
                <div className="bg-[#111827] border border-slate-800 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-1">
                    Student message:
                  </span>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
                    "{req.requestMessage}"
                  </p>
                </div>

                {req.status === 'Scheduled' && (
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 bg-indigo-955 border border-indigo-900/50 px-4 py-2.5 rounded-xl w-fit">
                    <Calendar className="w-4 h-4" />
                    Scheduled on: {formatDate(req.sessionDate)} at {req.sessionTime}
                  </div>
                )}
              </div>

              {/* Actions container */}
              <div className="flex flex-col justify-center shrink-0 min-w-[180px] md:border-l md:border-slate-800 md:pl-6 gap-3">
                {req.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(req._id, 'Accepted')}
                      className={`w-full py-3 font-bold rounded-2xl text-center transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                        confirmState.id === req._id && confirmState.status === 'Accepted'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      {confirmState.id === req._id && confirmState.status === 'Accepted'
                        ? 'Confirm Accept?'
                        : 'Accept Request'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(req._id, 'Rejected')}
                      className={`w-full py-3 border font-bold rounded-2xl text-center transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                        confirmState.id === req._id && confirmState.status === 'Rejected'
                          ? 'bg-rose-600 hover:bg-rose-700 border-rose-600 text-white animate-pulse'
                          : 'bg-transparent hover:bg-rose-950/20 border-slate-700 hover:border-rose-900 hover:text-rose-400 text-slate-400'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      {confirmState.id === req._id && confirmState.status === 'Rejected'
                        ? 'Confirm Decline?'
                        : 'Decline'}
                    </button>
                  </>
                )}

                {(req.status === 'Accepted' || req.status === 'Scheduled') && (
                  <Link
                    to={`/schedule/${req._id}`}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-center transition-all text-xs flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" /> 
                    {req.status === 'Scheduled' ? 'Reschedule Session' : 'Schedule Session'}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncomingRequests;
