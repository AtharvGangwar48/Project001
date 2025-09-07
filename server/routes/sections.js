import express from 'express';
import Section from '../models/Section.js';
import Student from '../models/Student.js';

const router = express.Router();

// Get sections
router.get('/', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const filter = {};
    if (req.user?.role === 'spoc' || req.user?.role === 'faculty') {
      filter.universityId = req.user.universityId;
    }
    
    const sections = await Section.find(filter).populate('classCoordinator', 'name designation');
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create section
router.post('/', async (req, res) => {
  try {
    console.log('Section creation request:', {
      body: req.body,
      user: req.user,
      isAuthenticated: req.isAuthenticated()
    });
    
    if (!req.isAuthenticated() || (req.user?.role !== 'spoc' && req.user?.role !== 'faculty')) {
      console.log('Access denied for section creation');
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const sectionData = { 
      ...req.body, 
      universityId: req.user.universityId,
      createdBy: req.user.id
    };
    
    console.log('Creating section with data:', sectionData);
    
    const section = new Section(sectionData);
    await section.save();
    console.log('Section saved successfully:', section);
    
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    console.error('Section creation error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get sections by program (public)
router.get('/by-program/:programId', async (req, res) => {
  try {
    const sections = await Section.find({ programId: req.params.programId });
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get sections where faculty is class coordinator
router.get('/coordinator/:facultyId', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'faculty') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const sections = await Section.find({ classCoordinator: req.params.facultyId })
      .populate('programId', 'name')
      .populate('universityId', 'name');
    
    // Get student count for each section
    const sectionsWithCount = await Promise.all(
      sections.map(async (section) => {
        const studentCount = await Student.countDocuments({ sectionId: section._id });
        return {
          ...section.toObject(),
          studentCount
        };
      })
    );
    
    res.json({ success: true, data: sectionsWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;