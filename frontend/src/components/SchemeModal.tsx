import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Wheat, Landmark, Briefcase, GraduationCap, Heart, Home, Scale,
  Monitor, Wrench, HandHeart, Trophy, Train, Plane, Droplets, Baby,
  ClipboardList, MapPin, Building2, X, Check,
  Info, CheckCircle2, IndianRupee, ClipboardCheck, FileText,
  ArrowRight, Video
} from "lucide-react";
import { Scheme } from "../types";

const ICON_MAP: Record<string, React.ElementType> = {
  Wheat, Landmark, Briefcase, GraduationCap, Heart, Home, Scale,
  Monitor, Wrench, HandHeart, Trophy, Train, Plane, Droplets, Baby,
  ClipboardList,
};

const CATEGORY_META: Record<string, { icon: string; color: string; bg: string }> = {
  'agriculture': { icon: 'Wheat', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.12)' },
  'education': { icon: 'GraduationCap', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.12)' },
  'healthcare': { icon: 'Heart', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.12)' },
  'housing': { icon: 'Home', color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)' },
  'energy': { icon: 'Monitor', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.12)' },
  'social_welfare': { icon: 'HandHeart', color: '#9333ea', bg: 'rgba(147, 51, 234, 0.12)' },
};

const DEFAULT_META = { icon: 'ClipboardList', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)' };

interface SchemeModalProps {
  scheme: Scheme | null;
  onClose: () => void;
  onApply?: () => void;
}

export const SchemeModal: React.FC<SchemeModalProps> = ({ scheme, onClose, onApply }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    if (scheme) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [scheme, onClose]);

  if (!scheme) return null;

  const expired = false; // In real app, check deadline
  const catKey = scheme.category?.toLowerCase() || 'general';
  const catMeta = CATEGORY_META[catKey] || DEFAULT_META;
  const IconComponent = ICON_MAP[catMeta.icon] || ClipboardList;

  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(scheme.title + " scheme how to apply")}`;
  
  const rawAmount = scheme.subsidyAmount || scheme.grantAmount || 0;
  const formattedAmount = rawAmount > 0 
    ? (rawAmount >= 100000 
      ? `₹${(rawAmount / 100000).toFixed(1).replace('.0', '')} Lakh` 
      : `₹${rawAmount.toLocaleString('en-IN')}`)
    : "Varies";

  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{ minHeight: '300px', backgroundColor: '#ffffff', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="relative flex items-start gap-4 p-5 sm:p-6 border-b"
          style={{ borderBottomColor: `${catMeta.color}30` }}
        >
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div 
            className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center"
            style={{ background: catMeta.bg, color: catMeta.color }}
          >
            <IconComponent size={30} strokeWidth={1.6} />
          </div>
          
          <div className="flex-1 min-w-0 pr-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-2">
              {scheme.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2.5 mt-1">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-blue-700 bg-blue-100 capitalize">
                {(scheme.category || 'General').replace(/_/g, ' ')}
              </span>
              {expired ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-rose-700 bg-rose-100">Expired</span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-100">
                  {/* @ts-ignore */}
                  {scheme.schemeStatus || "Active"}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                <MapPin size={13} /> {scheme.state || 'All States'}
              </span>
              {scheme.ministry && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                  <Building2 size={13} /> {scheme.ministry}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50">
          
          {/* Key Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-slate-100/80 rounded-xl p-3.5 border border-slate-200/60">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Grant Amount</span>
              <span className="block text-[15px] font-bold" style={{ color: catMeta.color }}>
                {formattedAmount}
              </span>
            </div>
            <div className="bg-slate-100/80 rounded-xl p-3.5 border border-slate-200/60">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Income Limit</span>
              <span className="block text-[15px] font-bold text-slate-800">
                {/* @ts-ignore */}
                {scheme.incomeLimit || "Not specified"}
              </span>
            </div>
            <div className="bg-slate-100/80 rounded-xl p-3.5 border border-slate-200/60">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deadline</span>
              <span className="block text-[15px] font-bold text-slate-800">
                {scheme.applicationDeadline || "Open-ended"}
              </span>
            </div>
            <div className="bg-slate-100/80 rounded-xl p-3.5 border border-slate-200/60">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Date</span>
              <span className="block text-[15px] font-bold text-slate-800">
                {/* @ts-ignore */}
                {scheme.startDate || "N/A"}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Description */}
            <section className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
              <h3 className="flex items-center gap-2 text-[15px] font-bold text-slate-900 mb-3 border-b pb-3">
                <Info size={18} className="text-blue-600" />
                About This Scheme
              </h3>
              <div className="text-[14.5px] text-slate-600 leading-relaxed space-y-3">
                {scheme.description?.split('\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                )) || <p>No detailed description available.</p>}
              </div>
            </section>

            {/* Eligibility */}
            {scheme.eligibilityCriteria && scheme.eligibilityCriteria.length > 0 && (
              <section className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
                <h3 className="flex items-center gap-2 text-[15px] font-bold text-slate-900 mb-3 border-b pb-3">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  Eligibility Criteria
                </h3>
                <ul className="list-disc list-outside ml-5 space-y-1.5 text-[14.5px] text-slate-600">
                  {scheme.eligibilityCriteria.map((crit, idx) => (
                    <li key={idx} className="pl-1">{crit}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Benefits */}
            {scheme.benefits && (
              <section className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
                <h3 className="flex items-center gap-2 text-[15px] font-bold text-slate-900 mb-3 border-b pb-3">
                  <IndianRupee size={18} className="text-amber-500" />
                  Benefits
                </h3>
                <div className="text-[14.5px] text-slate-600 leading-relaxed">
                  <p>{scheme.benefits}</p>
                </div>
              </section>
            )}

            {/* Documents */}
            {scheme.requiredDocuments && scheme.requiredDocuments.length > 0 && (
              <section className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
                <h3 className="flex items-center gap-2 text-[15px] font-bold text-slate-900 mb-3 border-b pb-3">
                  <FileText size={18} className="text-blue-500" />
                  Documents Required
                </h3>
                <div className="flex flex-wrap gap-2">
                  {scheme.requiredDocuments.map((doc, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg border border-slate-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                      {doc}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t bg-white flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 shrink-0">
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Video size={18} className="text-red-600" />
            Watch Help Video
          </a>
          {!expired && (
            <button 
              onClick={onApply}
              className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              Apply Now
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
