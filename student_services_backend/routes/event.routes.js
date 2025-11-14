// --- File: routes/event.routes.js ---
const express = require('express');
const router = express.Router();
const Event = require('../models/event.model'); // Import the model

// GET ALL EVENTS (for the student page)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 }); // Upcoming first
        res.json(events);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST A NEW EVENT (for an admin)
router.post('/', async (req, res) => {
    const event = new Event(req.body); // Pass the whole body
    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (err) { res.status(400).json({ message: err.message }); } // Validation error
});
// (We can add PUT and DELETE later, just like with clubs)
module.exports = router;