const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  reason: { type: String, required: true },
  address: String,
  city: String,
  weatherAlert: String,
  status: { type: String, default: 'agendada' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);