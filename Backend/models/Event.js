const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['page_view', 'click']
  },
  pageUrl: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  clickX: {
    type: Number,
    default: null
  },
  clickY: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

// Compound indexing
eventSchema.index({ sessionId: 1, timestamp: 1 });
eventSchema.index({ pageUrl: 1, eventType: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
