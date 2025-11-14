const express = require('express');
const router = express.Router();

// Import all our new models
const CounselingAppointment = require('../models/counselingAppointment.model');
const Counselor = require('../models/counselor.model');
const CounselingAnnouncement = require('../models/counselingAnnouncement.model');
const CounselingFaq = require('../models/counselingFaq.model');

// --- APPOINTMENT MANAGEMENT (Admin) ---

// GET all appointments (for the admin dashboard)
router.get('/appointments', async (req, res) => {
  try {
    // .populate() will fetch the counselor's details from the 'Counselor' collection
    const appointments = await CounselingAppointment.find().populate('assignedCounselor');
    res.json(appointments);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// UPDATE an appointment (Admin assigns a counselor, sets time, changes status)
router.put('/appointments/:id', async (req, res) => {
  try {
    const updatedAppointment = await CounselingAppointment.findByIdAndUpdate(
      req.params.id,
      req.body, // The admin sends { status: "Scheduled", assignedCounselor: "...", scheduledDateTime: "..." }
      { new: true }
    );
    res.json(updatedAppointment);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// --- COUNSELOR MANAGEMENT (Admin) ---

// GET all counselors
router.get('/counselors', async (req, res) => {
  try {
    const counselors = await Counselor.find();
    res.json(counselors);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// CREATE a new counselor
router.post('/counselors', async (req, res) => {
  const counselor = new Counselor({
    name: req.body.name,
    title: req.body.title,
    email: req.body.email,
    phone: req.body.phone
  });
  try {
    const newCounselor = await counselor.save();
    res.status(201).json(newCounselor);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// UPDATE a counselor
router.put('/counselors/:id', async (req, res) => {
  try {
    const updatedCounselor = await Counselor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCounselor);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE a counselor
router.delete('/counselors/:id', async (req, res) => {
  try {
    await Counselor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Counselor deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- ANNOUNCEMENT & FAQ MANAGEMENT (Admin) ---
// (We can add POST, PUT, DELETE for Announcements and FAQs here too)

module.exports = router;