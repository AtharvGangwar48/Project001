import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  name: { type: String, required: true }, // Section A, B, C
  year: { type: Number, required: true }, // 1st, 2nd, 3rd, 4th year
  semester: { type: Number, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Multiple courses per section
  classCoordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }, // Faculty assigned as class coordinator
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SPOC', required: true }
}, { timestamps: true });

export default mongoose.model('Section', sectionSchema);