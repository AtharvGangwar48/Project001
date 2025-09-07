import mongoose from 'mongoose';

const sectionCourseSchema = new mongoose.Schema({
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  courseName: { type: String, required: true }, // Store course name for quick access
  assignedFaculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SPOC', required: true }
}, { timestamps: true });

// Ensure unique section-course combination
sectionCourseSchema.index({ sectionId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('SectionCourse', sectionCourseSchema);