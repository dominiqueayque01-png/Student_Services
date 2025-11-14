const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  // Student Info
  studentId: { type: String, required: true },
  studentFullName: { type: String, required: true },
  studentPhone: { type: String, required: true },
  studentEmail: { type: String, required: true },

  // Reference Contact Info
  referenceContact: {
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String }
  },

  // Appointment Info
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Scheduled', 'Rescheduled', 'Cancelled', 'Completed'],
    default: 'Pending'
  },
  
  // This will be filled in by the admin
  assignedCounselor: { type: Schema.Types.ObjectId, ref: 'Counselor' }, // Links to the Counselor model
  scheduledDateTime: { type: Date },
  
  // Session History
  sessionHistory: [
    {
      sessionDate: { type: Date },
      notes: { type: String } // Admin-facing notes
    }
  ]
}, { timestamps: true }); // 'timestamps' adds `createdAt` and `updatedAt` fields

module.exports = mongoose.model('CounselingAppointment', appointmentSchema);