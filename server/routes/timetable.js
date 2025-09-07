import express from 'express';
import Timetable from '../models/Timetable.js';
import SectionStudent from '../models/SectionStudent.js';

const router = express.Router();

// Create timetable entry
router.post('/', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user?.role !== 'spoc' && req.user?.role !== 'faculty')) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const timetableData = {
      ...req.body,
      universityId: req.user.universityId,
      programId: req.user.programId,
      createdBy: req.user.id
    };
    
    const timetable = new Timetable(timetableData);
    await timetable.save();
    
    res.status(201).json({ success: true, data: timetable });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Time slot already occupied for this section' });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
});

// Get timetable for faculty
router.get('/faculty', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'faculty') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const day = req.query.day || new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    const timetable = await Timetable.find({ 
      facultyId: req.user.id,
      dayOfWeek: day
    })
    .populate('sectionId', 'name year semester')
    .populate('courseId', 'name code')
    .sort({ startTime: 1 });
    
    res.json({ success: true, data: timetable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get timetable for SPOC
router.get('/spoc', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'spoc') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const day = req.query.day;
    const filter = { 
      universityId: req.user.universityId,
      programId: req.user.programId
    };
    
    if (day) {
      filter.dayOfWeek = day;
    }
    
    const timetable = await Timetable.find(filter)
      .populate('sectionId', 'name year semester')
      .populate('courseId', 'name code')
      .populate('facultyId', 'name')
      .sort({ dayOfWeek: 1, startTime: 1 });
    
    res.json({ success: true, data: timetable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get timetable for student
router.get('/student', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Get student's section
    const sectionStudent = await SectionStudent.findOne({ studentId: req.user.id });
    if (!sectionStudent) {
      return res.json({ success: true, data: [] });
    }
    
    const day = req.query.day || new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    const timetable = await Timetable.find({ 
      sectionId: sectionStudent.sectionId,
      dayOfWeek: day
    })
    .populate('courseId', 'name code')
    .populate('facultyId', 'name')
    .sort({ startTime: 1 });
    
    res.json({ success: true, data: timetable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;