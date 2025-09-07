import mongoose from 'mongoose';

const naacReportSchema = new mongoose.Schema({
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  
  // Criterion 1: Curricular Aspects
  curricularAspects: {
    curriculumDesign: String,
    cbcsImplementation: String,
    stakeholderFeedback: String,
    curriculumRevision: String
  },
  
  // Criterion 2: Teaching-Learning and Evaluation
  teachingLearning: {
    studentTeacherRatio: Number,
    learningOutcomes: String,
    mentoringSystem: String,
    evaluationReforms: String,
    assessmentOutcomes: String
  },
  
  // Criterion 3: Research, Innovations & Extension
  research: {
    researchFunding: Number,
    publications: Number,
    iprGenerated: Number,
    collaborations: Number,
    outreachActivities: String,
    extensionPrograms: String
  },
  
  // Criterion 4: Infrastructure & Learning Resources
  infrastructure: {
    libraryUsage: String,
    ictEnabledTeaching: String,
    physicalInfrastructure: String,
    learningResources: String
  },
  
  // Criterion 5: Student Support & Progression
  studentSupport: {
    placementRate: Number,
    higherStudies: Number,
    scholarships: Number,
    eventParticipation: String,
    alumniContributions: String
  },
  
  // Criterion 6: Governance, Leadership & Management
  governance: {
    visionMissionAlignment: String,
    iqacReports: String,
    leadershipQuality: String,
    managementSystems: String
  },
  
  // Criterion 7: Institutional Values & Best Practices
  institutionalValues: {
    genderEquity: String,
    environmentalSustainability: String,
    inclusivityInitiatives: String,
    bestPractices: String
  },
  
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('NAACReport', naacReportSchema);