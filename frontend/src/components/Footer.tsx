import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const logos = [
    { name: 'MyScheme', icon: 'my', color: 'text-emerald-500' },
    { name: 'DBT Bharat', icon: '₹', color: 'text-amber-500' },
    { name: 'Aadhaar', icon: '🪪', color: 'text-blue-500' },
    { name: 'PFMS', icon: '🏛', color: 'text-slate-500' },
    { name: 'India.gov.in', icon: '🌐', color: 'text-sky-500' },
    { name: 'myGov', icon: 'm', color: 'text-rose-500' },
    { name: 'MeitY', icon: '⚙', color: 'text-slate-400' },
  ];

  // Duplicate logos to create a seamless infinite scrolling effect
  const marqueeLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <footer className="w-full mt-12 bg-white/50 backdrop-blur-xl border-t border-slate-200/60 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)] text-slate-600 font-sans flex flex-col z-20 relative">
      {/* Logos Marquee Section */}
      <div className="py-5 border-b border-slate-200/50 overflow-hidden relative w-full flex items-center bg-white/30 backdrop-blur-sm">
        {/* Left/Right Fade Gradients for smooth entrance/exit */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none"></div>
        
        <div className="animate-marquee flex gap-12 px-4 items-center">
          {marqueeLogos.map((logo, idx) => (
            <div key={idx} className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-white/60 transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center font-extrabold group-hover:scale-105 group-hover:-rotate-3 transition-transform shadow-sm">
                <span className={logo.color}>{logo.icon}</span>
              </div>
              <span className="text-[13px] font-bold text-slate-400 group-hover:text-blue-500 transition-colors whitespace-nowrap tracking-wide">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1 flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[14px] bg-white border-2 border-blue-500 flex items-center justify-center">
               <Sparkles className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-3xl font-extrabold text-blue-500 tracking-tight">DigiGrant</span>
          </div>
          <p className="text-[15px] text-slate-500 leading-relaxed font-semibold">
            Next-generation Digital Grant Administration Platform empowering transparent, rapid, and secure disbursements.
          </p>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400 pt-2">
             <ShieldCheck className="w-5 h-5 text-emerald-500" />
             Secured by <span className="text-blue-500">India Stack</span>
          </div>
        </div>

        {/* Quick Links 1 */}
        <div className="col-span-1 flex flex-col space-y-4">
          <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider font-space">Platform</h3>
          <ul className="space-y-3 text-sm font-medium">
            <li><a href="#" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> Dashboard</a></li>
            <li><a href="#" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> Schemes</a></li>
            <li><a href="#" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> Track Application</a></li>
            <li><a href="#" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> Nodal Agencies</a></li>
          </ul>
        </div>

        {/* Quick Links 2 */}
        <div className="col-span-1 flex flex-col space-y-4">
          <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider font-space">Resources</h3>
          <ul className="space-y-3 text-sm font-medium">
            <li><a href="#" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> Guidelines</a></li>
            <li><a href="#" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> API Documentation</a></li>
            <li><a href="#" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> Help Center</a></li>
            <li><a href="#" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> Grievance</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="col-span-1 flex flex-col space-y-4">
          <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider font-space">Newsletter</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
             Subscribe for scheme updates and notifications.
          </p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address..." 
              className="w-full px-3 py-2 rounded-xl border border-slate-200/60 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-600 placeholder-slate-400"
            />
            <button className="pastel-btn px-4 py-2 rounded-xl text-sm font-bold shadow-sm whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <div className="flex items-center gap-3 pt-2">
             <a href="#" className="w-8 h-8 rounded-lg pastel-card flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors shadow-sm">
                <Mail className="w-4 h-4" />
             </a>
             <a href="#" className="w-8 h-8 rounded-lg pastel-card flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors shadow-sm">
                <MapPin className="w-4 h-4" />
             </a>
             <a href="#" className="w-8 h-8 rounded-lg pastel-card flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors shadow-sm">
                <Phone className="w-4 h-4" />
             </a>
          </div>
        </div>
      </div>

      {/* Tricolor Border */}
      <div className="w-full h-1 flex opacity-80">
        <div className="w-1/3 h-full bg-[#FF9933]"></div>
        <div className="w-1/3 h-full bg-white/80"></div>
        <div className="w-1/3 h-full bg-[#138808]"></div>
      </div>

      {/* Bottom Footer Section */}
      <div className="w-full bg-slate-50/50 backdrop-blur-md border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="text-center md:text-left space-y-1">
              <p className="text-[13px] font-bold text-slate-600">
                © 2026 DigiGrant — Digital Grant Administration Platform
              </p>
              <p className="text-xs font-medium text-slate-400">
                Designed for speed, transparency, and scale.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 text-xs font-bold text-blue-500/80">
              <a href="#" className="hover:text-blue-600 hover:underline transition-colors">Terms of Use</a>
              <span className="text-slate-300 font-normal">•</span>
              <a href="#" className="hover:text-indigo-600 hover:underline transition-colors">Privacy Policy</a>
              <span className="text-slate-300 font-normal">•</span>
              <a href="#" className="hover:text-indigo-600 hover:underline transition-colors">Accessibility</a>
            </div>
        </div>
      </div>
    </footer>
  );
};
