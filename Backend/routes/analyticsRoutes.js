const express = require('express');
const router = express.Router();
const {
  getEventsTrend,
  getEventDistribution,
  getSessionTrend
} = require('../controllers/analyticsController');

// Analytics routes
router.get('/events-trend', getEventsTrend);
router.get('/event-distribution', getEventDistribution);
router.get('/session-trend', getSessionTrend);

module.exports = router;
