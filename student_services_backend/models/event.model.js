// --- File: models/event.model.js ---
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This defines the structure for the "Agenda" array
const eventAgendaSchema = new Schema({
    time: String,
    title: String
});

const eventSchema = new Schema({
    // Main Details (from list & banner)
    title: { type: String, required: true },
    date: { type: Date, required: true }, // We'll store the full date/time
    time: { type: String, required: true }, // e.g., "2:00 PM - 5:00 PM"
    location: { type: String, required: true },
    category: { type: String, default: 'academic' }, // From your CSS (academic, institutional)

    // Modal Details (from photo 2 & 3)
    organizer: { type: String, required: true },
    availability: { type: String }, // e.g., "156 participating"
    capacity: { type: String }, // e.g., "156/200"
    description: { type: String, required: true },
    agenda: [eventAgendaSchema], // An array of {time, title} objects
    expectations: [String], // An array of strings
    requirements: { type: String },
    
    // Image for the modal
    imageUrl: { type: String, default: 'https://via.placeholder.com/600x300.png' }

}, { timestamps: true }); // Adds createdAt (for "Newest" sort)

module.exports = mongoose.model('Event', eventSchema);