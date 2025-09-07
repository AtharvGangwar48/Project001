import mongoose from 'mongoose';

const studentActivitySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  universityRollNo: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['result', 'seminar', 'conference', 'online_course', 'abc_id', 'internship', 'extracurricular'], 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  organization: String,
  startDate: Date,
  endDate: Date,
  grade: String, // For results
  duration: String, // For courses/internships
  location: String, // For seminars/conferences
  proofLink: { type: String, required: true }, // Google Drive link
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  approvalDate: Date,
  comments: String
}, { timestamps: true });

export default mongoose.model('StudentActivity', studentActivitySchema);