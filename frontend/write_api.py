import re

with open('src/services/api.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """  releaseFunds: async (installmentId: string, officerName?: string): Promise<Installment> => {
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
  }"""

# regex replace
content = re.sub(r'releaseFunds:\s*async\s*\(installmentId:\s*string,\s*officerName\?:\s*string\):\s*Promise<Installment>\s*=>\s*\{[\s\S]*?\}\s*\}', replacement + '\n}', content)

with open('src/services/api.ts', 'w', encoding='utf-8') as f:
    f.write(content)
