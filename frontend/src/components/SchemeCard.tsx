import React from 'react';
import {
  Wheat, Landmark, Briefcase, GraduationCap, Heart, Home, Scale,
  Monitor, Wrench, HandHeart, Trophy, Train, Plane, Droplets, Baby,
  ClipboardList, MapPin, Building2, X, Check, ChevronRight
} from "lucide-react";
import { Scheme } from '../types';

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

// Default fallback
const DEFAULT_META = { icon: 'ClipboardList', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)' };

interface SchemeCardProps {
  scheme: Scheme;
  index?: number;
  onClick?: () => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, index = 0, onClick }) => {
  // Determine if scheme is expired based on deadline
  const expired = false; // In a real app, compare scheme.applicationDeadline with new Date()

  // Find category meta (normalize the category string first)
  const catKey = scheme.category?.toLowerCase() || 'general';
  const catMeta = CATEGORY_META[catKey] || DEFAULT_META;
  const IconComponent = ICON_MAP[catMeta.icon] || ClipboardList;

  // Format amount
  const rawAmount = scheme.subsidyAmount || scheme.grantAmount || 0;
  const formattedAmount = rawAmount > 0 
    ? (rawAmount >= 100000 
      ? `₹${(rawAmount / 100000).toFixed(1).replace('.0', '')} Lakh` 
      : `₹${rawAmount.toLocaleString('en-IN')}`)
    : "Varies (see scheme details)";

  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className={`group relative flex flex-col md:flex-row md:items-center gap-3.5 px-4 py-4 md:px-5 bg-white border border-slate-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-blue-300 hover:shadow-md animate-fade-in-up outline-none focus-visible:ring-2 focus-visible:ring-blue-500 overflow-hidden ${expired ? 'opacity-70 grayscale-[20%]' : ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Left Border accent line on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-r-sm"></div>

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-lg shrink-0 flex items-center justify-center transition-colors"
        style={{
          backgroundColor: expired ? 'rgba(148, 163, 184, 0.1)' : catMeta.bg,
          color: expired ? '#94a3b8' : catMeta.color,
        }}
      >
        <IconComponent size={22} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-bold text-slate-800 mb-1 leading-snug line-clamp-2 pr-4">
          {scheme.title}
        </h3>
        
        {/* Meta Line (Location & Ministry) */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
          <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-slate-500">
            <MapPin size={13} className="shrink-0" />
            {scheme.state || 'All States'}
          </span>
          {scheme.ministry && (
            <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-slate-500">
              <Building2 size={13} className="shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-none">{scheme.ministry}</span>
            </span>
          )}
        </div>

        {/* Status Line (Badges) */}
        <div className="flex flex-wrap items-center gap-2 mt-0.5">
          {expired ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold text-rose-600 bg-rose-50 border border-rose-100">
              <X size={12} />
              Expired
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100">
              <Check size={12} />
              {/* @ts-ignore - schemeStatus doesn't exist on standard Scheme type yet */}
              {scheme.schemeStatus || "Active"}
            </span>
          )}
          
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold text-blue-600 bg-blue-50 border border-blue-100 capitalize">
            {(scheme.category || 'General').replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Right Column (Amount & Deadline) */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto shrink-0 md:min-w-[120px] pt-3 md:pt-0 mt-1 md:mt-0 border-t border-slate-100 md:border-t-0 gap-1">
        <span className="font-['Outfit'] text-[15px] md:text-[16px] font-bold text-blue-800 whitespace-nowrap">
          {formattedAmount}
        </span>
        <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
          {scheme.applicationDeadline
            ? expired
              ? `Ended ${scheme.applicationDeadline}`
              : `Due ${scheme.applicationDeadline}`
            : "Open-ended"}
        </span>
        <div className="hidden md:flex text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-blue-600 transition-all duration-300 mt-1">
          <ChevronRight size={18} />
        </div>
      </div>
    </article>
  );
};
