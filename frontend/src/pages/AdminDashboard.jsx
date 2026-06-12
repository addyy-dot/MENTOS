import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Users, UserCheck, UserX, FileText, Clock, CheckCircle, Zap, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-6 max-w-md">
          <p className="text-rose-700 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600 mt-1">Monitor platform statistics and manage users</p>
            </div>
            <Link
              to="/admin/users"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200"
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
            color="bg-blue-50"
          />
          <StatCard
            icon={UserCheck}
            label="Total Mentors"
            value={stats?.totalMentors || 0}
            color="bg-indigo-50"
          />
          <StatCard
            icon={UserX}
            label="Total Mentees"
            value={stats?.totalMentees || 0}
            color="bg-violet-50"
          />
        </div>

        {/* Request Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            icon={FileText}
            label="Total Requests"
            value={stats?.totalRequests || 0}
            color="bg-slate-50"
          />
          <StatCard
            icon={AlertCircle}
            label="Pending"
            value={stats?.pendingRequests || 0}
            color="bg-yellow-50"
          />
          <StatCard
            icon={CheckCircle}
            label="Accepted"
            value={stats?.acceptedRequests || 0}
            color="bg-green-50"
          />
          <StatCard
            icon={Clock}
            label="Scheduled"
            value={stats?.scheduledRequests || 0}
            color="bg-blue-50"
          />
          <StatCard
            icon={Zap}
            label="Completed"
            value={stats?.completedRequests || 0}
            color="bg-emerald-50"
          />
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Rejected Requests</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{stats?.rejectedRequests || 0}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Success Rate</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
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
      </div>
    </div>
  );
};

export default AdminDashboard;
