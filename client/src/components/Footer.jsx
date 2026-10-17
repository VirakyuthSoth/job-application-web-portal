import { Link } from 'react-router-dom';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link
              to="/"
              className="flex items-center space-x-2.5 font-bold text-xl text-white tracking-tight"
            >
              <img
                src="/worknow-logo.png"
                alt=""
                className="w-9 h-9 rounded-lg object-cover"
              />
              <span>
                Work <span className="text-indigo-400">now</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Modern full-stack job portal connecting ambitious talent with top employers. Built with the MERN stack.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-300">Course:</span> Full-Stack Web Development #FSD001_26
            </div>
          </div>

          {/* Quick Links for Seekers */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">For Job Seekers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Explore All Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Software+Development" className="hover:text-white transition-colors">
                  Tech & Software Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?workplaceType=Remote" className="hover:text-white transition-colors">
                  Remote Opportunities
                </Link>
              </li>
              <li>
                <Link to="/seeker/dashboard" className="hover:text-white transition-colors">
                  Application Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links for Employers */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/employer/post-job" className="hover:text-white transition-colors">
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link to="/employer/dashboard" className="hover:text-white transition-colors">
                  Employer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/employer/applicants" className="hover:text-white transition-colors">
                  Review Candidate Applications
                </Link>
              </li>
              <li>
                <Link to="/register?role=employer" className="hover:text-white transition-colors">
                  Employer Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack & Submission info */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Tech Stack Used</h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="px-2 py-1 bg-slate-800 text-indigo-300 rounded font-mono">React 18</span>
              <span className="px-2 py-1 bg-slate-800 text-cyan-300 rounded font-mono">Vite</span>
              <span className="px-2 py-1 bg-slate-800 text-sky-300 rounded font-mono">Tailwind CSS</span>
              <span className="px-2 py-1 bg-slate-800 text-emerald-300 rounded font-mono">Node.js</span>
              <span className="px-2 py-1 bg-slate-800 text-amber-300 rounded font-mono">Express.js</span>
              <span className="px-2 py-1 bg-slate-800 text-green-300 rounded font-mono">MongoDB</span>
              <span className="px-2 py-1 bg-slate-800 text-rose-300 rounded font-mono">JWT Auth</span>
              <span className="px-2 py-1 bg-slate-800 text-purple-300 rounded font-mono">Axios</span>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Student: <span className="font-semibold text-white">Virak Yuth</span>
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Work now. Built for Final Project — Full-Stack (#FSD001_26).</p>
          <p className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by Virak Yuth</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
