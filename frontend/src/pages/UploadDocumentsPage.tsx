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
        <div className="text-center py-12 glass-card rounded-2xl">
          <p className="text-gray-400 font-bold mb-3">Scheme reference not found</p>
          <Link to="/schemes" className="gradient-text underline font-bold text-xs">Return to Catalog</Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleFileChange = (docType: string, file: File) => {
    if (file.type !== 'application/pdf') {
      alert("Only PDF files are allowed!");
      return;
    }
    if (file.size > 200 * 1024) {
      alert("File size must be strictly under 200KB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploads(prev => ({
        ...prev,
        [docType]: { name: file.name, progress: 10, uploaded: false, dataUrl }
      }));
      
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
    reader.readAsDataURL(file);
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
      handleFileChange(docType, file);
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
        type: doc,
        url: uploads[doc].dataUrl
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
      <div className="space-y-8 relative z-10" id="upload_documents_page_root">
        
        {/* Header navigation and status info */}
        <div className="space-y-4">
          <Link to={`/schemes/${scheme.id}/apply`} className="inline-flex items-center text-xs font-bold text-[#00599f] hover:text-[#004a85] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Return to Form Details</span>
          </Link>

          <div className="bg-white border border-slate-200 p-8 rounded-2xl flex justify-between items-center relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-[#198754] bg-green-50 border border-green-100 px-3 py-1 rounded-md tracking-widest uppercase">KYC Attachments</span>
              <h1 className="text-3xl font-heading font-bold text-slate-800 mt-3 tracking-tight">Upload Certificates</h1>
              <p className="text-sm text-slate-500 mt-2 font-medium">Scheme: <span className="font-bold text-slate-700">{scheme.title}</span></p>
            </div>
            <div className="hidden sm:block text-right relative z-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Step 2 of 2</p>
              <p className="font-bold text-[#198754] text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-100">Document Upload</p>
            </div>
          </div>
        </div>

        {/* Step progress bar */}
        <div className="bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
          <div className="w-full h-full bg-[#198754] relative">
          </div>
        </div>

        {/* Upload Container Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main upload list */}
          <div className="lg:col-span-8 space-y-6">
            
            {scheme.requiredDocuments.length === 0 && (
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl text-center shadow-sm">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">No Documents Required</h3>
                <p className="text-slate-500 font-medium text-sm">
                  This scheme does not require any mandatory certificates or document uploads. You can proceed directly to submit your application.
                </p>
              </div>
            )}
            
            {scheme.requiredDocuments.map((docType) => {
              const fileUpload = uploads[docType];
              const isDrag = dragActive === docType;

              return (
                <div 
                  key={docType}
                  className={`bg-white p-8 rounded-2xl border-2 border-dashed transition-all duration-300 shadow-sm ${
                    fileUpload?.uploaded 
                      ? 'border-[#198754] bg-green-50' 
                      : isDrag 
                        ? 'border-[#00599f] bg-blue-50 scale-[1.01]' 
                        : 'border-slate-300 hover:border-[#00599f]'
                  }`}
                  onDragEnter={(e) => handleDrag(e, docType)}
                  onDragOver={(e) => handleDrag(e, docType)}
                  onDragLeave={(e) => handleDrag(e, docType)}
                  onDrop={(e) => handleDrop(e, docType)}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-heading font-bold text-slate-800 uppercase tracking-widest">{docType}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Format: PDF, JPG, PNG (Max 5MB)</p>
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
                                handleFileChange(docType, e.target.files[0]);
                              }
                            }}
                          />
                          <label 
                            htmlFor={`file-${docType}`}
                            className="text-xs font-bold text-[#00599f] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-6 py-3.5 rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                          >
                            <Upload className="w-5 h-5" />
                            <span>Select Document</span>
                          </label>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#00599f] border border-blue-100">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="leading-none text-left min-w-[120px]">
                            <p className="text-sm font-bold text-slate-800 max-w-[180px] truncate">{fileUpload.name}</p>
                            <p className="text-[10px] text-[#00599f] font-bold uppercase tracking-widest mt-2">{fileUpload.progress}% Uploaded</p>
                          </div>
                          
                          {fileUpload.uploaded ? (
                            <CheckCircle2 className="w-7 h-7 text-[#198754] flex-shrink-0" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-300 border-t-[#00599f] animate-spin"></div>
                          )}

                          <button 
                            type="button" 
                            onClick={() => handleDelete(docType)}
                            className="p-2 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-xl transition-colors ml-2 border border-transparent hover:border-red-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress bar indicator */}
                  {fileUpload && !fileUpload.uploaded && (
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-6 border border-slate-200">
                      <div className="h-full bg-[#00599f] transition-all duration-300 relative" style={{ width: `${fileUpload.progress}%` }}>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Submission triggers */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-200 p-6 rounded-2xl shadow-sm gap-4 mt-8">
              <span className="text-xs text-slate-500 font-bold text-center sm:text-left">Confirm uploads before submitting to registry.</span>
              <button 
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#198754] hover:bg-green-700 text-white text-sm font-bold px-10 py-4 rounded-xl flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
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
          <div className="lg:col-span-4 space-y-8">
            
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 relative overflow-hidden shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 text-sky-400 border border-slate-700 relative z-10">
                <CloudLightning className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-white relative z-10 mb-3">Self-Attestation Rule</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium relative z-10">
                Ensure uploaded scans are self-attested (signed by you at the margin) where applicable. Document clarity is important; blurry files trigger immediate verifier rejections.
              </p>
              <div className="mt-6 p-5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 font-medium relative z-10">
                Uploaded data is encrypted with <span className="text-sky-400 font-bold">SHA-256 signatures</span> before forwarding to district offices.
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl space-y-4 border border-slate-200 shadow-sm">
              <p className="font-heading font-bold text-slate-800 uppercase tracking-widest text-sm border-b border-slate-100 pb-4">Need Help?</p>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Visit your local <span className="font-bold text-[#00599f]">Common Service Centre (CSC)</span> for support with land document scans and mobile Aadhaar seeding triggers.
              </p>
            </div>

          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};
