import mongoose from 'mongoose';

const sectionStudentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  universityRollNo: { type: String, required: true },
  sectionRollNo: { type: String, required: true },
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

// Ensure unique combinations
sectionStudentSchema.index({ sectionId: 1, sectionRollNo: 1 }, { unique: true });
sectionStudentSchema.index({ universityId: 1, universityRollNo: 1 }, { unique: true });

export default mongoose.model('SectionStudent', sectionStudentSchema);