import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  FileText,
  Clock,
  CheckCircle2,
  Bookmark,
  Building2,
  MapPin,
  ExternalLink,
  Briefcase,
  Calendar,
  AlertCircle,
} from 'lucide-react';

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalApplied: 0,
    pending: 0,
    interviewing: 0,
    accepted: 0,
    savedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeekerData();
  }, []);

  const fetchSeekerData = async () => {
    setLoading(true);
    try {
      const [appsRes, statsRes] = await Promise.all([
        api.get('/applications/my-applications'),
        api.get('/users/dashboard-stats'),
      ]);

      if (appsRes.data.success) {
        setApplications(appsRes.data.applications);
      }
      if (statsRes.data.success && statsRes.data.stats) {
        setStats(statsRes.data.stats);
      }
    } catch (error) {
      console.error('Failed to load seeker applications:', error);
      toast.error('Failed to load your applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Interviewing':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Reviewed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingSpinner text="Loading your applications..." size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-300">
            Candidate Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Hello, {user?.name}!
          </h1>
          <p className="text-sm text-indigo-200 mt-1">
            {user?.headline || 'Job Seeker'} • Track all your sent applications and review hiring updates
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/jobs"
            className="inline-flex items-center space-x-2 px-5 py-3 bg-white hover:bg-slate-50 text-indigo-900 font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
          >
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Browse More Jobs</span>
          </Link>
          <Link
            to="/seeker/saved"
            className="inline-flex items-center space-x-2 px-4 py-3 bg-indigo-700/60 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl border border-indigo-500/40 transition-colors"
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Jobs ({stats.savedCount || 0})</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Submitted</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {stats.totalApplied || applications.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Total applications</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-3">
            {stats.pending || 0}
          </p>
          <p className="text-xs text-slate-400 mt-1">Awaiting employer review</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Interviewing</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-purple-600 mt-3">
            {stats.interviewing || 0}
          </p>
          <p className="text-xs text-slate-400 mt-1">Active interview stages</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Accepted</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 mt-3">
            {stats.accepted || 0}
          </p>
          <p className="text-xs text-slate-400 mt-1">Offers received</p>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              My Job Applications
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live updates on where your application stands in the review pipeline
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {applications.length} submitted
          </span>
        </div>

        {applications.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">
              You haven't applied for any jobs yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Browse our curated job postings and submit your application with one click!
            </p>
            <Link
              to="/jobs"
              className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse Job Openings</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Job Title & Company</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      {app.job ? (
                        <div>
                          <Link
                            to={`/jobs/${app.job._id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                          >
                            {app.job.title}
                          </Link>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{app.job.companyName}</span>
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Job posting removed</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs">
                      {app.job?.location ? (
                        <div className="flex items-center space-x-1 text-slate-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{app.job.location}</span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {app.job ? (
                        <Link
                          to={`/jobs/${app.job._id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <span>View Job</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeekerDashboard;
