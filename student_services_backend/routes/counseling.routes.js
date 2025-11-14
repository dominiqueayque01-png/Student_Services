const express = require('express');
const router = express.Router();

// Import the models this file needs
const CounselingAppointment = require('../models/counselingAppointment.model');
const CounselingAnnouncement = require('../models/counselingAnnouncement.model');
const CounselingFaq = require('../models/counselingFaq.model');

// --- STUDENT-FACING ROUTES ---

// GET all FAQs
router.get('/faqs', async (req, res) => {
  try {
    const faqs = await CounselingFaq.find();
    res.json(faqs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET all Announcements
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await CounselingAnnouncement.find().sort({ createdAt: -1 }); // Newest first
    res.json(announcements);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST (submit) a new appointment request
router.post('/appointments', async (req, res) => {
  const appointment = new CounselingAppointment({
    studentId: req.body.studentId,
    studentFullName: req.body.studentFullName,
    studentPhone: req.body.studentPhone,
    studentEmail: req.body.studentEmail,
    referenceContact: req.body.referenceContact // The frontend sends this as a nested object
  });

  try {
    const newAppointment = await appointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET appointment status & history (for one specific student)
router.get('/my-appointments/:studentId', async (req, res) => {
  try {
    const appointments = await CounselingAppointment.find({ studentId: req.params.studentId })
                           .populate('assignedCounselor', 'name title'); // Only show counselor's name and title
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;