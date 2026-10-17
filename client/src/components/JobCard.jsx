import { Link } from 'react-router-dom';
import {
  MapPin,
  Building,
  DollarSign,
  Clock,
  Bookmark,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

const JobCard = ({ job, isBookmarked = false, onToggleBookmark }) => {
  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
    }
    if (job.salaryMax) {
      return `Up to $${job.salaryMax.toLocaleString()}`;
    }
    if (job.salaryMin) {
      return `From $${job.salaryMin.toLocaleString()}`;
    }
    return 'Salary Negotiable';
  };

  const getWorkplaceBadgeColor = (type) => {
    switch (type) {
      case 'Remote':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Hybrid':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'On-site':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    const intervals = {
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    if (seconds >= intervals.day) {
      const days = Math.floor(seconds / intervals.day);
      return `${days}d ago`;
    }
    if (seconds >= intervals.hour) {
      const hours = Math.floor(seconds / intervals.hour);
      return `${hours}h ago`;
    }
    return 'Just now';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col justify-between">
      <div>
        {/* Top Header: Company Info & Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-100 to-indigo-50 border border-slate-200 flex items-center justify-center font-bold text-indigo-600 text-lg shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <img
                  src={
                    job.title === 'Senior UI/UX & Product Designer'
                      ? '/worknow-ux-icon.png'
                      : '/worknow-code-icon.png'
                  }
                  alt="WorkNow"
                  className={`w-full h-full object-cover rounded-xl ${
                    job.title === 'Senior UI/UX & Product Designer' ? '' : 'scale-110'
                  }`}
                />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                <Link to={`/jobs/${job._id}`}>{job.title}</Link>
              </h3>
              <p className="text-xs font-medium text-slate-500 flex items-center space-x-1.5 mt-0.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{job.companyName}</span>
              </p>
            </div>
          </div>

          {onToggleBookmark && (
            <button
              onClick={() => onToggleBookmark(job._id)}
              className={`p-2 rounded-xl border transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500 hover:border-slate-300'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Save job'}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`}
              />
            </button>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getWorkplaceBadgeColor(
              job.workplaceType
            )}`}
          >
            {job.workplaceType || 'On-site'}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {job.jobType || 'Full-time'}
          </span>
          {job.experienceLevel && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-200">
              {job.experienceLevel}
            </span>
          )}
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            {job.category}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-sm text-slate-600 mt-3.5 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-slate-500">
          <span className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.location}</span>
          </span>
          <span className="font-semibold text-slate-800 flex items-center space-x-1">
            <span>{formatSalary()}</span>
          </span>
          <span className="flex items-center space-x-1 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeAgo(job.createdAt)}</span>
          </span>
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center justify-center space-x-1 font-semibold text-indigo-600 hover:text-indigo-700 text-xs py-1.5 px-3 rounded-lg hover:bg-indigo-50 transition-colors self-end sm:self-auto"
        >
          <span>View Job</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
