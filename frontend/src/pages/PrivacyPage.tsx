import React from 'react';
import { TopNav } from '../components/TopNav';
import { Footer } from '../components/Footer';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-32">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200/60">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight font-heading mb-6">Privacy Policy</h1>
          <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
            <p>At DigiGrant, we are committed to protecting your privacy and ensuring the highest level of security for your personal data.</p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Information Collection</h2>
            <p>We collect information necessary for processing your grant applications. This includes demographic details, income certificates, caste certificates, and banking information strictly routed via PFMS.</p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Use of Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To verify eligibility for state and central government schemes.</li>
              <li>To disburse funds directly to your bank account via DBT.</li>
              <li>To send SMS and email notifications regarding your application status.</li>
            </ul>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Data Protection</h2>
            <p>All data is encrypted in transit and at rest using industry-standard AES-256 encryption. We adhere strictly to the guidelines established by the Ministry of Electronics and Information Technology (MeitY).</p>
            
            <p className="mt-10 text-sm text-slate-400">Last updated: August 2026</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
