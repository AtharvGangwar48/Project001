import express from 'express';
import University from '../models/University.js';

const router = express.Router();

// Get all universities (admin only)
router.get('/', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const universities = await University.find().select('-password');
    res.json({ success: true, data: universities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get approved universities (public)
router.get('/approved', async (req, res) => {
  try {
    const universities = await University.find({ status: 'approved' }).select('name type');
    res.json({ success: true, data: universities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update university status (admin only)
router.patch('/:id/status', async (req, res) => {
  try {
    console.log('Status update request:', {
      id: req.params.id,
      body: req.body,
      user: req.user,
      isAuthenticated: req.isAuthenticated()
    });
    
    if (!req.isAuthenticated() || req.user?.role !== 'admin') {
      console.log('Access denied - not authenticated or not admin');
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const { status } = req.body;
    const updateData = { status };
    
    if (status === 'approved') {
      updateData.approvedAt = new Date();
    }
    
    console.log('Updating university with data:', updateData);
    
    const university = await University.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!university) {
      console.log('University not found with ID:', req.params.id);
      return res.status(404).json({ success: false, message: 'University not found' });
    }
    
    console.log('University updated successfully:', university);
    res.json({ success: true, data: university });
  } catch (error) {
    console.error('Error updating university status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;