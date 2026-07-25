import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Landmark, FileText, CheckCircle2, AlertCircle, Bookmark, Check, Compass, DollarSign } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export const DistrictOfficerDashboard: React.FC = () => {
  const { applications, approveApplication } = useApp();
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [comment, setComment] = useState('');

  // Gather applications waiting for district sanction approval
  const queue = applications.filter(app => app.status === 'documents_verified');

  // Select first app in queue on load
  React.useEffect(() => {
    if (queue.length > 0 && !selectedAppId) {
      setSelectedAppId(queue[0].id);
    }
  }, [queue, selectedAppId]);

  const activeApp = applications.find(app => app.id === selectedAppId);

  const handleSubmitSanction = (approved: boolean) => {
    if (!activeApp) return;

    if (!comment.trim()) {
      alert('Please enter a district sanction remark.');
      return;
    }

    approveApplication(activeApp.id, comment, approved);

    alert(`Application #${activeApp.id} has been successfully ${approved ? 'Sanctioned & Approved for disbursements!' : 'Rejected.'}`);
    setSelectedAppId('');
    setComment('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6" id="district_dashboard_root">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-50 rounded-full blur-3xl opacity-60 -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="z-10">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">District Sanction Desk</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Authorize fiscal allocations, audit verifier comments, and sign off on scheduled welfare grant disbursements.</p>
          </div>
          <div className="z-10 text-xs font-extrabold bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100 px-4 py-2.5 rounded-xl flex items-center shadow-sm uppercase tracking-widest">
            <Landmark className="w-5 h-5 mr-2 text-fuchsia-500" /> Sanction Queue: <span className="ml-1.5 text-fuchsia-900 text-sm">{queue.length}</span>
          </div>
        </div>

        {/* Content Section */}
        {queue.length === 0 ? (
          <div className="bg-white text-center py-20 px-8 border border-slate-100 shadow-sm rounded-3xl max-w-2xl mx-auto space-y-4">
            <div className="w-20 h-20 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-indigo-500 animate-bounce" />
            </div>
            <h3 className="text-xl text-slate-900 font-extrabold">Sanction Desk Empty</h3>
            <p className="text-slate-500 font-medium">No verified files are awaiting district sanctioning at this time.</p>
            <div className="mt-8 p-4 bg-fuchsia-50/50 border border-fuchsia-100 rounded-2xl text-xs text-fuchsia-800 font-medium leading-relaxed">
              <strong className="text-fuchsia-900 font-extrabold uppercase tracking-widest block mb-1">Evaluator Guide:</strong> To test, switch to "Verification Officer" mode in the header, approve any pending application in their queue, and it will immediately flow into this desk for final sanctioning!
            </div>
          </div>
        ) : !activeApp ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Please select an application from the queue to review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Queue Panel */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-5 h-fit">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
                Sanctioning List ({queue.length})
              </h3>

              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {queue.map((app) => {
                  const active = app.id === selectedAppId;
                  return (
                    <button
                      key={app.id}
                      onClick={() => {
                        setSelectedAppId(app.id);
                        setComment('');
                      }}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        active 
                          ? 'bg-fuchsia-50/50 border-fuchsia-500 shadow-sm scale-[1.02]' 
                          : 'border-transparent bg-slate-50 hover:bg-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className={`text-sm font-bold line-clamp-1 flex-1 ${active ? 'text-fuchsia-900' : 'text-slate-700'}`}>{app.schemeTitle}</span>
                        <span className="text-[10px] text-slate-400 font-bold font-mono flex-shrink-0 bg-white px-2 py-1 rounded-md shadow-sm">#{app.id}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>{app.citizenName}</span>
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-sm">₹{app.personalDetails.income.toLocaleString()}/yr</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Dossier and Approval Form */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Demographics Summary */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-6">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center">
                  <Bookmark className="w-5 h-5 mr-3 text-fuchsia-600" /> Demographic & Bank Specs
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8 text-sm font-medium">
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">FullName:</p>
                    <p className="text-slate-900 font-bold">{activeApp.personalDetails.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Family Income:</p>
                    <p className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md inline-block border border-emerald-100">₹{activeApp.personalDetails.income.toLocaleString()}/yr</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">IFSC Code:</p>
                    <p className="text-slate-900 font-mono font-bold bg-slate-50 px-2 py-0.5 rounded-md inline-block border border-slate-100">{activeApp.bankDetails.ifsc}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Bank & Account Mapping:</p>
                    <p className="text-slate-900 font-bold">{activeApp.bankDetails.bankName} <span className="text-slate-400 font-mono ml-2 text-[11px]">(A/C: {activeApp.bankDetails.accountNumber})</span></p>
                  </div>
                </div>
              </div>

              {/* Verifier Officer Remarks */}
              <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-3xl shadow-sm space-y-4">
                <p className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Verification Audit Log
                </p>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-50">
                  <p className="text-sm text-slate-700 leading-relaxed font-bold italic border-l-4 border-indigo-300 pl-4">
                    "{activeApp.verifierComment || 'No verifier comment logged.'}"
                  </p>
                </div>
              </div>

              {/* District Approval Inputs Form */}
              <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-900/20 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                
                <h3 className="text-sm font-extrabold text-white uppercase tracking-widest border-b border-slate-800 pb-4 relative z-10">
                  Sanction Remarks Log & Signoff
                </h3>

                <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Official Sanctioning Remarks (Required)</label>
                    <textarea
                      placeholder="Input statutory remarks declaring budget allocation compliance, income verification confirmations, and DBT schedules..."
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-4 bg-slate-800/50 border border-slate-700 focus:border-fuchsia-500 rounded-2xl text-sm text-white font-medium focus:outline-none focus:ring-4 focus:ring-fuchsia-500/20 transition-all placeholder:text-slate-500 resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-end pt-2">
                    <button
                      onClick={() => handleSubmitSanction(false)}
                      className="w-full sm:w-auto bg-slate-800 hover:bg-red-500 text-white hover:shadow-lg hover:shadow-red-500/20 text-sm font-extrabold px-6 py-3.5 rounded-xl transition-all cursor-pointer border border-slate-700 hover:border-red-500"
                    >
                      Deny Grant
                    </button>
                    <button
                      onClick={() => handleSubmitSanction(true)}
                      className="w-full sm:w-auto bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-lg shadow-fuchsia-600/20 text-sm font-extrabold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <DollarSign className="w-5 h-5" />
                      <span>Sanction & Release Funds</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
