var DRIVE_FOLDER_ID = '1BEgk29RwoL6YcbKLCPMYiiJrE8IS5EJZ';
var SHEET_ID        = '1IZbykMH2fpT71H9knW6VZWcTmlFIfPTNkUsAKo4kNBQ';

// ── Run this ONCE from the Apps Script editor to create the Drive folder and
//    Sheet inside whichever Google account owns this script, then copy the
//    logged IDs into the two variables above. ─────────────────────────────────
function setup() {
  var folder = DriveApp.createFolder('Receipt Photos');
  Logger.log('DRIVE_FOLDER_ID: ' + folder.getId());

  var ss = SpreadsheetApp.create('Receipt Tracker');
  var sheet = ss.getActiveSheet();
  sheet.appendRow(['Date', 'Company', 'Amount', 'Description', 'Receipt Link', 'Submitted']);
  sheet.setFrozenRows(1);
  Logger.log('SHEET_ID: ' + ss.getId());

  Logger.log('--- Paste both IDs into the top of Code.gs then redeploy. ---');
}
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Step 1: decode file
    var fileBytes, blob;
    try {
      fileBytes = Utilities.base64Decode(data.fileData);
      blob = Utilities.newBlob(fileBytes, data.mimeType, data.fileName);
    } catch(err) {
      return buildResponse({ status: 'error', message: 'Step 1 (decode): ' + err.message });
    }

    // Step 2: save to Drive
    var driveFile, fileUrl;
    try {
      var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      driveFile  = folder.createFile(blob);
      fileUrl    = driveFile.getUrl();
    } catch(err) {
      return buildResponse({ status: 'error', message: 'Step 2 (Drive): ' + err.message });
    }

    // Best-effort: make the file link-shareable. PDFs may be locked briefly
    // by Drive's virus scanner — skip silently if it fails.
    try {
      driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch(e) { /* non-fatal */ }

    // Step 3: log to Sheet
    try {
      var sheet     = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
      var submitted = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
      sheet.appendRow([
        data.date,
        data.company,
        Number(data.amount),
        data.description,
        fileUrl,
        submitted,
      ]);
    } catch(err) {
      return buildResponse({ status: 'error', message: 'Step 3 (Sheet): ' + err.message });
    }

    return buildResponse({ status: 'ok' });

  } catch (err) {
    return buildResponse({ status: 'error', message: 'Parse error: ' + err.message });
  }
}

// Required for CORS preflight — Apps Script needs a doGet to respond to OPTIONS.
function doGet(e) {
  return buildResponse({ status: 'ok', message: 'Receipt Tracker backend is running.' });
}

function buildResponse(obj) {
  var output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
