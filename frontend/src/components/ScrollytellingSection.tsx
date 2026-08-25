import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Target, BarChart, FileText } from 'lucide-react';

export const ScrollytellingSection: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const activeSectionRef = useRef(0);
  const totalFrames = 480;

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

  // Scroll event listener for Canvas + UI Sections
  useEffect(() => {
    const handleScroll = () => {
      if (images.length === 0 || !canvasRef.current) return;
      const container = canvasRef.current.parentElement?.parentElement;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
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
      
      if (img && img.complete) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }
      }

      // Robust UI Section Logic
      let newSection = 0;
      if (scrollFraction < 0.20) newSection = 0;
      else if (scrollFraction < 0.45) newSection = 1;
      else if (scrollFraction < 0.70) newSection = 2;
      else if (scrollFraction < 0.90) newSection = 3;
      else newSection = 4;

      if (newSection !== activeSectionRef.current) {
        activeSectionRef.current = newSection;
        setActiveSection(newSection);
      }
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
    <section className="relative h-[500vh] bg-[#050505] text-white selection:bg-[#0050FF] selection:text-white">
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0 bg-[#050505]">
        
        <canvas ref={canvasRef} className="w-full h-full object-cover transform-gpu origin-center" />
        <div className="absolute inset-0 bg-black/50 pointer-events-none backdrop-blur-[2px]" />

        {/* Robust Storytelling Text Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence mode="wait">
            
            {/* HERO */}
            {activeSection === 0 && (
              <motion.div 
                key="hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
              >
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-bold tracking-widest uppercase mb-8 backdrop-blur-md">
                    <Zap className="w-4 h-4" /> The Future of Subsidy Delivery
                  </div>
                  <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white tracking-tight leading-[1.1] mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                    Transparent. Secure. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-sm">
                      Instant Disbursement.
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                    Experience the next generation of government grant distribution. Powered by real-time DBT, automated KYC, and multi-tier verification.
                  </p>
                </div>
              </motion.div>
            )}

            {/* FEATURE 1 */}
            {activeSection === 1 && (
              <motion.div 
                key="f1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 md:left-[10%] flex flex-col justify-center px-6 w-full md:w-1/3"
              >
                <div className="flex flex-col">
                  <Target className="w-12 h-12 text-blue-400 mb-6 drop-shadow-lg" />
                  <h3 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-lg">
                    Precision Targeting
                  </h3>
                  <p className="text-xl text-slate-200 leading-relaxed drop-shadow-md font-medium">
                    AI-driven beneficiary matching ensures funds reach the exact intended citizens without leakage. Aadhaar-linked KYC guarantees absolute accuracy.
                  </p>
                </div>
              </motion.div>
            )}

            {/* FEATURE 2 */}
            {activeSection === 2 && (
              <motion.div 
                key="f2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-y-0 right-0 md:right-[10%] flex flex-col justify-center px-6 w-full md:w-1/3 text-left"
              >
                <div className="flex flex-col">
                  <BarChart className="w-12 h-12 text-emerald-400 mb-6 drop-shadow-lg" />
                  <h3 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-lg">
                    Real-time Analytics
                  </h3>
                  <p className="text-xl text-slate-200 leading-relaxed drop-shadow-md font-medium">
                    Live dashboards for all nodal officers to track disbursement metrics, ledger history, and fund utilization instantly across districts.
                  </p>
                </div>
              </motion.div>
            )}

            {/* FEATURE 3 */}
            {activeSection === 3 && (
              <motion.div 
                key="f3"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 md:left-[10%] flex flex-col justify-center px-6 w-full md:w-1/3"
              >
                <div className="flex flex-col">
                  <FileText className="w-12 h-12 text-purple-400 mb-6 drop-shadow-lg" />
                  <h3 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-lg">
                    Paperless Pipeline
                  </h3>
                  <p className="text-xl text-slate-200 leading-relaxed drop-shadow-md font-medium">
                    100% digital verification pipeline. Middlemen and delays fade away as transactions are processed end-to-end via our secure portal.
                  </p>
                </div>
              </motion.div>
            )}

            {/* CTA */}
            {activeSection === 4 && (
              <motion.div 
                key="cta"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
              >
                <div className="max-w-4xl flex flex-col items-center pointer-events-auto">
                  <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight text-white mb-6 drop-shadow-xl leading-[1.1]">
                    Track everything. <br/> <span className="text-white/50">Lose nothing.</span>
                  </h2>
                  <p className="text-2xl text-blue-200 mb-10 max-w-2xl mx-auto drop-shadow-lg font-medium">
                    Designed for governance, crafted for citizens. Join the digital revolution in subsidy distribution today.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => navigate('/login')}
                      className="px-10 py-4 bg-white text-[#050505] rounded-full font-bold text-xl hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] font-heading"
                    >
                      Access Dashboard
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
