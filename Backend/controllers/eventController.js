const Event = require('../models/Event');

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const { sessionId, eventType, pageUrl, timestamp, clickX, clickY } = req.body;

    // Validate required fields
    if (!sessionId || !eventType || !pageUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: sessionId, eventType, pageUrl' 
      });
    }

    const event = await Event.create({
      sessionId,
      eventType,
      pageUrl,
      timestamp: timestamp || new Date(),
      clickX: clickX || null,
      clickY: clickY || null
    });

    res.status(201).json({ 
      success: true, 
      data: event 
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating event' 
    });
  }
};

// Get all sessions with aggregated data
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: '$sessionId',
          totalEvents: { $sum: 1 },
          firstSeen: { $min: '$timestamp' },
          lastSeen: { $max: '$timestamp' }
        }
      },
      {
        $project: {
          _id: 0,
          sessionId: '$_id',
          totalEvents: 1,
          firstSeen: 1,
          lastSeen: 1
        }
      },
      {
        $sort: { lastSeen: -1 }
      }
    ]);

    res.status(200).json({ 
      success: true, 
      count: sessions.length,
      data: sessions 
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching sessions' 
    });
  }
};

// Get single session details
exports.getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const events = await Event.find({ sessionId })
      .sort({ timestamp: 1 })
      .lean();

    if (!events || events.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      count: events.length,
      data: events 
    });
  } catch (error) {
    console.error('Error fetching session details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching session details' 
    });
  }
};

// Get heatmap data for specific page
exports.getHeatmap = async (req, res) => {
  try {
    const { pageUrl } = req.query;

    if (!pageUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'pageUrl query parameter is required' 
      });
    }

    const clicks = await Event.find({
      pageUrl,
      eventType: 'click',
      clickX: { $ne: null },
      clickY: { $ne: null }
    })
    .select('clickX clickY -_id')
    .lean();

    const heatmapData = clicks.map(click => ({
      x: click.clickX,
      y: click.clickY
    }));

    res.status(200).json({ 
      success: true, 
      count: heatmapData.length,
      data: heatmapData 
    });
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching heatmap data' 
    });
  }
};

// Get analytics stats
exports.getStats = async (req, res) => {
  try {
    const [totalEvents, totalClicks, totalPageViews, totalSessions] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ eventType: 'click' }),
      Event.countDocuments({ eventType: 'page_view' }),
      Event.distinct('sessionId').then(sessions => sessions.length)
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSessions,
        totalEvents,
        totalClicks,
        totalPageViews
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching stats' 
    });
  }
};

// Get available page URLs
exports.getPageUrls = async (req, res) => {
  try {
    const urls = await Event.distinct('pageUrl');
    
    res.status(200).json({
      success: true,
      count: urls.length,
      data: urls
    });
  } catch (error) {
    console.error('Error fetching page URLs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching page URLs' 
    });
  }
};
