import express from 'express';
import Faculty from '../models/Faculty.js';

const router = express.Router();

// Get faculty
router.get('/', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const filter = {};
    if (req.user?.role === 'spoc' || req.user?.role === 'faculty') {
      filter.universityId = req.user.universityId;
    }
    
    const faculty = await Faculty.find(filter).select('-password');
    res.json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create faculty
router.post('/', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user?.role !== 'spoc' && req.user?.role !== 'faculty')) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const facultyData = { 
      ...req.body, 
      universityId: req.user.universityId,
      programId: req.user.programId
    };
    
    const faculty = new Faculty(facultyData);
    await faculty.save();
    
    const result = await Faculty.findById(faculty._id).select('-password');
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Debug route to check faculty by facultyId
router.get('/debug-faculty/:facultyId', async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ facultyId: req.params.facultyId }).select('-password');
    res.json({ success: true, faculty, exists: !!faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get faculty details with populated data
router.get('/details/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('universityId', 'name')
      .populate('programId', 'name')
      .populate('assignedCourses.courseId', 'name code credits year semester')
      .populate('assignedCourses.sectionId', 'name year semester');
    
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }
    
    const response = {
      ...faculty.toObject(),
      university: faculty.universityId,
      program: faculty.programId,
      sections: faculty.assignedCourses.map(ac => ac.sectionId).filter(Boolean)
    };
    
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;