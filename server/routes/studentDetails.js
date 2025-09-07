import express from 'express';
import StudentDetails from '../models/StudentDetails.js';
import Student from '../models/Student.js';

const router = express.Router();

// Submit student details
router.post('/', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Get student info
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    const detailsData = {
      ...req.body,
      studentId: req.user.id,
      universityId: student.universityId,
      programId: student.programId,
      universityRollNo: student.universityRollNo
    };
    
    const details = new StudentDetails(detailsData);
    await details.save();
    
    res.status(201).json({ success: true, data: details });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get student details for faculty approval
router.get('/pending', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user?.role !== 'faculty' && req.user?.role !== 'spoc')) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const filter = {
      universityId: req.user.universityId,
      status: 'pending'
    };
    
    const details = await StudentDetails.find(filter)
      .populate('studentId', 'fullName universityRollNo')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: details });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Approve/Reject student details
router.patch('/:id/status', async (req, res) => {
  try {
    if (!req.isAuthenticated() || (req.user?.role !== 'faculty' && req.user?.role !== 'spoc')) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const { status, rejectionReason } = req.body;
    
    if (status === 'rejected') {
      // Delete rejected entry
      await StudentDetails.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Entry rejected and deleted' });
    } else {
      // Approve entry
      const details = await StudentDetails.findByIdAndUpdate(
        req.params.id,
        {
          status,
          approvedBy: req.user.id,
          approvalDate: new Date()
        },
        { new: true }
      );
      
      if (!details) {
        return res.status(404).json({ success: false, message: 'Entry not found' });
      }
      
      res.json({ success: true, data: details });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get student's own submissions
router.get('/my-submissions', async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const submissions = await StudentDetails.find({ 
      studentId: req.user.id 
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;