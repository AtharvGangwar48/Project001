import { University, Program, SPOC, Section, Course, Faculty } from '../types';

const API_BASE = process.env.NODE_ENV === 'development' && typeof window !== 'undefined'
  ? `https://${window.location.hostname}:3001/api`
  : 'http://localhost:3001/api';

const apiCall = async (url: string, options: RequestInit = {}) => {
  console.log('Making API call:', `${API_BASE}${url}`, options);
  
  const response = await fetch(`${API_BASE}${url}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  console.log('API response status:', response.status, response.statusText);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API error response:', errorText);
    throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const result = await response.json();
  console.log('API response data:', result);
  return result;
};

// Universities
export const getUniversities = async (): Promise<University[]> => {
  const result = await apiCall('/universities');
  return result.data.map((uni: any) => ({
    ...uni,
    id: uni._id
  }));
};

export const saveUniversity = async (university: Omit<University, 'id' | 'createdAt'>): Promise<void> => {
  await apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(university),
  });
};

export const updateUniversityStatus = async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
  console.log('API call to update status:', { id, status });
  const result = await apiCall(`/universities/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  console.log('API response:', result);
};

// Programs
export const getPrograms = async (): Promise<Program[]> => {
  const result = await apiCall('/programs');
  return result.data.map((prog: any) => ({
    ...prog,
    id: prog._id
  }));
};

export const saveProgram = async (program: any): Promise<Program> => {
  const result = await apiCall('/programs', {
    method: 'POST',
    body: JSON.stringify(program),
  });
  return result.data;
};

export const updateProgram = async (id: string, program: Partial<Program>): Promise<Program> => {
  const result = await apiCall(`/programs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(program),
  });
  return result.data;
};

// SPOCs
export const getSPOCs = async (): Promise<SPOC[]> => {
  const result = await apiCall('/spocs');
  return result.data.map((spoc: any) => ({
    ...spoc,
    id: spoc._id
  }));
};

export const saveSPOC = async (spoc: any): Promise<SPOC> => {
  const result = await apiCall('/spocs', {
    method: 'POST',
    body: JSON.stringify(spoc),
  });
  return result.data;
};

export const updateSPOC = async (id: string, spoc: Partial<SPOC>): Promise<SPOC> => {
  const result = await apiCall(`/spocs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(spoc),
  });
  return result.data;
};

// Student APIs
export const registerStudent = async (student: any): Promise<void> => {
  await apiCall('/auth/register-student', {
    method: 'POST',
    body: JSON.stringify(student),
  });
};

export const getStudentData = async (): Promise<any> => {
  const result = await apiCall('/students/me');
  return result.data;
};

export const getUniversitiesForStudent = async (): Promise<University[]> => {
  const result = await apiCall('/universities/approved');
  return result.data.map((uni: any) => ({
    ...uni,
    id: uni._id
  }));
};

export const getProgramsByUniversity = async (universityId: string): Promise<Program[]> => {
  const result = await apiCall(`/programs/by-university/${universityId}`);
  return result.data.map((prog: any) => ({
    ...prog,
    id: prog._id
  }));
};

export const getSectionsByProgram = async (programId: string): Promise<Section[]> => {
  const result = await apiCall(`/sections/by-program/${programId}`);
  return result.data.map((section: any) => ({
    ...section,
    id: section._id
  }));
};

// Course APIs
export const getCourses = async (): Promise<Course[]> => {
  const result = await apiCall('/courses');
  return result.data.map((course: any) => ({
    ...course,
    id: course._id
  }));
};

export const saveCourse = async (course: any): Promise<Course> => {
  const result = await apiCall('/courses', {
    method: 'POST',
    body: JSON.stringify(course),
  });
  return result.data;
};

// Section APIs
export const getSections = async (): Promise<Section[]> => {
  const result = await apiCall('/sections');
  return result.data.map((section: any) => ({
    ...section,
    id: section._id
  }));
};

export const saveSection = async (section: any): Promise<Section> => {
  const result = await apiCall('/sections', {
    method: 'POST',
    body: JSON.stringify(section),
  });
  return result.data;
};

// Faculty APIs
export const getFaculty = async (): Promise<Faculty[]> => {
  const result = await apiCall('/faculty');
  return result.data.map((faculty: any) => ({
    ...faculty,
    id: faculty._id
  }));
};

export const saveFaculty = async (faculty: any): Promise<Faculty> => {
  const result = await apiCall('/faculty', {
    method: 'POST',
    body: JSON.stringify(faculty),
  });
  return result.data;
};