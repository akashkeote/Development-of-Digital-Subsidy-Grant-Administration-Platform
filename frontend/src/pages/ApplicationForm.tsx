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
        <div className="text-center py-12 glass-card rounded-2xl">
          <p className="text-gray-400 font-bold mb-3">Scheme reference not found</p>
          <Link to="/schemes" className="gradient-text underline font-bold text-xs">Return to Catalog</Link>
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
      <div className="space-y-8 relative z-10" id="application_form_page_root">
        
        {/* Back navigation and header info */}
        <div className="space-y-4">
          <Link to={`/schemes/${scheme.id}`} className="inline-flex items-center text-xs font-bold text-[#00599f] hover:text-[#004a85] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to Details</span>
          </Link>

          <div className="bg-white border border-slate-200 p-8 rounded-2xl flex justify-between items-center relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-[#00599f] bg-blue-50 px-3 py-1 rounded-md tracking-widest uppercase border border-blue-100">Online Application</span>
              <h1 className="text-3xl font-heading font-bold text-slate-800 mt-3 tracking-tight">Apply for Subsidy Grant</h1>
              <p className="text-sm text-slate-500 mt-2 font-medium">Scheme: <span className="font-bold text-slate-700">{scheme.title}</span></p>
            </div>
            <div className="hidden sm:block text-right relative z-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Step 1 of 2</p>
              <p className="font-bold text-[#00599f] text-sm bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">Primary Details</p>
            </div>
          </div>
        </div>

        {/* Step progress bar */}
        <div className="bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
          <div className="w-1/2 h-full bg-[#00599f] relative">
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleNextStep} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main inputs on left panel */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Section 1: Demographics */}
            <div className="bg-white border border-slate-200 p-8 rounded-2xl space-y-6 shadow-sm">
              <h3 className="text-lg font-heading font-bold text-slate-800 uppercase tracking-widest pb-4 border-b border-slate-100 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3 border border-blue-100">
                  <User className="w-4 h-4 text-[#00599f]" />
                </div>
                Demographics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name (As in Aadhaar)</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-500 cursor-not-allowed" 
                    disabled 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aadhaar Number</label>
                  <input 
                    type="text" 
                    value={aadhaar}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono tracking-widest text-slate-500 cursor-not-allowed" 
                    disabled 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Phone</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-4 bg-white border border-slate-200 focus:border-[#00599f] focus:ring-1 focus:ring-[#00599f] focus:outline-none rounded-xl font-medium text-slate-800 transition-colors" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annual Income (₹)</label>
                  <input 
                    type="number" 
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full p-4 bg-white border border-slate-200 focus:border-[#00599f] focus:ring-1 focus:ring-[#00599f] focus:outline-none rounded-xl font-medium text-slate-800 transition-colors" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">State</label>
                  <input 
                    type="text" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-4 bg-white border border-slate-200 focus:border-[#00599f] focus:ring-1 focus:ring-[#00599f] focus:outline-none rounded-xl font-medium text-slate-800 transition-colors" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">District</label>
                  <input 
                    type="text" 
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-4 bg-white border border-slate-200 focus:border-[#00599f] focus:ring-1 focus:ring-[#00599f] focus:outline-none rounded-xl font-medium text-slate-800 transition-colors" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Bank Details */}
            <div className="bg-white border border-slate-200 p-8 rounded-2xl space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-100 pb-4 gap-3">
                <h3 className="text-lg font-heading font-bold text-slate-800 uppercase tracking-widest flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3 border border-blue-100">
                    <Landmark className="w-4 h-4 text-[#00599f]" />
                  </div>
                  Bank Parameters (DBT)
                </h3>
                <span className="text-[10px] text-[#198754] bg-green-50 border border-green-100 px-4 py-1.5 rounded-lg font-bold shadow-sm flex-shrink-0 w-fit">NPCI VERIFIED</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank Name</label>
                  <input 
                    type="text" 
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-4 bg-white border border-slate-200 focus:border-[#00599f] focus:ring-1 focus:ring-[#00599f] focus:outline-none rounded-xl font-medium text-slate-800 transition-colors" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aadhaar Seeded Account</label>
                  <input 
                    type="text" 
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full p-4 bg-white border border-slate-200 focus:border-[#00599f] focus:ring-1 focus:ring-[#00599f] focus:outline-none rounded-xl font-mono tracking-widest text-slate-800 transition-colors" 
                    required 
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IFSC Code</label>
                  <input 
                    type="text" 
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full p-4 bg-white border border-slate-200 focus:border-[#00599f] focus:ring-1 focus:ring-[#00599f] focus:outline-none rounded-xl font-mono tracking-widest text-slate-800 transition-colors max-w-sm" 
                    maxLength={11}
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Declaration */}
            <div className="bg-slate-800 p-8 rounded-2xl space-y-6 relative overflow-hidden shadow-lg border border-slate-700">
              <h3 className="text-lg font-heading font-bold text-white uppercase tracking-widest flex items-center relative z-10">
                <ShieldCheck className="w-6 h-6 mr-3 text-emerald-400" /> Statutory Declaration
              </h3>
              
              <div className="flex items-start bg-slate-900 p-5 rounded-xl border border-slate-700 relative z-10">
                <input 
                  type="checkbox" 
                  id="declaration_check"
                  checked={declaration}
                  onChange={(e) => setDeclaration(e.target.checked)}
                  className="w-6 h-6 rounded-md border-slate-600 bg-slate-800 text-[#198754] focus:ring-[#198754] focus:ring-offset-slate-900 mr-4 mt-0.5 cursor-pointer flex-shrink-0 transition-transform hover:scale-110"
                />
                <label htmlFor="declaration_check" className="text-xs text-slate-300 leading-relaxed font-medium cursor-pointer select-none">
                  I hereby solemnly declare that all information furnished above is true, complete, and correct to the best of my knowledge. I understand that if any of the statements are found to be false or misstated, my application will be summarily rejected, and I will be liable under legal action as per DBT directives and IPC guidelines.
                </label>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-200 p-6 rounded-2xl shadow-sm gap-4">
              <span className="text-xs text-slate-500 font-bold text-center sm:text-left">Verify details carefully before proceeding.</span>
              <button 
                type="submit"
                className="w-full sm:w-auto bg-[#00599f] hover:bg-[#004a85] text-white text-sm font-bold px-10 py-4 rounded-xl flex items-center justify-center space-x-3 cursor-pointer transition-colors shadow-sm"
              >
                <span>Continue to Documents</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Right sidebar instructions */}
          <div className="lg:col-span-4 space-y-8">
            
            <div className="bg-white border border-slate-200 p-8 rounded-2xl space-y-6 shadow-sm">
              <h3 className="text-sm font-heading font-bold text-slate-800 uppercase tracking-widest pb-4 border-b border-slate-100 flex items-center">
                <FileText className="w-5 h-5 mr-3 text-[#00599f]" /> Guidelines
              </h3>
              
              <ul className="space-y-5">
                <li className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start">
                  <span className="w-7 h-7 rounded-full bg-blue-100 text-[#00599f] flex items-center justify-center font-bold text-[10px] mr-3 flex-shrink-0 border border-blue-200">1</span>
                  <span className="leading-relaxed mt-1">Review prepopulated fields extracted from your Aadhaar profile.</span>
                </li>
                <li className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start">
                  <span className="w-7 h-7 rounded-full bg-blue-100 text-[#00599f] flex items-center justify-center font-bold text-[10px] mr-3 flex-shrink-0 border border-blue-200">2</span>
                  <span className="leading-relaxed mt-1">Declare accurate incomes. Subdivisional revenue registers are checked online.</span>
                </li>
                <li className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start">
                  <span className="w-7 h-7 rounded-full bg-blue-100 text-[#00599f] flex items-center justify-center font-bold text-[10px] mr-3 flex-shrink-0 border border-blue-200">3</span>
                  <span className="leading-relaxed mt-1">In the next step, you will upload PDF copies of required certificates.</span>
                </li>
              </ul>
            </div>

            {/* Scheme benefits summary box */}
            <div className="bg-green-50 border border-green-100 p-8 rounded-2xl text-xs space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center space-x-3 text-[#198754] font-heading font-bold uppercase tracking-widest text-xs relative z-10">
                <CheckCircle2 className="w-6 h-6" />
                <span>Eligibility Matched</span>
              </div>
              <p className="font-medium text-slate-700 leading-relaxed text-sm relative z-10">
                Based on your profile, you meet the initial basic eligibility categories for this grant. Continue to complete document verification.
              </p>
            </div>

          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};
