import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Search, HelpCircle, FileQuestion, MessageCircle, ChevronDown, PhoneCall } from 'lucide-react';

export const HelpCenterPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long does it take for application approval?',
      a: 'Typically, document verification by the local sub-divisional Verification Officer is completed within 3 to 5 business days, and final sanction by the District Officer occurs within 1 week of verification.'
    },
    {
      q: 'Can I apply for multiple schemes at once?',
      a: 'Yes, provided the schemes do not have mutually exclusive mandates. The system will automatically warn you if you apply for overlapping restricted schemes.'
    },
    {
      q: 'Why was my Aadhaar verification rejected?',
      a: 'Ensure that the name on your application perfectly matches your Aadhaar card. If your biometrics or OTP failed, please update your mobile number at a local Aadhaar Seva Kendra.'
    },
    {
      q: 'How do I track my disbursement installments?',
      a: 'Navigate to "Track Application" on the platform. Once your application is sanctioned, you will see a visual timeline of your disbursement stages under the Installment Tracking module.'
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-12" id="help_center_page_root">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 py-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-blue-600 shadow-sm relative">
             <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full"></div>
             <HelpCircle size={36} className="relative z-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight font-heading">How can we help you?</h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            Search our knowledge base or browse frequently asked questions below.
          </p>

          <div className="max-w-2xl mx-auto relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for articles, guides, or error codes..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-700 shadow-sm transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group text-center">
            <FileQuestion className="w-8 h-8 mx-auto text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-slate-800 mb-2">Application Guide</h3>
            <p className="text-xs text-slate-500">Step-by-step tutorial on filing your first application.</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group text-center">
            <MessageCircle className="w-8 h-8 mx-auto text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-slate-800 mb-2">Live Chat</h3>
            <p className="text-xs text-slate-500">Chat directly with the UMANG AI assistant for quick answers.</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group text-center">
            <PhoneCall className="w-8 h-8 mx-auto text-rose-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-slate-800 mb-2">Toll-Free Helpline</h3>
            <p className="text-xs text-slate-500">Call 1800-111-222 (Available Mon-Sat, 9 AM - 6 PM)</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <HelpCircle className="text-blue-500" size={24} />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === idx ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className={`font-bold pr-8 ${openFaq === idx ? 'text-blue-700' : 'text-slate-700'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown className={`shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} size={20} />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-blue-100/50 mt-1">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};
