// --- File: models/eventRegistration.model.js ---
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registrationSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    eventTitle: { type: String },
    studentId: { type: String, default: 'temp-student-id' }, // Placeholder
    status: { type: String, default: 'confirmed' }
}, { timestamps: true }); // This adds a "registeredAt" date

module.exports = mongoose.model('EventRegistration', registrationSchema);