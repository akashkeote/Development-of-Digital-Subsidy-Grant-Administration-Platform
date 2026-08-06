import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, Compass, Sprout, GraduationCap, Sun, Home, HeartPulse, ChevronDown } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { SchemeCard } from '../components/SchemeCard';

interface Option {
  value: string;
  label: string;
}

const CustomSelect = ({ value, onChange, options, className }: { value: string, onChange: (val: string) => void, options: Option[], className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 bg-white border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-semibold text-slate-600 transition-colors shadow-sm outline-none focus:ring-2 focus:ring-blue-100"
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown size={14} className="text-slate-400 ml-2 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-slate-50 ${
                  value === opt.value ? 'bg-blue-50/50 text-blue-600 font-bold' : 'text-slate-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const SchemeListingPage: React.FC = () => {
  const { schemes } = useApp();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('all');

  // Load query params on mount
  useEffect(() => {
    const q = searchParams.get('search');
    const cat = searchParams.get('category');
    if (q) setSearchQuery(q);
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'education', label: 'Education' },
    { value: 'energy', label: 'Green Energy' },
    { value: 'housing', label: 'Housing' },
    { value: 'healthcare', label: 'Healthcare & Insurance' },
  ];

  const ministryOptions = [
    { value: 'all', label: 'All Ministries' },
    { value: 'Ministry of Agriculture and Farmers Welfare', label: 'Ministry of Agriculture and Farmers Welfare' },
    { value: 'Ministry of New and Renewable Energy', label: 'Ministry of New and Renewable Energy' },
    { value: 'Ministry of Education', label: 'Ministry of Education' },
    { value: 'Ministry of Rural Development', label: 'Ministry of Rural Development' },
    { value: 'Ministry of Health and Family Welfare', label: 'Ministry of Health and Family Welfare' }
  ];

  // Filtering logic
  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = 
      (scheme.title || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      (scheme.description || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      (scheme.id || '').toString().toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    const matchesMinistry = selectedMinistry === 'all' || scheme.ministry === selectedMinistry;

    return matchesSearch && matchesCategory && matchesMinistry;
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6" id="scheme_listing_page_root">
        
        {/* Horizontal Filter Toolbar & Search */}
        <div className="space-y-4 pt-4">
          
          {/* Search Input */}
          <div className="relative bg-white border border-slate-200 rounded-xl overflow-hidden flex items-center shadow-sm focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
            <Search className="absolute left-4 text-slate-400 w-4 h-4 z-10 pointer-events-none" />
            <input
              type="text"
              placeholder="Search schemes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-transparent border-none text-sm font-medium focus:outline-none placeholder:text-slate-400 text-slate-800"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex gap-3 w-full sm:w-auto">
              <CustomSelect 
                value={selectedCategory} 
                onChange={setSelectedCategory} 
                options={categoryOptions}
                className="w-full sm:w-44 z-30"
              />
              <CustomSelect 
                value={selectedMinistry} 
                onChange={setSelectedMinistry} 
                options={ministryOptions}
                className="w-full sm:w-56 z-20"
              />
            </div>
            
            <div className="text-xs text-slate-400 font-medium">
              Showing {filteredSchemes.slice(0, 50).length} of {filteredSchemes.length} schemes
            </div>
          </div>
        </div>

        {/* Schemes List */}
        <div className="space-y-4 relative z-10">
          {filteredSchemes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-sm font-medium">No matching schemes found.</p>
            </div>
          ) : (
            filteredSchemes.slice(0, 50).map((scheme, idx) => (
              <SchemeCard key={scheme.id} scheme={scheme} index={idx} />
            ))
          )}
        </div>
        
        {/* Pagination Reference */}
        {filteredSchemes.length > 50 && (
          <div className="flex justify-center items-center gap-2 pt-6 pb-12 relative z-10">
            <button className="px-3 py-1.5 text-xs font-medium text-slate-400 border border-transparent hover:border-slate-200 rounded-md transition-colors">Prev.</button>
            <button className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white bg-blue-600 rounded-md shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-50 border border-transparent rounded-md transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-50 border border-transparent rounded-md transition-colors">3</button>
            <button className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-md shadow-sm transition-colors">Next</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
