const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['done', 'pending', 'not_seen'], 
    default: 'not_seen'
},
  updatedOn:{
    type: Date,
  }
});

const contactUsModel = mongoose.model('ContactUs', contactUsSchema);

module.exports = contactUsModel;
