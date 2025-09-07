import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  credits: { type: Number, required: true },
  year: { type: Number, required: true }, // 1st, 2nd, 3rd, 4th year
  semester: { type: Number, required: true }, // 1-8 semesters
  description: { type: String },
  syllabusLink: { type: String }, // Google Drive link
  assignedFaculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SPOC', required: true }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);