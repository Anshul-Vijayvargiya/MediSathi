const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'medisathi.db');
const db = new sqlite3.Database(dbPath);

const hashedPassword = bcrypt.hashSync('password123', 10);

const seed = async () => {
  console.log('Seeding database...');

  db.serialize(() => {
    // Clear existing data
    db.run('DELETE FROM DoseLogs');
    db.run('DELETE FROM Schedules');
    db.run('DELETE FROM Medications');
    db.run('DELETE FROM PatientCaregiver');
    db.run('DELETE FROM Alerts');
    db.run('DELETE FROM Users');

    // Reset autoincrement
    db.run("DELETE FROM sqlite_sequence WHERE name='Users'");
    db.run("DELETE FROM sqlite_sequence WHERE name='Medications'");
    db.run("DELETE FROM sqlite_sequence WHERE name='Schedules'");
    db.run("DELETE FROM sqlite_sequence WHERE name='DoseLogs'");
    db.run("DELETE FROM sqlite_sequence WHERE name='Alerts'");

    // Insert Users
    const users = [
      ['John Doe', 'john@example.com', hashedPassword, 'Patient'],
      ['Jane Smith', 'jane@example.com', hashedPassword, 'Caregiver'],
      ['Dr. House', 'house@example.com', hashedPassword, 'Doctor'],
      ['Alice Johnson', 'alice@example.com', hashedPassword, 'Patient']
    ];

    const userStmt = db.prepare('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)');
    users.forEach(user => userStmt.run(user));
    userStmt.finalize();

    console.log('Users inserted.');

    // Link Patients to Caregiver
    // John (ID 1) and Alice (ID 4) linked to Jane (ID 2)
    db.run('INSERT INTO PatientCaregiver (patientId, caregiverId) VALUES (1, 2)');
    db.run('INSERT INTO PatientCaregiver (patientId, caregiverId) VALUES (4, 2)');

    // Medications for John (Patient ID 1)
    const medications = [
      [1, 'Metformin', '500mg', 'Twice daily', '2026-04-01', '2026-12-31', 20],
      [1, 'Lisinopril', '10mg', 'Once daily', '2026-04-01', '2026-12-31', 15],
      [4, 'Aspirin', '81mg', 'Once daily', '2026-04-01', '2026-12-31', 30]
    ];

    const medStmt = db.prepare('INSERT INTO Medications (patientId, name, dosage, frequency, startDate, endDate, stockCount) VALUES (?, ?, ?, ?, ?, ?, ?)');
    medications.forEach(med => medStmt.run(med));
    medStmt.finalize();

    console.log('Medications inserted.');

    // Schedules
    // Metformin (Med ID 1): 08:00, 20:00
    // Lisinopril (Med ID 2): 09:00
    // Aspirin (Med ID 3): 08:30
    const schedules = [
      [1, '08:00'],
      [1, '20:00'],
      [2, '09:00'],
      [3, '08:30']
    ];

    const schedStmt = db.prepare('INSERT INTO Schedules (medicationId, timeOfDay) VALUES (?, ?)');
    schedules.forEach(sched => schedStmt.run(sched));
    schedStmt.finalize();

    console.log('Schedules inserted.');

    // Dose Logs for the last 7 days
    const logs = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // John's logs
      // Morning Metformin (Sched ID 1)
      logs.push([1, `${dateStr}T08:05:00Z`, 'Taken']);
      // Evening Metformin (Sched ID 2) - maybe missed some
      logs.push([2, `${dateStr}T20:10:00Z`, i % 3 === 0 ? 'Missed' : 'Taken']);
      // Lisinopril (Sched ID 3)
      logs.push([3, `${dateStr}T09:00:00Z`, 'Taken']);

      // Alice's logs
      logs.push([4, `${dateStr}T08:35:00Z`, 'Taken']);
    }

    const logStmt = db.prepare('INSERT INTO DoseLogs (scheduleId, timestamp, status) VALUES (?, ?, ?)');
    logs.forEach(log => logStmt.run(log));
    logStmt.finalize();

    console.log('Dose logs inserted.');

    // Alerts
    const alerts = [
      [1, 'Refill', 'Your Metformin stock is low (5 remaining).', 'Unread', new Date().toISOString()],
      [2, 'Missed Dose', 'John Doe missed his evening dose of Metformin.', 'Unread', new Date().toISOString()]
    ];

    const alertStmt = db.prepare('INSERT INTO Alerts (userId, type, message, status, createdAt) VALUES (?, ?, ?, ?, ?)');
    alerts.forEach(alert => alertStmt.run(alert));
    alertStmt.finalize();

    console.log('Alerts inserted.');
    console.log('Database seeded successfully!');
    db.close();
  });
};

seed();
