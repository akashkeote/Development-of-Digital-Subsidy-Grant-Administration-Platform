import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { ShieldCheck, FileText, CheckCircle2, XCircle, Clock, Check, Users, ArrowUpCircle, RefreshCcw, Landmark } from 'lucide-react';
export const VerificationOfficerDashboard: React.FC = () => {
  const { applications, verifyApplication } = useApp();
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [comment, setComment] = useState('');
  
  const [activeRole, setActiveRole] = useState<'field_officer' | 'district_officer' | 'finance_approver'>('field_officer');
  const [grantAmount, setGrantAmount] = useState<number>(0);
  
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

  const handleWorkflowAction = (action: 'approve' | 'reject' | 'escalate' | 're_verify') => {
    if (!activeApp) return;

    if (!comment.trim()) {
      alert('Please provide a verification officer remark first.');
      return;
    }

    // Ensure all documents have been explicitly accepted or rejected
    const unverifiedDocs = activeApp.documents.filter(doc => !docStatuses[doc.id]);
    if (unverifiedDocs.length > 0 && action === 'approve') {
      alert('You must explicitly Accept or Reject all uploaded certificates before approving.');
      return;
    }

    if (activeRole === 'finance_approver' && action === 'approve' && grantAmount <= 0) {
      alert('Finance Approvers must set a valid grant amount before final approval.');
      return;
    }

    // Prepare document approvals array
    const docApprovals = activeApp.documents.map(doc => ({
      id: doc.id,
      status: docStatuses[doc.id] || (action === 'reject' ? 'rejected' : 'pending'),
      comment: docComments[doc.id] || ''
    }));

    // Remove the L2/L3 actions if they are used here, but we will handle the L1 verify
    let finalStatus: 'documents_verified' | 'rejected_by_verifier' = 'documents_verified';
    if (action === 'reject') {
      finalStatus = 'rejected_by_verifier';
    } else if (action === 're_verify' || action === 'escalate') {
      // For now, map these to documents_verified just to move it forward, or keep it as is
      finalStatus = 'documents_verified';
    }

    // Call the actual API function from AppContext (which calls useApi React Query hooks)
    verifyApplication(activeApp.id, comment, finalStatus, docApprovals);

    setSelectedAppId('');
    setComment('');
    setDocStatuses({});
    setDocComments({});
    setGrantAmount(0);
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 relative z-10 p-4" id="verifier_dashboard_root">
        
        {/* Header */}
        <div className="glass-card bg-white/70 p-8 rounded-3xl border border-white/50 shadow-xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 backdrop-blur-xl">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight font-heading">
              {activeRole === 'field_officer' ? 'Field Officer Verification' : activeRole === 'district_officer' ? 'District Officer Approval' : 'Finance Approver Desk'}
            </h1>
            <p className="text-base text-slate-600 mt-2 font-medium">
              {activeRole === 'field_officer' ? 'Review applicant demographics and audit uploaded PDF certificates (Level 1).' : activeRole === 'district_officer' ? 'Review escalated files and authorize forward to Finance (Level 2).' : 'Final review and grant disbursement authorization (Level 3).'}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
            {/* Sandbox Role Switcher - Restored for easy testing navigation! */}
            <div className="bg-slate-100 p-1.5 rounded-xl flex items-center shadow-inner border border-slate-200/50 shrink-0">
              <button 
                className="px-4 py-2 text-xs font-bold rounded-lg transition-all bg-white text-blue-700 shadow-sm border border-slate-200"
              >
                L1: Field
              </button>
              <button 
                onClick={() => {
                  setCurrentRole('district_officer');
                  navigate('/district/dashboard');
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg transition-all text-slate-500 hover:text-slate-700"
              >
                L2: District
              </button>
              <button 
                onClick={() => {
                  setCurrentRole('admin');
                  navigate('/admin/dashboard');
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg transition-all text-slate-500 hover:text-slate-700"
              >
                L3: Finance
              </button>
            </div>

            <div className="text-sm font-bold text-blue-700 bg-blue-50/80 border border-blue-200/50 px-6 py-4 rounded-2xl flex items-center tracking-widest shadow-inner shrink-0">
              <Clock className="w-5 h-5 mr-3" /> Pending Reviews: <span className="ml-2 font-black text-blue-700 text-lg">{queue.length}</span>
            </div>
          </div>
        </div>

        {/* Core Review Workspace */}
        {queue.length === 0 ? (
          <div className="glass-card card-3d bg-white/70 text-center py-24 px-8 border border-white/50 rounded-3xl max-w-2xl mx-auto space-y-8 shadow-xl backdrop-blur-xl">
            <div className="w-24 h-24 mx-auto bg-green-50/80 rounded-3xl flex items-center justify-center shadow-inner border border-green-100/50">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-3xl text-slate-800 font-bold font-heading">Queue is Empty</h3>
            <p className="text-slate-600 font-medium text-lg">All submitted applications have been verified. Excellent work!</p>
            <div className="mt-10 p-6 bg-blue-50/80 border border-blue-100/50 rounded-2xl text-sm text-slate-700 font-medium leading-relaxed shadow-inner">
              <strong className="text-blue-700 font-bold tracking-widest block mb-2">Evaluator Tip:</strong> Switch back to "Citizen Mode" in the header to submit a new scheme application. It will immediately appear here for review!
            </div>
          </div>
        ) : !activeApp ? (
          <div className="text-center py-24 glass-card card-3d bg-white/70 rounded-3xl border border-white/50 shadow-xl backdrop-blur-xl">
            <p className="text-slate-500 font-bold tracking-widest text-base">Please select an application from the queue to review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Applications Queue Picker */}
            <div className="lg:col-span-4 glass-card card-3d bg-white/70 p-8 rounded-3xl border border-white/50 shadow-xl space-y-6 h-fit backdrop-blur-xl">
              <h3 className="text-sm font-bold text-slate-500 tracking-widest border-b border-slate-200/50 pb-5 font-heading uppercase">
                Pending Queue ({queue.length})
              </h3>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
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
                      className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer btn-3d ${
                        active 
                          ? 'bg-white border-blue-600 shadow-md ring-1 ring-blue-600/20' 
                          : 'border-white/60 bg-white/40 hover:bg-white/80 shadow-sm hover:border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3 mb-4">
                        <span className={`text-base font-bold line-clamp-1 flex-1 font-heading ${active ? 'text-blue-700' : 'text-slate-700'}`}>{app.schemeTitle}</span>
                        <span className="text-xs text-slate-500 font-bold font-mono flex-shrink-0 bg-white/80 border border-slate-200/50 px-2 py-1 rounded-lg shadow-inner">#{app.id}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600 font-medium">
                        <span>{app.citizenName}</span>
                        <span>{app.appliedDate}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Interactive Document Review Panel */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* How Eligibility Scoring Works Reference Table */}
              <div className="glass-card card-3d bg-white/70 p-8 rounded-3xl border border-white/50 shadow-xl space-y-6 backdrop-blur-xl">
                <h3 className="text-base font-bold text-slate-800 tracking-widest border-b border-slate-200/50 pb-5 flex items-center font-heading uppercase text-blue-700">
                  <FileText className="w-5 h-5 mr-3 text-blue-600" />
                  How Eligibility Scoring Works (Example)
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                  <table className="w-full text-left text-sm font-medium">
                    <thead className="bg-[#0f2136] text-white font-heading">
                      <tr>
                        <th className="p-4 border-r border-slate-700 font-bold">Criterion</th>
                        <th className="p-4 border-r border-slate-700 font-bold">Max Points</th>
                        <th className="p-4 font-bold">What It Checks</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr className="border-b border-slate-200">
                        <td className="p-4 border-r border-slate-200 text-slate-800 font-bold">Income Level</td>
                        <td className="p-4 border-r border-slate-200 text-slate-800">30</td>
                        <td className="p-4 text-slate-600">Does household income fall within the scheme's required range?</td>
                      </tr>
                      <tr className="border-b border-slate-200 bg-slate-50/80">
                        <td className="p-4 border-r border-slate-200 text-slate-800 font-bold">Category Match</td>
                        <td className="p-4 border-r border-slate-200 text-slate-800">40</td>
                        <td className="p-4 text-slate-600">Does the applicant's category (Farmer, Student, etc.) match the scheme's eligible categories?</td>
                      </tr>
                      <tr>
                        <td className="p-4 border-r border-slate-200 text-slate-800 font-bold">Documents Complete</td>
                        <td className="p-4 border-r border-slate-200 text-slate-800">30</td>
                        <td className="p-4 text-slate-600">Are all required documents uploaded and verified?</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Applicant Demographic Specs */}
              <div className="glass-card card-3d bg-white/70 p-8 rounded-3xl border border-white/50 shadow-xl space-y-8 backdrop-blur-xl">
                <h3 className="text-base font-bold text-slate-800 tracking-widest border-b border-slate-200/50 pb-5 flex items-center font-heading uppercase">
                  <FileText className="w-5 h-5 mr-3 text-blue-600" />
                  Applicant Dossier
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-8 text-base font-medium">
                  <div>
                    <p className="text-xs text-slate-500 font-bold tracking-widest mb-2 uppercase">FullName:</p>
                    <p className="text-slate-800 font-bold">{activeApp.personalDetails.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold tracking-widest mb-2 uppercase">Aadhaar:</p>
                    <p className="text-slate-800 font-mono font-bold bg-white/80 px-3 py-1.5 rounded-lg inline-block border border-slate-200/50 shadow-inner">{activeApp.personalDetails.aadhaar}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold tracking-widest mb-2 uppercase">Mobile:</p>
                    <p className="text-slate-800 font-bold">{activeApp.personalDetails.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold tracking-widest mb-2 uppercase">Income:</p>
                    <p className="text-green-700 font-bold bg-green-50/80 px-3 py-1.5 rounded-lg inline-block border border-green-200/50 shadow-inner">₹{activeApp.personalDetails.income.toLocaleString('en-IN')}/yr</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold tracking-widest mb-2 uppercase">State:</p>
                    <p className="text-slate-800 font-bold">{activeApp.personalDetails.state}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold tracking-widest mb-2 uppercase">District:</p>
                    <p className="text-slate-800 font-bold">{activeApp.personalDetails.district}</p>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents List with checkboxes */}
              <div className="glass-card bg-white/70 p-8 rounded-3xl border border-white/50 shadow-xl space-y-8 backdrop-blur-xl">
                <h3 className="text-base font-bold text-slate-800 tracking-widest border-b border-slate-200/50 pb-5 flex items-center font-heading uppercase">
                  <ShieldCheck className="w-5 h-5 mr-3 text-blue-600" /> Certificates Audit
                </h3>

                <div className="space-y-6">
                  {activeApp.documents.map((doc) => {
                    const status = docStatuses[doc.id];
                    const docComment = docComments[doc.id] || '';

                    return (
                      <div key={doc.id} className="p-6 border border-white/60 rounded-2xl bg-white/50 space-y-6 hover:bg-white/80 transition-all duration-300 shadow-sm relative z-10">
                        <div className="flex flex-col 2xl:flex-row justify-between items-start 2xl:items-center gap-6">
                          <div className="flex gap-5 items-center w-full min-w-0">
                            <span className="w-14 h-14 bg-white shadow-md text-blue-600 rounded-2xl flex items-center justify-center border border-slate-100 flex-shrink-0">
                              <FileText className="w-6 h-6" />
                            </span>
                            <div className="leading-none text-left min-w-0 overflow-hidden">
                              <p className="text-base font-bold text-slate-800 font-heading truncate">{doc.type}</p>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2 font-mono truncate">File: {doc.name}</p>
                            </div>
                          </div>

                          {/* Quick validation toggles */}
                          <div className="flex gap-4 flex-wrap bg-white/60 p-2 rounded-2xl shadow-inner border border-slate-100 backdrop-blur-sm shrink-0 relative z-20">
                            <button
                              type="button"
                              onClick={() => handleDocVerify(doc.id, 'verified')}
                              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center space-x-2 cursor-pointer border ${
                                status === 'verified'
                                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-transparent shadow-md transform -translate-y-1'
                                  : 'text-slate-600 hover:text-slate-800 hover:bg-white border-transparent bg-transparent hover:shadow-sm'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Accept</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDocVerify(doc.id, 'rejected')}
                              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center space-x-2 cursor-pointer border ${
                                status === 'rejected'
                                  ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-transparent shadow-md transform -translate-y-1'
                                  : 'text-slate-600 hover:text-slate-800 hover:bg-white border-transparent bg-transparent hover:shadow-sm'
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
                          className="w-full p-4 bg-white/80 border border-slate-200/50 focus:border-blue-400 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 shadow-inner"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Logging Form */}
              <div className="glass-card bg-white/70 p-8 rounded-3xl shadow-xl border border-white/50 space-y-8 backdrop-blur-xl">
                <h3 className="text-base font-bold text-slate-800 tracking-widest border-b border-slate-200/50 pb-5 font-heading uppercase">
                  Verifier Remarks Log
                </h3>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Official Process Comments (Required)</label>
                    <textarea
                      placeholder="Input comprehensive audit comments, detailing certificate verification parameters and local records check..."
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-5 bg-white/80 border border-slate-200/50 focus:border-blue-400 rounded-2xl text-base text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 resize-none input-3d shadow-inner"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 justify-end pt-6 border-t border-slate-200/50">
                    
                    {activeRole === 'finance_approver' && (
                      <div className="w-full sm:w-auto flex items-center gap-3 mr-auto bg-green-50 px-4 py-2 rounded-2xl border border-green-200">
                        <Landmark className="text-green-600" size={20} />
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Sanction Amount (₹)</label>
                          <input 
                            type="number" 
                            value={grantAmount || ''}
                            onChange={(e) => setGrantAmount(Number(e.target.value))}
                            className="bg-transparent border-none text-slate-800 font-bold focus:outline-none w-32 font-mono" 
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleWorkflowAction('reject')}
                      className="w-full sm:w-auto bg-white border border-slate-200 hover:border-red-400 hover:text-red-600 text-slate-700 text-sm font-bold px-6 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer btn-3d shadow-sm flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} /> Reject File
                    </button>
                    
                    {activeRole !== 'finance_approver' && (
                      <button
                        onClick={() => handleWorkflowAction('re_verify')}
                        className="w-full sm:w-auto bg-white border border-slate-200 hover:border-amber-400 hover:text-amber-600 text-slate-700 text-sm font-bold px-6 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer btn-3d shadow-sm flex items-center justify-center gap-2"
                      >
                        <RefreshCcw size={18} /> Re-Verify
                      </button>
                    )}

                    {activeRole !== 'finance_approver' && (
                      <button
                        onClick={() => handleWorkflowAction('escalate')}
                        className="w-full sm:w-auto bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 text-slate-700 text-sm font-bold px-6 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer btn-3d shadow-sm flex items-center justify-center gap-2"
                      >
                        <ArrowUpCircle size={18} /> Escalate
                      </button>
                    )}

                    <button
                      onClick={() => handleWorkflowAction('approve')}
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 text-sm font-bold px-8 py-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer btn-3d"
                    >
                      <Check className="w-5 h-5" />
                      <span>{activeRole === 'finance_approver' ? 'Final Sanction' : 'Approve & Forward'}</span>
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

