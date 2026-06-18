const Event = require('../models/Event');

// Get events trend (events per day)
exports.getEventsTrend = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const trend = await Event.aggregate([
      {
        $match: {
          timestamp: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: trend.length,
      data: trend
    });
  } catch (error) {
    console.error('Error fetching events trend:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events trend'
    });
  }
};

// Get event distribution (clicks vs page views)
exports.getEventDistribution = async (req, res) => {
  try {
    const distribution = await Event.aggregate([
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      clicks: 0,
      pageViews: 0
    };

    distribution.forEach(item => {
      if (item._id === 'click') {
        result.clicks = item.count;
      } else if (item._id === 'page_view') {
        result.pageViews = item.count;
      }
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching event distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event distribution'
    });
  }
};

// Get session trend (sessions per day)
exports.getSessionTrend = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const trend = await Event.aggregate([
      {
        $match: {
          timestamp: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            sessionId: '$sessionId'
          }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          sessions: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          sessions: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: trend.length,
      data: trend
    });
  } catch (error) {
    console.error('Error fetching session trend:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching session trend'
    });
  }
};
