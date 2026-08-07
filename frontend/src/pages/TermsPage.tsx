import React from 'react';
import { TopNav } from '../components/TopNav';
import { Footer } from '../components/Footer';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-32">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200/60">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight font-heading mb-6">Terms of Use</h1>
          <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
            <p>Welcome to the DigiGrant Portal. By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions.</p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By registering on this portal, submitting an application, or acting as an officer or VLE, you agree to follow these Terms of Use and all applicable laws and regulations of the Government of India.</p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. User Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. All documents uploaded must be authentic and strictly belong to the beneficiary applying for the grant.</p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. Data Privacy & Aadhaar Usage</h2>
            <p>Any Aadhaar data collected is strictly used for e-KYC and DBT (Direct Benefit Transfer) purposes as per the Aadhaar Act, 2016. We do not store biometric data on our servers.</p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. VLE Guidelines</h2>
            <p>Village Level Entrepreneurs (VLEs) are authorized to assist citizens but must not charge any fee above the government-mandated service charge. Any violation will result in immediate suspension.</p>
            
            <p className="mt-10 text-sm text-slate-400">Last updated: August 2026</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
