import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Calendar, Clock, Video, ArrowLeft, Send } from 'lucide-react';

const ScheduleSession = () => {
  const { requestId } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [googleMeetLink, setGoogleMeetLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requestDetail, setRequestDetail] = useState(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await api.get('/api/requests');
        const found = response.data.requests.find((r) => r._id === requestId);
        
        if (!found) {
          showToast('Session request details not found.', 'error');
          navigate('/incoming-requests');
          return;
        }
        setRequestDetail(found);
        
        // Populate if already scheduled (rescheduling scenario)
        if (found.status === 'Scheduled') {
          setSessionDate(found.sessionDate || '');
          setSessionTime(found.sessionTime || '');
          setGoogleMeetLink(found.googleMeetLink || '');
        }
      } catch (error) {
        console.error('Error fetching request details:', error);
        showToast('Failed to load session details.', 'error');
        navigate('/incoming-requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequestDetails();
  }, [requestId, navigate, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sessionDate || !sessionTime || !googleMeetLink) {
      showToast('Please fill in all scheduling fields.', 'error');
      return;
    }

    // Google Meet validation: must have some sanity
    if (!googleMeetLink.includes('meet.google.com') && !googleMeetLink.startsWith('http')) {
      showToast('Please provide a valid URL or Google Meet link.', 'warning');
    }

    // Simple past date validation
    const today = new Date().toISOString().split('T')[0];
    if (sessionDate < today) {
      showToast('Warning: You are scheduling the session for a past date.', 'warning');
    }

    setSubmitting(true);
    try {
      await api.patch(`/api/requests/${requestId}/schedule`, {
        sessionDate,
        sessionTime,
        googleMeetLink,
      });

      showToast('Mentorship session has been scheduled successfully!', 'success');
      navigate('/mentor-dashboard');
    } catch (error) {
      console.error('Error scheduling session:', error);
      const msg = error.response?.data?.message || 'Failed to schedule session.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/incoming-requests"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4.5 h-4.5" /> Back to Requests
      </Link>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/40 p-8 sm:p-10 overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

        <div className="mb-8 border-b border-slate-100 pb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5.5 h-5.5 text-emerald-600" />
            {requestDetail?.status === 'Scheduled' ? 'Reschedule Session' : 'Schedule Mentorship Session'}
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Set the date, time, and provide your Google Meet invite details for{' '}
            <strong className="text-slate-650">{requestDetail?.menteeId?.fullName}</strong>.
          </p>
        </div>

        {/* Student query message snippet */}
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-8">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Requested Prep details:
          </span>
          <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
            "{requestDetail?.requestMessage}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Session Date */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 pl-0.5">
                <Calendar className="w-4 h-4 text-slate-450" /> Date
              </label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Session Time */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 pl-0.5">
                <Clock className="w-4 h-4 text-slate-450" /> Time (24h)
              </label>
              <input
                type="time"
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* Google Meet Link */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 pl-0.5">
              <Video className="w-4 h-4 text-slate-450" /> Google Meet Link
            </label>
            <input
              type="text"
              value={googleMeetLink}
              onChange={(e) => setGoogleMeetLink(e.target.value)}
              placeholder="e.g. https://meet.google.com/abc-defg-hij"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-2xl shadow-lg shadow-emerald-150 hover:shadow-emerald-250 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="w-4 h-4" /> Save Schedule & Notify
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleSession;
