const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, initDb } = require('./db');
const multer = require('multer');
const path = require('path');
const { processPrescription } = require('./ocrController');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'medisathi_secret_key';

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// --- Multer Configuration ---
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images (jpeg, jpg, png) are allowed'));
  }
});

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');


// Initialize DB
initDb();

// --- Auth Middleware ---
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// --- Routes ---

// Auth
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role],
    function(err) {
      if (err) return res.status(400).json({ message: 'Email already exists' });
      const token = jwt.sign({ id: this.lastID, role }, JWT_SECRET);
      res.json({ token, user: { id: this.lastID, name, email, role } });
    }
  );
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM Users WHERE email = ?', [email], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
});

// Medications
app.get('/api/medications', authenticate, (req, res) => {
  const userId = req.user.id;
  db.all('SELECT * FROM Medications WHERE patientId = ?', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/medications', authenticate, (req, res) => {
  const { name, dosage, frequency, stockCount } = req.body;
  const userId = req.user.id;
  db.run(
    'INSERT INTO Medications (patientId, name, dosage, frequency, stockCount) VALUES (?, ?, ?, ?, ?)',
    [userId, name, dosage, frequency, stockCount],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Dose Logs
app.post('/api/logs', authenticate, (req, res) => {
  const { scheduleId, status } = req.body;
  const timestamp = new Date().toISOString();
  db.run(
    'INSERT INTO DoseLogs (scheduleId, timestamp, status) VALUES (?, ?, ?)',
    [scheduleId, timestamp, status],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// AI Engine: Risk Analysis
app.get('/api/ai/analysis', authenticate, (req, res) => {
  const userId = req.user.id;
  // Simplified logic: Count missed doses in last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  const query = `
    SELECT dl.status, COUNT(*) as count 
    FROM DoseLogs dl
    JOIN Schedules s ON dl.scheduleId = s.id
    JOIN Medications m ON s.medicationId = m.id
    WHERE m.patientId = ? AND dl.timestamp > ?
    GROUP BY dl.status
  `;

  db.all(query, [userId, sevenDaysAgo], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const taken = rows.find(r => r.status === 'Taken')?.count || 0;
    const missed = rows.find(r => r.status === 'Missed')?.count || 0;
    const total = taken + missed;
    const adherenceRate = total > 0 ? (taken / total) * 100 : 100;

    // AI Prediction Mock
    const riskScore = missed > 3 ? 'High' : missed > 1 ? 'Medium' : 'Low';
    const recommendation = missed > 2 
      ? 'Your adherence has dropped in the evening. Consider moving your evening dose 30 minutes earlier.'
      : 'You are doing great! Keep it up.';

    res.json({
      adherenceRate,
      riskScore,
      recommendation,
      missedDoses: missed,
      nextAction: 'Take your Evening Metformin at 8:00 PM'
    });
  });
});

// Caregiver: Get Patients
app.get('/api/caregiver/patients', authenticate, (req, res) => {
  if (req.user.role !== 'Caregiver') return res.status(403).json({ message: 'Forbidden' });
  
  const query = `
    SELECT u.id, u.name, u.email,
    (SELECT COUNT(*) FROM DoseLogs dl JOIN Schedules s ON dl.scheduleId = s.id JOIN Medications m ON s.medicationId = m.id WHERE m.patientId = u.id AND dl.status = 'Missed') as missedCount
    FROM Users u
    JOIN PatientCaregiver pc ON u.id = pc.patientId
    WHERE pc.caregiverId = ?
  `;

  db.all(query, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// OCR Scan
app.post('/api/ocr/scan', authenticate, upload.single('prescription'), processPrescription);

app.listen(PORT, () => {

  console.log(`Server running on http://localhost:${PORT}`);
});
