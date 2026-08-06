import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle2, ShieldAlert, Info, AlertTriangle, Check, Trash2 } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, clearAllNotifications } = useApp();

  const typeIcons: Record<string, React.ReactNode> = {
    success: <CheckCircle2 className="w-6 h-6 text-white" />,
    info: <Info className="w-6 h-6 text-white" />,
    warning: <AlertTriangle className="w-6 h-6 text-white" />,
    error: <ShieldAlert className="w-6 h-6 text-white" />
  };

  const typeGlows: Record<string, string> = {
    success: 'shadow-[inset_4px_0_0_#138808] bg-gradient-to-r from-[#138808]/10 to-transparent',
    info: 'shadow-[inset_4px_0_0_#4F46E5] bg-gradient-to-r from-[#4F46E5]/10 to-transparent',
    warning: 'shadow-[inset_4px_0_0_#FF9933] bg-gradient-to-r from-[#FF9933]/10 to-transparent',
    error: 'shadow-[inset_4px_0_0_#F43F5E] bg-gradient-to-r from-rose-500/10 to-transparent'
  };

  const iconGradients: Record<string, string> = {
    success: 'bg-gradient-to-br from-[#138808] to-emerald-600 shadow-lg shadow-[#138808]/30',
    info: 'bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] shadow-lg shadow-[#4F46E5]/30',
    warning: 'bg-gradient-to-br from-[#FF9933] to-amber-500 shadow-lg shadow-[#FF9933]/30',
    error: 'bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg shadow-rose-500/30'
  };

  return (
    <DashboardLayout>
      <div className="space-y-8" id="notifications_page_root">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center gap-6 flex-wrap relative overflow-hidden">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Notifications & Alerts</h1>
            <p className="text-sm text-slate-500 mt-2">Review system logs, DBT credits announcements, and official review messages.</p>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button 
              onClick={clearAllNotifications}
              className="text-sm font-bold text-[#00599f] bg-blue-50 hover:bg-blue-100 border border-[#00599f]/20 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        {/* Notifications Grid */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 relative overflow-hidden">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center">
            <Bell className="w-4 h-4 mr-2 text-[#00599f]" /> Inbox Notification Logs ({notifications.length})
          </h2>

          {notifications.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm font-medium">No notifications in your inbox.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((not) => (
                <div 
                  key={not.id}
                  className={`p-6 rounded-xl transition-all duration-200 flex justify-between items-start gap-6 border ${
                    !not.isRead ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex gap-4 items-start w-full">
                    <div className={`p-2.5 rounded-lg flex-shrink-0 mt-0.5 ${
                      not.type === 'success' ? 'bg-green-100 text-[#198754]' :
                      not.type === 'error' ? 'bg-red-100 text-red-600' :
                      not.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {typeIcons[not.type] || typeIcons.info}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-sm font-bold text-slate-800">{not.title}</h4>
                        {!not.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#00599f]"></span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {not.message}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pt-1">{not.timestamp}</p>
                    </div>
                  </div>

                  {!not.isRead && (
                    <button 
                      onClick={() => markNotificationRead(not.id)}
                      className="p-2.5 bg-white hover:bg-blue-50 text-slate-400 hover:text-[#00599f] rounded-lg transition-colors border border-slate-200 hover:border-[#00599f]/30 flex-shrink-0 cursor-pointer shadow-sm"
                      title="Mark as Read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};
