import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Star, MessageSquare, ArrowLeft, Send, CheckCircle } from 'lucide-react';

const Feedback = () => {
  const { requestId } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [existingFeedback, setExistingFeedback] = useState(null);
  
  // Form states
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load existing feedback to verify if it has already been submitted
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await api.get(`/api/feedback/${requestId}`);
        setExistingFeedback(response.data.feedback);
      } catch (error) {
        // A 404 error means no feedback has been left yet, which is expected for new completions
        if (error.response && error.response.status !== 404) {
          console.error('Error fetching feedback:', error);
          showToast('Failed to load session details.', 'error');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [requestId, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      showToast('Please select a rating (1 to 5 stars).', 'error');
      return;
    }
    if (!comments.trim()) {
      showToast('Please enter your comments.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/api/feedback', {
        requestId,
        rating,
        comments,
      });
      showToast('Feedback submitted successfully!', 'success');
      setExistingFeedback(response.data.feedback);
      navigate('/my-requests');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      const msg = error.response?.data?.message || 'Failed to submit feedback.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarsSelector = () => {
    return (
      <div className="flex justify-center gap-2.5 my-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(star)}
            className="p-1 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
          >
            <Star
              className={`w-10 h-10 transition-colors ${
                star <= (hoverRating || rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-700'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const renderStarsDisplay = (num) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= num ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
            }`}
          />
        ))}
      </div>
    );
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
        to="/my-requests"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-blue-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4.5 h-4.5" /> Back to My Requests
      </Link>

      <div className="bg-[#1E293B] border border-slate-800 rounded-3xl p-8 sm:p-10 overflow-hidden relative shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        {existingFeedback ? (
          /* View mode: feedback already submitted */
          <div className="text-center space-y-6 pt-4">
            <div className="w-16 h-16 bg-blue-955 text-blue-405 border border-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white">Feedback Submitted</h2>
              <p className="text-sm font-semibold text-slate-400 mt-1">Thank you for rating your guidance slot.</p>
            </div>

            <div className="max-w-md mx-auto bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Your rating</span>
                {renderStarsDisplay(existingFeedback.rating)}
              </div>

              <div className="border-t border-slate-800 pt-4 text-left">
                <span className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1 text-center">
                  Your Comments
                </span>
                <p className="text-sm text-slate-300 font-medium leading-relaxed italic text-center">
                  "{existingFeedback.comments}"
                </p>
              </div>
            </div>

            <Link
              to="/my-requests"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-sm transition-colors text-sm cursor-pointer"
            >
              Return to Requests
            </Link>
          </div>
        ) : (
          /* Edit mode: submit new feedback */
          <div>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-955 text-blue-405 border border-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Rate Your Session</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Help other students by reviewing your placement preparation and advice slot.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Select Rating
                </label>
                {renderStarsSelector()}
                {rating > 0 && (
                  <span className="text-xs font-bold text-blue-400 capitalize">
                    {rating === 5 && 'Excellent guidance!'}
                    {rating === 4 && 'Very helpful session!'}
                    {rating === 3 && 'Good advice.'}
                    {rating === 2 && 'Average session.'}
                    {rating === 1 && 'Need improvement.'}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 pl-0.5">
                  Comments & Takeaways
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Share details on how the mentor helped you (e.g. key suggestions, resume tweaks, topics to focus on)..."
                  rows="5"
                  className="w-full px-4 py-3 bg-[#111827] border border-slate-700 rounded-2xl text-sm font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Review
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
