import express from 'express';
import SPOC from '../models/SPOC.js';

const router = express.Router();

// Get SPOCs
router.get('/', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const filter = {};
    if (req.user?.role === 'university') {
      filter.universityId = req.user.universityId;
    }
    
    const spocs = await SPOC.find(filter)
      .populate('programId', 'name')
      .populate('universityId', 'name')
      .select('-password');
    
    res.json({ success: true, data: spocs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create SPOC
router.post('/', async (req, res) => {
  try {
    console.log('SPOC creation request:', {
      body: req.body,
      user: req.user,
      isAuthenticated: req.isAuthenticated()
    });
    
    if (!req.isAuthenticated() || req.user?.role !== 'university') {
      console.log('Access denied for SPOC creation');
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const spocData = { ...req.body, universityId: req.user.universityId };
    console.log('Creating SPOC with data:', spocData);
    
    const spoc = new SPOC(spocData);
    await spoc.save();
    console.log('SPOC saved successfully:', spoc);
    
    const populatedSPOC = await SPOC.findById(spoc._id)
      .populate('programId', 'name')
      .populate('universityId', 'name')
      .select('-password');
    
    res.status(201).json({ success: true, data: populatedSPOC });
  } catch (error) {
    console.error('SPOC creation error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update SPOC
router.put('/:id', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'university') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const spoc = await SPOC.findOneAndUpdate(
      { _id: req.params.id, universityId: req.user.universityId },
      req.body,
      { new: true }
    ).populate('programId', 'name').populate('universityId', 'name').select('-password');
    
    if (!spoc) {
      return res.status(404).json({ success: false, message: 'SPOC not found' });
    }
    
    res.json({ success: true, data: spoc });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;