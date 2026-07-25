import React from 'react';
import { Link } from 'react-router-dom';
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

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  'agriculture': { icon: 'Wheat', color: '#16a34a' }, // green-600
  'education': { icon: 'GraduationCap', color: '#2563eb' }, // blue-600
  'healthcare': { icon: 'Heart', color: '#dc2626' }, // red-600
  'housing': { icon: 'Home', color: '#d97706' }, // amber-600
  'energy': { icon: 'Monitor', color: '#0ea5e9' }, // sky-500
};

interface SchemeCardProps {
  scheme: Scheme;
  index?: number;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, index = 0 }) => {
  const expired = false; // We can add logic based on deadline if needed
  const catMeta = CATEGORY_META[scheme.category?.toLowerCase()] || { icon: "ClipboardList", color: "#64748b" };
  const IconComponent = ICON_MAP[catMeta.icon] || ClipboardList;

  return (
    <Link to={`/schemes/${scheme.id}`} className="block outline-none">
      <article
        className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 md:p-5 bg-white border ${
          expired ? 'opacity-65 hover:border-gray-300' : 'border-gray-100 hover:border-purple-300'
        } rounded-2xl cursor-pointer transition-all duration-300 ease-out hover:shadow-md hover:translate-x-1 overflow-hidden`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Left Border Highlight on Hover */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-r-sm" />

        {/* Category Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: expired ? "rgba(148, 163, 184, 0.1)" : `${catMeta.color}15`,
            color: expired ? "#94a3b8" : catMeta.color,
          }}
        >
          <IconComponent size={22} strokeWidth={1.8} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug line-clamp-2 group-hover:text-purple-800 transition-colors">
            {scheme.title}
          </h3>
          
          <div className="flex flex-wrap gap-3 mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <MapPin size={12} />
              {scheme.state || 'All States'}
            </span>
            {scheme.ministry && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 truncate max-w-[200px]">
                <Building2 size={12} className="shrink-0" />
                <span className="truncate">{scheme.ministry}</span>
              </span>
            )}
          </div>

          {/* Status line */}
          <div className="flex items-center gap-2 flex-wrap">
            {expired ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-100 uppercase tracking-wider">
                <X size={10} /> Expired
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">
                <Check size={10} /> Active
              </span>
            )}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
              {scheme.category.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Right side — Grant amount */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0 sm:min-w-[100px] gap-1">
          <div className="flex flex-col sm:items-end">
            <span className="font-outfit text-sm font-extrabold text-purple-800 whitespace-nowrap">
              ₹{(scheme.subsidyAmount || scheme.grantAmount || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
              {scheme.installmentCount ? `${scheme.installmentCount} Installments` : 'Direct Grant'}
            </span>
          </div>
          
          <div className="hidden sm:flex text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all">
            <ChevronRight size={18} />
          </div>
        </div>
      </article>
    </Link>
  );
};
