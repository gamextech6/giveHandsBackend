const mongoose = require('mongoose');

const fundraisSchema = new mongoose.Schema({
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
  title: {
    type: String,
   },
  description: {
    type: String,
   },
  age: {
    type: Number,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
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
  supportEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportEvent'
  }]
});

const Fundraise = mongoose.model('Fundraise', fundraisSchema);

module.exports = Fundraise;
