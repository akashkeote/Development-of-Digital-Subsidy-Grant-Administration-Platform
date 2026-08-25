with open('src/pages/LandingV2.tsx', 'w', encoding='utf-8') as f:
    f.write('''import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Zap, Target, BarChart, FileText } from 'lucide-react';

export const LandingV2: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const totalFrames = 240;

  // Preload frames
  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = `/anim-v2/frame_${i}.webp`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setLoaded(true);
        }
      };
      imgArray.push(img);
    }
    setImages(imgArray);
  }, []);

  // Animation Loop
  useEffect(() => {
    if (!loaded || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let animationId: number;
    let lastTime = performance.now();
    const fpsInterval = 1000 / 24; // 24 FPS (~42ms delay)

    const render = (time: number) => {
      animationId = requestAnimationFrame(render);
      const elapsed = time - lastTime;

      if (elapsed > fpsInterval) {
        lastTime = time - (elapsed % fpsInterval);

        // Draw current frame
        const img = images[frame];
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate aspect ratio to fit/cover canvas
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        frame = (frame + 1) % totalFrames;
      }
    };

    animationId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationId);
  }, [loaded, images]);

  // Adjust canvas size
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-sans">
      {/* Background Animation Canvas */}
      <div className="absolute inset-0 z-0 opacity-60">
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
      </div>

      {/* Overlay Gradient for readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/40 to-black/90 pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 container mx-auto px-6 py-6 flex justify-between items-center">
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

      {/* Hero Content */}
      <main className="relative z-20 container mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-widest uppercase mb-8">
            <Zap className="w-4 h-4" /> The Future of Subsidy Delivery
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-8">
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
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold text-lg border border-white/10 transition-all flex items-center gap-3 backdrop-blur-sm"
            >
              View Classic Dashboard
            </button>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full max-w-5xl text-left"
        >
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Target className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Precision Targeting</h3>
            <p className="text-slate-400 leading-relaxed">AI-driven beneficiary matching ensures funds reach the exact intended citizens without leakage.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <BarChart className="w-10 h-10 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Real-time Analytics</h3>
            <p className="text-slate-400 leading-relaxed">Live dashboards for all nodal officers to track disbursement metrics and fund utilization instantly.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <FileText className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Paperless Pipeline</h3>
            <p className="text-slate-400 leading-relaxed">100% digital verification pipeline via Aadhaar KYC and automated document scrutiny.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};''')
