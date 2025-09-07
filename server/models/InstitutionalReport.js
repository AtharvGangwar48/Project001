import mongoose from 'mongoose';

const institutionalReportSchema = new mongoose.Schema({
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  
  // Basic Information
  basicInfo: {
    institutionName: String,
    address: String,
    establishmentYear: Number,
    type: { type: String, enum: ['private', 'public'] },
    affiliation: String,
    recognition: String,
    vision: String,
    mission: String,
    objectives: String,
    governanceStructure: String
  },
  
  // Academic Information
  academicInfo: {
    programsOffered: [String],
    curriculumDesign: String,
    studentStrength: {
      admissions: Number,
      enrollment: Number,
      dropoutRate: Number
    },
    facultyProfile: {
      totalFaculty: Number,
      qualifications: String,
      avgExperience: Number,
      studentFacultyRatio: Number
    },
    research: {
      projects: Number,
      publications: Number,
      patents: Number,
      mous: Number
    }
  },
  
  // Infrastructure
  infrastructure: {
    classrooms: Number,
    labs: Number,
    libraryFacilities: String,
    ictFacilities: String,
    hostelCapacity: Number,
    sportsComplexes: Number,
    culturalFacilities: String,
    healthFacilities: String
  },
  
  // Finance
  finance: {
    budgetAllocation: Number,
    budgetUtilization: Number,
    fundingSources: {
      government: Number,
      private: Number,
      csr: Number,
      projects: Number
    }
  },
  
  // Student Support
  studentSupport: {
    scholarships: Number,
    placementRate: Number,
    entrepreneurshipCells: Number,
    feedbackSystems: String
  },
  
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('InstitutionalReport', institutionalReportSchema);