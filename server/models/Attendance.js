import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  timetableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Timetable', required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  date: { type: Date, required: true },
  students: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    universityRollNo: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true }
  }],
  totalStudents: { type: Number, required: true },
  presentCount: { type: Number, required: true },
  absentCount: { type: Number, required: true }
}, { timestamps: true });

// Ensure one attendance record per class per date
attendanceSchema.index({ timetableId: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);