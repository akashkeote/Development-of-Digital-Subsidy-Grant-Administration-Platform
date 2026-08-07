import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ArrowRight, ShieldCheck, Mail, MapPin, Phone, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const logos = [
    { name: 'MyScheme', icon: 'my', color: 'text-emerald-500', url: 'https://www.myscheme.gov.in' },
    { name: 'DBT Bharat', icon: '₹', color: 'text-amber-500', url: 'https://dbtbharat.gov.in' },
    { name: 'Aadhaar', icon: '🪪', color: 'text-blue-500', url: 'https://uidai.gov.in' },
    { name: 'PFMS', icon: '🏛', color: 'text-slate-500', url: 'https://pfms.nic.in' },
    { name: 'India.gov.in', icon: '🌐', color: 'text-sky-500', url: 'https://www.india.gov.in' },
    { name: 'myGov', icon: 'm', color: 'text-rose-500', url: 'https://www.mygov.in' },
    { name: 'MeitY', icon: '⚙', color: 'text-slate-400', url: 'https://www.meity.gov.in' },
  ];

  // Duplicate logos to create a seamless infinite scrolling effect
  const marqueeLogos = [...logos, ...logos, ...logos, ...logos];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== '') {
      setIsSubmitting(true);
      
      // Simulate API call at frontend level
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubscribed(true);
        setEmail('');
        
        // Reset success state after a few seconds
        setTimeout(() => {
          setIsSubscribed(false);
        }, 3000);
      }, 1200);
    }
  };

  return (
    <footer className="w-full mt-12 bg-white/50 backdrop-blur-xl border-t border-slate-200/60 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)] text-slate-600 font-sans flex flex-col z-20 relative">
      {/* Logos Marquee Section */}
      <div className="py-5 border-b border-slate-200/50 overflow-hidden relative w-full flex items-center bg-white/30 backdrop-blur-sm">
        {/* Left/Right Fade Gradients for smooth entrance/exit */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none"></div>
        
        <div className="animate-marquee flex gap-12 px-4 items-center">
          {marqueeLogos.map((logo, idx) => (
            <a 
              href={logo.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              key={idx} 
              className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-white/60 transition-colors cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center font-extrabold group-hover:scale-105 group-hover:-rotate-3 transition-transform shadow-sm">
                <span className={logo.color}>{logo.icon}</span>
              </div>
              <span className="text-[13px] font-bold text-slate-400 group-hover:text-blue-500 transition-colors whitespace-nowrap tracking-wide">
                {logo.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1 flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
               <Landmark className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-blue-600 tracking-tight leading-none">DigiGrant</span>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">Portal</span>
            </div>
          </div>
          <p className="text-[15px] text-slate-500 leading-relaxed font-semibold">
            Next-generation Digital Grant Administration Platform empowering transparent, rapid, and secure disbursements.
          </p>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400 pt-2">
             <ShieldCheck className="w-5 h-5 text-emerald-500" />
             Secured by <a href="https://indiastack.org" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">India Stack</a>
          </div>
        </div>

        {/* Quick Links 1 */}
        <div className="col-span-1 flex flex-col space-y-4">
          <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider font-space">Platform</h3>
          <ul className="space-y-3 text-sm font-medium">
            <li><Link to="/login" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> Dashboard</Link></li>
            <li><Link to="/schemes" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> Schemes</Link></li>
            <li><Link to="/citizen/tracking" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> Track Application</Link></li>
            <li><Link to="/nodal-agencies" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> Nodal Agencies</Link></li>
          </ul>
        </div>

        {/* Quick Links 2 */}
        <div className="col-span-1 flex flex-col space-y-4">
          <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider font-space">Resources</h3>
          <ul className="space-y-3 text-sm font-medium">
            <li><Link to="/guidelines" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> Guidelines</Link></li>
            <li><Link to="/api-docs" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> API Documentation</Link></li>
            <li><Link to="/help" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> Help Center</Link></li>
            <li><Link to="/grievance" className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" /> Grievance</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="col-span-1 flex flex-col space-y-4">
          <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider font-space">Newsletter</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
             Subscribe for scheme updates and notifications.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || isSubscribed}
              placeholder="Email address..." 
              className="w-full px-4 py-3 rounded-[14px] border border-slate-200/60 bg-blue-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 placeholder-slate-400 font-medium disabled:opacity-70 transition-all"
            />
            <button 
              type="submit"
              disabled={isSubmitting || isSubscribed}
              className={`px-5 py-3 rounded-[14px] text-sm font-bold shadow-sm whitespace-nowrap flex items-center justify-center gap-2 transition-all min-w-[110px] ${
                isSubscribed 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white disabled:opacity-70'
              }`}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : isSubscribed ? (
                <><CheckCircle2 className="w-4 h-4" /> Subscribed</>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
          <div className="flex items-center gap-4 pt-4">
             <a href="mailto:support@digigrant.gov.in" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-300 hover:shadow-md transition-all" title="Email Support">
                <Mail className="w-4 h-4" />
             </a>
             <a href="https://maps.google.com/?q=New+Delhi,+India" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-300 hover:shadow-md transition-all" title="Location">
                <MapPin className="w-4 h-4" />
             </a>
             <a href="tel:1800111555" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-300 hover:shadow-md transition-all" title="Toll-Free Support">
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
              <Link to="/terms" className="hover:text-blue-600 hover:underline transition-colors">Terms of Use</Link>
              <span className="text-slate-300 font-normal">•</span>
              <Link to="/privacy" className="hover:text-blue-600 hover:underline transition-colors">Privacy Policy</Link>
              <span className="text-slate-300 font-normal">•</span>
              <Link to="/accessibility" className="hover:text-blue-600 hover:underline transition-colors">Accessibility</Link>
            </div>
        </div>
      </div>
    </footer>
  );
};
