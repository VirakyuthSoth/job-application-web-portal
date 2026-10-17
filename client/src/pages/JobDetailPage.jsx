import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ApplyModal from '../components/ApplyModal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Bookmark,
  CheckCircle,
  ExternalLink,
  ChevronLeft,
  Share2,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isSeeker, isEmployer } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.job);
          setHasApplied(res.data.hasApplied);
          setApplicationStatus(res.data.applicationStatus);
          setIsSaved(res.data.isSaved);
        }
      } catch (error) {
        console.error('Failed to fetch job details:', error);
        toast.error('Job posting not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id, navigate]);

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in as a Job Seeker to bookmark this job');
      navigate('/login');
      return;
    }
    if (!isSeeker) {
      toast.error('Only Job Seekers can bookmark jobs');
      return;
    }

    try {
      const res = await api.post(`/users/save-job/${id}`);
      if (res.data.success) {
        setIsSaved(res.data.saved);
        toast.success(
          res.data.saved ? 'Job added to bookmarks!' : 'Job removed from bookmarks'
        );
      }
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Job link copied to clipboard!');
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to apply for this job');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    if (isEmployer) {
      toast.error('Employer accounts cannot apply for jobs. Please log in as a Job Seeker.');
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleApplicationSuccess = (application) => {
    setHasApplied(true);
    setApplicationStatus(application.status || 'Pending');
    if (job) {
      setJob({ ...job, applicantCount: (job.applicantCount || 0) + 1 });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingSpinner text="Loading job details..." size="lg" />
      </div>
    );
  }

  if (!job) return null;

  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} / month`;
    }
    if (job.salaryMax) {
      return `Up to $${job.salaryMax.toLocaleString()} / month`;
    }
    if (job.salaryMin) {
      return `From $${job.salaryMin.toLocaleString()} / month`;
    }
    return 'Salary Negotiable';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to job listings</span>
      </button>

      {/* Main Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-50 to-indigo-100 border border-indigo-200 text-indigo-600 font-extrabold text-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <img
                  src={
                    job.title === 'Senior UI/UX & Product Designer'
                      ? '/worknow-ux-icon.png'
                      : '/worknow-code-icon.png'
                  }
                  alt="WorkNow"
                  className={`w-full h-full object-cover rounded-2xl ${
                    job.title === 'Senior UI/UX & Product Designer' ? '' : 'scale-110'
                  }`}
                />
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h1>
              <p className="text-sm font-semibold text-indigo-600 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4" />
                <span>{job.companyName}</span>
              </p>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.location}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.jobType}</span>
                </span>
                <span className="font-semibold text-slate-700">
                  {formatSalary()}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons on header */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2.5 flex-shrink-0">
            {hasApplied ? (
              <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Applied ({applicationStatus || 'Pending'})</span>
              </div>
            ) : job.status === 'closed' ? (
              <div className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-semibold">
                Job Closed
              </div>
            ) : (
              <button
                onClick={handleApplyClick}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Apply Now</span>
              </button>
            )}

            <div className="flex items-center space-x-2">
              {isSeeker && (
                <button
                  onClick={handleToggleBookmark}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                    isSaved
                      ? 'bg-amber-50 border-amber-200 text-amber-600'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title={isSaved ? 'Bookmarked' : 'Save job'}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`}
                  />
                </button>
              )}

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors"
                title="Share job link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Workplace</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {job.workplaceType || 'On-site'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Experience</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {job.experienceLevel || 'Mid Level'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Category</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {job.category}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Applicants</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {job.applicantCount || 0} applied
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Job Content + Company Info Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">
                Job Overview
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Key Responsibilities
                </h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, index) => (
                    <li
                      key={index}
                      className="text-sm text-slate-600 flex items-start space-x-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Requirements & Qualifications
                </h3>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="text-sm text-slate-600 flex items-start space-x-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Benefits & Perks
                </h3>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="text-sm text-slate-600 flex items-start space-x-2.5"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Company & Application Summary */}
        <div className="space-y-6">
          {/* Company Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">About the Employer</h3>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {job.companyName}
              </p>
              {job.employer?.bio && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {job.employer.bio}
                </p>
              )}
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              {job.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.employer?.companyWebsite && (
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <a
                    href={job.employer.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline truncate"
                  >
                    {job.employer.companyWebsite}
                  </a>
                </div>
              )}
              {job.deadline && (
                <div className="flex items-center space-x-2 text-amber-700 bg-amber-50 p-2 rounded-xl">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Apply trigger in sidebar */}
            <div className="pt-2">
              {hasApplied ? (
                <div className="w-full py-2.5 bg-emerald-50 text-emerald-700 text-center rounded-xl text-xs font-semibold">
                  Application Submitted
                </div>
              ) : (
                <button
                  onClick={handleApplyClick}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow transition-colors"
                >
                  Apply For This Job
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={handleApplicationSuccess}
      />
    </div>
  );
};

export default JobDetailPage;
