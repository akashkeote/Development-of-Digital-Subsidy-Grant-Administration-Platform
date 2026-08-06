import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, Compass, Sprout, GraduationCap, Sun, Home, HeartPulse, ChevronDown } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { SchemeCard } from '../components/SchemeCard';
import { SchemeModal } from '../components/SchemeModal';
import { Scheme } from '../types';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('all');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedMinistry]);

  // Extract unique categories and ministries from the data
  const uniqueCategories = Array.from(new Set(schemes.map(s => s.category).filter(Boolean))) as string[];
  const uniqueMinistries = Array.from(new Set(schemes.map(s => s.ministry).filter(Boolean))) as string[];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...uniqueCategories.map(c => ({ value: c, label: c.replace(/_/g, ' ') }))
  ];

  const ministryOptions = [
    { value: 'all', label: 'All Ministries' },
    ...uniqueMinistries.map(m => ({ value: m, label: m }))
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

  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSchemes = filteredSchemes.slice(startIndex, startIndex + itemsPerPage);

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
            
            <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSchemes.length)} of {filteredSchemes.length} schemes
            </div>
          </div>
        </div>

        {/* Schemes List */}
        <div className="space-y-4 relative z-10">
          {paginatedSchemes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-sm font-medium">No matching schemes found.</p>
            </div>
          ) : (
            paginatedSchemes.map((scheme, idx) => (
              <SchemeCard 
                key={scheme.id} 
                scheme={scheme} 
                index={idx} 
                onClick={() => setSelectedScheme(scheme)} 
              />
            ))
          )}
        </div>
        
        {/* Scheme Modal Overlay */}
        <SchemeModal 
          scheme={selectedScheme} 
          onClose={() => setSelectedScheme(null)} 
          onApply={() => {
            if (selectedScheme) navigate(`/schemes/${selectedScheme.id}/apply`);
          }}
        />
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6 pb-12 relative z-10">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-medium text-slate-500 border border-transparent hover:border-slate-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev.
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="text-slate-400 text-xs">...</span>
                  )}
                  <button 
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-md transition-colors ${
                      currentPage === page 
                        ? 'text-white bg-blue-600 shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
