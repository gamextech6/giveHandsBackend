const mongoose = require('mongoose');

const requestCallModel = new mongoose.Schema({
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

const RequestedCallModel = mongoose.model('RequestedCall', requestCallModel);

module.exports = RequestedCallModel;
