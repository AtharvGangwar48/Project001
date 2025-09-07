import mongoose from 'mongoose';

const studentCertificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  universityRollNo: { type: String, required: true },
  title: { type: String, required: true },
  issuingOrganization: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expiryDate: Date,
  credentialId: String,
  description: String,
  certificateLink: { type: String, required: true }, // Google Drive link
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  approvalDate: Date,
  comments: String
}, { timestamps: true });

export default mongoose.model('StudentCertificate', studentCertificateSchema);