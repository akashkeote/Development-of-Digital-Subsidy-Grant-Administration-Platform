export type UserRole = 'citizen' | 'verifier' | 'district_officer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  aadhaar: string;
  pan?: string;
  income: number;
  category: string; // e.g. "General", "OBC", "SC", "ST"
  occupation: string;
  state: string;
  district: string;
  bankName: string;
  bankAccount: string;
  ifsc: string;
  isBankVerified: boolean;
  isAadhaarVerified: boolean;
}

export interface Scheme {
  id: string;
  title: string;
  department: string;
  ministry: string;
  category: 'agriculture' | 'education' | 'housing' | 'energy' | 'social_welfare' | 'healthcare';
  description: string;
  benefits: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  financialYear: string;
  totalAllocation: number;
  disbursedAmount: number;
  subsidyAmount: number; // Single-time or periodic amount
  installmentCount: number;
}

export type ApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'documents_verified' 
  | 'rejected_by_verifier' 
  | 'approved_by_district' 
  | 'rejected_by_district' 
  | 'disbursing' 
  | 'completed';

export interface Application {
  id: string;
  schemeId: string;
  schemeTitle: string;
  citizenId: string;
  citizenName: string;
  appliedDate: string;
  status: ApplicationStatus;
  currentStep: number; // 1: Submitted, 2: Verification, 3: Sanctioning, 4: Disbursement
  personalDetails: {
    fullName: string;
    aadhaar: string;
    phone: string;
    income: number;
    state: string;
    district: string;
  };
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifsc: string;
  };
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    status: 'pending' | 'verified' | 'rejected';
    comment?: string;
  }[];
  verifierComment?: string;
  districtOfficerComment?: string;
  rejectionReason?: string;
}

export interface Installment {
  id: string;
  applicationId: string;
  schemeTitle: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  disbursementDate?: string;
  status: 'pending' | 'processing' | 'disbursed' | 'failed';
  transactionId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface SystemStats {
  totalRegisteredCitizens: number;
  totalSchemesActive: number;
  totalApplicationsReceived: number;
  totalSanctionedAmount: number;
  totalDisbursedAmount: number;
}
