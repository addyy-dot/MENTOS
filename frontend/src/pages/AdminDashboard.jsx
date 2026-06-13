import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Users, UserCheck, UserX, FileText, Clock, CheckCircle, Zap, AlertCircle, Check, X } from 'lucide-react';
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

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [verifications, setVerifications] = useState([]);
  const [verificationsLoading, setVerificationsLoading] = useState(true);
  const [verificationsError, setVerificationsError] = useState(null);

  const fetchVerifications = async () => {
    try {
      setVerificationsLoading(true);
      const response = await api.get('/api/admin/mentor-verifications');
      setVerifications(response.data.mentors);
      setVerificationsError(null);
    } catch (err) {
      console.error('Error fetching verifications:', err);
      setVerificationsError(err.response?.data?.message || 'Failed to load verification requests.');
    } finally {
      setVerificationsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/api/admin/mentor-verifications/${id}/approve`);
      showToast('Mentor verified successfully.', 'success');
      // Refresh statistics and list
      const statsRes = await api.get('/api/admin/stats');
      setStats(statsRes.data);
      fetchVerifications();
    } catch (err) {
      console.error('Error approving mentor:', err);
      showToast(err.response?.data?.message || 'Failed to approve mentor.', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/api/admin/mentor-verifications/${id}/reject`);
      showToast('Mentor verification rejected.', 'success');
      // Refresh statistics and list
      const statsRes = await api.get('/api/admin/stats');
      setStats(statsRes.data);
      fetchVerifications();
    } catch (err) {
      console.error('Error rejecting mentor:', err);
      showToast(err.response?.data?.message || 'Failed to reject mentor.', 'error');
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/admin/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.response?.data?.message || 'Failed to load statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchVerifications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-950 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400 font-medium animate-pulse">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="bg-rose-950/30 border border-rose-900/40 rounded-lg p-6 max-w-md">
          <p className="text-rose-400 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, iconColor, iconBg }) => (
    <div className="bg-[#1E293B] border border-slate-800/60 rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconBg} ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400 mt-1">Monitor platform statistics and manage users</p>
            </div>
            <Link
              to="/admin/users"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200"
            >
              Manage Users
            </Link>
          </div>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats?.totalUsers || 0}
            iconColor="text-blue-400"
            iconBg="bg-blue-950/60"
          />
          <StatCard
            icon={UserCheck}
            label="Total Mentors"
            value={stats?.totalMentors || 0}
            iconColor="text-indigo-400"
            iconBg="bg-indigo-950/60"
          />
          <StatCard
            icon={UserX}
            label="Total Mentees"
            value={stats?.totalMentees || 0}
            iconColor="text-violet-400"
            iconBg="bg-violet-950/60"
          />
        </div>

        {/* Request Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            icon={FileText}
            label="Total Requests"
            value={stats?.totalRequests || 0}
            iconColor="text-slate-400"
            iconBg="bg-slate-900"
          />
          <StatCard
            icon={AlertCircle}
            label="Pending"
            value={stats?.pendingRequests || 0}
            iconColor="text-amber-400"
            iconBg="bg-amber-950/60"
          />
          <StatCard
            icon={CheckCircle}
            label="Accepted"
            value={stats?.acceptedRequests || 0}
            iconColor="text-sky-400"
            iconBg="bg-sky-950/60"
          />
          <StatCard
            icon={Clock}
            label="Scheduled"
            value={stats?.scheduledRequests || 0}
            iconColor="text-blue-400"
            iconBg="bg-blue-950/60"
          />
          <StatCard
            icon={Zap}
            label="Completed"
            value={stats?.completedRequests || 0}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-950/60"
          />
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-[#1E293B] border border-slate-800/60 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm font-medium">Rejected Requests</p>
              <p className="text-2xl font-bold text-white mt-2">{stats?.rejectedRequests || 0}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Success Rate</p>
              <p className="text-2xl font-bold text-white mt-2">
                {stats?.totalRequests > 0
                  ? Math.round(
                      ((stats.completedRequests + stats.acceptedRequests) / stats.totalRequests) * 100
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>

        {/* Mentor Verification Requests */}
        <div className="mt-8 bg-[#1E293B] border border-slate-800/60 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">Mentor Verification Requests</h2>
            <p className="text-slate-400 text-xs mt-1">Review pending mentor profiles and LinkedIn credentials for verification</p>
          </div>

          {verificationsLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-400 text-xs">Loading verification requests...</p>
            </div>
          ) : verificationsError ? (
            <div className="p-8 text-center bg-rose-955 text-rose-455 font-semibold text-xs border-t border-slate-850">
              {verificationsError}
            </div>
          ) : verifications.length === 0 ? (
            <div className="p-12 text-center">
              <UserCheck className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-semibold">No pending verification requests</p>
              <p className="text-slate-500 text-xs mt-1">All registered mentors have been processed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#111827] border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Mentor</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Position</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">LinkedIn</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {verifications.map((mentor) => (
                    <tr key={mentor._id} className="hover:bg-[#111827]/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-955 border border-blue-900/30 text-blue-400 flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                            {mentor.profilePicture ? (
                              <img src={mentor.profilePicture} alt={mentor.fullName} className="w-full h-full object-cover" />
                            ) : (
                              getInitials(mentor.fullName)
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200 text-sm">{mentor.fullName}</div>
                            <div className="text-slate-450 text-xs mt-0.5">{mentor.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-300 font-medium text-xs">{mentor.currentRole}</div>
                        <div className="text-slate-450 text-[11px] mt-0.5">{mentor.currentCompany}</div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={mentor.linkedinProfile.startsWith('http') ? mentor.linkedinProfile : `https://${mentor.linkedinProfile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-955 hover:bg-blue-600 border border-blue-900 hover:border-blue-600 text-blue-400 hover:text-white text-xs font-bold transition-all"
                        >
                          <Linkedin className="w-3.5 h-3.5" /> Profile
                        </a>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(mentor.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApprove(mentor._id)}
                            className="p-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-600 border border-emerald-900 hover:border-emerald-600 text-emerald-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-bold px-2.5 py-1.5"
                            title="Approve verification"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(mentor._id)}
                            className="p-1.5 rounded-lg bg-rose-955 hover:bg-rose-600 border border-rose-900 hover:border-rose-600 text-rose-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-bold px-2.5 py-1.5"
                            title="Reject verification"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
