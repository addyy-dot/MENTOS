import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Trash2, Search } from 'lucide-react';
import { getInitials } from '../utils/initials';


const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const { showToast } = useToast();

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = search ? { search } : {};
      const response = await api.get('/api/admin/users', { params });
      setUsers(response.data.users);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setDeletingUserId(userToDelete._id);
      await api.delete(`/api/admin/users/${userToDelete._id}`);

      // Remove user from list
      setUsers(users.filter((u) => u._id !== userToDelete._id));
      showToast(`User ${userToDelete.fullName} deleted successfully.`, 'success');
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      const message = err.response?.data?.message || 'Failed to delete user.';
      showToast(message, 'error');
    } finally {
      setDeletingUserId(null);
    }
  };

  // Open delete modal
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400 font-medium animate-pulse">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="bg-rose-955 border border-rose-900/40 rounded-lg p-6 max-w-md">
          <p className="text-rose-455 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Manage Users</h1>
          <p className="text-slate-400 mt-1">View all users and manage their accounts</p>
        </div>

        {/* Search Box */}
        <div className="mb-6 bg-[#1E293B] rounded-xl border border-slate-800 shadow-sm p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Search className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-205 placeholder-slate-550"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-xl shadow-sm overflow-hidden">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 font-medium">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#111827] border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Created Date</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-[#111827]/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-955 border border-blue-900/30 text-blue-400 flex items-center justify-center font-bold text-sm overflow-hidden">
                            {user.profilePicture ? (
                              <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
                            ) : (
                              getInitials(user.fullName)
                            )}
                          </div>
                          <span className="font-medium text-slate-200">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full border text-xs font-semibold capitalize ${
                            user.role === 'mentor'
                              ? 'bg-blue-955 border-blue-900/30 text-blue-450'
                              : user.role === 'admin'
                              ? 'bg-purple-955 border-purple-900/30 text-purple-400'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openDeleteModal(user)}
                          disabled={deletingUserId === user._id}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[#1E293B] border border-slate-800 rounded-xl shadow-lg max-w-sm w-full">
              <div className="p-6">
                <h3 className="text-lg font-bold text-white">Delete User?</h3>
                <p className="text-slate-400 mt-2">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold text-white">{userToDelete.fullName}</span>
                  {' '}({userToDelete.email})? This action cannot be undone.
                </p>
                <p className="text-sm text-slate-500 mt-3">
                  All associated requests will also be deleted.
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deletingUserId === userToDelete._id}
                    className="flex-1 px-4 py-2 rounded-lg bg-[#111827] border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    disabled={deletingUserId === userToDelete._id}
                    className="flex-1 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {deletingUserId === userToDelete._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete User'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
