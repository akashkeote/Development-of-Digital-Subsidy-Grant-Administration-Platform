/**
 * API Service Layer for DigiGrant
 * This file serves as the interface between the frontend and the future backend.
 * Currently configured to return mocked promises for Milestone 2, ready to be swapped with Axios calls in Milestone 3.
 */

import { Scheme, Application, Installment, DashboardStats } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// --- SCHEMES API ---
export const schemeService = {
  /** Fetch all active welfare schemes */
  getAllSchemes: async (): Promise<Scheme[]> => {
    // In M3: return (await axios.get(`${BASE_URL}/schemes`)).data;
    return new Promise(resolve => setTimeout(() => resolve([]), 500)); 
  },
  
  /** Fetch details of a specific scheme */
  getSchemeById: async (id: string): Promise<Scheme | null> => {
    return new Promise(resolve => setTimeout(() => resolve(null), 500));
  },
  
  /** Admin: Launch a new scheme */
  createScheme: async (schemeData: Partial<Scheme>): Promise<Scheme> => {
    return new Promise(resolve => setTimeout(() => resolve({ id: 'SCH-NEW', ...schemeData } as Scheme), 800));
  }
};

// --- APPLICATIONS API ---
export const applicationService = {
  /** Citizen: Submit a new application for a scheme */
  submitApplication: async (data: Partial<Application>): Promise<{ success: boolean; applicationId: string }> => {
    return new Promise(resolve => setTimeout(() => resolve({ success: true, applicationId: 'APP-NEW-123' }), 1000));
  },
  
  /** Fetch applications for a specific user (Citizen) or all (Admin) */
  getApplications: async (userId?: string): Promise<Application[]> => {
    return new Promise(resolve => setTimeout(() => resolve([]), 500));
  },
  
  /** Verifier: Approve or reject an application with remarks */
  verifyApplication: async (appId: string, status: string, verifierRemarks: string): Promise<boolean> => {
    return new Promise(resolve => setTimeout(() => resolve(true), 600));
  }
};

// --- DISBURSEMENT & TREASURY API ---
export const treasuryService = {
  /** Fetch all pending installments */
  getPendingInstallments: async (): Promise<Installment[]> => {
    return new Promise(resolve => setTimeout(() => resolve([]), 500));
  },
  
  /** Admin: Authorize the release of funds to a beneficiary */
  releaseFunds: async (installmentId: string): Promise<boolean> => {
    return new Promise(resolve => setTimeout(() => resolve(true), 1200));
  }
};

// --- ANALYTICS API ---
export const analyticsService = {
  /** Admin: Fetch system-wide general ledger statistics */
  getSystemStats: async (): Promise<DashboardStats> => {
    return new Promise(resolve => setTimeout(() => resolve({
      totalSchemesActive: 0,
      totalApplicationsReceived: 0,
      totalSanctionedAmount: 0,
      totalDisbursedAmount: 0
    }), 500));
  }
};
