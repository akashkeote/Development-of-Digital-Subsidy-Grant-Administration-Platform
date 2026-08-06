import { Scheme, Application, Installment, SystemStats } from '../types';
import { INITIAL_SCHEMES, INITIAL_APPLICATIONS, INITIAL_INSTALLMENTS } from '../data/dummyData';
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

// --- SCHEMES API ---
export const schemeService = {
  getAllSchemes: async (): Promise<Scheme[]> => {
    // REAL IMPLEMENTATION FOR BACKEND TEAM:
    // const { data } = await apiClient.get<Scheme[]>('/subsidies');
    // return data;
    
    await delay(600);
    return getStorage('mock_db_schemes', INITIAL_SCHEMES);
  },
  
  getSchemeById: async (id: string): Promise<Scheme | null> => {
    await delay(300);
    const schemes = getStorage('mock_db_schemes', INITIAL_SCHEMES);
    return schemes.find(s => s.id === id) || null;
  },
  
  createScheme: async (schemeData: Partial<Scheme>): Promise<Scheme> => {
    // REAL IMPLEMENTATION FOR BACKEND TEAM:
    // const { data } = await apiClient.post<Scheme>('/subsidies', schemeData);
    // return data;

    await delay(800);
    const schemes = getStorage('mock_db_schemes', INITIAL_SCHEMES);
    const newScheme = { ...schemeData, id: `SCH-${Date.now()}` } as Scheme;
    setStorage('mock_db_schemes', [...schemes, newScheme]);
    return newScheme;
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
    await delay(600);
    return getStorage('mock_db_applications', INITIAL_APPLICATIONS);
  },
  
  verifyApplication: async (appId: string, status: string, remarks: string, docApprovals: any[]): Promise<Application> => {
    // REAL IMPLEMENTATION FOR BACKEND TEAM:
    // const { data } = await apiClient.put<Application>(`/applications/${appId}/verify`, { status, remarks, docApprovals });
    // return data;

    await delay(800);
    const applications = getStorage('mock_db_applications', INITIAL_APPLICATIONS);
    const updated = applications.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: status as any,
          verifierRemarks: remarks,
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

  approveApplication: async (appId: string, status: string, remarks: string): Promise<Application> => {
    await delay(800);
    const applications = getStorage('mock_db_applications', INITIAL_APPLICATIONS);
    const updated = applications.map(app => 
      app.id === appId ? { ...app, status: status as any, adminRemarks: remarks } : app
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
  
  releaseFunds: async (installmentId: string): Promise<Installment> => {
    // REAL IMPLEMENTATION FOR BACKEND TEAM:
    // const { data } = await apiClient.post<Installment>(`/installments/${installmentId}/release`);
    // return data;

    await delay(1200);
    const installments = getStorage('mock_db_installments', INITIAL_INSTALLMENTS);
    const updated = installments.map(inst => 
      inst.id === installmentId 
        ? { ...inst, status: 'disbursed' as const, processedDate: new Date().toISOString(), transactionRef: `TXN-${Date.now()}` } 
        : inst
    );
    setStorage('mock_db_installments', updated);
    return updated.find(i => i.id === installmentId)!;
  }
};
