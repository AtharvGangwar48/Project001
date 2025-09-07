import express from 'express';
import ClassSchedule from '../models/ClassSchedule.js';

const router = express.Router();

// Create class schedule
router.post('/', async (req, res) => {
  try {
    const schedule = new ClassSchedule(req.body);
    await schedule.save();
    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get schedules for SPOC
router.get('/spoc', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const filter = { createdBy: req.user.id };
    if (req.query.day) filter.dayOfWeek = req.query.day;

    const schedules = await ClassSchedule.find(filter)
      .sort({ dayOfWeek: 1, startTime: 1 });
    
    res.json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get schedules for Faculty
router.get('/faculty', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const filter = { facultyId: req.user.facultyId || req.user.id };
    if (req.query.day) filter.dayOfWeek = req.query.day;

    const schedules = await ClassSchedule.find(filter)
      .sort({ dayOfWeek: 1, startTime: 1 });
    
    res.json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get schedules for Students
router.get('/student', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const filter = { 
      sectionName: req.user.sectionName || req.query.section,
      universityId: req.user.universityId,
      programId: req.user.programId
    };
    if (req.query.day) filter.dayOfWeek = req.query.day;

    const schedules = await ClassSchedule.find(filter)
      .sort({ dayOfWeek: 1, startTime: 1 });
    
    res.json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;