import mongoose from 'mongoose';

const studentResumeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  universityRollNo: { type: String, required: true },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    linkedIn: String,
    github: String
  },
  education: [{
    degree: String,
    institution: String,
    year: String,
    percentage: String
  }],
  skills: [String],
  projects: [{
    title: String,
    description: String,
    technologies: String,
    link: String
  }],
  resumeLink: { type: String, required: true }, // Google Drive link
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  approvalDate: Date,
  comments: String
}, { timestamps: true });

export default mongoose.model('StudentResume', studentResumeSchema);