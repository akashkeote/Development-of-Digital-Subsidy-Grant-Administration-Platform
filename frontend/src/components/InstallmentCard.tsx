import React from 'react';
import { Application, Installment } from '../types';
import { MapPin, User, ChevronRight } from 'lucide-react';

interface InstallmentCardProps {
  application: Application;
  installments: Installment[];
  index?: number;
  onClick?: () => void;
}

export const InstallmentCard: React.FC<InstallmentCardProps> = ({ application, installments, index = 0, onClick }) => {
  const totalAmount = installments.reduce((sum, inst) => sum + inst.amount, 0);
  const disbursedAmount = installments
    .filter(i => i.status === 'disbursed')
    .reduce((sum, inst) => sum + inst.amount, 0);
    
  const progress = totalAmount > 0 ? (disbursedAmount / totalAmount) * 100 : 0;
  
  // Mock milestones based on application status
  const milestones = [
    { name: "Bank Verification", completed: true },
    { name: "Fund Allocation", completed: ['disbursing', 'completed'].includes(application.status) },
    { name: "NPCI Mapping", completed: ['disbursing', 'completed'].includes(application.status) },
    { name: "Final Release", completed: application.status === 'completed' }
  ];
  
  const completedMilestones = milestones.filter(m => m.completed).length;

  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className="group relative flex flex-col p-5 bg-white border border-slate-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-blue-300 hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-blue-500 overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Left Border accent line on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-r-sm"></div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
        {/* Left Side: Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 font-mono tracking-wider">{application.id}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
              progress === 100 ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' :
              progress > 0 ? 'text-blue-600 bg-blue-50 border border-blue-100' :
              'text-orange-600 bg-orange-50 border border-orange-100'
            }`}>
              {progress === 100 ? 'Completed' : progress > 0 ? 'Disbursing' : 'Pending'}
            </span>
          </div>
          
          <h3 className="text-[16px] font-bold text-slate-800 mb-1.5 leading-snug line-clamp-1">
            {application.schemeTitle}
          </h3>
          
          <div className="flex items-center gap-4 text-[12px] font-medium text-slate-500 mb-4">
            <span className="inline-flex items-center gap-1.5">
              <User size={13} className="text-slate-400" />
              {application.citizenName}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} className="text-slate-400" />
              {application.personalDetails?.state || 'Verified'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[12px] font-bold text-slate-700">
                ₹{disbursedAmount.toLocaleString('en-IN')} <span className="text-slate-400 font-medium">of ₹{totalAmount.toLocaleString('en-IN')}</span>
              </span>
              <span className="text-[12px] font-bold text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right Side: Milestones & Action */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 pt-4 md:pt-0 border-t border-slate-100 md:border-t-0 md:pl-6 md:border-l">
          <div className="flex flex-col items-start md:items-end mb-0 md:mb-4">
            <div className="flex items-center gap-1 mb-1.5">
              {milestones.map((m, i) => (
                <div 
                  key={i} 
                  className={`w-2.5 h-2.5 rounded-full ${m.completed ? 'bg-emerald-500' : 'bg-slate-200'}`}
                  title={m.name}
                ></div>
              ))}
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              {completedMilestones}/{milestones.length} milestones
            </span>
          </div>
          
          <div className="flex items-center text-slate-400 group-hover:text-blue-600 transition-colors">
            <span className="text-[12px] font-bold mr-1 hidden md:block">View Details</span>
            <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </article>
  );
};
