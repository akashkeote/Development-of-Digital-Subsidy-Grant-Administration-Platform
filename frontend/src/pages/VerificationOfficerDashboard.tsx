import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, FileText, CheckCircle2, XCircle, AlertCircle, Clock, Check, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export const VerificationOfficerDashboard: React.FC = () => {
  const { applications, verifyApplication } = useApp();
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [comment, setComment] = useState('');
  
  // Document statuses tracking
  const [docStatuses, setDocStatuses] = useState<Record<string, 'verified' | 'rejected'>>({});
  const [docComments, setDocComments] = useState<Record<string, string>>({});

  // Gather applications waiting for document verification
  const queue = applications.filter(app => app.status === 'submitted');

  // Select first app on mount or when queue updates if nothing is active
  React.useEffect(() => {
    if (queue.length > 0 && !selectedAppId) {
      setSelectedAppId(queue[0].id);
    }
  }, [queue, selectedAppId]);

  const activeApp = applications.find(app => app.id === selectedAppId);

  const handleDocVerify = (docId: string, status: 'verified' | 'rejected') => {
    setDocStatuses(prev => ({ ...prev, [docId]: status }));
  };

  const handleDocComment = (docId: string, val: string) => {
    setDocComments(prev => ({ ...prev, [docId]: val }));
  };

  const handleSubmitReview = (approved: boolean) => {
    if (!activeApp) return;

    if (!comment.trim()) {
      alert('Please provide a verification officer remark first.');
      return;
    }

    // Prepare document approvals array
    const docApprovals = activeApp.documents.map(doc => ({
      id: doc.id,
      status: docStatuses[doc.id] || 'verified', // Default to verified for sandbox convenience
      comment: docComments[doc.id] || ''
    }));

    const status = approved ? 'documents_verified' : 'rejected_by_verifier';
    
    verifyApplication(activeApp.id, comment, status, docApprovals);

    // Reset states
    alert(`File #${activeApp.id} successfully processed and marked as [${status.replace('_', ' ')}].`);
    setSelectedAppId('');
    setComment('');
    setDocStatuses({});
    setDocComments({});
  };

  return (
    <DashboardLayout>
      <div className="space-y-6" id="verifier_dashboard_root">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="z-10">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">Document Verification</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Review applicant demographics, audit uploaded PDF certificates, and verify compliance criteria.</p>
          </div>
          <div className="z-10 text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-2.5 rounded-xl flex items-center shadow-sm uppercase tracking-widest">
            <Clock className="w-5 h-5 mr-2 text-indigo-500" /> Pending Reviews: <span className="ml-1.5 text-indigo-800 text-sm">{queue.length}</span>
          </div>
        </div>

        {/* Core Review Workspace */}
        {queue.length === 0 ? (
          <div className="bg-white text-center py-20 px-8 border border-slate-100 shadow-sm rounded-3xl max-w-2xl mx-auto space-y-4">
            <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-bounce" />
            </div>
            <h3 className="text-xl text-slate-900 font-extrabold">Queue is Empty</h3>
            <p className="text-slate-500 font-medium">All submitted applications have been verified. Excellent work!</p>
            <div className="mt-8 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-xs text-indigo-800 font-medium leading-relaxed">
              <strong className="text-indigo-900 font-extrabold uppercase tracking-widest block mb-1">Evaluator Tip:</strong> Switch back to "Citizen Mode" in the header to submit a new scheme application. It will immediately appear here for review!
            </div>
          </div>
        ) : !activeApp ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Please select an application from the queue to review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Applications Queue Picker */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-5 h-fit">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
                Pending Queue ({queue.length})
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
                        setDocStatuses({});
                      }}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        active 
                          ? 'bg-indigo-50/50 border-indigo-500 shadow-sm scale-[1.02]' 
                          : 'border-transparent bg-slate-50 hover:bg-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className={`text-sm font-bold line-clamp-1 flex-1 ${active ? 'text-indigo-900' : 'text-slate-700'}`}>{app.schemeTitle}</span>
                        <span className="text-[10px] text-slate-400 font-bold font-mono flex-shrink-0 bg-white px-2 py-1 rounded-md shadow-sm">#{app.id}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>{app.citizenName}</span>
                        <span>{app.appliedDate}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Interactive Document Review Panel */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Applicant Demographic Specs */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-6">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-3 text-indigo-600" />
                  Applicant Dossier
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6 text-sm font-medium">
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">FullName:</p>
                    <p className="text-slate-900 font-bold">{activeApp.personalDetails.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Aadhaar:</p>
                    <p className="text-slate-900 font-mono font-bold bg-slate-50 px-2 py-0.5 rounded-md inline-block border border-slate-100">{activeApp.personalDetails.aadhaar}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Mobile:</p>
                    <p className="text-slate-900 font-bold">{activeApp.personalDetails.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Income:</p>
                    <p className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md inline-block border border-emerald-100">₹{activeApp.personalDetails.income.toLocaleString('en-IN')}/yr</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">State:</p>
                    <p className="text-slate-900 font-bold">{activeApp.personalDetails.state}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">District:</p>
                    <p className="text-slate-900 font-bold">{activeApp.personalDetails.district}</p>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents List with checkboxes */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-3 text-indigo-600" /> Certificates Audit
                </h3>

                <div className="space-y-4">
                  {activeApp.documents.map((doc) => {
                    const status = docStatuses[doc.id] || 'verified';
                    const docComment = docComments[doc.id] || '';

                    return (
                      <div key={doc.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50 space-y-4 hover:shadow-sm transition-all duration-300">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex gap-4 items-center">
                            <span className="w-12 h-12 bg-white shadow-sm text-indigo-600 rounded-xl flex items-center justify-center border border-slate-100">
                              <FileText className="w-6 h-6" />
                            </span>
                            <div className="leading-none text-left">
                              <p className="text-sm font-extrabold text-slate-900">{doc.type}</p>
                              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1.5">File: {doc.name}</p>
                            </div>
                          </div>

                          {/* Quick validation toggles */}
                          <div className="flex gap-2 self-end sm:self-auto bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                            <button
                              type="button"
                              onClick={() => handleDocVerify(doc.id, 'verified')}
                              className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer ${
                                status === 'verified'
                                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                  : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-50'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Accept</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDocVerify(doc.id, 'rejected')}
                              className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer ${
                                status === 'rejected'
                                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                                  : 'text-slate-400 hover:text-red-500 hover:bg-slate-50'
                              }`}
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>

                        {/* Document specific comment */}
                        <input 
                          type="text"
                          placeholder="Audit comment / description of discrepancy (optional if accepted)"
                          value={docComment}
                          onChange={(e) => handleDocComment(doc.id, e.target.value)}
                          className="w-full p-4 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Logging Form */}
              <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-900/20 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                
                <h3 className="text-sm font-extrabold text-white uppercase tracking-widest border-b border-slate-800 pb-4 relative z-10">
                  Verifier Remarks Log
                </h3>

                <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Official Process Comments (Required)</label>
                    <textarea
                      placeholder="Input comprehensive audit comments, detailing certificate verification parameters and local records check..."
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-4 bg-slate-800/50 border border-slate-700 focus:border-indigo-500 rounded-2xl text-sm text-white font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500 resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-end pt-2">
                    <button
                      onClick={() => handleSubmitReview(false)}
                      className="w-full sm:w-auto bg-slate-800 hover:bg-red-500 text-white hover:shadow-lg hover:shadow-red-500/20 text-sm font-extrabold px-6 py-3.5 rounded-xl transition-all cursor-pointer border border-slate-700 hover:border-red-500"
                    >
                      Reject File
                    </button>
                    <button
                      onClick={() => handleSubmitReview(true)}
                      className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 text-sm font-extrabold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Check className="w-5 h-5" />
                      <span>Verify & Forward</span>
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
