const express = require('express');
const router = express.Router();
const {
  createEvent,
  getSessions,
  getSessionById,
  getHeatmap,
  getStats,
  getPageUrls
} = require('../controllers/eventController');

// Event routes
router.post('/events', createEvent);
router.get('/sessions', getSessions);
router.get('/sessions/:sessionId', getSessionById);
router.get('/heatmap', getHeatmap);
router.get('/stats', getStats);
router.get('/pages', getPageUrls);

module.exports = router;
