import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Zap, Target, BarChart, FileText } from 'lucide-react';

export const LandingV2: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const totalFrames = 240;

  // 1. Preload frames aggressively
  useEffect(() => {
    const imgArray: HTMLImageElement[] = [];
    
    // Function to draw a specific frame immediately once loaded
    const drawInitial = (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      // Use CONTAIN logic to show the entire 3D model without cropping
      if (canvasRatio > imgRatio) {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = `/anim-v2/frame_${i}.webp`;
      img.onload = () => {
        // Draw frame 0 immediately so screen is never black
        if (i === 0) {
          drawInitial(img);
        }
      };
      imgArray.push(img);
    }
    setImages(imgArray);
  }, []);

  // 2. Scroll event listener to tie frame to scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (images.length === 0) return;
      
      const html = document.documentElement;
      const scrollTop = html.scrollTop;
      const maxScrollTop = html.scrollHeight - window.innerHeight;
      
      // Calculate fraction of scroll (0 to 1)
      const scrollFraction = maxScrollTop > 0 ? (scrollTop / maxScrollTop) : 0;
      
      // Map to frame index
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(scrollFraction * totalFrames)
      );

      const img = images[frameIndex];
      if (!img || !img.complete) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      // Use CONTAIN logic to show the entire 3D model without cropping
      if (canvasRatio > imgRatio) {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    // Call once to render initial state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [images]);

  return (
    <div className="relative bg-black min-h-[400vh] font-sans">
      
      {/* Pinned 3D Background */}
      <div className="fixed inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/90 pointer-events-none" />
      </div>

      {/* Content Layer (Scrolls normally over the pinned canvas) */}
      <div className="relative z-10">
        
        {/* Header */}
        <header className="container mx-auto px-6 py-6 flex justify-between items-center sticky top-0 bg-black/20 backdrop-blur-sm border-b border-white/5">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white tracking-widest uppercase">DigiGrant <span className="text-blue-500">2.0</span></span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Back to V1
            </button>
            <button onClick={() => navigate('/login')} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-full backdrop-blur-md border border-white/10 transition-all">
              Login
            </button>
          </div>
        </header>

        {/* Section 1: Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-widest uppercase mb-8">
              <Zap className="w-4 h-4" /> Scroll to experience
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-8 drop-shadow-2xl">
              Transparent. Secure. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Instant Disbursement.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience the next generation of government grant distribution. Powered by real-time DBT, automated KYC, and multi-tier verification.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg flex items-center gap-3 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]"
              >
                Get Started Now <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </section>

        {/* Section 2: Features */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-200px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl text-left"
          >
            <div className="p-10 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl hover:bg-white/5 transition-all">
              <Target className="w-12 h-12 text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Precision Targeting</h3>
              <p className="text-slate-400 leading-relaxed text-lg">AI-driven beneficiary matching ensures funds reach the exact intended citizens without leakage.</p>
            </div>
            <div className="p-10 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl hover:bg-white/5 transition-all">
              <BarChart className="w-12 h-12 text-emerald-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Real-time Analytics</h3>
              <p className="text-slate-400 leading-relaxed text-lg">Live dashboards for all nodal officers to track disbursement metrics and fund utilization instantly.</p>
            </div>
            <div className="p-10 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl hover:bg-white/5 transition-all">
              <FileText className="w-12 h-12 text-purple-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Paperless Pipeline</h3>
              <p className="text-slate-400 leading-relaxed text-lg">100% digital verification pipeline via Aadhaar KYC and automated document scrutiny.</p>
            </div>
          </motion.div>
        </section>

        {/* Section 3: Call to action */}
        <section className="min-h-screen flex items-center justify-center px-6 pb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: "-200px" }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl bg-gradient-to-br from-blue-900/50 to-black/50 p-12 rounded-3xl border border-blue-500/30 backdrop-blur-xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to empower citizens?</h2>
            <p className="text-xl text-blue-200 mb-10">Join the digital revolution in government subsidy distribution today.</p>
            <button 
              onClick={() => navigate('/login')}
              className="px-10 py-5 bg-white text-blue-900 hover:bg-blue-50 rounded-full font-extrabold text-xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Access Portal Portal
            </button>
          </motion.div>
        </section>

      </div>
    </div>
  );
};