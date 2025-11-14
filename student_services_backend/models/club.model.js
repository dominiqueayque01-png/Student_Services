// models/club.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clubSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, default: 'General' },
  location: { type: String },
  meetingTime: { type: String },
  members: { type: Number, default: 0 },
  applicants: { type: Number, default: 0 },
  description: { type: String, required: true },
  aboutClub: { type: String, required: true }, // From your JS
  createdDate: { type: Date, default: Date.now } // From your JS
});

module.exports = mongoose.model('Club', clubSchema);