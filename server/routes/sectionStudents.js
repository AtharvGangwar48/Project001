import express from 'express';
import SectionStudent from '../models/SectionStudent.js';
import Student from '../models/Student.js';

const router = express.Router();

// Join section
router.post('/', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const { sectionId, sectionRollNo } = req.body;
    
    // Get student info
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    const sectionStudentData = {
      studentId: req.user.id,
      sectionId,
      universityRollNo: student.universityRollNo,
      sectionRollNo,
      universityId: student.universityId,
      programId: student.programId
    };
    
    const sectionStudent = new SectionStudent(sectionStudentData);
    await sectionStudent.save();
    
    res.status(201).json({ success: true, data: sectionStudent });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Section roll number already taken or you are already in a section' });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
});

// Get student's section info
router.get('/my-section', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const sectionStudent = await SectionStudent.findOne({ studentId: req.user.id })
      .populate('sectionId', 'name year semester');
    
    res.json({ success: true, data: sectionStudent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get students by section
router.get('/by-section/:sectionId', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user?.role !== 'faculty' && req.user?.role !== 'spoc')) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const students = await SectionStudent.find({ sectionId: req.params.sectionId })
      .populate('studentId', 'fullName email')
      .sort({ sectionRollNo: 1 });
    
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;