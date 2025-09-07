import express from 'express';
import UniversityMetrics from '../models/UniversityMetrics.js';
import ActivityAnalytics from '../models/ActivityAnalytics.js';

const router = express.Router();

function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Authentication required' });
}

// Get university metrics
router.get('/', requireAuth, async (req, res) => {
  try {
    const metrics = await UniversityMetrics.findOne({ universityId: req.user.id });
    res.json(metrics || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update university metrics
router.post('/', requireAuth, async (req, res) => {
  try {
    const metrics = await UniversityMetrics.findOneAndUpdate(
      { universityId: req.user.id },
      { ...req.body, universityId: req.user.id },
      { upsert: true, new: true }
    );
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Activity Analytics routes
router.get('/analytics', requireAuth, async (req, res) => {
  try {
    const analytics = await ActivityAnalytics.findOne({ universityId: req.user.id });
    res.json(analytics || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/analytics', requireAuth, async (req, res) => {
  try {
    const analytics = await ActivityAnalytics.findOneAndUpdate(
      { universityId: req.user.id },
      { ...req.body, universityId: req.user.id },
      { upsert: true, new: true }
    );
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;