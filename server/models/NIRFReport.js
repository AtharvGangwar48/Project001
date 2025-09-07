import mongoose from 'mongoose';

const nirfReportSchema = new mongoose.Schema({
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  
  // Teaching, Learning & Resources (30%)
  teachingLearning: {
    facultyStudentRatio: Number,
    facultyQualification: String,
    studentStrength: Number,
    financialResources: Number,
    resourceUtilization: Number
  },
  
  // Research & Professional Practice (30%)
  research: {
    publications: Number,
    patents: Number,
    projects: Number,
    citations: Number,
    iprs: Number,
    collaborations: Number
  },
  
  // Graduation Outcomes (20%)
  graduationOutcomes: {
    placementRate: Number,
    higherEducation: Number,
    entrepreneurship: Number,
    examResults: Number,
    avgSalaryPackage: Number
  },
  
  // Outreach & Inclusivity (10%)
  outreachInclusivity: {
    regionalDiversity: Number,
    genderDiversity: Number,
    disadvantagedGroups: Number,
    outreachPrograms: String,
    socialResponsibility: String
  },
  
  // Perception (10%)
  perception: {
    employerSurvey: Number,
    academicPeerSurvey: Number,
    publicPerception: Number
  },
  
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('NIRFReport', nirfReportSchema);