import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const spocSchema = new mongoose.Schema({
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  name: { type: String, required: true },
  designation: { type: String, default: 'SPOC/HOD' },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

spocSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

spocSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('SPOC', spocSchema);