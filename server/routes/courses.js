import express from 'express';
import Course from '../models/Course.js';

const router = express.Router();

// Get courses
router.get('/', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const filter = {};
    if (req.user?.role === 'spoc' || req.user?.role === 'faculty') {
      filter.universityId = req.user.universityId;
    }
    
    const courses = await Course.find(filter).populate('assignedFaculty', 'name');
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create course
router.post('/', async (req, res) => {
  try {
    console.log('Course creation - User:', req.user, 'Authenticated:', req.isAuthenticated());
    if (!req.isAuthenticated() || (req.user?.role !== 'spoc' && req.user?.role !== 'faculty')) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const courseData = { 
      ...req.body, 
      universityId: req.user.universityId,
      createdBy: req.user.id
    };
    
    const course = new Course(courseData);
    await course.save();
    
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;