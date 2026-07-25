import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Footer } from '../components/Footer';
import { 
  Search, 
  ArrowRight, 
  GraduationCap, 
  Home as HomeIcon, 
  Sun, 
  HeartPulse, 
  Sprout, 
  ShieldCheck, 
  FileText, 
  Compass,
  Landmark
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  const { schemes, stats } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Explore All', icon: <Compass size={24} /> },
    { id: 'agriculture', label: 'Agriculture', icon: <Sprout size={24} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={24} /> },
    { id: 'energy', label: 'Green Energy', icon: <Sun size={24} /> },
    { id: 'housing', label: 'Housing', icon: <HomeIcon size={24} /> },
    { id: 'healthcare', label: 'Healthcare', icon: <HeartPulse size={24} /> },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/schemes?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleCategoryClick = (catId: string) => {
    if (catId === 'all') navigate('/schemes');
    else navigate(`/schemes?category=${catId}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans" id="landing_page_root">
      
      {/* Sleek Navigation Bar */}
      <nav className="absolute top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Landmark size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">GovGrant</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/schemes" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition">Browse Subsidies</Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition">How it Works</Link>
            <div className="w-px h-4 bg-slate-200"></div>
            <Link to="/login" className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition">Sign In</Link>
            <Link to="/register" className="text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-full transition shadow-md shadow-slate-900/10">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-indigo-50 rounded-full blur-3xl -z-10 opacity-70"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-7 space-y-8 z-10 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Live Direct Benefit Transfers 2026</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-[64px] font-extrabold tracking-tight text-slate-900 leading-[1.1]"
            >
              Discover and claim <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">
                your subsidies.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium"
            >
              GovGrant is the modern, unified portal to find eligible government grants, upload verified documents, and receive financial assistance directly.
            </motion.p>

            {/* Premium Search Bar */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSearch} 
              className="max-w-xl mx-auto lg:mx-0 bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-1 flex items-center px-2">
                <Search className="text-slate-400 shrink-0" size={20} />
                <input 
                  type="text" 
                  placeholder="Try 'PM-KISAN' or 'Solar'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-slate-900 px-3 py-3 font-medium placeholder:text-slate-400 focus:outline-none text-base"
                />
              </div>
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                Search <ArrowRight size={16} />
              </button>
            </motion.form>
          </div>

          {/* Floating Glass Feature Cards */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 to-white/0 rounded-[40px] -z-10 transform translate-x-4 translate-y-4"></div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="grid gap-4"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-xl shadow-slate-200/40 transform hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                  <ShieldCheck size={24} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Direct Benefit Transfer</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Direct payments to Aadhaar-seeded accounts, bypassing intermediaries entirely.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-xl shadow-slate-200/40 transform translate-x-8 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                  <FileText size={24} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Paperless & Secure</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Secure document uploads with real-time tracking of verifications and approvals.</p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Clean Stats Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">₹{(stats.totalDisbursedAmount / 10000000).toFixed(1)} Cr</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Disbursed</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{stats.totalRegisteredCitizens.toLocaleString()}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Citizens</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{stats.totalSchemesActive}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Schemes</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{(stats.totalApplicationsReceived).toLocaleString()}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Applications</p>
          </div>
        </div>
      </section>

      {/* Category Icons Selector - Cleaned up */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Explore by Category</h2>
          <p className="text-base text-slate-500 font-medium">Find subsidies tailored to agriculture, education, healthcare, and more.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleCategoryClick(cat.id)}
              className="flex flex-col items-center p-8 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-[2rem] transition-all group text-center cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="text-slate-400 group-hover:text-indigo-600 mb-4 transition-colors">
                {cat.icon}
              </div>
              <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};
