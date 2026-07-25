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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12" id="registration_page_root">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        
        {/* Navigation back and header */}
        <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/login" className="p-2 hover:bg-slate-50 rounded-xl transition outline-none">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900">New Beneficiary Enrollment</h1>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Step {step} of 3: Verification & KYC Profile Setup</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">Aadhaar Integrated</span>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-slate-50 h-1.5 flex">
          <div className={`h-full bg-indigo-600 transition-all duration-500 ease-out ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}></div>
        </div>

        <div className="p-8 lg:p-10">
          
          {/* STEP 1: Enter Aadhaar */}
          {step === 1 && (
            <div className="space-y-8 py-4">
              <div className="text-center max-w-md mx-auto">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-indigo-100/50 shadow-sm">
                  <ShieldCheck size={28} strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Identity Verification</h2>
                <p className="text-sm text-slate-500 mt-2 font-medium">Provide your 12-digit Aadhaar Number to retrieve your verified demographics information securely.</p>
              </div>

              <div className="space-y-5 max-w-sm mx-auto">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Aadhaar Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 5432 8765 1092"
                    maxLength={14}
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/[^\d\s]/g, ''))}
                    className="w-full text-center tracking-widest text-lg font-bold py-3.5 px-4 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all placeholder:text-slate-300"
                  />
                  <p className="text-[10px] text-center text-slate-400 font-medium">Encrypted end-to-end under UIDAI guidelines.</p>
                </div>

                <button 
                  onClick={handleSendOtp}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-slate-900/10"
                >
                  <span>Send OTP Verification Code</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {otpSent && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 max-w-md mx-auto space-y-4">
                  <div className="flex items-start space-x-2.5">
                    <Smartphone className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">OTP Sent successfully</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">A 6-digit mock code was triggered to your registered mobile ending in ******43210. Use code <span className="font-bold underline">123456</span> to proceed.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 text-center font-bold bg-white border border-emerald-300 rounded-lg py-2 focus:outline-hidden focus:ring-2 focus:ring-[#138808] text-xs"
                    />
                    <button 
                      onClick={handleVerifyOtp}
                      className="bg-[#138808] hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Demographics & Bank Registration */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold text-emerald-800">Demographic Records Authenticated</p>
                  <p className="text-[11px] text-emerald-700 leading-none mt-0.5">Retrieved Name: <span className="font-semibold">{fullName}</span> | Mobile: {phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal Section */}
                <div className="space-y-4 col-span-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">Beneficiary Information</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Full Name (As in Aadhaar)</label>
                  <input 
                    type="text" 
                    value={fullName} 
                    disabled 
                    className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-sm font-medium focus:outline-none" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Active Email ID</label>
                  <input 
                    type="email" 
                    placeholder="e.g. name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Social Category / Caste</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC (Other Backward Classes)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Primary Occupation</label>
                  <select 
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Farmer / Marginal Farmer">Farmer / Marginal Farmer</option>
                    <option value="Agricultural Laborer">Agricultural Laborer</option>
                    <option value="Self Employed / Artisan">Self Employed / Artisan</option>
                    <option value="Student">Student</option>
                    <option value="Unemployed / Other">Unemployed / Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Verified Annual Family Income (₹)</label>
                  <input 
                    type="number" 
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Resident State</label>
                  <input 
                    type="text" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    required
                  />
                </div>

                {/* Bank details - critical for DBT */}
                <div className="space-y-4 col-span-2 pt-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100 flex items-center">
                    <Landmark className="w-4 h-4 mr-2 text-purple-800" /> Bank Account for Direct Benefit Transfer (DBT)
                  </h3>
                  <p className="text-[10px] text-gray-500 -mt-2">Provide the bank account mapped with NPCI. This is where grants and subsidies will be directly deposited.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Bank Name</label>
                  <input 
                    type="text" 
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    placeholder="e.g. State Bank of India"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Bank Account Number</label>
                  <input 
                    type="text" 
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono" 
                    placeholder="e.g. 30291827461"
                    required
                  />
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-semibold text-gray-700">IFSC Code</label>
                  <input 
                    type="text" 
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono" 
                    placeholder="e.g. SBIN0001234"
                    maxLength={11}
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-6 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 col-span-2 shadow-md shadow-slate-900/10 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Linking DBT Node & Registering...
                    </span>
                  ) : (
                    <>
                      <span>Complete Enrollment & Login</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
