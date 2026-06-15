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
  const [meetingPlatform, setMeetingPlatform] = useState('Google Meet');
  const [meetingLink, setMeetingLink] = useState('');
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
          setMeetingPlatform(found.meetingPlatform || 'Google Meet');
          setMeetingLink(found.meetingLink || found.googleMeetLink || '');
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

    if (!sessionDate || !sessionTime || !meetingLink) {
      showToast('Please fill in all scheduling fields.', 'error');
      return;
    }

    // Link validation: check if it has protocol
    if (!meetingLink.startsWith('http://') && !meetingLink.startsWith('https://')) {
      showToast('Please provide a valid URL starting with http:// or https://', 'warning');
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
        meetingPlatform,
        meetingLink,
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

  const getPlaceholder = () => {
    switch (meetingPlatform) {
      case 'Google Meet':
        return 'Paste your Google Meet link here (e.g. https://meet.google.com/abc-defg-hij)';
      case 'Microsoft Teams':
        return 'Paste your Microsoft Teams meeting link here';
      case 'Zoom':
        return 'Paste your Zoom meeting link here (e.g. https://zoom.us/j/1234567890)';
      case 'Discord':
        return 'Paste your Discord invite or voice channel link here';
      default:
        return 'Paste your meeting link here';
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/incoming-requests"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-blue-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4.5 h-4.5" /> Back to Requests
      </Link>

      <div className="bg-[#1E293B] border border-slate-800 rounded-3xl p-8 sm:p-10 overflow-hidden relative shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 to-teal-600"></div>

        <div className="mb-8 border-b border-slate-800 pb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5.5 h-5.5 text-emerald-450" />
            {requestDetail?.status === 'Scheduled' ? 'Reschedule Session' : 'Schedule Mentorship Session'}
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Set the date, time, and provide your meeting invite details for{' '}
            <strong className="text-white">{requestDetail?.menteeId?.fullName}</strong>.
          </p>
        </div>

        {/* Student query message snippet */}
        <div className="bg-[#111827] border border-slate-800 p-4 rounded-2xl mb-8">
          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-1">
            Requested Prep details:
          </span>
          <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
            "{requestDetail?.requestMessage}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Session Date */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 pl-0.5">
                <Calendar className="w-4 h-4 text-slate-500" /> Date
              </label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#111827] border border-slate-700 rounded-2xl text-sm font-medium text-slate-200 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all"
                required
              />
            </div>

            {/* Session Time */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 pl-0.5">
                <Clock className="w-4 h-4 text-slate-500" /> Time (24h)
              </label>
              <input
                type="time"
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
                className="w-full px-4 py-3 bg-[#111827] border border-slate-700 rounded-2xl text-sm font-medium text-slate-200 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all"
                required
              />
            </div>
          </div>

          {/* Meeting Platform */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 pl-0.5">
              <Video className="w-4 h-4 text-slate-500" /> Meeting Platform
            </label>
            <select
              value={meetingPlatform}
              onChange={(e) => setMeetingPlatform(e.target.value)}
              className="w-full px-4 py-3 bg-[#111827] border border-slate-700 rounded-2xl text-sm font-medium text-slate-200 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all"
              required
            >
              <option value="Google Meet">Google Meet</option>
              <option value="Microsoft Teams">Microsoft Teams</option>
              <option value="Zoom">Zoom</option>
              <option value="Discord">Discord</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Meeting Link */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 pl-0.5">
              <Video className="w-4 h-4 text-slate-500" /> Meeting Link
            </label>
            <input
              type="text"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full px-4 py-3 bg-[#111827] border border-slate-700 rounded-2xl text-sm font-medium text-slate-205 placeholder-slate-550 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-450 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
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
