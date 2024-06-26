// const mongoose = require('mongoose');

// const fundraisSchema = new mongoose.Schema({
//   fullName: {
//     type: String,
//    },
//   email: {
//     type: String,
//    },
//   phoneNumber: {
//     type: String
//   },
//   category: {
//     type: String,
//    },
//   subCategory: {
//     type: String
//   },
//   title: {
//     type: String,
//    },
//   description: {
//     type: String,
//    },
//   age: {
//     type: Number,
//     required: true
//   },
//   targetAmount: {
//     type: Number,
//     required: true
//   },
//   gender: {
//     type: String,
//     required: true
//   },
//   location: {
//     type: String,
//     required: true
//   },
//   endDate: {
//     type: Date,
//   },
//   photo: [String], 
//   document: [String], 
//   createdOn: {
//     type: Date,
//     default: Date.now,
//   },
//   message: {
//     type: String
//   },
//   updatedOn: {
//     type: Date,
//   },
//   supportEvents: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'SupportEvent'
//   }]
// });

// const Fundraise = mongoose.model('Fundraise', fundraisSchema);

// module.exports = Fundraise;

const mongoose = require('mongoose');

// Define the sub-schema for donations
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

// Define the combined schema
const fundraisSchema = new mongoose.Schema({
  // Fields from fundraisSchema
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String
  },
  category: {
    type: String,
  },
  subCategory: {
    type: String
  },
  subCategory1:{
    type: String
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  age: {
    type: Number,
  },
  targetAmount: {
    type: Number,
  },
  gender: {
    type: String,
  },
  location: {
    type: String,
  },
  endDate: {
    type: Date,
  },
  photo: [String],
  document: [String],
  createdOn: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String
  },
  updatedOn: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['done', 'onReview', "posted", "completed",'not_seen'], 
    default: 'not_seen'
  },
  supportEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportEvent'
  }],
  
  // Fields from supportEventSchema
  organizer: {
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

const fundraisModel = mongoose.model('Fundraise', fundraisSchema);

module.exports = fundraisModel;

