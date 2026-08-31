import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface DocumentPreviewModalProps {
  url: string | null;
  name: string;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ url, name, onClose }) => {
  if (!url) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up-modal">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <h2 className="text-lg font-bold text-slate-800 font-heading truncate pr-4">Preview: {name}</h2>
          <div className="flex items-center gap-3">
            {url !== '#' && (
              <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                <ExternalLink className="w-4 h-4" /> Open
              </a>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 bg-slate-200/50 p-4 relative flex items-center justify-center min-h-0">
          {url === '#' ? (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <ExternalLink className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">Document unavailable (Mock Mode)</p>
            </div>
          ) : (
            <iframe 
              src={url} 
              className="w-full h-full rounded-xl shadow-sm border border-slate-300 bg-white"
              title={name}
            />
          )}
        </div>
      </div>
    </div>
  );
};
