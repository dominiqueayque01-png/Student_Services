const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ojtSchema = new Schema({
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String }, // Link to apply
  status: { type: String, default: 'Open' } // e.g., 'Open', 'Closed'
});

module.exports = mongoose.model('OjtListing', ojtSchema);