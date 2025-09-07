import mongoose from 'mongoose';

const classScheduleSchema = new mongoose.Schema({
  // Basic Information
  universityId: { type: String, required: true },
  programId: { type: String, required: true },
  
  // Class Details
  sectionName: { type: String, required: true },
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true },
  
  // Faculty Information
  facultyId: { type: String, required: true },
  facultyName: { type: String, required: true },
  
  // Schedule Details
  dayOfWeek: { 
    type: String, 
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: { type: String, required: true },
  
  // Academic Information
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
  
  // Creator Information
  createdBy: { type: String, required: true }, // SPOC ID
  
  // Status
  isActive: { type: Boolean, default: true }
}, { 
  timestamps: true 
});

// Index for efficient queries
classScheduleSchema.index({ universityId: 1, programId: 1 });
classScheduleSchema.index({ facultyId: 1, dayOfWeek: 1 });
classScheduleSchema.index({ sectionName: 1, dayOfWeek: 1, startTime: 1 });

export default mongoose.model('ClassSchedule', classScheduleSchema);