import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, Compass, Sprout, GraduationCap, Sun, Home, HeartPulse, ShieldAlert, ArrowRight, BookOpen, SlidersHorizontal } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { SchemeCard } from '../components/SchemeCard';

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

  const categories = [
    { id: 'all', label: 'All Schemes', icon: <Compass className="w-4 h-4" /> },
    { id: 'agriculture', label: 'Agriculture', icon: <Sprout className="w-4 h-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'energy', label: 'Green Energy', icon: <Sun className="w-4 h-4" /> },
    { id: 'housing', label: 'Housing', icon: <Home className="w-4 h-4" /> },
    { id: 'healthcare', label: 'Healthcare & Insurance', icon: <HeartPulse className="w-4 h-4" /> },
  ];

  const ministries = [
    'all',
    'Ministry of Agriculture and Farmers Welfare',
    'Ministry of New and Renewable Energy',
    'Ministry of Education',
    'Ministry of Rural Development',
    'Ministry of Health and Family Welfare'
  ];

  // Filtering logic
  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = 
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    const matchesMinistry = selectedMinistry === 'all' || scheme.ministry === selectedMinistry;

    return matchesSearch && matchesCategory && matchesMinistry;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6" id="scheme_listing_page_root">
        {/* Page title header */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Discover Subsidies</h1>
            <p className="text-sm font-medium text-slate-500 mt-1 max-w-xl">Find and apply for government grants tailored to your profile.</p>
          </div>
          <div className="text-right text-xs font-bold bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl">
            {schemes.length} Active Schemes
          </div>
        </div>

        {/* Filter Toolbar & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel Sidebar Filters */}
          <div className="lg:col-span-3 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-8 h-fit">
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-100 text-slate-900 font-extrabold text-xs uppercase tracking-widest">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>Filters</span>
            </div>

            {/* Categories list */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Category</label>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => {
                  const active = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-left text-sm px-4 py-3 rounded-xl font-bold transition flex items-center space-x-3 cursor-pointer ${
                        active 
                          ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {cat.icon}
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ministry Select */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Ministry</label>
              <select
                value={selectedMinistry}
                onChange={(e) => setSelectedMinistry(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              >
                {ministries.map((min) => (
                  <option key={min} value={min} className="capitalize font-medium">
                    {min === 'all' ? 'All Ministries' : min}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Panel Main schemes list */}
          <div className="lg:col-span-9 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600/20 shadow-sm transition-all placeholder:text-slate-400 text-slate-900"
              />
            </div>

            {/* Schemes Grid */}
            {filteredSchemes.length === 0 ? (
              <div className="bg-white text-center py-16 px-6 border border-gray-200 rounded-2xl">
                <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-slate-800 font-bold text-sm">No Matching Schemes Found</h3>
                <p className="text-gray-400 text-xs mt-1">Try relaxing your search terms or checking different categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredSchemes.map((scheme, idx) => (
                  <SchemeCard key={scheme.id} scheme={scheme} index={idx} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};
