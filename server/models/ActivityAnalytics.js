import mongoose from 'mongoose';

const activityAnalyticsSchema = new mongoose.Schema({
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true,
    unique: true
  },
  
  teachingLearning: {
    classUtilization: Number,
    studentEngagement: Number,
    attendanceRate: Number,
    feedbackScore: Number
  },
  
  research: {
    ongoingProjects: Number,
    completedProjects: Number,
    fundUtilization: Number,
    publicationQuality: Number,
    avgProjectDuration: Number
  },
  
  extensionOutreach: {
    totalPrograms: Number,
    beneficiaries: Number,
    impactScore: Number,
    communityReach: Number
  },
  
  infrastructure: {
    labUtilization: Number,
    libraryUsage: Number,
    ictResourceUsage: Number,
    facilityMaintenance: Number
  },
  
  governance: {
    decisionTimeline: Number,
    policyImplementations: Number,
    complianceRate: Number,
    stakeholderSatisfaction: Number
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ActivityAnalytics', activityAnalyticsSchema);