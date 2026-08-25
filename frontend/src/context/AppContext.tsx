import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, Scheme, Application, Installment, Notification, SystemStats, SystemUser } from '../types';
import { DEFAULT_CITIZEN, INITIAL_NOTIFICATIONS, SYSTEM_STATS } from '../data/dummyData';
import { 
  useSchemes, 
  useApplications, 
  useInstallments, 
  useSubmitApplication, 
  useVerifyApplication, 
  useApproveApplication, 
  useReleaseFunds,
  useCreateScheme,
  useUsers,
  useUpdateUserStatus
} from '../hooks/useApi';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  citizenProfile: UserProfile;
  setCitizenProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  schemes: Scheme[];
  applications: Application[];
  installments: Installment[];
  notifications: Notification[];
  users: SystemUser[];
  stats: SystemStats;
  applyToScheme: (
    schemeId: string, 
    personalDetails: Application['personalDetails'], 
    bankDetails: Application['bankDetails'], 
    files: { name: string; type: string }[]
  ) => Promise<string>;
  verifyApplication: (
    appId: string, 
    comment: string, 
    status: 'documents_verified' | 'rejected_by_verifier',
    docApprovals: { id: string; status: 'verified' | 'rejected'; comment?: string }[]
  ) => void;
  approveApplication: (
    appId: string, 
    comment: string, 
    approved: boolean
  ) => void;
  releaseInstallment: (installmentId: string) => void;
  addNewScheme: (scheme: Omit<Scheme, 'id' | 'disbursedAmount'>) => void;
  markNotificationRead: (id: string) => void;
  createScheme: (scheme: Omit<Scheme, 'id' | 'disbursedAmount'>) => void;
  updateUserStatus: (userId: string, status: SystemUser['status'], role?: SystemUser['role']) => void;
  clearAllNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('gov_auth_role');
    return (savedRole as UserRole) || 'citizen';
  });
  
  useEffect(() => {
    localStorage.setItem('gov_auth_role', currentRole);
  }, [currentRole]);

  const [citizenProfile, setCitizenProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('gov_citizen_profile');
    return saved ? JSON.parse(saved) : DEFAULT_CITIZEN;
  });
  
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('gov_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [stats, setStats] = useState<SystemStats>(SYSTEM_STATS);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gov_citizen_profile', JSON.stringify(citizenProfile));
  }, [citizenProfile]);

  useEffect(() => {
    localStorage.setItem('gov_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // --- API HOOKS INTEGRATION ---
  const { data: schemes = [] } = useSchemes();
  const { data: applications = [] } = useApplications();
  const { data: installments = [] } = useInstallments();
  const { data: users = [] } = useUsers();

  const submitAppMutation = useSubmitApplication();
  const verifyAppMutation = useVerifyApplication();
  const approveAppMutation = useApproveApplication();
  const releaseFundsMutation = useReleaseFunds();
  const createSchemeMutation = useCreateScheme();
  const updateUserStatusMutation = useUpdateUserStatus();

  // Recalculate stats whenever lists change
  useEffect(() => {
    const activeSchemes = schemes.length;
    const totalApps = applications.length;
    
    // Total disbursed is the sum of all disbursed installments
    const totalDisbursed = installments
      .filter(inst => inst.status === 'disbursed')
      .reduce((sum, inst) => sum + inst.amount, 0);

    setStats({
      totalRegisteredCitizens: 124050,
      totalSchemesActive: activeSchemes,
      totalApplicationsReceived: totalApps,
      totalSanctionedAmount: 485000000 + (applications.filter(a => a.status === 'disbursing' || a.status === 'completed').length * 40000),
      totalDisbursedAmount: 382000000 + totalDisbursed,
    });
  }, [schemes, applications, installments]);

  const triggerNotification = (userId: string, title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: `NOT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      title,
      message,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const applyToScheme = async (
    schemeId: string, 
    personalDetails: Application['personalDetails'], 
    bankDetails: Application['bankDetails'], 
    files: { name: string; type: string }[]
  ): Promise<string> => {
    const scheme = schemes.find(s => s.id === schemeId);
    
    const newApp: Partial<Application> = {
      schemeId,
      schemeTitle: scheme ? scheme.title : 'Government Scheme',
      citizenId: citizenProfile.id,
      citizenName: citizenProfile.name,
      submittedByRole: currentRole === 'vle' ? 'vle' : 'citizen',
      personalDetails,
      bankDetails,
      documents: files.map((f, idx) => ({
        id: `doc-${Date.now()}-${idx}`,
        name: f.name,
        type: f.type,
        url: '#',
        status: 'pending'
      }))
    };

    const result = await submitAppMutation.mutateAsync(newApp);
    
    triggerNotification(
      citizenProfile.id,
      'Application Submitted Successfully',
      `Your application for ${scheme?.title} has been received. Verification is underway.`,
      'info'
    );

    return result.id;
  };

  const verifyApplication = (
    appId: string, 
    comment: string, 
    status: 'documents_verified' | 'rejected_by_verifier',
    docApprovals: { id: string; status: 'verified' | 'rejected'; comment?: string }[],
    officerName?: string
  ) => {
    verifyAppMutation.mutate({ appId, status, remarks: comment, docApprovals, officerName: officerName || 'Rajesh Kumar (Field Officer)' }, {
      onSuccess: () => {
        const app = applications.find(a => a.id === appId);
        if (app && status === 'documents_verified') {
          triggerNotification(
            app.citizenId,
            'Documents Verified',
            `Your documents for application ${appId} have been verified. Pending final administrative approval.`,
            'success'
          );
        } else if (app && status === 'rejected_by_verifier') {
          // Compile a detailed list of which specific documents failed and why
          const rejectedDocs = docApprovals.filter(d => d.status === 'rejected');
          let docMessage = '';
          if (rejectedDocs.length > 0) {
             const docNames = rejectedDocs.map(d => {
                const actualDoc = app.documents.find(ad => ad.id === d.id);
                const docName = actualDoc ? actualDoc.type : 'Document';
                const reason = d.comment ? ` (Reason: ${d.comment})` : '';
                return `${docName}${reason}`;
             }).join(', ');
             docMessage = ` Discrepancies found in: ${docNames}.`;
          }

          triggerNotification(
            app.citizenId,
            'Verification Failed',
            `Your application #${appId} has been rejected.${docMessage} Verifier Comment: ${comment}`,
            'error'
          );
        }
      }
    });
  };

  const approveApplication = (
    appId: string, 
    comment: string, 
    approved: boolean,
    officerName?: string
  ) => {
    const status = approved ? 'approved_by_district' : 'rejected_by_district';
    approveAppMutation.mutate({ appId, status, remarks: comment, officerName: officerName || 'Anita Sharma (District Officer)' }, {
      onSuccess: () => {
        const app = applications.find(a => a.id === appId);
        if (app && approved) {
          triggerNotification(
            app.citizenId,
            'Application Approved!',
            `Congratulations! Your application ${appId} has been approved. The first installment will be released soon.`,
            'success'
          );
        } else if (app) {
          triggerNotification(
            app.citizenId,
            'Application Rejected',
            `Unfortunately, your application ${appId} has been rejected by the administration.`,
            'warning'
          );
        }
      }
    });
  };

  const releaseInstallment = (installmentId: string, officerName?: string) => {
    releaseFundsMutation.mutate({ installmentId, officerName: officerName || 'Sanjay Verma (Finance Dept)' }, {
      onSuccess: () => {
        const inst = installments.find(i => i.id === installmentId);
        if (inst) {
          const app = applications.find(a => a.id === inst.applicationId);
          if (app) {
            triggerNotification(
              app.citizenId,
              'Funds Disbursed',
              `An amount of ₹${inst.amount.toLocaleString('en-IN')} has been disbursed for your application ${app.id}.`,
              'success'
            );
          }
        }
      }
    });
  };

  const addNewScheme = (schemeData: Omit<Scheme, 'id' | 'disbursedAmount'>) => {
    createSchemeMutation.mutate(schemeData as Partial<Scheme>, {
      onSuccess: (newScheme) => {
        triggerNotification(
          'admin',
          'New Scheme Published',
          `${newScheme.title} is now active and accepting applications.`,
          'info'
        );
      }
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateUserStatus = (userId: string, status: SystemUser['status'], role?: SystemUser['role']) => {
    updateUserStatusMutation.mutate({ userId, status, role });
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        citizenProfile,
        setCitizenProfile,
        schemes,
        applications,
        installments,
        notifications,
        users,
        stats,
        applyToScheme,
        verifyApplication,
        approveApplication,
        releaseInstallment,
        addNewScheme,
        createScheme: addNewScheme,
        markNotificationRead,
        updateUserStatus,
        clearAllNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

