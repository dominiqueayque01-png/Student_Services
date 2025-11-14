const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventAgendaSchema = new Schema({
    time: String,
    title: String
});

const eventSchema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // e.g., "2:00 PM - 5:00 PM"
    location: { type: String, required: true },
    organizer: { type: String, required: true },
    category: { type: String, default: 'academic' },
    description: { type: String, required: true },
    agenda: [eventAgendaSchema],
    expectations: [String],
    requirements: { type: String },
    availability: { type: String },
    capacity: { type: String },
    imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);