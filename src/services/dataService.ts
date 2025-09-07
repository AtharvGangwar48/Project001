import { University, Program, SPOC } from '../types';

// Universities
export const getUniversities = (): University[] => {
  const stored = localStorage.getItem('universities');
  return stored ? JSON.parse(stored) : [];
};

export const saveUniversity = (university: University): void => {
  const universities = getUniversities();
  const existingIndex = universities.findIndex(u => u.id === university.id);
  
  if (existingIndex >= 0) {
    universities[existingIndex] = university;
  } else {
    universities.push(university);
  }
  
  localStorage.setItem('universities', JSON.stringify(universities));
};

export const updateUniversityStatus = (id: string, status: 'approved' | 'rejected'): void => {
  const universities = getUniversities();
  const university = universities.find(u => u.id === id);
  
  if (university) {
    university.status = status;
    if (status === 'approved') {
      university.approvedAt = new Date().toISOString();
    }
    localStorage.setItem('universities', JSON.stringify(universities));
  }
};

// Programs
export const getPrograms = (universityId?: string): Program[] => {
  const stored = localStorage.getItem('programs');
  const programs = stored ? JSON.parse(stored) : [];
  
  if (universityId) {
    return programs.filter((p: Program) => p.universityId === universityId);
  }
  
  return programs;
};

export const saveProgram = (program: Program): void => {
  const programs = getPrograms();
  const existingIndex = programs.findIndex(p => p.id === program.id);
  
  if (existingIndex >= 0) {
    programs[existingIndex] = program;
  } else {
    programs.push(program);
  }
  
  localStorage.setItem('programs', JSON.stringify(programs));
};

// SPOCs
export const getSPOCs = (universityId?: string, programId?: string): SPOC[] => {
  const stored = localStorage.getItem('spocs');
  const spocs = stored ? JSON.parse(stored) : [];
  
  let filtered = spocs;
  
  if (universityId) {
    filtered = filtered.filter((s: SPOC) => s.universityId === universityId);
  }
  
  if (programId) {
    filtered = filtered.filter((s: SPOC) => s.programId === programId);
  }
  
  return filtered;
};

export const saveSPOC = (spoc: SPOC): void => {
  const spocs = getSPOCs();
  const existingIndex = spocs.findIndex(s => s.id === spoc.id);
  
  if (existingIndex >= 0) {
    spocs[existingIndex] = spoc;
  } else {
    spocs.push(spoc);
  }
  
  localStorage.setItem('spocs', JSON.stringify(spocs));
};