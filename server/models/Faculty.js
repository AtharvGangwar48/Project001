import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const facultySchema = new mongoose.Schema({
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  facultyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  specialization: { type: String },
  assignedCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' }
  }],
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

facultySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

facultySchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('Faculty', facultySchema);