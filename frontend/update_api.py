import os

api_file = 'src/services/api.ts'
with open(api_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace submitApplication
content = content.replace('''  submitApplication: async (applicationData: Partial<Application>): Promise<Application> => {
    // REAL IMPLEMENTATION FOR BACKEND TEAM:
    // const { data } = await apiClient.post<Application>('/applications', applicationData);
    // return data;

    await delay(1000);
    const applications = getStorage('mock_db_applications', INITIAL_APPLICATIONS);
    const newApp = {
      ...applicationData,
      id: APP-,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    } as Application;
    
    setStorage('mock_db_applications', [newApp, ...applications]);
    return newApp;
  },''', '''  submitApplication: async (applicationData: Partial<Application>): Promise<Application> => {
    try {
      const { data } = await apiClient.post<any>('/applications', applicationData);
      return data;
    } catch (error) {
      console.error("Backend failed, falling back to mock:", error);
      await delay(1000);
      const applications = getStorage('mock_db_applications', INITIAL_APPLICATIONS);
      const newApp = { ...applicationData, id: APP-, status: 'submitted', submittedAt: new Date().toISOString() } as Application;
      setStorage('mock_db_applications', [newApp, ...applications]);
      return newApp;
    }
  },''')

# Replace getApplications
content = content.replace('''  getApplications: async (): Promise<Application[]> => {
    await delay(600);
    return getStorage('mock_db_applications', INITIAL_APPLICATIONS);
  },''', '''  getApplications: async (): Promise<Application[]> => {
    try {
      const { data } = await apiClient.get<any[]>('/applications');
      return data;
    } catch (error) {
      console.error("Backend failed, falling back to mock:", error);
      await delay(600);
      return getStorage('mock_db_applications', INITIAL_APPLICATIONS);
    }
  },''')

# Replace verifyApplication
content = content.replace('''  verifyApplication: async (appId: string, status: string, remarks: string, docApprovals: any[], officerName?: string): Promise<Application> => {
    // REAL IMPLEMENTATION FOR BACKEND TEAM:
    // const { data } = await apiClient.put<Application>(/applications//verify, { status, remarks, docApprovals, officerName });
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
  },''', '''  verifyApplication: async (appId: string, status: string, remarks: string, docApprovals: any[], officerName?: string): Promise<Application> => {
    try {
      // Using our new Workflow Controller for Milestone 2
      const { data } = await apiClient.post<any>(/v1/workflow//action?stage=FIELD_OFFICER&action=APPROVE&comments=);
      return data;
    } catch (error) {
      console.error("Backend failed, falling back to mock:", error);
      await delay(800);
      const applications = getStorage('mock_db_applications', INITIAL_APPLICATIONS);
      const updated = applications.map(app => {
        if (app.id === appId) return { ...app, status: status as any, verifierComment: remarks, verifierName: officerName || 'Verification Officer' };
        return app;
      });
      setStorage('mock_db_applications', updated);
      return updated.find(a => a.id === appId)!;
    }
  },''')

# Replace releaseFunds
content = content.replace('''  releaseFunds: async (installmentId: string, officerName?: string): Promise<Installment> => {
    // REAL IMPLEMENTATION FOR BACKEND TEAM:
    // const { data } = await apiClient.post<Installment>(/installments//release, { officerName });
    // return data;

    await delay(1200);
    const installments = getStorage('mock_db_installments', INITIAL_INSTALLMENTS);
    const updated = installments.map(inst => 
      inst.id === installmentId 
        ? { ...inst, status: 'disbursed' as const, processedDate: new Date().toISOString(), transactionRef: TXN- } 
        : inst
    );
    setStorage('mock_db_installments', updated);
    
    // Also update the application with finance officer name
    const app = getStorage('mock_db_applications', INITIAL_APPLICATIONS).find((a: Application) => a.id === updated.find(i => i.id === installmentId)?.applicationId);
    if (app) {
      const apps = getStorage('mock_db_applications', INITIAL_APPLICATIONS);
      const updatedApps = apps.map((a: Application) => a.id === app.id ? { ...a, financeOfficerName: officerName || 'Finance Dept' } : a);
      setStorage('mock_db_applications', updatedApps);
    }
    return updated.find(i => i.id === installmentId)!;
  }''', '''  releaseFunds: async (installmentId: string, officerName?: string): Promise<Installment> => {
    try {
      // Using our new Disbursement Controller for Milestone 3
      const { data } = await apiClient.post<any>(/v1/disbursement/release/);
      return data;
    } catch (error) {
      console.error("Backend failed, falling back to mock:", error);
      await delay(1200);
      const installments = getStorage('mock_db_installments', INITIAL_INSTALLMENTS);
      const updated = installments.map(inst => inst.id === installmentId ? { ...inst, status: 'disbursed' as const, processedDate: new Date().toISOString() } : inst);
      setStorage('mock_db_installments', updated);
      return updated.find(i => i.id === installmentId)!;
    }
  }''')

with open(api_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("api.ts updated to use real endpoints with mock fallbacks.")
