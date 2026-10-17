import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import JobFilter from '../components/JobFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Briefcase, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, isSeeker } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Filter state initialized from URL query params
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || 'All',
    jobType: searchParams.get('jobType') || 'All',
    workplaceType: searchParams.get('workplaceType') || 'All',
    experienceLevel: searchParams.get('experienceLevel') || 'All',
    location: searchParams.get('location') || '',
    minSalary: searchParams.get('minSalary') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  // Load saved job IDs if user is logged in as job seeker
  useEffect(() => {
    if (isAuthenticated && isSeeker && user?.savedJobs) {
      setSavedJobIds(
        user.savedJobs.map((item) => (typeof item === 'object' ? item._id : item))
      );
    }
  }, [isAuthenticated, isSeeker, user]);

  // Fetch jobs whenever filters or page changes
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.keyword) params.append('keyword', filters.keyword);
        if (filters.category && filters.category !== 'All') params.append('category', filters.category);
        if (filters.jobType && filters.jobType !== 'All') params.append('jobType', filters.jobType);
        if (filters.workplaceType && filters.workplaceType !== 'All') params.append('workplaceType', filters.workplaceType);
        if (filters.experienceLevel && filters.experienceLevel !== 'All') params.append('experienceLevel', filters.experienceLevel);
        if (filters.location) params.append('location', filters.location);
        if (filters.minSalary) params.append('minSalary', filters.minSalary);
        if (filters.sort) params.append('sort', filters.sort);
        params.append('page', currentPage);
        params.append('limit', '8');

        // Update URL query string
        setSearchParams(params, { replace: true });

        const res = await api.get(`/jobs?${params.toString()}`);
        if (res.data.success) {
          setJobs(res.data.jobs);
          setTotalJobs(res.data.totalJobs);
          setTotalPages(res.data.totalPages);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        toast.error('Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // reset to page 1 on filter change
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      category: 'All',
      jobType: 'All',
      workplaceType: 'All',
      experienceLevel: 'All',
      location: '',
      minSalary: '',
      sort: 'newest',
    });
    setCurrentPage(1);
  };

  const handleToggleBookmark = async (jobId) => {
    if (!isAuthenticated) {
      toast.error('Please sign in as a Job Seeker to bookmark jobs');
      return;
    }
    if (!isSeeker) {
      toast.error('Only Job Seekers can bookmark jobs');
      return;
    }

    try {
      const res = await api.post(`/users/save-job/${jobId}`);
      if (res.data.success) {
        if (res.data.saved) {
          setSavedJobIds((prev) => [...prev, jobId]);
          toast.success('Job saved to your bookmarks!');
        } else {
          setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
          toast.success('Job removed from bookmarks');
        }
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Browse Job Openings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {jobs.length} of {totalJobs} active position{totalJobs === 1 ? '' : 's'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="md:hidden flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="salary-high">Salary: High to Low</option>
              <option value="salary-low">Salary: Low to High</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filter + Jobs List */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar Filter */}
        <div className="hidden md:block md:col-span-1 sticky top-24">
          <JobFilter
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Modal/Collapse */}
        {showMobileFilter && (
          <div className="md:hidden col-span-1">
            <JobFilter
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Job Listings Column */}
        <div className="md:col-span-3 space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12">
              <LoadingSpinner text="Searching jobs..." />
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">
                No matching jobs found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try adjusting your search criteria, clearing selected filters, or searching for broader terms.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isBookmarked={savedJobIds.includes(job._id)}
                    onToggleBookmark={isSeeker ? handleToggleBookmark : null}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                  >
                    Previous Page
                  </button>
                  <span className="text-xs text-slate-500 font-medium">
                    Page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
                    <span className="font-bold text-slate-800">{totalPages}</span>
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                  >
                    Next Page
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
