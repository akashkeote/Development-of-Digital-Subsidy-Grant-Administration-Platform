import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Zap, Target, BarChart, FileText } from 'lucide-react';

export const LandingV2: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

      if (images.length === 0 || !containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      // Calculate how far we've scrolled inside the container
      const scrollY = -rect.top;
      const maxScroll = rect.height - window.innerHeight;
      
      let scrollFraction = 0;
      if (scrollY > 0 && maxScroll > 0) {
        scrollFraction = scrollY / maxScroll;
      }
      if (scrollFraction > 1) scrollFraction = 1;
      if (scrollFraction < 0) scrollFraction = 0;

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

  // Framer Motion Scroll Setup explicitly targeting the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="bg-[#050505] min-h-[500vh] text-white font-sans selection:bg-[#0050FF] selection:text-white">
      
      {/* 1. Ultra-minimal Apple-style Navbar */}
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

      {/* 2. Pinned Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0 bg-[#050505]">
        
        {/* 3D Image Sequence Canvas */}
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover transform-gpu origin-center"
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none backdrop-blur-[2px]" />

        {/* Storytelling Text Overlays */}
        
        {/* HERO INTRO (0-15%) */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]),
            y: useTransform(scrollYProgress, [0, 0.15], [0, -100])
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
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
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Experience the next generation of government grant distribution. Powered by real-time DBT, automated KYC, and multi-tier verification.
          </p>
        </motion.div>

        {/* FEATURE 1: PRECISION TARGETING (15-40%) */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.4], [0, 1, 1, 0]),
            x: useTransform(scrollYProgress, [0.15, 0.25], [-100, 0])
          }}
          className="absolute inset-y-0 left-0 md:left-[10%] flex flex-col justify-center px-8 md:px-0 w-full md:w-1/3 pointer-events-none"
        >
          <div className="p-10 rounded-[2rem] bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl">
            <Target className="w-12 h-12 text-blue-400 mb-6" />
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Precision Targeting
            </h3>
            <p className="text-lg text-slate-300 leading-relaxed">
              AI-driven beneficiary matching ensures funds reach the exact intended citizens without leakage. Aadhaar-linked KYC guarantees absolute accuracy.
            </p>
          </div>
        </motion.div>

        {/* FEATURE 2: REAL-TIME ANALYTICS (40-65%) */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0.4, 0.5, 0.6, 0.65], [0, 1, 1, 0]),
            x: useTransform(scrollYProgress, [0.4, 0.5], [100, 0])
          }}
          className="absolute inset-y-0 right-0 md:right-[10%] flex flex-col justify-center px-8 md:px-0 w-full md:w-1/3 pointer-events-none"
        >
          <div className="p-10 rounded-[2rem] bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl text-left">
            <BarChart className="w-12 h-12 text-emerald-400 mb-6" />
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Real-time Analytics
            </h3>
            <p className="text-lg text-slate-300 leading-relaxed">
              Live dashboards for all nodal officers to track disbursement metrics, ledger history, and fund utilization instantly across districts.
            </p>
          </div>
        </motion.div>

        {/* FEATURE 3: PAPERLESS PIPELINE (65-85%) */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0.65, 0.75, 0.8, 0.85], [0, 1, 1, 0]),
            y: useTransform(scrollYProgress, [0.65, 0.75], [100, 0])
          }}
          className="absolute inset-y-0 left-0 md:left-[10%] flex flex-col justify-center px-8 md:px-0 w-full md:w-1/3 pointer-events-none"
        >
          <div className="p-10 rounded-[2rem] bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl">
            <FileText className="w-12 h-12 text-purple-400 mb-6" />
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Paperless Pipeline
            </h3>
            <p className="text-lg text-slate-300 leading-relaxed">
              100% digital verification pipeline. Middlemen and delays fade away as transactions are processed end-to-end via our secure portal.
            </p>
          </div>
        </motion.div>

        {/* REASSEMBLY & CTA (85-100%) */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0.85, 0.95], [0, 1]),
            scale: useTransform(scrollYProgress, [0.85, 1], [0.9, 1])
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 pointer-events-none"
        >
          <div className="max-w-4xl p-12 md:p-16 rounded-[3rem] bg-gradient-to-br from-blue-900/40 to-black/60 border border-blue-500/20 backdrop-blur-2xl shadow-2xl pointer-events-auto">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white mb-6">
              Track everything. <br/> <span className="text-white/50">Lose nothing.</span>
            </h2>
            <p className="text-xl text-blue-200 mb-10 max-w-xl mx-auto">
              Designed for governance, crafted for citizens. Join the digital revolution in subsidy distribution today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/login')}
                className="px-10 py-4 bg-white text-[#050505] rounded-full font-bold text-lg hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Access Dashboard
              </button>
            </div>
            <p className="mt-8 text-xs text-white/40 uppercase tracking-widest font-semibold">
              Engineered for nodal officers, VLEs, and beneficiaries
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
