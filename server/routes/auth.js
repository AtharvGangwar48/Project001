import express from 'express';
import passport from '../config/passport.js';
import University from '../models/University.js';
import Student from '../models/Student.js';

const router = express.Router();

// Login route
router.post('/login', (req, res, next) => {
  const { role } = req.body;
  const loginField = role === 'faculty' ? req.body.facultyId : req.body.username;
  
  console.log('Login attempt:', { role, loginField });
  
  passport.authenticate(role, (err, user, info) => {
    console.log('Auth result:', { err, user, info });
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    req.logIn(user, (err) => {
      if (err) return next(err);
      console.log('Login successful for:', user);
      res.json({ success: true, user });
    });
  })(req, res, next);
});

// Register university
router.post('/register', async (req, res) => {
  try {
    const university = new University(req.body);
    await university.save();
    res.status(201).json({ success: true, message: 'University registered successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Register student
router.post('/register-student', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ success: true, message: 'Student registered successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Check authentication status
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Check auth status
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

export default router;