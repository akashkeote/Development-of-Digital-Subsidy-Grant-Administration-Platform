import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, FileText, Upload, Trash2, CheckCircle2, CloudLightning, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

interface UploadState {
  [docType: string]: {
    name: string;
    progress: number;
    uploaded: boolean;
  };
}

export const UploadDocumentsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { schemes, applyToScheme } = useApp();
  const navigate = useNavigate();

  const scheme = schemes.find(s => s.id === id);

  const [draft, setDraft] = useState<any>(null);
  const [uploads, setUploads] = useState<UploadState>({});
  const [dragActive, setDragActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load the draft application from local storage
  useEffect(() => {
    const saved = localStorage.getItem('gov_draft_application');
    if (saved) {
      setDraft(JSON.parse(saved));
    }
  }, []);

  if (!scheme) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 font-bold mb-3">Scheme reference not found</p>
          <Link to="/schemes" className="text-purple-800 underline font-bold text-xs">Return to Catalog</Link>
        </div>
      </DashboardLayout>
    );
  }

  // Simulate progress uploading
  const handleFileChange = (docType: string, fileName: string) => {
    // Set initial uploading state
    setUploads(prev => ({
      ...prev,
      [docType]: { name: fileName, progress: 10, uploaded: false }
    }));

    // Trigger progressive tick up
    const interval = setInterval(() => {
      setUploads(prev => {
        const current = prev[docType];
        if (!current) {
          clearInterval(interval);
          return prev;
        }
        if (current.progress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            [docType]: { ...current, progress: 100, uploaded: true }
          };
        }
        return {
          ...prev,
          [docType]: { ...current, progress: current.progress + 30 }
        };
      });
    }, 200);
  };

  const handleDelete = (docType: string) => {
    setUploads(prev => {
      const copy = { ...prev };
      delete copy[docType];
      return copy;
    });
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent, docType: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(docType);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, docType: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileChange(docType, file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure all required documents are uploaded
    const missingDocs = scheme.requiredDocuments.filter(doc => !uploads[doc]?.uploaded);
    if (missingDocs.length > 0) {
      alert(`Please upload all required certificates before submitting:\n- ${missingDocs.join('\n- ')}`);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Prepare details
      const personal = draft?.personalDetails || {
        fullName: 'Rajesh Kumar Sharma',
        aadhaar: '5432-8765-1092',
        phone: '+91 98765 43210',
        income: 180000,
        state: 'Uttar Pradesh',
        district: 'Gorakhpur'
      };

      const bank = draft?.bankDetails || {
        bankName: 'State Bank of India',
        accountNumber: '30291827461',
        ifsc: 'SBIN0001234'
      };

      const filesList = scheme.requiredDocuments.map(doc => ({
        name: uploads[doc].name,
        type: doc
      }));

      // Apply
      const newAppId = applyToScheme(scheme.id, personal, bank, filesList);

      // Clear draft
      localStorage.removeItem('gov_draft_application');
      setLoading(false);

      alert(`Application filed successfully! Your Reference ID is ${newAppId}. Forwarded to sub-division Verification Officer.`);
      navigate('/citizen/tracking');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6" id="upload_documents_page_root">
        
        {/* Header navigation and status info */}
        <div className="space-y-4">
          <Link to={`/schemes/${scheme.id}/apply`} className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 transition">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Return to Form Details</span>
          </Link>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
            
            <div className="relative z-10">
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md tracking-widest uppercase">KYC Attachments</span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">Upload Certificates</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">Scheme: <span className="font-bold text-slate-900">{scheme.title}</span></p>
            </div>
            <div className="hidden sm:block text-right relative z-10">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Step 2 of 2</p>
              <p className="font-bold text-emerald-600 text-sm bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">Document Upload</p>
            </div>
          </div>
        </div>

        {/* Step progress bar */}
        <div className="bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
          <div className="w-full h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] relative">
            <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/30 animate-pulse"></div>
          </div>
        </div>

        {/* Upload Container Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main upload list */}
          <div className="lg:col-span-8 space-y-4">
            
            {scheme.requiredDocuments.map((docType) => {
              const fileUpload = uploads[docType];
              const isDrag = dragActive === docType;

              return (
                <div 
                  key={docType}
                  className={`bg-white p-6 rounded-3xl border-2 border-dashed transition-all ${
                    fileUpload?.uploaded 
                      ? 'border-emerald-200 bg-emerald-50/20' 
                      : isDrag 
                        ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' 
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'
                  }`}
                  onDragEnter={(e) => handleDrag(e, docType)}
                  onDragOver={(e) => handleDrag(e, docType)}
                  onDragLeave={(e) => handleDrag(e, docType)}
                  onDrop={(e) => handleDrop(e, docType)}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1.5">
                      <p className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">{docType}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Format: PDF, JPG, PNG (Max 5MB)</p>
                    </div>

                    <div className="w-full md:w-auto">
                      {!fileUpload ? (
                        <div className="relative">
                          <input 
                            type="file"
                            id={`file-${docType}`}
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileChange(docType, e.target.files[0].name);
                              }
                            }}
                          />
                          <label 
                            htmlFor={`file-${docType}`}
                            className="text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-6 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                          >
                            <Upload className="w-5 h-5" />
                            <span>Select Document</span>
                          </label>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-4 bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="leading-none text-left min-w-[120px]">
                            <p className="text-sm font-bold text-slate-800 max-w-[180px] truncate">{fileUpload.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{fileUpload.progress}% Uploaded</p>
                          </div>
                          
                          {fileUpload.uploaded ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-indigo-600 animate-spin"></div>
                          )}

                          <button 
                            type="button" 
                            onClick={() => handleDelete(docType)}
                            className="p-2 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-xl transition-all ml-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress bar indicator */}
                  {fileUpload && !fileUpload.uploaded && (
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-5 shadow-inner">
                      <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${fileUpload.progress}%` }}></div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Submission triggers */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4 mt-6">
              <span className="text-xs text-slate-400 font-bold text-center sm:text-left">Confirm uploads before submitting to registry.</span>
              <button 
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right sidebar instructions */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
              
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center mb-5 text-sky-400 border border-sky-500/30 relative z-10">
                <CloudLightning className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm uppercase tracking-widest text-white relative z-10 mb-2">Self-Attestation Rule</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10">
                Ensure uploaded scans are self-attested (signed by you at the margin) where applicable. Document clarity is important; blurry files trigger immediate verifier rejections.
              </p>
              <div className="mt-5 p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-xs text-slate-300 font-medium relative z-10">
                Uploaded data is encrypted with <span className="text-sky-400 font-bold">SHA-256 signatures</span> before forwarding to district offices.
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-3">
              <p className="font-extrabold text-slate-900 uppercase tracking-widest text-sm border-b border-slate-100 pb-3">Need Help?</p>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Visit your local <span className="font-bold text-slate-700">Common Service Centre (CSC)</span> for support with land document scans and mobile Aadhaar seeding triggers.
              </p>
            </div>

          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};
