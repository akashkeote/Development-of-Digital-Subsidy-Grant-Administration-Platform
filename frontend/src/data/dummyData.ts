import { Scheme, UserProfile, Application, Installment, Notification, SystemStats, SystemUser } from '../types';

export const INITIAL_USERS: SystemUser[] = [
  {
    id: 'USR-ADMIN-01',
    name: 'Sanjeev Kumar (IAS)',
    email: 'sanjeev.kumar@gov.in',
    role: 'admin',
    status: 'active',
    department: 'Ministry of Finance',
    lastLogin: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    applicationsProcessed: 1420
  },
  {
    id: 'USR-DIST-01',
    name: 'Anita Desai',
    email: 'anita.desai@gov.in',
    role: 'district_officer',
    status: 'active',
    department: 'District Collectorate, Pune',
    lastLogin: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    applicationsProcessed: 893
  },
  {
    id: 'USR-DIST-02',
    name: 'Vikram Singh',
    email: 'vikram.singh@gov.in',
    role: 'district_officer',
    status: 'blocked',
    department: 'District Collectorate, Jaipur',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    applicationsProcessed: 412
  },
  {
    id: 'USR-VER-01',
    name: 'Ramesh Patel',
    email: 'ramesh.patel@gov.in',
    role: 'verifier',
    status: 'active',
    department: 'Field Office, Ward 4',
    lastLogin: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    applicationsProcessed: 3205
  },
  {
    id: 'USR-VER-02',
    name: 'Priya Sharma',
    email: 'priya.sharma@gov.in',
    role: 'verifier',
    status: 'offline',
    department: 'Field Office, Ward 7',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    applicationsProcessed: 2840
  },
  {
    id: 'USR-CIT-01',
    name: 'Rajesh Kumar Sharma',
    email: 'rajesh.sharma@email.com',
    role: 'citizen',
    status: 'active',
    department: 'Citizen Portal',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  }
];

export const INITIAL_SCHEMES: Scheme[] = [
  {
    id: 'SCH-001',
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    department: 'Department of Agriculture and Farmers Welfare',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    category: 'agriculture',
    description: 'An initiative by the Government of India that provides up to ₹6,000 per year in three equal installments as minimum income support to all small and marginal landholding farmer families.',
    benefits: '₹6,000 per year, transferred directly into the bank accounts of the farmers in three equal installments of ₹2,000 each.',
    eligibilityCriteria: [
      'Small and marginal farmer families with combined landholding of up to 2 hectares.',
      'Citizen of India and land records registered under the applicant\'s name.',
      'Must not be an institutional landholder or tax-payer.'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Landholding Ownership Documents (Khasra/Khatauni)',
      'Bank Account Passbook (Aadhaar Seeded)',
      'Mobile Number linked with Aadhaar'
    ],
    financialYear: '2026-27',
    totalAllocation: 150000000,
    disbursedAmount: 112000000,
    subsidyAmount: 6000,
    installmentCount: 3
  },
  {
    id: 'SCH-002',
    title: 'Solar Rooftop Subsidy Scheme',
    department: 'Department of New and Renewable Energy',
    ministry: 'Ministry of New and Renewable Energy',
    category: 'energy',
    description: 'A national programme promoting solar power generation in residential sectors by subsidizing the capital cost of installing rooftop solar photovoltaic systems.',
    benefits: '40% subsidy for systems up to 3 kW capacity, and 20% subsidy for systems from 3 kW to 10 kW capacity.',
    eligibilityCriteria: [
      'The house or residential building must belong to the applicant.',
      'Adequate rooftop space with shadow-free area is required (approx. 100 sq ft per kW).',
      'Installation must be done via authorized empaneled vendors.'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Recent Electricity Bill (last 3 months)',
      'Property Ownership Certificate/Tax Receipt',
      'Rooftop Photograph',
      'Bank Account Details'
    ],
    financialYear: '2026-27',
    totalAllocation: 85000000,
    disbursedAmount: 42000000,
    subsidyAmount: 48000, // Average subsidy on 3kW
    installmentCount: 2
  },
  {
    id: 'SCH-003',
    title: 'National Merit-cum-Means Scholarship',
    department: 'Department of School Education & Literacy',
    ministry: 'Ministry of Education',
    category: 'education',
    description: 'Provides financial assistance to meritorious students of economically weaker sections to arrest their drop-out at class VIII and encourage them to continue studies at secondary stage.',
    benefits: '₹12,000 per annum (₹1,000 per month) to students studying in class IX to XII.',
    eligibilityCriteria: [
      'Students whose parental annual income from all sources is not more than ₹3,500,000.',
      'Must have secured minimum 55% marks or equivalent grade in Class VII.',
      'Must be studying as regular student in a Government, Government-aided or local body school.'
    ],
    requiredDocuments: [
      'Class VII / VIII Progress Card',
      'Income Certificate issued by competent authority',
      'Aadhaar Card',
      'Caste Certificate (if applicable)',
      'Bank Account Details (linked to Aadhaar)'
    ],
    financialYear: '2026-27',
    totalAllocation: 50000000,
    disbursedAmount: 31000000,
    subsidyAmount: 12000,
    installmentCount: 1
  },
  {
    id: 'SCH-004',
    title: 'Pradhan Mantri Awas Yojana (PMAY-Gramin)',
    department: 'Department of Rural Development',
    ministry: 'Ministry of Rural Development',
    category: 'housing',
    description: 'A flagship social welfare program to provide environment-friendly, disaster-resilient, pucca houses to all homeless householders and those living in dilapidated houses in rural areas.',
    benefits: 'Financial assistance of up to ₹1,20,000 in plains and ₹1,30,000 in hilly areas/difficult areas along with toilet construction support of ₹12,000.',
    eligibilityCriteria: [
      'Families living in zero, one or two-room houses with kutcha walls and roof as per SECC 2011 data.',
      'Must not own a pucca house anywhere in the country.',
      'No member of the household should be a government employee or earn more than ₹15,000/month.'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Job Card Number (MGNREGA)',
      'Bank Account Passbook',
      'Swachh Bharat Mission (SBM) registration number',
      'Land Ownership document/Lease agreement'
    ],
    financialYear: '2026-27',
    totalAllocation: 240000000,
    disbursedAmount: 185000000,
    subsidyAmount: 120000,
    installmentCount: 4
  },
  {
    id: 'SCH-005',
    title: 'Ayushman Bharat National Health Protection Scheme',
    department: 'National Health Authority',
    ministry: 'Ministry of Health and Family Welfare',
    category: 'healthcare',
    description: 'A national health insurance scheme providing free health insurance cover of up to ₹5 Lakh per family per year for secondary and tertiary care hospitalization to poor and vulnerable families.',
    benefits: 'Cashless treatment cover of up to ₹5,00,000 per family per year at all empaneled public and private hospitals.',
    eligibilityCriteria: [
      'Families listed in the Socio-Economic Caste Census (SECC) database.',
      'Families living in kutcha houses, landless households, or casual labor workers.',
      'No limit on family size or age of members.'
    ],
    requiredDocuments: [
      'Aadhaar Card or Ration Card',
      'SECC Letter / PM Letter indicating inclusion',
      'Income Certificate',
      'Mobile number'
    ],
    financialYear: '2026-27',
    totalAllocation: 300000000,
    disbursedAmount: 215000000,
    subsidyAmount: 500000, // Maximum coverage cover
    installmentCount: 1
  }
];

export const DEFAULT_CITIZEN: UserProfile = {
  id: 'CIT-1092',
  name: 'Rajesh Kumar Sharma',
  email: 'rajesh.sharma@email.com',
  phone: '+91 98765 43210',
  aadhaar: '5432-8765-1092',
  pan: 'ABCPS1234D',
  income: 180000,
  category: 'OBC',
  occupation: 'Marginal Farmer',
  state: 'Uttar Pradesh',
  district: 'Gorakhpur',
  bankName: 'State Bank of India',
  bankAccount: '30291827461',
  ifsc: 'SBIN0001234',
  isBankVerified: true,
  isAadhaarVerified: true
};

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'APP-8841',
    schemeId: 'SCH-001',
    schemeTitle: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    citizenId: 'CIT-1092',
    citizenName: 'Rajesh Kumar Sharma',
    appliedDate: '2026-05-12',
    status: 'disbursing',
    currentStep: 4,
    personalDetails: {
      fullName: 'Rajesh Kumar Sharma',
      aadhaar: '5432-8765-1092',
      phone: '+91 98765 43210',
      income: 180000,
      state: 'Uttar Pradesh',
      district: 'Gorakhpur'
    },
    bankDetails: {
      bankName: 'State Bank of India',
      accountNumber: '30291827461',
      ifsc: 'SBIN0001234'
    },
    documents: [
      { id: 'doc-1', name: 'Aadhaar Card.pdf', type: 'Aadhaar Card', url: '#', status: 'verified' },
      { id: 'doc-2', name: 'Landholding_Record_Khasra.pdf', type: 'Landholding Ownership Documents (Khasra/Khatauni)', url: '#', status: 'verified' },
      { id: 'doc-3', name: 'SBI_Passbook.pdf', type: 'Bank Account Passbook (Aadhaar Seeded)', url: '#', status: 'verified' }
    ],
    verifierComment: 'Land records cross-verified with UP Revenue Department portal successfully. Aadhaar KYC verified.',
    districtOfficerComment: 'Sanction order approved for budget year 2026-27. Income criteria met.'
  },
  {
    id: 'APP-9213',
    schemeId: 'SCH-002',
    schemeTitle: 'Solar Rooftop Subsidy Scheme',
    citizenId: 'CIT-1092',
    citizenName: 'Rajesh Kumar Sharma',
    appliedDate: '2026-06-20',
    status: 'submitted',
    currentStep: 1,
    personalDetails: {
      fullName: 'Rajesh Kumar Sharma',
      aadhaar: '5432-8765-1092',
      phone: '+91 98765 43210',
      income: 180000,
      state: 'Uttar Pradesh',
      district: 'Gorakhpur'
    },
    bankDetails: {
      bankName: 'State Bank of India',
      accountNumber: '30291827461',
      ifsc: 'SBIN0001234'
    },
    documents: [
      { id: 'doc-4', name: 'Aadhaar Card.pdf', type: 'Aadhaar Card', url: '#', status: 'pending' },
      { id: 'doc-5', name: 'Electricity_Bill_May2026.pdf', type: 'Recent Electricity Bill (last 3 months)', url: '#', status: 'pending' },
      { id: 'doc-6', name: 'House_Registry_Extract.pdf', type: 'Property Ownership Certificate/Tax Receipt', url: '#', status: 'pending' },
      { id: 'doc-7', name: 'Rooftop_Area_Photo.jpg', type: 'Rooftop Photograph', url: '#', status: 'pending' }
    ]
  },
  {
    id: 'APP-4055',
    schemeId: 'SCH-003',
    schemeTitle: 'National Merit-cum-Means Scholarship',
    citizenId: 'CIT-9844',
    citizenName: 'Ananya Ramesh Patel',
    appliedDate: '2026-06-25',
    status: 'documents_verified',
    currentStep: 2,
    personalDetails: {
      fullName: 'Ananya Ramesh Patel',
      aadhaar: '1234-5678-9844',
      phone: '+91 94412 34567',
      income: 120000,
      state: 'Gujarat',
      district: 'Ahmedabad'
    },
    bankDetails: {
      bankName: 'Bank of Baroda',
      accountNumber: '402218827361',
      ifsc: 'BARB0AHMEDB'
    },
    documents: [
      { id: 'doc-8', name: 'Ananya_ClassVIII_ReportCard.pdf', type: 'Class VII / VIII Progress Card', url: '#', status: 'verified' },
      { id: 'doc-9', name: 'Tehsildar_Income_Certificate.pdf', type: 'Income Certificate issued by competent authority', url: '#', status: 'verified' },
      { id: 'doc-10', name: 'Aadhaar_Card_Patel.pdf', type: 'Aadhaar Card', url: '#', status: 'verified' }
    ],
    verifierComment: 'All educational and income certificates meet criteria. Verified by Verifier #09.'
  }
];

export const INITIAL_INSTALLMENTS: Installment[] = [
  {
    id: 'INST-001',
    applicationId: 'APP-8841',
    schemeTitle: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    installmentNumber: 1,
    amount: 2000,
    dueDate: '2026-05-15',
    disbursementDate: '2026-05-18',
    status: 'disbursed',
    transactionId: 'TXN8829103948572A'
  },
  {
    id: 'INST-002',
    applicationId: 'APP-8841',
    schemeTitle: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    installmentNumber: 2,
    amount: 2000,
    dueDate: '2026-09-15',
    status: 'pending'
  },
  {
    id: 'INST-003',
    applicationId: 'APP-8841',
    schemeTitle: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    installmentNumber: 3,
    amount: 2000,
    dueDate: '2027-01-15',
    status: 'pending'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'NOT-001',
    userId: 'CIT-1092',
    title: 'Installment Released',
    message: 'Your 1st installment of ₹2,000 for PM-KISAN has been successfully credited to your State Bank of India account ending with ******27461 on 2026-05-18.',
    timestamp: '2026-05-18 11:32 AM',
    isRead: false,
    type: 'success'
  },
  {
    id: 'NOT-002',
    userId: 'CIT-1092',
    title: 'Solar Rooftop Application Received',
    message: 'Your application with ID APP-9213 for the Solar Rooftop Subsidy Scheme has been submitted successfully and is awaiting document verification.',
    timestamp: '2026-06-20 03:45 PM',
    isRead: false,
    type: 'info'
  },
  {
    id: 'NOT-003',
    userId: 'CIT-1092',
    title: 'Aadhaar Link Verification Success',
    message: 'Your Aadhaar card was successfully linked and verified with the DBT (Direct Benefit Transfer) registry.',
    timestamp: '2026-05-01 10:00 AM',
    isRead: true,
    type: 'success'
  }
];

export const SYSTEM_STATS: SystemStats = {
  totalRegisteredCitizens: 124050,
  totalSchemesActive: 28,
  totalApplicationsReceived: 89432,
  totalSanctionedAmount: 485000000,
  totalDisbursedAmount: 382000000
};
