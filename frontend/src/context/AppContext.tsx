import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, Scheme, Application, Installment, Notification, SystemStats, ApplicationStatus } from '../types';
import { INITIAL_SCHEMES, DEFAULT_CITIZEN, INITIAL_APPLICATIONS, INITIAL_INSTALLMENTS, INITIAL_NOTIFICATIONS, SYSTEM_STATS } from '../data/dummyData';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  citizenProfile: UserProfile;
  setCitizenProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  schemes: Scheme[];
  applications: Application[];
  installments: Installment[];
  notifications: Notification[];
  stats: SystemStats;
  applyToScheme: (
    schemeId: string, 
    personalDetails: Application['personalDetails'], 
    bankDetails: Application['bankDetails'], 
    files: { name: string; type: string }[]
  ) => string; // Returns application ID
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
  clearAllNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [citizenProfile, setCitizenProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('gov_citizen_profile');
    return saved ? JSON.parse(saved) : DEFAULT_CITIZEN;
  });
  
  const [schemes, setSchemes] = useState<Scheme[]>(() => {
    const saved = localStorage.getItem('gov_schemes');
    return saved ? JSON.parse(saved) : INITIAL_SCHEMES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('gov_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [installments, setInstallments] = useState<Installment[]>(() => {
    const saved = localStorage.getItem('gov_installments');
    return saved ? JSON.parse(saved) : INITIAL_INSTALLMENTS;
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
    try {
      localStorage.setItem('gov_schemes', JSON.stringify(schemes));
    } catch (e) {
      console.warn('Could not save schemes to localStorage (quota exceeded)', e);
    }
  }, [schemes]);

  // Fetch real schemes from the live Render backend API on mount
  useEffect(() => {
    fetch('https://infosys-springboard-7-0.onrender.com/api/subsidies?limit=100')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mappedSchemes = data.map((d: any) => {
            // Try to extract a numeric amount from grantAmount string, fallback to 5000
            let parsedAmount = 5000;
            if (typeof d.grantAmount === 'string') {
              const numMatch = d.grantAmount.match(/[\d.]+/);
              if (numMatch) {
                parsedAmount = parseFloat(numMatch[0]);
                if (d.grantAmount.toLowerCase().includes('lakh')) {
                  parsedAmount *= 100000;
                } else if (d.grantAmount.toLowerCase().includes('crore')) {
                  parsedAmount *= 10000000;
                }
              }
            } else if (typeof d.grantAmount === 'number') {
              parsedAmount = d.grantAmount;
            }

            return {
              id: d.id,
              title: d.title,
              department: d.ministry || 'Government',
              ministry: d.ministry || 'Various Ministries',
              category: (d.category || 'social_welfare').toLowerCase().replace(' & ', '_'),
              description: d.details || d.description || '',
              benefits: d.benefits || 'Financial assistance via DBT',
              eligibilityCriteria: typeof d.eligibilityCriteria === 'string' ? d.eligibilityCriteria.split('\n') : ['Citizen of India', 'Meets category requirements'],
              requiredDocuments: Array.isArray(d.documentsRequired) && d.documentsRequired.length > 0 ? d.documentsRequired : ['Aadhaar Card', 'Bank Passbook'],
              financialYear: '2026-27',
              totalAllocation: 50000000,
              disbursedAmount: 0,
              subsidyAmount: parsedAmount,
              installmentCount: d.installmentCount || 1
            };
          });
          setSchemes(mappedSchemes);
        }
      })
      .catch(err => console.error('Failed to fetch real schemes:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('gov_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('gov_installments', JSON.stringify(installments));
  }, [installments]);

  useEffect(() => {
    localStorage.setItem('gov_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Recalculate stats whenever lists change
  useEffect(() => {
    const activeSchemes = schemes.length;
    const totalApps = applications.length;
    
    // Total disbursed is the sum of all disbursed installments
    const totalDisbursed = installments
      .filter(inst => inst.status === 'disbursed')
      .reduce((sum, inst) => sum + inst.amount, 0);

    // Dynamic stats update
    setStats({
      totalRegisteredCitizens: 124050, // Base hardcoded
      totalSchemesActive: activeSchemes,
      totalApplicationsReceived: totalApps,
      totalSanctionedAmount: 485000000 + (applications.filter(a => a.status === 'disbursing' || a.status === 'completed').length * 40000),
      totalDisbursedAmount: 382000000 + totalDisbursed,
    });
  }, [schemes, applications, installments]);

  // Create notification helper
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

  // 1. Citizen applies for a scheme
  const applyToScheme = (
    schemeId: string, 
    personalDetails: Application['personalDetails'], 
    bankDetails: Application['bankDetails'], 
    files: { name: string; type: string }[]
  ): string => {
    const scheme = schemes.find(s => s.id === schemeId);
    const appId = `APP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp: Application = {
      id: appId,
      schemeId,
      schemeTitle: scheme ? scheme.title : 'Government Scheme',
      citizenId: citizenProfile.id,
      citizenName: citizenProfile.name,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'submitted',
      currentStep: 1,
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

    setApplications(prev => [newApp, ...prev]);
    
    triggerNotification(
      citizenProfile.id,
      'Application Submitted Successfully',
      `Your application for ${scheme?.title} has been received with reference ID ${appId}. Verification is underway.`,
      'info'
    );

    return appId;
  };

  // 2. Verification Officer action
  const verifyApplication = (
    appId: string, 
    comment: string, 
    status: 'documents_verified' | 'rejected_by_verifier',
    docApprovals: { id: string; status: 'verified' | 'rejected'; comment?: string }[]
  ) => {
    setApplications(prev => 
      prev.map(app => {
        if (app.id === appId) {
          const updatedDocs = app.documents.map(doc => {
            const approval = docApprovals.find(da => da.id === doc.id);
            if (approval) {
              return { ...doc, status: approval.status, comment: approval.comment };
            }
            return doc;
          });

          return {
            ...app,
            status,
            currentStep: status === 'documents_verified' ? 2 : 1,
            documents: updatedDocs,
            verifierComment: comment
          };
        }
        return app;
      })
    );

    const app = applications.find(a => a.id === appId);
    if (app) {
      if (status === 'documents_verified') {
        triggerNotification(
          app.citizenId,
          'Documents Verified',
          `Congratulations! The Verification Officer has verified all submitted documents for application ID ${appId}. It is forwarded to the District Officer for sanctioning.`,
          'success'
        );
      } else {
        triggerNotification(
          app.citizenId,
          'Application Clarification Required / Rejected',
          `Your application ${appId} was rejected during document verification. Reason: ${comment}. Please update and resubmit.`,
          'error'
        );
      }
    }
  };

  // 3. District Officer action
  const approveApplication = (
    appId: string, 
    comment: string, 
    approved: boolean
  ) => {
    const status: ApplicationStatus = approved ? 'disbursing' : 'rejected_by_district';
    
    setApplications(prev => 
      prev.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            status,
            currentStep: approved ? 3 : 2,
            districtOfficerComment: comment
          };
        }
        return app;
      })
    );

    const app = applications.find(a => a.id === appId);
    if (app) {
      if (approved) {
        const scheme = schemes.find(s => s.id === app.schemeId);
        
        // Generate installments automatically when approved
        if (scheme) {
          const instCount = scheme.installmentCount || 1;
          const instAmount = Math.round(scheme.subsidyAmount / instCount);
          const newInsts: Installment[] = [];
          
          for (let i = 1; i <= instCount; i++) {
            const dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + (i * 3)); // schedule every 3 months
            
            newInsts.push({
              id: `INST-${Math.floor(100000 + Math.random() * 900000)}`,
              applicationId: appId,
              schemeTitle: scheme.title,
              installmentNumber: i,
              amount: instAmount,
              dueDate: dueDate.toISOString().split('T')[0],
              status: i === 1 ? 'processing' : 'pending' // first is immediately processing
            });
          }
          
          setInstallments(prev => [...prev, ...newInsts]);
        }

        triggerNotification(
          app.citizenId,
          'Scheme Sanctioned & Approved',
          `Outstanding! Your application ${appId} has been sanctioned by the District Officer. Direct Benefit Transfer (DBT) has been scheduled.`,
          'success'
        );
      } else {
        triggerNotification(
          app.citizenId,
          'Application Sanction Denied',
          `Your application ${appId} was not approved by the District Officer. Reason: ${comment}.`,
          'error'
        );
      }
    }
  };

  // 4. Release / Disburse Installment
  const releaseInstallment = (installmentId: string) => {
    let appUserId = '';
    let appTitle = '';
    let installmentNum = 1;
    let amt = 0;
    let appId = '';

    setInstallments(prev => 
      prev.map(inst => {
        if (inst.id === installmentId) {
          appId = inst.applicationId;
          const app = applications.find(a => a.id === inst.applicationId);
          appUserId = app?.citizenId || citizenProfile.id;
          appTitle = inst.schemeTitle;
          installmentNum = inst.installmentNumber;
          amt = inst.amount;

          return {
            ...inst,
            status: 'disbursed',
            disbursementDate: new Date().toISOString().split('T')[0],
            transactionId: `TXN${Math.floor(100000000000 + Math.random() * 900000000000)}A`
          };
        }
        return inst;
      })
    );

    // After disbursement, if all installments for this application are disbursed, mark application as completed
    setTimeout(() => {
      setInstallments(currentInsts => {
        const appInsts = currentInsts.filter(i => i.applicationId === appId);
        const allCompleted = appInsts.every(i => i.status === 'disbursed');
        if (allCompleted && appInsts.length > 0) {
          setApplications(currentApps => 
            currentApps.map(a => a.id === appId ? { ...a, status: 'completed', currentStep: 4 } : a)
          );
        }
        return currentInsts;
      });
    }, 100);

    if (appUserId) {
      triggerNotification(
        appUserId,
        'Direct Benefit Transfer (DBT) Completed',
        `Disbursed: Installment #${installmentNum} of ₹${amt.toLocaleString('en-IN')} for ${appTitle} has been successfully transferred via DBT.`,
        'success'
      );
    }
  };

  // 5. Admin adds a new scheme
  const addNewScheme = (scheme: Omit<Scheme, 'id' | 'disbursedAmount'>) => {
    const newId = `SCH-0${schemes.length + 1}`;
    const newS: Scheme = {
      ...scheme,
      id: newId,
      disbursedAmount: 0
    };
    setSchemes(prev => [...prev, newS]);

    // Notify all citizens (mock by adding notification to dashboard)
    triggerNotification(
      citizenProfile.id,
      'New Scheme Launched!',
      `Department has announced: "${scheme.title}". Check eligibility and apply now!`,
      'info'
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(not => not.id === id ? { ...not, isRead: true } : not)
    );
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(not => ({ ...not, isRead: true })));
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRole,
      citizenProfile,
      setCitizenProfile,
      schemes,
      applications,
      installments,
      notifications,
      stats,
      applyToScheme,
      verifyApplication,
      approveApplication,
      releaseInstallment,
      addNewScheme,
      markNotificationRead,
      clearAllNotifications
    }}>
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
