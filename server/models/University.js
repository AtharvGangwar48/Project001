import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  affiliation: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  website: String,
  adminName: { type: String, required: true },
  adminDesignation: { type: String, required: true },
  adminContact: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  documents: [String],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedAt: Date
}, { timestamps: true });

universitySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

universitySchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('University', universitySchema);