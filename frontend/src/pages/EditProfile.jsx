import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { User, Book, Tag, Briefcase, Award, Clock, FileText, Save } from 'lucide-react';
import PhotoUpload from '../components/PhotoUpload';


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

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Common fields
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [branch, setBranch] = useState('');
  const [skills, setSkills] = useState(''); // input as comma separated list
  const [profilePicture, setProfilePicture] = useState('');

  // Mentee fields
  const [year, setYear] = useState('');
  const [targetCompanies, setTargetCompanies] = useState(''); // input as comma separated list

  // Mentor fields
  const [availability, setAvailability] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
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
      setProfilePicture(user.profilePicture || '');

      if (user.role === 'mentee') {
        setYear(user.year || '');
        setTargetCompanies(user.targetCompanies ? user.targetCompanies.join(', ') : '');
      } else if (user.role === 'mentor') {
        setAvailability(user.availability || '');
        setCurrentCompany(user.currentCompany || '');
        setCurrentRole(user.currentRole || '');
        setLinkedinProfile(user.linkedinProfile || '');
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
      profilePicture,
    };

    if (user.role === 'mentee') {
      profileData.year = year;
      profileData.targetCompanies = parseCSV(targetCompanies);
    } else if (user.role === 'mentor') {
      profileData.availability = availability;
      profileData.currentCompany = currentCompany;
      profileData.currentRole = currentRole;
      profileData.linkedinProfile = linkedinProfile;
      profileData.companiesCracked = parseCSV(companiesCracked);
      profileData.expertise = parseCSV(expertise);
    }

    const result = await updateProfile(profileData);
    setSubmitting(false);

    if (result.success) {
      showToast('Profile updated successfully!', 'success');
      navigate(user.role === 'mentor' ? '/mentor-dashboard' : '/mentee-dashboard');
    } else {
      showToast(result.message || 'Failed to update profile.', 'error');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="bg-[#1E293B] rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-8 py-8 text-white">
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          <p className="text-blue-100 text-sm mt-1 capitalize">
            Update your {user.role} profile details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Photo Upload / Capture */}
            <div className="md:col-span-2 flex flex-col items-center">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <User className="w-4 h-4 text-slate-400" /> Profile Photo
              </label>
              <PhotoUpload
                value={profilePicture}
                onChange={setProfilePicture}
                fullName={fullName}
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                <User className="w-4 h-4 text-slate-400" /> Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all"
                required
              />
            </div>

            {/* Branch */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                <Book className="w-4 h-4 text-slate-400" /> Department
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. Computer Science Engineering"
                className="w-full px-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all"
              />
            </div>

            {/* Role specific: Year (Mentee only) */}
            {user.role === 'mentee' && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                  <Clock className="w-4 h-4 text-slate-400" /> Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all"
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

            {/* Role specific: Mentor Fields */}
            {user.role === 'mentor' && (
              <>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                    <Clock className="w-4 h-4 text-slate-400" /> Availability Slots
                  </label>
                  <input
                    type="text"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    placeholder="e.g. Sat & Sun (10 AM - 12 PM)"
                    className="w-full px-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                    <Briefcase className="w-4 h-4 text-slate-400" /> Current Company
                  </label>
                  <input
                    type="text"
                    value={currentCompany}
                    onChange={(e) => setCurrentCompany(e.target.value)}
                    placeholder="e.g. Google, Microsoft, Amazon"
                    className="w-full px-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                    <Award className="w-4 h-4 text-slate-400" /> Current Job Role
                  </label>
                  <input
                    type="text"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    placeholder="e.g. Software Engineer, Tech Lead"
                    className="w-full px-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                    <Linkedin className="w-4 h-4 text-slate-400" /> LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedinProfile}
                    onChange={(e) => setLinkedinProfile(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-555 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all"
                    required={user.role === 'mentor'}
                  />
                </div>
              </>
            )}

            {/* Skills (Common, comma separated) */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                <Tag className="w-4 h-4 text-slate-400" /> Skills (Comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React.js, Node.js, Python, System Design"
                className="w-full px-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all"
              />
            </div>



            {/* Role specific: Target Companies (Mentee only) */}
            {user.role === 'mentee' && (
              <div className="md:col-span-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                  <Briefcase className="w-4 h-4 text-slate-400" /> Target Companies (Comma separated)
                </label>
                <input
                  type="text"
                  value={targetCompanies}
                  onChange={(e) => setTargetCompanies(e.target.value)}
                  placeholder="Google, Microsoft, Amazon"
                  className="w-full px-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all"
                />
              </div>
            )}

            {/* Role specific: Companies Cracked (Mentor only) */}
            {user.role === 'mentor' && (
              <>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                    <Award className="w-4 h-4 text-slate-400" /> Companies Cracked / Placed (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={companiesCracked}
                    onChange={(e) => setCompaniesCracked(e.target.value)}
                    placeholder="Meta, Netflix, Apple"
                    className="w-full px-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all"
                  />
                </div>

                {/* Expertise (Mentor only) */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                    <Briefcase className="w-4 h-4 text-slate-400" /> Domains of Expertise (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    placeholder="Backend Development, System Design, DSA"
                    className="w-full px-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all"
                  />
                </div>
              </>
            )}

            {/* Bio (Common) */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                <FileText className="w-4 h-4 text-slate-400" /> Professional Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself, current projects, placement history, etc."
                rows="4"
                className="w-full px-4 py-2 bg-[#111827] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-[#111827] transition-all resize-none"
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
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

