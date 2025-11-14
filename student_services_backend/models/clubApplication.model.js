// models/clubApplication.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    // This links to the specific club they applied for
    clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
    
    // This is all the form data
    fullName: { type: String, required: true },
    year: { type: String, required: true },
    motive: { type: String, required: true },
    program: { type: String, required: true },
    email: { type: String, required: true },
    experience: { type: String },
    
    // Admin-side tracking
    status: { type: String, default: 'Pending' }, // e.g., 'Pending', 'Approved', 'Rejected'
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClubApplication', applicationSchema);