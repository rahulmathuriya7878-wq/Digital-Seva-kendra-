export type Language = 'hi' | 'en';

export type ServiceCategory = 
  | 'all'
  | 'identity'
  | 'certificates'
  | 'welfare'
  | 'bills'
  | 'jobs'
  | 'pf-tax';

export interface ServiceItem {
  id: string;
  titleHi: string;
  titleEn: string;
  category: ServiceCategory;
  shortDescHi: string;
  shortDescEn: string;
  departmentHi: string;
  departmentEn: string;
  officialUrl: string;
  feeHi: string;
  feeEn: string;
  processingTimeHi: string;
  processingTimeEn: string;
  requiredDocsHi: string[];
  requiredDocsEn: string[];
  stepsHi: string[];
  stepsEn: string[];
  iconName: string;
  badgeHi?: string;
  badgeEn?: string;
  searchKeywords?: string[];
}

export interface ApplicationStatusResult {
  applicationId: string;
  serviceNameHi: string;
  serviceNameEn: string;
  applicantName: string;
  appliedDate: string;
  currentStep: number;
  totalSteps: number;
  status: 'In Progress' | 'Approved' | 'Action Needed';
  statusTextHi: string;
  statusTextEn: string;
  remarksHi: string;
  remarksEn: string;
  stages: {
    titleHi: string;
    titleEn: string;
    date: string;
    completed: boolean;
  }[];
}

export interface TokenBooking {
  id?: string;
  tokenNumber: string;
  applicantName: string;
  mobileNumber: string;
  serviceTitle: string;
  serviceCategory?: string;
  officialDepartment?: string;
  estimatedFee?: string;
  date: string;
  timeSlot: string;
  mode: 'online' | 'center';
  referenceId: string;
  cityOrDistrict?: string;
  isUrgent?: boolean;
  notes?: string;
  requiredDocuments?: string[];
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt?: string;
}
