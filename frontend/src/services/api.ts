import { Scheme, Application, Installment, SystemStats, SystemUser } from '../types';
import { INITIAL_SCHEMES, INITIAL_APPLICATIONS, INITIAL_INSTALLMENTS, INITIAL_USERS } from '../data/dummyData';
import { apiClient } from './apiClient';

// --- MOCK BACKEND STORAGE UTILS ---
// These simulate a real database. The backend team will simply replace these function bodies with apiClient calls.

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getStorage = <T>(key: string, initialData: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : initialData;
};

const setStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- USER API ---
export const userService = {
  getUsers: async (): Promise<SystemUser[]> => {
    await delay(300);
    return getStorage('mock_db_users', INITIAL_USERS);
  },
  updateUserStatus: async (userId: string, status: SystemUser['status'], role?: SystemUser['role']): Promise<SystemUser> => {
    await delay(600);
    const users = getStorage('mock_db_users', INITIAL_USERS);
    const updated = users.map(u => 
      u.id === userId 
        ? { ...u, status: status, ...(role ? { role } : {}) } 
        : u
    );
    setStorage('mock_db_users', updated);
    return updated.find(u => u.id === userId)!;
  }
};

// --- RENDER BACKEND ADAPTERS FOR SCHEMES ---
const mapCategory = (cat: string): any => {
  const lower = cat?.toLowerCase() || '';
  if (lower.includes('agri')) return 'agriculture';
  if (lower.includes('edu')) return 'education';
  if (lower.includes('hous') || lower.includes('shelter')) return 'housing';
  if (lower.includes('bus') || lower.includes('msme')) return 'business';
  if (lower.includes('health')) return 'healthcare';
  return 'infrastructure';
};

const mapBackendSubsidyToScheme = (subsidy: any): Scheme => {
  return {
    id: subsidy.id || `SCH-${Math.random()}`,
    title: subsidy.title || 'Untitled Scheme',
    department: subsidy.ministry || 'General Administration',
    ministry: subsidy.ministry || 'State Ministry',
    category: mapCategory(subsidy.category),
    description: subsidy.description || '',
    benefits: subsidy.benefits || 'Financial Assistance',
    eligibilityCriteria: subsidy.eligibilityCriteria 
      ? subsidy.eligibilityCriteria.split('\n').filter((s: string) => s.trim().length > 0)
      : [],
    requiredDocuments: subsidy.documentsRequired || [],
    financialYear: '2025-26', // Mock fallback
    totalAllocation: 50000000, // Mock fallback
    disbursedAmount: 0, // Mock fallback
    subsidyAmount: subsidy.amount || 10000,
    installmentCount: 3 // Mock fallback
  };
};

const mapSchemeToBackendSubsidy = (scheme: Partial<Scheme>) => {
  return {
    title: scheme.title,
    description: scheme.description,
    amount: scheme.subsidyAmount,
    eligibilityCriteria: scheme.eligibilityCriteria ? scheme.eligibilityCriteria.join('\n') : '',
    category: scheme.category,
    ministry: scheme.department,
    documentsRequired: scheme.requiredDocuments,
    benefits: scheme.benefits,
    incomeLimit: "Not specified",
    grantAmount: "Varies",
    schemeStatus: "Active",
    active: true,
    expired: false
  };
};

// --- SCHEMES API ---
export const schemeService = {
  getAllSchemes: async (): Promise<Scheme[]> => {
    try {
      const { data } = await apiClient.get<any[]>('/subsidies?limit=1000');
      return data.map(mapBackendSubsidyToScheme);
    } catch (error) {
      console.error("Failed to fetch from Render backend, falling back to mock", error);
      return getStorage('mock_db_schemes', INITIAL_SCHEMES);
    }
  },
  
  getSchemeById: async (id: string): Promise<Scheme | null> => {
    try {
      const { data } = await apiClient.get<any>(`/subsidies/${id}`);
      return mapBackendSubsidyToScheme(data);
    } catch (error) {
      console.error("Failed to fetch by ID from Render backend", error);
      const schemes = getStorage('mock_db_schemes', INITIAL_SCHEMES);
      return schemes.find(s => s.id === id) || null;
    }
  },
  
  createScheme: async (schemeData: Partial<Scheme>): Promise<Scheme> => {
    // DO NOT USE MOCK DB. Force real backend.
    const payload = mapSchemeToBackendSubsidy(schemeData);
    const { data } = await apiClient.post<any>('/subsidies', payload);
    return mapBackendSubsidyToScheme(data);
  }
};

// --- APPLICATIONS API ---
export const applicationService = {
  submitApplication: async (applicationData: Partial<Application>): Promise<Application> => {
    // REAL IMPLEMENTATION FOR BACKEND TEAM:
    // const { data } = await apiClient.post<Application>('/applications', applicationData);
    // return data;

    await delay(1000);
    const applications = getStorage('mock_db_applications', INITIAL_APPLICATIONS);
    const newApp = {
      ...applicationData,
      id: `APP-${Date.now()}`,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    } as Application;
    
    setStorage('mock_db_applications', [newApp, ...applications]);
    return newApp;
  },
  
  getApplications: async (): Promise<Application[]> => {
    try {
      const { data } = await apiClient.get<any[]>('/applications');
      return data;
    } catch (error) {
      console.error("Backend failed, falling back to mock:", error);
      await delay(600);
      return getStorage('mock_db_applications', INITIAL_APPLICATIONS);
    }
  },
  
  verifyApplication: async (appId: string, status: string, remarks: string, docApprovals: any[], officerName?: string): Promise<Application> => {
    // REAL IMPLEMENTATION FOR BACKEND TEAM:
    // const { data } = await apiClient.put<Application>(`/applications/${appId}/verify`, { status, remarks, docApprovals, officerName });
    // return data;

    await delay(800);
    const applications = getStorage('mock_db_applications', INITIAL_APPLICATIONS);
    const updated = applications.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: status as any,
          verifierComment: remarks,
          verifierName: officerName || 'Verification Officer',
          documents: app.documents.map(doc => {
            const approval = docApprovals.find(d => d.id === doc.id);
            if (approval) {
              return { ...doc, verificationStatus: approval.status, remarks: approval.comment };
            }
            return doc;
          })
        };
      }
      return app;
    });
    setStorage('mock_db_applications', updated);
    return updated.find(a => a.id === appId)!;
  },

  approveApplication: async (appId: string, status: string, remarks: string, officerName?: string): Promise<Application> => {
    await delay(800);
    const applications = getStorage('mock_db_applications', INITIAL_APPLICATIONS);
    const updated = applications.map(app => 
      app.id === appId ? { ...app, status: status as any, districtOfficerComment: remarks, districtOfficerName: officerName || 'District Officer' } : app
    );
    setStorage('mock_db_applications', updated);

    // If approved, automatically create an installment
    if (status === 'approved_by_district') {
      const app = updated.find(a => a.id === appId)!;
      const installments = getStorage('mock_db_installments', INITIAL_INSTALLMENTS);
      const newInst: Installment = {
        id: `INST-${Date.now()}`,
        applicationId: app.id,
        schemeTitle: app.schemeTitle,
        installmentNumber: 1,
        amount: 50000, // Mock amount
        status: 'pending',
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString() // 7 days from now
      };
      setStorage('mock_db_installments', [newInst, ...installments]);
    }

    return updated.find(a => a.id === appId)!;
  }
};

// --- DISBURSEMENT API ---
export const treasuryService = {
  getInstallments: async (): Promise<Installment[]> => {
    await delay(500);
    return getStorage('mock_db_installments', INITIAL_INSTALLMENTS);
  },
  
    releaseFunds: async (installmentId: string, officerName?: string): Promise<Installment> => {
    await delay(1200);
    const installments = getStorage('mock_db_installments', INITIAL_INSTALLMENTS);
    const updated = installments.map(inst => 
      inst.id === installmentId 
        ? { ...inst, status: 'disbursed' as const, disbursementDate: new Date().toISOString(), transactionId: `TXN-${Date.now()}` } 
        : inst
    );
    setStorage('mock_db_installments', updated);
    
    // Find the target installment to get the applicationId
    const targetInst = updated.find(i => i.id === installmentId);
    if (targetInst) {
      const apps = getStorage('mock_db_applications', INITIAL_APPLICATIONS);
      
      // Check if ALL installments for this application are now disbursed
      const appInstallments = updated.filter(i => i.applicationId === targetInst.applicationId);
      const allDisbursed = appInstallments.length > 0 && appInstallments.every(i => i.status === 'disbursed');
      
      const updatedApps = apps.map((a: any) => {
        if (a.id === targetInst.applicationId) {
          return { 
            ...a, 
            financeOfficerName: officerName || 'Finance Dept',
            status: allDisbursed ? 'completed' : 'disbursing'
          };
        }
        return a;
      });
      setStorage('mock_db_applications', updatedApps);
    }
    
    return updated.find(i => i.id === installmentId)!;
  }
};
