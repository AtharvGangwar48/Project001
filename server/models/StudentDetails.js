import mongoose from 'mongoose';

const studentDetailsSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  universityRollNo: { type: String, required: true },
  
  type: { 
    type: String, 
    enum: ['resume', 'certificate', 'result', 'abc_id', 'seminar', 'conference', 'online_course', 'internship', 'extracurricular'], 
    required: true 
  },
  
  // Common fields
  title: { type: String, required: true },
  description: { type: String, required: true },
  driveLink: { type: String, required: true },
  
  // Resume specific fields
  personalInfo: {
    name: String,
    email: String,
    mobile: String,
    address: String
  },
  academicDetails: [{
    degree: String,
    institution: String,
    year: String,
    percentage: String
  }],
  skills: [String],
  
  // Academic Result fields
  semester: String,
  cgpa: String,
  totalMarks: String,
  percentage: String,
  resultStatus: { type: String, enum: ['Pass', 'Fail', 'Withheld'] },
  resultDate: Date,
  
  // ABC ID fields
  abcIdNumber: String,
  totalCredits: String,
  
  // Seminar fields
  theme: String,
  organizedBy: String,
  location: String,
  role: String,
  certificateReceived: { type: String, enum: ['Yes', 'No'] },
  
  // Conference fields
  subjectArea: String,
  organizingBody: String,
  paperPresented: { type: String, enum: ['Yes', 'No'] },
  paperTitle: String,
  published: { type: String, enum: ['Yes', 'No'] },
  journalName: String,
  
  // Online Course fields
  platform: String,
  institution: String,
  completed: { type: String, enum: ['Yes', 'Ongoing'] },
  
  // Internship fields
  company: String,
  position: String,
  internshipMode: { type: String, enum: ['Online', 'Offline', 'Hybrid'] },
  department: String,
  supervisorName: String,
  supervisorContact: String,
  stipendReceived: { type: String, enum: ['Yes', 'No'] },
  
  // Extra-curricular fields
  activityType: String,
  eventName: String,
  participationType: String,
  achievement: String,
  
  // Common fields
  organization: String,
  startDate: Date,
  endDate: Date,
  duration: String,
  grade: String,
  credentialId: String,
  
  // Approval system
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  approvalDate: Date,
  rejectionReason: String
}, { timestamps: true });

// Auto-delete rejected entries after 24 hours
studentDetailsSchema.pre('save', function(next) {
  if (this.status === 'rejected' && this.isModified('status')) {
    setTimeout(() => {
      this.deleteOne();
    }, 24 * 60 * 60 * 1000); // 24 hours
  }
  next();
});

export default mongoose.model('StudentDetails', studentDetailsSchema);