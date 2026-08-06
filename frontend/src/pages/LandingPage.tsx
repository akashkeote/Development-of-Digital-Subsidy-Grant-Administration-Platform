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
    { id: 'all', label: 'Explore All', icon: <Compass size={28} strokeWidth={2} />, color: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-500/25', bg: 'bg-blue-50' },
    { id: 'agriculture', label: 'Agriculture', icon: <Sprout size={28} strokeWidth={2} />, color: 'from-emerald-500 to-green-500', shadow: 'shadow-emerald-500/25', bg: 'bg-emerald-50' },
    { id: 'education', label: 'Education', icon: <GraduationCap size={28} strokeWidth={2} />, color: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/25', bg: 'bg-orange-50' },
    { id: 'energy', label: 'Green Energy', icon: <Sun size={28} strokeWidth={2} />, color: 'from-yellow-400 to-amber-500', shadow: 'shadow-yellow-500/25', bg: 'bg-yellow-50' },
    { id: 'housing', label: 'Housing', icon: <HomeIcon size={28} strokeWidth={2} />, color: 'from-rose-400 to-red-500', shadow: 'shadow-rose-500/25', bg: 'bg-rose-50' },
    { id: 'healthcare', label: 'Healthcare', icon: <HeartPulse size={28} strokeWidth={2} />, color: 'from-fuchsia-500 to-purple-500', shadow: 'shadow-fuchsia-500/25', bg: 'bg-fuchsia-50' },
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden" id="landing_page_root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-heading { font-family: 'Space Grotesk', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.8); }
        .glass-dark { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .perspective-container { perspective: 1200px; }
        .card-3d { transform-style: preserve-3d; transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
        .card-3d:hover { transform: rotateY(8deg) rotateX(5deg) translateY(-10px) translateZ(20px); }
        .btn-3d { transform-style: preserve-3d; transition: transform 0.15s ease-out; box-shadow: 0 4px 0 #3730a3, 0 8px 15px rgba(79,70,229,0.3); }
        .btn-3d:active { transform: translateY(4px); box-shadow: 0 0px 0 #3730a3, 0 4px 8px rgba(79,70,229,0.3); }
        .gradient-text { background: linear-gradient(135deg, #4F46E5, #7C3AED); -webkit-background-clip: text; color: transparent; }
        .gradient-text-shimmer { background: linear-gradient(90deg, #4F46E5, #9333EA, #4F46E5); background-size: 200% auto; -webkit-background-clip: text; color: transparent; animation: shimmer 3s linear infinite; }
        @keyframes shimmer { to { background-position: 200% center; } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float 9s ease-in-out infinite reverse; }
        .animate-float-delay { animation: float 7s ease-in-out infinite 2s; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-pulse-glow { animation: pulseGlow 2.5s infinite alternate; }
        @keyframes pulseGlow { 0% { box-shadow: 0 0 10px rgba(79,70,229,0.2); } 100% { box-shadow: 0 0 25px rgba(79,70,229,0.6); } }
        .mesh-bg { background-color: #f8fafc; background-image: radial-gradient(at 10% 20%, rgba(79,70,229,0.08) 0px, transparent 50%), radial-gradient(at 90% 10%, rgba(124,58,237,0.08) 0px, transparent 50%), radial-gradient(at 50% 80%, rgba(56,189,248,0.08) 0px, transparent 50%); }
        
        /* 3D Indian Flag */
        .flag-container {
          perspective: 800px;
          display: inline-flex;
          align-items: flex-start;
        }
        .flag-pole {
          width: 4px;
          height: 120px;
          background: linear-gradient(180deg, #d4d4d4 0%, #a8a29e 100%);
          border-radius: 2px;
          flex-shrink: 0;
          box-shadow: 1px 0 4px rgba(0,0,0,0.15);
          position: relative;
        }
        .flag-pole::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #C0A000, #FFD700);
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(255,215,0,0.4);
        }
        .flag {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: flagWave 4s ease-in-out infinite;
          transform-origin: left center;
          box-shadow: 2px 2px 15px rgba(0,0,0,0.15);
        }
        .flag-saffron {
          flex: 1;
          background: linear-gradient(90deg, #FF9933 0%, #FF8C1A 60%, #FF9933 100%);
        }
        .flag-white {
          flex: 1;
          background: linear-gradient(90deg, #FFFFFF 0%, #f8f8f8 60%, #FFFFFF 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .center-emblem {
          width: 90px;
          height: 90px;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100"><circle r="46" fill="none" stroke="%23000080" stroke-width="6"/><circle r="9" fill="%23000080"/><g fill="%23000080"><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(0)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(15)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(30)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(45)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(60)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(75)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(90)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(105)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(120)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(135)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(150)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(165)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(180)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(195)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(210)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(225)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(240)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(255)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(270)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(285)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(300)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(315)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(330)"/><path d="M-2.5,-9 L0,-46 L2.5,-9 Z" transform="rotate(345)"/></g><g fill="%23000080"><circle cx="0" cy="-40" r="1.5" transform="rotate(7.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(22.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(37.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(52.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(67.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(82.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(97.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(112.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(127.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(142.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(157.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(172.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(187.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(202.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(217.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(232.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(247.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(262.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(277.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(292.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(307.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(322.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(337.5)"/><circle cx="0" cy="-40" r="1.5" transform="rotate(352.5)"/></g></svg>');
          background-size: cover;
          animation: chakraSpin 10s linear infinite;
        }
        .flag-green {
          flex: 1;
          background: linear-gradient(90deg, #138808 0%, #0F7A05 60%, #138808 100%);
        }
        @keyframes flagWave {
          0%, 100% { transform: perspective(800px) rotateY(0deg) skewY(0deg); }
          25% { transform: perspective(800px) rotateY(8deg) skewY(2deg); }
          75% { transform: perspective(800px) rotateY(-4deg) skewY(-1deg); }
        }
        @keyframes chakraSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* 3D Glass Navbar (Floating Pill) */}
      <div className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
        <header className="w-full max-w-7xl relative pointer-events-auto">
          <div className="absolute inset-0 overflow-hidden shadow-lg border border-white/60 pointer-events-none rounded-full">
            <div className="absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-90" />
          </div>
          
          <div className="glass w-full px-6 py-3 flex items-center justify-between mt-1 relative z-10 rounded-full">
            <div className="flex items-center gap-3 group cursor-pointer outline-none" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-2xl bg-white border-2 border-blue-500 text-blue-500 flex items-center justify-center transition-transform duration-300 shadow-sm group-hover:scale-105">
                <Landmark size={22} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-heading font-extrabold text-blue-600 tracking-tight leading-none">DigiGrant</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/schemes" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Browse Subsidies</Link>
              <Link to="/how-it-works" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">How it Works</Link>
              <div className="w-px h-5 bg-slate-200"></div>
              <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Sign In</Link>
              <Link to="/register" className="btn-3d text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full">Get Started</Link>
            </div>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-28 lg:pt-52 lg:pb-36 px-6 mesh-bg min-h-screen flex items-center">
        {/* Massive 3D Background Flag */}
        <div className="absolute right-0 top-1/3 -translate-y-1/3 opacity-25 pointer-events-none z-0 transform scale-[1.2] lg:scale-[1.5] -rotate-6 hidden md:block perspective-container">
          <div className="flag-container" style={{ transform: 'rotateY(-20deg) rotateX(10deg)' }}>
            <div className="flag-pole" style={{height: '600px', width: '8px', background: 'linear-gradient(180deg, #a8a29e, #78716c)'}}></div>
            <div className="flag" style={{width: '600px', height: '400px', borderRadius: '0 8px 8px 0'}}>
              <div className="flag-saffron"></div>
              <div className="flag-white">
                <div className="center-emblem" style={{width: '90px', height: '90px', borderRadius: '50%', border: 'none'}}></div>
              </div>
              <div className="flag-green"></div>
            </div>
          </div>
        </div>

        {/* 3D Indian Leaders Graphic */}
        <div className="absolute right-10 -bottom-20 opacity-40 pointer-events-none z-0 transform scale-[0.9] lg:scale-[1.1] hidden lg:block perspective-container mix-blend-multiply mask-image-bottom">
          <motion.img 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            src="/src/assets/indian_leaders.jpg" 
            className="w-[600px] rounded-[3rem] shadow-2xl"
            style={{ transform: 'rotateY(-15deg) rotateX(10deg)', filter: 'contrast(1.1) saturate(1.2)' }}
            alt="Indian Historical Leaders and Warriors"
          />
        </div>

        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-[80px] animate-float z-0 pointer-events-none"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-violet-400/20 rounded-full blur-[100px] animate-float-slow z-0 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10 w-full">
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left perspective-container">
            <motion.div 
              initial={{ opacity: 0, y: 30, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-blue-100/60 animate-pulse-glow"
            >
              <span className="text-lg">🇮🇳</span>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-heading">Digital India Initiative 2026</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight text-slate-900 leading-[1.1]"
            >
              Empowering Citizens Through <br />
              <span className="text-blue-600">
                Digital Welfare.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
            >
              DigiGrant is the next-generation 3D platform to effortlessly discover grants, verify documents instantly, and receive DBT assistance securely.
            </motion.p>

            <motion.form 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              onSubmit={handleSearch} 
              className="max-w-xl mx-auto lg:mx-0 glass p-2.5 rounded-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_10px_40px_rgba(79,70,229,0.1)] flex flex-col sm:flex-row gap-3 transform-gpu"
            >
              <div className="relative flex-1 flex items-center px-4">
                <Search className="text-blue-400 shrink-0" size={22} />
                <input 
                  type="text" 
                  placeholder="Search 'Housing' or 'Agriculture'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-700 placeholder-slate-400 font-medium h-12 focus:outline-none focus:ring-0 ml-3"
                />
              </div>
              <button 
                type="submit" 
                className="btn-3d bg-gradient-to-r from-blue-600 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-heading tracking-wide"
              >
                Search <ArrowRight size={18} />
              </button>
            </motion.form>
          </div>

          <div className="lg:col-span-5 relative hidden md:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="absolute top-10 right-10 w-80 z-20 animate-float"
            >
              <div className="card-3d glass p-8 rounded-3xl shadow-2xl shadow-blue-900/10 border-t border-l border-white/80">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-inner">
                  <ShieldCheck size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 mb-3">Direct Benefit Transfer</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Instant, transparent payouts directly to your Aadhaar-linked bank account. Zero intermediaries.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute top-64 right-32 w-80 z-30 animate-float-delay"
            >
              <div className="card-3d bg-white/90 backdrop-blur-3xl p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100/80">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-fuchsia-50 text-purple-600 flex items-center justify-center mb-6 shadow-inner">
                  <FileText size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 mb-3">Paperless & Secure</h3>
                <p className="text-slate-500 font-medium leading-relaxed">End-to-end encrypted document vaults with real-time tracking of AI-driven approvals.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Clean Light Stats Section */}
      <section className="relative py-24 overflow-hidden bg-white border-t border-b border-slate-100">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-violet-100/40 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Disbursed (₹Cr)', value: `₹${(stats.totalDisbursedAmount / 10000000).toFixed(1)}` },
            { label: 'Citizens Reached', value: stats.totalRegisteredCitizens.toLocaleString() },
            { label: 'Active Schemes', value: stats.totalSchemesActive },
            { label: 'Applications', value: stats.totalApplicationsReceived.toLocaleString() }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(79,70,229,0.1)] transition-shadow duration-300 relative group"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-4xl md:text-5xl font-heading font-extrabold text-slate-800 mb-3">{stat.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pillars of India 3D Graphic Section */}
      <section className="relative py-20 bg-white overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full max-w-6xl rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-100 relative group perspective-container"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent z-10 pointer-events-none"></div>
            <img 
              src="/src/assets/pillars_of_india.jpg" 
              alt="Pillars of India: Scientist, Warrior, Farmer, Civilian" 
              className="w-full h-auto object-cover aspect-[2.4/1] transform group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute bottom-12 left-12 z-20 text-white max-w-2xl">
              <h3 className="text-3xl md:text-5xl font-heading font-extrabold mb-4 drop-shadow-lg tracking-tight text-white">Built for every Citizen.</h3>
              <p className="text-lg md:text-xl font-medium text-white/90 drop-shadow-md leading-relaxed">
                Empowering our farmers, honoring our warriors, and advancing our scientists. 
                A digital future designed for the people of India.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3D Category Icons Selector */}
      <section className="relative py-32 bg-slate-50 overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-heading font-extrabold text-slate-900 mb-6 tracking-tight"
            >
              Explore by Category
            </motion.h2>
            <p className="text-lg text-slate-500 font-medium">Immersive discovery of subsidies tailored to modern Indian life and enterprise.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 perspective-container">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                onClick={() => handleCategoryClick(cat.id)}
                className="card-3d group relative flex flex-col items-center justify-center p-8 bg-white hover:bg-slate-50/80 rounded-[2rem] cursor-pointer border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                {/* Colorful Glow Background on Hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${cat.color} transition-opacity duration-500 rounded-[2rem]`}></div>
                
                {/* The Floating Icon Block */}
                <div className={`relative z-10 w-20 h-20 rounded-3xl ${cat.bg} flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 group-hover:shadow-2xl ${cat.shadow}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="text-slate-600 group-hover:text-slate-900 transition-colors duration-300">
                    {cat.icon}
                  </div>
                </div>
                
                {/* Modern Typography */}
                <span className="relative z-10 text-[15px] font-heading font-bold text-slate-600 group-hover:text-slate-900 transition-colors duration-300">{cat.label}</span>
                
                {/* Subtle bottom border accent */}
                <div className={`absolute bottom-0 left-0 w-full h-1.5 opacity-0 group-hover:opacity-100 bg-gradient-to-r ${cat.color} transition-opacity duration-500 transform origin-left scale-x-0 group-hover:scale-x-100`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest font-heading mb-8">Powered by Government of India Digital Infrastructure</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            {['Digital India', 'Aadhaar', 'UPI', 'NIC', 'gov.in', 'myGov'].map((badge, i) => (
              <span key={i} className="text-lg md:text-xl font-heading font-extrabold text-slate-800 tracking-tight">{badge}</span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
