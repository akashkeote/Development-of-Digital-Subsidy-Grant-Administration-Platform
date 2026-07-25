import React from 'react';
import { Landmark, ArrowRight, Shield, BookOpen, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-16 mt-auto relative overflow-hidden border-t-4 border-indigo-500">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 border-b border-slate-800 pb-12 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">GovGrant</span>
            </div>
            <p className="text-sm font-medium leading-relaxed">
              Empowering citizens through transparent, seamless, and direct digital welfare disbursements.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold tracking-widest uppercase text-xs">Resources</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-indigo-400" /> Grant Catalog</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-indigo-400" /> Beneficiary Guide</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center group"><ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-indigo-400" /> FAQ & Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold tracking-widest uppercase text-xs">Legal</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><Shield className="w-4 h-4" /> Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><BookOpen className="w-4 h-4" /> Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Transparency Report</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold tracking-widest uppercase text-xs">Stay Updated</h4>
            <p className="text-xs font-medium">Get notifications about new welfare schemes directly to your inbox.</p>
            <div className="flex bg-slate-800 p-1.5 rounded-xl border border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
              <input 
                type="email" 
                placeholder="citizen@example.com" 
                className="w-full bg-transparent px-3 text-sm text-white focus:outline-none placeholder:text-slate-500"
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors shadow-md">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <p>© 2026 GovGrant Digital Services. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
