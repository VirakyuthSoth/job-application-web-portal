import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Search,
  MapPin,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Building2,
  Users,
  ShieldCheck,
  ArrowRight,
  Code,
  Palette,
  Megaphone,
  BarChart3,
  Headphones,
  DollarSign,
  Sparkles,
} from 'lucide-react';

const CATEGORY_ITEMS = [
  { name: 'Software Development', icon: Code, count: '120+ jobs', color: 'bg-indigo-50 text-indigo-600' },
  { name: 'Design', icon: Palette, count: '45+ jobs', color: 'bg-pink-50 text-pink-600' },
  { name: 'Marketing', icon: Megaphone, count: '38+ jobs', color: 'bg-amber-50 text-amber-600' },
  { name: 'Data & Analytics', icon: BarChart3, count: '29+ jobs', color: 'bg-blue-50 text-blue-600' },
  { name: 'Customer Support', icon: Headphones, count: '22+ jobs', color: 'bg-emerald-50 text-emerald-600' },
  { name: 'Finance', icon: DollarSign, count: '18+ jobs', color: 'bg-purple-50 text-purple-600' },
];

const HomePage = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, isSeeker, isEmployer, demoLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const res = await api.get('/jobs?limit=4');
        if (res.data.success) {
          setRecentJobs(res.data.jobs);
        }
      } catch (error) {
        console.error('Failed to load recent jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleQuickDemo = async (role) => {
    try {
      await demoLogin(role);
      toast.success(`Logged in as Demo ${role === 'employer' ? 'Employer' : 'Job Seeker'}!`);
      navigate(role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard');
    } catch (err) {
      toast.error('Demo login failed. Make sure backend and database are running.');
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-white pt-16 pb-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Final Project — Full-Stack (#FSD001_26)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Discover Your Next Dream Career or <span className="text-indigo-600">Hire Top Talent</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connecting passionate professionals with innovative companies worldwide. Browse vetted opportunities, submit fast applications, and manage hiring workflows seamlessly.
          </p>

          {/* Quick Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-10 max-w-3xl mx-auto bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex-1 flex items-center space-x-2 px-3 py-2 w-full">
              <Search className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, keywords, or company..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full text-sm bg-transparent focus:outline-none placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

            <div className="flex-1 flex items-center space-x-2 px-3 py-2 w-full">
              <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <input
                type="text"
                placeholder="City, country, or Remote..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm bg-transparent focus:outline-none placeholder:text-slate-400 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Search Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Pills (for instructors & testing) */}
          {!isAuthenticated && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="text-slate-500 font-medium">1-Click Test Demo:</span>
              <button
                type="button"
                onClick={() => handleQuickDemo('job_seeker')}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg font-semibold transition-all flex items-center space-x-1"
              >
                <span>Demo Job Seeker (Virak Yuth)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('employer')}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-lg font-semibold transition-all flex items-center space-x-1"
              >
                <span>Demo Employer (TechFlow HR)</span>
              </button>
            </div>
          )}

          {/* Key Stats Counter */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200/60">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">500+</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Active Job Listings</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">120+</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Verified Companies</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">10k+</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Talented Candidates</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">98%</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Placement Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Job Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore in-demand industries and career paths
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 mt-2 sm:mt-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORY_ITEMS.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all group flex items-center space-x-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Jobs Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Job Openings
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Fresh opportunities posted recently by verified employers
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 mt-2 sm:mt-0"
          >
            <span>Browse All Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching latest jobs..." />
        ) : recentJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">No job postings found yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Be the first employer to post an opening!
            </p>
            <Link
              to="/employer/post-job"
              className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
            >
              Post a Job
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recentJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Value Proposition / Benefits Section */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white py-16 rounded-3xl max-w-7xl mx-auto px-6 sm:px-10 my-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Why Professionals & Employers Choose Work now
          </h2>
          <p className="text-sm text-indigo-200 mt-2">
            Engineered with modern tools to provide transparent, lightning-fast hiring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">Verified Job Postings</h3>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Every job posting is created by verified employers with transparent salary expectations and workplace guidelines.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">Live Application Tracking</h3>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Job seekers enjoy full visibility into application stages: Reviewed, Interviewing, Accepted, or Closed.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">Secure JWT & Role Auth</h3>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Protected routes and data isolation ensure candidate privacy and employer pipeline integrity at all times.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
