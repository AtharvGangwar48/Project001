import mongoose from 'mongoose';

const universityMetricsSchema = new mongoose.Schema({
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true,
    unique: true
  },
  
  enrollment: {
    byProgram: [{
      program: String,
      count: Number
    }],
    byGender: {
      male: Number,
      female: Number,
      other: Number
    },
    byCategory: {
      general: Number,
      obc: Number,
      sc: Number,
      st: Number
    }
  },
  
  faculty: {
    totalFaculty: Number,
    phdQualified: Number,
    studentFacultyRatio: Number
  },
  
  research: {
    funding: Number,
    publications: Number,
    scopusCitations: Number,
    wosCitations: Number
  },
  
  placements: {
    placementRate: Number,
    internships: Number,
    entrepreneurshipVentures: Number,
    avgSalary: Number
  },
  
  academics: {
    examPassRate: Number,
    higherStudiesProgression: Number
  },
  
  accreditation: {
    naacGrade: String,
    nirfRank: Number,
    affiliatedColleges: Number,
    accreditedColleges: Number
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('UniversityMetrics', universityMetricsSchema);