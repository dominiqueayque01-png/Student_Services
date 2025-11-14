// routes/clubApplication.routes.js
const express = require('express');
const router = express.Router();
const ClubApplication = require('../models/clubApplication.model');

// POST a new application
router.post('/', async (req, res) => {
    const application = new ClubApplication({
        clubId: req.body.clubId,
        fullName: req.body.fullName,
        year: req.body.year,
        motive: req.body.motive,
        program: req.body.program,
        email: req.body.email,
        experience: req.body.experience
    });

    try {
        const newApplication = await application.save();
        res.status(201).json(newApplication);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all applications (for an admin)
router.get('/', async (req, res) => {
    try {
        const applications = await ClubApplication.find().populate('clubId', 'name'); // Show the club name
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;