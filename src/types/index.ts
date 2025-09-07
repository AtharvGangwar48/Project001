export interface University {
  id: string;
  name: string;
  type: string;
  affiliation: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  adminName: string;
  adminDesignation: string;
  adminContact: string;
  username: string;
  password: string;
  documents: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
}

export interface Program {
  id: string;
  universityId: string;
  name: string;
  type: 'UG' | 'PG' | 'Doctoral' | 'Certificate' | 'Diploma';
  faculty: string;
  code: string;
  accreditationStatus: string;
  duration: string;
  seats: number;
  deliveryMode: 'Online' | 'Offline' | 'Hybrid';
  startDate: string;
  specializations: string[];
  createdAt: string;
}

export interface SPOC {
  id: string;
  programId: string;
  universityId: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'university' | 'spoc';
  universityId?: string;
  programId?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  university: University | null;
}