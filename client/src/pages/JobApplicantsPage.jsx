import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Users,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  ChevronDown,
  Calendar,
  Briefcase,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

const STATUS_OPTIONS = [
  'Pending',
  'Reviewed',
  'Interviewing',
  'Accepted',
  'Rejected',
];

const JobApplicantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedJobId = searchParams.get('jobId') || '';

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedCoverLetter, setExpandedCoverLetter] = useState(null);
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesText, setNotesText] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [selectedJobId, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedJobId) params.append('jobId', selectedJobId);
      if (statusFilter !== 'All') params.append('status', statusFilter);

      const res = await api.get(`/applications/employer/all?${params.toString()}`);
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
      toast.error('Failed to load candidate applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await api.patch(`/applications/${appId}/status`, {
        status: newStatus,
      });

      if (res.data.success) {
        toast.success(`Application marked as "${newStatus}"`);
        setApplications((prev) =>
          prev.map((app) =>
            app._id === appId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSaveNotes = async (appId) => {
    try {
      const res = await api.patch(`/applications/${appId}/status`, {
        employerNotes: notesText,
      });

      if (res.data.success) {
        toast.success('Internal notes updated');
        setApplications((prev) =>
          prev.map((app) =>
            app._id === appId ? { ...app, employerNotes: notesText } : app
          )
        );
        setEditingNotesId(null);
      }
    } catch (error) {
      toast.error('Failed to save notes');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Candidate Applications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming resumes, manage hiring stages, and record recruitment notes
          </p>
        </div>

        {selectedJobId && (
          <button
            onClick={() => {
              searchParams.delete('jobId');
              setSearchParams(searchParams);
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 self-start md:self-auto"
          >
            ← Showing single job filter (Clear to view all)
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['All', ...STATUS_OPTIONS].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              statusFilter === tab
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Applicants List */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12">
          <LoadingSpinner text="Fetching applicants..." />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">
            No applicants found
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {statusFilter === 'All'
              ? 'No candidates have applied to your active postings yet.'
              : `No candidates currently under status "${statusFilter}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Candidate Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 font-bold text-lg flex items-center justify-center flex-shrink-0 border border-indigo-100">
                    {app.fullName?.charAt(0) || 'A'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-900 text-base">
                        {app.fullName}
                      </h3>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <p className="text-xs text-indigo-600 font-semibold flex items-center space-x-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Applied for: {app.job?.title || 'Job Opening'}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                      <a
                        href={`mailto:${app.email}`}
                        className="flex items-center space-x-1 hover:text-indigo-600"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.email}</span>
                      </a>
                      {app.phone && (
                        <a
                          href={`tel:${app.phone}`}
                          className="flex items-center space-x-1 hover:text-indigo-600"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{app.phone}</span>
                        </a>
                      )}
                      <span className="flex items-center space-x-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          Applied {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </span>
                    </div>

                    {/* Applicant headline & skills */}
                    {app.applicant?.headline && (
                      <p className="text-xs text-slate-600 italic pt-1">
                        "{app.applicant.headline}"
                      </p>
                    )}
                    {app.applicant?.skills && app.applicant.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {app.applicant.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Selector & Resume Link */}
                <div className="flex flex-col sm:items-end gap-2.5 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-500">
                      Update Stage:
                    </span>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Resume</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {app.portfolioUrl && (
                      <a
                        href={app.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <span>Portfolio</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Letter Accordion */}
              {app.coverLetter && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() =>
                      setExpandedCoverLetter(
                        expandedCoverLetter === app._id ? null : app._id
                      )
                    }
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>
                      {expandedCoverLetter === app._id
                        ? 'Hide Cover Letter'
                        : 'Read Cover Letter / Note'}
                    </span>
                  </button>

                  {expandedCoverLetter === app._id && (
                    <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line animate-in fade-in duration-100">
                      {app.coverLetter}
                    </div>
                  )}
                </div>
              )}

              {/* Employer Internal Notes */}
              <div className="pt-2 border-t border-slate-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex-1">
                  {editingNotesId === app._id ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="text"
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        placeholder="Add private evaluation notes..."
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <button
                        onClick={() => handleSaveNotes(app._id)}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="px-2 py-1.5 text-slate-500 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="text-slate-500 flex items-center space-x-1.5">
                      <span className="font-semibold text-slate-700">Internal Note:</span>
                      <span className="italic">
                        {app.employerNotes || 'No notes added yet'}
                      </span>
                    </div>
                  )}
                </div>

                {editingNotesId !== app._id && (
                  <button
                    onClick={() => {
                      setEditingNotesId(app._id);
                      setNotesText(app.employerNotes || '');
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors self-end sm:self-auto"
                  >
                    {app.employerNotes ? 'Edit Note' : '+ Add Note'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicantsPage;
