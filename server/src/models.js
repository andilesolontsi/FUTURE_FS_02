const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
  source: { type: String, required: true, trim: true, maxlength: 100 },
  status: { type: String, enum: ['new', 'contacted', 'converted'], default: 'new' },
  notes: [noteSchema],
  followUp: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });
leadSchema.index({ email: 1 });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

module.exports = { Lead: mongoose.model('Lead', leadSchema), User: mongoose.model('User', userSchema) };
