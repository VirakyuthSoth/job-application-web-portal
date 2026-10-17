import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Bookmark, Briefcase, ArrowLeft } from 'lucide-react';

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/saved-jobs');
      if (res.data.success) {
        setSavedJobs(res.data.savedJobs || []);
      }
    } catch (error) {
      console.error('Failed to load saved jobs:', error);
      toast.error('Failed to load bookmarked jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (jobId) => {
    try {
      const res = await api.post(`/users/save-job/${jobId}`);
      if (res.data.success) {
        setSavedJobs(savedJobs.filter((job) => job._id !== jobId));
        toast.success('Job removed from bookmarks');
      }
    } catch (error) {
      toast.error('Failed to remove bookmark');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <LoadingSpinner text="Loading saved jobs..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/seeker/dashboard"
        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Seeker Dashboard</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Saved & Bookmarked Jobs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Jobs you've pinned for later review and fast application
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <Bookmark className="w-5 h-5 fill-amber-500" />
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">
            No saved jobs yet
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click the bookmark icon on any job card to save it here for later.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isBookmarked={true}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
