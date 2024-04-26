const mongoose = require('mongoose');

const fundraisModel = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String
  },
  category:{
    type: String,
    required: true,
  },
  subCategory:{
    type: String
  },
  title:{
    type: String,
    required: true,
  },
  description:{
    type: String,
    required: true,
  },
  photo: [String], 
  document: [String], 
  createdOn:{
    type: Date,
    default: Date.now(),
  },
  message:{
    type: String
  },
  updatedOn:{
    type: Date,
  }
});

const FundraiseModel = mongoose.model('Fundraise', fundraisModel);

module.exports = FundraiseModel;
