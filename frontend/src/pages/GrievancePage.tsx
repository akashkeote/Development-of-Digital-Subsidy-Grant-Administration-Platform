import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { AlertOctagon, Send, FileUp, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GrievancePage: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/citizen/dashboard');
    }, 4000);
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto mt-20 text-center space-y-6">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-50">
            <CheckCircleIcon size={40} />
          </div>
          <h2 className="font-heading text-3xl font-bold text-slate-800">Grievance Submitted</h2>
          <p className="text-slate-500 font-medium text-lg px-8">
            Your ticket <span className="font-mono font-bold text-slate-800">#GRV-8992-XD</span> has been logged securely. You will be redirected to the dashboard.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8" id="grievance_page_root">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="relative z-10 flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <AlertOctagon size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight font-heading">File a Grievance</h1>
              <p className="text-slate-500 font-medium">Escalate issues regarding your applications or disbursements.</p>
            </div>
          </div>
        </div>

        {/* Form Area */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
          
          <div className="bg-blue-50 text-blue-700 p-4 rounded-xl flex gap-3 items-start border border-blue-100">
            <Info className="shrink-0 mt-0.5 text-blue-600" size={18} />
            <p className="text-sm font-medium">
              Grievances are monitored by the Central Nodal Agency. Frivolous or false complaints may result in penalties. Please provide accurate application references.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
              <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" placeholder="As per Aadhaar" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mobile Number</label>
              <input required type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" placeholder="+91" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Application ID (Optional)</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium font-mono" placeholder="APP-XXXX-XXXX" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Grievance Category</label>
              <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none">
                <option value="">Select Category...</option>
                <option value="delay">Delayed Disbursement</option>
                <option value="reject">Unfair Rejection</option>
                <option value="technical">Technical Issue on Portal</option>
                <option value="corruption">Corruption / Bribe Demand</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
            <textarea required rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none" placeholder="Please describe the issue in detail..."></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Supporting Documents (Optional)</label>
            <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform">
                <FileUp size={20} />
              </div>
              <p className="font-bold text-slate-700 text-sm">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 5MB</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-rose-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
              Submit Grievance <Send size={18} />
            </button>
          </div>
        </form>

      </div>
    </DashboardLayout>
  );
};

function CheckCircleIcon({ size = 24 }: { size?: number }) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>; }
