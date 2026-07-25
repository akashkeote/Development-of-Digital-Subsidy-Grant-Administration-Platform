import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle2, ShieldAlert, Info, AlertTriangle, Check, Trash2 } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, clearAllNotifications } = useApp();

  const typeIcons: Record<string, React.ReactNode> = {
    success: <CheckCircle2 className="w-5 h-5 text-white" />,
    info: <Info className="w-5 h-5 text-white" />,
    warning: <AlertTriangle className="w-5 h-5 text-white" />,
    error: <ShieldAlert className="w-5 h-5 text-white" />
  };

  const typeGradients: Record<string, string> = {
    success: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-purple-500/30',
    info: 'bg-gradient-to-br from-blue-500 to-cyan-400 shadow-blue-500/30',
    warning: 'bg-gradient-to-br from-orange-400 to-rose-400 shadow-orange-500/30',
    error: 'bg-gradient-to-br from-red-500 to-pink-600 shadow-red-500/30'
  };

  return (
    <DashboardLayout>
      <div className="space-y-6" id="notifications_page_root">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Notifications & Alerts</h1>
            <p className="text-xs text-gray-500 mt-1">Review system logs, DBT credits announcements, and official review messages.</p>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button 
              onClick={clearAllNotifications}
              className="text-xs font-bold text-purple-800 hover:text-purple-900 border border-purple-200 px-3.5 py-2 bg-purple-50/50 hover:bg-purple-50 rounded-xl transition flex items-center space-x-1 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        {/* Notifications Grid */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-gray-100 pb-3 flex items-center">
            <Bell className="w-4.5 h-4.5 mr-2 text-purple-800" /> Inbox Notification Logs ({notifications.length})
          </h2>

          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-xs">No notifications in your inbox.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((not) => (
                <div 
                  key={not.id}
                  className={`p-4 border bg-white rounded-2xl transition-all duration-300 flex justify-between items-start gap-4 ${
                    !not.isRead ? 'border-gray-200 shadow-md shadow-gray-200/50 hover:scale-[1.01]' : 'border-gray-100 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <div className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 shadow-md ${typeGradients[not.type] || typeGradients.info}`}>
                      {typeIcons[not.type] || typeIcons.info}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{not.title}</h4>
                        {!not.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        {not.message}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium font-mono">{not.timestamp}</p>
                    </div>
                  </div>

                  {!not.isRead && (
                    <button 
                      onClick={() => markNotificationRead(not.id)}
                      className="p-1.5 hover:bg-white text-gray-400 hover:text-purple-800 rounded-lg transition border border-transparent hover:border-gray-100 shadow-xs flex-shrink-0"
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
