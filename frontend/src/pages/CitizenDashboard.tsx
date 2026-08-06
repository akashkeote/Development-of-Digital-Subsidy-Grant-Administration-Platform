import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  PlusCircle, 
  TrendingUp, 
  FileText, 
  DollarSign, 
  Compass, 
  ShieldCheck, 
  Landmark, 
  ChevronRight,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { DashboardLayout } from '../components/DashboardLayout';

export const CitizenDashboard: React.FC = () => {
  const { citizenProfile, schemes, applications, installments } = useApp();
  const navigate = useNavigate();

  // Filter applications belonging to this citizen
  const citizenApps = applications.filter(app => app.citizenId === citizenProfile.id);

  // Totals calculations
  const totalApplied = citizenApps.length;
  const pendingApps = citizenApps.filter(a => ['submitted', 'documents_verified'].includes(a.status)).length;
  
  // Disbursed amount specific to this user's installments
  const userInstallments = installments.filter(inst => {
    const matchingApp = citizenApps.find(a => a.id === inst.applicationId);
    return !!matchingApp;
  });
  
  const totalDisbursed = userInstallments
    .filter(inst => inst.status === 'disbursed')
    .reduce((sum, inst) => sum + inst.amount, 0);



  const statusLabels: Record<string, string> = {
    draft: 'Draft',
    submitted: 'Submitted (Review Queue)',
    documents_verified: 'Documents Verified (Forwarded)',
    rejected_by_verifier: 'Rejected by Verifier',
    approved_by_district: 'Sanction Approved',
    rejected_by_district: 'Sanction Denied',
    disbursing: 'Active Disbursements (DBT)',
    completed: 'Disbursements Completed'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 relative min-h-screen bg-transparent" id="citizen_dashboard_root">
        <div className="relative z-10 space-y-6">
        {/* Upper Greeting Banner */}
        <div className="p-8 pastel-card rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight font-heading">Welcome back, {citizenProfile.name}</h1>
            <p className="text-sm font-medium text-slate-500">Beneficiary ID: <span className="text-slate-800 font-bold">{citizenProfile.id}</span> <span className="mx-2 text-slate-300">|</span> <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Aadhaar Verified</span></p>
          </div>
          <Link 
            to="/schemes"
            className="pastel-btn text-sm font-bold px-6 py-3 rounded-xl transition shadow-sm"
          >
            Explore Subsidies
          </Link>
        </div>

        {/* Dashboard Metrics Panel */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} className="p-8 pastel-card rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Applied</p>
            <h3 className="text-4xl font-extrabold text-gradient-blue mt-2 mb-1 font-heading">{totalApplied}</h3>
            <p className="text-xs font-medium text-slate-500">Successfully registered</p>
          </motion.div>

          <motion.div variants={itemVariants} className="p-8 pastel-card rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Awaiting Sanctions</p>
            <h3 className="text-4xl font-extrabold text-gradient-purple mt-2 mb-1 font-heading">{pendingApps}</h3>
            <p className="text-xs font-medium text-slate-500">Under verification</p>
          </motion.div>

          <motion.div variants={itemVariants} className="p-8 pastel-card rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center overflow-hidden">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest relative z-10">Funds Transferred</p>
            <h3 className="text-4xl font-extrabold text-gradient-green mt-2 mb-1 relative z-10 font-heading">₹{totalDisbursed.toLocaleString('en-IN')}</h3>
            <p className="text-xs font-medium text-slate-500 relative z-10">Credited via DBT</p>
          </motion.div>
        </motion.div>

        {/* Middle layout: Active Applications Tracker + Bank Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent application lists on left panel */}
          <div className="lg:col-span-8 p-8 pastel-card rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest font-heading">My Applications</h2>
              <Link to="/citizen/tracking" className="text-xs text-blue-600 font-bold hover:text-blue-700 transition">View All</Link>
            </div>

            {citizenApps.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500 text-sm font-medium">You haven't submitted any scheme applications yet.</p>
                <Link to="/schemes" className="pastel-btn inline-block mt-4 px-5 py-2.5 rounded-xl text-sm font-bold transition">
                  Browse Subsidies
                </Link>
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-slate-100"
              >
                {citizenApps.map((app) => (
                  <motion.div variants={itemVariants} key={app.id} className="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors font-heading">{app.schemeTitle}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-semibold bg-slate-50 px-2 py-0.5 rounded-md">#{app.id}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                        <span>Submitted: {app.appliedDate}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto justify-between">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 bg-white shadow-sm">
                        {statusLabels[app.status]}
                      </span>
                      <button 
                        onClick={() => navigate(`/citizen/tracking?id=${app.id}`)}
                        className="pastel-btn px-5 py-2.5 rounded-xl transition text-xs font-bold cursor-pointer w-full sm:w-auto"
                      >
                        Track Progress
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right sidebar bank seedings verification */}
          <div className="lg:col-span-4 space-y-8">
            {/* Quick Links box */}
            <div className="p-8 pastel-card rounded-3xl shadow-sm border border-slate-100 space-y-5">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest font-heading">Quick Links</h3>
              <div className="grid grid-cols-1 gap-3 text-sm font-bold">
                <Link to="/schemes" className="w-full py-4 px-5 bg-white border border-slate-200/60 hover:border-blue-300 hover:text-blue-600 hover:shadow-md rounded-xl transition text-slate-700 flex items-center justify-between group">
                  Browse Catalog <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/citizen/installments" className="w-full py-4 px-5 bg-white border border-slate-200/60 hover:border-blue-300 hover:text-blue-600 hover:shadow-md rounded-xl transition text-slate-700 flex items-center justify-between group">
                  Track Released Cash <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/profile" className="w-full py-4 px-5 bg-white border border-slate-200/60 hover:border-blue-300 hover:text-blue-600 hover:shadow-md rounded-xl transition text-slate-700 flex items-center justify-between group">
                  Edit Profile <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

        </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
