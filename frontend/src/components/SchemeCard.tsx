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
  const expired = false;

  return (
    <Link to={`/schemes/${scheme.id}`} className="block outline-none">
      <article
        className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-[15px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug pr-4">
            {scheme.title}
          </h3>
          <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500 shrink-0 mt-0.5" />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Category Pill (Blue/Cyan style) */}
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 capitalize">
            {(scheme.category || 'General').replace(/_/g, ' ')}
          </span>
          
          {/* Status Pill (Green style) */}
          {expired ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200">
              Expired
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200">
              Active
            </span>
          )}

          {/* Amount Pill (Purple style) */}
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-fuchsia-600 bg-fuchsia-50 border border-fuchsia-200">
            ₹{(scheme.subsidyAmount || scheme.grantAmount || 0).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Secondary tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-100 flex items-center gap-1">
            <MapPin size={10} />
            {scheme.state || 'All States'}
          </span>
          {scheme.ministry && (
            <span className="px-3 py-1 rounded-full text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-100 flex items-center gap-1 truncate max-w-[250px]">
              <Building2 size={10} className="shrink-0" />
              <span className="truncate">{scheme.ministry}</span>
            </span>
          )}
        </div>
      </article>
    </Link>
  );
};
