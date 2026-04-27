const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'medisathi.db');
const db = new sqlite3.Database(dbPath);

const initDb = () => {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('Patient', 'Caregiver', 'Doctor')) NOT NULL
    )`);

    // Medications table
    db.run(`CREATE TABLE IF NOT EXISTS Medications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId INTEGER,
      name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      frequency TEXT NOT NULL,
      startDate TEXT,
      endDate TEXT,
      stockCount INTEGER DEFAULT 0,
      FOREIGN KEY(patientId) REFERENCES Users(id)
    )`);

    // Schedules table (specific times for medications)
    db.run(`CREATE TABLE IF NOT EXISTS Schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medicationId INTEGER,
      timeOfDay TEXT NOT NULL,
      FOREIGN KEY(medicationId) REFERENCES Medications(id)
    )`);

    // DoseLogs table
    db.run(`CREATE TABLE IF NOT EXISTS DoseLogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scheduleId INTEGER,
      timestamp TEXT NOT NULL,
      status TEXT CHECK(status IN ('Taken', 'Missed')) NOT NULL,
      FOREIGN KEY(scheduleId) REFERENCES Schedules(id)
    )`);

    // Alerts table
    db.run(`CREATE TABLE IF NOT EXISTS Alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'Unread',
      createdAt TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES Users(id)
    )`);

    // PatientCaregiver table (linking)
    db.run(`CREATE TABLE IF NOT EXISTS PatientCaregiver (
      patientId INTEGER,
      caregiverId INTEGER,
      PRIMARY KEY(patientId, caregiverId),
      FOREIGN KEY(patientId) REFERENCES Users(id),
      FOREIGN KEY(caregiverId) REFERENCES Users(id)
    )`);
  });
};

module.exports = { db, initDb };
