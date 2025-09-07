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
  _id?: string;
  universityId: string;
  name: string;
  degreeLevel: 'UG' | 'PG' | 'Doctoral' | 'Certificate' | 'Diploma';
  description: string;
  department: string;
  duration: string;
  studyMode: 'Online' | 'Offline' | 'Hybrid';
  createdAt: string;
}

export interface SPOC {
  id: string;
  _id?: string;
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
  role: 'admin' | 'university' | 'spoc' | 'student';
  universityId?: string;
  programId?: string;
}

export interface Student {
  id: string;
  _id?: string;
  fullName: string;
  studentId: string;
  universityRollNo: string;
  universityId: string;
  programId: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface Faculty {
  id: string;
  _id?: string;
  universityId: string;
  programId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  specialization?: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface Course {
  id: string;
  _id?: string;
  universityId: string;
  programId: string;
  name: string;
  code: string;
  credits: number;
  year: number;
  semester: number;
  description?: string;
  syllabusLink?: string;
  assignedFaculty?: string;
  createdBy: string;
  createdAt: string;
}

export interface Section {
  id: string;
  _id?: string;
  universityId: string;
  programId: string;
  name: string;
  year: number;
  semester: number;
  courses: string[];
  classCoordinator?: string;
  createdBy: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  university: University | null;
}