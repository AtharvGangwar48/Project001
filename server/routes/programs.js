import express from 'express';
import Program from '../models/Program.js';

const router = express.Router();

// Get programs
router.get('/', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const filter = {};
    if (req.user?.role === 'university') {
      filter.universityId = req.user.universityId;
    }
    
    const programs = await Program.find(filter).populate('universityId', 'name');
    res.json({ success: true, data: programs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get programs by university (public)
router.get('/by-university/:universityId', async (req, res) => {
  try {
    const programs = await Program.find({ universityId: req.params.universityId });
    res.json({ success: true, data: programs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create program
router.post('/', async (req, res) => {
  try {
    console.log('Program creation request:', {
      body: req.body,
      user: req.user,
      isAuthenticated: req.isAuthenticated()
    });
    
    if (!req.isAuthenticated() || req.user?.role !== 'university') {
      console.log('Access denied for program creation');
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const programData = { ...req.body, universityId: req.user.universityId };
    console.log('Creating program with data:', programData);
    
    const program = new Program(programData);
    await program.save();
    console.log('Program saved successfully:', program);
    
    res.status(201).json({ success: true, data: program });
  } catch (error) {
    console.error('Program creation error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update program
router.put('/:id', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'university') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const program = await Program.findOneAndUpdate(
      { _id: req.params.id, universityId: req.user.universityId },
      req.body,
      { new: true }
    );
    
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    
    res.json({ success: true, data: program });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get program by ID
router.get('/:id', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    res.json({ success: true, data: program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;