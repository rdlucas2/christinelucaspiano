/**
 * Group class sign-up receiver for christinelucaspiano.com.
 *
 * Setup (one time): see apps-script/README.md.
 * Each POST from the group-class.html form appends a row to the "Signups"
 * sheet of the spreadsheet this script is bound to and emails Christine.
 */
const NOTIFY_EMAIL = 'contact@christinelucaspiano.com';
const SHEET_NAME = 'Signups';
const HEADERS = ['Timestamp', 'Name', 'Email', 'Phone', 'Experience', 'Message', 'Class', 'Page'];
const MAX_LEN = 2000;

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Honeypot: real visitors never see or fill the "website" field.
  if (p.website) return ok_();

  const name = clean_(p.name);
  const email = clean_(p.email);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ok_();

  const row = {
    name: name,
    email: email,
    phone: clean_(p.phone),
    experience: clean_(p.experience),
    message: clean_(p.message),
    className: clean_(p['class']),
    page: clean_(p.page),
  };

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([
      new Date(), row.name, row.email, row.phone, row.experience, row.message, row.className, row.page,
    ].map(cellSafe_));
  } finally {
    lock.releaseLock();
  }

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: row.email,
    subject: 'New group class sign-up: ' + row.name,
    body: [
      'Name: ' + row.name,
      'Email: ' + row.email,
      'Phone: ' + (row.phone || '-'),
      'Experience: ' + (row.experience || '-'),
      'Class: ' + (row.className || '-'),
      '',
      'Message:',
      row.message || '-',
      '',
      'Reply to this email to respond directly. All sign-ups are in the "' + SHEET_NAME + '" sheet.',
    ].join('\n'),
  });

  return ok_();
}

function clean_(v) {
  return String(v || '').trim().slice(0, MAX_LEN);
}

// Stop values like "=HYPERLINK(...)" from being treated as spreadsheet formulas.
function cellSafe_(v) {
  return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
}

function ok_() {
  return ContentService.createTextOutput('ok');
}
