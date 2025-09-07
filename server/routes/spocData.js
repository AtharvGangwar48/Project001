import express from 'express';
import { SPOCCourse, SPOCSection, SPOCFaculty, SPOCTimetable } from '../models/SPOCData.js';

const router = express.Router();

// Courses
router.get('/courses', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const courses = await SPOCCourse.find({ spocId: req.user.id });
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/courses', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const course = new SPOCCourse({ ...req.body, spocId: req.user.id });
    await course.save();
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Sections
router.get('/sections', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const sections = await SPOCSection.find({ spocId: req.user.id });
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/sections', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const section = new SPOCSection({ ...req.body, spocId: req.user.id });
    await section.save();
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Faculty
router.get('/faculty', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const faculty = await SPOCFaculty.find({ spocId: req.user.id });
    res.json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/faculty', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const faculty = new SPOCFaculty({ ...req.body, spocId: req.user.id });
    await faculty.save();
    res.status(201).json({ success: true, data: faculty });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Timetable
router.get('/timetable', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const filter = { spocId: req.user.id };
    if (req.query.day) filter.dayOfWeek = req.query.day;
    
    const timetable = await SPOCTimetable.find(filter).sort({ dayOfWeek: 1, startTime: 1 });
    res.json({ success: true, data: timetable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/timetable', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const timetable = new SPOCTimetable({ ...req.body, spocId: req.user.id });
    await timetable.save();
    res.status(201).json({ success: true, data: timetable });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;