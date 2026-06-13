import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, User, UserCheck } from 'lucide-react';
import Logo from '../components/Logo';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mentee'); // default mentee
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !role) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setSubmitting(true);
    const result = await register({ fullName, email, password, role });
    setSubmitting(false);

    if (result.success) {
      showToast('Account registered successfully! Welcome to MENTos.', 'success');
      navigate('/');
    } else {
      showToast(result.message || 'Registration failed.', 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center bg-[#0F172A] px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <div className="max-w-md w-full">
        
        {/* Logo at the top center */}
        <div className="flex justify-center mb-6">
          <Link to="/">
            <Logo light={true} showTagline={true} iconSize="h-8 w-8" />
          </Link>
        </div>

        {/* Clean Dark Card */}
        <div className="bg-[#1E293B] border border-slate-800 p-8 rounded-xl shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-sm text-slate-400 mt-1">Get access to professional placement mentorship</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector Cards */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              <button
                type="button"
                onClick={() => setRole('mentee')}
                className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  role === 'mentee'
                    ? 'border-blue-600 bg-blue-950/40 text-blue-450 ring-1 ring-blue-600'
                    : 'border-slate-700 bg-[#111827] text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Student</span>
              </button>
              
              <button
                type="button"
                onClick={() => setRole('mentor')}
                className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  role === 'mentor'
                    ? 'border-blue-600 bg-blue-950/40 text-blue-450 ring-1 ring-blue-600'
                    : 'border-slate-700 bg-[#111827] text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Mentor</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-9 pr-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@college.edu"
                  className="w-full pl-9 pr-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-9 pr-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer font-bold"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Register Account'
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-sm">
            <span className="text-slate-400">Already have an account? </span>
            <Link to="/login" className="text-blue-400 hover:underline font-semibold">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

