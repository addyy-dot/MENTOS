import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { Star, Award, Briefcase, Calendar, Mail, FileText, ArrowLeft, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getInitials } from '../utils/initials';


const Linkedin = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const MentorProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestMessage, setRequestMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        const response = await api.get(`/api/mentors/${id}`);
        setMentor(response.data.mentor);
      } catch (error) {
        console.error('Error fetching mentor:', error);
        showToast('Mentor profile not found.', 'error');
        navigate('/search');
      } finally {
        setLoading(false);
      }
    };
    fetchMentorProfile();
  }, [id, navigate, showToast]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!requestMessage.trim()) {
      showToast('Please enter a request message.', 'error');
      return;
    }

    setSendingRequest(true);
    try {
      await api.post('/api/requests', {
        mentorId: mentor._id,
        requestMessage,
      });
      showToast('Mentorship request sent successfully!', 'success');
      setRequestMessage('');
      navigate('/my-requests');
    } catch (error) {
      console.error('Error sending request:', error);
      const msg = error.response?.data?.message || 'Failed to send mentorship request.';
      showToast(msg, 'error');
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!mentor) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <Link
        to="/search"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-blue-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4.5 h-4.5" /> Back to Search
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Mentor Overview Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#1E293B] border border-slate-800 p-6 rounded-3xl shadow-sm text-center">
            <div className="w-24 h-24 bg-blue-955 text-blue-400 border border-blue-900/30 rounded-3xl flex items-center justify-center font-bold text-3xl uppercase mx-auto mb-4 shadow-inner overflow-hidden">
              {mentor.profilePicture ? (
                <img src={mentor.profilePicture} alt={mentor.fullName} className="w-full h-full object-cover" />
              ) : (
                getInitials(mentor.fullName)
              )}
            </div>

            <h1 className="text-xl font-bold text-white">{mentor.fullName}</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1 capitalize">{mentor.role}</p>
            
            {/* Verification Badge */}
            {mentor.isVerified ? (
              <div className="mt-2 flex items-center justify-center gap-1.5 text-emerald-500 text-sm font-bold">
                <CheckCircle className="w-4 h-4" /> Verified Mentor
              </div>
            ) : mentor.verificationStatus === 'pending' ? (
              <div className="mt-2 flex items-center justify-center gap-1.5 text-amber-500 text-sm font-bold">
                <Clock className="w-4 h-4 animate-pulse" /> Verification Pending
              </div>
            ) : mentor.verificationStatus === 'rejected' ? (
              <div className="mt-2 flex items-center justify-center gap-1.5 text-rose-500 text-sm font-bold">
                <AlertCircle className="w-4 h-4" /> Verification Required
              </div>
            ) : null}

            {(mentor.currentRole || mentor.currentCompany) && (
              <p className="text-xs font-bold text-blue-400 mt-2.5">
                {mentor.currentRole} {mentor.currentCompany ? `@ ${mentor.currentCompany}` : ''}
              </p>
            )}

            <div className="flex items-center justify-center gap-1.5 mt-4">
              <div className="flex items-center gap-1 bg-amber-955 px-3 py-1 rounded-xl border border-amber-800/40 text-amber-400 text-sm font-bold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {mentor.rating ? mentor.rating.toFixed(1) : '0.0'}
              </div>
              <span className="text-xs font-semibold text-slate-400">Average Rating</span>
            </div>

            {/* Placement Details */}
            {mentor.companiesCracked && mentor.companiesCracked.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-800 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
                  Placed Companies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {mentor.companiesCracked.map((c, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-emerald-955 border border-emerald-900 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5" /> {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Email info */}
            <div className="mt-4 pt-4 border-t border-slate-800 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                Contact Email
              </span>
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" /> {mentor.email}
              </span>
            </div>

            {mentor.linkedinProfile && (
              <div className="mt-4 pt-4 border-t border-slate-800 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                  LinkedIn Profile
                </span>
                <a
                  href={mentor.linkedinProfile.startsWith('http') ? mentor.linkedinProfile : `https://${mentor.linkedinProfile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1.5"
                >
                  <Linkedin className="w-4 h-4 text-blue-400" /> View LinkedIn Profile
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details & Request Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="bg-[#1E293B] border border-slate-800 p-8 rounded-3xl shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Biography</h2>
              <p className="text-sm text-slate-400 font-medium leading-relaxed mt-3 whitespace-pre-line">
                {mentor.bio || 'This mentor has not written a biography yet.'}
              </p>
            </div>

            {/* Expertise */}
            {mentor.expertise && mentor.expertise.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Domains of Expertise</h2>
                <div className="flex flex-wrap gap-2 mt-3.5">
                  {mentor.expertise.map((e, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-blue-955 border border-blue-900 text-blue-400 text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <Briefcase className="w-4 h-4" /> {e}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {mentor.skills && mentor.skills.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Technical Skills</h2>
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {mentor.skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div>
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">General Availability</h2>
              <div className="flex items-center gap-2 mt-3.5 text-sm font-semibold text-slate-300 bg-[#111827] border border-slate-800 p-3.5 rounded-2xl">
                <Calendar className="w-5 h-5 text-blue-400 shrink-0" />
                <span>{mentor.availability || 'Weekends, evenings on schedule'}</span>
              </div>
            </div>
          </div>

          {/* Request Placement Prep form (only shown to mentees) */}
          {user && user.role === 'mentee' && (
            <div className="bg-[#1E293B] border border-slate-800 p-8 rounded-3xl shadow-sm">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-400" /> Request Mentorship Session
              </h2>
              <p className="text-xs text-slate-400 font-semibold mb-6">
                Briefly introduce yourself and detail what placement guidance you need (e.g. resume review, mock interviews, backend coding prep).
              </p>

              <form onSubmit={handleSendRequest} className="space-y-4">
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="I am preparing for a backend dev interview and would love your guidance on Mock Interviews and System Design queries..."
                  rows="4"
                  className="w-full px-4 py-3 bg-[#111827] border border-slate-700 rounded-2xl text-sm font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all resize-none"
                  required
                ></textarea>

                <button
                  type="submit"
                  disabled={sendingRequest}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {sendingRequest ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Request
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MentorProfile;
