import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { User, Book, Tag, Briefcase, Award, Clock, FileText, Save } from 'lucide-react';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Common fields
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [branch, setBranch] = useState('');
  const [skills, setSkills] = useState(''); // input as comma separated list

  // Mentee fields
  const [year, setYear] = useState('');
  const [targetCompanies, setTargetCompanies] = useState(''); // input as comma separated list

  // Mentor fields
  const [availability, setAvailability] = useState('');
  const [companiesCracked, setCompaniesCracked] = useState(''); // input as comma separated list
  const [expertise, setExpertise] = useState(''); // input as comma separated list

  const [submitting, setSubmitting] = useState(false);

  // Initialize values
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setBio(user.bio || '');
      setBranch(user.branch || '');
      setSkills(user.skills ? user.skills.join(', ') : '');

      if (user.role === 'mentee') {
        setYear(user.year || '');
        setTargetCompanies(user.targetCompanies ? user.targetCompanies.join(', ') : '');
      } else if (user.role === 'mentor') {
        setAvailability(user.availability || '');
        setCompaniesCracked(user.companiesCracked ? user.companiesCracked.join(', ') : '');
        setExpertise(user.expertise ? user.expertise.join(', ') : '');
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName) {
      showToast('Full name is required.', 'error');
      return;
    }

    setSubmitting(true);

    // Parse comma separated values into trimmed arrays
    const parseCSV = (str) => 
      str ? str.split(',').map(item => item.trim()).filter(Boolean) : [];

    const profileData = {
      fullName,
      bio,
      branch,
      skills: parseCSV(skills),
    };

    if (user.role === 'mentee') {
      profileData.year = year;
      profileData.targetCompanies = parseCSV(targetCompanies);
    } else if (user.role === 'mentor') {
      profileData.availability = availability;
      profileData.companiesCracked = parseCSV(companiesCracked);
      profileData.expertise = parseCSV(expertise);
    }

    const result = await updateProfile(profileData);
    setSubmitting(false);

    if (result.success) {
      showToast('Profile updated successfully!', 'success');
      // Redirect to the appropriate dashboard
      navigate(user.role === 'mentor' ? '/mentor-dashboard' : '/mentee-dashboard');
    } else {
      showToast(result.message || 'Failed to update profile.', 'error');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-10 text-white">
          <h1 className="text-2xl font-extrabold">Edit Profile</h1>
          <p className="text-indigo-100 text-sm mt-1.5 capitalize">
            Update your {user.role} profile details to show on the platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 pl-0.5">
                <User className="w-4 h-4 text-slate-400" /> Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Branch */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 pl-0.5">
                <Book className="w-4 h-4 text-slate-400" /> Department / Branch
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. Computer Science Engineering"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Role specific: Year (Mentee only) */}
            {user.role === 'mentee' && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 pl-0.5">
                  <Clock className="w-4 h-4 text-slate-400" /> Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="Final Year">Final Year</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>
            )}

            {/* Role specific: Availability (Mentor only) */}
            {user.role === 'mentor' && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 pl-0.5">
                  <Clock className="w-4 h-4 text-slate-400" /> Availability Slots
                </label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g. Sat & Sun (10 AM - 12 PM)"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            )}

            {/* Skills (Common, comma separated) */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 pl-0.5">
                <Tag className="w-4 h-4 text-slate-400" /> Skills (Comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React.js, Node.js, Python, System Design"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Role specific: Target Companies (Mentee only) */}
            {user.role === 'mentee' && (
              <div className="md:col-span-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 pl-0.5">
                  <Briefcase className="w-4 h-4 text-slate-400" /> Target Companies (Comma separated)
                </label>
                <input
                  type="text"
                  value={targetCompanies}
                  onChange={(e) => setTargetCompanies(e.target.value)}
                  placeholder="Google, Microsoft, Amazon"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            )}

            {/* Role specific: Companies Cracked (Mentor only) */}
            {user.role === 'mentor' && (
              <>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 pl-0.5">
                    <Award className="w-4 h-4 text-slate-400" /> Companies Cracked / Placed (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={companiesCracked}
                    onChange={(e) => setCompaniesCracked(e.target.value)}
                    placeholder="Meta, Netflix, Apple"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Expertise (Mentor only) */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 pl-0.5">
                    <Briefcase className="w-4 h-4 text-slate-400" /> Domains of Expertise (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    placeholder="Backend Development, System Design, DSA"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </>
            )}

            {/* Bio (Common) */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 pl-0.5">
                <FileText className="w-4 h-4 text-slate-400" /> Professional Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself, current projects, placement history, etc."
                rows="4"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
