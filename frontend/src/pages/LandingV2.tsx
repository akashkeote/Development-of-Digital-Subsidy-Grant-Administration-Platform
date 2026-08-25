import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Zap, Target, BarChart, FileText } from 'lucide-react';

export const LandingV2: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [navVisible, setNavVisible] = useState(false);
  const totalFrames = 240;

  // Preload frames aggressively
  useEffect(() => {
    const imgArray: HTMLImageElement[] = [];
    const drawInitial = (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = `/anim-v2/frame_${i}.webp`;
      img.onload = () => {
        if (i === 0) drawInitial(img);
      };
      imgArray.push(img);
    }
    setImages(imgArray);
  }, []);

  // Scroll event listener for Canvas + Nav
  useEffect(() => {
    const handleScroll = () => {
      setNavVisible(window.scrollY > 100);

      if (images.length === 0) return;
      const html = document.documentElement;
      const scrollTop = html.scrollTop;
      const maxScrollTop = html.scrollHeight - window.innerHeight;
      const scrollFraction = maxScrollTop > 0 ? (scrollTop / maxScrollTop) : 0;
      
      const frameIndex = Math.min(totalFrames - 1, Math.floor(scrollFraction * totalFrames));
      const img = images[frameIndex];
      if (!img || !img.complete) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [images]);

  return (
    <div className="bg-[#050505] text-white font-sans selection:bg-[#0050FF] selection:text-white">
      
      {/* Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: navVisible ? 1 : 0, y: navVisible ? 0 : -20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 transition-all duration-500 bg-[#050505]/75 backdrop-blur-xl border-b border-white/5 py-3.5"
      >
        <div className="text-lg font-bold tracking-tight text-white/90">
          DIGIGRANT 2.0
        </div>
        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/60">
          <span className="hover:text-white transition-colors cursor-pointer">Overview</span>
          <span className="hover:text-white transition-colors cursor-pointer">DBT Tech</span>
          <span className="hover:text-white transition-colors cursor-pointer">Zero Leakage</span>
          <span className="hover:text-white transition-colors cursor-pointer">Security</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-5 py-1.5 text-[13px] font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all"
        >
          Access Portal
        </button>
      </motion.nav>

      {/* Pinned Background Canvas */}
      <div className="fixed inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full object-cover transform-gpu origin-center" />
        <div className="absolute inset-0 bg-black/50 pointer-events-none backdrop-blur-[2px]" />
      </div>

      {/* Flowing Content Sections */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col">
        
        {/* HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-bold tracking-widest uppercase mb-8 backdrop-blur-md">
              <Zap className="w-4 h-4" /> The Future of Subsidy Delivery
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
              Transparent. Secure. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-sm">
                Instant Disbursement.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Experience the next generation of government grant distribution. Powered by real-time DBT, automated KYC, and multi-tier verification.
            </p>
          </motion.div>
        </section>

        {/* Feature 1 */}
        <section className="min-h-screen flex items-center justify-start px-6 md:px-12 py-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-200px" }}
            transition={{ duration: 0.8 }}
            className="p-10 md:p-12 rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl max-w-lg"
          >
            <Target className="w-12 h-12 text-blue-400 mb-6" />
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Precision Targeting</h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              AI-driven beneficiary matching ensures funds reach the exact intended citizens without leakage. Aadhaar-linked KYC guarantees absolute accuracy.
            </p>
          </motion.div>
        </section>

        {/* Feature 2 */}
        <section className="min-h-screen flex items-center justify-end px-6 md:px-12 py-20">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-200px" }}
            transition={{ duration: 0.8 }}
            className="p-10 md:p-12 rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl max-w-lg"
          >
            <BarChart className="w-12 h-12 text-emerald-400 mb-6" />
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Real-time Analytics</h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              Live dashboards for all nodal officers to track disbursement metrics, ledger history, and fund utilization instantly across districts.
            </p>
          </motion.div>
        </section>

        {/* Feature 3 */}
        <section className="min-h-screen flex items-center justify-start px-6 md:px-12 py-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-200px" }}
            transition={{ duration: 0.8 }}
            className="p-10 md:p-12 rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl max-w-lg"
          >
            <FileText className="w-12 h-12 text-purple-400 mb-6" />
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Paperless Pipeline</h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              100% digital verification pipeline. Middlemen and delays fade away as transactions are processed end-to-end via our secure portal.
            </p>
          </motion.div>
        </section>

        {/* Outro */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pb-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl p-12 md:p-16 rounded-[3rem] bg-gradient-to-br from-blue-900/40 to-black/60 border border-blue-500/20 backdrop-blur-2xl shadow-2xl"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter mb-6">
              Track everything. <br/> <span className="text-white/50">Lose nothing.</span>
            </h2>
            <p className="text-xl text-blue-200 mb-10 max-w-xl mx-auto">
              Designed for governance, crafted for citizens. Join the digital revolution in subsidy distribution today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/login')}
                className="px-10 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Access Dashboard
              </button>
            </div>
            <p className="mt-8 text-xs text-white/40 uppercase tracking-widest font-semibold">
              Engineered for nodal officers, VLEs, and beneficiaries
            </p>
          </motion.div>
        </section>

      </div>
    </div>
  );
};