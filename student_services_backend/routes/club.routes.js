// --- File: routes/club.routes.js ---

const express = require('express');
const router = express.Router();

// --- THIS IS THE ONLY "Club" DECLARATION YOU NEED IN THIS FILE ---
// This IMPORTS the blueprint you made in the other file
const Club = require('../models/club.model');

// --- 1. GET ALL CLUBS ---
router.get('/', async (req, res) => {
  try {
    const clubs = await Club.find(); 
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 2. CREATE A NEW CLUB ---
router.post('/', async (req, res) => {
  const club = new Club({
    name: req.body.name,
    description: req.body.description,
    president: req.body.president
  });

  try {
    const newClub = await club.save();
    res.status(201).json(newClub);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- DO NOT PUT `mongoose.model` IN THIS FILE ---

// This exports the instruction manual
module.exports = router;