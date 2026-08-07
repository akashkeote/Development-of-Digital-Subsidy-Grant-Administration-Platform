import React from 'react';
import { TopNav } from '../components/TopNav';
import { Footer } from '../components/Footer';
import { Accessibility, Eye, MonitorSpeaker, MousePointer2 } from 'lucide-react';

export const AccessibilityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-32">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Accessibility size={24} />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight font-heading">Accessibility Statement</h1>
          </div>
          
          <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
            <p>We are committed to ensuring that the DigiGrant portal is accessible to all users, irrespective of device in use, technology, or ability. It has been built to provide maximum accessibility and usability to its visitors.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="p-6 border border-slate-200 rounded-2xl">
                <Eye className="w-8 h-8 text-emerald-500 mb-3" />
                <h3 className="font-bold text-slate-800 mb-2">Visual Assistance</h3>
                <p className="text-sm">High contrast mode and adjustable text sizing support for visually impaired users.</p>
              </div>
              <div className="p-6 border border-slate-200 rounded-2xl">
                <MonitorSpeaker className="w-8 h-8 text-blue-500 mb-3" />
                <h3 className="font-bold text-slate-800 mb-2">Screen Readers</h3>
                <p className="text-sm">Full ARIA compliance ensuring compatibility with modern screen reading software.</p>
              </div>
              <div className="p-6 border border-slate-200 rounded-2xl">
                <MousePointer2 className="w-8 h-8 text-amber-500 mb-3" />
                <h3 className="font-bold text-slate-800 mb-2">Keyboard Navigation</h3>
                <p className="text-sm">The entire portal can be navigated seamlessly using only keyboard controls.</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Standards Compliance</h2>
            <p>This portal complies with the Guidelines for Indian Government Websites (GIGW) and Web Content Accessibility Guidelines (WCAG) 2.0 level AA.</p>
            
            <p className="mt-10 text-sm text-slate-400">If you encounter any accessibility issues, please contact our support team at support@digigrant.gov.in.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
