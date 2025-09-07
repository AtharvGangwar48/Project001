import express from 'express';
import SectionCourse from '../models/SectionCourse.js';
import Course from '../models/Course.js';

const router = express.Router();

// Get section-course assignments
router.get('/', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const filter = {};
    if (req.user?.role === 'spoc' || req.user?.role === 'faculty') {
      filter.universityId = req.user.universityId;
    }
    
    const assignments = await SectionCourse.find(filter)
      .populate('sectionId', 'name year semester')
      .populate('courseId', 'name code credits')
      .populate('assignedFaculty', 'name');
    
    console.log('Section-courses assignments:', assignments.length);
    
    res.json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Assign course to section
router.post('/', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user?.role !== 'spoc' && req.user?.role !== 'faculty')) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const { sectionId, courseId, assignedFaculty } = req.body;
    
    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    const assignmentData = {
      universityId: req.user.universityId,
      programId: course.programId,
      sectionId,
      courseId,
      courseName: course.name,
      assignedFaculty: assignedFaculty || null,
      createdBy: req.user.id
    };
    
    const assignment = new SectionCourse(assignmentData);
    await assignment.save();
    
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Course already assigned to this section' });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
});

// Update section-course assignment
router.put('/:id', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user?.role !== 'spoc' && req.user?.role !== 'faculty')) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const assignment = await SectionCourse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('sectionId courseId assignedFaculty');
    
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    res.json({ success: true, data: assignment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete section-course assignment
router.delete('/:id', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user?.role !== 'spoc' && req.user?.role !== 'faculty')) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const assignment = await SectionCourse.findByIdAndDelete(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    res.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;