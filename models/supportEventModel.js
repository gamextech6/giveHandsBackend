const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
  },
  amount: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const supportEventSchema = new mongoose.Schema({
  organizer: {
    type: String,
  },
  description: {
    type: String,
  },
  donationProtected: {
    type: Boolean,
    default: true
  },
  inMemoryOf: {
    type: String,
 
  },
  eventDate: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
  },
  targetAmount: {
    type: Number,
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  donations: [donationSchema],
  wordsOfSupport: [{
    supporterName: {
      type: String,
    },
    message: {
      type: String,
    },
    donationAmount: {
      type: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

const SupportEvent = mongoose.model('SupportEvent', supportEventSchema);

module.exports = SupportEvent;
