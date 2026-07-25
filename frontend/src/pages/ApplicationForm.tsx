import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Landmark, User, FileText, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export const ApplicationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { schemes, citizenProfile } = useApp();
  const navigate = useNavigate();

  const scheme = schemes.find(s => s.id === id);

  // Form states
  const [fullName, setFullName] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [phone, setPhone] = useState('');
  const [income, setIncome] = useState<number>(0);
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');

  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');

  const [declaration, setDeclaration] = useState(false);

  // Sync profile details on load
  useEffect(() => {
    if (citizenProfile) {
      setFullName(citizenProfile.name);
      setAadhaar(citizenProfile.aadhaar);
      setPhone(citizenProfile.phone);
      setIncome(citizenProfile.income);
      setState(citizenProfile.state);
      setDistrict(citizenProfile.district);
      setBankName(citizenProfile.bankName);
      setAccountNumber(citizenProfile.bankAccount);
      setIfsc(citizenProfile.ifsc);
    }
  }, [citizenProfile]);

  if (!scheme) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 font-bold mb-3">Scheme reference not found</p>
          <Link to="/schemes" className="text-purple-800 underline font-bold text-xs">Return to Catalog</Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaration) {
      alert('Please accept the declaration checkbox to proceed.');
      return;
    }

    // Pass application details to state/storage or query parameter and navigate to upload step
    // We can save intermediate form to localStorage so the upload page can read and finalize the application in the context!
    const draftDetails = {
      schemeId: scheme.id,
      personalDetails: { fullName, aadhaar, phone, income, state, district },
      bankDetails: { bankName, accountNumber, ifsc }
    };
    localStorage.setItem('gov_draft_application', JSON.stringify(draftDetails));

    navigate(`/schemes/${scheme.id}/upload`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6" id="application_form_page_root">
        
        {/* Back navigation and header info */}
        <div className="space-y-4">
          <Link to={`/schemes/${scheme.id}`} className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 transition">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to Details</span>
          </Link>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center relative overflow-hidden">
            {/* Background glowing orb */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>

            <div className="relative z-10">
              <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md tracking-widest uppercase">Online Application</span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">Apply for Subsidy Grant</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">Scheme: <span className="font-bold text-slate-900">{scheme.title}</span></p>
            </div>
            <div className="hidden sm:block text-right relative z-10">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Step 1 of 2</p>
              <p className="font-bold text-indigo-600 text-sm bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">Primary Details</p>
            </div>
          </div>
        </div>

        {/* Step progress bar */}
        <div className="bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
          <div className="w-1/2 h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)] relative">
            <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/30 animate-pulse"></div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleNextStep} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main inputs on left panel */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Section 1: Demographics */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600" /> Demographics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name (As in Aadhaar)</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-sm font-bold opacity-70 cursor-not-allowed" 
                    disabled 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aadhaar Number</label>
                  <input 
                    type="text" 
                    value={aadhaar}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-sm font-mono font-bold opacity-70 cursor-not-allowed tracking-widest" 
                    disabled 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Phone</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annual Income (₹)</label>
                  <input 
                    type="number" 
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">State</label>
                  <input 
                    type="text" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">District</label>
                  <input 
                    type="text" 
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Bank Details */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-100 pb-3 gap-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest flex items-center">
                  <Landmark className="w-5 h-5 mr-2 text-indigo-600" /> Bank Parameters (DBT)
                </h3>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg font-extrabold shadow-sm flex-shrink-0 w-fit">NPCI VERIFIED</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank Name</label>
                  <input 
                    type="text" 
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aadhaar Seeded Account</label>
                  <input 
                    type="text" 
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all tracking-widest" 
                    required 
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IFSC Code</label>
                  <input 
                    type="text" 
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all tracking-widest max-w-sm" 
                    maxLength={11}
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Declaration */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-5 shadow-xl shadow-slate-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
              <h3 className="text-sm font-extrabold text-white uppercase tracking-widest flex items-center relative z-10">
                <ShieldCheck className="w-5 h-5 mr-2 text-emerald-400" /> Statutory Declaration
              </h3>
              
              <div className="flex items-start bg-slate-800/50 p-4 rounded-xl border border-slate-700 relative z-10">
                <input 
                  type="checkbox" 
                  id="declaration_check"
                  checked={declaration}
                  onChange={(e) => setDeclaration(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 mr-4 mt-0.5 cursor-pointer flex-shrink-0"
                />
                <label htmlFor="declaration_check" className="text-xs text-slate-300 leading-relaxed font-medium cursor-pointer select-none">
                  I hereby solemnly declare that all information furnished above is true, complete, and correct to the best of my knowledge. I understand that if any of the statements are found to be false or misstated, my application will be summarily rejected, and I will be liable under legal action as per DBT directives and IPC guidelines.
                </label>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
              <span className="text-xs text-slate-400 font-bold text-center sm:text-left">Verify details carefully before proceeding.</span>
              <button 
                type="submit"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                <span>Continue to Documents</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Right sidebar instructions */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-5">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" /> Guidelines
              </h3>
              
              <ul className="space-y-4">
                <li className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex items-start">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-[10px] mr-3 flex-shrink-0">1</span>
                  <span className="leading-relaxed mt-0.5">Review prepopulated fields extracted from your Aadhaar profile.</span>
                </li>
                <li className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex items-start">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-[10px] mr-3 flex-shrink-0">2</span>
                  <span className="leading-relaxed mt-0.5">Declare accurate incomes. Subdivisional revenue registers are checked online.</span>
                </li>
                <li className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex items-start">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-[10px] mr-3 flex-shrink-0">3</span>
                  <span className="leading-relaxed mt-0.5">In the next step, you will upload PDF copies of required certificates.</span>
                </li>
              </ul>
            </div>

            {/* Scheme benefits summary box */}
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl shadow-sm text-xs space-y-3">
              <div className="flex items-center space-x-2 text-emerald-700 font-extrabold uppercase tracking-widest text-[10px]">
                <CheckCircle2 className="w-5 h-5" />
                <span>Eligibility Matched</span>
              </div>
              <p className="font-bold text-slate-700 leading-relaxed text-sm">
                Based on your profile, you meet the initial basic eligibility categories for this grant. Continue to complete document verification.
              </p>
            </div>

          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};
