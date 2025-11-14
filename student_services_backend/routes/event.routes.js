const express = require('express');
const router = express.Router();
const Event = require('../models/event.model'); // Import the model

router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
    const event = new Event({
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        organizer: req.body.organizer,
        category: req.body.category,
        description: req.body.description,
        agenda: req.body.agenda,
        expectations: req.body.expectations,
        requirements: req.body.requirements,
        availability: req.body.availability,
        capacity: req.body.capacity,
        imageUrl: req.body.imageUrl
    });
    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;