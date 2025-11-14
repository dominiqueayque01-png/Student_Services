const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counselingSchema = new Schema({
  studentId: { type: String, required: true }, // Later, this can be a real ID
  reason: { type: String, required: true }, // e.g., 'Academic', 'Personal', 'Career'
  preferredDate: { type: Date, required: true },
  status: { type: String, default: 'Pending' } // e.g., 'Pending', 'Confirmed'
});

module.exports = mongoose.model('CounselingAppointment', counselingSchema);