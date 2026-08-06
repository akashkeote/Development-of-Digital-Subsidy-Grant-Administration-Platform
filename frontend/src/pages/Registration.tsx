import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ArrowRight, ArrowLeft, Landmark, CheckCircle2, FileText, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

export const Registration: React.FC = () => {
  const { setCitizenProfile, setCurrentRole } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [income, setIncome] = useState<number>(150000);
  const [category, setCategory] = useState('General');
  const [occupation, setOccupation] = useState('Agriculture');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Gorakhpur');
  const [bankName, setBankName] = useState('State Bank of India');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (aadhaar.length < 12) {
      alert('Please enter a valid 12-digit Aadhaar Number');
      return;
    }
    setOtpSent(true);
    setOtp('123456'); // Pre-filled simulator
  };

  const handleVerifyOtp = () => {
    if (otp !== '123456') {
      alert('Invalid verification code. Use 123456 for mock testing.');
      return;
    }
    // Set mock data based on official Aadhaar registry response
    setFullName('Rajesh Kumar Sharma');
    setPhone('+91 98765 43210');
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Create new profile
      const newProfile = {
        id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: fullName || 'Rajesh Kumar Sharma',
        email: email || 'rajesh.sharma@email.com',
        phone: phone || '+91 98765 43210',
        aadhaar: aadhaar || '5432-8765-1092',
        pan: 'ABCPS1234D',
        income,
        category,
        occupation,
        state,
        district,
        bankName,
        bankAccount: bankAccount || '30291827461',
        ifsc: ifsc || 'SBIN0001234',
        isBankVerified: true,
        isAadhaarVerified: true
      };

      setCitizenProfile(newProfile);
      setCurrentRole('citizen');
      setLoading(false);
      navigate('/citizen/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen mesh-bg flex flex-col justify-center items-center px-4 py-12 perspective-container" id="registration_page_root">
      
      {/* Indian Tricolor Header Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] z-50"></div>

      <div className="w-full max-w-3xl glass-card rounded-3xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-2xl">
        
        {/* Navigation back and header */}
        <div className="p-6 md:p-8 border-b border-slate-200/50 flex justify-between items-center bg-white/40">
          <div className="flex items-center gap-5">
            <Link to="/login" className="p-2.5 bg-white/50 hover:bg-white rounded-xl transition-all outline-none shadow-sm card-3d-subtle">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </Link>
            <div>
              <h1 className="text-xl font-heading font-extrabold text-slate-900 tracking-tight">New Beneficiary Enrollment</h1>
              <p className="text-xs font-medium text-slate-500 mt-1">Step {step} of 3: Verification & KYC Profile Setup</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50/80 border border-blue-200 px-4 py-1.5 rounded-full shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            Aadhaar Integrated
          </span>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-slate-200/50 h-2 flex w-full relative overflow-hidden">
          <div className={`absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700 ease-out flex justify-end items-center ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}>
            <div className="w-4 h-4 bg-white/30 rounded-full blur-[2px] animate-pulse-glow mr-1"></div>
          </div>
        </div>

        <div className="p-8 lg:p-12 bg-white/60">
          
          {/* STEP 1: Enter Aadhaar */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 py-6">
              <div className="text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white shadow-xl glow-primary card-3d animate-float">
                  <ShieldCheck size={36} strokeWidth={2} />
                </div>
                <h2 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">Identity Verification</h2>
                <p className="text-sm text-slate-600 mt-3 font-medium leading-relaxed">Provide your 12-digit Aadhaar Number to retrieve your verified demographics information securely.</p>
              </div>

              <div className="space-y-6 max-w-sm mx-auto">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest pl-1">Aadhaar Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 5432 8765 1092"
                    maxLength={14}
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/[^\d\s]/g, ''))}
                    className="input-3d w-full text-center tracking-widest text-xl font-bold py-4 px-5 bg-white/80 border border-slate-200 focus:bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all placeholder:text-slate-300"
                  />
                  <p className="text-[10px] text-center text-slate-500 font-semibold flex items-center justify-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3 h-3 text-[#138808]" />
                    Encrypted end-to-end under UIDAI guidelines.
                  </p>
                </div>

                <button 
                  onClick={handleSendOtp}
                  className="btn-3d w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white text-sm font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 group"
                >
                  <span>Send OTP Verification Code</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {otpSent && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass border border-emerald-200/50 rounded-2xl p-6 max-w-md mx-auto space-y-5 bg-emerald-50/50 shadow-lg glow-emerald card-3d-subtle">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Smartphone className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-900">OTP Sent successfully</p>
                      <p className="text-xs text-emerald-700 mt-1.5 leading-relaxed">A 6-digit mock code was triggered to your registered mobile ending in ******43210. Use code <span className="font-bold bg-emerald-200/50 px-1.5 py-0.5 rounded text-emerald-900">123456</span> to proceed.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="input-3d flex-1 text-center font-bold text-lg tracking-widest bg-white border border-emerald-200 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-[#138808] focus:border-[#138808]"
                    />
                    <button 
                      onClick={handleVerifyOtp}
                      className="btn-3d bg-gradient-to-r from-[#138808] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-600/20"
                    >
                      Verify
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 3: Demographics & Bank Registration */}
          {step === 3 && (
            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-8">
              <div className="glass border border-emerald-200/50 rounded-2xl p-5 flex items-center space-x-4 bg-emerald-50/50 shadow-sm">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-emerald-900">Demographic Records Authenticated</p>
                  <p className="text-xs text-emerald-700 mt-1">Retrieved Name: <span className="font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">{fullName}</span> | Mobile: <span className="font-semibold">{phone}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Section */}
                <div className="space-y-4 col-span-2">
                  <h3 className="text-sm font-heading font-extrabold text-slate-800 uppercase tracking-widest pb-2 border-b border-slate-200/50 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" /> Beneficiary Information
                  </h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 pl-1">Full Name (As in Aadhaar)</label>
                  <input 
                    type="text" 
                    value={fullName} 
                    disabled 
                    className="input-3d w-full p-3.5 bg-slate-100/50 border border-slate-200 text-slate-500 rounded-xl text-sm font-bold focus:outline-none cursor-not-allowed" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 pl-1">Active Email ID</label>
                  <input 
                    type="email" 
                    placeholder="e.g. name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-3d w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500 transition-all" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 pl-1">Social Category / Caste</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-3d w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500 transition-all appearance-none"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC (Other Backward Classes)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 pl-1">Primary Occupation</label>
                  <select 
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="input-3d w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500 transition-all appearance-none"
                  >
                    <option value="Farmer / Marginal Farmer">Farmer / Marginal Farmer</option>
                    <option value="Agricultural Laborer">Agricultural Laborer</option>
                    <option value="Self Employed / Artisan">Self Employed / Artisan</option>
                    <option value="Student">Student</option>
                    <option value="Unemployed / Other">Unemployed / Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 pl-1">Verified Annual Family Income (₹)</label>
                  <input 
                    type="number" 
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="input-3d w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500 transition-all" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 pl-1">Resident State</label>
                  <input 
                    type="text" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input-3d w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500 transition-all" 
                    required
                  />
                </div>

                {/* Bank details - critical for DBT */}
                <div className="col-span-2 pt-6">
                  <div className="glass-card bg-blue-50/50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden card-3d-subtle">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/40 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    
                    <div className="relative z-10 mb-6">
                      <h3 className="text-sm font-heading font-extrabold text-blue-900 uppercase tracking-widest pb-2 border-b border-blue-200/50 flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-blue-600" /> Bank Account for Direct Benefit Transfer
                      </h3>
                      <p className="text-xs text-blue-700/80 mt-2 font-medium">Provide the bank account mapped with NPCI. This is where grants and subsidies will be directly deposited.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                      <div className="space-y-2 col-span-2">
                        <label className="text-xs font-bold text-blue-900 pl-1">Bank Name</label>
                        <input 
                          type="text" 
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="input-3d w-full p-3.5 bg-white border border-blue-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm" 
                          placeholder="e.g. State Bank of India"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-blue-900 pl-1">Bank Account Number</label>
                        <input 
                          type="text" 
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                          className="input-3d w-full p-3.5 bg-white border border-blue-100 rounded-xl text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm tracking-wider" 
                          placeholder="e.g. 30291827461"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-blue-900 pl-1">IFSC Code</label>
                        <input 
                          type="text" 
                          value={ifsc}
                          onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                          className="input-3d w-full p-3.5 bg-white border border-blue-100 rounded-xl text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm tracking-wider" 
                          placeholder="e.g. SBIN0001234"
                          maxLength={11}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="btn-3d w-full py-5 mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-3 col-span-2 shadow-xl shadow-blue-600/30 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Linking DBT Node & Registering...
                    </span>
                  ) : (
                    <>
                      <span>Complete Enrollment & Login</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}

        </div>
      </div>
    </div>
  );
};
