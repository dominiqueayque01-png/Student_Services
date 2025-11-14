const express = require('express');
const router = express.Router();
const OjtListing = require('../models/ojt.model');

// GET all OJT listings
router.get('/', async (req, res) => {
  try {
    const listings = await OjtListing.find({ status: 'Open' }); // Only find open ones
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new OJT listing
router.post('/', async (req, res) => {
  const listing = new OjtListing({
    companyName: req.body.companyName,
    role: req.body.role,
    description: req.body.description,
    link: req.body.link
  });
  try {
    const newListing = await listing.save();
    res.status(201).json(newListing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;