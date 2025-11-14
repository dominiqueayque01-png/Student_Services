const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counselorSchema = new Schema({
  name: { type: String, required: true },
  title: { type: String }, // e.g., "Guidance Counselor, RPm"
  email: { type: String, required: true },
  phone: { type: String }
});

module.exports = mongoose.model('Counselor', counselorSchema);