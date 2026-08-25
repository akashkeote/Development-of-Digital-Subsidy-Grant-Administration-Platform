import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ArrowRight, ArrowLeft, Landmark, CheckCircle2, FileText, Smartphone, Sun } from 'lucide-react';
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
    
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Create new profile
      const newProfile = {
        id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: fullName,
        email: email,
        phone: phone,
        aadhaar: aadhaar,
        pan: 'ABCPS1234D',
        income,
        category,
        occupation,
        state,
        district,
        bankName,
        bankAccount: bankAccount,
        ifsc: ifsc,
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
    <div className="min-h-screen flex flex-col w-full font-sans bg-white overflow-hidden relative">
      
      {/* Top Banner (Full Width) */}
      <div className="w-full h-10 bg-slate-900 z-50 flex items-center justify-between px-6 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-4 h-[10px] bg-white flex flex-col justify-between overflow-hidden relative rounded-[1px]">
            <div className="w-full h-[33%] bg-[#FF9933]"></div>
            <div className="w-full h-[33%] bg-white flex items-center justify-center">
              <div className="w-[3px] h-[3px] rounded-full border-[0.5px] border-[#000080]"></div>
            </div>
            <div className="w-full h-[33%] bg-[#138808]"></div>
          </div>
          <span className="text-white text-[11px] font-bold tracking-widest uppercase">Government of India</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-slate-300 text-[11px] font-medium tracking-wider">
          <span className="hover:text-white cursor-pointer transition-colors">Screen Reader Access</span>
          <div className="flex gap-3">
            <span className="hover:text-white cursor-pointer transition-colors">A-</span>
            <span className="hover:text-white cursor-pointer transition-colors">A</span>
            <span className="hover:text-white cursor-pointer transition-colors">A+</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Left side - Dark Panel with Circles */}
        <div className="w-full md:w-[45%] lg:w-[40%] relative overflow-hidden flex flex-col justify-center px-8 lg:px-14 py-16 bg-blue-700 md:min-h-full">
          {/* Overlapping Circles Background */}
          <div className="absolute top-[-15%] right-[-20%] w-[500px] h-[500px] rounded-full bg-blue-600/50 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-800/40 mix-blend-overlay pointer-events-none"></div>

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full border-[1.5px] border-white/40 flex items-center justify-center mb-8">
              <Sun className="w-5 h-5 text-white/80" />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 font-heading drop-shadow-md">
              Government Subsidy & <br />
              Grant Disbursement <br />
              Tracking System
            </h1>
            
            <p className="text-blue-100 text-sm mb-16 max-w-sm leading-relaxed font-medium">
              Track government schemes, verify beneficiary eligibility, monitor fund disbursement, and ensure transparent delivery of subsidies across India.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8 max-w-md">
              <div className="text-center md:text-left">
                <div className="text-2xl font-black text-white mb-1 font-heading">4,680+</div>
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Schemes</div>
              </div>
              <div className="text-center md:text-left border-l border-white/10 pl-4">
                <div className="text-2xl font-black text-white mb-1 font-heading">36</div>
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">States & UTs</div>
              </div>
              <div className="text-center md:text-left border-l border-white/10 pl-4">
                <div className="text-2xl font-black text-white mb-1 font-heading">65+</div>
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Ministries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Registration Flow */}
        <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col items-center px-4 sm:px-6 py-12 relative bg-slate-50 min-h-screen md:min-h-0 md:overflow-y-auto">
          
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative z-10 transition-all duration-500 mb-10">
            
            {/* Navigation back and header */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-5">
                <Link to="/login" className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all outline-none text-slate-500 hover:text-slate-700">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-xl font-heading font-extrabold text-slate-800 tracking-tight">New Beneficiary Enrollment</h1>
                  <p className="text-xs font-medium text-slate-500 mt-1">Step {step} of 3: Verification & KYC Profile Setup</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Aadhaar Integrated
              </span>
            </div>

            {/* Step Indicator Progress Bar */}
            <div className="bg-slate-100 h-1.5 flex w-full relative overflow-hidden">
              <div className={`absolute top-0 left-0 h-full bg-blue-600 transition-all duration-700 ease-out flex justify-end items-center ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}>
              </div>
            </div>

            <div className="p-8 lg:p-10 bg-white">
              
              {/* STEP 1: Enter Aadhaar */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 py-2">
                  <div className="text-center max-w-md mx-auto">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
                      <ShieldCheck size={30} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-heading font-extrabold text-slate-800 tracking-tight">Identity Verification</h2>
                    <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">Provide your 12-digit Aadhaar Number to retrieve your verified demographics information securely.</p>
                  </div>

                  <div className="space-y-6 max-w-sm mx-auto">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Aadhaar Number</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 5432 8765 1092"
                        maxLength={14}
                        value={aadhaar}
                        onChange={(e) => setAadhaar(e.target.value.replace(/[^\d\s]/g, ''))}
                        className="w-full text-center tracking-widest text-lg font-bold py-3.5 px-5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300"
                      />
                      <p className="text-[10px] text-center text-slate-400 font-semibold flex items-center justify-center gap-1.5 pt-1.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Encrypted end-to-end under UIDAI guidelines.
                      </p>
                    </div>

                    <button 
                      onClick={handleSendOtp}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 group"
                    >
                      <span>Send OTP Verification Code</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {otpSent && (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="border border-emerald-200 rounded-2xl p-6 max-w-md mx-auto space-y-5 bg-emerald-50">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Smartphone className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-emerald-900">OTP Sent successfully</p>
                          <p className="text-xs text-emerald-700 mt-1.5 leading-relaxed">A 6-digit mock code was triggered to your registered mobile ending in ******43210. Use code <span className="font-bold bg-emerald-200 px-1.5 py-0.5 rounded text-emerald-900">123456</span> to proceed.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <input 
                          type="text" 
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          className="flex-1 text-center font-bold text-lg tracking-widest bg-white border border-emerald-200 rounded-xl py-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500"
                        />
                        <button 
                          onClick={handleVerifyOtp}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-600/20"
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
                <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-6">
                  <div className="border border-emerald-200 rounded-2xl p-4 flex items-center space-x-4 bg-emerald-50">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-900">Demographic Records Authenticated</p>
                      <p className="text-xs text-emerald-700 mt-1">Retrieved Name: <span className="font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">{fullName}</span> | Mobile: <span className="font-semibold">{phone}</span></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Personal Section */}
                    <div className="space-y-4 col-span-2 mt-2">
                      <h3 className="text-xs font-heading font-extrabold text-slate-500 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" /> Beneficiary Information
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 pl-1">Full Name (As in Aadhaar)</label>
                      <input 
                        type="text" 
                        value={fullName} 
                        disabled 
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-sm font-bold focus:outline-none cursor-not-allowed" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 pl-1">Active Email ID</label>
                      <input 
                        type="email" 
                        placeholder="e.g. name@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 pl-1">Social Category / Caste</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none"
                      >
                        <option value="General">General</option>
                        <option value="OBC">OBC (Other Backward Classes)</option>
                        <option value="SC">SC (Scheduled Caste)</option>
                        <option value="ST">ST (Scheduled Tribe)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 pl-1">Primary Occupation</label>
                      <select 
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none"
                      >
                        <option value="Farmer / Marginal Farmer">Farmer / Marginal Farmer</option>
                        <option value="Agricultural Laborer">Agricultural Laborer</option>
                        <option value="Self Employed / Artisan">Self Employed / Artisan</option>
                        <option value="Student">Student</option>
                        <option value="Unemployed / Other">Unemployed / Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 pl-1">Verified Annual Family Income (₹)</label>
                      <input 
                        type="number" 
                        value={income}
                        onChange={(e) => setIncome(Number(e.target.value))}
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 pl-1">Resident State</label>
                      <select 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none" 
                        required
                      >
                        <option value="">Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="West Bengal">West Bengal</option>
                      </select>
                    </div>

                    {/* Bank details - critical for DBT */}
                    <div className="col-span-2 pt-4">
                      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden">
                        
                        <div className="relative z-10 mb-5">
                          <h3 className="text-xs font-heading font-extrabold text-blue-900 uppercase tracking-widest pb-2 border-b border-blue-200/50 flex items-center gap-2">
                            <Landmark className="w-4 h-4 text-blue-600" /> Bank Account for Direct Benefit Transfer
                          </h3>
                          <p className="text-[11px] text-blue-700/80 mt-2 font-medium">Provide the bank account mapped with NPCI. This is where grants and subsidies will be directly deposited.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                          <div className="space-y-1.5 col-span-2">
                            <label className="text-[11px] font-bold text-blue-900 pl-1 uppercase tracking-wider">Bank Name (NPCI Mapped)</label>
                            <select 
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              className="w-full p-3 bg-white border border-blue-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none" 
                              required
                            >
                              <option value="">Select Bank</option>
                              <option value="State Bank of India">State Bank of India (SBI)</option>
                              <option value="HDFC Bank">HDFC Bank</option>
                              <option value="ICICI Bank">ICICI Bank</option>
                              <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                              <option value="Axis Bank">Axis Bank</option>
                              <option value="Bank of Baroda">Bank of Baroda (BOB)</option>
                              <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                              <option value="Canara Bank">Canara Bank</option>
                              <option value="Union Bank of India">Union Bank of India</option>
                              <option value="Bank of India">Bank of India</option>
                              <option value="Indian Bank">Indian Bank</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-blue-900 pl-1 uppercase tracking-wider">Account Number</label>
                            <input 
                              type="text" 
                              value={bankAccount}
                              onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                              className="w-full p-3 bg-white border border-blue-100 rounded-xl text-sm font-bold font-mono focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all tracking-wider" 
                              placeholder="e.g. 30291827461"
                              required
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-blue-900 pl-1 uppercase tracking-wider">IFSC Code</label>
                            <input 
                              type="text" 
                              value={ifsc}
                              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                              className="w-full p-3 bg-white border border-blue-100 rounded-xl text-sm font-bold font-mono focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all tracking-wider" 
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
                      className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-bold rounded-xl transition-all flex items-center justify-center gap-3 col-span-2 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group"
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
      </div>
    </div>
  );
};
