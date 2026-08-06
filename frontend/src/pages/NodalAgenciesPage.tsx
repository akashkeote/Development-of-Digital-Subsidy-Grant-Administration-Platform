import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Building2, ArrowRight, ShieldCheck, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NodalAgenciesPage: React.FC = () => {
  const agencies = [
    {
      id: 'agri',
      name: 'Ministry of Agriculture and Farmers Welfare',
      description: 'Responsible for the formulation and administration of rules and regulations and laws relating to agriculture.',
      stats: { schemes: 12, budget: '₹15,000 Cr' },
      icon: <SproutIcon />,
      color: 'emerald'
    },
    {
      id: 'edu',
      name: 'Ministry of Education',
      description: 'Responsible for the implementation and formulation of policies regarding education across the nation.',
      stats: { schemes: 8, budget: '₹8,500 Cr' },
      icon: <GraduationCapIcon />,
      color: 'blue'
    },
    {
      id: 'health',
      name: 'Ministry of Health and Family Welfare',
      description: 'Administers public health policy and oversees family welfare programs and national health missions.',
      stats: { schemes: 15, budget: '₹22,000 Cr' },
      icon: <HeartPulseIcon />,
      color: 'rose'
    },
    {
      id: 'rural',
      name: 'Ministry of Rural Development',
      description: 'Focuses on the socio-economic development of rural areas through various welfare schemes and infrastructure projects.',
      stats: { schemes: 5, budget: '₹45,000 Cr' },
      icon: <HomeIcon />,
      color: 'amber'
    },
    {
      id: 'energy',
      name: 'Ministry of New and Renewable Energy',
      description: 'Nodal ministry for all matters relating to new and renewable energy focusing on sustainable development.',
      stats: { schemes: 4, budget: '₹12,000 Cr' },
      icon: <SunIcon />,
      color: 'sky'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto" id="nodal_agencies_page_root">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Landmark size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight font-heading">Nodal Agencies</h1>
              <p className="text-slate-500 font-medium">Directory of participating ministries and government departments.</p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-sm font-bold">
              <ShieldCheck size={16} /> 100% Verified Bodies
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-sm font-bold">
              <Building2 size={16} /> 24 Active Departments
            </div>
          </div>
        </div>

        {/* Agency Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agencies.map((agency) => (
            <div key={agency.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-blue-300 transition-all group flex flex-col h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border 
                  ${agency.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : ''}
                  ${agency.color === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' : ''}
                  ${agency.color === 'rose' ? 'bg-rose-50 text-rose-600 border-rose-100' : ''}
                  ${agency.color === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-100' : ''}
                  ${agency.color === 'sky' ? 'bg-sky-50 text-sky-600 border-sky-100' : ''}
                `}>
                  {agency.icon}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                    {agency.name}
                  </h3>
                </div>
              </div>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                {agency.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto border-t border-slate-100 pt-5">
                <div className="flex-1 flex gap-4 w-full">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Schemes</span>
                    <span className="font-bold text-slate-700">{agency.stats.schemes}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Budget</span>
                    <span className="font-bold text-slate-700">{agency.stats.budget}</span>
                  </div>
                </div>
                
                <Link to={`/schemes?category=${agency.id === 'agri' ? 'agriculture' : agency.id === 'edu' ? 'education' : agency.id === 'health' ? 'healthcare' : agency.id === 'rural' ? 'housing' : 'energy'}`} className="w-full sm:w-auto px-4 py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap">
                  View Schemes <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

// Extracted icons to avoid too many lucide imports at top
function SproutIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>; }
function GraduationCapIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a2 2 0 0 1-.019 3.022l-7.1 7.1a2 2 0 0 1-2.796.02L4.1 13.9a2 2 0 0 1 .02-2.822L11 4a2 2 0 0 1 2.8.02l7.62 6.902z"/><path d="M14 8.5l-4 4"/><path d="M18 12l-4 4"/></svg>; }
function HeartPulseIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>; }
function HomeIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function SunIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>; }
