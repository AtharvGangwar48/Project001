import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
  startTime: { type: String, required: true }, // Format: "09:00"
  endTime: { type: String, required: true },   // Format: "10:00"
  room: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SPOC', required: true }
}, { timestamps: true });

// Ensure no overlapping classes for same section
timetableSchema.index({ sectionId: 1, dayOfWeek: 1, startTime: 1 }, { unique: true });

export default mongoose.model('Timetable', timetableSchema);