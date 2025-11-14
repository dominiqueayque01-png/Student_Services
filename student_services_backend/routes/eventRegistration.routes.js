// --- File: routes/eventRegistration.routes.js ---
const express = require('express');
const router = express.Router();
const EventRegistration = require('../models/eventRegistration.model');

// POST a new registration
router.post('/', async (req, res) => {
    const registration = new EventRegistration({
        eventId: req.body.eventId,
        eventTitle: req.body.eventTitle,
        studentId: req.body.studentId
    });
    try {
        const newRegistration = await registration.save();
        res.status(201).json(newRegistration);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;