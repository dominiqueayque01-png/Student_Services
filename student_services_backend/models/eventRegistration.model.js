const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registrationSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    eventTitle: { type: String },
    studentId: { type: String, default: 'temp-student-id' },
    status: { type: String, default: 'confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('EventRegistration', registrationSchema);