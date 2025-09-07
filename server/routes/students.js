import express from 'express';
import Student from '../models/Student.js';
import University from '../models/University.js';
import Program from '../models/Program.js';
import SPOC from '../models/SPOC.js';

const router = express.Router();

// Get student profile (student only)
router.get('/me', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const student = await Student.findById(req.user.id)
      .populate('universityId', 'name')
      .populate('programId', 'name degreeLevel department')
      .select('-password');
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    // Get SPOC for the program
    const spoc = await SPOC.findOne({ programId: student.programId }).select('-password');
    
    res.json({ 
      success: true, 
      data: {
        ...student.toObject(),
        spoc
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;