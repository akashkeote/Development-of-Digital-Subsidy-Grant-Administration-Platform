import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
      // Nav visibility
      setNavVisible(window.scrollY > 100);

      // Canvas Frame
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

  // Framer Motion Scroll Setup for Text Sections
  const { scrollYProgress } = useScroll();

  return (
    <div className="bg-[#050505] min-h-[500vh] text-white font-sans selection:bg-[#0050FF] selection:text-white">
      
      {/* 1. Ultra-minimal Apple-style Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: navVisible ? 1 : 0, y: navVisible ? 0 : -20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 transition-all duration-500 bg-[#050505]/75 backdrop-blur-xl border-b border-white/5 py-3.5`}
      >
        <div className="text-lg font-bold tracking-tight text-white/90">
          DIGIGRANT 2.0
        </div>
        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/60">
          <a href="#overview" className="hover:text-white transition-colors cursor-pointer">Overview</a>
          <a href="#tech" className="hover:text-white transition-colors cursor-pointer">DBT Tech</a>
          <a href="#anc" className="hover:text-white transition-colors cursor-pointer">Zero Leakage</a>
          <a href="#specs" className="hover:text-white transition-colors cursor-pointer">Security</a>
          <a href="#buy" className="hover:text-white transition-colors cursor-pointer">Portal</a>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-5 py-1.5 text-[13px] font-bold text-white bg-gradient-to-r from-[#0050FF] to-[#00D6FF] rounded-full shadow-[0_0_15px_rgba(0,80,255,0.4)] hover:shadow-[0_0_25px_rgba(0,214,255,0.6)] transition-all"
        >
          Access Portal
        </button>
      </motion.nav>

      {/* 2. Pinned Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        
        {/* Subtle Background Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#050815] via-[#050505] to-[#050505] -z-10" />

        {/* 3D Image Sequence Canvas */}
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover transform-gpu origin-center"
        />

        {/* Storytelling Text Overlays (Absolute positioned inside the sticky container, driven by scroll progress) */}
        
        {/* HERO INTRO (0-15%) */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]),
            y: useTransform(scrollYProgress, [0, 0.15], [0, -50])
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none mt-40"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white/90 drop-shadow-2xl mb-4">
            DigiGrant 2.0
          </h1>
          <h2 className="text-2xl md:text-4xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#00D6FF] tracking-tight mb-4">
            Empowerment, perfected.
          </h2>
          <p className="text-lg text-white/50 max-w-lg mx-auto font-medium tracking-wide">
            Flagship digital subsidy distribution, re-engineered for a growing India.
          </p>
        </motion.div>

        {/* ENGINEERING REVEAL (15-40%) */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.4], [0, 1, 1, 0]),
            x: useTransform(scrollYProgress, [0.15, 0.25], [-50, 0])
          }}
          className="absolute inset-y-0 left-0 md:left-[10%] flex flex-col justify-center px-8 md:px-0 w-full md:w-1/3 pointer-events-none"
        >
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90 mb-6 leading-tight">
            Precision-engineered <br/> <span className="text-[#00D6FF]">for impact.</span>
          </h3>
          <p className="text-lg text-white/60 leading-relaxed mb-4">
            Aadhaar-linked KYC, real-time PFMS tracking, and automated workflows deliver absolute transparency.
          </p>
          <p className="text-lg text-white/60 leading-relaxed">
            Every transaction is routed with precision, speed, and security-reaching the right hands, instantly.
          </p>
        </motion.div>

        {/* NOISE CANCELLING (40-65%) */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0.4, 0.5, 0.6, 0.65], [0, 1, 1, 0]),
            x: useTransform(scrollYProgress, [0.4, 0.5], [50, 0])
          }}
          className="absolute inset-y-0 right-0 md:right-[10%] flex flex-col justify-center px-8 md:px-0 w-full md:w-1/3 text-left md:text-right pointer-events-none"
        >
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90 mb-6 leading-tight">
            Subsidy distribution, <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0050FF] to-[#00D6FF]">redefined.</span>
          </h3>
          <ul className="space-y-4 text-lg text-white/60 md:ml-auto">
            <li className="flex items-center md:justify-end gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#00D6FF]"></span> Multi-tier verification blocks fraudulent claims.</li>
            <li className="flex items-center md:justify-end gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#00D6FF]"></span> Real-time ledger analytics monitor every rupee.</li>
            <li className="flex items-center md:justify-end gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#00D6FF]"></span> Your funds stay secure-middlemen and delays fade away.</li>
          </ul>
        </motion.div>

        {/* SOUND & UPSCALING (65-85%) */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0.65, 0.75, 0.8, 0.85], [0, 1, 1, 0]),
            y: useTransform(scrollYProgress, [0.65, 0.75], [50, 0])
          }}
          className="absolute inset-y-0 left-0 md:left-[10%] flex flex-col justify-center px-8 md:px-0 w-full md:w-1/3 pointer-events-none"
        >
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90 mb-6 leading-tight">
            Immersive, <br/> live analytics.
          </h3>
          <p className="text-lg text-white/60 leading-relaxed mb-4">
            High-performance dashboards unlock detail, depth, and clarity in every scheme.
          </p>
          <p className="text-lg text-white/60 leading-relaxed">
            End-to-end digital tracking restores trust to government spending, so every grant is accounted for.
          </p>
        </motion.div>

        {/* REASSEMBLY & CTA (85-100%) */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0.85, 0.95], [0, 1]),
            scale: useTransform(scrollYProgress, [0.85, 1], [0.95, 1])
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 mt-40 z-20 pointer-events-none"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white/90 mb-4">
            Track everything. <br/> <span className="text-white/40">Lose absolutely nothing.</span>
          </h2>
          <p className="text-xl text-white/60 mb-10 tracking-tight">
            DigiGrant 2.0. Designed for governance, crafted for citizens.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 pointer-events-auto justify-center">
            <button onClick={() => navigate('/login')} className="px-8 py-4 bg-white text-[#050505] rounded-full font-bold text-lg hover:bg-gray-200 transition-colors">
              Access Portal
            </button>
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
              See full specs
            </button>
          </div>
          <p className="mt-8 text-xs text-white/40 uppercase tracking-widest font-semibold">
            Engineered for farmers, nodal officers, and everyone in between.
          </p>
        </motion.div>

      </div>
    </div>
  );
};
