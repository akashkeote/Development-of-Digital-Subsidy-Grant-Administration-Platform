import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Landmark, 
  GraduationCap, 
  Sprout, 
  Sun, 
  Home, 
  HeartPulse, 
  Calendar, 
  BadgeDollarSign, 
  UserCheck, 
  FileText, 
  CheckCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export const SchemeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { schemes } = useApp();
  const navigate = useNavigate();

  const scheme = schemes.find(s => s.id === id);

  if (!scheme) {
    return (
      <DashboardLayout>
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
          <p className="text-gray-400 font-bold mb-2">Scheme Not Found</p>
          <button onClick={() => navigate('/schemes')} className="text-purple-800 underline font-bold text-xs">
            Return to Catalogue
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    agriculture: <Sprout className="w-5 h-5 text-emerald-600" />,
    education: <GraduationCap className="w-5 h-5 text-sky-600" />,
    energy: <Sun className="w-5 h-5 text-amber-500" />,
    housing: <Home className="w-5 h-5 text-indigo-600" />,
    healthcare: <HeartPulse className="w-5 h-5 text-rose-600" />
  };

  const faqs = [
    { q: "What is Direct Benefit Transfer (DBT)?", a: "Direct Benefit Transfer is a mechanism where subsidy/grant amounts are credited directly into the citizen's Aadhaar-linked bank account without any third-party handling, reducing corruption and delays." },
    { q: "Do I need to submit paper physical documents?", a: "No! All document uploads (including Aadhaar, Income Proof, Caste Certificates) are handled entirely online in this portal. Digital copies are forwarded directly to the Verification Officer." },
    { q: "How long does the verification take?", a: "Typically, document verification by the local sub-divisional Verification Officer is completed within 3 to 5 business days, and final sanction by the District Officer occurs within 1 week of verification." }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6" id="scheme_details_page_root">
        
        {/* Back Link & Title Header */}
        <div className="space-y-4">
          <Link to="/schemes" className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 transition">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Return to Catalogue</span>
          </Link>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-start gap-8 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 -z-10 translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="space-y-4 flex-1 z-10">
              <div className="flex flex-wrap gap-2 items-center text-xs">
                <span className="flex items-center bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold">
                  {categoryIcons[scheme.category] || <BadgeDollarSign className="w-4 h-4 mr-1.5 text-indigo-600" />}
                  <span className="ml-1.5 capitalize">{scheme.category.replace('_', ' ')}</span>
                </span>
                <span className="text-slate-300">|</span>
                <span className="font-bold text-slate-500">{scheme.department}</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {scheme.title}
              </h1>

              <p className="text-xs text-slate-400 font-bold font-mono uppercase tracking-widest">{scheme.ministry}</p>
            </div>

            <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-6 rounded-3xl min-w-[280px] space-y-5 z-10 relative">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Financial Aid</span>
                <span className="text-3xl font-extrabold text-indigo-600">₹{scheme.subsidyAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-4">
                <span className="text-slate-500 font-bold">Disbursement</span>
                <span className="font-extrabold text-slate-900 px-2 py-1 bg-slate-100 rounded-md">{scheme.installmentCount} Stages</span>
              </div>
              <Link 
                to={`/schemes/${scheme.id}/apply`}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20"
              >
                <span>Apply for this Grant</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Layout details split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left panel info */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Description Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100">Scheme Overview</h2>
              <p className="text-sm text-slate-600 leading-loose font-medium">
                {scheme.description}
              </p>
            </div>

            {/* Benefit Breakdown */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center">
                <BadgeDollarSign className="w-5 h-5 mr-2 text-indigo-600" /> Disbursement Pattern
              </h2>
              <p className="text-sm text-slate-600 leading-loose font-medium">
                {scheme.benefits}
              </p>
              <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start space-x-3">
                <Landmark className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-indigo-900 leading-relaxed">
                  Payments are made exclusively through <span className="font-extrabold">Direct Benefit Transfer (DBT)</span> using Aadhaar Payment Bridge (APB) to prevent leakages and track milestones securely.
                </p>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-5">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-slate-400" /> Common Questions
              </h2>
              <div className="space-y-4 divide-y divide-slate-50">
                {faqs.map((faq, idx) => (
                  <div key={idx} className={`pt-4 ${idx === 0 ? 'pt-0' : ''}`}>
                    <p className="text-sm font-bold text-slate-900 mb-1">{faq.q}</p>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right panel requirements criteria */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Eligibility Parameters */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-5">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-emerald-500" /> Eligibility
              </h2>
              <ul className="space-y-4">
                {scheme.eligibilityCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-start text-sm font-medium text-slate-600">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mr-3 mt-0.5" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents Checklist */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-5">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" /> Documents
              </h2>
              <ul className="space-y-3">
                {scheme.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-center text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-400 font-extrabold flex items-center justify-center text-[10px] mr-3 shadow-sm">
                      {idx + 1}
                    </span>
                    <span className="truncate">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Department stats card */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-5 shadow-xl shadow-slate-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Administered By</p>
                <h4 className="text-sm font-bold text-white mt-1 leading-snug">{scheme.department}</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-700 pt-4 text-xs font-medium relative z-10">
                <div>
                  <p className="text-slate-400 mb-1">Budget:</p>
                  <p className="font-extrabold text-white text-base">₹{(scheme.totalAllocation / 10000000).toFixed(1)} Cr</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Disbursed:</p>
                  <p className="font-extrabold text-emerald-400 text-base">₹{(scheme.disbursedAmount / 10000000).toFixed(1)} Cr</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};
