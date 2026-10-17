import { Search, MapPin, Filter, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
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

const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
const WORKPLACE_TYPES = ['All', 'Remote', 'Hybrid', 'On-site'];
const EXPERIENCE_LEVELS = [
  'All',
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Lead / Manager',
];

const JobFilter = ({ filters, onChange, onReset }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-900 flex items-center space-x-2 text-sm">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filter Job Openings</span>
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Job Title or Keyword
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            name="keyword"
            placeholder="e.g. React, Designer, Engineer..."
            value={filters.keyword || ''}
            onChange={onChange}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Location
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            name="location"
            placeholder="e.g. Phnom Penh, Remote, Singapore..."
            value={filters.location || ''}
            onChange={onChange}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          />
        </div>
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Category
        </label>
        <select
          name="category"
          value={filters.category || 'All'}
          onChange={onChange}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
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
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Workplace Mode
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {WORKPLACE_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                onChange({ target: { name: 'workplaceType', value: type } })
              }
              className={`text-xs py-1.5 px-2.5 rounded-lg font-medium transition-all text-center border ${
                (filters.workplaceType || 'All') === type
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Job Type */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Employment Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {JOB_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                onChange({ target: { name: 'jobType', value: type } })
              }
              className={`text-xs py-1 px-2.5 rounded-lg font-medium transition-all border ${
                (filters.jobType || 'All') === type
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Experience Level
        </label>
        <select
          name="experienceLevel"
          value={filters.experienceLevel || 'All'}
          onChange={onChange}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
        >
          {EXPERIENCE_LEVELS.map((exp) => (
            <option key={exp} value={exp}>
              {exp}
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Monthly Salary */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Min Monthly Salary ($ USD)
        </label>
        <input
          type="number"
          name="minSalary"
          placeholder="e.g. 1500"
          value={filters.minSalary || ''}
          onChange={onChange}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
        />
      </div>
    </div>
  );
};

export default JobFilter;
