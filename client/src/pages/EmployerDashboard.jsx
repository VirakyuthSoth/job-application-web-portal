import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    pendingApplicants: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [jobsRes, statsRes] = await Promise.all([
        api.get('/jobs/employer/my-jobs'),
        api.get('/users/dashboard-stats'),
      ]);

      if (jobsRes.data.success) {
        setJobs(jobsRes.data.jobs);
      }
      if (statsRes.data.success && statsRes.data.stats) {
        setStats(statsRes.data.stats);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will also remove all candidate applications for this job.`)) {
      return;
    }

    try {
      const res = await api.delete(`/jobs/${jobId}`);
      if (res.data.success) {
        toast.success('Job posting deleted successfully');
        setJobs(jobs.filter((j) => j._id !== jobId));
        setStats((prev) => ({
          ...prev,
          totalJobs: Math.max(0, prev.totalJobs - 1),
          activeJobs: Math.max(0, prev.activeJobs - 1),
        }));
      }
    } catch (error) {
      toast.error('Failed to delete job posting');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingSpinner text="Loading employer dashboard..." size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-300">
            Employer Control Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-indigo-200 mt-1">
            {user?.companyName || 'Your Company'} • Manage your job listings and review candidate submissions
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/employer/post-job"
            className="inline-flex items-center space-x-2 px-5 py-3 bg-white hover:bg-slate-50 text-indigo-900 font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>Post New Job</span>
          </Link>
          <Link
            to="/employer/applicants"
            className="inline-flex items-center space-x-2 px-4 py-3 bg-indigo-700/60 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl border border-indigo-500/40 transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>All Applicants</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Jobs</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {stats.totalJobs || jobs.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Created on Work now</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Openings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {stats.activeJobs || jobs.filter((j) => j.status === 'active').length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Accepting applications</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Applicants</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {stats.totalApplicants || 0}
          </p>
          <p className="text-xs text-slate-400 mt-1">Across all listings</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-3">
            {stats.pendingApplicants || 0}
          </p>
          <p className="text-xs text-slate-400 mt-1">Awaiting your response</p>
        </div>
      </div>

      {/* Posted Jobs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Posted Jobs</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review applicant counts, edit details, or post new opportunities
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {jobs.length} Job{jobs.length === 1 ? '' : 's'}
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">
              You haven't posted any jobs yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Start finding great talent today by creating your first job posting.
            </p>
            <Link
              to="/employer/post-job"
              className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Job Now</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Job Title & Category</th>
                  <th className="px-6 py-4">Location & Type</th>
                  <th className="px-6 py-4">Applicants</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Posted</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                        >
                          {job.title}
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5">{job.category}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5">
                        <span className="font-medium text-slate-800">{job.location}</span>
                        <div className="text-slate-500">
                          {job.workplaceType} • {job.jobType}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Link
                        to={`/employer/applicants?jobId=${job._id}`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicantCount || 0} candidate{(job.applicantCount || 0) === 1 ? '' : 's'}</span>
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          job.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {job.status === 'active' ? 'Active' : 'Closed'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/employer/applicants?jobId=${job._id}`}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Candidates"
                        >
                          <Users className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/employer/edit-job/${job._id}`}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job._id, job.title)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
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
  );
};

export default EmployerDashboard;
