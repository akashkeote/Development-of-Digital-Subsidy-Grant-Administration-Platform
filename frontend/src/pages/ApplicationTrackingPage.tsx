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
        return <XCircle className="w-8 h-8 text-red-400 bg-slate-900 rounded-full border-2 border-red-500/50 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />;
      case 'completed':
        return <CheckCircle2 className="w-8 h-8 text-emerald-400 bg-slate-900 rounded-full border-2 border-emerald-500/50 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />;
      case 'active':
        return <Clock className="w-8 h-8 text-blue-400 bg-slate-900 rounded-full border-2 border-blue-500/50 animate-spin drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]" />;
      case 'pending':
      default:
        return <div className="w-6 h-6 rounded-full border-4 border-slate-700 bg-slate-800 m-1"></div>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8" id="application_tracking_page_root">
        
        {/* Title Header */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="z-10 relative">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight font-heading">Application Tracking</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium max-w-xl">Check the multi-stage review status of your submitted government subsidy applications.</p>
          </div>

          {/* Quick selection selector */}
          {citizenApps.length > 0 && (
            <div className="flex items-center space-x-3 z-10 relative bg-slate-50 p-2 rounded-xl border border-slate-200 w-full md:w-auto">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-2">Track:</label>
              <select
                value={selectedAppId}
                onChange={(e) => {
                  setSelectedAppId(e.target.value);
                  setSearchParams({ id: e.target.value });
                }}
                className="py-2 px-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:border-[#00599f] focus:ring-1 focus:ring-[#00599f] cursor-pointer w-full md:w-auto"
              >
                {citizenApps.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.schemeTitle.slice(0, 30)}... ({app.id})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Tracking Details Area */}
        {citizenApps.length === 0 ? (
          <div className="bg-white text-center py-20 px-8 border border-slate-200 shadow-sm rounded-2xl max-w-lg mx-auto">
            <Compass className="w-16 h-16 text-slate-300 mx-auto mb-5" />
            <h3 className="text-slate-800 font-bold text-lg font-heading">No Applications Active</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">You have not submitted any applications to track yet. Explore the catalogue and submit a file.</p>
            <Link to="/schemes" className="inline-block mt-8 bg-[#00599f] hover:bg-[#004a85] text-white text-sm font-bold px-8 py-3.5 rounded-lg transition-colors">
              Explore Schemes Catalogue
            </Link>
          </div>
        ) : !activeApp ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 font-bold">Please select an application</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Timeline Map on Left */}
            <div className="lg:col-span-7 bg-white p-8 lg:p-10 rounded-2xl border border-slate-200 shadow-sm relative">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-5 mb-8 font-heading">
                Workflow Tracking: <span className="text-[#00599f] font-extrabold">{activeApp.schemeTitle}</span>
              </h2>

              <div className="relative pl-10 border-l-2 border-slate-200 ml-6 space-y-12">
                {steps.map((step, idx) => {
                  const status = getStepStatus(idx, activeApp.currentStep, activeApp.status);
                  
                  return (
                    <div key={idx} className="relative group">
                      {/* Timeline dot */}
                      <span className="absolute -left-[57px] top-0 z-10 bg-white p-1 rounded-full">
                        {status === 'failed' ? (
                          <XCircle className="w-8 h-8 text-red-500 bg-white" />
                        ) : status === 'completed' ? (
                          <CheckCircle2 className="w-8 h-8 text-[#198754] bg-white" />
                        ) : status === 'active' ? (
                          <Clock className="w-8 h-8 text-[#00599f] bg-white animate-spin-slow" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-4 border-slate-300 bg-white m-1"></div>
                        )}
                      </span>

                      <div className="space-y-2 pt-1">
                        <div className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest mb-1 ${
                          status === 'failed' ? 'bg-red-50 text-red-700 border border-red-200' :
                          status === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                          status === 'active' ? 'bg-[#e7edf5] text-[#00599f] border border-[#c9ddec]' : 
                          'bg-slate-50 text-slate-500 border border-slate-200'
                        }`}>
                          {step.label}
                        </div>
                        <p className={`text-sm leading-relaxed ${status === 'active' ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
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
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">File Reference</p>
                <h4 className="font-bold text-xl flex items-center tracking-wide text-slate-800 mb-6 font-heading">
                  <FileText className="w-5 h-5 mr-3 text-[#00599f]" />
                  {activeApp.id}
                </h4>

                <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-sm mb-4">
                  <span className="text-slate-500 font-medium">Date Filed:</span>
                  <span className="font-bold text-slate-800 bg-white px-3 py-1.5 rounded-md border border-slate-200">{activeApp.appliedDate}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Current Phase:</span>
                  <span className="font-bold text-[#00599f] uppercase tracking-widest bg-[#e7edf5] px-3 py-1.5 rounded-md text-xs">
                    {activeApp.status.replace('_', ' ').replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Remarks logs */}
              {(activeApp.verifierComment || activeApp.districtOfficerComment) && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center font-heading">
                    <MessageSquare className="w-4 h-4 mr-2 text-slate-400" /> Official Remarks
                  </h3>

                  <div className="space-y-4">
                    {activeApp.verifierComment && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-sm border-l-4 border-l-[#00599f]">
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Verification Officer:</p>
                        <p className="font-medium text-slate-800 leading-relaxed">{activeApp.verifierComment}</p>
                      </div>
                    )}

                    {activeApp.districtOfficerComment && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-sm border-l-4 border-l-[#198754]">
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">District Officer:</p>
                        <p className="font-medium text-slate-800 leading-relaxed">{activeApp.districtOfficerComment}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action prompts if rejected */}
              {activeApp.status.includes('rejected') && (
                <div className="bg-red-50 border border-red-200 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center space-x-2 text-red-700 font-bold uppercase tracking-widest text-sm">
                    <BadgeAlert className="w-5 h-5" />
                    <span>Application Blocked</span>
                  </div>
                  <p className="leading-relaxed font-medium text-sm text-red-900/80">
                    The processing of this file was rejected. Review the verifier comments above, adjust your documents/data details, and file a resubmission.
                  </p>
                  <Link 
                    to={`/schemes/${activeApp.schemeId}/apply`}
                    className="inline-flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg transition-colors mt-2 text-sm"
                  >
                    <span>Resubmit Application</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              )}

              {/* Installments quick link if approved */}
              {(activeApp.status === 'disbursing' || activeApp.status === 'completed') && (
                <div className="bg-green-50 border border-green-200 p-6 rounded-2xl space-y-4">
                  <p className="font-bold uppercase tracking-widest text-[10px] text-green-800">Direct Benefit Transfer Calendar</p>
                  <p className="font-medium leading-relaxed text-sm text-green-900/80">
                    This subsidy has been successfully sanctioned. Installment releases have been scheduled and are tracking online.
                  </p>
                  <Link 
                    to="/citizen/installments" 
                    className="inline-flex items-center justify-center w-full bg-[#198754] hover:bg-green-700 text-white font-bold py-3.5 rounded-lg transition-colors mt-2 text-sm"
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
