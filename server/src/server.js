require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Lead, User } = require('./models');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }));

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required.' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { return res.status(401).json({ message: 'Session is invalid or expired. Please sign in again.' }); }
}
const cleanLead = (body) => ({
  name: String(body.name || '').trim(),
  email: String(body.email || '').trim().toLowerCase(),
  source: String(body.source || '').trim(),
  status: body.status || 'new',
  followUp: body.followUp ? new Date(body.followUp) : null
});
function validateLead(lead) {
  if (!lead.name || !lead.email || !lead.source) return 'Name, email and source are required.';
  if (!/^\S+@\S+\.\S+$/.test(lead.email)) return 'Enter a valid email address.';
  if (!['new', 'contacted', 'converted'].includes(lead.status)) return 'Choose a valid lead status.';
  if (lead.followUp && Number.isNaN(lead.followUp.getTime())) return 'Enter a valid follow-up date.';
  return null;
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'Future Interns Mini CRM API' }));

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(String(req.body.password || ''), user.passwordHash)))
      return res.status(401).json({ message: 'Incorrect email or password.' });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { email: user.email } });
  } catch (err) { next(err); }
});

app.get('/api/leads', auth, async (req, res, next) => {
  try {
    const filter = {};
    if (['new', 'contacted', 'converted'].includes(req.query.status)) filter.status = req.query.status;
    if (req.query.q) filter.$or = [
      { name: { $regex: req.query.q, $options: 'i' } },
      { email: { $regex: req.query.q, $options: 'i' } },
      { source: { $regex: req.query.q, $options: 'i' } }
    ];
    const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();
    res.json(leads);
  } catch (err) { next(err); }
});

app.post('/api/leads', auth, async (req, res, next) => {
  try {
    const data = cleanLead(req.body); const error = validateLead(data);
    if (error) return res.status(400).json({ message: error });
    const lead = await Lead.create(data); res.status(201).json(lead);
  } catch (err) { next(err); }
});

app.patch('/api/leads/:id', auth, async (req, res, next) => {
  try {
    const existing = await Lead.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Lead not found.' });
    const data = cleanLead({ ...existing.toObject(), ...req.body }); const error = validateLead(data);
    if (error) return res.status(400).json({ message: error });
    Object.assign(existing, data); await existing.save(); res.json(existing);
  } catch (err) { next(err); }
});

app.delete('/api/leads/:id', auth, async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found.' });
    res.json({ message: 'Lead deleted.' });
  } catch (err) { next(err); }
});

app.post('/api/leads/:id/notes', auth, async (req, res, next) => {
  try {
    const text = String(req.body.text || '').trim();
    if (!text || text.length > 2000) return res.status(400).json({ message: 'A note of 1–2000 characters is required.' });
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found.' });
    lead.notes.push({ text }); await lead.save(); res.status(201).json(lead);
  } catch (err) { next(err); }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid lead ID.' });
  if (err.code === 11000) return res.status(409).json({ message: 'A record with this value already exists.' });
  res.status(500).json({ message: 'An unexpected server error occurred.' });
});

async function start() {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) throw new Error('Set MONGODB_URI and JWT_SECRET in server/.env');
  await mongoose.connect(process.env.MONGODB_URI);
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const email = process.env.ADMIN_EMAIL.toLowerCase();
    const exists = await User.findOne({ email });
    if (!exists) await User.create({ email, passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12) });
  }
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`CRM API running on http://localhost:${port}`));
}
start().catch(err => { console.error(err); process.exit(1); });
