/**
 * Emerald Grove Events — enquiry form handler.
 *
 * SETUP (from scratch):
 * 1. Go to sheet.new (while signed into emeraldgrovevenue@gmail.com) and create a new
 *    Google Sheet. Name it something like "Emerald Grove — Enquiries". You don't need
 *    to add any columns yourself — this script creates its own tab and headers.
 * 2. In the Sheet, go to Extensions > Apps Script.
 * 3. Delete whatever boilerplate code is there, and paste this entire file in.
 * 4. Update the OWNER_EMAILS array below with whichever inbox(es) should receive
 *    booking alerts (currently set to the two known project addresses — confirm
 *    both are right, or trim to one, or add more; it's a plain array).
 * 5. Save the project (Ctrl/Cmd+S), give it a name like "Enquiry handler".
 * 6. Click Deploy > New deployment.
 *      - Select type: Web app
 *      - Execute as: Me (emeraldgrovevenue@gmail.com)
 *      - Who has access: Anyone   <-- important, must be "Anyone", not
 *        "Anyone with a Google account", or customers without a Google login can't submit
 * 7. Click Deploy. The first time, Google will show an "unverified app" warning —
 *    this is normal for a personal script (it isn't published to the marketplace).
 *    Click Advanced > Go to project (unsafe) > Allow.
 * 8. Copy the Web app URL you're given.
 * 9. Paste that URL into config.js on the website, replacing the value of
 *    formEndpoint (currently "PASTE_APPS_SCRIPT_WEB_APP_URL_HERE").
 * 10. Submit the live form once as a test — check a new row appears in the Sheet
 *     and that both emails (owner + customer) arrive.
 *
 * IMPORTANT: if you edit this script later, Deploy > Manage deployments > Edit
 * (pencil icon) > Version: New version > Deploy is required for the change to take
 * effect on the same URL. Saving the code alone does not update a live deployment.
 */

const SHEET_NAME = 'Enquiries';
// Add or remove addresses here — MailApp accepts a comma-separated list.
const OWNER_EMAILS = ['info@emeraldgrove.co.in', 'emeraldgrovevenue@gmail.com']; // TODO: confirm both are correct
const BRAND_NAME = 'Emerald Grove Events';

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};

    // Honeypot: real visitors never fill this hidden field. If it has a value,
    // silently accept the request without logging or emailing anything.
    if (params.website) {
      return jsonOutput({ result: 'ignored' });
    }

    const sheet = getSheet();
    const timestamp = new Date();
    // Sequence number = how many data rows exist before this one (header is row 1),
    // so the very first enquiry is 0001, the second is 0002, and so on — guaranteed
    // unique, unlike a random suffix which could theoretically collide.
    const seq = sheet.getLastRow();
    const bookingId = 'EG-' + Utilities.formatDate(timestamp, 'Asia/Kolkata', 'yyMMdd')
      + '-' + String(seq).padStart(4, '0');

    sheet.appendRow([
      timestamp,
      bookingId,
      params.name || '',
      params.phone || '',
      params.email || '',
      params.eventType || '',
      params.eventDate || '',
      params.guestCount || '',
      params.duration || '',
      params.message || '',
      'New'
    ]);

    sendOwnerEmail(params, bookingId);
    sendCustomerEmail(params, bookingId);

    return jsonOutput({ result: 'success', bookingId: bookingId });
  } catch (err) {
    return jsonOutput({ result: 'error', message: String(err) });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp', 'Booking ID', 'Name', 'Phone', 'Email',
      'Event Type', 'Preferred Date', 'Guest Count', 'Duration', 'Message', 'Status'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sendOwnerEmail(p, bookingId) {
  const subject = 'New enquiry [' + bookingId + '] — ' + (p.name || 'Unknown');
  const body = [
    'New enquiry received via the website.',
    '',
    'Booking ID: ' + bookingId,
    'Name: ' + (p.name || '-'),
    'Phone: ' + (p.phone || '-'),
    'Email: ' + (p.email || '-'),
    'Event type: ' + (p.eventType || '-'),
    'Preferred date: ' + (p.eventDate || '-'),
    'Guest count: ' + (p.guestCount || '-'),
    'Duration: ' + (p.duration || '-'),
    'Message: ' + (p.message || '-'),
    '',
    'Reply directly to this email, or call/WhatsApp them using the details above.'
  ].join('\n');

  MailApp.sendEmail({
    to: OWNER_EMAILS.join(','),
    subject: subject,
    body: body,
    replyTo: p.email || OWNER_EMAILS[0]
  });
}

function sendCustomerEmail(p, bookingId) {
  if (!p.email) return;

  const subject = "We've received your enquiry — " + BRAND_NAME;
  const body = [
    'Hi ' + (p.name || 'there') + ',',
    '',
    'Thanks for reaching out to ' + BRAND_NAME + '! We\'ve received your enquiry ' +
      '(reference ' + bookingId + ') and will get back to you within a few hours.',
    '',
    "Here's what you sent us:",
    'Event type: ' + (p.eventType || '-'),
    'Preferred date: ' + (p.eventDate || '-'),
    'Guest count: ' + (p.guestCount || '-'),
    'Duration: ' + (p.duration || '-'),
    '',
    'If anything above needs correcting, just reply to this email.',
    '',
    'See you soon,',
    BRAND_NAME
  ].join('\n');

  MailApp.sendEmail({
    to: p.email,
    subject: subject,
    body: body
  });
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
