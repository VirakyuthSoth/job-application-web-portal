import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  Send,
  PlusCircle,
} from 'lucide-react';

const CATEGORIES = [
  'Software Development',
  'Design',
  'Marketing',
  'Data & Analytics',
  'Sales',
  'Customer Support',
  'Finance',
  'Human Resources',
  'Other',
];

const WORKPLACE_TYPES = ['On-site', 'Remote', 'Hybrid'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const EXPERIENCE_LEVELS = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Lead / Manager',
];

const PostJobPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    companyName: user?.companyName || '',
    location: user?.companyLocation || 'Phnom Penh, Cambodia',
    workplaceType: 'On-site',
    jobType: 'Full-time',
    category: 'Software Development',
    experienceLevel: 'Mid Level',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    deadline: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location) {
      toast.error('Please complete all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        salaryMin: Number(formData.salaryMin) || 0,
        salaryMax: Number(formData.salaryMax) || 0,
        responsibilities: formData.responsibilities
          .split('\n')
          .filter((line) => line.trim() !== ''),
        requirements: formData.requirements
          .split('\n')
          .filter((line) => line.trim() !== ''),
        benefits: formData.benefits
          .split('\n')
          .filter((line) => line.trim() !== ''),
        deadline: formData.deadline || null,
      };

      const res = await api.post('/jobs', payload);
      if (res.data.success) {
        toast.success('Job opening posted successfully!');
        navigate(`/jobs/${res.data.job._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full text-indigo-200 text-xs font-semibold mb-3">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Employer Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Create New Job Opening
        </h1>
        <p className="text-sm text-indigo-200 mt-1 max-w-2xl">
          Publish an opportunity to reach qualified candidates across Southeast Asia and global remote networks.
        </p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Job Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Senior Full-Stack React & Node Developer"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-semibold text-slate-900"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Hiring Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              required
              placeholder="e.g. TechFlow Solutions"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Location *
            </label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g. Phnom Penh, Cambodia or Remote"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Job Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Workplace Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Workplace Mode *
            </label>
            <select
              name="workplaceType"
              value={formData.workplaceType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
            >
              {WORKPLACE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Employment Type *
            </label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
            >
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Experience Level *
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Salary Min */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Min Salary ($ USD / month)
            </label>
            <input
              type="number"
              name="salaryMin"
              placeholder="e.g. 1500"
              value={formData.salaryMin}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
            />
          </div>

          {/* Salary Max */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Max Salary ($ USD / month)
            </label>
            <input
              type="number"
              name="salaryMax"
              placeholder="e.g. 3000"
              value={formData.salaryMax}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
            />
          </div>

          {/* Deadline */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Application Deadline (Optional)
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
            />
          </div>

          {/* Job Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Job Description *
            </label>
            <textarea
              name="description"
              rows={5}
              required
              placeholder="Provide a comprehensive summary of the role, department mission, and impact..."
              value={formData.description}
              onChange={handleChange}
              className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-normal leading-relaxed"
            />
          </div>

          {/* Key Responsibilities */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Key Responsibilities (one per line)
            </label>
            <textarea
              name="responsibilities"
              rows={4}
              placeholder="Lead full-stack feature development in React and Express&#10;Architect scalable database schemas and APIs in MongoDB&#10;Conduct peer code reviews and uphold engineering standards"
              value={formData.responsibilities}
              onChange={handleChange}
              className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Requirements */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Requirements & Qualifications (one per line)
            </label>
            <textarea
              name="requirements"
              rows={4}
              placeholder="3+ years experience with React and Node.js&#10;Proficiency with MongoDB and Mongoose&#10;Strong understanding of REST APIs and JWT security"
              value={formData.requirements}
              onChange={handleChange}
              className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Benefits */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Benefits & Perks (one per line)
            </label>
            <textarea
              name="benefits"
              rows={3}
              placeholder="Competitive USD salary with biannual reviews&#10;Health & dental insurance coverage&#10;Flexible hybrid/remote schedule&#10;Annual learning allowance"
              value={formData.benefits}
              onChange={handleChange}
              className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/employer/dashboard')}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <span>Publishing...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Publish Job Opening</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobPage;
