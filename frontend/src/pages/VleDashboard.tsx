import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  PlusCircle, 
  TrendingUp, 
  FileText, 
  DollarSign, 
  Wallet,
  Users,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { DashboardLayout } from '../components/DashboardLayout';

export const VleDashboard: React.FC = () => {
  const { currentRole, applications } = useApp();
  const navigate = useNavigate();

  // We pretend the latest 5 applications in the system were assisted by this VLE for demo purposes
  const assistedApps = applications.filter(app => app.submittedByRole === 'vle');
  
  const totalAssisted = assistedApps.length > 0 ? assistedApps.length : 124; // Fallback to 124 for demo if empty
  const cashbackPerApp = 50; // ₹50 per successful application
  const totalEarned = totalAssisted * cashbackPerApp;
  const pendingPayout = 1250;
  const recentAssistedApps = assistedApps.slice(0, 5);

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
      <div className="space-y-6 relative min-h-screen bg-transparent">
        <div className="relative z-10 space-y-6">
        
        {/* Upper Greeting Banner */}
        <div className="p-8 pastel-card rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight font-heading">Welcome back, VLE Partner</h1>
            <p className="text-sm font-medium text-slate-500">CSC ID: <span className="text-slate-800 font-bold">VLE-9901-UP</span> <span className="mx-2 text-slate-300">|</span> <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Authorized Seva Kendra</span></p>
          </div>
          <Link 
            to="/schemes"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition shadow-sm flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> New Beneficiary Application
          </Link>
        </div>

        {/* Dashboard Metrics Panel */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <motion.div variants={itemVariants} className="p-6 pastel-card rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-16 h-16 text-indigo-600" /></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest relative z-10">Citizens Assisted</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-2 mb-1 font-heading relative z-10">{totalAssisted}</h3>
            <p className="text-xs font-medium text-emerald-500 flex items-center gap-1 relative z-10"><TrendingUp className="w-3 h-3" /> +12 this week</p>
          </motion.div>

          <motion.div variants={itemVariants} className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-md border border-indigo-400 flex flex-col justify-center relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 p-4 opacity-20"><Wallet className="w-16 h-16 text-white" /></div>
            <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest relative z-10">Total Commission Earned</p>
            <h3 className="text-3xl font-extrabold text-white mt-2 mb-1 font-heading relative z-10">₹{totalEarned.toLocaleString('en-IN')}</h3>
            <p className="text-xs font-medium text-indigo-100 relative z-10">₹50 per successful submission</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="p-6 pastel-card rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pending Payout</p>
            <h3 className="text-3xl font-extrabold text-amber-500 mt-2 mb-1 font-heading">₹{pendingPayout.toLocaleString('en-IN')}</h3>
            <p className="text-xs font-medium text-slate-500">To be credited on 1st of month</p>
          </motion.div>

          <motion.div variants={itemVariants} className="p-6 pastel-card rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Services</p>
             <h3 className="text-3xl font-extrabold text-slate-800 mt-2 mb-1 font-heading">8</h3>
             <p className="text-xs font-medium text-blue-500 hover:underline cursor-pointer flex items-center gap-1">View available schemes <ArrowUpRight className="w-3 h-3" /></p>
          </motion.div>
        </motion.div>

        {/* Recent Applications Section */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Recent Assisted Applications</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Track the status of applications you filed for citizens.</p>
            </div>
            <button onClick={() => navigate('/vle/ledger')} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
              View All History
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-400 uppercase font-bold border-b border-slate-100 bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">Citizen Name</th>
                  <th className="px-6 py-4">Application ID</th>
                  <th className="px-6 py-4">Scheme</th>
                  <th className="px-6 py-4">Applied On</th>`n                  <th className="px-6 py-4">Applied On</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right rounded-tr-xl">Commission</th>
                </tr>
              </thead>
              <tbody>
                {recentAssistedApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="w-8 h-8 opacity-50" />
                        No applications submitted yet.
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentAssistedApps.map((app, index) => (
                    <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{app.citizenName}</td>
                      <td className="px-6 py-4 font-mono text-xs">{app.id}</td>
                      <td className="px-6 py-4 font-medium max-w-[200px] truncate" title={app.schemeTitle}>{app.schemeTitle}</td>
                      <td className="px-6 py-4 font-medium text-slate-500 whitespace-nowrap">{new Date(app.appliedDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                      <td className="px-6 py-4">
                         <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold whitespace-nowrap">
                            Submitted
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">
                         +₹50
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        </div>
      </div>
    </DashboardLayout>
  );
};

