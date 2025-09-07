import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  name: { type: String, required: true },
  degreeLevel: { type: String, enum: ['UG', 'PG', 'Doctoral', 'Certificate', 'Diploma'], required: true },
  description: { type: String, required: true },
  department: { type: String, required: true },
  duration: { type: String, required: true },
  studyMode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], required: true }
}, { timestamps: true });

export default mongoose.model('Program', programSchema);