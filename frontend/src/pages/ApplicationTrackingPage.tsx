import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Compass, 
  Clock, 
  MessageSquare, 
  ChevronRight,
  ArrowRight,
  BadgeAlert
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export const ApplicationTrackingPage: React.FC = () => {
  const { citizenProfile, applications } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedAppId, setSelectedAppId] = useState<string>('');

  const citizenApps = applications.filter(app => app.citizenId === citizenProfile.id);

  // Synchronize URL search parameters with tracking selection
  useEffect(() => {
    const appId = searchParams.get('id');
    if (appId) {
      setSelectedAppId(appId);
    } else if (citizenApps.length > 0 && !selectedAppId) {
      setSelectedAppId(citizenApps[0].id);
    }
  }, [searchParams, citizenApps]);

  const activeApp = applications.find(app => app.id === selectedAppId);

  // Timeline nodes template
  const steps = [
    { label: 'Application Submitted', desc: 'File successfully recorded in portal registry.' },
    { label: 'Document Verification', desc: 'Aadhaar, revenue deeds, and income statements audited by local Verifier.' },
    { label: 'Grant Sanctioning', desc: 'District Budget Officer completes final allocation sign-off.' },
    { label: 'Direct Benefit Transfer', desc: 'Disbursements schedule and Direct transfers (DBT) triggered.' }
  ];

  const getStepStatus = (stepIndex: number, currentStep: number, appStatus: string) => {
    const adjustedStepIndex = stepIndex + 1;
    
    if (appStatus.includes('rejected')) {
      // If rejected at verifier step (step 2)
      if (appStatus === 'rejected_by_verifier' && adjustedStepIndex === 2) {
        return 'failed';
      }
      // If rejected at district step (step 3)
      if (appStatus === 'rejected_by_district' && adjustedStepIndex === 3) {
        return 'failed';
      }
    }

    if (currentStep >= adjustedStepIndex) {
      return 'completed';
    } else if (currentStep + 1 === adjustedStepIndex) {
      return 'active';
    } else {
      return 'pending';
    }
  };

  const getTimelineBadge = (status: string) => {
    switch (status) {
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500 bg-white" />;
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-emerald-600 bg-white" />;
      case 'active':
        return <Clock className="w-6 h-6 text-purple-800 bg-white animate-spin" />;
      case 'pending':
      default:
        return <div className="w-5 h-5 rounded-full border-4 border-gray-200 bg-white"></div>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6" id="application_tracking_page_root">
        
        {/* Title Header */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 -z-10 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="z-10 relative">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">Application Tracking</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Check the multi-stage review status of your submitted government subsidy applications.</p>
          </div>

          {/* Quick selection selector */}
          {citizenApps.length > 0 && (
            <div className="flex items-center space-x-3 z-10 relative bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-full md:w-auto">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest pl-2">Track:</label>
              <select
                value={selectedAppId}
                onChange={(e) => {
                  setSelectedAppId(e.target.value);
                  setSearchParams({ id: e.target.value });
                }}
                className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all cursor-pointer w-full md:w-auto"
              >
                {citizenApps.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.schemeTitle.slice(0, 25)}... ({app.id})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Tracking Details Area */}
        {citizenApps.length === 0 ? (
          <div className="bg-white text-center py-16 px-6 border border-gray-200 rounded-2xl max-w-lg mx-auto">
            <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-slate-800 font-bold text-sm">No Applications Active</h3>
            <p className="text-gray-400 text-xs mt-1">You have not submitted any applications to track yet. Explore the catalogue and submit a file.</p>
            <Link to="/schemes" className="inline-block mt-4 bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold px-4 py-2 rounded-lg transition">
              Explore Schemes Catalogue
            </Link>
          </div>
        ) : !activeApp ? (
          <div className="text-center py-12 bg-white rounded-2xl border">
            <p className="text-gray-400 font-bold">Please select an application</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Timeline Map on Left */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">
                Workflow Tracking: <span className="text-indigo-600">{activeApp.schemeTitle}</span>
              </h2>

              <div className="relative pl-8 border-l-2 border-slate-100 ml-5 space-y-10">
                {steps.map((step, idx) => {
                  const status = getStepStatus(idx, activeApp.currentStep, activeApp.status);
                  
                  return (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[45px] top-0 z-10 bg-white p-1 rounded-full shadow-sm">
                        {getTimelineBadge(status)}
                      </span>

                      <div className="space-y-1.5 pt-1">
                        <h3 className={`text-sm font-extrabold uppercase tracking-wide ${
                          status === 'failed' ? 'text-red-500' :
                          status === 'completed' ? 'text-emerald-500' :
                          status === 'active' ? 'text-indigo-600' : 'text-slate-400'
                        }`}>
                          {step.label}
                        </h3>
                        <p className="text-sm text-slate-500 leading-loose font-medium">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Officer Logs and Actions on Right */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Active Status Header Card */}
              <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-5 shadow-xl shadow-slate-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">File Reference</p>
                  <h4 className="font-extrabold text-lg mt-1 flex items-center tracking-widest font-mono text-white">
                    <FileText className="w-5 h-5 mr-3 text-sky-400" />
                    {activeApp.id}
                  </h4>
                </div>

                <div className="border-t border-slate-700/50 pt-5 flex justify-between items-center text-sm relative z-10">
                  <span className="text-slate-400 font-medium">Date Filed:</span>
                  <span className="font-extrabold text-white">{activeApp.appliedDate}</span>
                </div>

                <div className="flex justify-between items-center text-sm relative z-10">
                  <span className="text-slate-400 font-medium">Current Phase:</span>
                  <span className="font-extrabold text-sky-400 uppercase tracking-widest bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/20 text-xs">
                    {activeApp.status.replace('_', ' ').replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Remarks logs */}
              {(activeApp.verifierComment || activeApp.districtOfficerComment) && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-5">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-indigo-600" /> Official Remarks
                  </h3>

                  <div className="space-y-4">
                    {activeApp.verifierComment && (
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-2xl"></div>
                        <p className="text-slate-400 font-extrabold uppercase text-[10px] tracking-widest ml-1">Verification Officer:</p>
                        <p className="font-bold text-slate-700 leading-relaxed ml-1">{activeApp.verifierComment}</p>
                      </div>
                    )}

                    {activeApp.districtOfficerComment && (
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-2xl"></div>
                        <p className="text-slate-400 font-extrabold uppercase text-[10px] tracking-widest ml-1">District Officer:</p>
                        <p className="font-bold text-slate-700 leading-relaxed ml-1">{activeApp.districtOfficerComment}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action prompts if rejected */}
              {activeApp.status.includes('rejected') && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-3xl space-y-4 text-red-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500 rounded-full blur-3xl opacity-10"></div>
                  <div className="flex items-center space-x-2 text-red-600 font-extrabold uppercase tracking-widest text-sm relative z-10">
                    <BadgeAlert className="w-5 h-5" />
                    <span>Application Blocked</span>
                  </div>
                  <p className="leading-relaxed font-bold text-sm text-red-700 relative z-10">
                    The processing of this file was rejected. Review the verifier comments above, adjust your documents/data details, and file a resubmission.
                  </p>
                  <Link 
                    to={`/schemes/${activeApp.schemeId}/apply`}
                    className="inline-flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-600/20 relative z-10"
                  >
                    <span>Resubmit Application</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              )}

              {/* Installments quick link if approved */}
              {(activeApp.status === 'disbursing' || activeApp.status === 'completed') && (
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl space-y-4 text-emerald-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 rounded-full blur-3xl opacity-10"></div>
                  <p className="font-extrabold uppercase tracking-widest text-[10px] text-emerald-700 relative z-10">Direct Benefit Transfer Calendar</p>
                  <p className="font-bold leading-relaxed text-sm text-emerald-800 relative z-10">
                    This subsidy has been successfully sanctioned. Installment releases have been scheduled and are tracking online.
                  </p>
                  <Link 
                    to="/citizen/installments" 
                    className="inline-flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 relative z-10"
                  >
                    <span>View Scheduled Transfers</span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              )}

            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
